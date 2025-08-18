import type { Command, DocsCommands, Editor } from '@weditor/core'
import type { NodeType, Schema } from 'prosemirror-model'
import {
  liftListItem as pmLift,
  sinkListItem as pmSink,
  splitListItem as pmSplit,
  wrapInList,
} from 'prosemirror-schema-list'
import { TextSelection } from 'prosemirror-state'

export function splitTaskItem(itemType: NodeType): Command {
  const split = pmSplit(itemType)
  return (state, dispatch) => {
    if (!dispatch) return split(state, undefined)
    return split(state, (tr) => {
      const $from = tr.selection.$from
      for (let d = $from.depth; d > 0; d--) {
        if ($from.node(d).type === itemType) {
          tr.setNodeMarkup($from.before(d), undefined, {
            ...$from.node(d).attrs,
            checked: false,
          })
          break
        }
      }
      dispatch(tr)
    })
  }
}

function itemTypeAround(editor: Editor, schema: Schema): NodeType | null {
  const { $from } = editor.state.selection
  for (let d = $from.depth; d > 0; d--) {
    const type = $from.node(d).type
    if (type === schema.nodes.list_item || type === schema.nodes.task_item) return type
  }
  return null
}

function toggleList(editor: Editor, listType: NodeType, itemType: NodeType): boolean {
  const run = (cmd: Command) => cmd(editor.state, (tr) => editor.dispatch(tr))
  if (run(wrapInList(listType))) return true
  return run(pmLift(itemType))
}

export function listCommands({
  schema,
  editor,
}: {
  schema: Schema
  editor: Editor
}): Partial<DocsCommands> {
  const run = (cmd: Command) => cmd(editor.state, (tr) => editor.dispatch(tr))
  return {
    toggleBulletList: () => toggleList(editor, schema.nodes.bullet_list, schema.nodes.list_item),
    toggleOrderedList: () => toggleList(editor, schema.nodes.ordered_list, schema.nodes.list_item),
    toggleTaskList: () => toggleList(editor, schema.nodes.task_list, schema.nodes.task_item),
    sinkListItem: () => {
      const item = itemTypeAround(editor, schema)
      if (!item) return false
      return run(pmSink(item))
    },
    liftListItem: () => {
      const item = itemTypeAround(editor, schema)
      if (!item) return false
      return run(pmLift(item))
    },
    splitListItem: () => {
      const { $from } = editor.state.selection
      for (let d = $from.depth; d > 0; d--) {
        const type = $from.node(d).type
        if (type === schema.nodes.task_item) {
          return splitTaskItem(schema.nodes.task_item)(editor.state, (tr) => editor.dispatch(tr))
        }
        if (type === schema.nodes.list_item) {
          return pmSplit(schema.nodes.list_item)(editor.state, (tr) => editor.dispatch(tr))
        }
      }
      return false
    },
    toggleTaskChecked: (pos?: number) => {
      const { state } = editor
      let tr = state.tr
      if (typeof pos === 'number') {
        if (pos < 0 || pos > state.doc.content.size) return false
        const $pos = state.doc.resolve(pos)
        if ($pos.nodeAfter?.type !== schema.nodes.task_item) return false
        tr = tr.setSelection(TextSelection.near(state.doc.resolve(pos + 1)))
      }
      const $from = tr.selection.$from
      for (let d = $from.depth; d > 0; d--) {
        if ($from.node(d).type === schema.nodes.task_item) {
          const node = $from.node(d)
          editor.dispatch(
            tr.setNodeMarkup($from.before(d), undefined, {
              ...node.attrs,
              checked: !node.attrs.checked,
            }),
          )
          return true
        }
      }
      return false
    },
  }
}
