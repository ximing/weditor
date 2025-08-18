import type { Extension } from '@weditor/core'
import { Plugin } from 'prosemirror-state'
import { blockCommands } from '../commands/blocks'
import { blockquote } from '../nodes/blockquote'
import { code_block } from '../nodes/code-block'
import { doc } from '../nodes/doc'
import { hard_break } from '../nodes/hard-break'
import { heading } from '../nodes/heading'
import { horizontal_rule } from '../nodes/horizontal-rule'
import { listNodes } from '../nodes/lists'
import { paragraph } from '../nodes/paragraph'
import { taskNodes } from '../nodes/task-list'
import { createTaskItemNodeView } from '../node-views/task-item'

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
      ...listNodes,
      ...taskNodes,
    },
    commands: blockCommands,
    plugins: ({ editor }) => [
      new Plugin({
        props: {
          nodeViews: {
            task_item: createTaskItemNodeView(editor),
          },
        },
      }),
    ],
  }
}
