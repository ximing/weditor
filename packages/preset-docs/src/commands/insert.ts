import { sanitizeSrc, type DocsCommands, type Editor } from '@weditor/core'
import type { Schema } from 'prosemirror-model'

export function insertCommands({
  schema,
  editor,
}: {
  schema: Schema
  editor: Editor
}): Partial<DocsCommands> {
  return {
    insertImage: ({ src, alt, width }) => {
      const clean = sanitizeSrc(src)
      if (!clean) return false
      const image = schema.nodes.image.create({
        src: clean,
        alt: alt ?? '',
        width: width ?? null,
      })
      const { $from } = editor.state.selection
      let tr = editor.state.tr
      if ($from.parent.isTextblock && $from.parent.content.size > 0) {
        const range = $from.blockRange()
        if (range && tr.doc.canSplit($from.pos)) tr = tr.split($from.pos)
      }
      editor.dispatch(tr.replaceSelectionWith(image))
      return true
    },
  }
}
