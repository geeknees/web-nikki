import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const posts = defineCollection({
  loader: glob({
    base: "./src/content/posts",
    pattern: "**/*.{md,mdx}",
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      pubDate: z.coerce.date(),
      language: z.enum(["ja", "en", "zh"]).default("ja"),
      translationKey: z.string().optional(),
      postSlug: z.string().optional(),
      customData: z.string().optional(),
      banner: image()
        .refine((img) => Math.max(img.width, img.height) <= 4096, {
          message: "Width and height of the banner must less than 4096 pixels",
        })
        .optional(),
      categories: z.array(z.string()),
      keywords: z.array(z.string()).default([]),
      author: z.string().optional(),
      commentsUrl: z.string().optional(),
      source: z
        .object({
          url: z.string(),
          title: z.string(),
        })
        .optional(),
      enclosure: z
        .object({
          url: z.string(),
          length: z.number(),
          type: z.string(),
        })
        .optional(),
    }),
});

export const collections = {
  posts,
};
