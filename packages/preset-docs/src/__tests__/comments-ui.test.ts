import { Editor } from '@weditor/core'
import type { Decoration, DecorationSet } from 'prosemirror-view'
import { describe, expect, it } from 'vitest'
import { commentsUiKey, docsPreset, pickCommentIdAt } from '../index'

function decorationClasses(editor: Editor): string[] {
  const plugin = commentsUiKey.get(editor.state)
  const decoFn = plugin?.props.decorations
  if (!plugin || typeof decoFn !== 'function') return []
  const set = decoFn.call(plugin, editor.state) as DecorationSet | null | undefined
  if (!set) return []
  return set.find().map((d) => {
    const typed = d as Decoration & { type: { attrs?: { class?: string } } }
    return typed.type.attrs?.class ?? ''
  })
}

const alice = { id: 'a', name: 'Alice' }

describe('pickCommentIdAt', () => {
  it('picks the shortest mark range containing pos; tie uses highest createdAt then id', () => {
    const editor = Editor.create({ extensions: docsPreset() })
    editor.dispatch(editor.state.tr.insertText('HelloWorld'))
    editor.commands.addComment({ body: 'wide', author: alice, from: 1, to: 11 })
    const wide = editor.comments.list()[0].id
    editor.commands.addComment({ body: 'short', author: alice, from: 1, to: 6 })
    const short = editor.comments.list().find((t) => t.id !== wide)!.id
    const picked = pickCommentIdAt(editor.state.doc, 3, editor.comments)
    expect(picked).toBe(short)
    const atEnd = pickCommentIdAt(editor.state.doc, 8, editor.comments)
    expect(atEnd).toBe(wide)
  })

  it('skips tombstoned ids and still returns skeleton ids', () => {
    const editor = Editor.create({ extensions: docsPreset() })
    editor.dispatch(editor.state.tr.insertText('Hello'))
    editor.commands.addComment({ body: 'n', author: alice, from: 1, to: 6 })
    const id = editor.comments.list()[0].id
    editor.comments.applyOp({ type: 'deleteThread', id })
    // mark may still be present if we only applyOp; deleteComment removes marks
    expect(pickCommentIdAt(editor.state.doc, 3, editor.comments)).toBeUndefined()
    editor.dispatch(
      editor.state.tr.addMark(1, 6, editor.schema.marks.comment.create({ id: 'c_skeleton' })),
    )
    expect(pickCommentIdAt(editor.state.doc, 3, editor.comments)).toBe('c_skeleton')
  })

  it('equal-length overlap prefers highest createdAt then lexicographic id', () => {
    const editor = Editor.create({ extensions: docsPreset() })
    editor.dispatch(editor.state.tr.insertText('Hello'))
    editor.dispatch(
      editor.state.tr
        .addMark(1, 6, editor.schema.marks.comment.create({ id: 'c_aaa' }))
        .addMark(1, 6, editor.schema.marks.comment.create({ id: 'c_bbb' })),
    )
    editor.comments.applyOp({
      type: 'createThread',
      thread: { id: 'c_bbb', quote: 'Hello', resolved: false, createdAt: 1, comments: [] },
    })
    editor.comments.applyOp({
      type: 'createThread',
      thread: { id: 'c_aaa', quote: 'Hello', resolved: false, createdAt: 2, comments: [] },
    })
    expect(pickCommentIdAt(editor.state.doc, 3, editor.comments)).toBe('c_aaa')
    editor.comments.applyOp({ type: 'deleteThread', id: 'c_aaa' })
    editor.comments.applyOp({
      type: 'createThread',
      thread: { id: 'c_ccc', quote: 'Hello', resolved: false, createdAt: 1, comments: [] },
    })
    editor.dispatch(editor.state.tr.addMark(1, 6, editor.schema.marks.comment.create({ id: 'c_ccc' })))
    expect(pickCommentIdAt(editor.state.doc, 3, editor.comments)).toBe('c_bbb')
  })
})

describe('commentsUi decorations', () => {
  it('docsPreset includes commentsUi before keymap', () => {
    const names = docsPreset().map((e) => e.name)
    expect(names.indexOf('commentsUi')).toBeGreaterThan(-1)
    expect(names.indexOf('commentsUi')).toBeLessThan(names.indexOf('keymap'))
  })

  it('docsPreset extension order matches spec §11.4', () => {
    expect(docsPreset().map((e) => e.name)).toEqual([
      'history',
      'nodes',
      'marks',
      'tables',
      'lists',
      'gapcursor',
      'dropcursor',
      'search',
      'formatPainter',
      'placeholder',
      'commentsUi',
      'keymap',
      'baseKeymap',
    ])
  })

  it('paints open, resolved, skeleton, and active classes; skips tombstones', () => {
    const editor = Editor.create({ extensions: docsPreset() })
    editor.dispatch(editor.state.tr.insertText('HelloWorld'))
    editor.commands.addComment({ body: 'n', author: alice, from: 1, to: 6 })
    const id = editor.comments.list()[0].id
    expect(decorationClasses(editor).some((c) => c.split(' ').includes('weditor-comment-open'))).toBe(
      true,
    )

    editor.commands.toggleCommentResolved({ id })
    expect(
      decorationClasses(editor).some((c) => c.split(' ').includes('weditor-comment-resolved')),
    ).toBe(true)

    editor.dispatch(
      editor.state.tr.setMeta(commentsUiKey, { activeId: id }).setMeta('addToHistory', false),
    )
    const active = decorationClasses(editor)
    expect(active.some((c) => c.split(' ').includes('weditor-comment-active'))).toBe(true)
    expect(active.some((c) => c.split(' ').includes('weditor-comment-resolved'))).toBe(true)

    editor.comments.applyOp({ type: 'deleteThread', id })
    editor.dispatch(editor.state.tr)
    expect(decorationClasses(editor).every((c) => !c.includes('weditor-comment'))).toBe(true)

    editor.dispatch(
      editor.state.tr.addMark(1, 6, editor.schema.marks.comment.create({ id: 'c_skeleton' })),
    )
    expect(decorationClasses(editor).some((c) => c.split(' ').includes('weditor-comment-skel'))).toBe(
      true,
    )
  })
})
