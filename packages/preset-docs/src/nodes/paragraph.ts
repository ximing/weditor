import type { NodeSpec } from 'prosemirror-model'
import { blockAttrsFromDom, styleFromAttrs } from '../style-from-attrs'

export const paragraph: NodeSpec = {
  group: 'block',
  content: 'inline*',
  marks: '_',
  attrs: {
    align: { default: null },
    lineHeight: { default: null },
    indent: { default: 0 },
  },
  parseDOM: [
    { tag: 'p', getAttrs: (dom) => blockAttrsFromDom(dom) },
    { tag: 'div', getAttrs: (dom) => blockAttrsFromDom(dom) },
  ],
  toDOM: (node) => ['p', { style: styleFromAttrs(node) }, 0],
}
