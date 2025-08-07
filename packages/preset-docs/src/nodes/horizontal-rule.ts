import type { NodeSpec } from 'prosemirror-model'

export const horizontal_rule: NodeSpec = {
  group: 'block',
  atom: true,
  parseDOM: [{ tag: 'hr' }],
  toDOM: () => ['hr'],
}
