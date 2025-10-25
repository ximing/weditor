import type { CommentThread, Editor, User } from '@deditor/core'
import { commentsUiKey, pickCommentIdAt } from '@deditor/preset-docs'
import { TextSelection } from 'prosemirror-state'
import type { CSSProperties } from 'react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { IconCheck, IconReply, IconTrash, IconUndo } from '../icons'
import { IconButton } from '../ui/IconButton'
import { useEditor } from '../useEditor'
import {
  type MarginBox,
  collectAnchors,
  firstCommentRange,
  marginLeft,
  resolveOverlap,
} from './comment-margin-pos'

function CommentTime({ createdAt }: { createdAt: number }) {
  const date = new Date(createdAt)
  if (Number.isNaN(date.getTime())) return null
  return <time dateTime={date.toISOString()}>{date.toLocaleString()}</time>
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
      tr = tr
        .setSelection(TextSelection.create(tr.doc, range.from, range.to))
        .scrollIntoView()
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
  const [draft, setDraft] = useState<string | null>(null)
  const submit = () => {
    if (!draft || !draft.trim()) return
    editor.commands.replyToComment({
      id: props.id,
      body: draft,
      author: props.currentUser,
    })
    setDraft(null)
  }
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <div className="deditor-thread-actions">
        <IconButton
          icon={IconReply}
          label="Reply"
          onClick={() => setDraft((d) => (d === null ? '' : d))}
        />
        <IconButton
          icon={props.resolved ? IconUndo : IconCheck}
          label={props.resolved ? 'Reopen' : 'Mark resolved'}
          onClick={() => editor.commands.toggleCommentResolved({ id: props.id })}
        />
        <IconButton
          icon={IconTrash}
          label="Delete"
          onClick={() => editor.commands.deleteComment({ id: props.id })}
        />
      </div>
      {draft !== null ? (
        <div className="deditor-thread-reply">
          <textarea
            autoFocus
            aria-label="Reply"
            className="deditor-comment-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setDraft(null)
            }}
          />
          <button type="button" className="deditor-chip-btn is-primary" onClick={submit}>
            Send
          </button>
        </div>
      ) : null}
    </div>
  )
}

interface SidebarRow {
  id: string
  thread?: CommentThread
  quote: string
  skeleton: boolean
}

function ThreadCard(props: {
  row: SidebarRow
  active: boolean
  editable: boolean
  currentUser: User
  style?: CSSProperties
  cardRef?: (el: HTMLElement | null) => void
  onClick: () => void
}) {
  const { row } = props
  return (
    <article
      ref={props.cardRef}
      data-comment-id={row.id}
      className={['deditor-comment-thread', props.active ? 'is-active' : '']
        .filter(Boolean)
        .join(' ')}
      style={props.style}
      onClick={props.onClick}
    >
      <blockquote className="deditor-comment-quote">{row.quote}</blockquote>
      {row.skeleton || !row.thread ? (
        <div className="deditor-comment-skel-msg">Loading thread…</div>
      ) : (
        <>
          {row.thread.comments.map((msg) => (
            <div key={msg.id} className="deditor-comment-message">
              <div className="deditor-comment-meta">
                <span
                  className="deditor-comment-avatar"
                  style={{ background: msg.author.color ?? 'var(--deditor-primary)' }}
                  aria-hidden
                >
                  {msg.author.name.slice(0, 1).toUpperCase()}
                </span>
                <span className="deditor-comment-author">{msg.author.name}</span>
                <CommentTime createdAt={msg.createdAt} />
              </div>
              <div className="deditor-comment-body">{msg.body}</div>
            </div>
          ))}
          {row.thread.resolved ? (
            <div className="deditor-comment-flag">
              <IconCheck size={14} aria-hidden /> Resolved
            </div>
          ) : null}
          {props.editable ? (
            <ThreadActions
              id={row.id}
              resolved={row.thread.resolved}
              currentUser={props.currentUser}
            />
          ) : null}
        </>
      )}
    </article>
  )
}

