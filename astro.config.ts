import { defineConfig } from "astro/config";
import UnoCSS from "unocss/astro";
import { THEME_CONFIG } from "./src/theme.config";
import robotsTxt from "astro-robots-txt";
import partytown from "@astrojs/partytown";
import { unified } from "@astrojs/markdown-remark";

import mdx from "@astrojs/mdx";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { SITE_BASE_PATH, withBasePath } from "./src/i18n";

// https://astro.build/config
export default defineConfig({
  site: THEME_CONFIG.website,
  base: SITE_BASE_PATH,
  compressHTML: true,
  prefetch: true,
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [
        [
          rehypeKatex,
          {
            // Katexプラグインのオプション
          },
        ],
      ],
    }),
    shikiConfig: {
      theme: "one-dark-pro",
      langs: [],
      wrap: true,
    },
  },
  integrations: [
    UnoCSS({
      mode: "per-module",
      injectReset: true,
    }),
    robotsTxt({
      sitemap: new URL(withBasePath("/sitemap.xml"), THEME_CONFIG.website).toString(),
    }),
    mdx(),
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
  ],
});
