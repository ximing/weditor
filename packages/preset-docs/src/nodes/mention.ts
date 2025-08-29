import type { NodeSpec } from 'prosemirror-model'

export const mention: NodeSpec = {
  group: 'inline',
  inline: true,
  atom: true,
  selectable: true,
  attrs: {
    id: { default: '' },
    name: { default: '' },
  },
  parseDOM: [
    {
      tag: 'span.mention-embed',
      getAttrs: (dom) => {
        if (!(dom instanceof HTMLElement)) return false
        return {
          id: dom.getAttribute('data-mention-id') ?? '',
          name: dom.getAttribute('data-mention-name') ?? '',
        }
      },
    },
  ],
  toDOM: (node) => [
    'span',
    {
      class: 'mention-embed',
      'data-mention-id': node.attrs.id,
      'data-mention-name': node.attrs.name,
    },
    '@' + node.attrs.name,
  ],
}
