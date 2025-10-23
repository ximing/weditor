import { docsSchema } from '@deditor/preset-docs'
import { describe, expect, it } from 'vitest'
import { sampleDoc } from './sample-doc'

describe('sample doc', () => {
  it('showcases every promised block type', () => {
    const types = new Set<string>()
    const walk = (node: { type: string; content?: unknown[] }) => {
      types.add(node.type)
      for (const child of node.content ?? []) walk(child as { type: string; content?: unknown[] })
    }
    walk(sampleDoc)
    expect([...types]).toEqual(
      expect.arrayContaining([
        'heading',
        'paragraph',
        'bullet_list',
        'table',
        'blockquote',
        'task_list',
        'task_item',
        'code_block',
        'horizontal_rule',
        'image',
      ]),
    )
  })

  it('showcases every promised text mark', () => {
    const marks = new Set<string>()
    const walk = (node: { content?: unknown[]; marks?: Array<{ type: string }> }) => {
      for (const mark of node.marks ?? []) marks.add(mark.type)
      for (const child of node.content ?? []) {
        walk(child as { content?: unknown[]; marks?: Array<{ type: string }> })
      }
    }
    walk(sampleDoc)
    expect(marks).toEqual(
      new Set(['strong', 'em', 'underline', 'strike', 'code', 'color', 'highlight', 'link']),
    )
  })

  it('matches docsSchema()', () => {
    expect(() => docsSchema().nodeFromJSON(sampleDoc)).not.toThrow()
  })
})
