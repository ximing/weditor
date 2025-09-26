/** @vitest-environment happy-dom */
import { Editor } from '@weditor/core'
import { TextSelection } from 'prosemirror-state'
import { describe, expect, it } from 'vitest'
import { docsPreset } from '../preset'

describe('history and setEditable', () => {
  it('undo and redo revert local document steps', () => {
    const editor = Editor.create({ extensions: docsPreset() })
    editor.dispatch(editor.state.tr.insertText('Hello'))
    expect(editor.state.doc.textContent).toBe('Hello')
    expect(editor.commands.undo()).toBe(true)
    expect(editor.state.doc.textContent).toBe('')
    expect(editor.commands.redo()).toBe(true)
    expect(editor.state.doc.textContent).toBe('Hello')
  })

  it('undo / redo / toggleStrong return false when setEditable(false)', () => {
    const editor = Editor.create({ extensions: docsPreset() })
    editor.dispatch(editor.state.tr.insertText('Hello'))
    editor.setEditable(false)
    expect(editor.commands.undo()).toBe(false)
    expect(editor.commands.redo()).toBe(false)
    expect(editor.commands.toggleStrong()).toBe(false)
    expect(editor.state.doc.textContent).toBe('Hello')
  })
})

describe('keymap extension', () => {
  it('docsPreset includes history, keymap, baseKeymap, placeholder in §11.4 order', () => {
    const names = docsPreset().map((e) => e.name)
    expect(names[0]).toBe('history')
    expect(names).toContain('keymap')
    expect(names[names.length - 1]).toBe('baseKeymap')
    expect(names.indexOf('keymap')).toBeLessThan(names.indexOf('baseKeymap'))
  })

  it('Mod-f emits openFind; Mod-Alt-m emits openComment only for a non-empty selection', () => {
    const editor = Editor.create({ extensions: docsPreset() })
    const finds: unknown[] = []
    const comments: unknown[] = []
    const links: unknown[] = []
    editor.on('openFind', () => finds.push(1))
    editor.on('openComment', (p) => comments.push(p))
    editor.on('openLink', (p) => links.push(p))
    const km = docsPreset().find((e) => e.name === 'keymap')!
    const keys = km.keymap!({ schema: editor.schema, editor })
    expect(keys['Mod-f'] as () => boolean).toBeTypeOf('function')
    expect((keys['Mod-f'] as () => boolean)()).toBe(true)
    expect(finds).toHaveLength(1)
    expect((keys['Mod-Alt-m'] as () => boolean)()).toBe(false)
    expect((keys['Mod-k'] as () => boolean)()).toBe(false)
    editor.dispatch(editor.state.tr.insertText('Hi'))
    editor.dispatch(
      editor.state.tr.setSelection(TextSelection.create(editor.state.doc, 1, 3)),
    )
    expect((keys['Mod-Alt-m'] as () => boolean)()).toBe(true)
    expect(comments[0]).toEqual({ from: 1, to: 3 })
    expect((keys['Mod-k'] as () => boolean)()).toBe(true)
    expect(links[0]).toEqual({ from: 1, to: 3 })
  })
})
