import type { Extension } from '@weditor/core'
import { columnResizing, goToNextCell, tableEditing } from 'prosemirror-tables'
import { tableCommands } from '../commands/tables'

export function tablesExtension(): Extension {
  return {
    name: 'tables',
    plugins: () => [columnResizing(), tableEditing()],
    // tableEditing 1.8.x does not bind Tab; goToNextCell must sit before lists.
    keymap: () => ({
      Tab: goToNextCell(1),
      'Shift-Tab': goToNextCell(-1),
    }),
    commands: ({ editor }) => tableCommands(editor),
  }
}
