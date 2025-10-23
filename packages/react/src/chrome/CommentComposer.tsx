import type { User } from '@deditor/core'
import { useEffect, useState } from 'react'
import { useEditor } from '../useEditor'

export function CommentComposer(props: {
  currentUser: User
  range: { from: number; to: number } | null
  onClose: () => void
}) {
  const editor = useEditor()
  const [body, setBody] = useState('')
  const [, bump] = useState(0)
  useEffect(() => editor.on('transaction', () => bump((n) => n + 1)), [editor])
  useEffect(() => {
    setBody('')
  }, [props.range?.from, props.range?.to])

  if (!props.range || !editor.editable) return null

  return (
    <div className="deditor-comment-composer">
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
