/*
  Logo màu chính hãng của các mạng xã hội (SVG viewBox 0 0 24 24) — dùng chung cho chân trang và dải kênh.
  TikTok: lớp chính theo `currentColor` để đọc được trên cả nền sáng lẫn tối.
*/
const tiktokNote = 'M16.6 5.2A4.3 4.3 0 0 1 15.5 2.4h-3.1v12.5a2.6 2.6 0 1 1-1.8-2.5V9.3a5.7 5.7 0 1 0 4.9 5.6V8.6a7.3 7.3 0 0 0 4.3 1.4V6.9a4.3 4.3 0 0 1-3.2-1.7z';

export const brandLogos: Record<string, string> = {
  youtube: '<rect x="1" y="4.5" width="22" height="15" rx="4.5" fill="#FF0000"/><path d="M10 8.6v6.8l5.8-3.4z" fill="#fff"/>',
  linkedin:
    '<rect x="1.5" y="1.5" width="21" height="21" rx="3.5" fill="#0A66C2"/><path fill="#fff" d="M6.3 9.6h2.6V18H6.3zM7.6 5.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM10.5 9.6H13v1.2c.35-.66 1.2-1.36 2.47-1.36 2.64 0 3.13 1.74 3.13 4V18H16v-4.1c0-.98-.02-2.24-1.36-2.24-1.37 0-1.58 1.07-1.58 2.17V18h-2.6z"/>',
  facebook:
    '<path fill="#0866FF" d="M9.1 23.7v-8H6.6V12h2.5v-1.6c0-4.1 1.8-6 5.9-6 .4 0 1 0 1.5.1.4 0 .8.1 1.1.2V8l-.7-.1h-.7c-.7 0-1.3.1-1.7.3-.3.2-.5.4-.7.6-.3.4-.4 1-.4 1.8V12h3.9l-.4 2.1-.3 1.6h-3.2V24C19.4 23.2 24 18.2 24 12 24 5.4 18.6 0 12 0S0 5.4 0 12c0 5.6 3.9 10.4 9.1 11.7z"/>',
  tiktok: `<g transform="translate(-0.9 -0.6)"><path fill="#25F4EE" d="${tiktokNote}"/></g><g transform="translate(0.9 0.6)"><path fill="#FE2C55" d="${tiktokNote}"/></g><path fill="currentColor" d="${tiktokNote}"/>`,
  zalo:
    '<rect x="1" y="1" width="22" height="22" rx="6" fill="#0068FF"/><path d="M5 6.5h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-7.5l-3.5 2.6v-2.6H5a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1z" fill="#fff"/><text x="12" y="13.6" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="5.6" font-weight="700" fill="#0068FF">Zalo</text>',
};
