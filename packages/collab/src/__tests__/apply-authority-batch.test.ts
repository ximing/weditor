import { docsSchema } from '@deditor/preset-docs'
import { Schema } from 'prosemirror-model'
import { Step, ReplaceStep } from 'prosemirror-transform'
import { Slice, Fragment } from 'prosemirror-model'
import { describe, expect, it } from 'vitest'
import { applyAuthorityBatch } from '../apply-authority-batch'

describe('applyAuthorityBatch', () => {
  it('applies a two-step batch sequentially so the second addresses the first result', () => {
    const schema = docsSchema()
    const doc = schema.node('doc', null, [schema.node('paragraph')])
    const insertA = insertTextStep(schema, 1, 'A')
    const insertB = insertTextStep(schema, 2, 'B')
    const naive = insertB.apply(doc)
    expect(naive.failed).toBeTruthy()
    const applied = applyAuthorityBatch(doc, [insertA, insertB])
    expect(applied.ok).toBe(true)
    if (applied.ok) expect(applied.doc.textContent).toBe('AB')
  })

  it('returns failedAt and does not return a partial doc as ok', () => {
    const schema = docsSchema()
    const doc = schema.node('doc', null, [schema.node('paragraph')])
    const insertA = insertTextStep(schema, 1, 'A')
    const bad = insertTextStep(schema, 99, 'Z')
    const applied = applyAuthorityBatch(doc, [insertA, bad])
    expect(applied.ok).toBe(false)
    if (!applied.ok) expect(applied.failedAt).toBe(1)
  })
})

function insertTextStep(schema: Schema, pos: number, text: string): Step {
  const piece = schema.text(text)
  return new ReplaceStep(pos, pos, new Slice(Fragment.from(piece), 0, 0))
}
