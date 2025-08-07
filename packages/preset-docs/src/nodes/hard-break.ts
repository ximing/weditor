import type { NodeSpec } from 'prosemirror-model'

export const hard_break: NodeSpec = {
  inline: true,
  group: 'inline',
  selectable: false,
  parseDOM: [{ tag: 'br' }],
  toDOM: () => ['br'],
}
