import type { Node } from 'prosemirror-model'
import type { CommentOp, CommentThread, CommentThreadWire } from './types'

export class CommentStore {
  #threads = new Map<string, CommentThread>()
  #tombstones = new Set<string>()

  get(id: string): CommentThread | undefined {
    if (this.#tombstones.has(id)) return undefined
    return this.#threads.get(id)
  }

  isTombstoned(id: string): boolean {
    return this.#tombstones.has(id)
  }

  list(): CommentThread[] {
    const all = [...this.#threads.values()]
    const rank = (t: CommentThread) => {
      if (!t.resolved && !t.detached) return 0
      if (!t.resolved && t.detached) return 1
      return 2
    }
    return all.sort((a, b) => {
      const d = rank(a) - rank(b)
      if (d !== 0) return d
      if (a.createdAt !== b.createdAt) return a.createdAt - b.createdAt
      return a.id < b.id ? -1 : a.id > b.id ? 1 : 0
    })
  }

  applyOp(op: CommentOp): void {
    if (op.type === 'createThread') {
      if (this.#tombstones.has(op.thread.id) || this.#threads.has(op.thread.id)) return
      this.#threads.set(op.thread.id, { ...op.thread, detached: false })
      return
    }
    if (this.#tombstones.has(op.id)) return
    if (op.type === 'deleteThread') {
      this.#tombstones.add(op.id)
      this.#threads.delete(op.id)
      return
    }
    const thread = this.#threads.get(op.id)
    if (!thread) return
    if (op.type === 'appendComment') {
      if (thread.comments.some((c) => c.id === op.comment.id)) return
      thread.comments = [...thread.comments, op.comment]
      return
    }
    if (op.type === 'setResolved') {
      thread.resolved = op.resolved
    }
  }

  replaceAll(threads: CommentThread[] | CommentThreadWire[]): void {
    this.#threads.clear()
    this.#tombstones.clear()
    for (const t of threads) {
      this.#threads.set(t.id, { ...(t as CommentThread), detached: false })
    }
  }

  deriveDetached(doc: Node): void {
    const present = new Set<string>()
    doc.descendants((node) => {
      for (const mark of node.marks) {
        if (mark.type.name === 'comment') present.add(String(mark.attrs.id))
      }
    })
    for (const thread of this.#threads.values()) {
      thread.detached = !present.has(thread.id)
    }
  }
}
