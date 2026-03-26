// ABOUTME: End-to-end smoke test that follows generated links the way a crawler would.
// ABOUTME: Confirms the homepage links into a real post page with matching canonical and crawlable content.

import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const cwd = process.cwd()
const homepagePath = join(cwd, 'dist/index.html')

assert.ok(
  existsSync(homepagePath),
  'dist/index.html is missing. Run `pnpm test:integration` or `pnpm build` first.'
)

const homepageHtml = readFileSync(homepagePath, 'utf8')
assert.match(
  homepageHtml,
  /href="\/web-nikki\/posts\/2024-05-19_rubykaigi\/"/
)
assert.match(
  homepageHtml,
  /href="\/web-nikki\/posts\/2024-11-19_ai_and_human\/"/
)
assert.match(
  homepageHtml,
  /href="\/web-nikki\/posts\/2024-10-27_the_art_of_maintaining_the_world\/"/
)
assert.match(homepageHtml, /AI添削 \/ 教育 \/ 品質管理/)
assert.match(homepageHtml, /テーマ別に読む/)

const firstPostHrefMatch = homepageHtml.match(
  /href="\/web-nikki\/posts\/([^"]+)\/"/
)

assert.ok(firstPostHrefMatch, 'homepage did not expose a crawlable post link')

const [, firstPostSlug] = firstPostHrefMatch
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
assert.match(firstPostHtml, /# SNS/)
assert.match(firstPostHtml, /<meta name="keywords" content="[^"]+">/)
assert.match(firstPostHtml, /<meta name="robots" content="index, follow">/)
assert.match(firstPostHtml, /<article class="heti">/)

console.log(`e2e: crawled homepage to post ${firstPostSlug}`)
