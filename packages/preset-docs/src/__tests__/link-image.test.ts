/** @vitest-environment happy-dom */
import { Editor } from '@weditor/core'
import { DOMParser } from 'prosemirror-model'
import { describe, expect, it, vi } from 'vitest'
import { createImageNodeView } from '../node-views/image'
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

  it('two successive insertImage leave two sibling images', () => {
    const editor = Editor.create({ extensions: docsPreset() })
    expect(editor.commands.insertImage({ src: 'https://cdn.example/a.png' })).toBe(true)
    expect(editor.commands.insertImage({ src: 'https://cdn.example/b.png' })).toBe(true)
    const srcs: string[] = []
    editor.state.doc.forEach((n) => {
      if (n.type.name === 'image') srcs.push(String(n.attrs.src))
    })
    expect(srcs).toEqual(['https://cdn.example/a.png', 'https://cdn.example/b.png'])
  })

  it('image NodeView destroy unregisters listeners; unmount is safe', () => {
    const editor = Editor.create({ extensions: docsPreset() })
    expect(editor.commands.insertImage({ src: 'https://cdn.example/a.png' })).toBe(true)
    const place = document.createElement('div')
    document.body.append(place)
    editor.mount(place)
    expect(typeof editor.view).toBe('object')
    expect(() => editor.unmount()).not.toThrow()
    expect(() => editor.destroy()).not.toThrow()
    place.remove()

    const editor2 = Editor.create({ extensions: docsPreset() })
    const place2 = document.createElement('div')
    document.body.append(place2)
    editor2.mount(place2)
    const node = editor2.schema.nodes.image.create({
      src: 'https://cdn.example/a.png',
      alt: 'x',
    })
    const nv = createImageNodeView(editor2)(node, editor2.view!, () => 0)
    expect(typeof nv.destroy).toBe('function')
    const handle = nv.dom.querySelector('.weditor-image-handle') as HTMLElement
    const remove = vi.spyOn(handle, 'removeEventListener')
    nv.destroy!()
    expect(remove).toHaveBeenCalledWith('pointerdown', expect.any(Function))
    expect(remove).toHaveBeenCalledWith('pointermove', expect.any(Function))
    expect(remove).toHaveBeenCalledWith('pointerup', expect.any(Function))
    expect(remove).toHaveBeenCalledWith('pointercancel', expect.any(Function))
    expect(() => handle.dispatchEvent(new Event('pointerdown'))).not.toThrow()
    editor2.destroy()
    place2.remove()
  })

  it('image NodeView does not assign unsanitized src', () => {
    const editor = Editor.create({ extensions: docsPreset() })
    const place = document.createElement('div')
    document.body.append(place)
    editor.mount(place)
    const node = editor.schema.nodes.image.create({
      src: 'javascript:alert(1)',
      alt: 'x',
    })
    const nv = createImageNodeView(editor)(node, editor.view!, () => 0)
    const img = nv.dom.querySelector('img') as HTMLImageElement
    expect(img.getAttribute('src') ?? '').toBe('')
    expect(img.src).not.toContain('javascript:')
    nv.destroy?.()
    editor.destroy()
    place.remove()
  })
})
