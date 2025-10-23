import { Editor } from '@deditor/core'
import { describe, expect, it } from 'vitest'
import { docsPreset, docsSchema } from '../preset'

describe('docsSchema', () => {
  it('rejects a doc that is only inline', () => {
    const schema = docsSchema()
    expect(() => schema.node('doc', null, [schema.text('x')])).toThrow()
  })
  it('seeds Editor.create as doc > paragraph', () => {
    const editor = Editor.create({ extensions: docsPreset() })
    expect(editor.state.doc.firstChild?.type.name).toBe('paragraph')
  })
  it('heading level defaults to 1 and setBlockType clamps 1–6', () => {
    const schema = docsSchema()
    const h = schema.node('heading')
    expect(h.attrs.level).toBe(1)
    const editor = Editor.create({ extensions: docsPreset() })
    expect(editor.commands.setBlockType({ type: 'heading', level: 3 })).toBe(true)
    expect(editor.state.doc.firstChild?.type.name).toBe('heading')
    expect(editor.state.doc.firstChild?.attrs.level).toBe(3)
  })
  it('every top-level node used in the default doc is group block', () => {
    const schema = docsSchema()
    for (const name of ['paragraph', 'heading', 'blockquote', 'code_block', 'horizontal_rule']) {
      expect(schema.nodes[name].spec.group).toContain('block')
    }
  })
  it('code_block rejects marks', () => {
    const schema = docsSchema()
    const strong = schema.marks.strong.create()
    expect(() =>
      schema.node('code_block', null, [schema.text('x', [strong])]),
    ).toThrow()
  })
})
