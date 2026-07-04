// ABOUTME: Unit tests for static security-sensitive source patterns.
// ABOUTME: Guards against reintroducing risky third-party CDN script hosts.

import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

function listSourceFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry)
    const stat = statSync(path)

    if (stat.isDirectory()) {
      return listSourceFiles(path)
    }

    return path
  })
}

const sourceFiles = [
  ...listSourceFiles(join(process.cwd(), 'src')),
  join(process.cwd(), 'astro.config.ts'),
  join(process.cwd(), 'package.json'),
]

for (const file of sourceFiles) {
  const content = readFileSync(file, 'utf8')

  assert.doesNotMatch(
    content,
    /cdn\.staticfile\.org/,
    `${file} must not load scripts from cdn.staticfile.org`
  )
  assert.doesNotMatch(
    content,
    /\b(?:giscus|twikoo|disqus)\b/i,
    `${file} must not reintroduce disabled comment providers`
  )
}

console.log('unit: security source patterns passed')
