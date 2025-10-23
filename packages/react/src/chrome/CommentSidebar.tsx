import type { CommentThread, Editor, User } from '@deditor/core'
import { commentsUiKey, pickCommentIdAt } from '@deditor/preset-docs'
import { TextSelection } from 'prosemirror-state'
import { useEffect, useState } from 'react'
import { useEditor } from '../useEditor'

function firstCommentRange(doc: Editor['state']['doc'], id: string): { from: number; to: number } | null {
  const type = doc.type.schema.marks.comment
  if (!type) return null
  let from: number | undefined
  let to: number | undefined
  doc.nodesBetween(0, doc.content.size, (node, pos) => {
    if (from !== undefined && to !== undefined && pos > to) return false
    if (!node.isText) return true
    for (const mark of node.marks) {
      if (mark.type === type && String(mark.attrs.id) === id) {
        const start = pos
        const end = pos + node.nodeSize
        if (from === undefined) {
          from = start
          to = end
        } else if (to !== undefined && start <= to) {
          to = Math.max(to, end)
        }
      }
    }
    return true
  })
  return from !== undefined && to !== undefined ? { from, to } : null
}

function skeletonRows(editor: Editor): { id: string; quote: string }[] {
  const type = editor.schema.marks.comment
  if (!type) return []
  const seen = new Set<string>()
  const rows: { id: string; quote: string }[] = []
  editor.state.doc.descendants((node) => {
    if (!node.isText) return
    for (const mark of node.marks) {
      if (mark.type !== type) continue
      const id = String(mark.attrs.id)
      if (seen.has(id)) continue
      seen.add(id)
      if (editor.comments.isTombstoned(id) || editor.comments.get(id)) continue
      const range = firstCommentRange(editor.state.doc, id)
      const quote = range ? editor.state.doc.textBetween(range.from, range.to, ' ') : (node.text ?? '')
      rows.push({ id, quote })
    }
  })
  return rows
}

function dispatchActive(editor: Editor, id: string, select: boolean) {
  let tr = editor.state.tr.setMeta(commentsUiKey, { activeId: id }).setMeta('addToHistory', false)
  if (select) {
    const range = firstCommentRange(editor.state.doc, id)
    if (range && range.from < range.to) {
      tr = tr.setSelection(TextSelection.create(tr.doc, range.from, range.to))
    }
  }
  editor.dispatch(tr)
}

function pickIdFromEvent(editor: Editor, event: MouseEvent): string | undefined {
  const view = editor.view
  if (!view) return undefined
  const target = event.target
  if (!(target instanceof Node) || !view.dom.contains(target)) return undefined
  const positions: number[] = []
  try {
    positions.push(view.posAtDOM(target, 0))
  } catch {
    /* posAtDOM can throw for non-mapped widgets */
  }
  const coords = view.posAtCoords({ left: event.clientX, top: event.clientY })
  if (coords) {
    positions.push(coords.pos)
    if (coords.inside >= 0) positions.push(coords.inside)
  }
  for (const pos of positions) {
    const id = pickCommentIdAt(editor.state.doc, pos, editor.comments)
    if (id) return id
    if (pos > 0) {
      const before = pickCommentIdAt(editor.state.doc, pos - 1, editor.comments)
      if (before) return before
    }
  }
  return undefined
}

function ThreadActions(props: { id: string; resolved: boolean; currentUser: User }) {
  const editor = useEditor()
  const [body, setBody] = useState('')
  return (
    <div className="deditor-comment-actions" onClick={(e) => e.stopPropagation()}>
      <textarea
        aria-label="Reply"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <button
        type="button"
        onClick={() => {
          if (!body) return
          editor.commands.replyToComment({
            id: props.id,
            body,
            author: props.currentUser,
          })
          setBody('')
        }}
      >
        Reply
      </button>
      <button
        type="button"
        title={props.resolved ? 'Reopen' : 'Resolve'}
        onClick={() => editor.commands.toggleCommentResolved({ id: props.id })}
      >
        {props.resolved ? 'Reopen' : 'Resolve'}
      </button>
      <button
        type="button"
        title="Delete"
        onClick={() => editor.commands.deleteComment({ id: props.id })}
      >
        Delete
      </button>
    </div>
  )
}

export function CommentSidebar(props: { currentUser: User; readOnly?: boolean }) {
  const editor = useEditor()
  const [, bump] = useState(0)
  useEffect(() => {
    const onBump = () => bump((n) => n + 1)
    const offComments = editor.on('comments', onBump)
    const offTr = editor.on('transaction', onBump)
    return () => {
      offComments()
      offTr()
    }
  }, [editor])

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const id = pickIdFromEvent(editor, event)
      if (!id) return
      dispatchActive(editor, id, false)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [editor])

  const listed = editor.comments.list()
  const listedIds = new Set(listed.map((t) => t.id))
  const attached = listed.filter((t) => !t.resolved && !t.detached)
  const detached = listed.filter((t) => !t.resolved && t.detached)
  const resolved = listed.filter((t) => t.resolved)
  const skels = skeletonRows(editor).filter((s) => !listedIds.has(s.id))
  const rows: { id: string; thread?: CommentThread; quote: string; skeleton: boolean }[] = [
    ...attached.map((thread) => ({ id: thread.id, thread, quote: thread.quote, skeleton: false })),
    ...skels.map((s) => ({ id: s.id, quote: s.quote, skeleton: true })),
    ...detached.map((thread) => ({ id: thread.id, thread, quote: thread.quote, skeleton: false })),
    ...resolved.map((thread) => ({ id: thread.id, thread, quote: thread.quote, skeleton: false })),
  ]

  const activeId = commentsUiKey.getState(editor.state)?.activeId ?? null

  useEffect(() => {
    if (!activeId) return
    const el = document.querySelector(`[data-comment-id="${CSS.escape(activeId)}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [activeId])

  if (rows.length === 0) return null

  const editable = editor.editable && !props.readOnly

  return (
    <aside className="deditor-sidebar deditor-comment-sidebar">
      {rows.map((row) => (
        <article
          key={row.id}
          data-comment-id={row.id}
          className={['deditor-comment-thread', activeId === row.id ? 'is-active' : '']
            .filter(Boolean)
            .join(' ')}
          onClick={() => dispatchActive(editor, row.id, !(row.thread?.detached ?? false))}
        >
          <blockquote className="deditor-comment-quote">{row.quote}</blockquote>
          {row.skeleton || !row.thread ? (
            <div className="deditor-comment-skel-msg">Loading thread…</div>
          ) : (
            <>
              {row.thread.comments.map((msg) => (
                <div key={msg.id} className="deditor-comment-message">
                  {msg.body}
                </div>
              ))}
              {row.thread.resolved ? (
                <div className="deditor-comment-flag">Resolved</div>
              ) : null}
              {editable ? (
                <ThreadActions
                  id={row.id}
                  resolved={row.thread.resolved}
                  currentUser={props.currentUser}
                />
              ) : null}
            </>
          )}
        </article>
      ))}
    </aside>
  )
}
