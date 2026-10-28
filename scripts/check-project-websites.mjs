import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import assert from "node:assert/strict";
const base = "http://127.0.0.1:8082";
const tabs = await (await fetch("http://127.0.0.1:9334/json")).json();
const ws = new WebSocket(tabs.find(t => t.type === "page").webSocketDebuggerUrl);
await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
let id = 0;
const pending = new Map(), errors = [];
ws.onmessage = ({data}) => {
  const e = JSON.parse(data);
  if (pending.has(e.id)) { pending.get(e.id)(e); pending.delete(e.id); }
  if (e.method === "Runtime.exceptionThrown") errors.push(e.params.exceptionDetails.exception?.description ?? e.params.exceptionDetails.text);
};
function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const n = ++id, timer = setTimeout(() => reject(Error("Timeout " + method)), 120000);
    pending.set(n, e => { clearTimeout(timer); e.error ? reject(Error(JSON.stringify(e.error))) : resolve(e.result); });
    ws.send(JSON.stringify({id:n, method, params}));
  });
}
async function js(expression) {
  const e = await send("Runtime.evaluate", {expression, returnByValue:true, awaitPromise:true});
  if(e.exceptionDetails) throw Error(JSON.stringify(e.exceptionDetails));
  return e.result.value;
}
const pause = ms => new Promise(r => setTimeout(r, ms));
async function wait(expression) { for(let n=0;n<150;n++){ if(await js(expression))return;await pause(200); } throw Error("Not ready "+expression); }
const slugs = ["nexplay-gaming","horizon-immobilier","eclat-studio","atlas-drive","maison-safran","forma-club","mistral-habitat","rift-district","neroli-botanique","azahar-table","cadence-mouvement","demo-cafe-de-quartier","demo-institut-beaute","demo-restaurant-familial","demo-boutique-mode"];
try {
  await send("Page.enable");await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride",{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
  for(const slug of process.argv.includes('--remaining') ? slugs.slice(-2) : slugs){
    await send("Page.navigate",{url:`${base}/demonstrations/${slug}/site`});
    await wait(`!!document.querySelector('.demo-website h1')`);
    await wait(`Object.keys(document.querySelector('.demo-form')).some(k=>k.startsWith('__reactFiber'))`);
    const data = await js(`(async()=>{await Promise.all([...document.images].filter(i=>i.loading!=='lazy').map(i=>i.decode().catch(()=>{})));return {name:document.querySelector('.demo-site-brand').textContent,hasForm:!!document.querySelector('.demo-form'),broken:[...document.querySelectorAll('.demo-site-nav a,.direction-hero a')].filter(a=>a.hash&&!document.getElementById(a.hash.slice(1))).map(a=>a.hash),overflow:document.documentElement.scrollWidth>innerWidth+1,images:[...document.querySelectorAll('.direction-hero img')].map(i=>i.naturalWidth)}})()`);
    assert.ok(data.hasForm);assert.deepEqual(data.broken,[],slug);assert.equal(data.overflow,false,slug);assert.ok(data.images.every(n=>n>0),slug);
    if(slug.startsWith('demo-') || slug==='nexplay-gaming'){
      const shot=await send('Page.captureScreenshot',{format:'png'});await fs.writeFile(path.join(os.tmpdir(),slug+'-site.png'),Buffer.from(shot.data,'base64'));
    }
    console.log('Verified desktop',slug,data.name);
  }
  for(const slug of ["demo-cafe-de-quartier","demo-institut-beaute","demo-boutique-mode","nexplay-gaming","mistral-habitat"]){
    await send("Emulation.setDeviceMetricsOverride",{width:390,height:900,deviceScaleFactor:1,mobile:true});
    await send("Page.navigate",{url:`${base}/demonstrations/${slug}/site`});await wait(`!!document.querySelector('.demo-form')`);
    await pause(500);assert.equal(await js('document.documentElement.scrollWidth>innerWidth+1'),false,slug);
    console.log('Verified mobile',slug);
  }
  assert.deepEqual(errors,[]);
} finally {try {await send('Browser.close');} catch {} ws.close();}
