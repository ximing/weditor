import type { Editor, Extension } from '@weditor/core'
import type { Schema } from 'prosemirror-model'
import { listCommands } from '../commands/lists'

function isInList(editor: Editor, schema: Schema): boolean {
  const { $from } = editor.state.selection
  for (let d = $from.depth; d > 0; d--) {
    const type = $from.node(d).type
    if (type === schema.nodes.list_item || type === schema.nodes.task_item) return true
  }
  return false
}

export function listsExtension(): Extension {
  return {
    name: 'lists',
    commands: listCommands,
    keymap: ({ editor, schema }) => ({
      Enter: () => editor.commands.splitListItem(),
      Tab: () => {
        if (!isInList(editor, schema)) return false
        return editor.commands.sinkListItem()
      },
      'Shift-Tab': () => {
        if (!isInList(editor, schema)) return false
        return editor.commands.liftListItem()
      },
      'Mod-Enter': () => editor.commands.toggleTaskChecked(),
    }),
  }
}
