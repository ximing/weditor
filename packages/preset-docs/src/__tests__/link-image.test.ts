/** @vitest-environment happy-dom */
import { Editor } from '@weditor/core'
import { DOMParser } from 'prosemirror-model'
import { describe, expect, it } from 'vitest'
import { docsPreset, docsSchema } from '../preset'

describe('insertImage and sanitizer', () => {
  it('insertImage requires sanitizeSrc; javascript and blob rejected', () => {
    const editor = Editor.create({ extensions: docsPreset() })
    expect(editor.commands.insertImage({ src: 'javascript:alert(1)' })).toBe(false)
    expect(editor.commands.insertImage({ src: 'blob:https://x/1' })).toBe(false)
    expect(editor.commands.insertImage({ src: 'https://cdn.example/a.png', alt: 'cat', width: 120 })).toBe(true)
    expect(editor.state.doc.firstChild?.type.name).toBe('image')
    expect(editor.state.doc.firstChild?.attrs.src).toBe('https://cdn.example/a.png')
    expect(
      editor.commands.insertImage({ src: 'data:image/png;base64,abc' }),
    ).toBe(true)
  })

  it('parseDOM drops img with unsafe src; toDOM sanitizes', () => {
    const schema = docsSchema()
    const wrap = document.createElement('div')
    wrap.innerHTML = `<img src="javascript:alert(1)" alt="x"><img src="https://ok.example/a.png" alt="ok">`
    const doc = DOMParser.fromSchema(schema).parse(wrap)
    const srcs: string[] = []
    doc.descendants((n) => {
      if (n.type.name === 'image') srcs.push(String(n.attrs.src))
    })
    expect(srcs).toEqual(['https://ok.example/a.png'])
  })

  it('docsPreset includes gapcursor and dropcursor after lists', () => {
    const names = docsPreset().map((e) => e.name)
    expect(names.indexOf('gapcursor')).toBeGreaterThan(names.indexOf('lists'))
    expect(names).toContain('dropcursor')
  })
})
