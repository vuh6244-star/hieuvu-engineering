/*
  Bộ giải Lattice-Boltzmann D2Q9 (BGK) + định nghĩa 5 cảnh của hero.
  Dùng chung cho Web Worker (tính toán) và luồng chính (vẽ vật thể, nhãn).
*/
import { CAR_IMG_RATIO, CAR_OUTLINE } from './carOutline';

/* =====================================================================
   Hình học vật thể (đơn vị: ô lưới)
   ===================================================================== */
export type Pt = [number, number];
export type CarShape = {
  kind: 'car';
  /** Thân xe (đa giác đã làm trơn), đơn vị ô lưới */
  body: Pt[];
  /** Kính bên (chỉ để vẽ) */
  glass: Pt[];
  /** Bánh xe [cx, cy, r] */
  wheels: [number, number, number][];
  /** Thông số để vẽ chi tiết: gốc xe (mũi, mặt đường), chiều dài */
  x0: number; yG: number; len: number;
};
export type Shape =
  | { kind: 'circle'; x: number; y: number; r: number; hot?: boolean }
  | { kind: 'poly'; pts: Pt[]; tone?: 'light' | 'person' }
  | { kind: 'rect'; x: number; y: number; w: number; h: number; hidden?: boolean; tone?: 'light' }
  /** Khung tường phòng (chỉ để vẽ; phần rắn là các rect ẩn bao quanh) */
  | { kind: 'frame'; x: number; y: number; w: number; h: number; t: number }
  /** Miệng gió hồi (chỉ để vẽ các khe) */
  | { kind: 'grille'; x: number; y: number; h: number }
  | CarShape;
export const inPoly = (pts: [number, number][], x: number, y: number) => {
  let c = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i], [xj, yj] = pts[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
};
export const inShape = (s: Shape, x: number, y: number): boolean => {
  if (s.kind === 'circle') return (x - s.x) ** 2 + (y - s.y) ** 2 <= s.r * s.r;
  if (s.kind === 'rect') return x >= s.x && x <= s.x + s.w && y >= s.y && y <= s.y + s.h;
  if (s.kind === 'car') return inPoly(s.body, x, y) || s.wheels.some(([cx, cy, r]) => (x - cx) ** 2 + (y - cy) ** 2 <= r * r);
  if (s.kind === 'frame' || s.kind === 'grille') return false;
  return inPoly(s.pts, x, y);
};

export const naca = (cxl: number, cyl: number, chord: number, aoaDeg: number): [number, number][] => {
  const pts: [number, number][] = [];
  const t = 0.12, a = (aoaDeg * Math.PI) / 180;
  const n = 60;
  const yt = (x: number) => 5 * t * (0.2969 * Math.sqrt(x) - 0.126 * x - 0.3516 * x * x + 0.2843 * x ** 3 - 0.1036 * x ** 4);
  const pt = (x: number, y: number): [number, number] => {
    // tâm quay tại 1/4 dây cung; trục y lưới hướng xuống → góc tấn dương = mũi ngẩng lên
    const X = (x - 0.25) * chord, Y = -y * chord;
    return [cxl + X * Math.cos(a) + Y * Math.sin(a), cyl - X * Math.sin(a) + Y * Math.cos(a)];
  };
  for (let i = 0; i <= n; i++) { const x = (1 - Math.cos((i / n) * Math.PI)) / 2; pts.push(pt(x, yt(x))); }
  for (let i = n; i >= 0; i--) { const x = (1 - Math.cos((i / n) * Math.PI)) / 2; pts.push(pt(x, -yt(x))); }
  return pts;
};

/* Xe: đường bao trích tự động từ ảnh render (scripts/prepare-car.mjs) → hình học CFD khớp đúng hình hiển thị */
export const carShape = (x0: number, yG: number, len: number): CarShape => ({
  kind: 'car', x0, yG, len,
  body: CAR_OUTLINE.map(([x, y]): Pt => [x0 + x * len, yG - y * len]),
  glass: [],
  wheels: [],
});

