import { Editor } from '@deditor/core'
import { TextSelection } from 'prosemirror-state'
import { describe, expect, it } from 'vitest'
import { docsPreset } from '../preset'

function ed() {
  const editor = Editor.create({ extensions: docsPreset() })
  editor.dispatch(editor.state.tr.insertText('Hello'))
  editor.dispatch(editor.state.tr.setSelection(TextSelection.create(editor.state.doc, 1, 6)))
  return editor
}

describe('mark commands', () => {
  it('toggleStrong / toggleEm / toggleUnderline / toggleStrike / toggleCode / toggleSuperscript / toggleSubscript', () => {
    const editor = ed()
    expect(editor.commands.toggleStrong()).toBe(true)
    expect(editor.commands.toggleEm()).toBe(true)
    expect(editor.commands.toggleUnderline()).toBe(true)
    expect(editor.commands.toggleStrike()).toBe(true)
    expect(editor.commands.toggleCode()).toBe(true)
    expect(editor.commands.toggleSuperscript()).toBe(true)
    expect(editor.state.doc.rangeHasMark(1, 6, editor.schema.marks.superscript)).toBe(true)
    expect(editor.commands.toggleSubscript()).toBe(true)
    expect(editor.state.doc.rangeHasMark(1, 6, editor.schema.marks.subscript)).toBe(true)
    expect(editor.state.doc.rangeHasMark(1, 6, editor.schema.marks.superscript)).toBe(false)
  })

  it('setFontSize clamps to [5,72]pt and null removes; invalid returns false', () => {
    const editor = ed()
    expect(editor.commands.setFontSize('11pt')).toBe(true)
    expect(editor.commands.setFontSize('nope')).toBe(false)
    expect(editor.commands.setFontSize('3pt')).toBe(true)
    let size = ''
    editor.state.doc.nodesBetween(1, 6, (n) => {
      const m = n.marks.find((x) => x.type.name === 'fontSize')
      if (m) size = String(m.attrs.size)
    })
    expect(size).toBe('5pt')
    expect(editor.commands.setFontSize(null)).toBe(true)
  })

  it('setFontFamily / setColor / setHighlight null clears; setLink sanitizes', () => {
    const editor = ed()
    expect(editor.commands.setFontFamily('Arial')).toBe(true)
    expect(editor.commands.setFontFamily(null)).toBe(true)
    expect(editor.commands.setColor('#ff0000')).toBe(true)
    expect(editor.commands.setColor(null)).toBe(true)
    expect(editor.commands.setHighlight('yellow')).toBe(true)
    expect(editor.commands.setHighlight(null)).toBe(true)
    expect(editor.commands.setLink({ href: 'https://ok.example' })).toBe(true)
    expect(editor.commands.setLink({ href: 'javascript:alert(1)' })).toBe(false)
    expect(editor.commands.unsetLink()).toBe(true)
  })
})
