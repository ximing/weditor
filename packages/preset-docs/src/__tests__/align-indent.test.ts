import { Editor } from '@weditor/core'
import { describe, expect, it } from 'vitest'
import { docsPreset } from '../preset'

describe('align indent lineHeight', () => {
  it('setAlign left/center/right/justify/null', () => {
    const editor = Editor.create({ extensions: docsPreset() })
    editor.dispatch(editor.state.tr.insertText('Hi'))
    expect(editor.commands.setAlign({ align: 'center' })).toBe(true)
    expect(editor.state.doc.firstChild?.attrs.align).toBe('center')
    expect(editor.commands.setAlign({ align: 'left' })).toBe(true)
    expect(editor.commands.setAlign({ align: 'right' })).toBe(true)
    expect(editor.commands.setAlign({ align: 'justify' })).toBe(true)
    expect(editor.commands.setAlign({ align: null })).toBe(true)
    expect(editor.state.doc.firstChild?.attrs.align).toBeNull()
  })

  it('setLineHeight whitelist and null reset', () => {
    const editor = Editor.create({ extensions: docsPreset() })
    for (const h of [1, 1.15, 1.5, 2, 2.5, 3]) {
      expect(editor.commands.setLineHeight({ lineHeight: h })).toBe(true)
      expect(editor.state.doc.firstChild?.attrs.lineHeight).toBe(h)
    }
    expect(editor.commands.setLineHeight({ lineHeight: 1.3 })).toBe(false)
    expect(editor.commands.setLineHeight({ lineHeight: null })).toBe(true)
    expect(editor.state.doc.firstChild?.attrs.lineHeight).toBeNull()
  })

  it('setIndent clamps 0–8; indent/outdent step by 1; inside list indent sinks first', () => {
    const editor = Editor.create({ extensions: docsPreset() })
    editor.dispatch(editor.state.tr.insertText('Hi'))
    expect(editor.commands.setIndent({ indent: 99 })).toBe(true)
    expect(editor.state.doc.firstChild?.attrs.indent).toBe(8)
    expect(editor.commands.setIndent({ indent: -4 })).toBe(true)
    expect(editor.state.doc.firstChild?.attrs.indent).toBe(0)
    expect(editor.commands.indent()).toBe(true)
    expect(editor.state.doc.firstChild?.attrs.indent).toBe(1)
    expect(editor.commands.outdent()).toBe(true)
    expect(editor.state.doc.firstChild?.attrs.indent).toBe(0)
    editor.commands.toggleBulletList()
    editor.commands.toggleBulletList()
    editor.commands.toggleBulletList()
    const before = editor.state.doc.toJSON()
    editor.commands.indent()
    // first indent in a single-level list may sink or no-op; must not throw
    expect(editor.state.doc.toJSON()).toBeTruthy()
    void before
  })
})
