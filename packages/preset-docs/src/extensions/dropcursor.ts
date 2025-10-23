import type { Extension } from '@deditor/core'
import { dropCursor } from 'prosemirror-dropcursor'

export function dropcursorExtension(): Extension {
  return { name: 'dropcursor', plugins: () => [dropCursor({ color: '#4f81bd', width: 2 })] }
}
