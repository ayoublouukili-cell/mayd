import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const base='http://127.0.0.1:8082';
const pages=await(await fetch('http://127.0.0.1:9333/json')).json();const ws=new WebSocket(pages.find(p=>p.type==='page').webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);
let seq=0;const pending=new Map(),posts=[];
ws.onmessage=({data})=>{const m=JSON.parse(data);if(pending.has(m.id)){pending.get(m.id)(m);pending.delete(m.id);}if(m.method==='Network.requestWillBeSent'&&m.params.request.method==='POST')posts.push(m.params.request.url);};
function send(method,params={}){return new Promise((r,j)=>{const id=++seq;const timer=setTimeout(()=>j(Error('Timeout '+method)),30000);pending.set(id,m=>{clearTimeout(timer);m.error?j(Error(JSON.stringify(m.error))):r(m.result)});ws.send(JSON.stringify({id,method,params}));});}
async function js(expression){const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;}
const pause=ms=>new Promise(r=>setTimeout(r,ms));
async function wait(exp){for(let i=0;i<100;i++){if(await js(exp))return;await pause(100);}throw Error('Not ready: '+exp);}
async function nav(path){await wait(`typeof window.__TSR_ROUTER__?.navigate==='function'&&!!document.querySelector('.theme-control')&&Object.keys(document.querySelector('.theme-control')).some(k=>k.startsWith('__reactProps'))`);const target=new URL(path,base);await js(`window.__TSR_ROUTER__.navigate({to:${JSON.stringify(target.pathname)},search:${JSON.stringify(Object.fromEntries(target.searchParams))},resetScroll:true})`);await wait(`location.pathname===${JSON.stringify(target.pathname)}&&!!document.querySelector('h1')`);await pause(500);}
async function click(selector){await js(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});if(!e)throw Error('Missing '+${JSON.stringify(selector)});e.focus();e.click()})()`);await pause(200);}
async function locale(lang){await js(`(()=>{const e=document.querySelector('.language-control select');e.value='${lang}';e.dispatchEvent(new Event('change',{bubbles:true}))})()`);await wait(`document.documentElement.lang==='${lang}'`);await pause(200);}
async function mode(dark){if(await js(`document.documentElement.classList.contains('dark')`)!==dark)await click('.theme-control');await pause(150);}
async function shot(name){await pause(250);const r=await send('Page.captureScreenshot',{format:'png'});await fs.writeFile(`${process.env.TEMP}/${name}.png`,Buffer.from(r.data,'base64'));}
async function overflow(label){assert.ok(await js('document.documentElement.scrollWidth<=innerWidth+1'),label+' horizontal overflow');}
async function close(){await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape'});await wait(`!document.querySelector('[role="dialog"]')`);}
await send('Page.enable');await send('Runtime.enable');await send('Network.enable');
await js(`window.__reviewStart=true`);await send('Page.navigate',{url:base});
await wait(`typeof window.__reviewStart==='undefined'&&!!document.querySelector('.theme-control')&&Object.keys(document.querySelector('.theme-control')).some(k=>k.startsWith('__reactProps'))`);
const sectors=['nexplay-gaming','horizon-immobilier','eclat-studio','atlas-drive','maison-safran','forma-club'];
try{
 for(const lang of (process.env.FINAL_LANGUAGES??'fr,ar,en').split(','))for(const dark of [false,true]){
  await send('Emulation.setDeviceMetricsOverride',{width:320,height:900,deviceScaleFactor:1,mobile:true});await nav('/');await locale(lang);await mode(dark);
  await click('[aria-controls="mobile-menu"]');await wait(`document.querySelector('[aria-controls="mobile-menu"]').getAttribute('aria-expanded')==='true'`);await overflow('menu '+lang);await shot('final-menu-'+lang+'-'+dark);await click('[aria-controls="mobile-menu"]');
  await nav('/realisations');await overflow('gallery '+lang);await js(`document.querySelectorAll('[role="group"]')[1].querySelectorAll('button')[4].click()`);await pause(150);assert.ok(await js(`document.querySelector('.portfolio-grid').children.length>=5`));await js(`document.querySelectorAll('[role="group"]')[1].scrollIntoView({behavior:'instant',block:'start'})`);await pause(300);const offset=await js(`({top:document.querySelectorAll('[role="group"]')[1].getBoundingClientRect().top,bottom:document.querySelector('.site-header').getBoundingClientRect().bottom})`);assert.ok(offset.top>=offset.bottom-1,JSON.stringify(offset));await shot('final-gallery-'+lang+'-'+dark);
  await nav('/demonstrations/eclat-studio?platform=identite');await wait(`!!document.querySelector('.brand-system')`);await overflow('brand '+lang);await js(`document.querySelector('.demo-tabs').scrollIntoView({behavior:'instant',block:'start'})`);await shot('final-brand-'+lang+'-'+dark);
  assert.ok(await js(`(()=>{const list=document.querySelector('.demo-tabs').getBoundingClientRect();return [...document.querySelectorAll('[role="tab"]')].every(e=>{const r=e.getBoundingClientRect();return r.left>=list.left-1&&r.right<=list.right+1})})()`),'All five tabs visible at 320px');
  await click('[role="tab"][id$="trigger-instagram"]');await wait(`location.search==='?platform=instagram'&&!!document.querySelector('.social-phone')`);await overflow('Instagram '+lang);await js(`document.querySelector('.social-phone').scrollIntoView({behavior:'instant',block:'start'})`);await shot('final-instagram-'+lang+'-'+dark);await click('.social-site-link');await wait(`location.search==='?platform=site'&&!!document.querySelector('.direction-hero')`);await overflow('site '+lang);
  await locale(lang==='ar'?'en':'ar');assert.equal(await js('location.search'),'?platform=site');await locale(lang);
  await click('[role="tab"][id$="trigger-identite"]');await wait(`!!document.querySelector('.brand-system')`);await js(`document.querySelector('.brand-system').scrollIntoView({behavior:'instant',block:'start'})`);await pause(400);
  const bounds=await js(`[...document.querySelector('.brand-system').children].map(e=>{const r=e.getBoundingClientRect();return {left:r.left,right:r.right,width:r.width}})`);assert.ok(bounds.every(r=>r.left>=0&&r.right<=321),'Brand system clipped: '+JSON.stringify(bounds));await shot('final-brand-fixed-'+lang+'-'+dark);
  if(process.env.FINAL_VISUAL_ONLY==='1'){
    await js(`window.__reloadCheck=true`);await send('Page.reload',{ignoreCache:true});await wait(`typeof window.__reloadCheck==='undefined'&&!!document.querySelector('.brand-system')&&!!document.querySelector('[role="tab"][id$="trigger-identite"][data-state="active"]')&&Object.keys(document.querySelector('.theme-control')).some(k=>k.startsWith('__reactProps'))`);assert.equal(await js('document.documentElement.lang'),lang);assert.equal(await js(`document.documentElement.classList.contains('dark')`),dark);assert.equal(await js('location.search'),'?platform=identite');console.log('OK final visual + persisted tab/language/theme',lang,dark);continue;
  }
  await send('Emulation.setDeviceMetricsOverride',{width:390,height:950,deviceScaleFactor:1,mobile:true});
  for(const sector of sectors){
   await nav('/demonstrations/'+sector+'/site');await wait(`!!document.querySelector('.demo-form')`);await overflow(sector+' full '+lang);
   assert.equal(await js(`document.querySelector('.demo-form').checkValidity()`),false);
   await js(`(()=>{const f=document.querySelector('.demo-form');f.elements.name.value='Alex Demo';f.elements.email.value='alex@example.com';f.elements.choice.selectedIndex=1;f.elements.date.value='2027-12-20';if(f.elements.end)f.elements.end.value='2027-12-22';if(f.elements.time)f.elements.time.selectedIndex=1;for(const e of f.elements)e.dispatchEvent(new Event('input',{bubbles:true}));f.requestSubmit()})()`);await wait(`!!document.querySelector('.demo-form-success')`);
   assert.ok((await js(`document.querySelector('.demo-form-success').textContent`)).includes({fr:'aucune demande réelle',ar:'لم يتم إرسال أي طلب حقيقي',en:'no real request'}[lang]));
   if(sector==='horizon-immobilier'){await click('.property-search-choice:nth-of-type(2)');await pause(200);assert.equal(await js(`document.querySelectorAll('.demo-catalog-card').length`),2);assert.equal(await js(`document.querySelectorAll('.demo-filters select')[1].value`),'Location');}
   if(sector==='maison-safran'){await click('.table-heading .demo-primary');await pause(400);assert.ok(await js(`document.querySelector('.restaurant-menu').getBoundingClientRect().top>=0`));}
   await js(`document.querySelector('.direction-hero').scrollIntoView({behavior:'instant',block:'start'})`);if(lang==='ar'&&dark)await shot('final-site-ar-'+sector);
   await click('.demo-photo');await wait(`!!document.querySelector('[role="dialog"]')`);const src=await js(`document.querySelector('[role="dialog"] img').src`);await click('[role="dialog"] button[aria-label]:last-child');assert.notEqual(await js(`document.querySelector('[role="dialog"] img').src`),src);await close();
   await click('.demo-return a[href*="/demonstrations/"]');await wait(`location.pathname==='/demonstrations/${sector}'`);
  }
  await nav('/realisations/demo-cafe-de-quartier');assert.ok(!(await js('document.body.innerText')).includes('Visuel de présentation du concept')||lang==='fr');
  console.log('OK final 320/390px',lang,dark,'tabs, menu, anchor offsets, six full sites/forms/galleries, returns');
 }
 assert.equal(posts.length,0);console.log('PASS final interaction checks');
}catch(error){await shot('final-portfolio-error');console.log(await js('document.body.innerText.slice(0,2200)'));throw error;}finally{ws.close();}
