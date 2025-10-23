/** @vitest-environment happy-dom */
import { Editor } from '@deditor/core'
import { docsPreset } from '@deditor/preset-docs'
import { TextSelection } from 'prosemirror-state'
import { describe, expect, it } from 'vitest'
import {
  activeAlign,
  activeBlock,
  activeList,
  activeMarkAttr,
  isMarkActive,
} from '../chrome/toolbar-state'

function makeEditor(content: object) {
  return Editor.create({ extensions: docsPreset(), content })
}

const docWithMarks = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      attrs: { align: 'center' },
      content: [
        { type: 'text', text: 'bold', marks: [{ type: 'strong' }] },
        {
          type: 'text',
          text: 'red',
          marks: [{ type: 'color', attrs: { color: '#ff0000' } }],
        },
      ],
    },
  ],
}

describe('toolbar-state', () => {
  it('detects active marks and attrs over a range selection', () => {
    const editor = makeEditor(docWithMarks)
    const tr = editor.state.tr.setSelection(
      TextSelection.create(editor.state.doc, 1, 7),
    )
    editor.dispatch(tr)
    expect(isMarkActive(editor, 'strong')).toBe(true)
    expect(isMarkActive(editor, 'em')).toBe(false)
    expect(activeMarkAttr(editor, 'color', 'color')).toBe('#ff0000')
    expect(activeMarkAttr(editor, 'highlight', 'color')).toBeNull()
    editor.destroy()
  })

  it('reads align and block from the parent block', () => {
    const editor = makeEditor(docWithMarks)
    expect(activeAlign(editor)).toBe('center')
    expect(activeBlock(editor)).toBe('paragraph')
    expect(activeList(editor)).toBeNull()
    editor.destroy()
  })

  it('detects headings and lists', () => {
    const editor = makeEditor({
      type: 'doc',
      content: [
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'H' }] },
        {
          type: 'bullet_list',
          content: [
            {
              type: 'list_item',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: 'x' }] }],
            },
          ],
        },
      ],
    })
    // cursor in heading
    let tr = editor.state.tr.setSelection(TextSelection.create(editor.state.doc, 2))
    editor.dispatch(tr)
    expect(activeBlock(editor)).toBe('heading:2')
    // cursor in list item
    const pos = 6
    tr = editor.state.tr.setSelection(TextSelection.create(editor.state.doc, pos))
    editor.dispatch(tr)
    expect(activeList(editor)).toBe('bullet_list')
    editor.destroy()
  })
})
