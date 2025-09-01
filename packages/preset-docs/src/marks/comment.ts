import type { MarkSpec } from 'prosemirror-model'

export const commentMark: Record<string, MarkSpec> = {
  comment: {
    attrs: { id: { default: '' } },
    excludes: '',
    inclusive: true,
    parseDOM: [{ tag: 'span[data-comment-id]', ignore: true }],
    toDOM: (mark) => ['span', { 'data-comment-id': mark.attrs.id }, 0],
  },
}
