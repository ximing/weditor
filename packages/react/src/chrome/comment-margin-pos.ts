import type { Editor } from '@deditor/core'

/** A comment id anchored to a vertical position relative to `.deditor-root`. */
export interface CommentAnchor {
  id: string
  top: number
}

/** Input for {@link resolveOverlap}: an anchor plus its measured card height. */
export interface MarginItem {
  id: string
  top: number
  height: number
}

/** Horizontal placement of margin cards. `overlay` marks the narrow-screen fallback. */
export interface MarginBox {
  left: number
  width: number
  overlay: boolean
}

/** Minimal rect shape used for horizontal math (viewport coordinates). */
export interface RectLike {
  left: number
  right: number
}

export const COMMENT_MARGIN_GAP = 8
const CARD_MAX_WIDTH = 320
const CARD_MIN_WIDTH = 240
const CARD_EDGE_PADDING = 8
const CARD_DOC_GAP = 16
const OVERLAY_WIDTH = 300
const OVERLAY_RIGHT = 16

type Doc = Editor['state']['doc']

/**
 * Find the first contiguous range of `comment` marks carrying `id`.
 * Moved here from CommentSidebar so both the sidebar and the tests can reuse it.
 */
export function firstCommentRange(doc: Doc, id: string): { from: number; to: number } | null {
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

/**
 * Collect one anchor per live comment mark id in the document. The vertical
 * position is `view.coordsAtPos(range.from).top` converted from viewport
 * coordinates into `.deditor-root`-relative coordinates. Environments without
 * layout (jsdom/happy-dom) get a tolerant `top` of 0 when coordinates are
 * unavailable; the anchor is still reported so the thread stays anchored.
 */
export function collectAnchors(editor: Editor, root?: HTMLElement | null): CommentAnchor[] {
  const view = editor.view
  if (!view) return []
  const doc = editor.state.doc
  const type = doc.type.schema.marks.comment
  if (!type) return []
  const rootEl =
    root ??
    ((view.dom.closest('.deditor-root') as HTMLElement | null) ||
      (view.dom.parentElement as HTMLElement | null))
  let rootTop = 0
  if (rootEl) {
    try {
      rootTop = rootEl.getBoundingClientRect().top
    } catch {
      rootTop = 0
    }
  }
  const seen = new Set<string>()
  const anchors: CommentAnchor[] = []
  doc.nodesBetween(0, doc.content.size, (node) => {
    if (!node.isText) return true
    for (const mark of node.marks) {
      if (mark.type !== type) continue
      const id = String(mark.attrs.id)
      if (seen.has(id)) continue
      seen.add(id)
      if (editor.comments.isTombstoned(id)) continue
      const range = firstCommentRange(doc, id)
      if (!range) continue
      let top = 0
      try {
        top = view.coordsAtPos(range.from).top - rootTop
      } catch {
        top = 0
      }
      anchors.push({ id, top })
    }
    return true
  })
  return anchors
}

/**
 * Sort items by anchor top ascending and push cards down so consecutive cards
 * keep at least `gap` pixels between them. Returns the resolved `{id, top}`
 * list in ascending order.
 */
export function resolveOverlap(items: MarginItem[], gap = COMMENT_MARGIN_GAP): CommentAnchor[] {
  const sorted = [...items].sort((a, b) => a.top - b.top)
  const out: CommentAnchor[] = []
  let bottom: number | null = null
  for (const item of sorted) {
    const top = bottom === null ? item.top : Math.max(item.top, bottom + gap)
    out.push({ id: item.id, top })
    bottom = top + item.height
  }
  return out
}

/**
 * Horizontal placement for margin cards: 16px right of the document page card,
 * width `min(320px, rootRight - left - 8px)`. When the available width drops
 * below 240px, fall back to an overlay pinned 16px from the root's right edge
 * at 300px wide (`overlay: true`).
 */
export function marginLeft(docRect: RectLike, rootRect: RectLike, rootWidth: number): MarginBox {
  const left = docRect.right - rootRect.left + CARD_DOC_GAP
  const width = Math.min(CARD_MAX_WIDTH, rootWidth - left - CARD_EDGE_PADDING)
  if (width < CARD_MIN_WIDTH) {
    return {
      left: Math.max(CARD_EDGE_PADDING, rootWidth - OVERLAY_RIGHT - OVERLAY_WIDTH),
      width: OVERLAY_WIDTH,
      overlay: true,
    }
  }
  return { left, width, overlay: false }
}
