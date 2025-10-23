import type { CommentStore, Extension } from '@deditor/core'
import type { Node } from 'prosemirror-model'
import { Plugin, PluginKey } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'

export const commentsUiKey = new PluginKey<{ activeId: string | null }>('commentsUi')

function collectCommentRanges(doc: Node): { id: string; from: number; to: number }[] {
  const type = doc.type.schema.marks.comment
  if (!type) return []
  const raw: { id: string; from: number; to: number }[] = []
  doc.nodesBetween(0, doc.content.size, (node, pos) => {
    if (!node.isText) return
    for (const mark of node.marks) {
      if (mark.type === type) {
        raw.push({ id: String(mark.attrs.id), from: pos, to: pos + node.nodeSize })
      }
    }
  })
  raw.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : a.from - b.from))
  const merged: { id: string; from: number; to: number }[] = []
  for (const r of raw) {
    const last = merged[merged.length - 1]
    if (last && last.id === r.id && last.to >= r.from) {
      last.to = Math.max(last.to, r.to)
    } else {
      merged.push({ id: r.id, from: r.from, to: r.to })
    }
  }
  return merged
}

export function pickCommentIdAt(doc: Node, pos: number, store: CommentStore): string | undefined {
  const ranges = collectCommentRanges(doc).filter((r) => pos >= r.from && pos < r.to)
  const live = ranges.filter((r) => !store.isTombstoned(r.id))
  if (!live.length) return undefined
  live.sort((a, b) => {
    const la = a.to - a.from
    const lb = b.to - b.from
    if (la !== lb) return la - lb
    const ta = store.get(a.id)?.createdAt ?? 0
    const tb = store.get(b.id)?.createdAt ?? 0
    if (ta !== tb) return tb - ta
    return a.id < b.id ? -1 : a.id > b.id ? 1 : 0
  })
  return live[0].id
}

function classForComment(id: string, store: CommentStore, activeId: string | null): string | null {
  if (store.isTombstoned(id)) return null
  const thread = store.get(id)
  const classes: string[] = []
  if (!thread) classes.push('deditor-comment-skel')
  else if (thread.resolved) classes.push('deditor-comment-resolved')
  else classes.push('deditor-comment-open')
  if (activeId === id) classes.push('deditor-comment-active')
  return classes.join(' ')
}

export function commentsUiExtension(): Extension {
  return {
    name: 'commentsUi',
    plugins: ({ editor }) => [
      new Plugin<{ activeId: string | null }>({
        key: commentsUiKey,
        state: {
          init: () => ({ activeId: null }),
          apply(tr, value) {
            const meta = tr.getMeta(commentsUiKey) as { activeId: string | null } | undefined
            if (meta) return meta
            return value
          },
        },
        props: {
          decorations(state) {
            const activeId = commentsUiKey.getState(state)?.activeId ?? null
            const store = editor.comments
            const decos: Decoration[] = []
            for (const r of collectCommentRanges(state.doc)) {
              const className = classForComment(r.id, store, activeId)
              if (!className || r.from >= r.to) continue
              decos.push(Decoration.inline(r.from, r.to, { class: className }))
            }
            decos.sort((a, b) => a.from - b.from || a.to - b.to)
            return DecorationSet.create(state.doc, decos)
          },
        },
      }),
    ],
  }
}
