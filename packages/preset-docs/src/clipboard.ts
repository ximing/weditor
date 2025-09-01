import { DOMParser, DOMSerializer, type Schema } from 'prosemirror-model'
import { Plugin } from 'prosemirror-state'

export function clipboardPlugin(schema: Schema) {
  return new Plugin({
    props: {
      clipboardParser: DOMParser.fromSchema(schema),
      clipboardSerializer: (() => {
        const nodes = DOMSerializer.nodesFromSchema(schema)
        const marks = { ...DOMSerializer.marksFromSchema(schema) }
        // HTML clipboard matches getHTML: comment anchors stay in the live Slice, not pasted HTML.
        delete marks.comment
        return new DOMSerializer(nodes, marks)
      })(),
    },
  })
}
