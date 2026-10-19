# CLAUDE.md — Bối cảnh dự án cho Claude

Website thương hiệu cá nhân **Hiếu Vũ | Engineering** (kỹ sư mô phỏng CFD & R&D tại CFDWAYS).
File này ghi lại các quyết định đã thống nhất với chủ dự án để mọi phiên làm việc mới (ở bất kỳ máy nào) tiếp tục đúng hướng.
Trao đổi với chủ dự án bằng **tiếng Việt**.

## Chủ dự án & thương hiệu
- Tên: Hiếu Vũ — Kỹ sư mô phỏng CFD, kỹ sư R&D tại **CFDWAYS** (https://cfdways.com/vi/).
- Gọi CFDWAYS là **"đối tác phần mềm của Siemens Digital Industries Software"** (đúng như trang Đội ngũ của cfdways.com). Không ghi "đối tác cấp 1" trừ khi chủ dự án xác nhận được phép.
- Chỉ nhắc phần mềm hệ Siemens: Simcenter STAR-CCM+, NX, Simcenter Amesim, Simcenter FloEFD/FloTherm, Simcenter 3D. **Không nhắc phần mềm đối thủ.**
- Ngành trọng tâm theo CFDWAYS: Năng lượng & đốt cháy, Công nghiệp quá trình, HVAC & công trình, truyền nhiệt, bơm/quạt. Có kênh license Simcenter & đào tạo (chủ dự án hưởng hoa hồng khi tạo đơn cho CFDWAYS).
- Liên hệ: email hieuvu.sim@gmail.com · Zalo 0862946306 · LinkedIn in/hieuvu2002 · YouTube @Hieuvuengineering · Facebook Hieuvu.engineering · TikTok @van.hieu.sim.
- Tên miền dự kiến: hieuvuengineering.com · Hosting dự kiến: Hostinger gói có **Node.js Web Apps** (Business Web Hosting trở lên).

## Công nghệ
- Astro 5 (output static + adapter `@astrojs/node` standalone), Tailwind CSS 4, MDX, song ngữ VI (`/`) / EN (`/en`).
- `server.mjs` là điểm chạy production (`npm start`), thêm header bảo mật. API: `/api/contact`, `/api/newsletter` (nodemailer, cấu hình SMTP qua biến môi trường — xem `.env.example`).
- Lệnh: `npm run dev` (4321) · `npm run build` · `npm start` (3000) · `npx astro check` phải 0 lỗi trước khi bàn giao.
- Hướng dẫn deploy: `docs/DEPLOY.md`. Kế hoạch nội dung & 20 chủ đề blog SEO: `docs/CONTENT-PLAN.md`.

## Thiết kế đã chốt
- Phông: **Inter** (sans-serif) cho cả tiêu đề; JetBrains Mono cho chữ kỹ thuật nhỏ. Không dùng phông kiểu cách.
- Màu: navy `#0F172A`/ink `#070B14`, cyan logo `#3ED6E0`. Có nút chuyển sáng/tối.
- Hero: slogan **in đậm toàn bộ** "Từ dữ liệu dòng chảy, đến giải pháp tối ưu." (EN: "From flow data to optimal solutions.");
  mô tả "Chuyển hóa các bài toán vật lý phức tạp thành dữ liệu ra quyết định chính xác. Nhanh hơn, tinh gọn hơn, hiệu quả hơn.";
  nhãn "Kỹ sư R&D chuyên sâu về CFD"; nút "Dự án Demo" và "Yêu cầu mô phỏng".
- Đã **bỏ**: 4 thẻ thông số (5+, 10⁷, CHT·VOF, 24h); bảng HUD trong hero; thanh điều khiển cảnh; vạch tiến trình trong chấm.
- Góc phải dưới: nút YouTube & LinkedIn nổi + chatbot FAQ. Nút lên đầu trang ở góc trái dưới.
- Phong cách vật thể trong mô phỏng: **hình học kim loại mờ như phần mềm CFD, tránh kiểu hoạt hình/neon**.

## Hero CFD (phần quan trọng nhất — `src/components/FlowCanvas.astro`, `src/lib/lbm.ts`, `src/lib/lbm.worker.ts`)
- Bộ giải **Lattice-Boltzmann D2Q9 (BGK) chạy thật** trong Web Worker. 5 cảnh (giữ nguyên, không thêm HVAC):
  1. Dãy xoáy Kármán sau trụ · 2. Thất tốc cánh NACA 0012 16° · 3. Khí động học xe · 4. Bó ống trao đổi nhiệt · 5. Tia phun Kelvin–Helmholtz.
- Vật thể đặt ở **nửa phải** để không bị chữ che (cảnh 1, 2, 5 đã dời phải).
- **2 worker luân phiên**: worker rảnh tính trước cảnh kế tiếp → chuyển cảnh hòa mờ, **không có màn hình đen**. Mỗi cảnh 16 s.
- Điều hướng chỉ bằng **các chấm** ở đáy hero; bấm chấm đang chọn để tạm dừng/chạy. Hero luôn tự chạy.
- Cảnh xe dùng **ảnh render 3D thật** `public/hero/car.webp` (tách nền từ `src/assets/hero/car-source.png` bằng `node scripts/prepare-car.mjs`);
  đường bao xe cho bộ giải sinh tự động vào `src/lib/carOutline.ts`. Bánh xe là sprite `public/hero/wheel.webp` **quay theo ω = U/r**,
  tâm bánh tìm bằng đối xứng quay 72° của mâm (đừng sửa tay tọa độ bánh).
- Biên: cửa vào vận tốc, cửa ra áp suất ρ = 1, mặt đường chuyển động (cảnh xe). Kiểm tra ổn định bằng cách chạy ≥ 9000 bước.

## Nội dung mẫu cần chủ dự án thay
- 5 dự án & 3 bài blog có `sample: true` là **nội dung mẫu** (số liệu minh họa) — chủ dự án sẽ thay số liệu thật rồi xóa `sample: true`.
- `public/cv/hieu-vu-cv.pdf` là CV giữ chỗ. Trang Giới thiệu còn `[Tên trường…]`, chứng chỉ chưa điền.
- Ảnh xe trong hero có dấu hiệu tạo bằng AI — chủ dự án cần chắc chắn quyền sử dụng trước khi go-live.

## Cách làm việc chủ dự án ưa thích
- Muốn kết quả "wow", chân thật, chuẩn kỹ thuật; không thích hình hoạt hình/giả.
- Thích xem demo chạy được: sau mỗi thay đổi, build và chạy demo (`npm run build && npm start`) để chủ dự án xem tại http://localhost:3000.
- Máy của chủ dự án đang **tắt hiệu ứng chuyển động** trong Windows — đừng để animation phụ thuộc `prefers-reduced-motion`.
