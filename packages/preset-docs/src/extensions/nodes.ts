import type { Extension } from '@weditor/core'
import { Plugin } from 'prosemirror-state'
import { clipboardPlugin } from '../clipboard'
import { blockCommands } from '../commands/blocks'
import { insertCommands } from '../commands/insert'
import { blockquote } from '../nodes/blockquote'
import { code_block } from '../nodes/code-block'
import { doc } from '../nodes/doc'
import { hard_break } from '../nodes/hard-break'
import { heading } from '../nodes/heading'
import { horizontal_rule } from '../nodes/horizontal-rule'
import { image } from '../nodes/image'
import { listNodes } from '../nodes/lists'
import { mention } from '../nodes/mention'
import { paragraph } from '../nodes/paragraph'
import { tableNodeSpecs } from '../nodes/table'
import { taskNodes } from '../nodes/task-list'
import { createImageNodeView } from '../node-views/image'
import { createMentionNodeView } from '../node-views/mention'
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
      image,
      mention,
      ...listNodes,
      ...taskNodes,
      ...tableNodeSpecs,
    },
    commands: (ctx) => ({
      ...blockCommands(ctx),
      ...insertCommands(ctx),
    }),
    plugins: ({ editor, schema }) => [
      clipboardPlugin(schema),
      new Plugin({
        props: {
          nodeViews: {
            task_item: createTaskItemNodeView(editor),
            image: createImageNodeView(editor),
            mention: createMentionNodeView(),
          },
        },
      }),
    ],
  }
}
