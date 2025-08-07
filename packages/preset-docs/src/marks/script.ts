import type { MarkSpec } from 'prosemirror-model'

export const scriptMarks: Record<string, MarkSpec> = {
  superscript: {
    excludes: 'subscript',
    parseDOM: [{ tag: 'sup' }],
    toDOM: () => ['sup', 0],
  },
  subscript: {
    excludes: 'superscript',
    parseDOM: [{ tag: 'sub' }],
    toDOM: () => ['sub', 0],
  },
}
