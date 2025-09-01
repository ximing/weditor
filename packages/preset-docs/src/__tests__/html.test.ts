/** @vitest-environment happy-dom */
import { Editor } from '@weditor/core'
import { DOMParser } from 'prosemirror-model'
import { describe, expect, it } from 'vitest'
import { docsPreset, docsSchema } from '../preset'

describe('HTML mapping', () => {
  it('round-trips paragraph + strong + link', () => {
    const editor = Editor.create({ extensions: docsPreset() })
    editor.commands.toggleStrong()
    editor.dispatch(editor.state.tr.insertText('Hello'))
    editor.commands.setLink({ href: 'https://example.com' })
    const html = editor.getHTML()
    expect(html).toContain('<strong>')
    expect(html).toContain('href="https://example.com"')
    const schema = docsSchema()
    const wrap = document.createElement('div')
    wrap.innerHTML = html
    const doc = DOMParser.fromSchema(schema).parse(wrap)
    expect(doc.textContent).toContain('Hello')
    let sawLink = false
    doc.descendants((n) => {
      if (n.marks.some((m) => m.type.name === 'link')) sawLink = true
    })
    expect(sawLink).toBe(true)
  })

  it('drops javascript: hrefs on parse and getHTML', () => {
    const schema = docsSchema()
    const wrap = document.createElement('div')
    wrap.innerHTML = `<p><a href="javascript:alert(1)">x</a></p>`
    const doc = DOMParser.fromSchema(schema).parse(wrap)
    let href: string | undefined
    doc.descendants((n) => {
      const link = n.marks.find((m) => m.type.name === 'link')
      if (link) href = String(link.attrs.href)
    })
    expect(href).toBeUndefined()
    const editor = Editor.create({ extensions: docsPreset() })
    expect(editor.commands.setLink({ href: 'javascript:alert(1)' })).toBe(false)
  })

  it('getHTML omits data-comment-id; paste parser ignores span[data-comment-id]', () => {
    const editor = Editor.create({ extensions: docsPreset() })
    editor.dispatch(editor.state.tr.insertText('Hello'))
    editor.commands.addComment({ body: 'n', author: { id: 'a', name: 'Alice' }, from: 1, to: 6 })
    expect(editor.getHTML()).not.toContain('data-comment-id')
    const wrap = document.createElement('div')
    wrap.innerHTML = `<p><span data-comment-id="c_abc">Hi</span></p>`
    const doc = DOMParser.fromSchema(docsSchema()).parse(wrap)
    let saw = false
    doc.descendants((n) => {
      if (n.marks.some((m) => m.type.name === 'comment')) saw = true
    })
    expect(saw).toBe(false)
  })
})
