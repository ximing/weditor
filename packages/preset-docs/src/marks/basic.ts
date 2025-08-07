import type { MarkSpec } from 'prosemirror-model'

export const basicMarks: Record<string, MarkSpec> = {
  strong: {
    parseDOM: [
      { tag: 'strong' },
      { tag: 'b' },
      { style: 'font-weight=bold' },
      { style: 'font-weight=bolder' },
    ],
    toDOM: () => ['strong', 0],
  },
  em: {
    parseDOM: [{ tag: 'em' }, { tag: 'i' }, { style: 'font-style=italic' }],
    toDOM: () => ['em', 0],
  },
  underline: {
    parseDOM: [{ tag: 'u' }, { style: 'text-decoration=underline' }],
    toDOM: () => ['u', 0],
  },
  strike: {
    parseDOM: [{ tag: 's' }, { tag: 'del' }, { style: 'text-decoration=line-through' }],
    toDOM: () => ['s', 0],
  },
  code: {
    parseDOM: [{ tag: 'code', context: 'paragraph/' }],
    toDOM: () => ['code', 0],
  },
}
