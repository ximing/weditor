import type { Node as PMNode } from 'prosemirror-model'
import type { NodeView } from 'prosemirror-view'

export function createMentionNodeView() {
  return (node: PMNode): NodeView => {
    const dom = document.createElement('span')
    dom.className = 'mention-embed'
    dom.contentEditable = 'false'

    const sync = (n: PMNode) => {
      dom.setAttribute('data-mention-id', String(n.attrs.id ?? ''))
      dom.setAttribute('data-mention-name', String(n.attrs.name ?? ''))
      dom.textContent = `@${String(n.attrs.name ?? '')}`
    }
    sync(node)

    return {
      dom,
      update(updated) {
        if (updated.type.name !== 'mention') return false
        node = updated
        sync(node)
        return true
      },
      selectNode() {
        dom.classList.add('ProseMirror-selectednode')
      },
      deselectNode() {
        dom.classList.remove('ProseMirror-selectednode')
      },
      ignoreMutation() {
        return true
      },
    }
  }
}
