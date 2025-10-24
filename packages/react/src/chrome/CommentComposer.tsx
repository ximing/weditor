import type { User } from '@deditor/core'
import { useEffect, useState } from 'react'
import { useEditor } from '../useEditor'
import { type MarginBox, marginLeft } from './comment-margin-pos'

export function CommentComposer(props: {
  currentUser: User
  range: { from: number; to: number } | null
  onClose: () => void
}) {
  const editor = useEditor()
  const [body, setBody] = useState('')
  const [, bump] = useState(0)

  // Recompute triggers: document transactions and window resize. The composer
  // is absolutely positioned inside `.deditor-root`, so page scrolling needs
  // no listener (root-relative coordinates scroll with the document).
  useEffect(() => {
    const onBump = () => bump((n) => n + 1)
    const offTr = editor.on('transaction', onBump)
    window.addEventListener('resize', onBump)
    return () => {
      offTr()
      window.removeEventListener('resize', onBump)
    }
  }, [editor])

  useEffect(() => {
    setBody('')
  }, [props.range?.from, props.range?.to])

  if (!props.range || !editor.editable) return null

  // Anchor geometry: vertical position from the selection start, converted
  // from viewport to `.deditor-root`-relative coordinates (same conversion as
  // collectAnchors); horizontal placement via the shared marginLeft rules.
  const view = editor.view
  const rootEl = view
    ? ((view.dom.closest('.deditor-root') as HTMLElement | null) ??
      (view.dom.parentElement as HTMLElement | null))
    : null
  const docEl = view ? (view.dom.closest('.deditor-doc') as HTMLElement | null) : null
  let top = 0
  let geo: MarginBox = { left: 0, width: 320, overlay: false }
  if (view && rootEl) {
    const rootRect = rootEl.getBoundingClientRect()
    const docRect = docEl ? docEl.getBoundingClientRect() : rootRect
    geo = marginLeft(docRect, rootRect, rootRect.width || rootEl.offsetWidth || 0)
    try {
      top = view.coordsAtPos(props.range.from).top - rootRect.top
    } catch {
      top = 0
    }
  }

  return (
    <div
      className={['deditor-comment-composer', geo.overlay ? 'is-overlay' : '']
        .filter(Boolean)
        .join(' ')}
      style={{ top, left: geo.left, width: geo.width }}
    >
      <textarea
        placeholder="Start typing…"
        className="deditor-comment-input"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <div className="deditor-comment-actions">
        <button type="button" className="deditor-chip-btn" onClick={() => props.onClose()}>
          Discard
        </button>
        <button
          type="button"
          className="deditor-chip-btn is-primary"
          onClick={() => {
            const range = props.range
            if (!range) return
            editor.commands.addComment({
              body,
              author: props.currentUser,
              from: range.from,
              to: range.to,
            })
            props.onClose()
          }}
        >
          Comment
        </button>
      </div>
    </div>
  )
}
