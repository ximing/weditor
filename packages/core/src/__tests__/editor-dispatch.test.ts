/** @vitest-environment happy-dom */
import { describe, expect, it } from 'vitest'
import { Editor } from '../editor'
import type { Extension } from '../types'

const nodes: Extension = {
  name: 'nodes',
  nodes: {
    doc: { content: 'block+' },
    paragraph: { group: 'block', content: 'inline*' },
  },
}

describe('Editor.dispatch', () => {
  it('applies the transaction, deriveDetached, onTransaction, then emits, then updates the view', () => {
    const seen: string[] = []
    const ext: Extension = {
      name: 'obs',
      onTransaction: () => {
        seen.push('onTransaction')
      },
    }
    const editor = Editor.create({ extensions: [nodes, ext] })
    editor.on('transaction', () => {
      seen.push('emit')
    })
    editor.on('comments', () => {
      seen.push('comments')
    })
    const tr = editor.state.tr.insertText('x')
    editor.dispatch(tr)
    expect(editor.state.doc.textContent).toBe('x')
    expect(seen).toEqual(['onTransaction', 'emit', 'comments'])
  })

  it('marks remote true when weditor-remote meta is set', () => {
    const editor = Editor.create({ extensions: [nodes] })
    let remote: boolean | undefined
    editor.on('transaction', (p) => {
      remote = p.remote
    })
    const tr = editor.state.tr.insertText('x')
    tr.setMeta('weditor-remote', true)
    editor.dispatch(tr)
    expect(remote).toBe(true)
  })

  it('resetFromSnapshot calls prepareSnapshotReset before plugins rebuild and keeps the view', () => {
    const log: string[] = []
    let pluginInits = 0
    const ext: Extension = {
      name: 'snap',
      plugins: () => {
        pluginInits += 1
        return []
      },
      prepareSnapshotReset: (snap) => {
        log.push(`prep:${snap.version}`)
      },
    }
    const editor = Editor.create({
      extensions: [nodes, ext],
      content: {
        type: 'doc',
        content: [{ type: 'paragraph', content: [{ type: 'text', text: 'old' }] }],
      },
    })
    expect(pluginInits).toBe(1)
    editor.resetFromSnapshot({
      version: 4,
      doc: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'new' }] }] },
      comments: [],
    })
    expect(log).toEqual(['prep:4'])
    expect(editor.state.doc.textContent).toBe('new')
    expect(pluginInits).toBe(2)
  })
})
