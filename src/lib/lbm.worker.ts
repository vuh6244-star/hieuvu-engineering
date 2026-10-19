/// <reference lib="webworker" />
/*
  Web Worker chạy bộ giải LBM ở luồng riêng → trang không bị giật khi mô phỏng.
  Tin nhắn vào:  init {gen, scene, Nx, Ny, mobile, warm} · play · pause · ack · stir {x,y,u,v}
  Tin nhắn ra:   frame {gen, ux, uy, steps, delta}  (mảng Float32 được chuyển giao, không sao chép)
*/
import { LBM, scenes } from './lbm';

let sim: LBM | null = null;
let gen = 0;
let playing = true;
let ready = true; // luồng chính đã vẽ xong khung trước
let warm = 0;
let lastPostedSteps = 0;
let timer = 0;

const post = () => {
  if (!sim) return;
  const ux = new Float32Array(sim.ux), uy = new Float32Array(sim.uy);
  (self as DedicatedWorkerGlobalScope).postMessage(
    { type: 'frame', gen, ux, uy, steps: sim.steps, delta: sim.steps - lastPostedSteps },
    [ux.buffer, uy.buffer],
  );
  lastPostedSteps = sim.steps;
  ready = false;
};

const loop = () => {
  clearTimeout(timer);
  if (!sim) return;
  const t0 = performance.now();
  if (warm > 0) {
    while (warm > 0 && performance.now() - t0 < 40) { sim.step(); warm--; }
    if (warm <= 0) post();
    timer = self.setTimeout(loop, 0);
    return;
  }
  if (playing) {
    // ~12 ms tính toán mỗi 16 ms → mượt mà nhưng vẫn để CPU nghỉ
    while (performance.now() - t0 < 12) sim.step();
    if (!sim.healthy()) { (self as DedicatedWorkerGlobalScope).postMessage({ type: 'unstable', gen }); sim = null; return; }
    if (ready) post();
    timer = self.setTimeout(loop, 4);
  }
};

self.onmessage = (e: MessageEvent) => {
  const m = e.data;
  switch (m.type) {
    case 'init': {
      gen = m.gen;
      const def = scenes[m.scene];
      sim = new LBM(m.Nx, m.Ny);
      const geo = def.geometry(m.Nx, m.Ny, m.mobile, m.my);
      sim.init(def, geo.shapes, geo.groundY ?? 0);
      sim.source = geo.source ?? null;
      sim.sink = geo.sink ?? null;
      sim.omega = 1 / (3 * def.nu + 0.5);
      warm = m.warm;
      lastPostedSteps = 0;
      ready = true;
      playing = m.playing;
      loop();
      break;
    }
    case 'play': playing = true; loop(); break;
    case 'pause': playing = false; clearTimeout(timer); break;
    case 'ack': ready = true; break;
    case 'stir': if (sim) sim.stir = { x: m.x, y: m.y, u: m.u, v: m.v, life: 3 }; break;
  }
};
