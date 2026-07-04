// ABOUTME: Pure helpers for rendering post categories and keywords in archive and detail views.
// ABOUTME: Keeps taxonomy formatting testable without depending on Astro content loading.

import { formatDate } from './date.ts'

export function getKeywordSummary(post: Pick<Post, 'data'>, limit = 3) {
  return post.data.keywords.slice(0, limit).join(' / ')
}

export function getPostTaxonomySummary(
  post: Pick<Post, 'data'>,
  options?: { includeDate?: boolean }
) {
  const parts: string[] = []

  if (options?.includeDate) {
    parts.push(formatDate(post.data.pubDate))
  }

  if (post.data.categories.length > 0) {
    parts.push(post.data.categories.join(' / '))
  }

  const keywordSummary = getKeywordSummary(post)
  if (keywordSummary) {
    parts.push(keywordSummary)
  }

  return parts.join(' — ')
}
