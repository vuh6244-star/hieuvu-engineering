import nodemailer, { type Transporter } from 'nodemailer';

/* Đọc cấu hình SMTP lúc chạy (biến môi trường trên Hostinger), không nhúng vào bản build */
const env = (k: string) => process.env[k]?.trim() || undefined;

let transporter: Transporter | null = null;
export function getTransport(): Transporter | null {
  if (transporter) return transporter;
  const host = env('SMTP_HOST');
  const user = env('SMTP_USER');
  const pass = env('SMTP_PASS');
  if (!host || !user || !pass) return null;
  const port = Number(env('SMTP_PORT') ?? 465);
  transporter = nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });
  return transporter;
}

export const mailTo = () => env('CONTACT_TO') ?? 'hieuvu.sim@gmail.com';
export const mailFrom = () => env('CONTACT_FROM') ?? env('SMTP_USER') ?? 'no-reply@hieuvuengineering.com';

/* Giới hạn tần suất đơn giản theo IP (bộ nhớ trong tiến trình) */
const hits = new Map<string, number[]>();
export function rateLimited(ip: string, max = 5, windowMs = 10 * 60_000) {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  return list.length > max;
}

export const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });

export const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s) && s.length <= 160;
