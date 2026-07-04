// ABOUTME: Shared content helpers for post retrieval, taxonomy grouping, and display formatting.
// ABOUTME: Keeps localized post collections filtered before pages render lists and feeds.

import { getCollection } from "astro:content";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
import { DEFAULT_LANGUAGE, getLanguageFromPost, type SiteLanguage } from "~/i18n";

export { formatDate } from "./date.ts";
export { getKeywordSummary, getPostTaxonomySummary } from "./post-taxonomy";

export async function getCategories(language: SiteLanguage = DEFAULT_LANGUAGE) {
  const posts = await getPosts({ language });

  const categories = new Map<string, Post[]>();

  posts.forEach((post) => {
    if (post.data.categories) {
      post.data.categories.forEach((c) => {
        const posts = categories.get(c) || [];
        posts.push(post);
        categories.set(c, posts);
      });
    }
  });

  return categories;
}

export async function getPosts(options: { language?: SiteLanguage } = {}) {
  const posts = await getCollection("posts");
  const language = options.language ?? DEFAULT_LANGUAGE;
  const localizedPosts = posts.filter((post) => getLanguageFromPost(post) === language);
  localizedPosts.sort((a, b) => {
    return b.data.pubDate.getTime() - a.data.pubDate.getTime();
  });
  return localizedPosts;
}

const parser = new MarkdownIt();

export function getPostDescription(post: Post) {
  if (post.data.description) {
    return post.data.description;
  }

  const html = parser.render(post.body ?? "");
  const sanitized = sanitizeHtml(html, { allowedTags: [] });
  return sanitized.slice(0, 400);
}

export function getPathFromCategory(
  category: string,
  category_map: { name: string; path: string }[],
) {
  const mappingPath = category_map.find((l) => l.name === category);
  return mappingPath ? mappingPath.path : category;
}

export const isProduction = process.env.NODE_ENV === "production";
