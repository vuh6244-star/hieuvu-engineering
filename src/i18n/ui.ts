export const languages = { vi: 'Tiếng Việt', en: 'English' } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'vi';

export const ui = {
  vi: {
    'nav.home': 'Trang chủ',
    'nav.about': 'Giới thiệu',
    'nav.projects': 'Dự án',
    'nav.blog': 'Kiến thức',
    'nav.contact': 'Liên hệ',
    'nav.cta': 'Yêu cầu mô phỏng',
    'nav.menu': 'Mở menu',
    'nav.close': 'Đóng menu',
    'nav.skip': 'Bỏ qua tới nội dung chính',
    'theme.toggle': 'Chuyển giao diện sáng/tối',
    'lang.switch': 'Switch to English',
    'common.readMore': 'Xem chi tiết',
    'common.viewAll': 'Xem tất cả',
    'common.comingSoon': 'Sắp ra mắt',
    'common.sample': 'Nội dung mẫu',
    'common.minRead': 'phút đọc',
    'common.all': 'Tất cả',
    'common.backTop': 'Lên đầu trang',
    'common.downloadCv': 'Tải CV',
    'common.updated': 'Cập nhật',
    'footer.tagline': 'Mô phỏng dòng chảy & truyền nhiệt — biến dữ liệu CFD thành quyết định kỹ thuật.',
    'footer.newsletter': 'Bản tin kỹ thuật CFD',
    'footer.newsletterDesc': 'Mẹo Simcenter STAR-CCM+ và case study mới — tối đa 2 email/tháng.',
    'footer.subscribe': 'Đăng ký',
    'footer.emailPlaceholder': 'Email của bạn',
    'footer.subscribed': 'Cảm ơn bạn! Đăng ký đã được ghi nhận.',
    'footer.rights': 'Bảo lưu mọi quyền.',
    'footer.explore': 'Khám phá',
    'footer.connect': 'Kết nối',
    'projects.filter': 'Lọc theo chuyên đề',
    'projects.challenge': 'Bài toán',
    'projects.method': 'Phương pháp',
    'projects.result': 'Kết quả',
    'projects.tools': 'Công cụ',
    'projects.industry': 'Ngành',
    'projects.related': 'Dự án khác',
    'projects.upcoming': 'Đang thực hiện & sắp công bố',
    'blog.upcoming': 'Chủ đề sắp ra mắt',
    'blog.related': 'Bài viết liên quan',
    'blog.toc': 'Nội dung bài viết',
    'blog.share': 'Chia sẻ',
    'cta.title': 'Có bài toán dòng chảy cần giải?',
    'cta.desc': 'Gửi mô tả ngắn về sản phẩm hoặc hệ thống của bạn — tôi sẽ phản hồi trong vòng 24 giờ làm việc với hướng tiếp cận và phạm vi mô phỏng phù hợp.',
    'cta.primary': 'Gửi yêu cầu mô phỏng',
    'cta.zalo': 'Nhắn Zalo',
  },
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.projects': 'Projects',
    'nav.blog': 'Insights',
    'nav.contact': 'Contact',
    'nav.cta': 'Request a simulation',
    'nav.menu': 'Open menu',
    'nav.close': 'Close menu',
    'nav.skip': 'Skip to main content',
    'theme.toggle': 'Toggle light/dark theme',
    'lang.switch': 'Chuyển sang Tiếng Việt',
    'common.readMore': 'View details',
    'common.viewAll': 'View all',
    'common.comingSoon': 'Coming soon',
    'common.sample': 'Sample content',
    'common.minRead': 'min read',
    'common.all': 'All',
    'common.backTop': 'Back to top',
    'common.downloadCv': 'Download CV',
    'common.updated': 'Updated',
    'footer.tagline': 'Fluid flow & heat transfer simulation — turning CFD data into engineering decisions.',
    'footer.newsletter': 'CFD engineering newsletter',
    'footer.newsletterDesc': 'Simcenter STAR-CCM+ tips and new case studies — max 2 emails a month.',
    'footer.subscribe': 'Subscribe',
    'footer.emailPlaceholder': 'Your email',
    'footer.subscribed': 'Thank you! Your subscription has been recorded.',
    'footer.rights': 'All rights reserved.',
    'footer.explore': 'Explore',
    'footer.connect': 'Connect',
    'projects.filter': 'Filter by discipline',
    'projects.challenge': 'Challenge',
    'projects.method': 'Approach',
    'projects.result': 'Outcome',
    'projects.tools': 'Tools',
    'projects.industry': 'Industry',
    'projects.related': 'More projects',
    'projects.upcoming': 'In progress & coming soon',
    'blog.upcoming': 'Upcoming topics',
    'blog.related': 'Related articles',
    'blog.toc': 'On this page',
    'blog.share': 'Share',
    'cta.title': 'Have a flow problem to solve?',
    'cta.desc': 'Send a short description of your product or system — I will reply within one business day with a suitable approach and simulation scope.',
    'cta.primary': 'Send a simulation request',
    'cta.zalo': 'Message on Zalo',
  },
} as const;

export type UIKey = keyof (typeof ui)['vi'];

export function useTranslations(lang: Lang) {
  return (key: UIKey) => ui[lang][key] ?? ui[defaultLang][key];
}

export function getLangFromUrl(url: URL): Lang {
  const [, first] = url.pathname.split('/');
  return first === 'en' ? 'en' : 'vi';
}

/** Đường dẫn theo ngôn ngữ: localize('/projects', 'en') → '/en/projects' */
export function localize(path: string, lang: Lang): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (lang === defaultLang) return clean;
  return clean === '/' ? '/en' : `/en${clean}`;
}

/** Bỏ tiền tố ngôn ngữ để lấy đường dẫn gốc dùng cho trang tương ứng ở ngôn ngữ khác */
export function stripLang(pathname: string): string {
  const p = pathname.replace(/^\/en(?=\/|$)/, '');
  return p === '' ? '/' : p;
}

export function formatDate(date: Date, lang: Lang) {
  return new Intl.DateTimeFormat(lang === 'vi' ? 'vi-VN' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
}
