/** @vitest-environment happy-dom */
import { Editor } from '@weditor/core'
import type { Presence } from '@weditor/core'
import { docsPreset, docsSchema } from '@weditor/preset-docs'
import { describe, expect, it } from 'vitest'
import { collabExtension } from '../collab-extension'
import { MemoryAuthority } from '../memory-authority'
import { createMemoryProvider } from '../memory-provider'
import { presencePluginKey } from '../presence'

const alice = { id: 'a', name: 'Alice', color: '#4f81bd' }
const bob = { id: 'b', name: 'Bob', color: '#c0504d' }

describe('presence mapping', () => {
  it('maps remote head through local inserts and omits the local clientID from decorations', async () => {
    const auth = new MemoryAuthority(docsSchema())
    const pa = createMemoryProvider(auth, { user: alice, clientID: 'aaaaaaaaaaaaaaaaaaaaa' })
    const pb = createMemoryProvider(auth, { user: bob, clientID: 'bbbbbbbbbbbbbbbbbbbbb' })
    await pa.connect()
    await pb.connect()
    const snap = await pa.loadDocument()
    const ea = Editor.create({
      extensions: [...docsPreset(), collabExtension(pa, { version: snap.version })],
      content: snap.doc,
    })
    pb.sendPresence({
      clientID: pb.clientID,
      user: bob,
      selection: { type: 'text', anchor: 1, head: 1 },
    })
    await new Promise((r) => setTimeout(r, 20))
    ea.dispatch(ea.state.tr.insertText('Hi'))
    const map = presencePluginKey.getState(ea.state) as Map<string, Presence>
    const remote = map.get(pb.clientID)
    expect(remote).toBeTruthy()
    expect(remote!.selection!.head).toBeGreaterThan(1)
    const plugin = ea.state.plugins.find((p) => p.spec.key === presencePluginKey)
    const decos = plugin?.props.decorations?.(ea.state)
    const decoStr = decos ? JSON.stringify(decos.find()) : ''
    expect(decoStr).not.toContain(pa.clientID)
  })
})
