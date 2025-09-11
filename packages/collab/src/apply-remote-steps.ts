import type { Editor, StepsPayload } from '@weditor/core'
import { getVersion, receiveTransaction, sendableSteps } from 'prosemirror-collab'
import { Step } from 'prosemirror-transform'

export function applyRemoteSteps(editor: Editor, payload: StepsPayload): boolean {
  if (payload.steps.length !== payload.clientIDs.length) return false
  const local = getVersion(editor.state)
  if (payload.version <= local) return true
  if (payload.version > local + payload.steps.length) return false
  const skip = payload.steps.length - (payload.version - local)
  const json = payload.steps.slice(skip)
  const ids = payload.clientIDs.slice(skip)
  let pmSteps: Step[]
  try {
    pmSteps = json.map((j) => Step.fromJSON(editor.schema, j))
  } catch {
    return false
  }
  // Matching clientIDs confirm unconfirmed local steps. With none, still apply.
  const clientIDs = sendableSteps(editor.state) ? ids : ids.map(() => '')
  const tr = receiveTransaction(editor.state, pmSteps, clientIDs, { mapSelectionBackward: true })
  tr.setMeta('weditor-remote', true)
  editor.dispatch(tr)
  return true
}
