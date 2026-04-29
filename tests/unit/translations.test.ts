// ABOUTME: Unit tests for localized post coverage across the content tree.
// ABOUTME: Ensures every Japanese source post has English and Chinese peers.

import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { basename, extname, join } from 'node:path'

const postsDirectory = join(process.cwd(), 'src/content/posts')
const sourcePosts = readdirSync(postsDirectory)
  .filter((filename) => filename.endsWith('.md') || filename.endsWith('.mdx'))
  .sort()

function readFrontmatter(filename: string) {
  const content = readFileSync(filename, 'utf8')
  const match = content.match(/^---\n([\s\S]*?)\n---/)

  assert.ok(match, `${filename} must start with frontmatter`)

  return match[1]
}

function assertFrontmatterField(
  frontmatter: string,
  field: string,
  expectedValue: string
) {
  const quoted = new RegExp(`^${field}: ['"]${expectedValue}['"]$`, 'm')
  const unquoted = new RegExp(`^${field}: ${expectedValue}$`, 'm')

  assert.ok(
    quoted.test(frontmatter) || unquoted.test(frontmatter),
    `${field} must be ${expectedValue}`
  )
}

assert.ok(sourcePosts.length > 0, 'Japanese source posts must exist')

for (const sourcePost of sourcePosts) {
  const extension = extname(sourcePost)
  const stem = basename(sourcePost, extension)

  for (const language of ['en', 'zh']) {
    const translationPath = join(
      postsDirectory,
      language,
      `${language}-${stem}${extension}`
    )

    assert.ok(
      existsSync(translationPath),
      `${sourcePost} must have ${language} translation`
    )

    const frontmatter = readFrontmatter(translationPath)
    assertFrontmatterField(frontmatter, 'language', language)
    assertFrontmatterField(frontmatter, 'translationKey', stem)
    assertFrontmatterField(frontmatter, 'postSlug', stem)
  }
}

console.log('unit: post translation coverage passed')
