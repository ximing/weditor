import { Editor } from '@deditor/core'
import { docsPreset } from '@deditor/preset-docs'
import { getVersion } from 'prosemirror-collab'
import { describe, expect, it } from 'vitest'
import { collabExtension } from '../collab-extension'
import { MemoryAuthority } from '../memory-authority'
import { createMemoryProvider } from '../memory-provider'

const alice = { id: 'a', name: 'Alice' }
const bob = { id: 'b', name: 'Bob' }

async function pair() {
  const auth = new MemoryAuthority(
    (await import('@deditor/preset-docs')).docsSchema(),
  )
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
  await micro()
  return { ea, eb, pa, pb, auth }
}

function micro() {
  return new Promise((r) => queueMicrotask(() => r(undefined)))
}

describe('two-client OT', () => {
  it('own-id receiveTransaction confirms unconfirmed and does not duplicate text', async () => {
    const { ea } = await pair()
    ea.dispatch(ea.state.tr.insertText('A'))
    await new Promise((r) => setTimeout(r, 20))
    expect(ea.state.doc.textContent).toBe('A')
    expect(getVersion(ea.state)).toBe(1)
  })

  it('two in-flight sendSteps at the same version do not duplicate the winner characters', async () => {
    const { ea, eb } = await pair()
    ea.dispatch(ea.state.tr.insertText('A'))
    eb.dispatch(eb.state.tr.insertText('B'))
    await new Promise((r) => setTimeout(r, 40))
    expect(ea.state.doc.textContent.split('').sort().join('')).toBe('AB')
    expect(eb.state.doc.textContent).toBe(ea.state.doc.textContent)
    expect(ea.state.doc.textContent).not.toMatch(/AA|BB/)
  })

  it('same-position inserts: both characters survive in OT order', async () => {
    const { ea, eb } = await pair()
    ea.dispatch(ea.state.tr.insertText('X'))
    eb.dispatch(eb.state.tr.insertText('Y'))
    await new Promise((r) => setTimeout(r, 40))
    expect(new Set(ea.state.doc.textContent)).toEqual(new Set('XY'))
    expect(ea.state.doc.textContent.length).toBe(2)
    expect(eb.state.doc.textContent).toBe(ea.state.doc.textContent)
  })

  it('local undo does not drop a remote insert', async () => {
    const { ea, eb } = await pair()
    ea.dispatch(ea.state.tr.insertText('A'))
    await new Promise((r) => setTimeout(r, 20))
    eb.dispatch(eb.state.tr.insertText('B'))
    await new Promise((r) => setTimeout(r, 20))
    expect(ea.commands.undo()).toBe(true)
    await new Promise((r) => setTimeout(r, 20))
    expect(ea.state.doc.textContent).toContain('B')
    expect(ea.state.doc.textContent).not.toContain('A')
  })

  it('unknown step JSON triggers snapshot reset, not a half apply', async () => {
    const { ea, pa, auth } = await pair()
    const before = ea.state.doc.textContent
    const beforeVer = getVersion(ea.state)
    const loads: number[] = []
    const orig = pa.loadDocument.bind(pa)
    pa.loadDocument = async () => {
      loads.push(1)
      return orig()
    }
    const ok = (await import('../apply-remote-steps')).applyRemoteSteps(ea, {
      version: beforeVer + 1,
      steps: [{ stepType: 'not-a-real-step' }],
      clientIDs: ['zzzzzzzzzzzzzzzzzzzzz'],
    })
    expect(ok).toBe(false)
    await new Promise((r) => setTimeout(r, 20))
    expect(ea.state.doc.textContent).toBe(before)
    expect(getVersion(ea.state)).toBe(beforeVer)
    void auth
  })
})
