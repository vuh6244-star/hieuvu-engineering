// Tách nền ảnh xe (render) → PNG trong suốt + đường bao (polygon) cho bộ giải CFD.
// Chạy: node scripts/prepare-car.mjs   (chỉ cần chạy lại khi thay ảnh src/assets/hero/car-source.png)
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';

const SRC = 'src/assets/hero/car-source.png';
const GROUND_Y = 318; // hàng điểm thấp nhất của lốp trong ảnh gốc (cắt bỏ mặt đường bên dưới)
// Bánh xe đo trên ảnh gốc [cx, cy, r] — luôn giữ (lốp & vòm bánh tối dễ bị nhầm là nền)
const WHEELS = [[197, 246, 72], [782, 246, 73]];
const inWheel = (x, y) => WHEELS.some(([cx, cy, r]) => {
  const d2 = (x - cx) ** 2 + (y - cy) ** 2;
  return d2 <= r * r || (y < cy && d2 <= (r + 12) ** 2); // nửa trên rộng hơn → lấp khe vòm bánh
});

const { data, info } = await sharp(SRC).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
const N = W * H;
// Lấy mẫu độ sáng song tuyến (tọa độ thực)
const gray = (x, y) => {
  const x0 = Math.floor(x), y0 = Math.floor(y), fx = x - x0, fy = y - y0;
  const g = (xx, yy) => { const i = 3 * (yy * W + xx); return 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]; };
  return g(x0, y0) * (1 - fx) * (1 - fy) + g(x0 + 1, y0) * fx * (1 - fy) + g(x0, y0 + 1) * (1 - fx) * fy + g(x0 + 1, y0 + 1) * fx * fy;
};
/** Tinh chỉnh tâm bánh: tâm đúng là điểm mà ảnh mâm xoay 72° trùng với chính nó (sai khác nhỏ nhất) */
const refineCenter = ([cx, cy, r]) => {
  const score = (x, y) => {
    let e = 0;
    for (let rr = r * 0.2; rr <= r * 0.72; rr += r * 0.06) {
      for (let k = 0; k < 120; k++) {
        const a = (k / 120) * Math.PI * 2, b = a + (2 * Math.PI) / 5;
        const d = gray(x + rr * Math.cos(a), y + rr * Math.sin(a)) - gray(x + rr * Math.cos(b), y + rr * Math.sin(b));
        e += d * d;
      }
    }
    return e;
  };
  let best = [cx, cy], bs = Infinity;
  for (let step of [1, 0.25]) {
    const [bx, by] = best, span = step === 1 ? 8 : 1;
    for (let dy = -span; dy <= span; dy += step) for (let dx = -span; dx <= span; dx += step) {
      const v = score(bx + dx, by + dy);
      if (v < bs) { bs = v; best = [bx + dx, by + dy]; }
    }
  }
  return [+best[0].toFixed(2), +best[1].toFixed(2), r];
};
for (let k = 0; k < WHEELS.length; k++) {
  const before = WHEELS[k].slice();
  WHEELS[k] = refineCenter(WHEELS[k]);
  // bán kính lốp = khoảng cách từ tâm tới điểm chạm đất (không lấy dư sang vòm bánh / mặt đường)
  WHEELS[k][2] = +(GROUND_Y + 0.5 - WHEELS[k][1]).toFixed(2);
  console.log('wheel', k, 'center', before.slice(0, 2), '→', WHEELS[k].slice(0, 2), 'r', WHEELS[k][2]);
}

// 1) Phân loại sơ bộ: nền = xanh bão hòa / rất tối ánh xanh
const bgLike = new Uint8Array(N);
for (let i = 0; i < N; i++) {
  const r = data[3 * i], g = data[3 * i + 1], b = data[3 * i + 2];
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
  const sat = mx === 0 ? 0 : (mx - mn) / mx;
  const y = Math.floor(i / W);
  bgLike[i] = (sat > 0.66 && b >= r) || mx < 14 || y > GROUND_Y ? 1 : 0;
}

