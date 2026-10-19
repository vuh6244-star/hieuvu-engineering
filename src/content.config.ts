import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/*
  Cấu trúc file:  src/content/<collection>/<vi|en>/<slug>.mdx
  Cùng <slug> ở 2 thư mục = 2 bản ngôn ngữ của cùng một nội dung.
*/

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      category: z.enum(['energy', 'aero', 'hvac', 'turbo', 'thermal', 'multiphase']),
      industry: z.string(),
      tools: z.array(z.string()).default(['Simcenter STAR-CCM+']),
      /** Ảnh bìa thật (đặt trong src/assets/projects/). Bỏ trống → dùng ảnh minh họa dòng chảy tự sinh */
      cover: image().optional(),
      coverAlt: z.string().optional(),
      /** Hình minh họa tự sinh khi chưa có ảnh thật */
      art: z.enum(['car', 'datacenter', 'pump', 'battery', 'mixer', 'airfoil', 'furnace']).default('airfoil'),
      /** Video YouTube (ID) — tùy chọn */
      youtube: z.string().optional(),
      metrics: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
      featured: z.boolean().default(false),
      /** true = nội dung mẫu do AI soạn, cần thay bằng số liệu thật */
      sample: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      category: z.enum(['tutorial', 'fundamentals', 'case-study', 'tips']),
      tags: z.array(z.string()).default([]),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      art: z.enum(['car', 'datacenter', 'pump', 'battery', 'mixer', 'airfoil', 'furnace']).default('airfoil'),
      readingTime: z.number().optional(),
      sample: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
});

export const collections = { projects, blog };
