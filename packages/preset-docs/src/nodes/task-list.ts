import type { Node, NodeSpec } from 'prosemirror-model'

export const taskNodes: Record<string, NodeSpec> = {
  task_list: {
    group: 'block',
    content: 'task_item+',
    parseDOM: [{ tag: 'ul[data-task-list]', priority: 60 }],
    toDOM: () => ['ul', { 'data-task-list': 'true' }, 0],
  },
  task_item: {
    content: 'paragraph block*',
    attrs: { checked: { default: false } },
    parseDOM: [
      {
        tag: 'ul[data-task-list] > li',
        priority: 60,
        getAttrs: (dom) => ({
          checked: dom instanceof HTMLElement && dom.getAttribute('data-checked') === 'true',
        }),
      },
    ],
    toDOM: (node: Node) => ['li', { 'data-checked': node.attrs.checked ? 'true' : 'false' }, 0],
    defining: true,
  },
}
