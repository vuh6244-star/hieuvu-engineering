// Điểm khởi chạy Node.js cho môi trường production (Hostinger: Start command = "npm start").
// Bọc handler của Astro để thêm header bảo mật & cache.
import http from 'node:http';

process.env.ASTRO_NODE_AUTOSTART = 'disabled';
const { handler } = await import('./dist/server/entry.mjs');

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const security = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
};

http
  .createServer((req, res) => {
    for (const [k, v] of Object.entries(security)) res.setHeader(k, v);
    const proto = req.headers['x-forwarded-proto'];
    if (proto === 'https') res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    // File có hash trong tên (/_astro/*) → cache 1 năm; còn lại để mặc định của Astro
    if (req.url?.startsWith('/_astro/')) res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    handler(req, res);
  })
  .listen(PORT, HOST, () => {
    console.log(`Hiếu Vũ | Engineering đang chạy tại http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
  });
