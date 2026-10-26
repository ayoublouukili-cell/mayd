import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const base=process.env.SHOWROOM_URL??'http://127.0.0.1:8082';
const pages=await(await fetch('http://127.0.0.1:9333/json')).json();
const ws=new WebSocket(pages.find(p=>p.type==='page').webSocketDebuggerUrl);
await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j;});
let id=0;const pending=new Map(),errors=[],posts=[];
ws.onmessage=({data})=>{const m=JSON.parse(data);if(pending.has(m.id)){pending.get(m.id)(m);pending.delete(m.id);}if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.exception?.description??m.params.exceptionDetails.text);if(m.method==='Runtime.consoleAPICalled'&&m.params.type==='error'&&m.params.args.some(a=>/hydration|did not match|server rendered/i.test(a.value??'')))errors.push(JSON.stringify(m.params.args));if(m.method==='Network.requestWillBeSent'&&m.params.request.method==='POST')posts.push(m.params.request.url);};
function send(method,params={}){return new Promise((r,j)=>{const n=++id;const timer=setTimeout(()=>j(Error('Timeout '+method)),30000);pending.set(n,m=>{clearTimeout(timer);m.error?j(Error(JSON.stringify(m.error))):r(m.result);});ws.send(JSON.stringify({id:n,method,params}));});}
async function js(expression){const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;}
const pause=ms=>new Promise(r=>setTimeout(r,ms));
async function wait(exp){for(let i=0;i<120;i++){if(await js(exp))return;await pause(150);}throw Error('Not ready: '+exp);}
async function ready(selector){await wait(`!!document.querySelector(${JSON.stringify(selector)})&&Object.keys(document.querySelector(${JSON.stringify(selector)})).some(k=>k.startsWith('__reactFiber'))`);}
async function nav(path,selector='h1'){
 const target=new URL(path,base);
 if(await js(`typeof window.__TSR_ROUTER__?.navigate==='function'`)) {
   await js(`window.__TSR_ROUTER__.navigate({to:${JSON.stringify(target.pathname)},search:${JSON.stringify(Object.fromEntries(target.searchParams))},resetScroll:true})`);
 } else await send('Page.navigate',{url:base+path});
 await wait(`location.pathname===${JSON.stringify(target.pathname)}&&location.search===${JSON.stringify(target.search)}`);
 await ready(selector);await pause(150);
}
async function click(selector){await js(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});if(!e)throw Error('Missing '+${JSON.stringify(selector)});e.focus();e.click();})()`);await pause(200);}
async function locale(lang){await js(`(()=>{const e=document.querySelector('.language-control select');e.value='${lang}';e.dispatchEvent(new Event('change',{bubbles:true}));})()`);await wait(`document.documentElement.lang==='${lang}'`);await pause(350);}
async function theme(dark){if(await js(`document.documentElement.classList.contains('dark')`)!==dark)await click('.theme-control');await wait(`document.documentElement.classList.contains('dark')===${dark}`);}
async function overflow(label){assert.ok(await js('document.documentElement.scrollWidth<=innerWidth+1'),label+' overflow');}
async function shot(name){await pause(300);const r=await send('Page.captureScreenshot',{format:'png'});await fs.writeFile(`${process.env.TEMP}/${name}.png`,Buffer.from(r.data,'base64'));}
async function images(){await js(`Promise.all([...document.querySelectorAll('main img')].map(i=>{i.loading='eager';return i.decode().catch(()=>null)}))`);assert.deepEqual(await js(`[...document.querySelectorAll('main img')].filter(i=>!i.naturalWidth).map(i=>i.src)`),[]);}
await send('Page.enable');await send('Runtime.enable');await send('Network.enable');
const sectors=['nexplay-gaming','horizon-immobilier','eclat-studio','atlas-drive','maison-safran','forma-club'];
const untranslated = new Map();
async function auditCopy(label) {
 const missing = await js(`(async()=>{
  const {messages}=await import('/src/lib/i18n/catalog.ts');
  const {DEMOS}=await import('/src/lib/demonstrations.ts');
  const allowed=new Set([...DEMOS.flatMap(d=>[d.name,d.handle,d.initials]),'MAYD DIGITAL','MAYD','DIGITAL','Mehdi','Ayoub','Instagram','Facebook','TikTok','Site web','Geist','Instrument Serif','Noto Sans Arabic','camille@example.com','Portfolio']);
  let e=document.querySelector('h1');let fiber=e[Object.keys(e).find(k=>k.startsWith('__reactFiber'))];while(fiber.return)fiber=fiber.return;fiber=fiber.stateNode.current;
  const stack=[fiber], found=new Set();while(stack.length){const f=stack.pop();if(f.type?.name==='Text'&&typeof f.memoizedProps?.value==='string'){const text=f.memoizedProps.value.replace(/\\s+/g,' ').trim();if(/[A-Za-zÀ-ž]/.test(text)&&!messages[text]&&!allowed.has(text))found.add(text);}if(f.child)stack.push(f.child);if(f.sibling)stack.push(f.sibling);}
  return [...found];})()`);
 for(const text of missing)if(!untranslated.has(text))untranslated.set(text,label);
}
try {
 await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});await nav('/');await locale('fr');
 const dynamic=await js(`(()=>{let f=document.querySelector('.portfolio-grid');let fiber=f[Object.keys(f).find(k=>k.startsWith('__reactFiber'))];while(fiber&&!Array.isArray(fiber.memoizedProps?.projects))fiber=fiber.return;return fiber?.memoizedProps.projects;})()`);
 await fs.writeFile(`${process.env.TEMP}/mayd-portfolio-data-audit.json`,JSON.stringify(dynamic,null,2));console.log('Existing projects:',dynamic?.map(p=>({slug:p.slug,title:p.title,categories:p.categories,is_demo:p.is_demo})));
 if(process.env.PORTFOLIO_AUDIT_ONLY==='1'){
   const missing=await js(`(async()=>{const {messages}=await import('/src/lib/i18n/catalog.ts');const data=${JSON.stringify(dynamic)};return data.flatMap(p=>['title','client_category','short_description','description','challenge','solution','result'].filter(k=>p[k]&&!messages[p[k]]).map(k=>({slug:p.slug,field:k,value:p[k]})));})()`);console.log('Missing authored translations:',JSON.stringify(missing,null,2));
 } else {
 for(const lang of ['fr','ar','en'])for(const dark of [false,true]){
  await locale(lang);await theme(dark);let counts;
  for(const path of ['/','/realisations']){
   await nav(path);await images();await auditCopy(path);const gallery=await js(`document.querySelector('.portfolio-grid').children.length`);assert.ok(gallery>=10);const links=await js(`[...document.querySelectorAll('.portfolio-grid>div>a')].map(a=>a.href)`);assert.equal(new Set(links).size,links.length);
   const found=[];for(const [index,category] of ['all','sites-web','instagram','facebook','tiktok','identite-visuelle'].entries()){
    await js(`document.querySelectorAll('[aria-label] button').length`);
    await js(`(()=>{const groups=[...document.querySelectorAll('[role="group"]')];const group=groups.find(g=>g.querySelectorAll('button').length===6);const e=group.querySelectorAll('button')[${index}];if(e.disabled)throw Error('Disabled category');e.focus();e.click();})()`);await pause(150);
    const n=await js(`document.querySelector('.portfolio-grid').children.length`);assert.ok(n>=5);found.push(n);
    const active=await js(`document.querySelectorAll('.portfolio-grid a[href*="/demonstrations/"]').length`);assert.equal(active,6);
    if(category!=='all'){const expected=category==='sites-web'?'site':category==='identite-visuelle'?'identite':category;assert.ok(await js(`[...document.querySelectorAll('.portfolio-grid a[href*="/demonstrations/"]')].every(a=>new URL(a.href).searchParams.get('platform')==='${expected}')`));}
   }
   if(counts)assert.deepEqual(found,counts);counts=found;
   await locale(lang==='fr'?'en':'fr');assert.ok(await js(`document.querySelectorAll('[role="group"]')[1].querySelectorAll('button')[5].getAttribute('aria-pressed')==='true'`));await locale(lang);await overflow(path+' '+lang+' '+dark);
   if(path==='/realisations'){await js(`document.querySelector('.portfolio-grid').scrollIntoView({behavior:'instant',block:'start'})`);await shot('portfolio-'+lang+'-'+dark);}
  }
  console.log('Gallery counts',lang,dark,counts);
  for(const width of [1440,390]){
   await send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width<768});
   for(const sector of sectors)for(const platform of ['site','instagram','facebook','tiktok','identite']){
    await nav('/demonstrations/'+sector+'?platform='+platform,'[role="tab"]');await wait(`document.querySelector('[role="tab"][data-state="active"]')?.getAttribute('id').endsWith('trigger-${platform}')`);await images();await auditCopy(sector+' '+platform);await overflow(sector+' '+platform+' '+lang+' '+dark+' '+width);
    if(platform==='site'&&width===1440&&lang==='fr'&&!dark){await js(`document.querySelector('.direction-hero').scrollIntoView({behavior:'instant',block:'start'})`);await shot('direction-'+sector);}
    if(platform==='identite'){assert.equal(await js(`document.querySelectorAll('.brand-applications button').length`),3);if(sector==='eclat-studio'&&width===390){await click('.brand-applications button');await wait(`!!document.querySelector('[role="dialog"]')`);await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape'});await wait(`!document.querySelector('[role="dialog"]')`);}}
    if(platform==='tiktok'){assert.equal(await js(`document.querySelectorAll('.demo-photo').length`),6);assert.equal(await js(`document.querySelectorAll('video').length`),0);}
    if(platform==='site'&&sector==='atlas-drive'){
     await click('.compare-toggle');await click('.demo-catalog-card:nth-child(2) .compare-toggle');assert.equal(await js(`document.querySelectorAll('.vehicle-comparison article').length`),2);
     await js(`(()=>{const e=document.querySelector('.demo-filters select');e.selectedIndex=1;e.dispatchEvent(new Event('change',{bubbles:true}));})()`);await pause(100);assert.ok(await js(`document.querySelectorAll('.demo-catalog-card').length<4`));
    }
    if(platform==='site'&&width===390&&sector==='nexplay-gaming'){
     await click('.demo-form button[type="submit"]');assert.equal(await js(`document.querySelector('.demo-form').checkValidity()`),false);
     await js(`(()=>{const f=document.querySelector('.demo-form');f.elements.name.value='Alex Demo';f.elements.email.value='alex@example.com';f.elements.choice.selectedIndex=1;f.elements.date.value='2027-12-20';f.elements.time.selectedIndex=1;for(const e of f.elements)e.dispatchEvent(new Event('input',{bubbles:true}));f.requestSubmit()})()`);await wait(`!!document.querySelector('.demo-form-success')`);
    }
   }
  }
  for(const p of dynamic){await nav('/realisations/'+p.slug);await auditCopy(p.slug);await overflow(p.slug+' '+lang);}
  await send('Page.reload',{ignoreCache:true});await ready('h1');assert.equal(await js('document.documentElement.lang'),lang);assert.equal(await js(`document.documentElement.classList.contains('dark')`),dark);
  await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});console.log('OK 30 detail views desktop/mobile',lang,dark);
 }
 await fs.writeFile(`${process.env.TEMP}/mayd-portfolio-translation-audit.json`,JSON.stringify([...untranslated].map(([text,page])=>({text,page})),null,2));
 console.log('Uncatalogued text audit:',JSON.stringify([...untranslated]));
 assert.equal(posts.length,0,'No writes');assert.deepEqual(errors,[]);console.log('PASS portfolio browser checks');
 }
} catch(error){await shot('portfolio-error');console.log(await js('document.body.innerText.slice(0,1800)'));console.log(errors);throw error;} finally {ws.close();}
