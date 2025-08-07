import { setBlockType as pmSetBlockType } from 'prosemirror-commands'
import type { Command, Extension } from '@weditor/core'
import { blockquote } from '../nodes/blockquote'
import { code_block } from '../nodes/code-block'
import { doc } from '../nodes/doc'
import { hard_break } from '../nodes/hard-break'
import { heading } from '../nodes/heading'
import { horizontal_rule } from '../nodes/horizontal-rule'
import { paragraph } from '../nodes/paragraph'

export function nodesExtension(): Extension {
  return {
    name: 'nodes',
    nodes: {
      doc,
      paragraph,
      heading,
      blockquote,
      code_block,
      horizontal_rule,
      hard_break,
    },
    commands: ({ schema, editor }) => {
      const run = (cmd: Command) => cmd(editor.state, (tr) => editor.dispatch(tr))
      return {
        setBlockType: (args) => {
          if ((args as { type: string }).type === 'blockquote') return false
          if (args.type === 'heading') {
            const level = Math.min(6, Math.max(1, args.level ?? 1)) as 1 | 2 | 3 | 4 | 5 | 6
            const { $from } = editor.state.selection
            const prev = $from.parent
            const attrs =
              prev.type.name === 'paragraph' || prev.type.name === 'heading'
                ? {
                    level,
                    align: prev.attrs.align,
                    indent: prev.attrs.indent,
                    lineHeight: prev.attrs.lineHeight,
                  }
                : { level }
            return run(pmSetBlockType(schema.nodes.heading, attrs))
          }
          if (args.type === 'code_block') return run(pmSetBlockType(schema.nodes.code_block))
          const { $from } = editor.state.selection
          const prev = $from.parent
          const attrs =
            prev.type.name === 'heading'
              ? {
                  align: prev.attrs.align,
                  indent: prev.attrs.indent,
                  lineHeight: prev.attrs.lineHeight,
                }
              : {}
          return run(pmSetBlockType(schema.nodes.paragraph, attrs))
        },
      }
    },
  }
}
