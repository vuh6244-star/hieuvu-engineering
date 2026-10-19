import type { Lang } from '@/i18n/ui';

type L<T = string> = Record<Lang, T>;

/* ============================================================
   THÔNG TIN CÁ NHÂN — chỉnh sửa tại đây là cập nhật toàn site
   ============================================================ */
export const site = {
  name: 'Hiếu Vũ',
  nameAscii: 'Hieu Vu',
  brand: 'Hiếu Vũ | Engineering',
  url: 'https://hieuvuengineering.com',
  email: 'hieuvu.sim@gmail.com',
  phone: '0862946306', // Zalo
  hotline: '+84764600921',
  address: { vi: 'Hà Nội, Việt Nam', en: 'Hanoi, Vietnam' } as L,
  company: 'CFDWAYS',
  companyUrl: { vi: 'https://cfdways.com/vi/', en: 'https://cfdways.com/' } as L,
  role: {
    vi: 'Kỹ sư mô phỏng CFD · Kỹ sư R&D',
    en: 'CFD Simulation Engineer · R&D Engineer',
  } as L,
  location: { vi: 'Việt Nam', en: 'Vietnam' } as L,
  description: {
    vi: 'Hiếu Vũ — Kỹ sư mô phỏng CFD & R&D tại CFDWAYS. Mô phỏng khí động học, HVAC, truyền nhiệt và turbomachinery bằng Simcenter STAR-CCM+. Dịch vụ mô phỏng và chia sẻ kiến thức CFD.',
    en: 'Hieu Vu — CFD Simulation & R&D Engineer at CFDWAYS. Aerodynamics, HVAC, heat transfer and turbomachinery simulation with Simcenter STAR-CCM+. Simulation services and CFD knowledge sharing.',
  } as L,
  bioShort: {
    vi: 'Tôi là kỹ sư mô phỏng CFD và R&D tại CFDWAYS — công ty kỹ thuật mô phỏng tại Hà Nội, đối tác phần mềm của Siemens Digital Industries Software. Tôi dùng Simcenter STAR-CCM+ để giúp doanh nghiệp giảm tiêu hao, giảm phát thải và kiểm chứng thiết kế trước khi chế tạo.',
    en: 'I am a CFD simulation and R&D engineer at CFDWAYS — a Hanoi-based simulation engineering company and Siemens Digital Industries Software partner. I use Simcenter STAR-CCM+ to help companies cut energy use and emissions and verify designs before anything is built.',
  } as L,
};

