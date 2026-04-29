// ABOUTME: Integration test for the Astro build output that search engines consume.
// ABOUTME: Builds the site and asserts the generated HTML, robots.txt, and sitemap include stable SEO signals.

import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, readdirSync, rmSync } from 'node:fs'
import { join } from 'node:path'

const cwd = process.cwd()

rmSync(join(cwd, 'dist'), { recursive: true, force: true })

execFileSync('pnpm', ['build'], {
  cwd,
  stdio: 'inherit'
})

const homepageHtml = readFileSync(join(cwd, 'dist/index.html'), 'utf8')
const archiveHtml = readFileSync(join(cwd, 'dist/archive/index.html'), 'utf8')
const robotsTxt = readFileSync(join(cwd, 'dist/robots.txt'), 'utf8')
const sitemapXml = readFileSync(join(cwd, 'dist/sitemap.xml'), 'utf8')
const articleHtml = readFileSync(
  join(cwd, 'dist/posts/2026-03-05/index.html'),
  'utf8'
)
const englishHomepageHtml = readFileSync(join(cwd, 'dist/en/index.html'), 'utf8')
const englishArticleHtml = readFileSync(
  join(cwd, 'dist/en/posts/2026-03-05/index.html'),
  'utf8'
)
const chineseArticleHtml = readFileSync(
  join(cwd, 'dist/zh/posts/2026-03-05/index.html'),
  'utf8'
)
const rubyKaigiArticlePath = join(cwd, 'dist/posts/2023-05-14_rubykaigi/index.html')
const rubyKaigiArticleHtml = readFileSync(rubyKaigiArticlePath, 'utf8')
const generatedPostRoutes = readdirSync(join(cwd, 'dist/posts'))

assert.match(homepageHtml, /<html lang="ja-jp">/)
assert.match(
  homepageHtml,
  /<link rel="canonical" href="https:\/\/geeknees\.github\.io\/web-nikki\/">/
)
assert.match(homepageHtml, /href="\/web-nikki\/categories\/"/)
assert.match(homepageHtml, /<script type="application\/ld\+json">/)
assert.match(homepageHtml, /"@type":"WebSite"/)

assert.match(archiveHtml, /教育 \/ AIとインターネット/)
assert.match(archiveHtml, /SNS \/ X \/ YouTube/)

assert.match(robotsTxt, /Sitemap: https:\/\/geeknees\.github\.io\/web-nikki\/sitemap\.xml/)
assert.match(sitemapXml, /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/)
assert.match(sitemapXml, /<loc>https:\/\/geeknees\.github\.io\/web-nikki\/<\/loc>/)
assert.match(
  sitemapXml,
  /<loc>https:\/\/geeknees\.github\.io\/web-nikki\/posts\/2026-03-05\/<\/loc>/
)
assert.match(
  sitemapXml,
  /<loc>https:\/\/geeknees\.github\.io\/web-nikki\/en\/posts\/2026-03-05\/<\/loc>/
)
assert.match(
  sitemapXml,
  /<loc>https:\/\/geeknees\.github\.io\/web-nikki\/zh\/posts\/2026-03-05\/<\/loc>/
)

assert.match(articleHtml, /"@type":"BlogPosting"/)
assert.match(articleHtml, /"inLanguage":"ja-jp"/)
assert.match(
  articleHtml,
  /<link rel="canonical" href="https:\/\/geeknees\.github\.io\/web-nikki\/posts\/2026-03-05\/">/
)
assert.match(articleHtml, /href="\/web-nikki\/categories\/AIとインターネット\/"/)
assert.match(articleHtml, /<h2 class="post-title">キーワード<\/h2>/)
assert.match(articleHtml, /# SNS/)

assert.match(englishHomepageHtml, /<html lang="en-us">/)
assert.match(englishHomepageHtml, /Social media is broken/)
assert.match(englishHomepageHtml, /href="\/web-nikki\/zh\/"/)
assert.match(englishArticleHtml, /"inLanguage":"en-us"/)
assert.match(englishArticleHtml, /<h2 class="post-title">Keywords<\/h2>/)
assert.match(
  englishArticleHtml,
  /rel="alternate" href="https:\/\/geeknees\.github\.io\/web-nikki\/zh\/posts\/2026-03-05\/" hreflang="zh-cn"/
)
assert.match(chineseArticleHtml, /"inLanguage":"zh-cn"/)
assert.match(chineseArticleHtml, /<h2 class="post-title">关键词<\/h2>/)

assert.ok(existsSync(rubyKaigiArticlePath), 'lowercase RubyKaigi route is missing')
assert.ok(generatedPostRoutes.includes('2023-05-14_rubykaigi'))
assert.equal(generatedPostRoutes.includes('2023-05-14_RubyKaigi'), false)
assert.match(
  rubyKaigiArticleHtml,
  /<link rel="canonical" href="https:\/\/geeknees\.github\.io\/web-nikki\/posts\/2023-05-14_rubykaigi\/">/
)
assert.match(
  rubyKaigiArticleHtml,
  /href="\/web-nikki\/en\/posts\/2023-05-14_rubykaigi\/"/
)
assert.match(
  rubyKaigiArticleHtml,
  /rel="alternate" href="https:\/\/geeknees\.github\.io\/web-nikki\/zh\/posts\/2023-05-14_rubykaigi\/" hreflang="zh-cn"/
)

console.log('integration: build output SEO assertions passed')
