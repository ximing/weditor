import { sanitizeSrc, type Editor } from '@deditor/core'
import type { Node as PMNode } from 'prosemirror-model'
import type { EditorView, NodeView } from 'prosemirror-view'

export function createImageNodeView(editor: Editor) {
  return (node: PMNode, view: EditorView, getPos: () => number | undefined): NodeView => {
    const wrap = document.createElement('div')
    wrap.className = 'deditor-image'
    wrap.contentEditable = 'false'

    const img = document.createElement('img')
    const handle = document.createElement('span')
    handle.className = 'deditor-image-handle'
    handle.contentEditable = 'false'

    const sync = (n: PMNode) => {
      img.src = sanitizeSrc(String(n.attrs.src ?? '')) ?? ''
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

    const currentNode = () => {
      const pos = getPos()
      if (typeof pos !== 'number') return node
      return view.state.doc.nodeAt(pos) ?? node
    }

    const containerWidth = () =>
      wrap.parentElement?.clientWidth || view.dom.clientWidth || startWidth

    const clampWidth = (next: number) => Math.max(40, Math.min(containerWidth(), next))

    const applyWidth = (width: number) => {
      const pos = getPos()
      if (typeof pos !== 'number') return
      const current = view.state.doc.nodeAt(pos)
      if (!current || current.type.name !== 'image') return
      editor.dispatch(
        editor.state.tr.setNodeMarkup(pos, undefined, {
          ...current.attrs,
          width,
        }),
      )
    }

    const onPointerDown = (event: PointerEvent) => {
      if (!editor.editable) return
      event.preventDefault()
      event.stopPropagation()
      dragging = true
      startX = event.clientX
      const current = currentNode()
      startWidth =
        typeof current.attrs.width === 'number' && Number.isFinite(current.attrs.width)
          ? current.attrs.width
          : img.getBoundingClientRect().width
      handle.setPointerCapture(event.pointerId)
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return
      img.style.width = `${clampWidth(startWidth + (event.clientX - startX))}px`
    }

    const endDrag = (event: PointerEvent) => {
      if (!dragging) return
      dragging = false
      if (handle.hasPointerCapture(event.pointerId)) handle.releasePointerCapture(event.pointerId)
      applyWidth(Math.round(clampWidth(startWidth + (event.clientX - startX))))
    }

    handle.addEventListener('pointerdown', onPointerDown)
    handle.addEventListener('pointermove', onPointerMove)
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
      destroy() {
        handle.removeEventListener('pointerdown', onPointerDown)
        handle.removeEventListener('pointermove', onPointerMove)
        handle.removeEventListener('pointerup', endDrag)
        handle.removeEventListener('pointercancel', endDrag)
      },
    }
  }
}