export function CommentSidebar(props: { currentUser: User; readOnly?: boolean }) {
  const editor = useEditor()
  const [, bump] = useState(0)
  const [heights, setHeights] = useState<Record<string, number>>({})
  const asideRef = useRef<HTMLElement | null>(null)
  const cardRefs = useRef(new Map<string, HTMLElement>())

  // Recompute triggers 1-2: document transactions and comment store changes.
  useEffect(() => {
    const onBump = () => bump((n) => n + 1)
    const offComments = editor.on('comments', onBump)
    const offTr = editor.on('transaction', onBump)
    return () => {
      offComments()
      offTr()
    }
  }, [editor])

  // Recompute triggers 3-4: window resize and document surface resize. The
  // observer is created at most once per editor: re-creating it per render
  // would loop forever, since observe() always fires an initial notification.
  useEffect(() => {
    const onBump = () => bump((n) => n + 1)
    window.addEventListener('resize', onBump)
    let observer: ResizeObserver | null = null
    const attach = () => {
      if (observer || typeof ResizeObserver === 'undefined') return
      const view = editor.view
      const target = view ? ((view.dom.closest('.deditor-doc') ?? view.dom) as Element) : null
      if (!target) return
      observer = new ResizeObserver(onBump)
      observer.observe(target)
    }
    // The view may not be mounted on first run; attach on the first
    // transaction after mount instead of re-running this effect.
    attach()
    const offTr = editor.on('transaction', attach)
    return () => {
      window.removeEventListener('resize', onBump)
      offTr()
      observer?.disconnect()
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
  const rows: SidebarRow[] = [
    ...attached.map((thread) => ({ id: thread.id, thread, quote: thread.quote, skeleton: false })),
    ...skels.map((s) => ({ id: s.id, quote: s.quote, skeleton: true })),
    ...detached.map((thread) => ({ id: thread.id, thread, quote: thread.quote, skeleton: false })),
    ...resolved.map((thread) => ({ id: thread.id, thread, quote: thread.quote, skeleton: false })),
  ]

  const activeId = commentsUiKey.getState(editor.state)?.activeId ?? null

  useEffect(() => {
    if (!activeId) return
    const scope: ParentNode = asideRef.current ?? document
    const el = scope.querySelector(`[data-comment-id="${CSS.escape(activeId)}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [activeId])

  // Two-phase render, phase 2: measure card heights after commit so
  // resolveOverlap can push overlapping cards down on the next render.
  useLayoutEffect(() => {
    const next: Record<string, number> = {}
    cardRefs.current.forEach((el, id) => {
      next[id] = el.offsetHeight
    })
    setHeights((prev) => {
      const prevKeys = Object.keys(prev)
      const nextKeys = Object.keys(next)
      if (prevKeys.length === nextKeys.length && nextKeys.every((k) => prev[k] === next[k])) {
        return prev
      }
      return next
    })
  })

  // Phase 1: anchor + horizontal geometry, recomputed on every render driven
  // by the four recompute triggers above.
  const view = editor.view
  const rootEl = view
    ? ((view.dom.closest('.deditor-root') as HTMLElement | null) ??
      (view.dom.parentElement as HTMLElement | null))
    : null
  const docEl = view ? (view.dom.closest('.deditor-doc') as HTMLElement | null) : null
  let geo: MarginBox = { left: 0, width: 320, overlay: false }
  let anchors: { id: string; top: number }[] = []
  if (view && rootEl) {
    const rootRect = rootEl.getBoundingClientRect()
    const docRect = docEl ? docEl.getBoundingClientRect() : rootRect
    geo = marginLeft(docRect, rootRect, rootRect.width || rootEl.offsetWidth || 0)
    anchors = collectAnchors(editor, rootEl)
  }

  if (rows.length === 0) return null

  const anchorTop = new Map(anchors.map((a) => [a.id, a.top]))
  const anchoredRows = rows.filter((r) => anchorTop.has(r.id))
  anchoredRows.sort((a, b) => (anchorTop.get(a.id) ?? 0) - (anchorTop.get(b.id) ?? 0))
  const detachedRows = rows.filter((r) => !anchorTop.has(r.id))
  const finalTop = new Map(
    resolveOverlap(
      anchoredRows.map((r) => ({
        id: r.id,
        top: anchorTop.get(r.id) ?? 0,
        height: heights[r.id] ?? 0,
      })),
    ).map((a) => [a.id, a.top]),
  )

  const editable = editor.editable && !props.readOnly
  const setCardRef = (id: string) => (el: HTMLElement | null) => {
    if (el) cardRefs.current.set(id, el)
    else cardRefs.current.delete(id)
  }

  return (
    <aside
      ref={asideRef}
      className={['deditor-comment-margin', geo.overlay ? 'is-overlay' : '']
        .filter(Boolean)
        .join(' ')}
    >
      {anchoredRows.map((row) => (
        <ThreadCard
          key={row.id}
          row={row}
          active={activeId === row.id}
          editable={editable}
          currentUser={props.currentUser}
          cardRef={setCardRef(row.id)}
          style={{ top: finalTop.get(row.id) ?? 0, left: geo.left, width: geo.width }}
          onClick={() => dispatchActive(editor, row.id, !(row.thread?.detached ?? false))}
        />
      ))}
      {detachedRows.length > 0 ? (
        <div
          className="deditor-comment-detached"
          style={{ width: geo.width, marginLeft: geo.left }}
        >
          <div className="deditor-comment-detached-title">Detached</div>
          {detachedRows.map((row) => (
            <ThreadCard
              key={row.id}
              row={row}
              active={activeId === row.id}
              editable={editable}
              currentUser={props.currentUser}
              onClick={() => dispatchActive(editor, row.id, false)}
            />
          ))}
        </div>
      ) : null}
    </aside>
  )
}
