import { useEffect, useState } from 'react'
import { useEditor } from '../useEditor'

export function Bubble() {
  const editor = useEditor()
  const [, setTick] = useState(0)
  useEffect(() => {
    const bump = () => setTick((n) => n + 1)
    const offSel = editor.on('selection', bump)
    const offTx = editor.on('transaction', bump)
    bump()
    return () => {
      offSel()
      offTx()
    }
  }, [editor])

  const { from, to } = editor.state.selection
  if (from === to) return null

  let left = 0
  let top = 0
  const view = editor.view
  if (view) {
    try {
      const start = view.coordsAtPos(from)
      const end = view.coordsAtPos(Math.max(from, to - 1))
      const parent = view.dom.closest('.deditor-root') ?? view.dom.parentElement
      const box = parent?.getBoundingClientRect()
      const ox = box?.left ?? 0
      const oy = box?.top ?? 0
      left = (start.left + end.left) / 2 - ox
      top = Math.min(start.top, end.top) - oy
    } catch {
      /* coordsAtPos can throw before layout */
    }
  }

  return (
    <div
      className="deditor-bubble"
      style={{ position: 'absolute', left, top, transform: 'translate(-50%, -100%)' }}
    >
      <button
        type="button"
        title="Bold"
        onMouseDown={(e) => {
          e.preventDefault()
          editor.commands.toggleStrong()
        }}
      >
        B
      </button>
      <button
        type="button"
        title="Italic"
        onMouseDown={(e) => {
          e.preventDefault()
          editor.commands.toggleEm()
        }}
      >
        I
      </button>
      <button
        type="button"
        title="Underline"
        onMouseDown={(e) => {
          e.preventDefault()
          editor.commands.toggleUnderline()
        }}
      >
        U
      </button>
      <button
        type="button"
        title="Comment"
        onMouseDown={(e) => {
          e.preventDefault()
          const sel = editor.state.selection
          if (sel.from === sel.to) return
          editor.emit('openComment', { from: sel.from, to: sel.to })
        }}
      >
        Comment
      </button>
      <button
        type="button"
        title="Link"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => {
          const { from, to } = editor.state.selection
          editor.emit('openLink', { from, to })
        }}
      >
        Link
      </button>
    </div>
  )
}
