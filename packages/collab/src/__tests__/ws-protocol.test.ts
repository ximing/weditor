import { describe, expect, it, afterEach } from 'vitest'
import {
  mapStepsOk,
  mapStepsReject,
  routeIncomingFrame,
  createWsProvider,
  type Frame,
} from '../ws-provider'
import type { Snapshot, StepsPayload } from '@weditor/core'

const snap0: Snapshot = {
  version: 0,
  doc: { type: 'doc', content: [{ type: 'paragraph' }] },
  comments: [],
}

describe('WS result mapping', () => {
  it('steps-ok → { ok: true, version }', () => {
    expect(mapStepsOk({ version: 4 })).toEqual({ ok: true, version: 4 })
  })
  it('steps-reject VERSION_MISMATCH has no steps', () => {
    const r = mapStepsReject({ reason: 'VERSION_MISMATCH', version: 4 })
    expect(r).toEqual({ ok: false, reason: 'VERSION_MISMATCH', version: 4 })
    expect('steps' in r).toBe(false)
  })
  it('RESET and APPLY_FAILED stay tagged false', () => {
    expect(mapStepsReject({ reason: 'RESET' })).toEqual({ ok: false, reason: 'RESET' })
    expect(mapStepsReject({ reason: 'APPLY_FAILED', error: 'x' })).toEqual({
      ok: false,
      reason: 'APPLY_FAILED',
      error: 'x',
    })
  })
})

describe('getStepsSince reset handshake', () => {
  it('resolves { reset: true, snapshot } only after the follow-up snapshot with the same requestId', async () => {
    const pending = new Map<string, (frame: Frame) => void>()
    const requestId = 'r1'
    const result = new Promise<
      { reset: false; payload: StepsPayload } | { reset: true; snapshot: Snapshot }
    >((resolve) => {
      let waitingSnapshot = false
      pending.set(requestId, (frame) => {
        if (frame.type === 'steps-since') {
          const body = frame.body as { reset: false; payload: StepsPayload } | { reset: true }
          if (body.reset) {
            waitingSnapshot = true
            return
          }
          pending.delete(requestId)
          resolve({ reset: false, payload: body.payload })
          return
        }
        if (frame.type === 'snapshot' && waitingSnapshot) {
          pending.delete(requestId)
          resolve({ reset: true, snapshot: frame.body as Snapshot })
        }
      })
    })
    routeIncomingFrame(
      { v: 1, type: 'steps-since', requestId, body: { reset: true } },
      pending,
      {},
    )
    expect(pending.has(requestId)).toBe(true)
    let settled: unknown
    void result.then((v) => {
      settled = v
    })
    await Promise.resolve()
    expect(settled).toBeUndefined()
    routeIncomingFrame(
      { v: 1, type: 'snapshot', requestId, body: snap0 },
      pending,
      {},
    )
    await expect(result).resolves.toEqual({ reset: true, snapshot: snap0 })
    expect(pending.has(requestId)).toBe(false)
  })
})

class FakeSocket {
  static instances: FakeSocket[] = []
  onopen: (() => void) | null = null
  onclose: (() => void) | null = null
  onmessage: ((ev: { data: string }) => void) | null = null
  onerror: (() => void) | null = null
  sent: string[] = []
  constructor(public url: string) {
    FakeSocket.instances.push(this)
    queueMicrotask(() => this.onopen?.())
  }
  send(data: string) {
    this.sent.push(data)
  }
  close() {
    this.onclose?.()
  }
}

describe('createWsProvider reconnect', () => {
  const orig = globalThis.WebSocket
  afterEach(() => {
    globalThis.WebSocket = orig
    FakeSocket.instances = []
  })

  it('re-opens the socket after drop, re-sends join, and emits connected again', async () => {
    globalThis.WebSocket = FakeSocket as unknown as typeof WebSocket
    const p = createWsProvider({
      url: 'ws://example',
      roomId: 'r',
      user: { id: 'a', name: 'A' },
      clientID: 'aaaaaaaaaaaaaaaaaaaaa',
    })
    const statuses: string[] = []
    p.onConnection((s) => statuses.push(s))
    await p.connect()
    expect(FakeSocket.instances).toHaveLength(1)
    FakeSocket.instances[0].onmessage?.({
      data: JSON.stringify({ v: 1, type: 'joined', body: { clientID: p.clientID } }),
    })
    expect(statuses).toEqual(['connected'])
    FakeSocket.instances[0].close()
    expect(statuses).toContain('disconnected')
    await new Promise((r) => queueMicrotask(() => r(undefined)))
    await Promise.resolve()
    expect(FakeSocket.instances.length).toBeGreaterThanOrEqual(2)
    const second = FakeSocket.instances[FakeSocket.instances.length - 1]
    const joins = second.sent.map((s) => JSON.parse(s) as Frame).filter((f) => f.type === 'join')
    expect(joins[0]?.body).toMatchObject({ roomId: 'r', clientID: 'aaaaaaaaaaaaaaaaaaaaa' })
    second.onmessage?.({
      data: JSON.stringify({ v: 1, type: 'joined', body: { clientID: p.clientID } }),
    })
    expect(statuses.filter((s) => s === 'connected')).toHaveLength(2)
    p.disconnect()
    const n = FakeSocket.instances.length
    await new Promise((r) => queueMicrotask(() => r(undefined)))
    expect(FakeSocket.instances.length).toBe(n)
  })

  it('getStepsSince reset true through onMessage waits for the snapshot frame', async () => {
    globalThis.WebSocket = FakeSocket as unknown as typeof WebSocket
    const p = createWsProvider({
      url: 'ws://example',
      roomId: 'r',
      user: { id: 'a', name: 'A' },
      clientID: 'aaaaaaaaaaaaaaaaaaaaa',
    })
    await p.connect()
    const sock = FakeSocket.instances[0]
    sock.onmessage?.({
      data: JSON.stringify({ v: 1, type: 'joined', body: { clientID: p.clientID } }),
    })
    const pending = p.getStepsSince(9)
    const req = sock.sent.map((s) => JSON.parse(s) as Frame).find((f) => f.type === 'getStepsSince')
    expect(req?.requestId).toBeTruthy()
    sock.onmessage?.({
      data: JSON.stringify({
        v: 1,
        type: 'steps-since',
        requestId: req!.requestId,
        body: { reset: true },
      }),
    })
    let done = false
    void pending.then(() => {
      done = true
    })
    await Promise.resolve()
    expect(done).toBe(false)
    sock.onmessage?.({
      data: JSON.stringify({
        v: 1,
        type: 'snapshot',
        requestId: req!.requestId,
        body: snap0,
      }),
    })
    await expect(pending).resolves.toEqual({ reset: true, snapshot: snap0 })
    p.disconnect()
  })
})
