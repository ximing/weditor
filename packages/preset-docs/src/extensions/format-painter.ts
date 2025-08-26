import type { Extension } from '@weditor/core'
import { Plugin, PluginKey } from 'prosemirror-state'
import { formatPainterCommands } from '../commands/format-painter'

export interface FormatSnapshot {
  marks: { type: string; attrs?: Record<string, unknown> }[]
  block: {
    align: 'left' | 'center' | 'right' | 'justify' | null
    lineHeight: number | null
    indent: number
    type: string
    level?: number
  }
}

export const formatPainterPluginKey = new PluginKey<FormatSnapshot | null>('formatPainter')

export function formatPainterExtension(): Extension {
  return {
    name: 'formatPainter',
    plugins: () => [
      new Plugin<FormatSnapshot | null>({
        key: formatPainterPluginKey,
        state: {
          init: () => null,
          apply(tr, value) {
            const meta = tr.getMeta(formatPainterPluginKey) as FormatSnapshot | null | undefined
            if (meta === undefined) return value
            return meta
          },
        },
      }),
    ],
    commands: formatPainterCommands,
    keymap: ({ editor }) => ({
      Escape: () => editor.commands.clearPainter(),
    }),
  }
}
