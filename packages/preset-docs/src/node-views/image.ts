import type { Editor } from '@weditor/core'
import type { Node as PMNode } from 'prosemirror-model'
import type { EditorView, NodeView } from 'prosemirror-view'

export function createImageNodeView(editor: Editor) {
  return (node: PMNode, view: EditorView, getPos: () => number | undefined): NodeView => {
    const wrap = document.createElement('div')
    wrap.className = 'weditor-image'
    wrap.contentEditable = 'false'

    const img = document.createElement('img')
    const handle = document.createElement('span')
    handle.className = 'weditor-image-handle'
    handle.contentEditable = 'false'

    const sync = (n: PMNode) => {
      img.src = n.attrs.src
      img.alt = n.attrs.alt ?? ''
      if (typeof n.attrs.width === 'number' && Number.isFinite(n.attrs.width)) {
        img.setAttribute('width', String(n.attrs.width))
        img.style.width = `${n.attrs.width}px`
      } else {
        img.removeAttribute('width')
        img.style.width = ''
      }
    }
    sync(node)

    wrap.append(img, handle)

    let dragging = false
    let startX = 0
    let startWidth = 0

    const containerWidth = () =>
      wrap.parentElement?.clientWidth || view.dom.clientWidth || startWidth

    const clampWidth = (next: number) => Math.max(40, Math.min(containerWidth(), next))

    const applyWidth = (width: number) => {
      const pos = getPos()
      if (typeof pos !== 'number') return
      editor.dispatch(
        editor.state.tr.setNodeMarkup(pos, undefined, {
          ...node.attrs,
          width,
        }),
      )
    }

    handle.addEventListener('pointerdown', (event) => {
      if (!editor.editable) return
      event.preventDefault()
      event.stopPropagation()
      dragging = true
      startX = event.clientX
      startWidth =
        typeof node.attrs.width === 'number' && Number.isFinite(node.attrs.width)
          ? node.attrs.width
          : img.getBoundingClientRect().width
      handle.setPointerCapture(event.pointerId)
    })

    handle.addEventListener('pointermove', (event) => {
      if (!dragging) return
      img.style.width = `${clampWidth(startWidth + (event.clientX - startX))}px`
    })

    const endDrag = (event: PointerEvent) => {
      if (!dragging) return
      dragging = false
      if (handle.hasPointerCapture(event.pointerId)) handle.releasePointerCapture(event.pointerId)
      applyWidth(Math.round(clampWidth(startWidth + (event.clientX - startX))))
    }

    handle.addEventListener('pointerup', endDrag)
    handle.addEventListener('pointercancel', endDrag)

    return {
      dom: wrap,
      update(updated) {
        if (updated.type.name !== 'image') return false
        node = updated
        sync(node)
        return true
      },
      selectNode() {
        wrap.classList.add('ProseMirror-selectednode')
      },
      deselectNode() {
        wrap.classList.remove('ProseMirror-selectednode')
      },
      stopEvent(event) {
        return handle.contains(event.target as globalThis.Node)
      },
      ignoreMutation() {
        return true
      },
    }
  }
}
