import { docsSchema } from '@deditor/preset-docs'
import { describe, expect, it } from 'vitest'
import { MemoryAuthority } from '../memory-authority'
import { createMemoryProvider } from '../memory-provider'
import { insertTextStepJSON } from './steps-util'

const alice = { id: 'a', name: 'Alice' }
const bob = { id: 'b', name: 'Bob' }

describe('MemoryAuthority sendSteps protocol', () => {
  it('accepts matching version, stamps clientIDs from the joined socket, broadcasts including sender', async () => {
    const auth = new MemoryAuthority(docsSchema())
    const a = createMemoryProvider(auth, { user: alice, clientID: 'client_a_aaaaaaaaaa' })
    const b = createMemoryProvider(auth, { user: bob, clientID: 'client_b_bbbbbbbbbb' })
    await a.connect()
    await b.connect()
    const seen: { version: number; clientIDs: string[] }[] = []
    b.onSteps((p) => seen.push({ version: p.version, clientIDs: p.clientIDs }))
    a.onSteps((p) => seen.push({ version: p.version, clientIDs: p.clientIDs }))
    await Promise.resolve()
    const schema = docsSchema()
    const result = await a.sendSteps({
      version: 0,
      steps: [insertTextStepJSON(schema, 1, 'A')],
      clientIDs: ['spoofed'],
    })
    expect(result).toEqual({ ok: true, version: 1 })
    await Promise.resolve()
    expect(seen.length).toBeGreaterThanOrEqual(2)
    expect(seen[0].clientIDs).toEqual(['client_a_aaaaaaaaaa'])
    expect(seen[0].clientIDs).not.toContain('spoofed')
  })

  it('VERSION_MISMATCH is version-only (no steps) when two in-flight sendSteps share a version', async () => {
    const auth = new MemoryAuthority(docsSchema())
    const a = createMemoryProvider(auth, { user: alice, clientID: 'client_a_aaaaaaaaaa' })
    const b = createMemoryProvider(auth, { user: bob, clientID: 'client_b_bbbbbbbbbb' })
    await a.connect()
    await b.connect()
    const schema = docsSchema()
    const payloadA = {
      version: 0,
      steps: [insertTextStepJSON(schema, 1, 'A')],
      clientIDs: [a.clientID],
    }
    const payloadB = {
      version: 0,
      steps: [insertTextStepJSON(schema, 1, 'B')],
      clientIDs: [b.clientID],
    }
    const r1 = a.sendSteps(payloadA)
    const r2 = b.sendSteps(payloadB)
    const results = await Promise.all([r1, r2])
    const ok = results.find((r) => r.ok)
    const bad = results.find((r) => !r.ok)
    expect(ok).toMatchObject({ ok: true, version: 1 })
    expect(bad).toMatchObject({ ok: false, reason: 'VERSION_MISMATCH', version: 1 })
    expect(bad && 'steps' in bad).toBe(false)
  })

  it('RESET when payload.version > room.version; empty batch is APPLY_FAILED; unknown JSON is APPLY_FAILED', async () => {
    const auth = new MemoryAuthority(docsSchema())
    const a = createMemoryProvider(auth, { user: alice, clientID: 'client_a_aaaaaaaaaa' })
    await a.connect()
    const schema = docsSchema()
    const reset = await a.sendSteps({
      version: 9,
      steps: [insertTextStepJSON(schema, 1, 'A')],
      clientIDs: [a.clientID],
    })
    expect(reset).toEqual({ ok: false, reason: 'RESET' })
    const empty = await a.sendSteps({ version: 0, steps: [], clientIDs: [] })
    expect(empty).toEqual({ ok: false, reason: 'APPLY_FAILED', error: 'empty batch' })
    const bad = await a.sendSteps({
      version: 0,
      steps: [{ stepType: 'not-a-real-step' }],
      clientIDs: [a.clientID],
    })
    expect(bad.ok).toBe(false)
    if (!bad.ok) expect(bad.reason).toBe('APPLY_FAILED')
  })

  it('getStepsSince v>room or missing room returns reset true; else payload slice', async () => {
    const auth = new MemoryAuthority(docsSchema())
    const a = createMemoryProvider(auth, { user: alice, clientID: 'client_a_aaaaaaaaaa' })
    await a.connect()
    const schema = docsSchema()
    await a.sendSteps({
      version: 0,
      steps: [insertTextStepJSON(schema, 1, 'A')],
      clientIDs: [a.clientID],
    })
    const gap = await a.getStepsSince(0)
    expect(gap.reset).toBe(false)
    if (!gap.reset) {
      expect(gap.payload.version).toBe(1)
      expect(gap.payload.steps).toHaveLength(1)
    }
    const ahead = await a.getStepsSince(9)
    expect(ahead.reset).toBe(true)
    if (ahead.reset) expect(ahead.snapshot.version).toBe(1)
  })

  it('loadDocument is version 0 empty paragraph; two providers share one room', async () => {
    const auth = new MemoryAuthority(docsSchema())
    const a = createMemoryProvider(auth, { user: alice })
    const b = createMemoryProvider(auth, { user: bob })
    await a.connect()
    await b.connect()
    const s1 = await a.loadDocument()
    const s2 = await b.loadDocument()
    expect(s1.version).toBe(0)
    expect(s2.version).toBe(0)
    expect(s1.doc).toEqual({ type: 'doc', content: [{ type: 'paragraph' }] })
    expect(s1.comments).toEqual([])
  })
})
