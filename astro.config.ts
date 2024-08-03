import { defineConfig } from "astro/config";
import UnoCSS from "unocss/astro";
import { THEME_CONFIG } from "./src/theme.config";
import robotsTxt from "astro-robots-txt";
import sitemap from "@astrojs/sitemap";
import partytown from "@astrojs/partytown";

import mdx from "@astrojs/mdx";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

// https://astro.build/config
export default defineConfig({
  site: THEME_CONFIG.website,
  base: "/web-nikki",
  prefetch: true,
  markdown: {
    shikiConfig: {
      theme: "one-dark-pro",
      langs: [],
      wrap: true,
    },
    remarkPlugins: [remarkMath],
    rehypePlugins: [
      [
        rehypeKatex,
        {
          // Katexプラグインのオプション
        },
      ],
    ],
  },
  integrations: [
    UnoCSS({
      injectReset: true,
    }),
    robotsTxt(),
    sitemap(),
    mdx(),
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
  ],
});
