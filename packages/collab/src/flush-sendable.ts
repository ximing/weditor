import type { CollabProvider, Editor, StepJSON } from '@deditor/core'
import { getVersion, sendableSteps } from 'prosemirror-collab'
import { applyRemoteSteps } from './apply-remote-steps'

export interface SendLock {
  inflight: boolean
  awaitedVersion: number
  awaitingConfirm: boolean
}

export function clearLock(lock: SendLock): void {
  lock.inflight = false
  lock.awaitedVersion = 0
  lock.awaitingConfirm = false
}

export async function flushSendable(
  editor: Editor,
  provider: CollabProvider,
  lock: SendLock,
  fatalResync: () => Promise<void>,
): Promise<void> {
  if (lock.inflight) return
  const sendable = sendableSteps(editor.state)
  if (!sendable) return
  lock.inflight = true
  lock.awaitingConfirm = false
  lock.awaitedVersion = sendable.version + sendable.steps.length
  editor.emit('sync', { status: 'syncing' })
  const payload = {
    version: sendable.version,
    steps: sendable.steps.map((s) => s.toJSON() as StepJSON),
    clientIDs: sendable.steps.map(() => String(sendable.clientID)),
  }
  try {
    const result = await provider.sendSteps(payload)
    if (result.ok) {
      lock.awaitingConfirm = true
      editor.emit('sync', { status: 'ok' })
      if (getVersion(editor.state) >= lock.awaitedVersion) {
        clearLock(lock)
        return flushSendable(editor, provider, lock, fatalResync)
      }
      return
    }
    if (result.reason === 'VERSION_MISMATCH') {
      const local = getVersion(editor.state)
      if (local < result.version) {
        const gap = await provider.getStepsSince(local)
        if (gap.reset) {
          clearLock(lock)
          return fatalResync()
        }
        if (!applyRemoteSteps(editor, gap.payload)) {
          clearLock(lock)
          return fatalResync()
        }
      }
      clearLock(lock)
      return flushSendable(editor, provider, lock, fatalResync)
    }
    clearLock(lock)
    return fatalResync()
  } catch {
    editor.emit('sync', { status: 'disconnected' })
    clearLock(lock)
  }
}
