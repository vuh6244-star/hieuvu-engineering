import type { APIRoute } from 'astro';
import { escapeHtml, getTransport, isEmail, json, mailFrom, mailTo, rateLimited } from '@/lib/mailer';

export const prerender = false;

const MSG = {
  vi: { invalid: 'Vui lòng kiểm tra lại thông tin.', limit: 'Bạn gửi quá nhiều lần, vui lòng thử lại sau ít phút.', unavailable: 'Hệ thống email đang bảo trì — vui lòng gửi trực tiếp tới hieuvu.sim@gmail.com.', error: 'Gửi thất bại, vui lòng thử lại.' },
  en: { invalid: 'Please check your details.', limit: 'Too many requests, please try again in a few minutes.', unavailable: 'Email is temporarily unavailable — please write to hieuvu.sim@gmail.com directly.', error: 'Sending failed, please try again.' },
};

export const POST: APIRoute = async ({ request, clientAddress }) => {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ error: MSG.vi.invalid }, 400);
  }
  const get = (k: string) => String(form.get(k) ?? '').trim();
  const lang = get('lang') === 'en' ? 'en' : 'vi';
  const m = MSG[lang];

  // Chống spam: honeypot + thời gian điền form tối thiểu 3 giây
  const ts = Number(get('ts'));
  if (get('website') || (ts && Date.now() - ts < 3000)) return json({ ok: true });

  if (rateLimited(clientAddress ?? 'unknown')) return json({ error: m.limit }, 429);

  const data = {
    name: get('name').slice(0, 120),
    email: get('email').slice(0, 160),
    company: get('company').slice(0, 160),
    phone: get('phone').slice(0, 40),
    service: get('service').slice(0, 40),
    timeline: get('timeline').slice(0, 40),
    message: get('message').slice(0, 5000),
  };
  if (data.name.length < 2 || !isEmail(data.email) || data.message.length < 20 || !form.get('consent')) {
    return json({ error: m.invalid }, 400);
  }

  const transport = getTransport();
  if (!transport) {
    if (import.meta.env.DEV) {
      console.info('[contact] SMTP chưa cấu hình — nội dung form:', data);
      return json({ ok: true, dev: true });
    }
    return json({ error: m.unavailable }, 503);
  }

  const rows = Object.entries(data)
    .filter(([k, v]) => v && k !== 'message')
    .map(([k, v]) => `<tr><td style="padding:6px 12px;color:#64748b">${k}</td><td style="padding:6px 12px"><b>${escapeHtml(v)}</b></td></tr>`)
    .join('');
  try {
    await transport.sendMail({
      from: mailFrom(),
      to: mailTo(),
      replyTo: `${data.name} <${data.email}>`,
      subject: `[Website] ${data.service || 'contact'} — ${data.name}${data.company ? ` (${data.company})` : ''}`,
      text: Object.entries(data).map(([k, v]) => `${k}: ${v}`).join('\n'),
      html: `<div style="font-family:Arial,sans-serif;font-size:14px;color:#0f172a"><h2 style="margin:0 0 12px">Yêu cầu mới từ website</h2><table style="border-collapse:collapse">${rows}</table><p style="white-space:pre-wrap;margin-top:16px;padding:12px;background:#f1f5f9;border-radius:8px">${escapeHtml(data.message)}</p></div>`,
    });
    return json({ ok: true });
  } catch (err) {
    console.error('[contact] send failed', err);
    return json({ error: m.error }, 502);
  }
};

export const ALL: APIRoute = () => json({ error: 'Method not allowed' }, 405);
