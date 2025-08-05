import { Schema } from 'prosemirror-model'
import { describe, expect, it } from 'vitest'
import { CommentStore } from '../comment-store'
import type { Comment, CommentThreadWire, User } from '../types'

const schema = new Schema({
  nodes: {
    doc: { content: 'block+' },
    paragraph: { group: 'block', content: 'inline*' },
    text: { group: 'inline' },
  },
  marks: {
    comment: { attrs: { id: { default: '' } }, excludes: '', inclusive: true },
  },
})

const alice: User = { id: 'a', name: 'Alice' }

function thread(id: string, extra?: Partial<CommentThreadWire>): CommentThreadWire {
  return {
    id,
    quote: 'hello',
    resolved: false,
    createdAt: 1,
    comments: [{ id: 'm1', author: alice, body: 'hi', createdAt: 1 }],
    ...extra,
  }
}

describe('CommentStore.applyOp', () => {
  it('createThread inserts; duplicate id is a no-op', () => {
    const s = new CommentStore()
    s.applyOp({ type: 'createThread', thread: thread('c1') })
    s.applyOp({ type: 'createThread', thread: thread('c1', { quote: 'other' }) })
    expect(s.get('c1')?.quote).toBe('hello')
    expect(s.get('c1')?.detached).toBe(false)
  })

  it('appendComment appends; duplicate comment.id is a no-op; missing thread is a no-op', () => {
    const s = new CommentStore()
    s.applyOp({ type: 'createThread', thread: thread('c1') })
    const c2: Comment = { id: 'm2', author: alice, body: 'later', createdAt: 2 }
    s.applyOp({ type: 'appendComment', id: 'c1', comment: c2 })
    s.applyOp({ type: 'appendComment', id: 'c1', comment: c2 })
    s.applyOp({ type: 'appendComment', id: 'missing', comment: c2 })
    expect(s.get('c1')?.comments.map((c) => c.id)).toEqual(['m1', 'm2'])
  })

  it('setResolved flips resolved; missing is a no-op', () => {
    const s = new CommentStore()
    s.applyOp({ type: 'createThread', thread: thread('c1') })
    s.applyOp({ type: 'setResolved', id: 'c1', resolved: true })
    s.applyOp({ type: 'setResolved', id: 'nope', resolved: true })
    expect(s.get('c1')?.resolved).toBe(true)
  })

  it('deleteThread tombstones; get is undefined; further ops are no-ops; not a skeleton', () => {
    const s = new CommentStore()
    s.applyOp({ type: 'createThread', thread: thread('c1') })
    s.applyOp({ type: 'deleteThread', id: 'c1' })
    expect(s.get('c1')).toBeUndefined()
    expect(s.isTombstoned('c1')).toBe(true)
    s.applyOp({ type: 'createThread', thread: thread('c1') })
    s.applyOp({ type: 'appendComment', id: 'c1', comment: { id: 'x', author: alice, body: 'z', createdAt: 3 } })
    s.applyOp({ type: 'setResolved', id: 'c1', resolved: true })
    expect(s.get('c1')).toBeUndefined()
  })
})

describe('CommentStore.list and replaceAll', () => {
  it('orders unresolved+attached, unresolved+detached, resolved; stable by createdAt then id', () => {
    const s = new CommentStore()
    s.applyOp({ type: 'createThread', thread: thread('c_res', { createdAt: 1, resolved: true }) })
    s.applyOp({ type: 'createThread', thread: thread('c_b', { createdAt: 2 }) })
    s.applyOp({ type: 'createThread', thread: thread('c_a', { createdAt: 2 }) })
    const doc = schema.node('doc', null, [schema.node('paragraph', null, [schema.text('hello')])])
    s.deriveDetached(doc)
    const ids = s.list().map((t) => t.id)
    expect(ids.slice(-1)[0]).toBe('c_res')
    const unresolved = s.list().filter((t) => !t.resolved)
    expect(unresolved.map((t) => t.id)).toEqual(['c_a', 'c_b'])
  })

  it('replaceAll clears map and tombstones and ignores incoming detached', () => {
    const s = new CommentStore()
    s.applyOp({ type: 'createThread', thread: thread('old') })
    s.applyOp({ type: 'deleteThread', id: 'old' })
    s.replaceAll([{ ...thread('new'), detached: true } as CommentThreadWire & { detached?: boolean }])
    expect(s.isTombstoned('old')).toBe(false)
    expect(s.get('new')?.detached).toBe(false)
  })
})

describe('CommentStore.deriveDetached', () => {
  it('marks threads whose comment mark id is missing as detached', () => {
    const s = new CommentStore()
    s.applyOp({ type: 'createThread', thread: thread('keep') })
    s.applyOp({ type: 'createThread', thread: thread('gone') })
    const mark = schema.marks.comment.create({ id: 'keep' })
    const doc = schema.node('doc', null, [
      schema.node('paragraph', null, [schema.text('hello', [mark])]),
    ])
    s.deriveDetached(doc)
    expect(s.get('keep')?.detached).toBe(false)
    expect(s.get('gone')?.detached).toBe(true)
  })
})
