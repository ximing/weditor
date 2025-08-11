import { Plugin } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'
import type { Extension } from '@weditor/core'

export function placeholderExtension(text: string): Extension {
  return {
    name: 'placeholder',
    plugins: () => [
      new Plugin({
        props: {
          decorations(state) {
            if (state.doc.childCount !== 1) return null
            const p = state.doc.firstChild
            if (!p || p.type.name !== 'paragraph' || p.content.size > 0) return null
            const deco = Decoration.node(0, p.nodeSize, {
              class: 'weditor-placeholder',
              'data-placeholder': text,
            })
            return DecorationSet.create(state.doc, [deco])
          },
        },
      }),
    ],
  }
}
