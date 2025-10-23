import { nanoid } from 'nanoid'
import type { CollabProvider, CommentOp, Presence, Snapshot, StepsPayload, User } from '@deditor/core'
import type { MemoryAuthority } from './memory-authority'

export function createMemoryProvider(
  auth: MemoryAuthority,
  opts: { user: User; clientID?: string },
): CollabProvider {
  const clientID = opts.clientID ?? nanoid(21)
  let connected = false
  let lastSnapshot: Snapshot = { version: 0, doc: { type: 'doc', content: [{ type: 'paragraph' }] }, comments: [] }
  const stepsBuf: StepsPayload[] = []
  const commentBuf: CommentOp[] = []
  const presenceBuf: Record<string, Presence>[] = []
  let onStepsCb: ((p: StepsPayload) => void) | undefined
  let onCommentCb: ((op: CommentOp) => void) | undefined
  let onPresenceCb: ((m: Record<string, Presence>) => void) | undefined
  let onConnCb: ((s: 'connected' | 'disconnected') => void) | undefined
  let unsub = () => {}

  return {
    clientID,
    async connect() {
      if (connected) throw new Error('connect: already connected')
      connected = true
      auth.join(clientID, opts.user)
      unsub = auth.subscribe(clientID, {
        onSteps: (p) => {
          if (!onStepsCb) {
            stepsBuf.push(p)
            return
          }
          if (p.version <= lastSnapshot.version) return
          onStepsCb(p)
        },
        onComment: (op) => {
          if (!onCommentCb) commentBuf.push(op)
          else onCommentCb(op)
        },
        onPresence: (m) => {
          if (!onPresenceCb) presenceBuf.push(m)
          else onPresenceCb(m)
        },
      })
      onConnCb?.('connected')
    },
    disconnect() {
      connected = false
      unsub()
      auth.leave(clientID)
      onConnCb?.('disconnected')
    },
    async loadDocument() {
      lastSnapshot = auth.snapshot()
      return lastSnapshot
    },
    async getStepsSince(version: number) {
      return auth.getStepsSince(version)
    },
    async sendSteps(payload) {
      return auth.sendSteps(clientID, payload)
    },
    onSteps(cb) {
      onStepsCb = cb
      queueMicrotask(() => {
        for (const p of stepsBuf) {
          if (p.version <= lastSnapshot.version) continue
          cb(p)
        }
        stepsBuf.length = 0
      })
      return () => {
        onStepsCb = undefined
      }
    },
    async sendComment(op) {
      auth.applyComment(op)
    },
    onComment(cb) {
      onCommentCb = cb
      queueMicrotask(() => {
        for (const op of commentBuf) cb(op)
        commentBuf.length = 0
      })
      return () => {
        onCommentCb = undefined
      }
    },
    sendPresence(presence) {
      auth.setPresence(clientID, presence.selection)
    },
    onPresence(cb) {
      onPresenceCb = cb
      queueMicrotask(() => {
        for (const m of presenceBuf) cb(m)
        presenceBuf.length = 0
      })
      return () => {
        onPresenceCb = undefined
      }
    },
    onConnection(cb) {
      onConnCb = cb
      return () => {
        onConnCb = undefined
      }
    },
  }
}
