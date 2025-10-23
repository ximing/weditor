import { sanitizeSrc, type DocsCommands, type Editor } from '@deditor/core'
import type { Schema } from 'prosemirror-model'
import { NodeSelection } from 'prosemirror-state'

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
      const sel = editor.state.selection
      if (sel instanceof NodeSelection && sel.node.type === schema.nodes.image) {
        const pos = sel.to
        let tr = editor.state.tr.insert(pos, image)
        tr = tr.setSelection(NodeSelection.create(tr.doc, pos))
        editor.dispatch(tr)
        return true
      }
      const { $from } = sel
      let tr = editor.state.tr
      if ($from.parent.isTextblock && $from.parent.content.size > 0) {
        const range = $from.blockRange()
        if (range && tr.doc.canSplit($from.pos)) tr = tr.split($from.pos)
      }
      editor.dispatch(tr.replaceSelectionWith(image))
      return true
    },
    insertMention: ({ id, name }) => {
      const mention = schema.nodes.mention.create({ id, name })
      editor.dispatch(editor.state.tr.replaceSelectionWith(mention))
      return true
    },
  }
}
