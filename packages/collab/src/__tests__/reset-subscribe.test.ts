import { Editor } from '@weditor/core'
import { docsPreset, docsSchema } from '@weditor/preset-docs'
import { getVersion } from 'prosemirror-collab'
import { describe, expect, it } from 'vitest'
import { collabExtension } from '../collab-extension'
import { MemoryAuthority } from '../memory-authority'
import { createMemoryProvider } from '../memory-provider'
import { insertTextStepJSON } from './steps-util'

const alice = { id: 'a', name: 'Alice' }

describe('reset and subscribe-once', () => {
  it('resetFromSnapshot starts collab at snap.version not the bootstrap version', async () => {
    const auth = new MemoryAuthority(docsSchema())
    const p = createMemoryProvider(auth, { user: alice, clientID: 'aaaaaaaaaaaaaaaaaaaaa' })
    await p.connect()
    const snap0 = await p.loadDocument()
    const editor = Editor.create({
      extensions: [...docsPreset(), collabExtension(p, { version: snap0.version })],
      content: snap0.doc,
    })
    await p.sendSteps({
      version: 0,
      steps: [insertTextStepJSON(docsSchema(), 1, 'Z')],
      clientIDs: [p.clientID],
    })
    await new Promise((r) => setTimeout(r, 20))
    const snap = await p.loadDocument()
    editor.resetFromSnapshot(snap)
    expect(getVersion(editor.state)).toBe(snap.version)
    expect(editor.state.doc.textContent).toBe('Z')
  })

  it('second plugins() does not double-apply broadcasts and still has a collab plugin', async () => {
    const auth = new MemoryAuthority(docsSchema())
    const p = createMemoryProvider(auth, { user: alice, clientID: 'aaaaaaaaaaaaaaaaaaaaa' })
    await p.connect()
    const snap0 = await p.loadDocument()
    const editor = Editor.create({
      extensions: [...docsPreset(), collabExtension(p, { version: snap0.version })],
      content: snap0.doc,
    })
    const before = editor.state.plugins.length
    editor.resetFromSnapshot(await p.loadDocument())
    expect(editor.state.plugins.length).toBe(before)
    await p.sendSteps({
      version: getVersion(editor.state),
      steps: [insertTextStepJSON(docsSchema(), 1, 'Q')],
      clientIDs: [p.clientID],
    })
    await new Promise((r) => setTimeout(r, 20))
    expect(editor.state.doc.textContent.match(/Q/g)?.length ?? 0).toBe(1)
  })

  it('flushSendable RESET calls fatalResync and getVersion equals snapshot', async () => {
    const auth = new MemoryAuthority(docsSchema())
    const p = createMemoryProvider(auth, { user: alice, clientID: 'aaaaaaaaaaaaaaaaaaaaa' })
    await p.connect()
    const snap0 = await p.loadDocument()
    const editor = Editor.create({
      extensions: [...docsPreset(), collabExtension(p, { version: snap0.version })],
      content: snap0.doc,
    })
    editor.dispatch(editor.state.tr.insertText('Local'))
    const orig = p.sendSteps.bind(p)
    p.sendSteps = async () => ({ ok: false, reason: 'RESET' as const })
    editor.dispatch(editor.state.tr.insertText('X'))
    await new Promise((r) => setTimeout(r, 40))
    expect(getVersion(editor.state)).toBe((await p.loadDocument()).version)
    p.sendSteps = orig
  })

  it('getStepsSince reset true replaces the doc and collab version', async () => {
    const auth = new MemoryAuthority(docsSchema())
    const inner = createMemoryProvider(auth, { user: alice, clientID: 'aaaaaaaaaaaaaaaaaaaaa' })
    await inner.connect()
    const snap0 = await inner.loadDocument()
    const fresh = {
      version: 4,
      doc: {
        type: 'doc' as const,
        content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Fresh' }] }],
      },
      comments: [],
    }
    const conns: Array<(s: 'connected' | 'disconnected') => void> = []
    const p: typeof inner = {
      ...inner,
      getStepsSince: async () => ({ reset: true as const, snapshot: fresh }),
      onConnection(cb) {
        conns.push(cb)
        return inner.onConnection(cb)
      },
    }
    const editor = Editor.create({
      extensions: [...docsPreset(), collabExtension(p, { version: snap0.version })],
      content: snap0.doc,
    })
    for (const cb of conns) cb('disconnected')
    for (const cb of conns) cb('connected')
    await new Promise((r) => setTimeout(r, 40))
    expect(editor.state.doc.textContent).toBe('Fresh')
    expect(getVersion(editor.state)).toBe(4)
  })

  it('reconnect after 30s uses loadDocument + resetFromSnapshot', async () => {
    const auth = new MemoryAuthority(docsSchema())
    const inner = createMemoryProvider(auth, { user: alice, clientID: 'aaaaaaaaaaaaaaaaaaaaa' })
    await inner.connect()
    const snap0 = await inner.loadDocument()
    const loads: number[] = []
    const conns: Array<(s: 'connected' | 'disconnected') => void> = []
    const p: typeof inner = {
      ...inner,
      loadDocument: async () => {
        loads.push(1)
        return inner.loadDocument()
      },
      onConnection(cb) {
        conns.push(cb)
        return inner.onConnection(cb)
      },
    }
    const editor = Editor.create({
      extensions: [...docsPreset(), collabExtension(p, { version: snap0.version })],
      content: snap0.doc,
    })
    const realNow = Date.now
    Date.now = () => 1_000
    for (const cb of conns) cb('disconnected')
    Date.now = () => 1_000 + 30_001
    for (const cb of conns) cb('connected')
    await new Promise((r) => setTimeout(r, 40))
    Date.now = realNow
    expect(loads.length).toBeGreaterThan(0)
    expect(getVersion(editor.state)).toBe((await inner.loadDocument()).version)
    expect(editor.state.doc.textContent).toBeDefined()
  })

  it('reconnect flushSendable runs after a drop while sendSteps is still inflight', async () => {
    const auth = new MemoryAuthority(docsSchema())
    const inner = createMemoryProvider(auth, { user: alice, clientID: 'aaaaaaaaaaaaaaaaaaaaa' })
    await inner.connect()
    const snap0 = await inner.loadDocument()
    let sendCalls = 0
    let hang = true
    const conns: Array<(s: 'connected' | 'disconnected') => void> = []
    const p: typeof inner = {
      ...inner,
      sendSteps: async (payload) => {
        sendCalls += 1
        if (hang) await new Promise(() => {})
        return inner.sendSteps(payload)
      },
      onConnection(cb) {
        conns.push(cb)
        return inner.onConnection(cb)
      },
    }
    const editor = Editor.create({
      extensions: [...docsPreset(), collabExtension(p, { version: snap0.version })],
      content: snap0.doc,
    })
    editor.dispatch(editor.state.tr.insertText('A'))
    await new Promise((r) => setTimeout(r, 20))
    expect(sendCalls).toBe(1)
    hang = false
    for (const cb of conns) cb('disconnected')
    for (const cb of conns) cb('connected')
    await new Promise((r) => setTimeout(r, 40))
    expect(sendCalls).toBeGreaterThan(1)
    expect(editor.state.doc.textContent).toBe('A')
    expect(JSON.stringify(auth.snapshot().doc)).toContain('A')
  })
})
