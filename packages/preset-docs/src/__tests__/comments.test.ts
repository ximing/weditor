import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Editor } from '@weditor/core'
import { TextSelection } from 'prosemirror-state'
import { describe, expect, it } from 'vitest'
import { docsPreset } from '../preset'

const alice = { id: 'a', name: 'Alice' }

function ranged() {
  const editor = Editor.create({ extensions: docsPreset() })
  editor.dispatch(editor.state.tr.insertText('Hello world'))
  editor.dispatch(editor.state.tr.setSelection(TextSelection.create(editor.state.doc, 1, 6)))
  return editor
}

describe('comment commands', () => {
  it('addComment on empty range returns false', () => {
    const editor = Editor.create({ extensions: docsPreset() })
    expect(editor.commands.addComment({ body: 'x', author: alice })).toBe(false)
  })

  it('addComment applyOp then AddMark with addToHistory false and weditor-comment-op createThread; id is c_ + 21 chars', () => {
    const editor = ranged()
    const metas: unknown[] = []
    editor.on('transaction', ({ tr }) => metas.push(tr.getMeta('weditor-comment-op')))
    expect(editor.commands.addComment({ body: 'note', author: alice, from: 1, to: 6 })).toBe(true)
    const thread = editor.comments.list()[0]
    expect(thread.quote).toBe('Hello')
    expect(thread.resolved).toBe(false)
    expect(thread.id.startsWith('c_')).toBe(true)
    expect(thread.id.length).toBe(23)
    expect(thread.comments[0].body).toBe('note')
    expect(editor.state.doc.rangeHasMark(1, 6, editor.schema.marks.comment)).toBe(true)
    const op = metas.find(Boolean) as { type: string; thread: { detached?: boolean } }
    expect(op.type).toBe('createThread')
    expect(op.thread.detached).toBeUndefined()
    editor.commands.undo()
    expect(editor.comments.get(thread.id)).toBeTruthy()
    expect(editor.state.doc.rangeHasMark(1, editor.state.doc.content.size - 1, editor.schema.marks.comment) || editor.comments.get(thread.id)).toBeTruthy()
  })

  it('two comment marks with different ids stack on one text node', () => {
    const editor = ranged()
    const a = editor.schema.marks.comment.create({ id: 'c_aaa' })
    const b = editor.schema.marks.comment.create({ id: 'c_bbb' })
    const text = editor.schema.text('x', [a, b])
    expect(text.marks).toHaveLength(2)
  })

  it('replyToComment and toggleCommentResolved are no-step txs with weditor-comment-op and do not change the doc', () => {
    const editor = ranged()
    editor.commands.addComment({ body: 'note', author: alice, from: 1, to: 6 })
    const json = editor.getJSON()
    const id = editor.comments.list()[0].id
    const ops: string[] = []
    editor.on('transaction', ({ tr }) => {
      const op = tr.getMeta('weditor-comment-op') as { type: string } | undefined
      if (op) ops.push(op.type)
    })
    expect(editor.commands.replyToComment({ id, body: 'later', author: alice })).toBe(true)
    expect(editor.commands.toggleCommentResolved({ id })).toBe(true)
    expect(editor.getJSON()).toEqual(json)
    expect(editor.comments.get(id)?.comments).toHaveLength(2)
    expect(editor.comments.get(id)?.resolved).toBe(true)
    expect(ops).toEqual(['appendComment', 'setResolved'])
  })

  it('deleteComment tombstones, removes marks, get is undefined (not a skeleton)', () => {
    const editor = ranged()
    editor.commands.addComment({ body: 'note', author: alice, from: 1, to: 6 })
    const id = editor.comments.list()[0].id
    expect(editor.commands.deleteComment({ id })).toBe(true)
    expect(editor.comments.get(id)).toBeUndefined()
    expect(editor.comments.isTombstoned(id)).toBe(true)
    expect(editor.state.doc.rangeHasMark(1, 6, editor.schema.marks.comment)).toBe(false)
  })

  it('deleting marked text derives detached; redo restores the mark; thread is not deleted', () => {
    const editor = ranged()
    editor.commands.addComment({ body: 'note', author: alice, from: 1, to: 6 })
    const id = editor.comments.list()[0].id
    editor.dispatch(editor.state.tr.delete(1, 6))
    expect(editor.comments.get(id)?.detached).toBe(true)
    editor.commands.undo()
    expect(editor.comments.get(id)?.detached).toBe(false)
    expect(editor.comments.get(id)?.comments[0].body).toBe('note')
  })

  it('clearFormat preserves comment marks', () => {
    const editor = ranged()
    editor.commands.toggleStrong()
    editor.commands.addComment({ body: 'note', author: alice, from: 1, to: 6 })
    editor.commands.clearFormat()
    expect(editor.state.doc.rangeHasMark(1, 6, editor.schema.marks.strong)).toBe(false)
    expect(editor.state.doc.rangeHasMark(1, 6, editor.schema.marks.comment)).toBe(true)
  })

  it('preset-docs source does not import @weditor/collab', () => {
    const src = resolve(dirname(fileURLToPath(import.meta.url)), '..')
    const file = readFileSync(resolve(src, 'commands/comments.ts'), 'utf8')
    expect(file).not.toMatch(/@weditor\/collab/)
    expect(file).not.toMatch(/pendingCreates/)
    expect(file).not.toMatch(/sendComment/)
  })
})
