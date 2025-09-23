import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const root = resolve(__dirname)

function md(name: string) {
  return readFileSync(resolve(root, name), 'utf8')
}

describe('VitePress pages', () => {
  it('install lists the three runtime packages plus react', () => {
    const t = md('install.md')
    expect(t).toContain('pnpm add @weditor/react @weditor/preset-docs @weditor/collab')
  })
  it('collab page includes bootstrap, authority algorithm, WS table, docsSchema-only demo', () => {
    const t = md('collab.md')
    expect(t).toContain('collabExtension')
    expect(t).toContain('applyAuthorityBatch')
    expect(t).toContain('VERSION_MISMATCH')
    expect(t).toContain('RESET')
    expect(t).toContain('docsSchema()')
    expect(t).toContain('steps-ok')
    expect(t).toContain('requestId')
  })
  it('security page covers getHTML comment omission, href allow-list, demo identity', () => {
    const t = md('security.md')
    expect(t).toContain('getHTML()')
    expect(t).toContain('sanitizeHref')
    expect(t).toContain('mailto')
    expect(t).toContain('not an auth boundary')
  })
  it('vue page is mount/unmount only and does not ship a package', () => {
    const t = md('vue.md')
    expect(t).toContain('editor.mount')
    expect(t).toContain('editor.unmount')
    expect(t).not.toContain('@weditor/vue')
  })
  it('migration says JSON is canonical and Quill Delta is not supported', () => {
    const t = md('migration.md')
    expect(t).toContain('JSON')
    expect(t).toContain('Delta')
  })
  it('comments page covers incremental ops, tombstones, non-undoable', () => {
    const t = md('comments.md')
    expect(t).toContain('createThread')
    expect(t).toContain('appendComment')
    expect(t).toContain('tombstone')
    expect(t).toContain('addToHistory')
  })
})
