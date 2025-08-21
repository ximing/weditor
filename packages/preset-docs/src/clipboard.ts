import { DOMParser, DOMSerializer, type Schema } from 'prosemirror-model'
import { Plugin } from 'prosemirror-state'

export function clipboardPlugin(schema: Schema) {
  return new Plugin({
    props: {
      clipboardParser: DOMParser.fromSchema(schema),
      clipboardSerializer: (() => {
        const nodes = DOMSerializer.nodesFromSchema(schema)
        const marks = { ...DOMSerializer.marksFromSchema(schema) }
        delete marks.comment
        return new DOMSerializer(nodes, marks)
      })(),
    },
  })
}
