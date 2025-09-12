import { WebSocketServer } from 'ws'
import { parseFrame, type Frame } from './protocol'
import { getRoom } from './room'
import type { CommentOp, Presence, User } from '@weditor/core'

const wss = new WebSocketServer({ port: 8787 })
const sockets = new Map<import('ws').WebSocket, { clientID: string; roomId: string; user: User }>()

function send(ws: import('ws').WebSocket, frame: Frame) {
  ws.send(JSON.stringify(frame))
}

wss.on('connection', (ws) => {
  ws.on('message', async (data) => {
    const frame = parseFrame(String(data))
    const reply = (type: string, body: unknown) => send(ws, { v: 1, type, requestId: frame.requestId, body })
    if (frame.type === 'join') {
      const { roomId, clientID, user } = frame.body as { roomId: string; clientID: string; user: User }
      const auth = await getRoom(roomId)
      auth.join(clientID, user)
      sockets.set(ws, { clientID, roomId, user })
      auth.subscribe(clientID, {
        onSteps: (p) => send(ws, { v: 1, type: 'steps', body: p }),
        onComment: (op) => send(ws, { v: 1, type: 'comment', body: op }),
        onPresence: (map) => send(ws, { v: 1, type: 'presence', body: { map } }),
      })
      send(ws, { v: 1, type: 'joined', body: { clientID } })
      return
    }
    const meta = sockets.get(ws)
    if (!meta) return
    const auth = await getRoom(meta.roomId)
    if (frame.type === 'load') {
      reply('snapshot', auth.snapshot())
      return
    }
    if (frame.type === 'steps') {
      const result = await auth.sendSteps(meta.clientID, frame.body as { version: number; steps: never[]; clientIDs: string[] })
      if (result.ok) reply('steps-ok', { version: result.version })
      else if (result.reason === 'VERSION_MISMATCH') reply('steps-reject', { reason: 'VERSION_MISMATCH', version: result.version })
      else if (result.reason === 'APPLY_FAILED') reply('steps-reject', { reason: 'APPLY_FAILED', error: result.error })
      else reply('steps-reject', { reason: 'RESET' })
      return
    }
    if (frame.type === 'getStepsSince') {
      const gap = auth.getStepsSince((frame.body as { version: number }).version)
      if (gap.reset) {
        reply('steps-since', { reset: true })
        send(ws, { v: 1, type: 'snapshot', requestId: frame.requestId, body: gap.snapshot })
      } else {
        reply('steps-since', { reset: false, payload: gap.payload })
      }
      return
    }
    if (frame.type === 'comment') {
      auth.applyComment(frame.body as CommentOp)
      reply('comment-ok', {})
      return
    }
    if (frame.type === 'presence') {
      auth.setPresence(meta.clientID, (frame.body as { selection: Presence['selection'] }).selection)
    }
  })
  ws.on('close', () => {
    const meta = sockets.get(ws)
    if (!meta) return
    void getRoom(meta.roomId).then((auth) => auth.leave(meta.clientID))
    sockets.delete(ws)
  })
})
