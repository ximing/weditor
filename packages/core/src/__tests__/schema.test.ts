import { Schema } from 'prosemirror-model'
import { describe, expect, it } from 'vitest'
import { schemaFromExtensions } from '../schema'
import type { Extension } from '../types'

const docExt: Extension = {
  name: 'doc',
  nodes: {
    doc: { content: 'block+' },
    paragraph: { group: 'block', content: 'inline*' },
  },
}

describe('schemaFromExtensions', () => {
  it('injects text if missing and builds a Schema', () => {
    const schema = schemaFromExtensions([docExt])
    expect(schema).toBeInstanceOf(Schema)
    expect(schema.nodes.text).toBeTruthy()
    expect(schema.nodes.doc.spec.content).toBe('block+')
  })
  it('throws when no doc node is provided', () => {
    expect(() =>
      schemaFromExtensions([{ name: 'x', nodes: { paragraph: { group: 'block' } } }]),
    ).toThrow(/no doc node/)
  })
  it('merges nodes and marks in extension order', () => {
    const schema = schemaFromExtensions([
      docExt,
      { name: 'marks', marks: { strong: {} } },
    ])
    expect(schema.marks.strong).toBeTruthy()
  })
})
