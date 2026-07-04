// ABOUTME: Unit tests for the GitHub Pages deployment workflow contract.
// ABOUTME: Ensures CI keeps test execution in front of publishing artifacts.

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const workflow = readFileSync(
  join(process.cwd(), '.github/workflows/deploy.yml'),
  'utf8'
)

const testStepIndex = workflow.indexOf('pnpm test')
const uploadStepIndex = workflow.indexOf('actions/upload-pages-artifact')
const deployJobIndex = workflow.indexOf('deploy:')

assert.ok(testStepIndex >= 0, 'deploy workflow must run pnpm test')
assert.ok(uploadStepIndex >= 0, 'deploy workflow must upload the tested dist artifact')
assert.ok(
  testStepIndex < uploadStepIndex,
  'deploy workflow must run tests before uploading the Pages artifact'
)
assert.ok(
  uploadStepIndex < deployJobIndex,
  'deploy workflow must upload the artifact before the deploy job'
)

console.log('unit: deploy workflow contract passed')
