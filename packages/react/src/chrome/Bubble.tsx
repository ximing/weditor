import { useEffect, useState } from 'react'
import { IconBold, IconComment, IconItalic, IconLink, IconUnderline } from '../icons'
import { useEditor } from '../useEditor'
import { useEditorState } from '../useEditorState'
import { IconButton } from '../ui/IconButton'
import { isMarkActive } from './toolbar-state'

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

  const strong = useEditorState((e) => isMarkActive(e, 'strong'))
  const em = useEditorState((e) => isMarkActive(e, 'em'))
  const underline = useEditorState((e) => isMarkActive(e, 'underline'))

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
      <IconButton
        icon={IconBold}
        label="Bold"
        active={strong}
        onMouseDown={(e) => {
          e.preventDefault()
          editor.commands.toggleStrong()
        }}
      />
      <IconButton
        icon={IconItalic}
        label="Italic"
        active={em}
        onMouseDown={(e) => {
          e.preventDefault()
          editor.commands.toggleEm()
        }}
      />
      <IconButton
        icon={IconUnderline}
        label="Underline"
        active={underline}
        onMouseDown={(e) => {
          e.preventDefault()
          editor.commands.toggleUnderline()
        }}
      />
      <IconButton
        icon={IconComment}
        label="Comment"
        onMouseDown={(e) => {
          e.preventDefault()
          const sel = editor.state.selection
          if (sel.from === sel.to) return
          editor.emit('openComment', { from: sel.from, to: sel.to })
        }}
      />
      <IconButton
        icon={IconLink}
        label="Link"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => {
          const sel = editor.state.selection
          editor.emit('openLink', { from: sel.from, to: sel.to })
        }}
      />
    </div>
  )
}
