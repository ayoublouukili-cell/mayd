import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const base=process.env.SHOWROOM_URL??'http://127.0.0.1:8082';
const tabs=await(await fetch('http://127.0.0.1:9333/json')).json();
const ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);
await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject;});
let seq=0;const pending=new Map();const errors=[];const writes=[];
ws.onmessage=({data})=>{const m=JSON.parse(data);if(m.id&&pending.has(m.id)){pending.get(m.id)(m);pending.delete(m.id);}if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.exception?.description??JSON.stringify(m.params.exceptionDetails));if(m.method==='Network.requestWillBeSent'&&m.params.request.method==='POST')writes.push(m.params.request.url);};
function send(method,params={}){return new Promise((resolve,reject)=>{const id=++seq;const timer=setTimeout(()=>reject(new Error('Timeout '+method)),25000);pending.set(id,m=>{clearTimeout(timer);m.error?reject(new Error(JSON.stringify(m.error))):resolve(m.result);});ws.send(JSON.stringify({id,method,params}));});}
async function js(expression){const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.text+' '+JSON.stringify(r.exceptionDetails.exception));return r.result.value;}
async function wait(expression){for(let i=0;i<60;i++){if(await js(expression))return;await new Promise(r=>setTimeout(r,200));}throw Error('Not ready: '+expression);}
async function navigate(path,selector){await send('Page.navigate',{url:base+path});await wait(`location.pathname===${JSON.stringify(path)}&&!!document.querySelector(${JSON.stringify(selector)})`);await wait(`Object.keys(document.querySelector(${JSON.stringify(selector)})??{}).some(k=>k.startsWith('__reactFiber'))`);await new Promise(r=>setTimeout(r,400));}
async function screenshot(name){const r=await send('Page.captureScreenshot',{format:'png'});await fs.writeFile(process.env.TEMP+'/'+name+'.png',Buffer.from(r.data,'base64'));}
async function click(selector){assert.ok(await js(`!!document.querySelector(${JSON.stringify(selector)})`),selector);await js(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});e.focus();e.click();})()`);await new Promise(r=>setTimeout(r,250));}
async function gallery(selector){await click(selector);await wait(`!!document.querySelector('[role="dialog"]')`);await click('[aria-label="Image suivante"]');await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape'});await wait(`!document.querySelector('[role="dialog"]')`);}
async function form(prefix,cars){
 assert.equal(await js(`document.querySelector('#${prefix}-name').form.checkValidity()`),false);
 await js(`(()=>{const f=document.querySelector('#${prefix}-name').form;f.elements.name.value='Camille Démo';f.elements.email.value='camille@example.com';f.elements.choice.selectedIndex=1;f.elements.date.value='2027-12-20';${cars?"f.elements.end.value='2027-12-19';":"f.elements.time.selectedIndex=1;"}f.requestSubmit();})()`);
 if(cars){await wait(`!!document.querySelector('.demo-form-error')`);await js(`(()=>{const f=document.querySelector('#${prefix}-name').form;f.elements.end.value='2027-12-22';f.requestSubmit();})()`);}
 await wait(`document.querySelector('.demo-form-success')?.textContent.includes('aucune demande réelle')`);
}
try{
 await send('Runtime.enable');await send('Network.enable');
const sectors=['nexplay-gaming','horizon-immobilier','eclat-studio','atlas-drive','maison-safran','forma-club'];
 for(const width of [1440,390]){
  await send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width<500});
  await navigate('/demonstrations','.showroom-card');
  assert.equal(await js(`document.querySelectorAll('.showroom-card').length`),6);
  await screenshot('mayd-showroom-'+width);
  for(const sector of sectors){
   const path='/demonstrations/'+sector;
   await navigate(path,'[role="tab"]');
   await wait(`!!document.querySelector('.social-phone')`);
   for(const platform of ['instagram','facebook','tiktok','site']){
    await click(`[role="tab"][data-state]${platform==='site'?'[data-platform="site"]':`[id$="trigger-${platform}"]`}`);
    const count=await js(`document.querySelectorAll('[role="tabpanel"][data-state="active"] .demo-photo').length`);assert.ok(count>=6,sector+' '+platform+' six images');
    assert.ok(await js(`document.documentElement.scrollWidth<=innerWidth`),'Overflow '+sector+' '+platform+' '+width);
    if(platform==='instagram'){
     await gallery('.social-phone .demo-photo');await click('.social-stories button');await wait(`!!document.querySelector('[role="dialog"]')`);await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape'});
     if(width===1440)await screenshot('mayd-'+sector+'-instagram');
    }
    if(platform==='facebook'){await gallery('.facebook-preview .demo-photo');}
    if(platform==='tiktok'){assert.ok(await js(`document.body.textContent.includes('aucune lecture n’est simulée')`));await gallery('.social-phone .demo-photo');}
    if(platform==='site'){
     if(sector==='horizon-immobilier'||sector==='atlas-drive'){
      await js(`(()=>{const s=document.querySelector('[aria-label="Filtrer par type"]');s.selectedIndex=1;s.dispatchEvent(new Event('change',{bubbles:true}));})()`);await new Promise(r=>setTimeout(r,200));assert.ok(await js(`document.querySelectorAll('.demo-catalog-card').length<4`));
      await click('.demo-filters button');assert.equal(await js(`document.querySelectorAll('.demo-catalog-card').length`),4);
      await js(`(()=>{const s=document.querySelectorAll('.demo-filters select')[1];s.selectedIndex=1;s.dispatchEvent(new Event('change',{bubbles:true}));})()`);await new Promise(r=>setTimeout(r,200));assert.equal(await js(`document.querySelectorAll('.demo-catalog-card').length`),2);await click('.demo-filters button');
      await click('.demo-catalog-copy button');await wait(`!!document.querySelector('[role="dialog"]')`);await click('[role="dialog"] a[href="#apercu-reservation"]');await wait(`!document.querySelector('[role="dialog"]')`);
     }
     await gallery('.demo-website .demo-photo');await form('apercu',sector==='atlas-drive');
     await js('window.scrollTo(0,0)');await screenshot('mayd-'+sector+'-site-'+width);
    }
    console.log('OK',width,sector,platform);
   }
  }
 }
 for(const sector of sectors){await navigate('/demonstrations/'+sector+'/site','.demo-website');await form('site',sector==='atlas-drive');assert.ok(await js(`!!document.querySelector('.demo-return a[href="/demonstrations/${sector}"]')`));assert.ok(await js(`!!document.querySelector('a[href="/contact"]')`));await click(`.demo-return a[href="/demonstrations/${sector}"]`);await wait(`!!document.querySelector('[role="tab"]')`);console.log('OK full page and return',sector);}
 for(const width of [1440,390]){
  await send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width<500});
  await navigate('/realisations','[aria-label="Origine des projets"]');
  const existing=await js(`Array.from(document.querySelectorAll('a[aria-label^="Voir le projet"]')).map(a=>a.getAttribute('href'))`);
  assert.equal(await js(`document.querySelectorAll('a[aria-label^="Explorer le projet de démonstration"]').length`),6);
  for(const source of ['Démonstrations','Projets clients','Tous']){
   await js(`Array.from(document.querySelectorAll('[aria-label="Origine des projets"] button')).find(b=>b.textContent===${JSON.stringify(source)}).click()`);await new Promise(r=>setTimeout(r,250));
   if(source==='Projets clients'){assert.equal(await js(`document.querySelectorAll('a[aria-label^="Explorer le projet de démonstration"]').length`),0);assert.equal(await js(`Array.from(document.querySelectorAll('a[aria-label^="Voir le projet"]')).some(a=>a.textContent.includes('Projet de démonstration'))`),false);}
   else assert.equal(await js(`document.querySelectorAll('a[aria-label^="Explorer le projet de démonstration"]').length`),6);
  }
  for(const platform of ['Sites web','Instagram','Facebook','TikTok']){
   await js(`Array.from(document.querySelectorAll('[aria-label="Filtrer les réalisations par plateforme"] button')).find(b=>b.textContent===${JSON.stringify(platform)}).click()`);await new Promise(r=>setTimeout(r,200));assert.equal(await js(`document.querySelectorAll('a[aria-label^="Explorer le projet de démonstration"]').length`),6);
  }
  await js(`document.querySelector('[aria-label="Filtrer les réalisations par plateforme"] button').click()`);await new Promise(r=>setTimeout(r,250));
  assert.deepEqual(await js(`Array.from(document.querySelectorAll('a[aria-label^="Voir le projet"]')).map(a=>a.getAttribute('href'))`),existing);
  assert.ok(await js(`document.documentElement.scrollWidth<=innerWidth`));await screenshot('mayd-portfolio-'+width);
  console.log('OK portfolio filters and preserved projects',width,existing.length);
 }
 for(const path of ['/','/a-propos','/realisations','/demonstrations','/demonstrations/maison-safran','/demonstrations/forma-club/site']){
  await navigate(path,'img[src^="/mayd-logo.png"]');
  await wait(`Array.from(document.querySelectorAll('img[src^="/mayd-logo.png"]')).every(i=>i.complete&&i.naturalWidth===2172)`);
  assert.equal(await js(`new Set(Array.from(document.querySelectorAll('img[alt="MAYD DIGITAL"]')).map(i=>i.getAttribute('src'))).size`),1);
  if(path==='/'){assert.ok(await js(`document.querySelector('header a[href="/"] img')!==null`));await send('Page.reload',{ignoreCache:true});await wait(`!!document.querySelector('header img')&&document.querySelector('header img').naturalWidth===2172`);await js(`window.scrollTo({top:0,behavior:'instant'})`);await new Promise(r=>setTimeout(r,1000));await screenshot('mayd-final-logo-home');}
  console.log('OK shared logo',path);
 }
 await navigate('/','h1');assert.ok(await js(`!!document.querySelector('a[href="/demonstrations"]')`));await js(`document.getElementById('demonstrations').scrollIntoView()`);await screenshot('mayd-home-showroom-mobile');
 assert.equal(writes.length,0,'No POST from simulated forms');assert.equal(errors.length,0,'Browser exceptions: '+errors.join(','));
 console.log('PASS: 48 platform/viewport combinations, 6 full websites, filters, dialogs, forms, zero POST.');
}catch(error){console.log(await js('document.body.innerText.slice(0,3000)'));console.log('Browser errors',errors);await screenshot('mayd-review-error');throw error;}finally{await send('Browser.close');ws.close();}

