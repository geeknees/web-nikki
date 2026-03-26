// ABOUTME: Pure helpers for rendering post categories and keywords in archive and detail views.
// ABOUTME: Keeps taxonomy formatting testable without depending on Astro content loading.

function formatPostDate(date?: Date) {
  if (!date) return '--'

  const year = date.getFullYear().toString().padStart(4, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function getKeywordSummary(post: Pick<Post, 'data'>, limit = 3) {
  return post.data.keywords.slice(0, limit).join(' / ')
}

export function getPostTaxonomySummary(
  post: Pick<Post, 'data'>,
  options?: { includeDate?: boolean }
) {
  const parts: string[] = []

  if (options?.includeDate) {
    parts.push(formatPostDate(post.data.pubDate))
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