export const socials = [
  { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/hieuvu2002', handle: 'in/hieuvu2002' },
  { id: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/@Hieuvuengineering', handle: '@Hieuvuengineering' },
  { id: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/Hieuvu.engineering/', handle: 'Hieuvu.engineering' },
  { id: 'tiktok', label: 'TikTok', href: 'https://www.tiktok.com/@van.hieu.sim', handle: '@van.hieu.sim' },
  { id: 'zalo', label: 'Zalo', href: 'https://zalo.me/0862946306', handle: '0862 946 306' },
] as const;

/* Bộ công cụ — chỉ hệ sinh thái Siemens Xcelerator */
export const toolset = [
  { name: 'Simcenter STAR-CCM+', role: { vi: 'CFD đa vật lý', en: 'Multiphysics CFD' } as L },
  { name: 'Siemens NX', role: { vi: 'CAD & chuẩn bị hình học', en: 'CAD & geometry prep' } as L },
  { name: 'Simcenter Amesim', role: { vi: 'Mô phỏng hệ thống 1D', en: '1D system simulation' } as L },
  { name: 'Simcenter FloEFD / FloTherm', role: { vi: 'Nhiệt điện tử & CFD trong CAD', en: 'Electronics cooling & CAD-embedded CFD' } as L },
  { name: 'Simcenter 3D', role: { vi: 'Kết cấu & đa vật lý', en: 'Structural & multiphysics' } as L },
];

/* Chuyên đề — dùng cho bộ lọc dự án */
export const projectCategories = {
  energy: { vi: 'Năng lượng & Đốt cháy', en: 'Energy & Combustion' },
  aero: { vi: 'Khí động học', en: 'Aerodynamics' },
  hvac: { vi: 'HVAC & Data Center', en: 'HVAC & Data Center' },
  turbo: { vi: 'Turbomachinery', en: 'Turbomachinery' },
  thermal: { vi: 'Nhiệt & Pin', en: 'Thermal & Battery' },
  multiphase: { vi: 'Quá trình & Đa pha', en: 'Process & Multiphase' },
} as const;
export type ProjectCategory = keyof typeof projectCategories;

export const blogCategories = {
  tutorial: { vi: 'Hướng dẫn STAR-CCM+', en: 'STAR-CCM+ Tutorial' },
  fundamentals: { vi: 'Kiến thức CFD', en: 'CFD Fundamentals' },
  'case-study': { vi: 'Case Study', en: 'Case Study' },
  tips: { vi: 'Mẹo & Kinh nghiệm', en: 'Tips & Lessons' },
} as const;
export type BlogCategory = keyof typeof blogCategories;

/* Dịch vụ — bám theo các nhóm ngành trọng tâm của CFDWAYS. id dùng để form liên hệ chọn sẵn (?service=...) */
export const services: { id: string; icon: string; title: L; desc: L }[] = [
  {
    id: 'energy',
    icon: 'flame',
    title: { vi: 'Năng lượng & đốt cháy', en: 'Energy & combustion' },
    desc: { vi: 'Buồng đốt, lò hơi, nồi hơi thu hồi nhiệt và hệ xử lý khí thải — giảm tiêu hao nhiên liệu và phát thải.', en: 'Furnaces, boilers, HRSGs and flue-gas treatment — lower fuel consumption and emissions.' },
  },
  {
    id: 'multiphase',
    icon: 'droplets',
    title: { vi: 'Công nghiệp quá trình', en: 'Process industry' },
    desc: { vi: 'Sấy, sấy phun, lọc bụi, khuấy trộn và thiết bị phản ứng cho xi măng, hóa chất, thực phẩm.', en: 'Drying, spray drying, dust collection, mixing and reactors for cement, chemicals and food.' },
  },
  {
    id: 'hvac',
    icon: 'server',
    title: { vi: 'HVAC, công trình & Data Center', en: 'HVAC, buildings & data centers' },
    desc: { vi: 'Phân bố nhiệt độ, luồng gió và tiện nghi nhiệt cho nhà xưởng, phòng sạch, kho lạnh, phòng máy chủ.', en: 'Temperature, airflow and comfort for factories, cleanrooms, cold storage and server rooms.' },
  },
  {
    id: 'thermal',
    icon: 'thermometer',
    title: { vi: 'Truyền nhiệt & quản lý nhiệt', en: 'Heat transfer & thermal management' },
    desc: { vi: 'Bộ trao đổi nhiệt, tủ điện, linh kiện điện tử và pack pin — kiểm soát nhiệt độ, tránh quá nhiệt và kéo dài tuổi thọ thiết bị.', en: 'Heat exchangers, electrical cabinets, electronics and battery packs — keep temperatures in check, avoid overheating and extend equipment life.' },
  },
  {
    id: 'turbo',
    icon: 'fan',
    title: { vi: 'Bơm, quạt & khí động học', en: 'Pumps, fans & aerodynamics' },
    desc: { vi: 'Đường đặc tính, hiệu suất, xâm thực và tải gió cho bơm, quạt, đường ống và công trình.', en: 'Performance curves, efficiency, cavitation and wind loads for pumps, fans, ducts and structures.' },
  },
  {
    id: 'training',
    icon: 'graduation',
    title: { vi: 'Đào tạo & license Simcenter', en: 'Training & Simcenter licenses' },
    desc: { vi: 'Đào tạo Simcenter STAR-CCM+ trên bài toán của chính đơn vị bạn; tư vấn bản quyền phần mềm Simcenter qua CFDWAYS.', en: 'Simcenter STAR-CCM+ training on your own problems; Simcenter software licensing through CFDWAYS.' },
  },
];

/* Ba hình thức hợp tác (theo mô hình của CFDWAYS) */
export const engagement: { title: L; desc: L; service: string }[] = [
  { title: { vi: 'Mô phỏng theo dự án', en: 'Project-based simulation' }, desc: { vi: 'Thuê trọn gói: từ đặt bài toán đến báo cáo và khuyến nghị.', en: 'Turnkey: from problem definition to report and recommendations.' }, service: 'energy' },
  { title: { vi: 'License Simcenter', en: 'Simcenter licenses' }, desc: { vi: 'Mua bản quyền để đội ngũ của bạn tự chạy, có kỹ sư hỗ trợ.', en: 'License the software for your own team, with engineer support.' }, service: 'license' },
  { title: { vi: 'Đào tạo & chuyển giao', en: 'Training & transfer' }, desc: { vi: 'Đào tạo đội ngũ tự làm trên chính dữ liệu của đơn vị.', en: 'Train your team to do it themselves on your own data.' }, service: 'training' },
];

export const process: { title: L; desc: L }[] = [
  { title: { vi: 'Trao đổi bài toán', en: 'Define the problem' }, desc: { vi: 'Làm rõ mục tiêu, điều kiện vận hành và dữ liệu CAD sẵn có.', en: 'Clarify goals, operating conditions and available CAD.' } },
  { title: { vi: 'Đề xuất & báo giá', en: 'Scope & quotation' }, desc: { vi: 'Phương án mô hình hóa, độ chính xác, tiến độ và chi phí rõ ràng.', en: 'Modelling approach, accuracy targets, timeline and cost.' } },
  { title: { vi: 'Mô phỏng & kiểm chứng', en: 'Simulate & verify' }, desc: { vi: 'Độc lập lưới, kiểm tra hội tụ, đối chiếu thực nghiệm khi có.', en: 'Mesh independence, convergence checks, validation where data exists.' } },
  { title: { vi: 'Báo cáo & hỗ trợ', en: 'Report & support' }, desc: { vi: 'Báo cáo kỹ thuật, hình ảnh/video trực quan và khuyến nghị thiết kế.', en: 'Engineering report, visuals and design recommendations.' } },
];

/* Ý tưởng dự án/bài viết "để sẵn tên" — hoàn thiện dần rồi chuyển thành file .mdx */
export const upcomingProjects: { title: L; category: ProjectCategory }[] = [
  { title: { vi: 'Phân bố khí trong lọc bụi tĩnh điện', en: 'Gas distribution in an electrostatic precipitator' }, category: 'multiphase' },
  { title: { vi: 'Tản nhiệt tủ điện ngoài trời dưới bức xạ mặt trời', en: 'Outdoor electrical cabinet under solar load' }, category: 'thermal' },
  { title: { vi: 'Hiệu suất bình ngưng nhà máy nhiệt điện', en: 'Power-plant condenser performance' }, category: 'thermal' },
];

export const upcomingPosts: { title: L; category: BlogCategory }[] = [
  { title: { vi: 'Mô phỏng đốt cháy trong STAR-CCM+: chọn mô hình nào?', en: 'Combustion modelling in STAR-CCM+: which model?' }, category: 'fundamentals' },
  { title: { vi: 'Chọn mô hình rối k-ω SST hay k-ε Realizable?', en: 'k-ω SST or Realizable k-ε: which turbulence model?' }, category: 'fundamentals' },
  { title: { vi: 'Tự động hóa STAR-CCM+ bằng Java macro', en: 'Automating STAR-CCM+ with Java macros' }, category: 'tutorial' },
  { title: { vi: 'Thiết lập MRF cho bơm ly tâm từng bước', en: 'Step-by-step MRF setup for a centrifugal pump' }, category: 'tutorial' },
  { title: { vi: 'Mesh independence study: làm đúng ngay từ đầu', en: 'Mesh independence studies done right' }, category: 'tips' },
];
