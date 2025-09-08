import type { Node } from 'prosemirror-model'
import type { Step, StepResult } from 'prosemirror-transform'

export function applyAuthorityBatch(
  doc: Node,
  steps: Step[],
): { ok: true; doc: Node } | { ok: false; failedAt: number; error: string } {
  let current = doc
  for (let i = 0; i < steps.length; i++) {
    let result: StepResult
    try {
      result = steps[i].apply(current)
    } catch (err) {
      return { ok: false, failedAt: i, error: String(err) }
    }
    if (result.failed) {
      return { ok: false, failedAt: i, error: String(result.failed) }
    }
    current = result.doc!
  }
  return { ok: true, doc: current }
}
