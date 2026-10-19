// Tách nền logo gốc (nền xám) thành PNG trong suốt + tạo favicon và ảnh OG.
// Chạy: npm run assets   (chỉ cần chạy lại khi thay logo-source.png)
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const SRC = 'src/assets/brand/logo-source.png';
const OUT_BRAND = 'src/assets/brand';
const OUT_PUBLIC = 'public';

const NAVY = [15, 23, 42]; // #0F172A — thay màu trắng của logo khi dùng trên nền sáng

const { data, info } = await sharp(SRC).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
const bg = [data[0], data[1], data[2]];

// Màu cyan thuần của logo = trung vị các pixel cyan đặc (bỏ viền răng cưa)
const solid = [[], [], []];
for (let i = 0; i < data.length; i += 3) {
  if (data[i + 2] - data[i] > 120) for (let k = 0; k < 3; k++) solid[k].push(data[i + k]);
}
const median = (a) => a.sort((x, y) => x - y)[a.length >> 1];
const cyan = solid.map(median);
const WHITE = [255, 255, 255];
console.log('bg', bg, 'cyan', cyan, '#' + cyan.map((c) => c.toString(16).padStart(2, '0')).join(''));

// Ước lượng alpha theo mô hình p = a*fg + (1-a)*bg, chọn fg (cyan/white) có sai số nhỏ hơn
function unmix(p, fg) {
  const d = fg.map((c, k) => c - bg[k]);
  const v = p.map((c, k) => c - bg[k]);
  const dd = d.reduce((s, x) => s + x * x, 0);
  let a = v.reduce((s, x, k) => s + x * d[k], 0) / dd;
  a = Math.max(0, Math.min(1, a));
  const err = v.reduce((s, x, k) => s + (x - a * d[k]) ** 2, 0);
  return { a, err };
}

function build(whiteReplacement) {
  const out = Buffer.alloc(W * H * 4);
  for (let i = 0, j = 0; i < data.length; i += 3, j += 4) {
    const p = [data[i], data[i + 1], data[i + 2]];
    const c = unmix(p, cyan);
    const w = unmix(p, WHITE);
    const pick = c.err <= w.err ? { a: c.a, col: cyan } : { a: w.a, col: whiteReplacement };
    const a = pick.a < 0.04 ? 0 : pick.a;
    out[j] = pick.col[0]; out[j + 1] = pick.col[1]; out[j + 2] = pick.col[2];
    out[j + 3] = Math.round(a * 255);
  }
  return sharp(out, { raw: { width: W, height: H, channels: 4 } });
}

await mkdir(OUT_BRAND, { recursive: true });

// Logo đầy đủ (HV + ENGINEERING), cắt sát viền
const dark = await build(WHITE).png().toBuffer();
const light = await build(NAVY).png().toBuffer();
await sharp(dark).trim({ threshold: 1 }).png().toFile(`${OUT_BRAND}/logo-on-dark.png`);
await sharp(light).trim({ threshold: 1 }).png().toFile(`${OUT_BRAND}/logo-on-light.png`);

// Chỉ phần ký hiệu "HV" (bỏ chữ ENGINEERING ở dưới)
const markTop = 280, markBottom = 690;
const markOf = (buf) =>
  sharp(buf).extract({ left: 0, top: markTop, width: W, height: markBottom - markTop }).png().toBuffer()
    .then((b) => sharp(b).trim({ threshold: 1 }).png().toBuffer());
const markDark = await markOf(dark);
const markLight = await markOf(light);
await sharp(markDark).toFile(`${OUT_BRAND}/mark-on-dark.png`);
await sharp(markLight).toFile(`${OUT_BRAND}/mark-on-light.png`);

// Favicon: ký hiệu HV trên nền navy bo góc
async function icon(size, file, radius = 0.22) {
  const pad = Math.round(size * 0.14);
  const inner = await sharp(markDark).resize(size - pad * 2, size - pad * 2, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
  const r = Math.round(size * radius);
  const bgSvg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${r}" fill="#0B1220"/></svg>`);
  await sharp(bgSvg).composite([{ input: inner, gravity: 'center' }]).png().toFile(file);
}
await icon(32, `${OUT_PUBLIC}/favicon-32.png`);
await icon(180, `${OUT_PUBLIC}/apple-touch-icon.png`, 0);
await icon(192, `${OUT_PUBLIC}/icon-192.png`);
await icon(512, `${OUT_PUBLIC}/icon-512.png`);

// Ảnh chia sẻ mạng xã hội (Open Graph) 1200x630
const ogLogo = await sharp(dark).trim({ threshold: 1 }).resize({ height: 300 }).toBuffer();
const lines = Array.from({ length: 14 }, (_, k) => {
  const y = 120 + k * 32;
  return `<path d="M -20 ${y} C 300 ${y - 40}, 520 ${y + 60}, 1220 ${y - 20}" stroke="url(#g)" stroke-width="1.4" fill="none" opacity="${0.15 + (k % 4) * 0.08}"/>`;
}).join('');
const ogSvg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#070B14"/><stop offset="1" stop-color="#0F1B33"/></linearGradient>
    <linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#2563EB"/><stop offset="0.6" stop-color="#3DD6E0"/><stop offset="1" stop-color="#3DD6E0" stop-opacity="0"/></linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  ${lines}
  <text x="600" y="520" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="34" fill="#CBD5E1">CFD Simulation Engineer · Simcenter STAR-CCM+</text>
  <text x="600" y="570" text-anchor="middle" font-family="Consolas, monospace" font-size="22" fill="#3DD6E0">hieuvuengineering.com</text>
</svg>`);
await sharp(ogSvg).composite([{ input: ogLogo, top: 110, left: Math.round(600 - (await sharp(ogLogo).metadata()).width / 2) }]).png().toFile(`${OUT_PUBLIC}/og-default.png`);

console.log('Done.');
