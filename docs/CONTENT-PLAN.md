# Kế hoạch nội dung & định vị thương hiệu

## 1. Định vị (Bước 1 — Mục tiêu & phạm vi)

**Tuyên bố sứ mệnh:**
> Giúp doanh nghiệp và kỹ sư Việt Nam ra quyết định thiết kế nhanh và chắc chắn hơn nhờ mô phỏng CFD có kiểm chứng — đồng thời lan tỏa kiến thức mô phỏng một cách bài bản.

**Đối tượng ưu tiên & điều họ cần thấy**

| Nhóm | Họ cần thấy đầu tiên | Hành động mong muốn |
|---|---|---|
| Khách hàng doanh nghiệp (ưu tiên 1 — tạo đơn hàng cho CFDWAYS) | Dự án có số liệu, quy trình rõ ràng, uy tín CFDWAYS (đối tác phần mềm Siemens, 35 dự án tại 6 quốc gia) | Gửi yêu cầu mô phỏng / nhắn Zalo |
| Kỹ sư cùng ngành | Chiều sâu kỹ thuật (lưới, mô hình rối, kiểm chứng) | Kết nối LinkedIn, theo dõi blog |
| Người học CFD | Bài hướng dẫn dễ hiểu, công cụ (máy tính y+) | Đăng ký YouTube / newsletter, hỏi đào tạo |

**Thông điệp cốt lõi:** *"Mô phỏng dòng chảy, kiến tạo quyết định."* — kết quả CFD phải trả lời câu hỏi thiết kế, không chỉ là hình đẹp.

**Phễu chuyển đổi trên website**
Hero → Thông số năng lực → Về tôi → **Dịch vụ (mỗi thẻ dẫn tới form, chọn sẵn loại dịch vụ)** → Quy trình → Dự án → Bài viết → CTA cuối (Form · Zalo · Email). Trợ lý chat và nút "Tôi có bài toán tương tự" trên từng dự án là các điểm chuyển đổi phụ.

## 2. Phân tích 3 website tham khảo → áp dụng

| Website | Điểm mạnh | Đã áp dụng |
|---|---|---|
| **lenzo.com/earlyaccess** | Nền sáng, thanh menu dạng "viên thuốc" nổi, các khối tối bo góc lớn đặt trên nền sáng, thẻ thông số kiểu spec-sheet (icon + số lớn) | Menu nổi bo tròn; hero, quy trình, CTA là "khối ink" bo góc 28px ở cả 2 chế độ; dải 4 thẻ thông số năng lực |
| **marvell.com/ai-data-center** | Tiêu đề lớn đậm, bố cục chia đôi chữ/ảnh, lưới ảnh minh họa theo chủ đề, giọng văn "vấn đề → giải pháp" | Dự án trình bày Bài toán → Phương pháp → Kết quả; lưới thẻ dự án theo chuyên đề; case study Data Center |
| **indx.com** | Hero tối, chữ rất lớn trộn nét mảnh + nét đậm, đồ họa đường dòng 3D phát sáng, dải logo đối tác | Tiêu đề trộn Light/Bold xuyên suốt; hero là **mô phỏng dòng chảy thật** (cánh Joukowski) thay cho đồ họa tĩnh; dải công cụ Siemens Xcelerator |

## 3. Bio

**Bio ngắn (≈ 40 từ — dùng cho LinkedIn, chữ ký email)**
> Kỹ sư mô phỏng CFD & R&D tại CFDWAYS — đối tác phần mềm của Siemens Digital Industries Software. Tôi dùng Simcenter STAR-CCM+ để giảm tiêu hao, giảm phát thải và kiểm chứng thiết kế trước khi chế tạo.

**Bio:** trang Giới thiệu đã bỏ (10/2026); bio ngắn nằm ở `src/data/site.ts` → `bioShort`.

## 4. 20 chủ đề blog chuẩn SEO

| # | Tiêu đề đề xuất | Từ khóa chính | Chuyên mục |
|---|---|---|---|
| 1 | ✅ y+ là gì? Cách chọn chiều dày lớp lưới biên trong STAR-CCM+ | y+ CFD, prism layer | Hướng dẫn |
| 2 | ✅ 5 bước kiểm tra hội tụ cho mô phỏng CFD | hội tụ CFD, residual | Mẹo |
| 3 | ✅ Lưới Polyhedral hay Trimmed trong STAR-CCM+? | polyhedral mesh | Kiến thức |
| 4 | CFD là gì? Giải thích cho người mới bắt đầu | CFD là gì | Kiến thức |
| 5 | k-ω SST hay k-ε Realizable: chọn mô hình rối nào? | mô hình rối k-omega SST | Kiến thức |
| 6 | Mesh independence study: làm đúng ngay từ đầu (có GCI) | mesh independence | Mẹo |
| 7 | Thiết lập MRF cho bơm ly tâm từng bước | MRF STAR-CCM+ | Hướng dẫn |
| 8 | Mô phỏng truyền nhiệt liên hợp (CHT) cho tản nhiệt điện tử | CHT simulation | Hướng dẫn |
| 9 | Tự động hóa STAR-CCM+ bằng Java macro | STAR-CCM+ macro | Hướng dẫn |
| 10 | Điều kiện biên inlet/outlet: những lỗi hay gặp | điều kiện biên CFD | Mẹo |
| 11 | Mô phỏng làm mát Data Center: từ CRAC đến hot-aisle | data center CFD | Case study |
| 12 | Tính hệ số cản Cd cho xe bằng CFD | hệ số cản khí động | Case study |
| 13 | Mô phỏng xâm thực trong bơm và van | cavitation CFD | Kiến thức |
| 14 | VOF trong STAR-CCM+: mô phỏng mặt thoáng | VOF multiphase | Hướng dẫn |
| 15 | Steady hay Transient: khi nào cần mô phỏng không dừng? | transient CFD | Kiến thức |
| 16 | Đồng mô phỏng Amesim + STAR-CCM+ cho quản lý nhiệt pin | battery thermal simulation | Case study |
| 17 | Mô phỏng tiện nghi nhiệt PMV/PPD cho tòa nhà | HVAC CFD, PMV | Hướng dẫn |
| 18 | Hậu xử lý đẹp & đúng: scene, contour, streamline trong STAR-CCM+ | post-processing CFD | Mẹo |
| 19 | Lộ trình tự học CFD cho sinh viên cơ khí | học CFD | Kiến thức |
| 20 | Mô phỏng đốt cháy & phát thải NOx trong lò hơi | mô phỏng đốt cháy CFD | Kiến thức |

**Quy tắc SEO cho mỗi bài:** title 50–60 ký tự chứa từ khóa · description 140–160 ký tự · 1 H1 (tự động từ title), các mục H2/H3 · ảnh có `coverAlt` · liên kết nội bộ tới 1 dự án + 1 bài liên quan · kết bài có lời kêu gọi (form/Zalo).

## 5. Lịch đăng gợi ý

- Tuần 1–4: bài 4, 5, 6, 10 (nền tảng, kéo traffic tìm kiếm)
- Tuần 5–8: bài 7, 8, 12, 11 (hướng dẫn + case study → chuyển đổi khách hàng)
- Mỗi bài: cắt thành 1 video ngắn TikTok/YouTube Shorts + 1 bài LinkedIn dẫn link về website.
