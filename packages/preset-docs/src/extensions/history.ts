import { history, undo, redo } from 'prosemirror-history'
import type { Editor, Extension } from '@weditor/core'

export function historyExtension(): Extension {
  return {
    name: 'history',
    plugins: () => [history()],
    commands: ({ editor }: { editor: Editor }) => ({
      undo: () => undo(editor.state, (tr) => editor.dispatch(tr)),
      redo: () => redo(editor.state, (tr) => editor.dispatch(tr)),
    }),
  }
}
