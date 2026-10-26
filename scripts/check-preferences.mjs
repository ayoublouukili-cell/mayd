import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const base=process.env.SHOWROOM_URL??'http://127.0.0.1:8082';
const tabs=await(await fetch('http://127.0.0.1:9333/json')).json();
const ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject;});
let seq=0;const pending=new Map(),errors=[],posts=[];
ws.onmessage=({data})=>{const m=JSON.parse(data);if(pending.has(m.id)){pending.get(m.id)(m);pending.delete(m.id);}if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.exception?.description??m.params.exceptionDetails.text);if(m.method==='Runtime.consoleAPICalled'&&m.params.type==='error'){const text=m.params.args.map(a=>a.value??a.description??'').join(' ');if(/hydrat|server rendered|did not match|Rendered more hooks/i.test(text))errors.push(text);}if(m.method==='Network.requestWillBeSent'&&m.params.request.method==='POST')posts.push(m.params.request.url);};
function send(method,params={}){return new Promise((resolve,reject)=>{const id=++seq;const timer=setTimeout(()=>reject(Error('Timeout '+method)),30000);pending.set(id,m=>{clearTimeout(timer);m.error?reject(Error(JSON.stringify(m.error))):resolve(m.result);});ws.send(JSON.stringify({id,method,params}));});}
async function js(expression){const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;}
const pause=ms=>new Promise(r=>setTimeout(r,ms));
async function wait(expression){for(let i=0;i<120;i++){if(await js(expression))return;await pause(200);}throw Error('Not ready: '+expression);}
async function ready(selector){await wait(`!!document.querySelector(${JSON.stringify(selector)})&&Object.keys(document.querySelector(${JSON.stringify(selector)})).some(k=>k.startsWith('__reactFiber'))`);}
async function navigate(path,selector='h1,h2'){await send('Page.navigate',{url:base+path});await wait(`location.pathname===${JSON.stringify(path)}`);await ready(selector);await pause(250);}
async function shot(name){await pause(300);const r=await send('Page.captureScreenshot',{format:'png'});await fs.writeFile(process.env.TEMP+'/'+name+'.png',Buffer.from(r.data,'base64'));}
async function click(selector){await js(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});if(!e)throw Error('Missing control');e.focus();e.click();})()`);await pause(120);}
async function language(value){await js(`(()=>{const s=document.querySelector('.language-control select');s.value=${JSON.stringify(value)};s.dispatchEvent(new Event('change',{bubbles:true}));})()`);await wait(`document.documentElement.lang===${JSON.stringify(value)}`);await pause(500);}
async function theme(value){const dark=value==='dark';if(await js(`document.documentElement.classList.contains('dark')`)===dark){await click('.theme-control');await wait(`document.documentElement.classList.contains('dark')!==${dark}`);}await click('.theme-control');await wait(`document.documentElement.classList.contains('dark')===${dark}`);await wait(`localStorage.getItem('mayd-theme')===${JSON.stringify(value)}`);}
async function noOverflow(label){const size=await js('({width:innerWidth,scroll:document.documentElement.scrollWidth})');assert.ok(size.scroll<=size.width+1,label+' '+JSON.stringify(size));}
async function gallery(){await click('.demo-photo');await wait(`!!document.querySelector('[role="dialog"]')`);assert.ok(await js(`getComputedStyle(document.querySelector('[role="dialog"]')).backgroundColor!=='rgba(0, 0, 0, 0)'`));await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape'});await wait(`!document.querySelector('[role="dialog"]')`);await pause(200);}
async function simulatedForm(language){
 assert.equal(await js(`document.querySelector('#apercu-name').form.checkValidity()`),false);
 const message=await js(`document.querySelector('#apercu-name').validationMessage`);assert.ok(message.includes({fr:'obligatoire',en:'required',ar:'مطلوب'}[language]),message);
 await js(`(()=>{const f=document.querySelector('#apercu-name').form;f.elements.name.value='Alex Demo';f.elements.email.value='alex@example.com';f.elements.choice.selectedIndex=1;f.elements.date.value='2027-12-20';f.elements.time.selectedIndex=1;for(const e of f.elements)e.dispatchEvent(new Event('input',{bubbles:true}));f.requestSubmit();})()`);
 await wait(`!!document.querySelector('.demo-form-success')`);const text=await js(`document.querySelector('.demo-form-success').textContent`);assert.ok(text.includes({fr:'aucune demande réelle',en:'no real request',ar:'لم يتم إرسال أي طلب حقيقي'}[language]),text);
}
const sectors=['nexplay-gaming','horizon-immobilier','eclat-studio','atlas-drive','maison-safran','forma-club'];
try{
 await send('Page.enable');await send('Runtime.enable');await send('Network.enable');await send('Network.clearBrowserCookies');await send('Storage.clearDataForOrigin',{origin:base,storageTypes:'local_storage'});
 await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-color-scheme',value:'dark'}]});await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
 await send('Page.addScriptToEvaluateOnNewDocument',{source:`window.__themeFrames=[];function sample(){if(document.body?.querySelector('main')&&window.__themeFrames.length<12)window.__themeFrames.push(document.documentElement.classList.contains('dark'));if(window.__themeFrames.length<12)requestAnimationFrame(sample)}requestAnimationFrame(sample);`});
 await navigate('/');assert.equal(await js('document.documentElement.lang'),'fr');assert.equal(await js(`document.documentElement.classList.contains('dark')`),true);await pause(400);assert.ok((await js('window.__themeFrames')).every(Boolean),'First paint respects system dark');console.log('Default FR + system theme: OK');
 if(process.env.PREFERENCES_SMOKE==='1'){
  for(const lang of ['ar','en','fr'])for(const mode of ['light','dark']){
   await language(lang);await theme(mode);
   for(const width of [320,390]){
    await send('Emulation.setDeviceMetricsOverride',{width,height:844,deviceScaleFactor:1,mobile:true});
    for(const path of ['/','/services','/realisations','/a-propos','/contact','/demonstrations','/realisations/demo-cafe-de-quartier']){
     await navigate(path);await noOverflow(path+' '+lang+' '+mode+' '+width);
     if(path==='/contact'){await click('form button[type="submit"]');await wait(`!!document.getElementById('cf-name-error')`);const message=await js(`document.getElementById('cf-name-error').textContent`);assert.ok(message.includes({fr:'Indiquez',en:'Please',ar:'يرجى'}[lang]),message);}
     if(width===320&&lang==='ar'&&mode==='dark'&&path==='/')await shot('mayd-ar-dark-320');
    }
   }
   console.log('OK mobile main pages + real project + contact validation',lang,mode,'320/390');
  }
 }else{
 for(const lang of ['ar','en','fr'])for(const mode of ['light','dark']){
  await language(lang);await theme(mode);
  for(const path of ['/','/services','/realisations','/a-propos','/contact','/demonstrations']){
   await navigate(path);assert.equal(await js('document.documentElement.lang'),lang);assert.equal(await js('document.documentElement.dir'),lang==='ar'?'rtl':'ltr');assert.equal(await js(`document.documentElement.classList.contains('dark')`),mode==='dark');await noOverflow(path+' '+lang+' '+mode);
   const title=await js('document.title');if(lang==='ar'&&path!=='/')assert.ok(/[\u0600-\u06ff]/.test(title),title);
   if(path==='/realisations'){const buttons=await js(`document.querySelectorAll('main [role="group"] button').length`);assert.ok(buttons>=8);}
  }
  await send('Emulation.setDeviceMetricsOverride',{width:390,height:1000,deviceScaleFactor:1,mobile:true});await navigate('/');await noOverflow('mobile header '+lang+' '+mode);await shot('mayd-'+lang+'-'+mode+'-home');
  await click('[aria-controls="mobile-menu"]');await wait(`document.querySelector('[aria-controls="mobile-menu"]').getAttribute('aria-expanded')==='true'`);await pause(500);assert.ok(await js(`document.getElementById('mobile-menu').getBoundingClientRect().height>800`));await noOverflow('menu');await shot('mayd-'+lang+'-'+mode+'-menu');await click('[aria-controls="mobile-menu"]');
  for(const sector of sectors){
   await navigate('/demonstrations/'+sector,'[role="tab"]');
   for(const platform of ['instagram','facebook','tiktok','site']){
    await click(`[role="tab"][id$="trigger-${platform}"]`);await wait(`!!document.querySelector('[role="tabpanel"][data-state="active"]')`);await noOverflow(sector+' '+platform+' '+lang+' '+mode);assert.ok(await js(`document.querySelectorAll('[role="tabpanel"][data-state="active"] .demo-photo').length>=6`));
    if(sector==='nexplay-gaming'){
     await gallery();if(platform==='site')await simulatedForm(lang);
    }
    if(sector==='horizon-immobilier'&&platform==='site'){
     await js(`(()=>{const s=document.querySelector('.demo-filters select');s.selectedIndex=1;s.dispatchEvent(new Event('change',{bubbles:true}));})()`);await pause(150);assert.ok(await js(`document.querySelectorAll('.demo-catalog-card').length<4`));
    }
   }
   if(sector==='maison-safran'){await js(`window.scrollTo({top:0,behavior:'instant'})`);await shot('mayd-'+lang+'-'+mode+'-demo');}
  }
  await navigate('/demonstrations/forma-club/site');await noOverflow('full site '+lang+' '+mode);assert.equal(await js(`document.querySelector('.demo-return .language-control select').value`),lang);
  await send('Page.reload',{ignoreCache:true});await ready('h1');assert.equal(await js('document.documentElement.lang'),lang);assert.equal(await js(`document.documentElement.classList.contains('dark')`),mode==='dark');assert.equal(await js(`localStorage.getItem('mayd-language')`),lang);
  await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});await navigate('/realisations');await noOverflow('desktop portfolio');await shot('mayd-'+lang+'-'+mode+'-portfolio');
  console.log('OK',lang,mode,'main pages, 24 demo views, mobile menu, gallery, form, filters, refresh');
 }
 // Changing language keeps the active page, tab and form input.
 await navigate('/demonstrations/nexplay-gaming','[role="tab"]');await click('[id$="trigger-site"]');await js(`document.querySelector('#apercu-name').value='Alex Demo'`);await language('ar');await wait(`document.querySelector('[id$="trigger-site"]').getAttribute('aria-selected')==='true'`);assert.equal(await js('location.pathname'),'/demonstrations/nexplay-gaming');assert.equal(await js(`document.querySelector('#apercu-name').value`),'Alex Demo');console.log('Page, tab and input preserved on language switch: OK');
 }
 assert.equal(posts.length,0,'No real form submission');assert.equal(errors.length,0,errors.join('\n'));
 console.log('PASS: all six locale/theme combinations.');
}catch(error){console.log(await js('document.body.innerText.slice(0,1800)'));console.log('Browser errors',errors);await shot('mayd-preferences-error');throw error;}finally{try{await send('Browser.close');}catch{}ws.close();}
