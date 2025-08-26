import type { DocsCommands, Editor } from '@weditor/core'
import type { Mark, Schema } from 'prosemirror-model'
import { formatPainterPluginKey, type FormatSnapshot } from '../extensions/format-painter'

const ALIGN = new Set(['left', 'center', 'right', 'justify'])

function snapshotBlock(block: { type: { name: string }; attrs: Record<string, unknown> }): FormatSnapshot['block'] {
  const align = block.attrs.align
  const lineHeight = block.attrs.lineHeight
  const indent = block.attrs.indent
  const level = block.attrs.level
  return {
    align: typeof align === 'string' && ALIGN.has(align) ? (align as FormatSnapshot['block']['align']) : null,
    lineHeight: typeof lineHeight === 'number' ? lineHeight : null,
    indent: typeof indent === 'number' ? indent : 0,
    type: block.type.name,
    level: typeof level === 'number' ? level : undefined,
  }
}

export function formatPainterCommands({
  editor,
  schema,
}: {
  editor: Editor
  schema: Schema
}): Partial<DocsCommands> {
  return {
    copyFormat: () => {
      const { $from } = editor.state.selection
      const marks = $from.marks().filter((m) => m.type.name !== 'comment')
      const snap: FormatSnapshot = {
        marks: marks.map((m) => ({ type: m.type.name, attrs: { ...m.attrs } })),
        block: snapshotBlock($from.parent),
      }
      editor.dispatch(editor.state.tr.setMeta(formatPainterPluginKey, snap))
      return true
    },
    applyFormat: () => {
      const snap = formatPainterPluginKey.getState(editor.state)
      if (!snap) return false
      const { from, to } = editor.state.selection
      const tr = editor.state.tr
      for (const m of snap.marks) {
        const type = schema.marks[m.type]
        if (type) tr.addMark(from, to, type.create(m.attrs))
      }
      const $from = tr.doc.resolve(tr.mapping.map(from))
      if ($from.parent.type.spec.attrs?.align) {
        tr.setNodeMarkup($from.before($from.depth), undefined, {
          ...$from.parent.attrs,
          align: snap.block.align,
          lineHeight: snap.block.lineHeight,
          indent: snap.block.indent,
        })
      }
      tr.setMeta(formatPainterPluginKey, null)
      editor.dispatch(tr)
      return true
    },
    clearPainter: () => {
      if (!formatPainterPluginKey.getState(editor.state)) return false
      editor.dispatch(editor.state.tr.setMeta(formatPainterPluginKey, null))
      return true
    },
    clearFormat: () => {
      const { from, to, $from } = editor.state.selection
      const tr = editor.state.tr
      const comment = schema.marks.comment
      if (comment) {
        const stored: { from: number; to: number; mark: Mark }[] = []
        editor.state.doc.nodesBetween(from, to, (node, pos) => {
          for (const m of node.marks) {
            if (m.type === comment) stored.push({ from: pos, to: pos + node.nodeSize, mark: m })
          }
        })
        tr.removeMark(from, to)
        for (const s of stored) tr.addMark(s.from, s.to, s.mark)
      } else {
        tr.removeMark(from, to)
      }
      if ($from.parent.isTextblock && $from.parent.type.spec.attrs?.align) {
        tr.setNodeMarkup($from.before($from.depth), undefined, {
          ...$from.parent.attrs,
          align: null,
          lineHeight: null,
          indent: 0,
        })
      }
      editor.dispatch(tr)
      return true
    },
  }
}
