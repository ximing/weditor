import { sanitizeSrc } from '@weditor/core'
import type { NodeSpec } from 'prosemirror-model'

export const image: NodeSpec = {
  group: 'block',
  atom: true,
  draggable: true,
  attrs: {
    src: { default: '' },
    alt: { default: '' },
    width: { default: null },
  },
  parseDOM: [
    {
      tag: 'img[src]',
      getAttrs: (dom: HTMLElement) => {
        const src = sanitizeSrc(dom.getAttribute('src') ?? '')
        if (!src) return false
        const width = dom.getAttribute('width')
        return {
          src,
          alt: dom.getAttribute('alt') ?? '',
          width: width ? Number(width) : null,
        }
      },
    },
  ],
  toDOM: (node) => [
    'img',
    {
      src: sanitizeSrc(node.attrs.src) ?? '',
      alt: node.attrs.alt,
      width: node.attrs.width,
    },
  ],
}
