import type { Schema } from 'prosemirror-model'
import { Fragment, Slice } from 'prosemirror-model'
import { ReplaceStep } from 'prosemirror-transform'
import type { StepJSON } from '@deditor/core'

export function insertTextStepJSON(schema: Schema, pos: number, text: string): StepJSON {
  const step = new ReplaceStep(pos, pos, new Slice(Fragment.from(schema.text(text)), 0, 0))
  return step.toJSON() as StepJSON
}