// 2) Loang từ mép ảnh qua các điểm "giống nền" → nền thật
const bg = new Uint8Array(N);
const stack = [];
const push = (i) => { if (!bg[i] && bgLike[i]) { bg[i] = 1; stack.push(i); } };
for (let x = 0; x < W; x++) { push(x); push((H - 1) * W + x); }
for (let y = 0; y < H; y++) { push(y * W); push(y * W + W - 1); }
while (stack.length) {
  const i = stack.pop(), x = i % W, y = (i - x) / W;
  if (x > 0) push(i - 1); if (x < W - 1) push(i + 1); if (y > 0) push(i - W); if (y < H - 1) push(i + W);
}

// 3) Giữ thành phần liên thông lớn nhất (bỏ mẩu chữ, biểu tượng ngôi sao…)
let car = new Uint8Array(N);
for (let i = 0; i < N; i++) car[i] = bg[i] ? 0 : 1;
const label = new Int32Array(N);
let best = 0, bestSize = 0, cur = 0;
for (let i = 0; i < N; i++) {
  if (!car[i] || label[i]) continue;
  cur++; let size = 0; const st = [i]; label[i] = cur;
  while (st.length) {
    const j = st.pop(); size++;
    const x = j % W, y = (j - x) / W;
    for (const k of [x > 0 ? j - 1 : -1, x < W - 1 ? j + 1 : -1, y > 0 ? j - W : -1, y < H - 1 ? j + W : -1]) {
      if (k >= 0 && car[k] && !label[k]) { label[k] = cur; st.push(k); }
    }
  }
  if (size > bestSize) { bestSize = size; best = cur; }
}
for (let i = 0; i < N; i++) { const x = i % W, y = (i - x) / W; car[i] = label[i] === best || inWheel(x, y) ? 1 : 0; }

// 4) Đóng hình (giãn rồi co) để lấp mép phản chiếu xanh, sau đó lấp lỗ
const morph = (src, r, dilate) => {
  const out = new Uint8Array(N);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    let v = dilate ? 0 : 1;
    for (let dy = -r; dy <= r && (dilate ? !v : v); dy++) for (let dx = -r; dx <= r; dx++) {
      if (dx * dx + dy * dy > r * r) continue;
      const xx = x + dx, yy = y + dy;
      const s = xx < 0 || yy < 0 || xx >= W || yy >= H ? 0 : src[yy * W + xx];
      if (dilate && s) { v = 1; break; }
      if (!dilate && !s) { v = 0; break; }
    }
    out[y * W + x] = v;
  }
  return out;
};
car = morph(morph(car, 8, true), 8, false);
for (let i = 0; i < N; i++) if (Math.floor(i / W) > GROUND_Y) car[i] = 0;
// lấp lỗ: loang nền từ mép trên mặt nạ đã đóng
const outside = new Uint8Array(N); const st2 = [];
const push2 = (i) => { if (!outside[i] && !car[i]) { outside[i] = 1; st2.push(i); } };
for (let x = 0; x < W; x++) { push2(x); push2((H - 1) * W + x); }
for (let y = 0; y < H; y++) { push2(y * W); push2(y * W + W - 1); }
while (st2.length) { const i = st2.pop(), x = i % W, y = (i - x) / W; if (x > 0) push2(i - 1); if (x < W - 1) push2(i + 1); if (y > 0) push2(i - W); if (y < H - 1) push2(i + W); }
for (let i = 0; i < N; i++) car[i] = outside[i] ? 0 : 1;

// 5) Hộp bao
let x0 = W, x1 = 0, y0 = H, y1 = 0;
for (let i = 0; i < N; i++) if (car[i]) { const x = i % W, y = (i - x) / W; x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
const cw = x1 - x0 + 1, ch = y1 - y0 + 1;
console.log('car bbox', { x0, y0, x1, y1, cw, ch, ratio: (ch / cw).toFixed(3) });

// 6) PNG trong suốt (mép mềm 1px)
const rgba = Buffer.alloc(cw * ch * 4);
for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) {
  const si = (y + y0) * W + (x + x0), di = (y * cw + x) * 4;
  rgba[di] = data[3 * si]; rgba[di + 1] = data[3 * si + 1]; rgba[di + 2] = data[3 * si + 2];
  let a = 0, c = 0;
  for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
    const xx = x + x0 + dx, yy = y + y0 + dy;
    if (xx >= 0 && yy >= 0 && xx < W && yy < H) { a += car[yy * W + xx]; c++; }
  }
  rgba[di + 3] = Math.round((a / c) * 255);
}
await sharp(rgba, { raw: { width: cw, height: ch, channels: 4 } }).webp({ quality: 88, alphaQuality: 90 }).toFile('public/hero/car.webp');

