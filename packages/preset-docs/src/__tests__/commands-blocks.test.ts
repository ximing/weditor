import { Editor } from '@deditor/core'
import { TextSelection } from 'prosemirror-state'
import { describe, expect, it } from 'vitest'
import { docsPreset } from '../preset'

describe('block commands', () => {
  it('setBlockType switches paragraph / heading 1–6 / code_block and rejects blockquote', () => {
    const editor = Editor.create({ extensions: docsPreset() })
    editor.dispatch(editor.state.tr.insertText('Hi'))
    expect(editor.commands.setBlockType({ type: 'heading', level: 2 })).toBe(true)
    expect(editor.state.doc.firstChild?.type.name).toBe('heading')
    expect(editor.state.doc.firstChild?.attrs.level).toBe(2)
    expect(editor.commands.setBlockType({ type: 'paragraph' })).toBe(true)
    expect(editor.commands.setBlockType({ type: 'code_block' })).toBe(true)
    expect(editor.state.doc.firstChild?.type.name).toBe('code_block')
    expect(
      editor.commands.setBlockType({ type: 'blockquote' as unknown as 'paragraph' }),
    ).toBe(false)
  })

  it('toggleBlockquote wraps and lifts; toggleCodeBlock is setBlockType code_block or paragraph', () => {
    const editor = Editor.create({ extensions: docsPreset() })
    editor.dispatch(editor.state.tr.insertText('Hi'))
    expect(editor.commands.toggleBlockquote()).toBe(true)
    expect(editor.state.doc.firstChild?.type.name).toBe('blockquote')
    expect(editor.commands.toggleBlockquote()).toBe(true)
    expect(editor.commands.toggleCodeBlock()).toBe(true)
    expect(editor.state.doc.firstChild?.type.name).toBe('code_block')
    expect(editor.commands.toggleCodeBlock()).toBe(true)
    expect(editor.state.doc.firstChild?.type.name).toBe('paragraph')
  })

  it('setBlockType heading to paragraph keeps align/indent/lineHeight; code_block drops them', () => {
    const editor = Editor.create({ extensions: docsPreset() })
    editor.dispatch(editor.state.tr.insertText('Hi'))
    editor.commands.setAlign({ align: 'center' })
    editor.commands.setIndent({ indent: 2 })
    editor.commands.setLineHeight({ lineHeight: 2 })
    editor.commands.setBlockType({ type: 'heading', level: 1 })
    editor.commands.setBlockType({ type: 'paragraph' })
    expect(editor.state.doc.firstChild?.attrs.align).toBe('center')
    expect(editor.state.doc.firstChild?.attrs.indent).toBe(2)
    editor.commands.setBlockType({ type: 'code_block' })
    expect(editor.state.doc.firstChild?.attrs.align).toBeUndefined()
  })

  it('insertHardBreak and insertHorizontalRule', () => {
    const editor = Editor.create({ extensions: docsPreset() })
    editor.dispatch(editor.state.tr.insertText('Hi'))
    editor.dispatch(
      editor.state.tr.setSelection(TextSelection.create(editor.state.doc, 3)),
    )
    expect(editor.commands.insertHardBreak()).toBe(true)
    expect(editor.commands.insertHorizontalRule()).toBe(true)
  })
})
