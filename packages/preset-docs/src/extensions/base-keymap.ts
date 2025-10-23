import { baseKeymap } from 'prosemirror-commands'
import { keymap } from 'prosemirror-keymap'
import type { Extension } from '@deditor/core'

export function baseKeymapExtension(): Extension {
  return {
    name: 'baseKeymap',
    plugins: () => [keymap(baseKeymap)],
  }
}
