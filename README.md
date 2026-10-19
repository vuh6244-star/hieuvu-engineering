# Hiếu Vũ | Engineering — Website cá nhân CFD

Website thương hiệu cá nhân song ngữ (VI/EN) cho kỹ sư mô phỏng CFD — xây bằng **Astro 5 + Node.js**, deploy lên **Hostinger (Node.js Web App)** từ **GitHub**.

- 🌐 Tên miền dự kiến: `hieuvuengineering.com`
- ⚙️ Node.js ≥ 20.3 (khuyến nghị 22 LTS)
- 🎨 Design system "Precision Engineering": navy `#0F172A` + cyan logo `#3ED6E0`, sáng/tối

---

## 1. Chạy trên máy

```bash
npm install
npm run dev        # http://localhost:4321  (hiện nhãn "Nội dung mẫu" trên các bài mẫu)
npm run build      # build production vào dist/
npm start          # chạy server Node.js production tại http://localhost:3000
```

Sao chép `.env.example` → `.env` để thử gửi email thật khi chạy local.

## 2. Cấu trúc thư mục

```
src/
├─ assets/            ảnh được tối ưu tự động (portrait.jpg, brand/logo…)
├─ components/        Header, Footer, FlowCanvas (hero CFD), FlowArt, ChatWidget…
├─ content/
│  ├─ projects/vi|en/ case study (.mdx) — cùng tên file = 2 bản ngôn ngữ
│  └─ blog/vi|en/     bài viết (.mdx)
├─ data/site.ts       ⭐ THÔNG TIN CÁ NHÂN, dịch vụ, số liệu, mạng xã hội, ý tưởng sắp ra mắt
├─ i18n/ui.ts         chuỗi giao diện VI/EN
├─ pages/             định tuyến (/, /en, /about, /projects, /blog, /contact, /api/*)
├─ views/             nội dung từng trang (dùng chung cho 2 ngôn ngữ)
└─ styles/global.css  design tokens (màu, font, khoảng cách)
public/               favicon, og-default.png, cv/hieu-vu-cv.pdf
server.mjs            server Node.js production (thêm header bảo mật & cache)
scripts/prepare-assets.mjs   tách nền logo → favicon, ảnh OG (chạy: npm run assets)
```

## 3. Cập nhật nội dung (việc bạn sẽ làm thường xuyên)

### Thêm bài viết blog
1. Tạo `src/content/blog/vi/ten-bai-viet.mdx` (và bản `en/ten-bai-viet.mdx` nếu có).
2. Phần đầu file:
   ```yaml
   ---
   title: "Tiêu đề chuẩn SEO (50–60 ký tự)"
   description: "Mô tả 140–160 ký tự, chứa từ khóa chính."
   date: 2026-10-20
   category: tutorial        # tutorial | fundamentals | case-study | tips
   tags: [STAR-CCM+, mesh]
   art: airfoil              # ảnh minh họa tự sinh khi chưa có ảnh: car | datacenter | pump | battery | mixer | airfoil
   # cover: ../../../assets/blog/anh-bia.jpg   ← ảnh thật (tự chuyển WebP)
   # coverAlt: "Mô tả ảnh cho SEO"
   # draft: true            ← ẩn khi chưa xong
   ---
   ```
3. Viết nội dung bằng Markdown. Có thể chèn máy tính y+: `import YPlusCalculator from '@/components/YPlusCalculator.astro'` rồi `<YPlusCalculator lang="vi" />`.
4. Commit & push → Hostinger tự build lại.

### Thêm/sửa dự án
Giống blog, trong `src/content/projects/vi|en/`. Trường riêng: `industry`, `tools`, `metrics` (số liệu nổi bật), `featured: true` (hiện ở trang chủ), `youtube: "VIDEO_ID"`.
➡ **Xóa dòng `sample: true`** sau khi thay số liệu thật.

### Ý tưởng "để sẵn tên"
Sửa mảng `upcomingProjects` và `upcomingPosts` trong `src/data/site.ts` — hiển thị dạng "Sắp ra mắt".

### Ảnh mô phỏng thật
Đặt ảnh vào `src/assets/projects/` hoặc `src/assets/blog/` (JPG/PNG lớn cũng được — Astro tự nén WebP & tạo nhiều kích thước), rồi khai báo `cover:` trong file .mdx.

## 4. Những chỗ cần bạn xác nhận trước khi Go-live ⚠

| Vị trí | Việc cần làm |
|---|---|
| `public/cv/hieu-vu-cv.pdf` | Thay bằng CV thật (giữ nguyên tên file) |
| `src/content/projects/*` | Thay số liệu mẫu bằng dự án thật, xóa `sample: true` |
| `src/content/blog/*` | Đọc duyệt 3 bài mẫu, xóa `sample: true` |
| `src/views/AboutView.astro` → `timeline`, `certs` | Tên trường, năm học, chứng chỉ thật |
| `src/data/site.ts`, `HomeView.astro`, `AboutView.astro` | Đang ghi "đối tác phần mềm của Siemens" đúng như trang Đội ngũ của cfdways.com. Nếu CFDWAYS cho phép ghi "đối tác cấp 1", sửa lại tại đây |

## 5. Biến môi trường

| Biến | Bắt buộc | Mô tả |
|---|---|---|
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | ✅ (form liên hệ) | Gmail: `smtp.gmail.com`, `465`, App Password |
| `CONTACT_TO` | | Mặc định `hieuvu.sim@gmail.com` |
| `CONTACT_FROM` | | Tên + email người gửi |
| `PUBLIC_GA_ID` | | Mã GA4 `G-XXXXXXX` (cần build lại) |
| `PUBLIC_GSC_VERIFICATION` | | Mã xác minh Google Search Console (thẻ meta) |
| `PUBLIC_CALENDLY_URL` | | Link Calendly, ví dụ `https://calendly.com/hieuvu/30min` |

> Biến `PUBLIC_*` được nhúng lúc **build**; biến SMTP đọc lúc **chạy**. Không bao giờ commit file `.env`.

**Tạo Gmail App Password:** bật Xác minh 2 bước → https://myaccount.google.com/apppasswords → tạo mật khẩu 16 ký tự → dán vào `SMTP_PASS` trên Hostinger.

---

Xem hướng dẫn deploy chi tiết tại **[docs/DEPLOY.md](docs/DEPLOY.md)** và kế hoạch nội dung tại **[docs/CONTENT-PLAN.md](docs/CONTENT-PLAN.md)**.
