import { baseKeymap } from 'prosemirror-commands'
import { keymap } from 'prosemirror-keymap'
import type { Extension } from '@weditor/core'

export function baseKeymapExtension(): Extension {
  return {
    name: 'baseKeymap',
    plugins: () => [keymap(baseKeymap)],
  }
}
