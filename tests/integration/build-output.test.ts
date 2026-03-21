// ABOUTME: Integration test for the Astro build output that search engines consume.
// ABOUTME: Builds the site and asserts the generated HTML, robots.txt, and sitemap include stable SEO signals.

import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const cwd = process.cwd()

execFileSync('pnpm', ['build'], {
  cwd,
  stdio: 'inherit'
})

const homepageHtml = readFileSync(join(cwd, 'dist/index.html'), 'utf8')
const robotsTxt = readFileSync(join(cwd, 'dist/robots.txt'), 'utf8')
const sitemapXml = readFileSync(join(cwd, 'dist/sitemap.xml'), 'utf8')
const articleHtml = readFileSync(
  join(cwd, 'dist/posts/2026-03-05/index.html'),
  'utf8'
)

assert.match(homepageHtml, /<html lang="ja-jp">/)
assert.match(
  homepageHtml,
  /<link rel="canonical" href="https:\/\/geeknees\.github\.io\/web-nikki\/">/
)
assert.match(homepageHtml, /<script type="application\/ld\+json">/)
assert.match(homepageHtml, /"@type":"WebSite"/)

assert.match(robotsTxt, /Sitemap: https:\/\/geeknees\.github\.io\/web-nikki\/sitemap\.xml/)
assert.match(sitemapXml, /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/)
assert.match(sitemapXml, /<loc>https:\/\/geeknees\.github\.io\/web-nikki\/<\/loc>/)
assert.match(
  sitemapXml,
  /<loc>https:\/\/geeknees\.github\.io\/web-nikki\/posts\/2026-03-05\/<\/loc>/
)

assert.match(articleHtml, /"@type":"BlogPosting"/)
assert.match(articleHtml, /"inLanguage":"ja-jp"/)
assert.match(
  articleHtml,
  /<link rel="canonical" href="https:\/\/geeknees\.github\.io\/web-nikki\/posts\/2026-03-05\/">/
)

console.log('integration: build output SEO assertions passed')
