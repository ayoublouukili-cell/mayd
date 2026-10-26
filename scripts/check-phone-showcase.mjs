import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";

const pages = await (await fetch("http://127.0.0.1:9333/json")).json();
const socket = new WebSocket(pages.find((page) => page.type === "page").webSocketDebuggerUrl);
await new Promise((resolve) => (socket.onopen = resolve));
let id = 0;
const pending = new Map();
socket.onmessage = ({ data }) => {
  const message = JSON.parse(data);
  pending.get(message.id)?.(message);
  pending.delete(message.id);
};
function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const request = ++id;
    const timer = setTimeout(() => {
      pending.delete(request);
      reject(new Error(`Timeout: ${method}`));
    }, 15000);
    pending.set(request, (message) => {
      clearTimeout(timer);
      message.error ? reject(new Error(message.error.message)) : resolve(message.result);
    });
    socket.send(JSON.stringify({ id: request, method, params }));
  });
}
async function evaluate(expression) {
  const result = await send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
  return result.result.value;
}
async function until(expression) {
  for (let i = 0; i < 80; i++) {
    if (await evaluate(expression)) return;
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  throw new Error(`Condition not reached: ${expression}`);
}
async function screenshot(name) {
  const capture = await send("Page.captureScreenshot", { format: "png" });
  await writeFile(`.mayd-local/${name}.png`, Buffer.from(capture.data, "base64"));
}
try {
  await send("Page.enable");
  await send("Emulation.setEmulatedMedia", { features: [] });
  await send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 1000,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await send("Page.navigate", { url: "http://localhost:8080/" });
  await until(
    `!!document.querySelector('.phone-showcase-device')?.style.getPropertyValue('--phone-rotation')`,
  );
  await evaluate(
    `window.scrollTo({top: document.querySelector('#projets-360').getBoundingClientRect().top + scrollY, behavior: 'instant'})`,
  );
  await new Promise((resolve) => setTimeout(resolve, 500));
  await screenshot("phone-showcase-desktop");
  const first = await evaluate(
    `({overflow:document.documentElement.scrollWidth > innerWidth, title:document.querySelector('.phone-showcase-project h3').textContent, firstImage:document.querySelector('.phone-showcase-screen-hero img').complete})`,
  );
  assert.equal(first.overflow, false);
  await evaluate(
    `(()=>{const s=document.querySelector('#projets-360');window.scrollTo({top:s.getBoundingClientRect().top+scrollY+(s.offsetHeight-innerHeight)/3,behavior:'instant'})})()`,
  );
  await until(
    `document.querySelector('.phone-showcase-project-counter > span').textContent === '02'`,
  );
  const second = await evaluate(
    `({title:document.querySelector('.phone-showcase-project h3').textContent,rotation:parseFloat(document.querySelector('.phone-showcase-device').style.getPropertyValue('--phone-rotation'))})`,
  );
  assert.notEqual(first.title, second.title);
  assert.ok(Math.abs(second.rotation - 360) < 1);
  await evaluate(
    `(()=>{const s=document.querySelector('#projets-360');window.scrollTo({top:s.getBoundingClientRect().top+scrollY+(s.offsetHeight-innerHeight)/6,behavior:'instant'})})()`,
  );
  await until(
    `Math.abs(parseFloat(document.querySelector('.phone-showcase-device').style.getPropertyValue('--phone-rotation')) - 180) < 1`,
  );
  await evaluate(`document.querySelector('.site-header .theme-control').click()`);
  await until(`document.documentElement.classList.contains('dark')`);
  await screenshot("phone-showcase-back");
  await evaluate(`document.querySelector('.site-header .theme-control').click()`);
  await send("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: true,
  });
  await evaluate(
    `window.scrollTo({top:document.querySelector('#projets-360').getBoundingClientRect().top+scrollY,behavior:'instant'})`,
  );
  await until(
    `document.querySelector('.phone-showcase-project-counter > span').textContent === '01'`,
  );
  await new Promise((resolve) => setTimeout(resolve, 400));
  await screenshot("phone-showcase-mobile");
  assert.equal(await evaluate(`document.documentElement.scrollWidth > innerWidth`), false);
  await send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "reduce" }],
  });
  await until(
    `getComputedStyle(document.querySelector('.phone-showcase-sticky')).position === 'relative'`,
  );
  await evaluate(`document.querySelector('.phone-showcase-controls button:last-child').click()`);
  await until(
    `document.querySelector('.phone-showcase-project-counter > span').textContent === '02'`,
  );
  assert.equal(
    await evaluate(
      `document.querySelector('.phone-showcase-device').style.getPropertyValue('--phone-rotation')`,
    ),
    "0deg",
  );
  console.log(
    "PASS: desktop scroll, full 360° project switch, mobile overflow, reduced-motion navigation.",
  );
  console.log(JSON.stringify({ first: first.title, second: second.title }));
} finally {
  socket.close();
}
