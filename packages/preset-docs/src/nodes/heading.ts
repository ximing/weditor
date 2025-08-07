import type { NodeSpec } from 'prosemirror-model'
import { blockAttrsFromDom, styleFromAttrs } from '../style-from-attrs'

export const heading: NodeSpec = {
  group: 'block',
  content: 'inline*',
  marks: '_',
  attrs: {
    level: {
      default: 1,
      validate: (v: unknown) => {
        if (typeof v !== 'number' || v < 1 || v > 6) throw new Error('heading.level')
      },
    },
    align: { default: null },
    lineHeight: { default: null },
    indent: { default: 0 },
  },
  parseDOM: [1, 2, 3, 4, 5, 6].map((level) => ({
    tag: `h${level}`,
    getAttrs: (dom: HTMLElement) => ({ level, ...blockAttrsFromDom(dom) }),
  })),
  toDOM: (node) => [`h${node.attrs.level}`, { style: styleFromAttrs(node) }, 0],
}
