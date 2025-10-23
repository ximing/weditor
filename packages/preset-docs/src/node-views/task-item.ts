import type { Editor } from '@deditor/core'
import type { Node as PMNode } from 'prosemirror-model'
import type { NodeView } from 'prosemirror-view'

export function createTaskItemNodeView(editor: Editor) {
  return (node: PMNode, _view: unknown, getPos: () => number | undefined): NodeView => {
    const dom = document.createElement('li')
    const box = document.createElement('span')
    const contentDOM = document.createElement('div')
    box.className = 'deditor-task-checkbox'
    box.contentEditable = 'false'
    box.setAttribute('role', 'checkbox')

    const sync = (n: PMNode) => {
      const checked = n.attrs.checked ? 'true' : 'false'
      dom.setAttribute('data-checked', checked)
      box.setAttribute('aria-checked', checked)
    }
    sync(node)

    box.addEventListener('mousedown', (event) => {
      event.preventDefault()
    })
    box.addEventListener('click', (event) => {
      event.preventDefault()
      const pos = getPos()
      const toggle = editor.commands.toggleTaskChecked as (pos?: number) => boolean
      toggle(typeof pos === 'number' ? pos : undefined)
    })

    dom.append(box, contentDOM)
    return {
      dom,
      contentDOM,
      update(updated) {
        if (updated.type.name !== 'task_item') return false
        node = updated
        sync(node)
        return true
      },
      ignoreMutation(mutation) {
        return mutation.type === 'attributes'
      },
    }
  }
}
