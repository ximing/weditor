import type { NodeSpec } from 'prosemirror-model'

export const code_block: NodeSpec = {
  group: 'block',
  content: 'text*',
  marks: '',
  code: true,
  parseDOM: [
    { tag: 'pre', preserveWhitespace: 'full' },
    { tag: 'code', preserveWhitespace: 'full', context: 'doc/' },
  ],
  toDOM: () => ['pre', ['code', 0]],
}
