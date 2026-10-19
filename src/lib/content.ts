import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '@/i18n/ui';

export type Project = CollectionEntry<'projects'>;
export type Post = CollectionEntry<'blog'>;

export const langOf = (id: string): Lang => (id.startsWith('en/') ? 'en' : 'vi');
export const slugOf = (id: string) => id.split('/').slice(1).join('/');

const visible = (draft: boolean) => !draft || import.meta.env.DEV;

export async function getProjects(lang: Lang) {
  const all = await getCollection('projects', (e) => langOf(e.id) === lang && visible(e.data.draft));
  return all.sort((a, b) => Number(b.data.featured) - Number(a.data.featured) || b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getPosts(lang: Lang) {
  const all = await getCollection('blog', (e) => langOf(e.id) === lang && visible(e.data.draft));
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** Kiểm tra bản dịch tương ứng có tồn tại không (để nút chuyển ngôn ngữ trỏ đúng) */
export async function hasTranslation(collection: 'projects' | 'blog', slug: string, lang: Lang) {
  const all = await getCollection(collection);
  return all.some((e) => e.id === `${lang}/${slug}`);
}

export function readingTime(body: string | undefined, lang: Lang) {
  const words = (body ?? '').replace(/<[^>]+>|[#*`>\-|]/g, ' ').split(/\s+/).filter(Boolean).length;
  // Tiếng Việt nhiều âm tiết ngắn → tốc độ đọc theo "từ" cao hơn
  return Math.max(1, Math.round(words / (lang === 'vi' ? 280 : 220)));
}
