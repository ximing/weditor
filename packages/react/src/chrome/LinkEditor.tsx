import type { Editor } from '@deditor/core'
import { useEffect, useRef, useState } from 'react'
import { useEditor } from '../useEditor'
import { Popover, type PopoverAnchor } from '../ui/Popover'
import { activeMarkAttr } from './toolbar-state'

function selectionAnchor(editor: Editor): PopoverAnchor {
  const view = editor.view
  if (!view) return null
  const { from, to } = editor.state.selection
  try {
    const start = view.coordsAtPos(from)
    const end = view.coordsAtPos(Math.max(from, to - 1))
    const left = Math.min(start.left, end.left)
    const top = Math.min(start.top, end.top)
    const rect = new DOMRect(
      left,
      top,
      Math.max(Math.max(start.right, end.right) - left, 1),
      Math.max(Math.max(start.bottom, end.bottom) - top, 1),
    )
    return { getBoundingClientRect: () => rect }
  } catch {
    return null
  }
}

export function LinkEditor() {
  const editor = useEditor()
  const [anchor, setAnchor] = useState<PopoverAnchor>(null)
  const [href, setHref] = useState('')
  const hadLink = useRef(false)

  useEffect(() => {
    return editor.on('openLink', () => {
      const current = activeMarkAttr(editor, 'link', 'href')
      if (editor.state.selection.empty && !current) return
      hadLink.current = !!current
      setHref(current ?? '')
      setAnchor(selectionAnchor(editor))
    })
  }, [editor])

  const close = () => setAnchor(null)
  const apply = () => {
    const value = href.trim()
    if (value) editor.commands.setLink({ href: value })
    else editor.commands.unsetLink()
    close()
  }

  return (
    <Popover open={!!anchor} anchor={anchor} onClose={close} className="deditor-link-editor">
      <form
        className="deditor-link-form"
        onSubmit={(e) => {
          e.preventDefault()
          apply()
        }}
      >
        <input
          aria-label="Link URL"
          placeholder="Paste a link"
          value={href}
          autoFocus
          onChange={(e) => setHref(e.target.value)}
        />
        <button type="submit" className="deditor-chip-btn is-primary" disabled={!href.trim() && !hadLink.current}>
          Apply
        </button>
        {hadLink.current ? (
          <button
            type="button"
            className="deditor-chip-btn"
            onClick={() => {
              editor.commands.unsetLink()
              close()
            }}
          >
            Remove
          </button>
        ) : null}
      </form>
    </Popover>
  )
}
