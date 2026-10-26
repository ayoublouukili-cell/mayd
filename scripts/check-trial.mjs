import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import assert from "node:assert/strict";

const base = "http://127.0.0.1:8082";
const tabs = await (await fetch("http://127.0.0.1:9334/json")).json();
const ws = new WebSocket(tabs.find(t => t.type === "page").webSocketDebuggerUrl);
await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
let seq = 0;
const pending = new Map();
const exceptions = [];
ws.onmessage = ({ data }) => {
  const event = JSON.parse(data);
  if (pending.has(event.id)) { pending.get(event.id)(event); pending.delete(event.id); }
  if (event.method === "Runtime.exceptionThrown") exceptions.push(event.params.exceptionDetails.text);
};
function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++seq;
    const timer = setTimeout(() => reject(Error("Timeout: " + method)), 20000);
    pending.set(id, result => { clearTimeout(timer); result.error ? reject(Error(JSON.stringify(result.error))) : resolve(result.result); });
    ws.send(JSON.stringify({ id, method, params }));
  });
}
async function js(expression) {
  const result = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw Error(JSON.stringify(result.exceptionDetails));
  return result.result.value;
}
async function wait(expression) {
  for (let i = 0; i < 100; i++) {
    if (await js(expression)) return;
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  throw Error("Not ready: " + expression);
}
try {
  await send("Page.enable");
  await send("Runtime.enable");
  for (const [width, lang, theme] of [[1440, "fr", "light"], [390, "fr", "light"], [320, "ar", "dark"]]) {
    await send("Network.setCookie", { name: "mayd-language", value: lang, url: base });
    await send("Network.setCookie", { name: "mayd-theme", value: theme, url: base });
    await send("Emulation.setDeviceMetricsOverride", { width, height: 920, deviceScaleFactor: 1, mobile: width < 768 });
    await send("Page.navigate", { url: base });
    await wait(`!![...document.querySelectorAll('main button')].find(b=>b.textContent.includes(${JSON.stringify(lang === "ar" ? "استفد" : "Profiter de mes")}))`);
    await wait(`Object.keys(document.querySelector('main button')).some(k=>k.startsWith('__reactFiber'))`);
    assert.equal(await js("document.documentElement.scrollWidth > innerWidth + 1"), false);
    const hero = await send("Page.captureScreenshot", { format: "png" });
    await fs.writeFile(path.join(os.tmpdir(), `mayd-trial-${width}.png`), Buffer.from(hero.data, "base64"));
    await js(`document.querySelector('main button').click()`);
    await wait(`!!document.querySelector('[role="dialog"]')`);
    await new Promise(resolve => setTimeout(resolve, 350));
    const dialog = await js(`(()=>{const d=document.querySelector('[role="dialog"]'),r=d.getBoundingClientRect();return {x:r.x,right:r.right,width:innerWidth,overflow:d.scrollWidth>d.clientWidth+1,inputs:d.querySelectorAll('input').length};})()`);
    assert.ok(dialog.x >= 0 && dialog.right <= dialog.width + 1, JSON.stringify(dialog));
    assert.equal(dialog.overflow, false);
    assert.equal(dialog.inputs, 4);
    const shot = await send("Page.captureScreenshot", { format: "png" });
    await fs.writeFile(path.join(os.tmpdir(), `mayd-trial-form-${width}.png`), Buffer.from(shot.data, "base64"));
    console.log("Verified", width, lang, theme);
  }
  assert.deepEqual(exceptions, []);
} finally { await send("Browser.close"); ws.close(); }
