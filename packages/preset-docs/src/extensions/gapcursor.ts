import type { Extension } from '@deditor/core'
import { gapCursor } from 'prosemirror-gapcursor'

export function gapcursorExtension(): Extension {
  return { name: 'gapcursor', plugins: () => [gapCursor()] }
}
