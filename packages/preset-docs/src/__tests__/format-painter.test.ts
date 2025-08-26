import { Editor } from '@weditor/core'
import { PluginKey, TextSelection } from 'prosemirror-state'
import { describe, expect, it } from 'vitest'
import { docsPreset, formatPainterPluginKey } from '../index'

describe('format painter', () => {
  it('formatPainterPluginKey is a PluginKey exported from preset-docs', () => {
    expect(formatPainterPluginKey).toBeInstanceOf(PluginKey)
  })

  it('copyFormat stores marks except comment plus block attrs; applyFormat applies once and clears', () => {
    const editor = Editor.create({ extensions: docsPreset() })
    editor.dispatch(editor.state.tr.insertText('HelloWorld'))
    editor.dispatch(editor.state.tr.setSelection(TextSelection.create(editor.state.doc, 1, 6)))
    editor.commands.toggleStrong()
    editor.commands.setAlign({ align: 'center' })
    expect(editor.commands.copyFormat()).toBe(true)
    const snap = formatPainterPluginKey.getState(editor.state)
    expect(snap).toBeTruthy()
    expect(snap.marks.some((m: { type: string }) => m.type === 'strong')).toBe(true)
    expect(snap.marks.some((m: { type: string }) => m.type === 'comment')).toBe(false)
    expect(snap.block.align).toBe('center')
    editor.dispatch(editor.state.tr.setSelection(TextSelection.create(editor.state.doc, 6, 11)))
    expect(editor.commands.applyFormat()).toBe(true)
    expect(editor.state.doc.rangeHasMark(6, 11, editor.schema.marks.strong)).toBe(true)
    expect(formatPainterPluginKey.getState(editor.state)).toBeNull()
  })

  it('clearPainter drops snapshot without applying; Escape keymap calls it', () => {
    const editor = Editor.create({ extensions: docsPreset() })
    editor.dispatch(editor.state.tr.insertText('Hello'))
    editor.dispatch(editor.state.tr.setSelection(TextSelection.create(editor.state.doc, 1, 6)))
    editor.commands.toggleEm()
    editor.commands.copyFormat()
    expect(editor.commands.clearPainter()).toBe(true)
    expect(formatPainterPluginKey.getState(editor.state)).toBeNull()
  })

  it('clearFormat removes all marks except comment and resets block attrs; does not change block type', () => {
    const editor = Editor.create({ extensions: docsPreset() })
    editor.dispatch(editor.state.tr.insertText('Hello'))
    editor.dispatch(editor.state.tr.setSelection(TextSelection.create(editor.state.doc, 1, 6)))
    editor.commands.toggleStrong()
    editor.commands.setAlign({ align: 'right' })
    editor.commands.setIndent({ indent: 2 })
    editor.commands.setBlockType({ type: 'heading', level: 2 })
    const commentType = editor.schema.marks.comment
    if (commentType) {
      editor.dispatch(
        editor.state.tr.addMark(1, 6, commentType.create({ id: 'c_keep' })),
      )
    }
    expect(editor.commands.clearFormat()).toBe(true)
    expect(editor.state.doc.rangeHasMark(1, 6, editor.schema.marks.strong)).toBe(false)
    expect(editor.state.doc.firstChild?.type.name).toBe('heading')
    expect(editor.state.doc.firstChild?.attrs.align).toBeNull()
    expect(editor.state.doc.firstChild?.attrs.indent).toBe(0)
    if (commentType) {
      expect(editor.state.doc.rangeHasMark(1, 6, commentType)).toBe(true)
    }
  })

  it('formatPainter sits before placeholder in docsPreset', () => {
    const names = docsPreset().map((e) => e.name)
    expect(names.indexOf('formatPainter')).toBeGreaterThan(-1)
    expect(names.indexOf('formatPainter')).toBeLessThan(names.indexOf('placeholder'))
  })

  it('formatPainter Escape keymap drops the snapshot', () => {
    const editor = Editor.create({ extensions: docsPreset() })
    editor.dispatch(editor.state.tr.insertText('Hello'))
    editor.dispatch(editor.state.tr.setSelection(TextSelection.create(editor.state.doc, 1, 6)))
    editor.commands.toggleEm()
    editor.commands.copyFormat()
    const ext = docsPreset().find((e) => e.name === 'formatPainter')!
    const keys = ext.keymap!({ schema: editor.schema, editor })
    expect((keys.Escape as () => boolean)()).toBe(true)
    expect(formatPainterPluginKey.getState(editor.state)).toBeNull()
  })

  it('applyFormat paints marks and block attrs but does not convert block type', () => {
    const editor = Editor.create({ extensions: docsPreset() })
    editor.dispatch(editor.state.tr.insertText('HelloWorld'))
    editor.dispatch(editor.state.tr.setSelection(TextSelection.create(editor.state.doc, 1, 6)))
    editor.commands.toggleStrong()
    editor.commands.setAlign({ align: 'center' })
    editor.commands.setBlockType({ type: 'heading', level: 2 })
    editor.commands.copyFormat()
    expect(formatPainterPluginKey.getState(editor.state)?.block.type).toBe('heading')
    editor.commands.setBlockType({ type: 'paragraph' })
    editor.dispatch(editor.state.tr.setSelection(TextSelection.create(editor.state.doc, 6, 11)))
    expect(editor.commands.applyFormat()).toBe(true)
    expect(editor.state.doc.firstChild?.type.name).toBe('paragraph')
    expect(editor.state.doc.firstChild?.attrs.align).toBe('center')
    expect(editor.state.doc.rangeHasMark(6, 11, editor.schema.marks.strong)).toBe(true)
  })
})
