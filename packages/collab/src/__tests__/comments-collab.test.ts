import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Editor } from '@weditor/core'
import type { CommentOp, CollabProvider } from '@weditor/core'
import { docsPreset, docsSchema } from '@weditor/preset-docs'
import { describe, expect, it } from 'vitest'
import { collabExtension } from '../collab-extension'
import { MemoryAuthority } from '../memory-authority'
import { createMemoryProvider } from '../memory-provider'

const alice = { id: 'a', name: 'Alice' }

async function delayedAckPair() {
  const auth = new MemoryAuthority(docsSchema())
  const inner = createMemoryProvider(auth, { user: alice, clientID: 'aaaaaaaaaaaaaaaaaaaaa' })
  await inner.connect()
  const snap = await inner.loadDocument()
  let release: (v: unknown) => void = () => {}
  const gate = new Promise((r) => {
    release = r
  })
  const sendSteps = inner.sendSteps.bind(inner)
  const provider: CollabProvider = {
    ...inner,
    sendSteps: async (payload) => {
      await gate
      return sendSteps(payload)
    },
  }
  const editor = Editor.create({
    extensions: [...docsPreset(), collabExtension(provider, { version: snap.version })],
    content: snap.doc,
  })
  return { editor, auth, release, inner }
}

describe('comment collab sequencing', () => {
  it('addComment + immediate reply while sendSteps is delayed: MemoryAuthority ends with both comments, create then append', async () => {
    const { editor, auth, release } = await delayedAckPair()
    editor.dispatch(editor.state.tr.insertText('Hello'))
    editor.commands.addComment({ body: 'first', author: alice, from: 1, to: 6 })
    const id = editor.comments.list()[0].id
    expect(editor.commands.replyToComment({ id, body: 'second', author: alice })).toBe(true)
    release(undefined)
    await new Promise((r) => setTimeout(r, 40))
    const snap = auth.snapshot()
    const thread = snap.comments.find((t) => t.id === id)
    expect(thread?.comments.map((c) => c.body)).toEqual(['first', 'second'])
    expect(JSON.stringify(thread)).not.toContain('"detached"')
  })

  it('sendComment reject retries FIFO head without fatalResync; onConnection connected delivers the op', async () => {
    const auth = new MemoryAuthority(docsSchema())
    const inner = createMemoryProvider(auth, { user: alice, clientID: 'aaaaaaaaaaaaaaaaaaaaa' })
    await inner.connect()
    const snap = await inner.loadDocument()
    let fails = 1
    const connHandlers: Array<(s: 'connected' | 'disconnected') => void> = []
    const provider: CollabProvider = {
      ...inner,
      sendComment: async (op: CommentOp) => {
        if (fails > 0) {
          fails -= 1
          throw new Error('net')
        }
        return inner.sendComment(op)
      },
      onConnection(cb) {
        connHandlers.push(cb)
        return inner.onConnection(cb)
      },
    }
    const editor = Editor.create({
      extensions: [...docsPreset(), collabExtension(provider, { version: snap.version })],
      content: snap.doc,
    })
    const statuses: string[] = []
    editor.on('sync', (s) => statuses.push(s.status))
    editor.dispatch(editor.state.tr.insertText('Hello'))
    await new Promise((r) => setTimeout(r, 20))
    editor.commands.addComment({ body: 'first', author: alice, from: 1, to: 6 })
    await new Promise((r) => setTimeout(r, 40))
    expect(statuses).toContain('disconnected')
    expect(editor.state.doc.textContent).toBe('Hello')
    expect(auth.snapshot().comments).toHaveLength(0)
    for (const cb of connHandlers) cb('connected')
    await new Promise((r) => setTimeout(r, 40))
    expect(auth.snapshot().comments.some((t) => t.comments.some((c) => c.body === 'first'))).toBe(true)
  })

  it('two peers appendComment on the same thread: both comments survive', async () => {
    const bob = { id: 'b', name: 'Bob' }
    const auth = new MemoryAuthority(docsSchema())
    const pa = createMemoryProvider(auth, { user: alice, clientID: 'aaaaaaaaaaaaaaaaaaaaa' })
    const pb = createMemoryProvider(auth, { user: bob, clientID: 'bbbbbbbbbbbbbbbbbbbbb' })
    await pa.connect()
    await pb.connect()
    const snap = await pa.loadDocument()
    await pb.loadDocument()
    const ea = Editor.create({
      extensions: [...docsPreset(), collabExtension(pa, { version: snap.version })],
      content: snap.doc,
    })
    const eb = Editor.create({
      extensions: [...docsPreset(), collabExtension(pb, { version: snap.version })],
      content: snap.doc,
    })
    ea.dispatch(ea.state.tr.insertText('Hello'))
    await new Promise((r) => setTimeout(r, 30))
    ea.commands.addComment({ body: 'root', author: alice, from: 1, to: 6 })
    await new Promise((r) => setTimeout(r, 30))
    const id = ea.comments.list()[0].id
    expect(eb.comments.get(id)).toBeTruthy()
    ea.commands.replyToComment({ id, body: 'from-a', author: alice })
    eb.commands.replyToComment({ id, body: 'from-b', author: bob })
    await new Promise((r) => setTimeout(r, 40))
    const bodies = auth.snapshot().comments.find((t) => t.id === id)?.comments.map((c) => c.body) ?? []
    expect(bodies).toContain('root')
    expect(bodies).toContain('from-a')
    expect(bodies).toContain('from-b')
  })

  it('preset-docs source does not import @weditor/collab', () => {
    const src = resolve(dirname(fileURLToPath(import.meta.url)), '../../../preset-docs/src')
    const file = readFileSync(resolve(src, 'commands/comments.ts'), 'utf8')
    expect(file).not.toMatch(/@weditor\/collab/)
    expect(file).not.toMatch(/pendingCreates/)
    expect(file).not.toMatch(/sendComment/)
  })
})
