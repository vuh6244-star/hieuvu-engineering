# Hướng dẫn GitHub → Hostinger → Go-live

## Bước 0 — Chọn gói Hostinger

Website chạy **Node.js** (form liên hệ & newsletter là API phía server), nên cần gói có tính năng **Node.js Web Apps**:

| Gói | Node.js | Ghi chú |
|---|---|---|
| Single / Premium Web Hosting | ❌ | Không chạy được Node.js app |
| **Business Web Hosting** | ✅ | ✔ Khuyến nghị — rẻ nhất có Node.js, kèm email, SSL miễn phí, CDN, backup hằng ngày |
| Cloud Startup trở lên | ✅ | Tài nguyên mạnh hơn, phù hợp khi lưu lượng lớn |
| VPS (KVM 1/2) | ✅ | Toàn quyền, nhưng tự quản trị server (Nginx, PM2, bảo mật) |

> Kiểm tra lại trang https://www.hostinger.com/pricing trước khi mua vì tính năng các gói có thể thay đổi. Gói 12–24 tháng thường kèm **tên miền .com miễn phí năm đầu** — dùng cho `hieuvuengineering.com`.

## Bước 1 — Đưa code lên GitHub

1. Vào https://github.com/new → tên repo `hieuvu-engineering` → **Public** → *không* tích "Add README" → Create.
2. Trong thư mục dự án:
   ```bash
   git remote add origin https://github.com/<username>/hieuvu-engineering.git
   git push -u origin main
   ```
3. Tab **Actions** trên GitHub sẽ tự build để kiểm tra mỗi lần push (file `.github/workflows/ci.yml`).

## Bước 2 — Tạo Node.js Web App trên Hostinger

1. hPanel → **Websites** → **Add website** → **Node.js Apps** (hoặc *Deploy Node.js app*).
2. Chọn **Import Git repository** → kết nối GitHub → chọn repo `hieuvu-engineering`, nhánh `main`.
3. Cấu hình build:

   | Mục | Giá trị |
   |---|---|
   | Framework | Astro (hoặc *Other*) |
   | Node.js version | **22.x** |
   | Install command | `npm ci` |
   | Build command | `npm run build` |
   | Start command / entry | `npm start` (chạy `server.mjs`) |
   | Output directory | `dist` (nếu được hỏi) |

4. **Environment variables**: thêm `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_TO` (và `PUBLIC_GA_ID`… nếu có) — xem `README.md` mục 5.
5. Deploy. Hostinger tự gán `PORT`; `server.mjs` đọc biến này.
6. Bật **auto-deploy** để mỗi lần `git push` website tự cập nhật.

## Bước 3 — Tên miền & SSL

- Nếu mua tên miền tại Hostinger: gắn trực tiếp vào website, DNS tự cấu hình.
- Nếu mua nơi khác: trỏ **Nameserver** về `ns1.dns-parking.com` / `ns2.dns-parking.com` (hoặc tạo bản ghi A/CNAME theo hướng dẫn trong hPanel).
- hPanel → **SSL** → cài **Free SSL (Let's Encrypt)** → bật **Force HTTPS**.
- Kiểm tra cả `www.hieuvuengineering.com` chuyển hướng về bản chính.

## Bước 4 — Google Search Console & Analytics

1. **GA4:** https://analytics.google.com → tạo property → Web stream → lấy mã `G-XXXXXXX` → đặt `PUBLIC_GA_ID` → deploy lại. Banner đồng ý cookie tự hiện khi có mã.
2. **Search Console:** https://search.google.com/search-console → thêm property *Domain* (xác minh DNS — khuyến nghị) hoặc *URL prefix* (dùng `PUBLIC_GSC_VERIFICATION`).
3. Gửi sitemap: `https://hieuvuengineering.com/sitemap-index.xml`.
4. Kiểm tra `https://hieuvuengineering.com/robots.txt`.

## Bước 5 — Checklist trước Go-live

**Chức năng**
- [ ] Gửi thử form liên hệ (VI & EN) → nhận email tại `hieuvu.sim@gmail.com`, bấm *Reply* trả lời đúng người gửi
- [ ] Đăng ký newsletter → nhận email thông báo
- [ ] Nút Tải CV mở đúng file thật
- [ ] Link Zalo, LinkedIn, YouTube, Facebook, TikTok đúng
- [ ] Chuyển ngôn ngữ VI ↔ EN ở mọi trang; chuyển sáng/tối
- [ ] Trang 404: truy cập `/khong-ton-tai`

**Hiển thị** — kiểm tra trên 375px (điện thoại), 768px (tablet), 1366px (laptop), 1920px (desktop)

**Hiệu năng** — https://pagespeed.web.dev → mục tiêu Performance > 90 (mobile & desktop)
- Ảnh mô phỏng thật nên ≤ 2500px chiều rộng; Astro tự xuất WebP
- Video dài: đăng YouTube và dùng trường `youtube:` thay vì tải file lên

**Bảo mật**
- [ ] HTTPS + Force HTTPS bật
- [ ] Mật khẩu hPanel/GitHub mạnh + bật 2FA cho cả hai
- [ ] Không commit `.env`; App Password chỉ nhập trên Hostinger
- [ ] Bật backup tự động trong hPanel

## Bảo trì định kỳ

| Tần suất | Việc |
|---|---|
| Hằng tuần | Đăng ≥ 1 bài/case study; xem Search Console mục *Pages* để bắt lỗi 404 |
| Hằng tháng | Xem GA4 (lượt truy cập, trang được xem nhiều); `npm outdated` để cập nhật thư viện; kiểm tra backup |
| Hằng quý | Rà soát SEO (từ khóa, CTR); thêm tính năng (thư viện tài liệu, chatbot AI, newsletter thật qua Brevo/MailerLite) |
