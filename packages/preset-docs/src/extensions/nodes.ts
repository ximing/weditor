import type { Extension } from '@weditor/core'
import { blockCommands } from '../commands/blocks'
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
    commands: blockCommands,
  }
}
