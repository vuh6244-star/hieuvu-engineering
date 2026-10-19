/** Dải màu kiểu CFD (xanh đậm → cyan → vàng → cam), giá trị t ∈ [0, 1] */
const STOPS: [number, number[]][] = [
  [0, [23, 37, 84]],
  [0.22, [29, 78, 216]],
  [0.41, [56, 189, 248]],
  [0.5, [62, 214, 224]],
  [0.64, [165, 243, 252]],
  [0.82, [253, 230, 138]],
  [1, [245, 158, 11]],
];

export function cmap(t: number): string {
  const x = Math.min(1, Math.max(0, t));
  let k = 0;
  while (k < STOPS.length - 2 && x > STOPS[k + 1][0]) k++;
  const [t0, c0] = STOPS[k];
  const [t1, c1] = STOPS[k + 1];
  const f = (x - t0) / (t1 - t0);
  return `rgb(${c0.map((v, i) => Math.round(v + (c1[i] - v) * f)).join(',')})`;
}

export const cmapGradientStops = STOPS.map(([t, c]) => ({ offset: t, color: `rgb(${c.join(',')})` }));

/** Bộ sinh số giả ngẫu nhiên có seed — để hình minh họa luôn giống nhau giữa các lần build */
export function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

/** Vận tốc dòng thế quanh cánh Joukowski (c = 1), hệ có dòng tự do nằm ngang */
export function joukowskiVelocity(x: number, y: number, alpha: number, mu: [number, number] = [-0.09, 0.075]) {
  const R = Math.hypot(1 - mu[0], mu[1]);
  const beta = Math.atan2(mu[1], 1 - mu[0]);
  const gamma = 4 * Math.PI * R * Math.sin(alpha + beta);
  type C = [number, number];
  const mul = (a: C, b: C): C => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
  const div = (a: C, b: C): C => {
    const d = b[0] * b[0] + b[1] * b[1] || 1e-12;
    return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d];
  };
  const sqrt = (a: C): C => {
    const r = Math.sqrt(Math.hypot(a[0], a[1]));
    const t = Math.atan2(a[1], a[0]) / 2;
    return [r * Math.cos(t), r * Math.sin(t)];
  };
  const rot: C = [Math.cos(alpha), Math.sin(alpha)];
  const rotInv: C = [Math.cos(alpha), -Math.sin(alpha)];
  const z = mul([x, y], rot);
  const disc = sqrt([z[0] * z[0] - z[1] * z[1] - 4, 2 * z[0] * z[1]]);
  let zeta: C = [(z[0] + disc[0]) / 2, (z[1] + disc[1]) / 2];
  const alt: C = [(z[0] - disc[0]) / 2, (z[1] - disc[1]) / 2];
  const d2 = (p: C) => (p[0] - mu[0]) ** 2 + (p[1] - mu[1]) ** 2;
  if (d2(alt) > d2(zeta)) zeta = alt;
  const d: C = [zeta[0] - mu[0], zeta[1] - mu[1]];
  if (d2(zeta) < R * R * 1.0005) return null;
  const a = div(mul([R * R, 0], rot), mul(d, d));
  const g = div([0, gamma / (2 * Math.PI)], d);
  const dF: C = [rotInv[0] - a[0] + g[0], rotInv[1] - a[1] + g[1]];
  const zz = mul(zeta, zeta);
  const w = div(dF, [1 - div([1, 0], zz)[0], -div([1, 0], zz)[1]]);
  return mul([w[0], -w[1]], rotInv);
}

export function joukowskiOutline(alpha: number, n = 120, mu: [number, number] = [-0.09, 0.075]) {
  const R = Math.hypot(1 - mu[0], mu[1]);
  const pts: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * 2 * Math.PI;
    const zr = mu[0] + R * Math.cos(t);
    const zi = mu[1] + R * Math.sin(t);
    const m = zr * zr + zi * zi;
    const x = zr + zr / m;
    const y = zi - zi / m;
    pts.push([x * Math.cos(-alpha) - y * Math.sin(-alpha), x * Math.sin(-alpha) + y * Math.cos(-alpha)]);
  }
  return pts;
}
