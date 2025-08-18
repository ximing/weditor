import { schemaFromExtensions, type Extension } from '@weditor/core'
import { baseKeymapExtension } from './extensions/base-keymap'
import { historyExtension } from './extensions/history'
import { keymapExtension } from './extensions/keymap'
import { listsExtension } from './extensions/lists'
import { marksExtension } from './extensions/marks'
import { nodesExtension } from './extensions/nodes'
import { placeholderExtension } from './extensions/placeholder'

export function docsPreset(opts?: { placeholder?: string }): Extension[] {
  return [
    historyExtension(),
    nodesExtension(),
    marksExtension(),
    listsExtension(),
    placeholderExtension(opts?.placeholder ?? 'Start typing…'),
    keymapExtension(),
    baseKeymapExtension(),
  ]
}

export function docsSchema() {
  return schemaFromExtensions(docsPreset())
}
