// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://hieuvuengineering.com',
  // Các trang được build sẵn thành HTML tĩnh (nhanh, chuẩn SEO);
  // riêng /api/* chạy trên Node.js (form liên hệ, newsletter).
  output: 'static',
  adapter: node({ mode: 'standalone' }),
  trailingSlash: 'ignore',
  // Nghe trên mọi địa chỉ (IPv4 + IPv6) để mở được cả http://localhost và http://127.0.0.1
  server: { host: true, port: 4321 },
  i18n: {
    defaultLocale: 'vi',
    locales: ['vi', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    mdx(),
    sitemap({
      i18n: { defaultLocale: 'vi', locales: { vi: 'vi-VN', en: 'en-US' } },
      // /solutions, /exercises: trang khung chưa có nội dung (noindex) — bỏ khỏi sitemap tới khi hoàn thiện
      filter: (page) => !page.includes('/api/') && !page.endsWith('/404/') && !/\/(solutions|exercises)\/$/.test(page),
    }),
  ],
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  // Ép kiểu: lệch định nghĩa type Vite giữa Astro và Tailwind (không ảnh hưởng chạy thật)
  vite: { plugins: [/** @type {any} */ (tailwindcss())] },
});
