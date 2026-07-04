import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import consola from 'consola'

/**
 * Get the current date in the format "YYYY-MM-DD".
 * @returns The current date as a string.
 */
function getDate(): string {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Create a new post.
 * Prompts the user for a file name and extension, and creates a new post file with frontmatter.
 * If successful, opens the new post file in the default editor.
 */
async function createPost(): Promise<void> {
  consola.start('Ready to create a new post!')
  const filename = await consola.prompt('Enter file name: ', { type: 'text' })
  const ext = await consola.prompt('Select file extension: ', { type: 'select', options: ['.md', '.mdx'] })

  const targetDir = './src/content/posts/'
  const fullPath = path.join(targetDir, `${filename}${ext}`)

  const frontmatter = `---
title: ${filename}
pubDate: ${getDate()}
categories: []
keywords: []
description: ''
translationKey: ${filename}
language: ja
---
`

  try {
    fs.writeFileSync(fullPath, frontmatter)
    consola.success('New post created successfully!')

    const open = await consola.prompt('Open the new post?', { type: 'confirm', initial: true })
    if (open) {
      consola.info(`Opening ${fullPath}...`)
      execSync(`code ${fullPath}`)
    }
  } catch (error) {
    consola.error((error as Error).message || 'Failed to create new post!')
  }
}

createPost()
