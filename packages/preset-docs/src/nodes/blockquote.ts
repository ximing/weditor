import type { NodeSpec } from 'prosemirror-model'

export const blockquote: NodeSpec = {
  group: 'block',
  content: 'block+',
  parseDOM: [{ tag: 'blockquote' }],
  toDOM: () => ['blockquote', 0],
}
