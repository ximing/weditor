import type { CommentOp, DocsCommands, Editor } from '@deditor/core'
import { nanoid } from 'nanoid'
import { closeHistory } from 'prosemirror-history'
import type { Schema } from 'prosemirror-model'

export function commentCommands({
  editor,
  schema,
}: {
  editor: Editor
  schema: Schema
}): Partial<DocsCommands> {
  return {
    addComment: ({ body, author, from, to }) => {
      const start = from ?? editor.state.selection.from
      const end = to ?? editor.state.selection.to
      if (start === end) return false
      const id = 'c_' + nanoid(21)
      const quote = editor.state.doc.textBetween(start, end, ' ')
      const createdAt = Date.now()
      const comment = { id: 'm_' + nanoid(21), author, body, createdAt }
      const thread = { id, quote, resolved: false, createdAt, comments: [comment] }
      editor.comments.applyOp({ type: 'createThread', thread })
      // addToHistory:false still preserves grouping; close so a later text delete is its own undo event.
      const tr = closeHistory(
        editor.state.tr
          .addMark(start, end, schema.marks.comment.create({ id }))
          .setMeta('addToHistory', false)
          .setMeta('deditor-comment-op', { type: 'createThread', thread }),
      )
      editor.dispatch(tr)
      return true
    },
    toggleCommentResolved: ({ id }) => {
      const thread = editor.comments.get(id)
      if (!thread) return false
      const op: CommentOp = { type: 'setResolved', id, resolved: !thread.resolved }
      editor.comments.applyOp(op)
      const tr = editor.state.tr
      tr.setMeta('addToHistory', false)
      tr.setMeta('deditor-comment-op', op)
      editor.dispatch(tr)
      return true
    },
    replyToComment: ({ id, body, author }) => {
      const op: CommentOp = {
        type: 'appendComment',
        id,
        comment: { id: 'm_' + nanoid(21), author, body, createdAt: Date.now() },
      }
      editor.comments.applyOp(op)
      const tr = editor.state.tr
      tr.setMeta('addToHistory', false)
      tr.setMeta('deditor-comment-op', op)
      editor.dispatch(tr)
      return true
    },
    deleteComment: ({ id }) => {
      const op: CommentOp = { type: 'deleteThread', id }
      editor.comments.applyOp(op)
      const type = schema.marks.comment
      const tr = editor.state.tr
      editor.state.doc.descendants((node, pos) => {
        for (const m of node.marks) {
          if (m.type === type && m.attrs.id === id) {
            tr.removeMark(pos, pos + node.nodeSize, m)
          }
        }
      })
      tr.setMeta('addToHistory', false)
      tr.setMeta('deditor-comment-op', op)
      editor.dispatch(closeHistory(tr))
      return true
    },
  }
}
