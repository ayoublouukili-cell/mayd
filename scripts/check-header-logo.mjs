import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const base='http://127.0.0.1:8082';
const pages=await (await fetch('http://127.0.0.1:9333/json')).json();
const ws=new WebSocket(pages.find(p=>p.type==='page').webSocketDebuggerUrl);
await new Promise(r=>ws.onopen=r);
let id=0;const pending=new Map();
ws.onmessage=({data})=>{const m=JSON.parse(data);if(pending.has(m.id)){pending.get(m.id)(m);pending.delete(m.id);}};
function send(method,params={}){return new Promise((resolve,reject)=>{const n=++id;pending.set(n,m=>m.error?reject(Error(JSON.stringify(m.error))):resolve(m.result));ws.send(JSON.stringify({id:n,method,params}));});}
async function js(expression){const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;}
const pause=ms=>new Promise(r=>setTimeout(r,ms));
async function ready(){for(let i=0;i<100;i++){if(await js(`!!document.querySelector('.site-header .theme-control')&&Object.keys(document.querySelector('.site-header .theme-control')).some(k=>k.startsWith('__reactFiber'))`))return;await pause(200);}throw Error('Header not ready');}
await send('Page.enable');await send('Runtime.enable');
try {
 for(const width of [1440,390,320]){
  await send('Emulation.setDeviceMetricsOverride',{width,height:950,deviceScaleFactor:1,mobile:width<768});
  await send('Page.navigate',{url:base});await ready();
  let previous;
  for(const theme of ['light','dark']){
   if(await js(`document.documentElement.classList.contains('dark')`) !== (theme==='dark'))await js(`document.querySelector('.theme-control').click()`);
   await pause(600);
   const state=await js(`(async()=>{const root=document.querySelector('.site-header .official-logo');const images=[...root.querySelectorAll('img')];await Promise.all(images.map(i=>i.decode()));const visible=images.filter(i=>getComputedStyle(i).display!=='none');const r=visible[0].getBoundingClientRect(),s=getComputedStyle(root);return {visible:visible.length,src:visible[0].getAttribute('src'),w:r.width,h:r.height,x:r.x,bg:s.backgroundColor,border:s.borderTopWidth,shadow:s.boxShadow,padding:s.padding,filter:getComputedStyle(visible[0]).filter,hero:document.querySelectorAll('main section:first-child .official-logo').length,overflow:document.documentElement.scrollWidth>innerWidth+1};})()`);
   assert.equal(state.visible,1);assert.equal(state.bg,'rgba(0, 0, 0, 0)');assert.equal(state.border,'0px');assert.equal(state.shadow,'none');assert.equal(state.padding,'0px');assert.equal(state.filter,'none');assert.equal(state.hero,0);assert.equal(state.overflow,false);assert.ok(state.src.includes(theme==='dark'?'mayd-logo-dark.png':'mayd-logo.png?'));assert.ok(Math.abs(state.w/state.h-3)<.01);
   if(previous)assert.deepEqual([state.w,state.h,state.x],[previous.w,previous.h,previous.x]);previous=state;
   const shot=await send('Page.captureScreenshot',{format:'png'});await fs.writeFile(`${process.env.TEMP}/mayd-logo-${width}-${theme}.png`,Buffer.from(shot.data,'base64'));
   await send('Page.reload',{ignoreCache:true});await ready();assert.equal(await js(`document.documentElement.classList.contains('dark')`),theme==='dark');
   console.log('OK',width,theme,JSON.stringify(state));
  }
 }
 await send('Emulation.setDeviceMetricsOverride',{width:1440,height:950,deviceScaleFactor:1,mobile:false});
 await js(`document.querySelector('.site-header a[href="/realisations"]').click()`);await pause(1200);assert.equal(await js('location.pathname'),'/realisations');
 await js(`document.querySelector('.site-brand').click()`);await pause(1200);assert.equal(await js('location.pathname'),'/');console.log('Navigation et retour accueil : OK');
} finally {ws.close();}
