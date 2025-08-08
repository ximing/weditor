import {
  chainCommands,
  exitCode,
  lift,
  setBlockType as pmSetBlockType,
  wrapIn,
} from 'prosemirror-commands'
import type { Command, DocsCommands, Editor } from '@weditor/core'
import type { Schema } from 'prosemirror-model'

function setTextblockAttr(
  editor: Editor,
  patch: Record<string, unknown>,
  allowed: ReadonlyArray<string>,
): boolean {
  const { $from, $to } = editor.state.selection
  let tr = editor.state.tr
  let changed = false
  editor.state.doc.nodesBetween($from.pos, $to.pos, (node, pos) => {
    if (!node.isTextblock) return
    if (!allowed.includes(node.type.name)) return
    tr = tr.setNodeMarkup(pos, undefined, { ...node.attrs, ...patch })
    changed = true
  })
  if (!changed) return false
  editor.dispatch(tr)
  return true
}

export function blockCommands({
  schema,
  editor,
}: {
  schema: Schema
  editor: Editor
}): Partial<DocsCommands> {
  const run = (cmd: Command) => cmd(editor.state, (tr) => editor.dispatch(tr))
  return {
    setBlockType: (args) => {
      if ((args as { type: string }).type === 'blockquote') return false
      if (args.type === 'heading') {
        const level = Math.min(6, Math.max(1, args.level ?? 1)) as 1 | 2 | 3 | 4 | 5 | 6
        const { $from } = editor.state.selection
        const prev = $from.parent
        const attrs =
          prev.type.name === 'paragraph' || prev.type.name === 'heading'
            ? {
                level,
                align: prev.attrs.align,
                indent: prev.attrs.indent,
                lineHeight: prev.attrs.lineHeight,
              }
            : { level }
        return run(pmSetBlockType(schema.nodes.heading, attrs))
      }
      if (args.type === 'code_block') return run(pmSetBlockType(schema.nodes.code_block))
      const { $from } = editor.state.selection
      const prev = $from.parent
      const attrs =
        prev.type.name === 'heading'
          ? {
              align: prev.attrs.align,
              indent: prev.attrs.indent,
              lineHeight: prev.attrs.lineHeight,
            }
          : {}
      return run(pmSetBlockType(schema.nodes.paragraph, attrs))
    },
    toggleBlockquote: () => {
      const { $from, $to } = editor.state.selection
      const range = $from.blockRange($to)
      if (range && $from.node(range.depth).type === schema.nodes.blockquote) {
        return run(lift)
      }
      return run(wrapIn(schema.nodes.blockquote))
    },
    toggleCodeBlock: () => {
      const name = editor.state.selection.$from.parent.type.name
      if (name === 'code_block') return editor.commands.setBlockType({ type: 'paragraph' })
      return editor.commands.setBlockType({ type: 'code_block' })
    },
    insertHardBreak: () =>
      run(
        chainCommands(exitCode, (state, dispatch) => {
          dispatch?.(state.tr.replaceSelectionWith(schema.nodes.hard_break.create()).scrollIntoView())
          return true
        }),
      ),
    insertHorizontalRule: () => {
      const node = schema.nodes.horizontal_rule.create()
      editor.dispatch(editor.state.tr.replaceSelectionWith(node))
      return true
    },
    setAlign: ({ align }) => {
      if (align !== null && !['left', 'center', 'right', 'justify'].includes(align)) return false
      return setTextblockAttr(editor, { align }, ['paragraph', 'heading'])
    },
    setLineHeight: ({ lineHeight }) => {
      const allowed = [1, 1.15, 1.5, 2, 2.5, 3, null]
      if (!allowed.includes(lineHeight as never)) return false
      return setTextblockAttr(editor, { lineHeight }, ['paragraph', 'heading'])
    },
    setIndent: ({ indent }) => setTextblockAttr(editor, { indent }, ['paragraph', 'heading']),
  }
}
