// ABOUTME: Unit tests for SEO helper functions used by the main site layout.
// ABOUTME: Verifies canonical normalization and structured data payloads stay internally consistent.

import assert from 'node:assert/strict'

import {
  createArticleStructuredData,
  createWebSiteStructuredData,
  normalizeCanonicalUrl
} from '../../src/utils/seo.ts'

const canonical = normalizeCanonicalUrl(
  new URL('https://geeknees.github.io/web-nikki')
)

assert.equal(canonical, 'https://geeknees.github.io/web-nikki/')

const websiteStructuredData = createWebSiteStructuredData({
  author: 'geeknees',
  canonical,
  description: "geeknees's Web日記（web-nikki）",
  inLanguage: 'ja-jp',
  title: 'Web日記（web-nikki）'
})

assert.equal(websiteStructuredData['@type'], 'WebSite')
assert.equal(websiteStructuredData.url, canonical)
assert.equal(websiteStructuredData.inLanguage, 'ja-jp')

const articleStructuredData = createArticleStructuredData({
  author: 'geeknees',
  canonical: 'https://geeknees.github.io/web-nikki/posts/2026-03-05/',
  description: 'SNS は壊れている。',
  imageUrl: 'https://geeknees.github.io/web-nikki/placeholder.png',
  inLanguage: 'ja-jp',
  publishedTime: new Date('2026-03-05T00:00:00.000Z'),
  title: 'SNS は壊れている – 特にX（旧Twitter）とYouTube'
})

assert.equal(articleStructuredData['@type'], 'BlogPosting')
assert.equal(articleStructuredData.inLanguage, 'ja-jp')
assert.equal(
  articleStructuredData.datePublished,
  '2026-03-05T00:00:00.000Z'
)
assert.equal(
  articleStructuredData.mainEntityOfPage,
  'https://geeknees.github.io/web-nikki/posts/2026-03-05/'
)

console.log('unit: seo helpers passed')
