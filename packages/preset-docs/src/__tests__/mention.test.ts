/** @vitest-environment happy-dom */
import { Editor } from '@weditor/core'
import { DOMParser } from 'prosemirror-model'
import { describe, expect, it } from 'vitest'
import { createMentionNodeView } from '../node-views/mention'
import { docsPreset, docsSchema } from '../preset'

describe('mention', () => {
  it('insertMention inserts an inline atom at the cursor', () => {
    const editor = Editor.create({ extensions: docsPreset() })
    editor.dispatch(editor.state.tr.insertText('Hi '))
    expect(editor.commands.insertMention({ id: 'u1', name: 'Ada' })).toBe(true)
    let found = false
    editor.state.doc.descendants((n) => {
      if (n.type.name === 'mention') {
        found = true
        expect(n.attrs.id).toBe('u1')
        expect(n.attrs.name).toBe('Ada')
        expect(n.isAtom).toBe(true)
      }
    })
    expect(found).toBe(true)
  })

  it('HTML is span.mention-embed with data-mention-id and @name', () => {
    const editor = Editor.create({ extensions: docsPreset() })
    editor.commands.insertMention({ id: 'u1', name: 'Ada' })
    const html = editor.getHTML()
    expect(html).toContain('mention-embed')
    expect(html).toContain('data-mention-id="u1"')
    expect(html).toContain('@Ada')
    const wrap = document.createElement('div')
    wrap.innerHTML = html
    const doc = DOMParser.fromSchema(docsSchema()).parse(wrap)
    let id = ''
    doc.descendants((n) => {
      if (n.type.name === 'mention') id = String(n.attrs.id)
    })
    expect(id).toBe('u1')
  })

  it('NodeView renders span.mention-embed with @name and no contentDOM', () => {
    const editor = Editor.create({ extensions: docsPreset() })
    expect(editor.commands.insertMention({ id: 'u1', name: 'Ada' })).toBe(true)
    const place = document.createElement('div')
    document.body.append(place)
    editor.mount(place)
    const el = place.querySelector('span.mention-embed')
    expect(el).toBeTruthy()
    expect(el?.getAttribute('data-mention-id')).toBe('u1')
    expect(el?.getAttribute('data-mention-name')).toBe('Ada')
    expect(el?.textContent).toBe('@Ada')
    const node = editor.schema.nodes.mention.create({ id: 'u1', name: 'Ada' })
    const nv = createMentionNodeView()(node)
    expect(nv.contentDOM).toBeUndefined()
    editor.destroy()
    place.remove()
  })
})


