import type { APIRoute } from 'astro';
import { getTransport, isEmail, json, mailFrom, mailTo, rateLimited } from '@/lib/mailer';

export const prerender = false;

/*
  Bản khởi đầu: gửi email thông báo có người đăng ký về hộp thư của bạn.
  Giai đoạn sau: thay bằng API của Brevo / MailerLite / Mailchimp để quản lý danh sách và gửi bản tin.
*/
export const POST: APIRoute = async ({ request, clientAddress }) => {
  const form = await request.formData().catch(() => null);
  if (!form) return json({ error: 'Bad request' }, 400);
  const lang = form.get('lang') === 'en' ? 'en' : 'vi';
  if (form.get('website')) return json({ ok: true });
  const email = String(form.get('email') ?? '').trim();
  if (!isEmail(email)) return json({ error: lang === 'vi' ? 'Email chưa hợp lệ.' : 'Invalid email.' }, 400);
  if (rateLimited(`nl:${clientAddress ?? 'unknown'}`, 3)) {
    return json({ error: lang === 'vi' ? 'Vui lòng thử lại sau.' : 'Please try again later.' }, 429);
  }

  const transport = getTransport();
  if (!transport) {
    if (import.meta.env.DEV) {
      console.info('[newsletter] SMTP chưa cấu hình — email đăng ký:', email);
      return json({ ok: true, dev: true });
    }
    return json({ error: lang === 'vi' ? 'Tạm thời chưa nhận đăng ký, vui lòng thử lại sau.' : 'Subscriptions are temporarily unavailable.' }, 503);
  }
  try {
    await transport.sendMail({
      from: mailFrom(),
      to: mailTo(),
      subject: `[Website] Đăng ký bản tin: ${email}`,
      text: `Email đăng ký bản tin mới: ${email} (ngôn ngữ: ${lang})`,
    });
    return json({ ok: true });
  } catch (err) {
    console.error('[newsletter] send failed', err);
    return json({ error: lang === 'vi' ? 'Đăng ký thất bại, vui lòng thử lại.' : 'Subscription failed, please retry.' }, 502);
  }
};
