/*
  Ảnh minh họa "kiểu kết quả hậu xử lý CFD" sinh bằng SVG lúc build.
  Được xuất thành file tĩnh /art/<variant>.svg (xem src/pages/art/[name].svg.ts) để trình duyệt cache,
  không nhúng trực tiếp vào HTML.
*/
import { cmap, cmapGradientStops, joukowskiOutline, joukowskiVelocity, rng } from './colormap';

export const artVariants = ['car', 'datacenter', 'pump', 'battery', 'mixer', 'airfoil', 'furnace'] as const;
export type ArtVariant = (typeof artVariants)[number];

export function renderFlowArt(variant: ArtVariant, hud = true): string {
  const W = 800, H = 500;
  const uid = `fa-${variant}`;
  type Seg = { d: string; c: string; w: number; o: number };
  const segs: Seg[] = [];
  let shapes = '';
  let field = 'Velocity: Magnitude (m/s)';
  const r = rng(variant.length * 7919 + variant.charCodeAt(0));
  const f = (n: number) => String(Math.round(n * 2) / 2); // nửa pixel là đủ mịn ở 800px

  function polyline(pts: [number, number][], speedOf: (i: number) => number, w = 1.4, o = 0.9, chunk = 10, step = 2) {
    // Lấy mẫu thưa (step) để file nhẹ, giữ điểm cuối
    const idx = pts.map((_, i) => i).filter((i) => i % step === 0 || i === pts.length - 1);
    for (let j = 0; j < idx.length - 1; j += chunk) {
      const part = idx.slice(j, Math.min(idx.length, j + chunk + 1));
      if (part.length < 2) continue;
      segs.push({ d: 'M' + part.map((i) => `${f(pts[i][0])} ${f(pts[i][1])}`).join('L'), c: cmap(speedOf(part[0])), w, o });
    }
  }


  if (variant === 'airfoil') {
    const alpha = (7 * Math.PI) / 180;
    const S = 120, cx = 430, cy = 250;
    for (let k = 0; k < 34; k++) {
      let x = -3.8, y = -2.2 + (k / 33) * 4.4;
      const pts: [number, number][] = [];
      const sp: number[] = [];
      for (let i = 0; i < 520; i++) {
        const v = joukowskiVelocity(x, y, alpha);
        if (!v) break;
        const m = Math.hypot(v[0], v[1]);
        pts.push([cx + x * S, cy - y * S]);
        sp.push(m);
        x += (v[0] / Math.max(m, 0.2)) * 0.02;
        y += (v[1] / Math.max(m, 0.2)) * 0.02;
        if (x > 3.6) break;
      }
      polyline(pts, (i) => sp[i] / 2.2, 1.5, 0.92, 8, 5);
    }
    const outline = joukowskiOutline(alpha).map(([x, y]) => `${f(cx + x * S)},${f(cy - y * S)}`).join(' ');
    shapes = `<polygon points="${outline}" fill="#0d1526" stroke="#3ed6e0" stroke-width="1.5"/>`;
  }

  if (variant === 'car') {
    // Biên dạng xe sedan đơn giản (đơn vị px)
    const body = 'M150 360 C150 330 170 318 210 312 L300 300 C335 262 380 236 440 232 C500 230 545 248 585 292 L660 304 C690 310 700 330 700 360 Z';
    const roof = (x: number) => {
      if (x < 150 || x > 700) return 360;
      if (x < 300) return 312 - ((x - 150) / 150) * 12;
      if (x < 440) return 300 - Math.sin(((x - 300) / 140) * (Math.PI / 2)) * 68;
      if (x < 585) return 232 + (1 - Math.cos(((x - 440) / 145) * (Math.PI / 2))) * 60;
      return 292 + ((x - 585) / 115) * 12;
    };
    // Độ cao "bướu" của thân xe so với nắp capo, làm trơn bằng lọc Gauss để đường dòng nâng lên trước xe
    const BASE = 314, STEP = 4;
    const xs = Array.from({ length: W / STEP + 1 }, (_, i) => i * STEP);
    const hRaw = xs.map((x) => (x < 150 || x > 700 ? 0 : Math.max(0, BASE - roof(x))));
    const sigma = 9; // tính theo số điểm (≈ 36 px)
    const kern = Array.from({ length: sigma * 6 + 1 }, (_, i) => Math.exp(-(((i - sigma * 3) / sigma) ** 2) / 2));
    const ksum = kern.reduce((a, b) => a + b, 0);
    const hS = xs.map((_, i) => {
      let s = 0;
      kern.forEach((w, j) => { const idx = i + j - sigma * 3; s += w * (hRaw[idx] ?? 0); });
      return Math.max(s / ksum, hRaw[i] * 0.92);
    });
    const TOP = 50, LOW = 302;
    for (let k = 0; k < 24; k++) {
      const y0 = TOP + 18 + k * ((LOW - TOP - 18) / 23);
      const w = (y0 - TOP) / (LOW - TOP); // 1 sát xe, 0 ở biên trên
      const pts: [number, number][] = [];
      const sp: number[] = [];
      xs.forEach((x, i) => {
        const h = hS[i] * w;
        const behind = Math.max(0, x - 690);
        const wakeAmp = behind > 0 ? Math.min(1, behind / 60) * w ** 3 * 9 : 0;
        const y = y0 - h + Math.sin(behind / 16 + k * 1.3) * wakeAmp + (behind > 0 ? w ** 4 * Math.min(behind, 80) * 0.35 : 0);
        pts.push([x, y]);
        // Vận tốc ~ nghịch với khoảng cách giữa các đường dòng (bảo toàn lưu lượng)
        const accel = 0.42 + 0.5 * (hS[i] / 82) * w * w;
        const slow = behind > 0 ? 1 - 0.65 * w ** 3 * Math.min(1, behind / 50) : x < 170 && x > 110 ? 1 - 0.4 * w ** 6 : 1;
        sp.push(accel * slow);
      });
      polyline(pts, (i) => sp[i], 1.4, 0.9);
    }
    // Xoáy sau đuôi xe và dưới gầm
    for (let k = 0; k < 6; k++) {
      const cx0 = 735 + (k % 3) * 22, cy0 = 330 + Math.floor(k / 3) * 24;
      const pts: [number, number][] = [];
      for (let t = 0; t < Math.PI * 3.2; t += 0.15) {
        const rr = 4 + t * 3.2;
        pts.push([cx0 + Math.cos(t + k) * rr, cy0 + Math.sin(t + k) * rr * 0.6]);
      }
      polyline(pts, () => 0.12 + r() * 0.08, 1.1, 0.7, 6);
    }
    for (let k = 0; k < 3; k++) {
      const pts: [number, number][] = [];
      for (let x = 0; x <= W; x += 8) pts.push([x, 372 + k * 6 + (x > 150 && x < 700 ? 0 : 0)]);
      polyline(pts, (i) => (i * 8 > 150 && i * 8 < 700 ? 0.3 : 0.4), 1.1, 0.5, 6);
    }
    shapes = `<path d="${body}" fill="#0d1526" stroke="#3ed6e0" stroke-width="1.6"/>
      <circle cx="255" cy="362" r="30" fill="#070b14" stroke="#3ed6e0" stroke-width="1.4"/>
      <circle cx="600" cy="362" r="30" fill="#070b14" stroke="#3ed6e0" stroke-width="1.4"/>
      <line x1="0" y1="393" x2="${W}" y2="393" stroke="#1d2940" stroke-width="2"/>`;
  }

  if (variant === 'datacenter') {
    field = 'Temperature (°C)';
    let g = '';
    const rows = [110, 200, 290, 380];
    rows.forEach((y, ri) => {
      // dải nhiệt hot/cold aisle
      const hot = ri % 2 === 0;
      g += `<rect x="90" y="${y + 30}" width="620" height="40" fill="url(#${uid}-${hot ? 'hot' : 'cold'})" opacity="0.85"/>`;
      for (let i = 0; i < 12; i++) {
        const t = hot ? 0.55 + r() * 0.4 : 0.15 + r() * 0.25;
        g += `<rect x="${100 + i * 51}" y="${y}" width="44" height="28" rx="3" fill="${cmap(t)}" opacity="0.9" stroke="#070b14"/>`;
      }
    });
    // luồng khí từ CRAC
    for (let k = 0; k < 14; k++) {
      const y = 60 + k * 30;
      const pts: [number, number][] = [];
      for (let x = 20; x < 90; x += 4) pts.push([x, y + Math.sin(x / 20 + k) * 4]);
      polyline(pts, () => 0.25, 2, 0.8, 4);
    }
    shapes = g + `<rect x="18" y="50" width="34" height="400" rx="4" fill="#0d1526" stroke="#3ed6e0"/><text x="35" y="255" fill="#94a3b8" font-size="11" font-family="monospace" text-anchor="middle" transform="rotate(-90 35 255)">CRAC</text>`;
  }

  if (variant === 'pump') {
    field = 'Pressure: Total (kPa)';
    const cx = 400, cy = 250;
    // vỏ xoắn (volute)
    for (let k = 0; k < 18; k++) {
      const pts: [number, number][] = [];
      for (let t = 0; t < Math.PI * 2 * 1.02; t += 0.05) {
        const rad = 70 + k * 7.5 + t * 6;
        pts.push([cx + Math.cos(t) * rad, cy + Math.sin(t) * rad * 0.92]);
      }
      polyline(pts, (i) => 0.2 + (k / 18) * 0.55 + (i / pts.length) * 0.25, 1.3, 0.85, 5);
    }
    let blades = '';
    for (let b = 0; b < 7; b++) {
      const a = (b / 7) * Math.PI * 2;
      const p = (rr: number, da: number) => `${f(cx + Math.cos(a + da) * rr)} ${f(cy + Math.sin(a + da) * rr)}`;
      blades += `<path d="M${p(22, 0)} Q${p(45, 0.35)} ${p(62, 0.8)}" stroke="#3ed6e0" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    }
    shapes = `<circle cx="${cx}" cy="${cy}" r="64" fill="#0d1526" stroke="#3ed6e0" stroke-width="1.4"/>${blades}<circle cx="${cx}" cy="${cy}" r="14" fill="#070b14" stroke="#3ed6e0"/>
      <path d="M${cx + 205} ${cy - 40} L${W} ${cy - 40} L${W} ${cy + 20} L${cx + 205} ${cy + 20}" fill="none" stroke="#1d2940" stroke-width="2"/>`;
  }

  if (variant === 'battery') {
    field = 'Temperature (°C)';
    let g = '';
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 12; col++) {
        const t = 0.12 + (col / 11) * 0.7 + (row === 2 || row === 3 ? 0.12 : 0) + (r() - 0.5) * 0.06;
        g += `<circle cx="${120 + col * 52}" cy="${120 + row * 52}" r="21" fill="${cmap(t)}" stroke="#070b14" stroke-width="2"/>`;
      }
    }
    for (let k = 0; k < 5; k++) {
      const y = 146 + k * 52;
      const pts: [number, number][] = [];
      for (let x = 80; x <= 720; x += 8) pts.push([x, y + Math.sin(x / 26) * 3]);
      polyline(pts, (i) => 0.1 + (i / pts.length) * 0.35, 2.2, 0.85, 6);
    }
    shapes = g + `<rect x="80" y="86" width="640" height="320" rx="14" fill="none" stroke="#3ed6e0" stroke-width="1.4"/>`;
  }

  if (variant === 'furnace') {
    // Trường nhiệt độ buồng đốt lò hơi: vùng lửa (mờ Gauss) + tia nhiên liệu/không khí từ vòi đốt hai bên
    field = 'Temperature (K)';
    let blobs = '';
    const flames: [number, number, number, number, number][] = [
      // cx, cy, rx, ry, t
      [400, 300, 150, 120, 0.55], [330, 330, 70, 60, 0.85], [470, 320, 70, 55, 0.88], [400, 240, 90, 80, 0.75],
      [360, 380, 60, 40, 0.95], [445, 375, 55, 40, 0.97], [400, 180, 70, 60, 0.6], [400, 120, 110, 50, 0.45],
    ];
    flames.forEach(([cx, cy, rx, ry, t]) => { blobs += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${cmap(t)}" opacity="0.85"/>`; });
    for (let i = 0; i < 18; i++) blobs += `<circle cx="${f(300 + r() * 200)}" cy="${f(200 + r() * 200)}" r="${f(14 + r() * 26)}" fill="${cmap(0.7 + r() * 0.3)}" opacity="0.6"/>`;
    // Tia vòi đốt (3 tầng mỗi bên)
    for (const side of [-1, 1]) {
      for (let lv = 0; lv < 3; lv++) {
        const y0 = 300 + lv * 45;
        const x0 = side < 0 ? 250 : 550;
        const pts: [number, number][] = [];
        for (let s2 = 0; s2 <= 1.0001; s2 += 0.05) pts.push([x0 - side * s2 * 120, y0 - s2 * s2 * 60 + Math.sin(s2 * 7 + lv) * 4]);
        polyline(pts, (i) => 0.15 + i * 0.03, 2.4, 0.9, 6, 1);
      }
    }
    // Khói đi lên và rẽ sang đường khói (phía trên bên phải)
    for (let k = 0; k < 9; k++) {
      const x0 = 300 + k * 25;
      const pts: [number, number][] = [];
      const yT = 92 + k * 5; // đường bên trái rẽ cao nhất → không cắt nhau
      const R0 = 26;
      for (let y = 420; y >= yT + R0; y -= 8) pts.push([x0 + Math.sin(y / 30 + k) * 5 * Math.min(1, (y - yT - R0) / 60), y]);
      for (let a = 0; a <= Math.PI / 2 + 0.01; a += Math.PI / 16) pts.push([x0 + R0 - Math.cos(a) * R0, yT + R0 - Math.sin(a) * R0]);
      for (let x = x0 + R0 + 10; x <= 690; x += 10) pts.push([x, yT]);
      polyline(pts, (i) => 0.5 + Math.sin(i / 8 + k) * 0.12, 1.1, 0.55, 6, 1);
    }
    shapes = `<g filter="url(#${uid}-blur)" clip-path="url(#${uid}-clip)">${blobs}</g>
      <path d="M250 70 L250 430 L330 470 L470 470 L550 430 L550 150 L700 150 L700 70 Z" fill="none" stroke="#3ed6e0" stroke-width="2"/>
      ${[0, 1, 2].map((lv) => `<rect x="236" y="${292 + lv * 45}" width="14" height="16" rx="2" fill="#0d1526" stroke="#3ed6e0"/><rect x="550" y="${292 + lv * 45}" width="14" height="16" rx="2" fill="#0d1526" stroke="#3ed6e0"/>`).join('')}`;
  }

  if (variant === 'mixer') {
    field = 'Velocity: Magnitude (m/s)';
    const cx = 400;
    for (const side of [-1, 1]) {
      for (let k = 0; k < 9; k++) {
        const rx = 22 + k * 9, ry = 44 + k * 19;
        const ox = cx + side * 94, oy = 255;
        const pts: [number, number][] = [];
        for (let t = -Math.PI / 2; t <= Math.PI * 1.5 + 0.07; t += 0.06) pts.push([ox + Math.cos(t) * rx, oy + Math.sin(t) * ry]);
        polyline(pts, (i) => 0.2 + (1 - k / 9) * 0.5 + (Math.abs(Math.sin((i / pts.length) * Math.PI * 2)) * 0.15), 1.3, 0.85, 5);
      }
    }
    shapes = `<path d="M210 70 L210 420 Q210 450 240 450 L560 450 Q590 450 590 420 L590 70" fill="none" stroke="#3ed6e0" stroke-width="2"/>
      <line x1="${cx}" y1="40" x2="${cx}" y2="300" stroke="#94a3b8" stroke-width="4"/>
      <rect x="${cx - 46}" y="292" width="92" height="14" rx="3" fill="#0d1526" stroke="#3ed6e0" stroke-width="1.5"/>
      <line x1="215" y1="120" x2="585" y2="120" stroke="#3ed6e0" stroke-dasharray="4 6" opacity="0.5"/>`;
  }

  const svgBody = segs.map((s) => `<path d="${s.d}" stroke="${s.c}" stroke-width="${s.w}" stroke-opacity="${s.o}"/>`).join('');

  const stops = cmapGradientStops.map((s) => `<stop offset="${s.offset}" stop-color="${s.color}"/>`).join('');
  const hudSvg = hud
    ? `<g font-family="ui-monospace, Consolas, monospace" font-size="12" fill="#94a3b8"><text x="24" y="34" fill="#e6edf7">${field}</text><rect x="24" y="46" width="180" height="7" rx="3.5" fill="url(#${uid}-bar)"/><text x="24" y="70">min</text><text x="204" y="70" text-anchor="end">max</text><text x="${W - 24}" y="${H - 22}" text-anchor="end" opacity="0.7">Illustrative visualization</text></g>`
    : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><defs><radialGradient id="${uid}-bg" cx="0.6" cy="0.4" r="0.9"><stop offset="0" stop-color="#0f1b33"/><stop offset="1" stop-color="#070b14"/></radialGradient><linearGradient id="${uid}-bar" x1="0" x2="1">${stops}</linearGradient><linearGradient id="${uid}-hot" x1="0" x2="1"><stop offset="0" stop-color="${cmap(0.7)}" stop-opacity="0.15"/><stop offset="0.5" stop-color="${cmap(0.92)}" stop-opacity="0.55"/><stop offset="1" stop-color="${cmap(0.7)}" stop-opacity="0.15"/></linearGradient><linearGradient id="${uid}-cold" x1="0" x2="1"><stop offset="0" stop-color="${cmap(0.25)}" stop-opacity="0.2"/><stop offset="1" stop-color="${cmap(0.4)}" stop-opacity="0.45"/></linearGradient><filter id="${uid}-blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="22"/></filter><clipPath id="${uid}-clip"><path d="M252 72 L252 428 L330 468 L470 468 L548 428 L548 148 L698 148 L698 72 Z"/></clipPath><pattern id="${uid}-grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#94a3b8" stroke-opacity="0.06"/></pattern></defs><rect width="${W}" height="${H}" fill="url(#${uid}-bg)"/><rect width="${W}" height="${H}" fill="url(#${uid}-grid)"/><g fill="none" stroke-linecap="round">${svgBody}</g>${shapes}${hudSvg}</svg>`;
}
