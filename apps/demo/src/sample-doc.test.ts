import { docsSchema } from '@weditor/preset-docs'
import { describe, expect, it } from 'vitest'
import { sampleDoc } from './sample-doc'

describe('sample doc', () => {
  it('contains a heading, paragraph, bullet list, and table', () => {
    const types = new Set<string>()
    const walk = (node: { type: string; content?: unknown[] }) => {
      types.add(node.type)
      for (const child of node.content ?? []) walk(child as { type: string; content?: unknown[] })
    }
    walk(sampleDoc)
    expect(types.has('heading')).toBe(true)
    expect(types.has('paragraph')).toBe(true)
    expect(types.has('bullet_list')).toBe(true)
    expect(types.has('table')).toBe(true)
  })

  it('matches docsSchema()', () => {
    expect(() => docsSchema().nodeFromJSON(sampleDoc)).not.toThrow()
  })
})
