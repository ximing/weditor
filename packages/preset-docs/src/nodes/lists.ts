import type { Node, NodeSpec } from 'prosemirror-model'

function isTaskListParent(dom: Node | string): boolean {
  return dom instanceof HTMLElement && !!dom.parentElement?.hasAttribute('data-task-list')
}

function isTaskList(dom: Node | string): boolean {
  return dom instanceof HTMLElement && dom.hasAttribute('data-task-list')
}

export const listNodes: Record<string, NodeSpec> = {
  bullet_list: {
    group: 'block',
    content: 'list_item+',
    parseDOM: [
      {
        tag: 'ul',
        getAttrs: (dom) => (isTaskList(dom) ? false : null),
      },
    ],
    toDOM: () => ['ul', 0],
  },
  ordered_list: {
    group: 'block',
    content: 'list_item+',
    attrs: { order: { default: 1 } },
    parseDOM: [
      {
        tag: 'ol',
        getAttrs: (dom) => ({
          order:
            dom instanceof HTMLElement && dom.hasAttribute('start')
              ? Number(dom.getAttribute('start'))
              : 1,
        }),
      },
    ],
    toDOM: (node: Node) => ['ol', { start: node.attrs.order === 1 ? null : node.attrs.order }, 0],
  },
  list_item: {
    content: 'paragraph block*',
    parseDOM: [
      {
        tag: 'li',
        getAttrs: (dom) => (isTaskListParent(dom) ? false : null),
      },
    ],
    toDOM: () => ['li', 0],
    defining: true,
  },
}
