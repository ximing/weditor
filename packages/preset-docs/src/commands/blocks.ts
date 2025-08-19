import {
  chainCommands,
  exitCode,
  lift,
  setBlockType as pmSetBlockType,
  wrapIn,
} from 'prosemirror-commands'
import type { Command, DocsCommands, Editor } from '@weditor/core'
import type { Schema } from 'prosemirror-model'

const ALIGN_VALUES = ['left', 'center', 'right', 'justify'] as const
const LINE_HEIGHT_VALUES: ReadonlyArray<number | null> = [1, 1.15, 1.5, 2, 2.5, 3, null]
const TEXTBLOCK_ATTR_NODES = ['paragraph', 'heading'] as const

function setTextblockAttr(
  editor: Editor,
  patch: Record<string, unknown>,
  allowed: ReadonlyArray<string> = TEXTBLOCK_ATTR_NODES,
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

function clampIndent(indent: number): number {
  return Math.max(0, Math.min(8, Math.round(indent)))
}

function inListItem(editor: Editor): boolean {
  const { $from } = editor.state.selection
  for (let d = $from.depth; d > 0; d--) {
    const name = $from.node(d).type.name
    if (name === 'list_item' || name === 'task_item') return true
  }
  return false
}

function currentIndent(editor: Editor): number {
  const n = editor.state.selection.$from.parent.attrs.indent
  return typeof n === 'number' && Number.isFinite(n) ? n : 0
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
      if (align !== null && !ALIGN_VALUES.includes(align)) return false
      return setTextblockAttr(editor, { align })
    },
    setLineHeight: ({ lineHeight }) => {
      if (!LINE_HEIGHT_VALUES.includes(lineHeight)) return false
      return setTextblockAttr(editor, { lineHeight })
    },
    setIndent: ({ indent }) => setTextblockAttr(editor, { indent: clampIndent(indent) }),
    indent: () => {
      if (inListItem(editor) && editor.commands.sinkListItem()) return true
      return editor.commands.setIndent({ indent: currentIndent(editor) + 1 })
    },
    outdent: () => {
      if (inListItem(editor) && editor.commands.liftListItem()) return true
      return editor.commands.setIndent({ indent: currentIndent(editor) - 1 })
    },
  }
}