export type Source = {
  x0: number; x1: number; y0: number; y1: number; u: number;
  /** Nguồn ổn định có hướng (u, v) và biên độ đảo gió — dùng cho cửa gió điều hòa */
  steady?: boolean; v?: number; swing?: number;
};
/** Vùng hút (cửa gió hồi): giữ áp suất ρ = 1 để cân bằng lưu lượng */
export type Sink = { x0: number; x1: number; y0: number; y1: number };
export type SceneDef = {
  title: { vi: string; en: string };
  field: 'vort' | 'speed';
  unit: string;
  labels: [string, string, string];
  u0: number;          // vận tốc vào (đơn vị lưới)
  nu: number;          // độ nhớt động học (đơn vị lưới)
  inlet: 'uniform' | 'quiescent';
  ground?: boolean;
  /** Hệ số thang màu vận tốc (mặc định 1.6 × u0) */
  speedScale?: number;
  /** my: tâm dọc (tỉ lệ 0–1) của dải mô phỏng trên điện thoại — dải trống bên dưới phần chữ hero */
  geometry(Nx: number, Ny: number, mobile: boolean, my: number): { shapes: Shape[]; L: number; source?: Source; sink?: Sink; groundY?: number };
};

export const scenes: SceneDef[] = [
  {
    title: { vi: 'Dãy xoáy Kármán sau trụ tròn', en: 'Kármán vortex street' },
    field: 'vort', unit: 'ω·D/U∞', labels: ['−', '0', '+'], u0: 0.1, nu: 0.016, inlet: 'uniform',
    geometry(Nx, Ny, m, my) {
      const r = Math.max(6, Math.round((m ? Nx : Ny) * 0.075));
      return { shapes: [{ kind: 'circle', x: Math.round(Nx * (m ? 0.3 : 0.69)), y: Math.round(Ny * (m ? my : 0.5)) + 0.5, r }], L: 2 * r };
    },
  },
  {
    title: { vi: 'Thất tốc cánh NACA 0012 — góc tấn 16°', en: 'NACA 0012 stall — 16° AoA' },
    field: 'vort', unit: 'ω·c/U∞', labels: ['−', '0', '+'], u0: 0.1, nu: 0.02, inlet: 'uniform',
    geometry(Nx, Ny, m, my) {
      const c = Math.round(m ? Nx * 0.5 : Ny * 0.42);
      return { shapes: [{ kind: 'poly', pts: naca(Nx * (m ? 0.32 : 0.68), Ny * (m ? my : 0.48), c, 16) }], L: c };
    },
  },
  {
    title: { vi: 'Khí động học xe — vùng wake', en: 'Vehicle aerodynamics — wake' },
    field: 'speed', unit: '|U|/U∞', labels: ['0.0', '0.8', '1.6'], u0: 0.1, nu: 0.016, inlet: 'uniform', ground: true,
    geometry(Nx, Ny, m, my) {
      // Desktop: xe ở nửa phải, phía trên bảng HUD và không chạm vùng chữ bên trái
      const wide = Nx / Ny > 2.1; // màn hình rộng → còn nhiều chỗ bên phải chữ
      const len = Math.round(m ? Nx * 0.7 : Nx * (wide ? 0.36 : 0.32));
      const x0 = Math.round(Nx * (m ? 0.15 : wide ? 0.555 : 0.58)), yG = Math.round(Ny * (m ? Math.min(0.93, my + 0.1) : wide ? 0.68 : 0.64));
      return { shapes: [carShape(x0, yG, len)], L: CAR_IMG_RATIO * len, groundY: yG };
    },
  },
  {
    title: { vi: 'Bó ống trao đổi nhiệt', en: 'Heat-exchanger tube bank' },
    field: 'speed', unit: '|U|/U∞', labels: ['0.0', '0.9', '1.8'], u0: 0.08, nu: 0.014, inlet: 'uniform',
    geometry(Nx, Ny, m, my) {
      const s = m ? Nx : Ny;
      const r = Math.max(4, Math.round(s * (m ? 0.045 : 0.05))), p = Math.round(s * (m ? 0.14 : 0.17));
      const shapes: Shape[] = [];
      const x0 = Math.round(Nx * (m ? 0.2 : 0.56)), yc = Ny * (m ? my : 0.5);
      // Điện thoại: gói gọn trong dải mô phỏng, không lấn lên vùng chữ
      const jMin = m ? -2 : -4, jMax = m ? 1 : 4;
      for (let i = 0; i < 4; i++) {
        for (let j = jMin; j <= jMax; j++) {
          const y = yc + (j + (i % 2) * 0.5) * p;
          if (y - r > 6 && y + r < Ny - 7) shapes.push({ kind: 'circle', x: x0 + i * p * 0.9, y, r, hot: true });
        }
      }
      return { shapes, L: 2 * r };
    },
  },
  {
    title: { vi: 'Tia phun — bất ổn Kelvin–Helmholtz', en: 'Jet — Kelvin–Helmholtz instability' },
    field: 'vort', unit: 'ω·D/U<sub>j</sub>', labels: ['−', '0', '+'], u0: 0.12, nu: 0.008, inlet: 'quiescent',
    geometry(Nx, Ny, m, my) {
      const hh = Math.max(5, Math.round((m ? Nx : Ny) * 0.05));
      const xe = Math.round(Nx * (m ? 0.12 : 0.72)), yc = Math.round(Ny * (m ? my : 0.5));
      const len = Math.round(Nx * 0.1), th = 2;
      return {
        shapes: [
          { kind: 'rect', x: xe - len, y: yc - hh - th, w: len, h: th },
          { kind: 'rect', x: xe - len, y: yc + hh + 1, w: len, h: th },
        ],
        L: 2 * hh,
        source: { x0: xe - len + 1, x1: xe - len + 3, y0: yc - hh, y1: yc + hh, u: 0.12 },
      };
    },
  },
];

