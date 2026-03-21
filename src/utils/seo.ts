// ABOUTME: SEO helpers for canonical URLs and structured data emitted by the Astro layouts.
// ABOUTME: Keeps indexing signals consistent across homepage, archive pages, and individual posts.

type StructuredDataValue =
  | string
  | number
  | boolean
  | null
  | StructuredData
  | StructuredDataValue[]

type StructuredData = {
  [key: string]: StructuredDataValue
}

type WebSiteStructuredDataInput = {
  author: string
  canonical: string
  description: string
  inLanguage: string
  title: string
}

type ArticleStructuredDataInput = WebSiteStructuredDataInput & {
  imageUrl: string
  publishedTime: Date
}

export function normalizeCanonicalUrl(url: URL) {
  const canonical = new URL(url.toString())

  if (!canonical.pathname.endsWith('/')) {
    canonical.pathname = `${canonical.pathname}/`
  }

  canonical.hash = ''

  return canonical.toString()
}

export function createWebSiteStructuredData({
  author,
  canonical,
  description,
  inLanguage,
  title
}: WebSiteStructuredDataInput): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    author: {
      '@type': 'Person',
      name: author
    },
    description,
    inLanguage,
    name: title,
    url: canonical
  }
}

export function createArticleStructuredData({
  author,
  canonical,
  description,
  imageUrl,
  inLanguage,
  publishedTime,
  title
}: ArticleStructuredDataInput): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    author: {
      '@type': 'Person',
      name: author
    },
    datePublished: publishedTime.toISOString(),
    description,
    headline: title,
    image: imageUrl,
    inLanguage,
    mainEntityOfPage: canonical,
    url: canonical
  }
}
