# CLAUDE.md — Bối cảnh dự án cho Claude

Website thương hiệu cá nhân **Hiếu Vũ | Engineering** (kỹ sư mô phỏng CFD & R&D tại CFDWAYS).
File này ghi lại các quyết định đã thống nhất với chủ dự án để mọi phiên làm việc mới (ở bất kỳ máy nào) tiếp tục đúng hướng.
Trao đổi với chủ dự án bằng **tiếng Việt**.

## Chủ dự án & thương hiệu
- Tên: Hiếu Vũ — Kỹ sư mô phỏng CFD, kỹ sư R&D tại **CFDWAYS** (https://cfdways.com/vi/).
- Gọi CFDWAYS là **"đối tác phần mềm của Siemens Digital Industries Software"** (đúng như trang Đội ngũ của cfdways.com). Không ghi "đối tác cấp 1" trừ khi chủ dự án xác nhận được phép.
- Chỉ nhắc phần mềm hệ Siemens: Simcenter STAR-CCM+, NX, Simcenter Amesim, Simcenter FloEFD/FloTherm, Simcenter 3D. **Không nhắc phần mềm đối thủ.**
- Ngành trọng tâm theo CFDWAYS: Năng lượng & đốt cháy, Công nghiệp quá trình, HVAC & công trình, truyền nhiệt, bơm/quạt. Có kênh license Simcenter & đào tạo (chủ dự án hưởng hoa hồng khi tạo đơn cho CFDWAYS).
- Liên hệ: email hieuvu.sim@gmail.com · điện thoại +84764600921 (`site.hotline`) · địa chỉ Hà Nội, Việt Nam · Zalo 0862946306 · LinkedIn in/hieuvu2002 · YouTube @Hieuvuengineering · Facebook Hieuvu.engineering · TikTok @van.hieu.sim.
- Tên miền dự kiến: hieuvuengineering.com · Hosting dự kiến: Hostinger gói có **Node.js Web Apps** (Business Web Hosting trở lên).

## Công nghệ
- Astro 5 (output static + adapter `@astrojs/node` standalone), Tailwind CSS 4, MDX, song ngữ VI (`/`) / EN (`/en`).
- `server.mjs` là điểm chạy production (`npm start`), thêm header bảo mật. API: `/api/contact`, `/api/newsletter` (nodemailer, cấu hình SMTP qua biến môi trường — xem `.env.example`).
- Lệnh: `npm run dev` (4321) · `npm run build` · `npm start` (3000) · `npx astro check` phải 0 lỗi trước khi bàn giao.
- Hướng dẫn deploy: `docs/DEPLOY.md`. Kế hoạch nội dung & 20 chủ đề blog SEO: `docs/CONTENT-PLAN.md`.

## Thiết kế đã chốt
- Phông: **Inter** (sans-serif) cho cả tiêu đề; JetBrains Mono cho chữ kỹ thuật nhỏ. Không dùng phông kiểu cách.
- **Mọi tiêu đề mục dùng đúng kiểu chữ của hero**: class `.hd` (Inter đậm 700, chữ khít −0.03em) , **một màu** (trắng trên nền tối) — chủ dự án không muốn chữ tiêu đề tô màu/chuyển sắc; `.hd-hl` giữ lại nhưng không đổi màu. Chỉ hero giữ chữ "tối ưu." màu cyan. Không trộn chữ mảnh/đậm trong tiêu đề nữa. Viết hoa kiểu câu (chỉ chữ đầu + tên riêng).
- Màu: navy `#0F172A`/ink `#070B14`, cyan logo `#3ED6E0`. Có nút chuyển sáng/tối.
- **Trang chủ luôn ở giao diện tối** (`forceDark` trên BaseLayout, ẩn nút sáng/tối) để nền thống nhất từ hero tới chân trang — chủ dự án không muốn xen kẽ trắng/đen. Các trang khác vẫn theo lựa chọn sáng/tối.
- Hero: slogan **in đậm toàn bộ** "Từ dữ liệu dòng chảy, đến giải pháp tối ưu." (EN: "From flow data to optimal solutions.");
  mô tả "Chuyển hóa các bài toán vật lý phức tạp thành dữ liệu ra quyết định chính xác. Nhanh hơn, tinh gọn hơn, hiệu quả hơn.";
  nhãn "Kỹ sư R&D chuyên sâu về CFD"; nút "Dự án Demo" và "Yêu cầu mô phỏng".
- Đã **bỏ**: 4 thẻ thông số (5+, 10⁷, CHT·VOF, 24h); bảng HUD trong hero; thanh điều khiển cảnh; vạch tiến trình trong chấm.
- **Menu (thứ tự cố định, 19/10/2026):** Trang chủ `/` · Giải pháp `/solutions` · Blog `/blog` · Bài tập `/exercises` · Demo `/projects` · Liên hệ `/contact`.
  Giải pháp & Bài tập đang là trang khung trống (`src/views/PlaceholderView.astro`, noindex, ngoài sitemap) — chủ dự án sẽ bổ sung dần; khi có nội dung thì bỏ noindex và bộ lọc sitemap trong `astro.config.mjs`.
- Ngay dưới hero: **dải kênh YouTube · LinkedIn · TikTok** có logo màu (`src/components/ChannelStrip.astro`) — đã thay dải "Hệ sinh thái Siemens Xcelerator" (bỏ theo yêu cầu chủ dự án).
- **Khối "4 điểm thất bại của dự án CFD"** (`src/components/SolutionPillars.astro`) nằm ở **trang chủ, ngay dưới hero động** (hero giữ nguyên).
  Nền tối, tiêu đề mảnh + dòng đậm, 4 thẻ: Hình học & lưới · Mô hình vật lý · Kiểm chứng · Từ dữ liệu đến quyết định.
  Ảnh 4 thẻ do chủ dự án cung cấp (`src/assets/solutions/`: mesh, physics, verify, decision).
- **Khối 8 ngành CFD** (`src/components/IndustryGrid.astro`) ngay sau khối 4 điểm, cùng nền tối, icon nét mảnh gradient cyan→xanh.
  Di chuột → nội dung đẩy lên, nút "Xem Demo" trượt vào; bấm → `/projects?cat=<ngành>` (trang Demo tự lọc). Màn hình cảm ứng: nút luôn hiện.
  Nội dung 8 ngành đang chờ chủ dự án duyệt.
- **Khối "Connecting CFD Simulation with Digital Engineering"** (`src/components/DigitalEngineering.astro`) ngay sau khối 8 ngành: eyebrow, tiêu đề, phụ đề, chú thích do chủ dự án đặt (EN; bản VI dịch tương ứng).
  **Không dùng ảnh**: bảng mạch **3D bằng CSS 3D, nhìn thẳng (chỉ ngả ra sau, KHÔNG xoay chéo — chủ dự án không thích kiểu nghiêng), lưới 4×2 cân đối, chip ở giữa, 2 biển đối xứng**; mỗi khối mang **mô hình 3D thật** (hộp `cu`, trụ xếp đĩa `cy`, hình đùn khối `ex` — dữ liệu ở `models`), tên khắc ở mặt trước khối, biển cảnh báo là tấm 3D đứng; đường mạch SVG trên mặt bảng dựng lại từ ảnh mẫu của chủ dự án (8 khối giữ đúng icon: xe khung lưới + màn hình, màn hình bản đồ nhiệt, dashboard, thùng hàng, tủ máy chủ, bánh răng + cờ lê, CSDL + đồng hồ, biểu đồ tròn).
  Rê chuột/chạm → khối sáng, đường mạch liên quan sáng & chạy dòng (đã bỏ ô mô tả bên dưới sơ đồ theo yêu cầu chủ dự án). 2 nhãn điểm nghẽn (đỏ/cam) cũng tương tác.
  **Phím gạt "Trước CFD / Sau CFD"**: Sau CFD → mọi đường mạch xanh và chạy dòng, điểm nghẽn đỏ/cam thành xanh lá, 2 đường mới (CAE↔Data Historian, Analytics→BI) vẽ dần ra, chip thành lõi "CFD" phát sáng, 2 biển xanh "đã giải quyết" thay biển cảnh báo.
- Các khối tương tác có class `.motion-ok` → vẫn chạy hiệu ứng khi Windows tắt chuyển động (quy tắc giảm chuyển động trong `global.css` bỏ qua `.motion-ok`).
- Chân trang: tiêu đề cột đậm; cột Bản tin gồm form + email/điện thoại/địa chỉ liền khối; dòng dưới cùng bên phải là link **Chính sách bảo mật** (`/privacy`) · **Điều khoản sử dụng** (`/terms`) — nội dung ở `src/views/LegalView.astro`, bản soạn sẵn, chủ dự án nên rà lại trước khi go-live.
- Góc phải dưới: nút YouTube & LinkedIn nổi (chỉ PC) + chatbot FAQ. Nút lên đầu trang ở góc trái dưới.
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
- **Không có CV và không có trang/tab Giới thiệu** (chủ dự án yêu cầu bỏ, 19/10/2026). Không thêm lại link/nút CV. Khối "Về tôi" (ảnh chân dung + giới thiệu ngắn, không có nút) nằm ở **trang Liên hệ**, dưới form — đã chuyển khỏi trang chủ. Ảnh chân dung: `src/assets/portrait.jpg` (chủ dự án cung cấp, 19/10/2026).
- Ảnh xe trong hero: chủ dự án đã xác nhận OK.

## Cách làm việc chủ dự án ưa thích
- Muốn kết quả "wow", chân thật, chuẩn kỹ thuật; không thích hình hoạt hình/giả.
- Thích xem demo chạy được: sau mỗi thay đổi, build và chạy demo (`npm run build && npm start`) để chủ dự án xem tại http://localhost:3000.
- Máy của chủ dự án đang **tắt hiệu ứng chuyển động** trong Windows — đừng để animation phụ thuộc `prefers-reduced-motion`.