/* =====================================================================
   Bộ giải LBM D2Q9
   ===================================================================== */
export const W0 = 4 / 9, W1 = 1 / 9, W2 = 1 / 36;
export class LBM {
  Nx: number; Ny: number; N: number;
  f: Float64Array; g: Float64Array; tmp: Float64Array;
  rho: Float64Array; ux: Float64Array; uy: Float64Array;
  solid: Uint8Array; near: Uint8Array; solidList: Int32Array;
  omega = 1.8; uIn = 0.1; quiescent = false; steps = 0;
  /** Hàng bắt đầu của mặt đường chuyển động (0 = không có) */
  belt = 0;
  source: Source | null = null;
  sink: Sink | null = null;
  stir: { x: number; y: number; u: number; v: number; life: number } | null = null;
  constructor(Nx: number, Ny: number) {
    this.Nx = Nx; this.Ny = Ny; this.N = Nx * Ny;
    this.f = new Float64Array(9 * this.N); this.g = new Float64Array(9 * this.N);
    this.tmp = new Float64Array(9);
    this.rho = new Float64Array(this.N); this.ux = new Float64Array(this.N); this.uy = new Float64Array(this.N);
    this.solid = new Uint8Array(this.N); this.near = new Uint8Array(this.N); this.solidList = new Int32Array(0);
  }
  /** Ghi phân bố cân bằng vào arr tại ô i (stride = N); nếu stride = 1 ghi vào 9 phần tử liên tiếp */
  setEq(arr: Float64Array, i: number, r: number, ux: number, uy: number, stride = this.N) {
    const u2 = 1.5 * (ux * ux + uy * uy);
    arr[i] = W0 * r * (1 - u2);
    arr[stride + i] = W1 * r * (1 + 3 * ux + 4.5 * ux * ux - u2);
    arr[2 * stride + i] = W1 * r * (1 + 3 * uy + 4.5 * uy * uy - u2);
    arr[3 * stride + i] = W1 * r * (1 - 3 * ux + 4.5 * ux * ux - u2);
    arr[4 * stride + i] = W1 * r * (1 - 3 * uy + 4.5 * uy * uy - u2);
    let e = ux + uy; arr[5 * stride + i] = W2 * r * (1 + 3 * e + 4.5 * e * e - u2);
    e = -ux + uy; arr[6 * stride + i] = W2 * r * (1 + 3 * e + 4.5 * e * e - u2);
    e = -ux - uy; arr[7 * stride + i] = W2 * r * (1 + 3 * e + 4.5 * e * e - u2);
    e = ux - uy; arr[8 * stride + i] = W2 * r * (1 + 3 * e + 4.5 * e * e - u2);
  }
  init(def: SceneDef, shapes: Shape[], groundY = 0) {
    const { Nx, Ny } = this;
    this.solid.fill(0);
    const list: number[] = [];
    for (let y = 1; y < Ny - 1; y++) {
      for (let x = 1; x < Nx - 1; x++) {
        const idx = y * Nx + x;
        let s = false;
        if (!s) for (const sh of shapes) if (inShape(sh, x + 0.5, y + 0.5)) { s = true; break; }
        if (s) { this.solid[idx] = 1; list.push(idx); }
      }
    }
    this.solidList = Int32Array.from(list);
    this.belt = groundY;
    // Ô lỏng có láng giềng là ô rắn → cần xử lý bounce-back
    this.near.fill(0);
    for (let y = 1; y < Ny - 1; y++) for (let x = 1; x < Nx - 1; x++) {
      const i = y * Nx + x;
      if (this.solid[i]) continue;
      const S = this.solid;
      if (S[i - 1] | S[i + 1] | S[i - Nx] | S[i + Nx] | S[i - 1 - Nx] | S[i + 1 - Nx] | S[i - 1 + Nx] | S[i + 1 + Nx]) this.near[i] = 1;
    }
    this.uIn = def.inlet === 'uniform' ? def.u0 : 0;
    this.quiescent = def.inlet === 'quiescent';
    this.steps = 0;
    for (let i = 0; i < this.N; i++) {
      const y = Math.floor(i / Nx), x = i - y * Nx;
      // nhiễu nhỏ bất đối xứng để dòng nhanh chóng mất ổn định (giống thực tế)
      const pert = this.solid[i] ? 0 : 0.01 * Math.sin((x / Nx) * 37) * Math.cos((y / Ny) * 23);
      const u = this.solid[i] ? 0 : this.uIn;
      this.setEq(this.f, i, 1, u, pert);
      this.rho[i] = 1; this.ux[i] = u; this.uy[i] = pert;
    }
  }
  step() {
    const { Nx, Ny, N, f, g, rho, ux, uy, solid } = this;
    const om = this.omega;
    // 1) Lan truyền (pull) + bounce-back nửa bước tại tường + va chạm BGK — một vòng lặp duy nhất
    const near = this.near;
    for (let y = 1; y < Ny - 1; y++) {
      let i = y * Nx + 1;
      for (let x = 1; x < Nx - 1; x++, i++) {
        if (solid[i]) continue;
        let f1, f2, f3, f4, f5, f6, f7, f8;
        const f0 = f[i];
        if (near[i] === 0) {
          f1 = f[N + i - 1]; f2 = f[2 * N + i - Nx]; f3 = f[3 * N + i + 1]; f4 = f[4 * N + i + Nx];
          f5 = f[5 * N + i - 1 - Nx]; f6 = f[6 * N + i + 1 - Nx]; f7 = f[7 * N + i + 1 + Nx]; f8 = f[8 * N + i - 1 + Nx];
        } else {
          f1 = solid[i - 1] ? f[3 * N + i] : f[N + i - 1];
          f2 = solid[i - Nx] ? f[4 * N + i] : f[2 * N + i - Nx];
          f3 = solid[i + 1] ? f[N + i] : f[3 * N + i + 1];
          f4 = solid[i + Nx] ? f[2 * N + i] : f[4 * N + i + Nx];
          f5 = solid[i - 1 - Nx] ? f[7 * N + i] : f[5 * N + i - 1 - Nx];
          f6 = solid[i + 1 - Nx] ? f[8 * N + i] : f[6 * N + i + 1 - Nx];
          f7 = solid[i + 1 + Nx] ? f[5 * N + i] : f[7 * N + i + 1 + Nx];
          f8 = solid[i - 1 + Nx] ? f[6 * N + i] : f[8 * N + i - 1 + Nx];
        }
        const r = f0 + f1 + f2 + f3 + f4 + f5 + f6 + f7 + f8;
        let u = (f1 + f5 + f8 - f3 - f6 - f7) / r;
        let v = (f2 + f5 + f6 - f4 - f7 - f8) / r;
        const sp = u * u + v * v;
        if (sp > 0.09) { const k = 0.3 / Math.sqrt(sp); u *= k; v *= k; }
        rho[i] = r; ux[i] = u; uy[i] = v;
        const u2 = 1.5 * (u * u + v * v);
        const wr1 = W1 * r, wr2 = W2 * r;
        g[i] = f0 + om * (W0 * r * (1 - u2) - f0);
        g[N + i] = f1 + om * (wr1 * (1 + 3 * u + 4.5 * u * u - u2) - f1);
        g[2 * N + i] = f2 + om * (wr1 * (1 + 3 * v + 4.5 * v * v - u2) - f2);
        g[3 * N + i] = f3 + om * (wr1 * (1 - 3 * u + 4.5 * u * u - u2) - f3);
        g[4 * N + i] = f4 + om * (wr1 * (1 - 3 * v + 4.5 * v * v - u2) - f4);
        let e = u + v; g[5 * N + i] = f5 + om * (wr2 * (1 + 3 * e + 4.5 * e * e - u2) - f5);
        e = -u + v; g[6 * N + i] = f6 + om * (wr2 * (1 + 3 * e + 4.5 * e * e - u2) - f6);
        e = -u - v; g[7 * N + i] = f7 + om * (wr2 * (1 + 3 * e + 4.5 * e * e - u2) - f7);
        e = u - v; g[8 * N + i] = f8 + om * (wr2 * (1 + 3 * e + 4.5 * e * e - u2) - f8);
      }
    }
    // 4) Biên ngoài: vào (trái), trên/dưới (dòng tự do hoặc tĩnh), ra (phải, gradient bằng 0)
    const uFar = this.uIn;
    for (let y = 0; y < Ny; y++) {
      this.setEq(g, y * Nx, 1, uFar, 0);
      // cửa ra áp suất: ρ = 1, vận tốc lấy theo ô bên trong (tránh dòng tăng tốc giả)
      const ir = y * Nx + Nx - 1, il = ir - 1;
      this.setEq(g, ir, 1, ux[il], uy[il]);
    }
    for (let x = 0; x < Nx - 1; x++) { this.setEq(g, x, 1, uFar, 0); this.setEq(g, (Ny - 1) * Nx + x, 1, uFar, 0); }
    // Mặt đường chuyển động cùng vận tốc dòng tới (như băng chuyền trong hầm gió ô tô)
    if (this.belt) for (let y = this.belt; y < Ny - 1; y++) for (let x = 1; x < Nx - 1; x++) this.setEq(g, y * Nx + x, 1, uFar, 0);
    // 5) Nguồn tia phun (có dao động nhỏ để kích thích bất ổn)
    const s = this.source;
    if (s && s.steady) {
      // cửa gió điều hòa: hướng thổi cố định + cánh đảo gió dao động chậm
      const vy = (s.v ?? 0) + (s.swing ?? 0) * Math.sin(this.steps * 0.0035);
      for (let y = s.y0; y <= s.y1; y++) for (let x = s.x0; x <= s.x1; x++) this.setEq(g, y * Nx + x, 1, s.u, vy);
    } else if (s) {
      // kích thích ở tần số mất ổn định của lớp cắt (St_D ≈ 0.4) + điều hòa bậc hai → cuộn xoáy Kelvin–Helmholtz
      const n = this.steps;
      const vy = s.u * (0.1 * Math.sin(n * 0.022) + 0.05 * Math.sin(n * 0.047 + 1.3));
      const ua = s.u * (1 + 0.04 * Math.sin(n * 0.022 + 0.5));
      for (let y = s.y0; y <= s.y1; y++) for (let x = s.x0; x <= s.x1; x++) this.setEq(g, y * Nx + x, 1, ua, vy);
    }
    // Cửa hồi: áp suất cố định, vận tốc theo dòng (khí được hút ra)
    const k = this.sink;
    if (k) for (let y = k.y0; y <= k.y1; y++) for (let x = k.x0; x <= k.x1; x++) { const i = y * Nx + x; this.setEq(g, i, 1, ux[i], uy[i]); }
    // 6) Khuấy bằng chuột
    const st = this.stir;
    if (st && st.life > 0) {
      const R = 4, a = 0.35, tmp = this.tmp;
      this.setEq(tmp, 0, 1, st.u, st.v, 1);
      for (let dy = -R; dy <= R; dy++) for (let dx = -R; dx <= R; dx++) {
        const x = Math.round(st.x) + dx, y = Math.round(st.y) + dy;
        if (x < 2 || y < 2 || x >= Nx - 2 || y >= Ny - 2 || dx * dx + dy * dy > R * R) continue;
        const i = y * Nx + x;
        if (solid[i]) continue;
        for (let d = 0; d < 9; d++) g[d * N + i] = g[d * N + i] * (1 - a) + a * tmp[d];
      }
      st.life--;
    }
    this.f = g; this.g = f;
    this.steps++;
  }
  healthy() {
    for (let i = 0; i < this.N; i += 97) { const r = this.rho[i]; if (!(r > 0.5 && r < 1.6)) return false; }
    return true;
  }
}