// 7) Đường bao: lấy mép trên & mép dưới theo từng cột (xe là hình "sao" theo phương đứng) → polygon chuẩn hóa
const cols = 140, top = [], bot = [];
for (let k = 0; k <= cols; k++) {
  const x = Math.min(cw - 1, Math.round((k / cols) * (cw - 1)));
  let t = -1, b = -1;
  for (let y = 0; y < ch; y++) if (car[(y + y0) * W + x + x0]) { if (t < 0) t = y; b = y; }
  if (t >= 0) { top.push([x / cw, 1 - t / cw]); bot.push([x / cw, 1 - b / cw]); }
}
// y chuẩn hóa theo chiều dài xe, gốc ở mặt đường (đáy hộp bao = mặt đường)
const base = (ch - 1) / cw;
const norm = ([x, y]) => [+x.toFixed(4), +(y - (1 - base)).toFixed(4)];
const outline = [...top.map(norm), ...bot.reverse().map(norm)];
// 8) Sprite bánh xe (cắt tròn từ bánh trước, lấy mẫu quanh tâm thực) để quay khi mô phỏng chạy
const [wcx, wcy, wr] = WHEELS[0];
const SS = 2; // siêu lấy mẫu ×2 cho nét
const R = Math.ceil(wr) + 1, D = 2 * R * SS;
const wheel = Buffer.alloc(D * D * 4);
for (let y = 0; y < D; y++) for (let x = 0; x < D; x++) {
  const ox = (x + 0.5) / SS - R, oy = (y + 0.5) / SS - R; // độ lệch so với tâm (px ảnh gốc)
  const d = Math.hypot(ox, oy), di = (y * D + x) * 4;
  const sx = wcx + ox, sy = wcy + oy;
  if (sx < 0 || sy < 0 || sx >= W - 1 || sy >= H - 1) continue;
  const x0 = Math.floor(sx), y0 = Math.floor(sy), fx = sx - x0, fy = sy - y0;
  for (let c = 0; c < 3; c++) {
    const g = (xx, yy) => data[3 * (yy * W + xx) + c];
    wheel[di + c] = Math.round(g(x0, y0) * (1 - fx) * (1 - fy) + g(x0 + 1, y0) * fx * (1 - fy) + g(x0, y0 + 1) * (1 - fx) * fy + g(x0 + 1, y0 + 1) * fx * fy);
  }
  wheel[di + 3] = Math.round(Math.max(0, Math.min(1, wr + 0.5 - d)) * 255);
}
await sharp(wheel, { raw: { width: D, height: D, channels: 4 } }).webp({ quality: 90, alphaQuality: 100 }).toFile('public/hero/wheel.webp');
// vị trí bánh theo tọa độ chuẩn hóa của xe: [x tâm, y tâm (từ mặt đường), bán kính]
const wheelsNorm = WHEELS.map(([cx, cy, r]) => [+((cx - x0) / cw).toFixed(4), +((y1 - cy) / cw).toFixed(4), +(r / cw).toFixed(4)]);

await writeFile('src/lib/carOutline.ts', `// Tự sinh bởi scripts/prepare-car.mjs từ ảnh render xe — không sửa tay.
// Tọa độ chuẩn hóa theo chiều dài xe: x = 0 mũi xe, y = 0 mặt đường. Tỉ lệ ảnh: cao/dài = ${(ch / cw).toFixed(4)}
export const CAR_IMG_RATIO = ${(ch / cw).toFixed(5)};
/** Bánh xe [x tâm, y tâm, bán kính] — sprite public/hero/wheel.webp quay theo vận tốc mặt đường */
export const CAR_WHEELS: [number, number, number][] = ${JSON.stringify(wheelsNorm)};
export const CAR_OUTLINE: [number, number][] = ${JSON.stringify(outline)};
`);
console.log('outline points', outline.length);
