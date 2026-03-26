// ABOUTME: Unit tests for SEO helper functions used by the main site layout.
// ABOUTME: Verifies canonical normalization and structured data payloads stay internally consistent.

import assert from 'node:assert/strict'

import {
  createArticleStructuredData,
  createWebSiteStructuredData,
  normalizeCanonicalUrl
} from '../../src/utils/seo.ts'
import { getHomepageCategorySelections } from '../../src/content/post-categories.ts'

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

const homepageSelections = getHomepageCategorySelections(
  [
    {
      slug: '2026-03-05',
      data: { categories: ['AIとインターネット'] }
    },
    {
      slug: '2025-12-01',
      data: { categories: ['個人史と暮らし'] }
    },
    {
      slug: '2025-07-04',
      data: { categories: ['AIとインターネット', 'プロダクト'] }
    },
    {
      slug: '2025-04-21_rubykaigi',
      data: { categories: ['RubyKaigi', '個人史と暮らし'] }
    },
    {
      slug: '2025-03-23',
      data: { categories: ['個人史と暮らし'] }
    },
    {
      slug: '2024-11-19_ai_and_human',
      data: { categories: ['教育', 'AIとインターネット'] }
    },
    {
      slug: '2024-10-27_the_art_of_maintaining_the_world',
      data: { categories: ['AIとインターネット', '個人史と暮らし'] }
    },
    {
      slug: '2024-05-19_rubykaigi',
      data: { categories: ['RubyKaigi', '個人史と暮らし'] }
    },
    {
      slug: '2020-08-01',
      data: { categories: ['仕事と組織', 'プロダクト'] }
    },
    {
      slug: '2021-09-23',
      data: { categories: ['個人史と暮らし'] }
    }
  ] as Post[],
  ['2026-03-05', '2025-12-01', '2025-07-04', '2025-04-21_rubykaigi', '2025-03-23']
)

assert.deepEqual(
  homepageSelections.map(({ category, post }) => [category, post.slug]),
  [
    ['仕事と組織', '2020-08-01'],
    ['教育', '2024-11-19_ai_and_human'],
    ['AIとインターネット', '2024-10-27_the_art_of_maintaining_the_world'],
    ['RubyKaigi', '2024-05-19_rubykaigi'],
    ['個人史と暮らし', '2021-09-23']
  ]
)

console.log('unit: seo helpers passed')
