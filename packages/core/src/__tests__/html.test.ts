/** @vitest-environment happy-dom */
import { describe, expect, it } from 'vitest'
import { Editor } from '../editor'
import type { Extension } from '../types'

describe('htmlSerializer', () => {
  it('omits comment marks and rewrites javascript href/src even when toDOM does not sanitize', () => {
    const ext: Extension = {
      name: 'raw',
      nodes: {
        doc: { content: 'block+' },
        paragraph: { group: 'block', content: 'inline*' },
        image: {
          group: 'block',
          atom: true,
          attrs: { src: { default: '' } },
          toDOM: (n) => ['img', { src: n.attrs.src }],
        },
      },
      marks: {
        link: {
          attrs: { href: { default: '' } },
          toDOM: (m) => ['a', { href: m.attrs.href }, 0],
        },
        comment: {
          attrs: { id: { default: '' } },
          toDOM: (m) => ['span', { 'data-comment-id': m.attrs.id }, 0],
        },
      },
    }
    const editor = Editor.create({
      extensions: [ext],
      content: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'x',
                marks: [
                  { type: 'link', attrs: { href: 'javascript:alert(1)' } },
                  { type: 'comment', attrs: { id: 'c_1' } },
                ],
              },
            ],
          },
          { type: 'image', attrs: { src: 'javascript:alert(1)' } },
        ],
      },
    })
    const html = editor.getHTML()
    expect(html).not.toContain('data-comment-id')
    expect(html).not.toContain('javascript:')
    expect(html).toContain('href="#"')
  })
})
