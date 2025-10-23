import { nanoid } from 'nanoid'
import type {
  CollabProvider,
  CommentOp,
  Presence,
  SendStepsResult,
  Snapshot,
  StepsPayload,
  User,
} from '@deditor/core'

export interface Frame<T = unknown> {
  v: 1
  type: string
  requestId?: string
  body: T
}

export function mapStepsOk(body: { version: number }): SendStepsResult {
  return { ok: true, version: body.version }
}

export function mapStepsReject(
  body:
    | { reason: 'VERSION_MISMATCH'; version: number }
    | { reason: 'APPLY_FAILED'; error: string }
    | { reason: 'RESET' },
): SendStepsResult {
  if (body.reason === 'VERSION_MISMATCH') return { ok: false, reason: 'VERSION_MISMATCH', version: body.version }
  if (body.reason === 'APPLY_FAILED') return { ok: false, reason: 'APPLY_FAILED', error: body.error }
  return { ok: false, reason: 'RESET' }
}

export interface FrameBroadcasts {
  onJoined?: () => void
  onSteps?: (p: StepsPayload) => void
  onComment?: (op: CommentOp) => void
  onPresence?: (map: Record<string, Presence>) => void
  onError?: (message: string) => void
}

/** Waiters own `pending.delete`. Never delete here — a `steps-since` `{ reset: true }` must stay until the follow-up `snapshot`. */
export function routeIncomingFrame(
  frame: Frame,
  pending: Map<string, (frame: Frame) => void>,
  broadcasts: FrameBroadcasts,
): void {
  if (frame.v !== 1) return
  if (frame.type === 'joined') {
    broadcasts.onJoined?.()
    return
  }
  if (frame.requestId && pending.has(frame.requestId)) {
    pending.get(frame.requestId)!(frame)
    return
  }
  if (frame.type === 'steps') {
    broadcasts.onSteps?.(frame.body as StepsPayload)
    return
  }
  if (frame.type === 'comment') {
    broadcasts.onComment?.(frame.body as CommentOp)
    return
  }
  if (frame.type === 'presence') {
    broadcasts.onPresence?.((frame.body as { map: Record<string, Presence> }).map)
    return
  }
  if (frame.type === 'error') {
    broadcasts.onError?.((frame.body as { message: string }).message)
  }
}

export function createWsProvider(opts: {
  url: string
  roomId: string
  user: User
  clientID?: string
}): CollabProvider {
  const clientID = opts.clientID ?? nanoid(21)
  let ws: WebSocket | null = null
  let joined = false
  let closedByUser = false
  let reconnecting = false
  let lastSnapshot: Snapshot = { version: 0, doc: { type: 'doc', content: [{ type: 'paragraph' }] }, comments: [] }
  const pending = new Map<string, (frame: Frame) => void>()
  const pendingRejects = new Map<string, (err: Error) => void>()
  const stepsBuf: StepsPayload[] = []
  const commentBuf: CommentOp[] = []
  const presenceBuf: Record<string, Presence>[] = []
  let onStepsCb: ((p: StepsPayload) => void) | undefined
  let onCommentCb: ((op: CommentOp) => void) | undefined
  let onPresenceCb: ((m: Record<string, Presence>) => void) | undefined
  let onConnCb: ((s: 'connected' | 'disconnected') => void) | undefined

  function send(type: string, body: unknown, requestId?: string) {
    if (!ws) throw new Error('not connected')
    const frame: Frame = { v: 1, type, requestId, body }
    ws.send(JSON.stringify(frame))
  }

  function failWaiters(err: Error) {
    const rejecters = [...pendingRejects.values()]
    pending.clear()
    pendingRejects.clear()
    for (const reject of rejecters) reject(err)
  }

  function request<T>(type: string, body: unknown): Promise<Frame<T>> {
    const requestId = nanoid(10)
    return new Promise((resolve, reject) => {
      pending.set(requestId, (frame) => {
        pending.delete(requestId)
        pendingRejects.delete(requestId)
        resolve(frame as Frame<T>)
      })
      pendingRejects.set(requestId, reject)
      try {
        send(type, body, requestId)
      } catch (err) {
        pending.delete(requestId)
        pendingRejects.delete(requestId)
        reject(err)
      }
    })
  }

  function onMessage(raw: string) {
    const frame = JSON.parse(raw) as Frame
    routeIncomingFrame(frame, pending, {
      onJoined: () => {
        joined = true
        onConnCb?.('connected')
      },
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
      onPresence: (map) => {
        if (!onPresenceCb) presenceBuf.push(map)
        else onPresenceCb(map)
      },
      onError: (message) => {
        for (const [, done] of pending) done({ v: 1, type: 'error', body: { message } })
        pending.clear()
        pendingRejects.clear()
      },
    })
  }

  const provider: CollabProvider = {
    clientID,
    async connect() {
      if (ws) throw new Error('connect: already connected')
      closedByUser = false
      const socket = new WebSocket(opts.url)
      ws = socket
      await new Promise<void>((resolve, reject) => {
        socket.onopen = () => resolve()
        socket.onerror = () => reject(new Error('ws error'))
      })
      socket.onerror = () => failWaiters(new Error('ws error'))
      socket.onmessage = (ev) => onMessage(String(ev.data))
      socket.onclose = () => {
        joined = false
        if (ws === socket) ws = null
        failWaiters(new Error('disconnected'))
        onConnCb?.('disconnected')
        if (closedByUser || reconnecting) return
        reconnecting = true
        queueMicrotask(() => {
          reconnecting = false
          if (closedByUser || ws) return
          void provider.connect()
        })
      }
      send('join', { roomId: opts.roomId, clientID, user: opts.user })
    },
    disconnect() {
      closedByUser = true
      ws?.close()
      ws = null
      joined = false
    },
    async loadDocument() {
      const frame = await request<Snapshot>('load', {})
      lastSnapshot = frame.body
      return lastSnapshot
    },
    async getStepsSince(version: number) {
      const requestId = nanoid(10)
      return new Promise<
        { reset: false; payload: StepsPayload } | { reset: true; snapshot: Snapshot }
      >((resolve, reject) => {
        let waitingSnapshot = false
        pending.set(requestId, (frame) => {
          if (frame.type === 'steps-since') {
            const body = frame.body as { reset: false; payload: StepsPayload } | { reset: true }
            if (body.reset) {
              waitingSnapshot = true
              return
            }
            pending.delete(requestId)
            pendingRejects.delete(requestId)
            resolve({ reset: false, payload: body.payload })
            return
          }
          if (frame.type === 'snapshot' && waitingSnapshot) {
            pending.delete(requestId)
            pendingRejects.delete(requestId)
            lastSnapshot = frame.body as Snapshot
            resolve({ reset: true, snapshot: lastSnapshot })
          }
        })
        pendingRejects.set(requestId, reject)
        try {
          send('getStepsSince', { version }, requestId)
        } catch (err) {
          pending.delete(requestId)
          pendingRejects.delete(requestId)
          reject(err)
        }
      })
    },
    async sendSteps(payload) {
      if (!joined) throw new Error('send before joined')
      const frame = await request<{ version: number } | SendStepsResult>('steps', payload)
      if (frame.type === 'steps-ok') return mapStepsOk(frame.body as { version: number })
      if (frame.type === 'steps-reject') return mapStepsReject(frame.body as Parameters<typeof mapStepsReject>[0])
      throw new Error('unexpected steps reply')
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
      if (!joined) throw new Error('send before joined')
      await request('comment', op)
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
      if (!joined) return
      send('presence', { selection: presence.selection })
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
  return provider
}
