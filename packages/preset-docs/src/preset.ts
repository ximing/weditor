import { schemaFromExtensions, type Extension } from '@weditor/core'
import { baseKeymapExtension } from './extensions/base-keymap'
import { dropcursorExtension } from './extensions/dropcursor'
import { formatPainterExtension } from './extensions/format-painter'
import { gapcursorExtension } from './extensions/gapcursor'
import { historyExtension } from './extensions/history'
import { keymapExtension } from './extensions/keymap'
import { listsExtension } from './extensions/lists'
import { marksExtension } from './extensions/marks'
import { nodesExtension } from './extensions/nodes'
import { placeholderExtension } from './extensions/placeholder'
import { tablesExtension } from './extensions/tables'

export function docsPreset(opts?: { placeholder?: string }): Extension[] {
  return [
    historyExtension(),
    nodesExtension(),
    marksExtension(),
    tablesExtension(),
    listsExtension(),
    gapcursorExtension(),
    dropcursorExtension(),
    formatPainterExtension(),
    placeholderExtension(opts?.placeholder ?? 'Start typing…'),
    keymapExtension(),
    baseKeymapExtension(),
  ]
}

export function docsSchema() {
  return schemaFromExtensions(docsPreset())
}
