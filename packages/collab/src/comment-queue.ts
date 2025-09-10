import type { CollabProvider, CommentOp, Editor } from '@weditor/core'
import { sendableSteps } from 'prosemirror-collab'

export function threadId(op: CommentOp): string {
  return op.type === 'createThread' ? op.thread.id : op.id
}

export function queueOrSendComment(
  editor: Editor,
  provider: CollabProvider,
  op: CommentOp,
  pendingCreates: Set<string>,
  pendingCommentOps: CommentOp[],
): void {
  const id = threadId(op)
  if (op.type === 'createThread') pendingCreates.add(id)
  const blocked =
    op.type === 'createThread' ||
    op.type === 'deleteThread' ||
    pendingCreates.has(id) ||
    pendingCommentOps.some((p) => threadId(p) === id)
  if (blocked) pendingCommentOps.push(op)
  else void sendCommentWithRetry(editor, provider, op, pendingCommentOps)
}

export async function sendCommentWithRetry(
  editor: Editor,
  provider: CollabProvider,
  op: CommentOp,
  pendingCommentOps: CommentOp[],
): Promise<void> {
  try {
    await provider.sendComment(op)
  } catch {
    editor.emit('sync', { status: 'disconnected' })
    pendingCommentOps.unshift(op)
  }
}

export function handleComment(
  editor: Editor,
  op: CommentOp,
  pendingCreates: Set<string>,
  pendingCommentOps: CommentOp[],
  provider: CollabProvider,
): void {
  editor.comments.applyOp(op)
  editor.emit('comments', editor.comments.list())
  if (op.type === 'createThread') {
    pendingCreates.delete(op.thread.id)
    flushPendingComments(editor, provider, pendingCommentOps, pendingCreates)
  }
}

export function flushPendingComments(
  editor: Editor,
  provider: CollabProvider,
  pendingCommentOps: CommentOp[],
  pendingCreates: Set<string>,
): void {
  if (sendableSteps(editor.state)) return
  while (pendingCommentOps.length) {
    const op = pendingCommentOps[0]
    if (op.type !== 'createThread' && pendingCreates.has(threadId(op))) break
    pendingCommentOps.shift()
    void sendCommentWithRetry(editor, provider, op, pendingCommentOps)
  }
}
