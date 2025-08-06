import { readFileSync, readdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

function walk(dir: string, acc: string[] = []): string[] {
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, name.name)
    if (name.isDirectory()) walk(p, acc)
    else if (name.name.endsWith('.ts')) acc.push(p)
  }
  return acc
}

describe('package boundary', () => {
  it('core src does not import prosemirror-collab or react', () => {
    const src = resolve(dirname(fileURLToPath(import.meta.url)), '..')
    for (const file of walk(src)) {
      if (file.includes('__tests__')) continue
      const text = readFileSync(file, 'utf8')
      expect(text).not.toMatch(/from ['"]prosemirror-collab['"]/)
      expect(text).not.toMatch(/from ['"]react['"]/)
    }
  })

  it('collab src does not import react', () => {
    const src = resolve(dirname(fileURLToPath(import.meta.url)), '../../../collab/src')
    for (const file of walk(src)) {
      if (file.includes('__tests__')) continue
      const text = readFileSync(file, 'utf8')
      expect(text).not.toMatch(/from ['"]react['"]/)
      expect(text).not.toMatch(/from ['"]react-dom['"]/)
    }
  })
})
