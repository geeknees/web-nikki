// ABOUTME: End-to-end smoke test that follows generated links the way a crawler would.
// ABOUTME: Confirms the homepage links into a real post page with matching canonical and crawlable content.

import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const cwd = process.cwd()
const homepagePath = join(cwd, 'dist/index.html')

function readBuiltHtml(...segments: string[]) {
  const pagePath = join(cwd, 'dist', ...segments)

  assert.ok(existsSync(pagePath), `${join('dist', ...segments)} is missing`)

  return readFileSync(pagePath, 'utf8')
}

function getFirstCrawlablePostSlug(html: string, hrefPrefix: string) {
  const postHrefMatch = html.match(
    new RegExp(`href="${hrefPrefix}(?!page/)([^"]+)/"`)
  )

  assert.ok(postHrefMatch, `${hrefPrefix} did not expose a crawlable post link`)

  return postHrefMatch[1]
}

assert.ok(
  existsSync(homepagePath),
  'dist/index.html is missing. Run `pnpm test:integration` or `pnpm build` first.'
)

const homepageHtml = readFileSync(homepagePath, 'utf8')
assert.match(homepageHtml, /href="\/web-nikki\/categories\/"/)
assert.match(homepageHtml, /テーマ別に読む/)
assert.match(homepageHtml, /href="\/web-nikki\/en\/"/)
assert.match(homepageHtml, /href="\/web-nikki\/zh\/"/)

const topicSectionMatch = homepageHtml.match(
  /<section[^>]*>\s*<h2 class="post-title">テーマ別に読む<\/h2>([\s\S]*?)<\/section>\s*<footer/
)

assert.ok(topicSectionMatch, 'homepage did not render a readable topic section')

const topicSectionHtml = topicSectionMatch[1]
const topicPostHrefMatches = Array.from(
  topicSectionHtml.matchAll(/href="\/web-nikki\/posts\/(?!page\/)([^"]+)\/"/g)
)

assert.equal(
  topicPostHrefMatches.length,
  5,
  'homepage topic section should expose one crawlable post for each homepage category'
)
assert.match(topicSectionHtml, / — /)
assert.match(topicSectionHtml, / \/ /)

const firstPostSlug = getFirstCrawlablePostSlug(homepageHtml, '/web-nikki/posts/')
const firstPostPath = join(cwd, 'dist/posts', firstPostSlug, 'index.html')

assert.ok(existsSync(firstPostPath), `post output is missing for ${firstPostSlug}`)

const firstPostHtml = readFileSync(firstPostPath, 'utf8')

assert.match(
  firstPostHtml,
  new RegExp(
    `<link rel="canonical" href="https://geeknees\\.github\\.io/web-nikki/posts/${firstPostSlug}/">`
  )
)
assert.match(firstPostHtml, /<h2 class="post-title">キーワード<\/h2>/)
assert.match(firstPostHtml, /href="\/web-nikki\/categories\/[^"]+\/"/)
assert.match(firstPostHtml, /<meta name="keywords" content="[^"]+">/)
assert.match(firstPostHtml, /<meta name="robots" content="index, follow">/)
assert.match(firstPostHtml, /<article class="heti">/)

const firstTopicPostSlug = topicPostHrefMatches[0]?.[1]

assert.ok(firstTopicPostSlug, 'homepage topic section did not expose a crawlable topic link')

const firstTopicPostHtml = readBuiltHtml('posts', firstTopicPostSlug, 'index.html')

assert.match(
  firstTopicPostHtml,
  new RegExp(
    `<link rel="canonical" href="https://geeknees\\.github\\.io/web-nikki/posts/${firstTopicPostSlug}/">`
  )
)
assert.match(firstTopicPostHtml, /<meta name="keywords" content="[^"]+">/)
assert.match(firstTopicPostHtml, /<meta name="robots" content="index, follow">/)

const englishHomepageHtml = readBuiltHtml('en', 'index.html')

assert.match(englishHomepageHtml, /Read by topic/)
const englishFirstPostSlug = getFirstCrawlablePostSlug(
  englishHomepageHtml,
  '/web-nikki/en/posts/'
)

const englishPostHtml = readBuiltHtml(
  'en',
  'posts',
  englishFirstPostSlug,
  'index.html'
)
assert.match(
  englishPostHtml,
  new RegExp(
    `<link rel="canonical" href="https://geeknees\\.github\\.io/web-nikki/en/posts/${englishFirstPostSlug}/">`
  )
)
assert.match(
  englishPostHtml,
  new RegExp(`href="\\/web-nikki\\/zh\\/posts\\/${englishFirstPostSlug}\\/"`)
)
assert.match(englishPostHtml, /<meta name="robots" content="index, follow">/)

console.log(`e2e: crawled homepage to post ${firstPostSlug}`)
