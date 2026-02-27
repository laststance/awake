/**
 * Build script for @laststance/awake.
 * Copies .d.ts files from src/ to dist/ preserving structure,
 * then creates empty .js and .mjs shims for bundler compatibility.
 *
 * @example
 * tsx scripts/build.ts
 */
import { mkdirSync, readdirSync, writeFileSync, copyFileSync } from 'node:fs'
import { join } from 'node:path'

const SRC_ENTRYPOINTS = './src/entrypoints'
const DIST_ENTRYPOINTS = './dist/entrypoints'
const SRC_UTILS = './src/utils.d.ts'
const DIST_UTILS = './dist/utils.d.ts'

mkdirSync(DIST_ENTRYPOINTS, { recursive: true })

copyFileSync(SRC_UTILS, DIST_UTILS)
console.log('Copied utils.d.ts')

const files = readdirSync(SRC_ENTRYPOINTS)

for (const file of files) {
  if (!file.endsWith('.d.ts')) continue

  const baseName = file.replace('.d.ts', '')
  const srcPath = join(SRC_ENTRYPOINTS, file)
  const distDts = join(DIST_ENTRYPOINTS, file)
  const distCjs = join(DIST_ENTRYPOINTS, `${baseName}.cjs`)
  const distMjs = join(DIST_ENTRYPOINTS, `${baseName}.mjs`)

  copyFileSync(srcPath, distDts)
  writeFileSync(distCjs, '')
  writeFileSync(distMjs, '')

  console.log(`Built: ${baseName}`)
}

console.log('\nawake build complete.')
