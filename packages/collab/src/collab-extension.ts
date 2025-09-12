import { collab, getVersion, sendableSteps } from 'prosemirror-collab'
import type { CollabProvider, CommentOp, Extension, Snapshot } from '@weditor/core'
import type { Editor } from '@weditor/core'
import { applyRemoteSteps } from './apply-remote-steps'
import { clearLock, flushSendable, type SendLock } from './flush-sendable'
import {
  flushPendingComments,
  handleComment,
  queueOrSendComment,
} from './comment-queue'
import { createPresencePlugin, presencePluginKey } from './presence'

export function collabExtension(
  provider: CollabProvider,
  opts: { version: number },
): Extension {
  const collabConfig = { version: opts.version }
  const lock: SendLock = { inflight: false, awaitedVersion: 0, awaitingConfirm: false }
  const pendingCommentOps: CommentOp[] = []
  const pendingCreates = new Set<string>()
  const unsubs: Array<() => void> = []
  let subscribed = false
  let presenceTimer: ReturnType<typeof setTimeout> | undefined
  let droppedAt = 0

  async function fatalResync(editor: Editor): Promise<void> {
    clearLock(lock)
    pendingCommentOps.length = 0
    pendingCreates.clear()
    editor.emit('sync', { status: 'error', error: new Error('collab resync') })
    const snap = await provider.loadDocument()
    editor.resetFromSnapshot(snap)
  }

  async function catchUpAfterReconnect(editor: Editor): Promise<void> {
    const downMs = droppedAt ? Date.now() - droppedAt : 0
    droppedAt = 0
    if (downMs > 30_000) {
      const snap = await provider.loadDocument()
      editor.resetFromSnapshot(snap)
    } else {
      const local = getVersion(editor.state)
      const gap = await provider.getStepsSince(local)
      if (gap.reset) {
        editor.resetFromSnapshot(gap.snapshot)
      } else if (!applyRemoteSteps(editor, gap.payload)) {
        await fatalResync(editor)
        return
      }
    }
    await flushSendable(editor, provider, lock, () => fatalResync(editor))
    flushPendingComments(editor, provider, pendingCommentOps, pendingCreates)
  }

  function handleSteps(editor: Editor, payload: import('@weditor/core').StepsPayload): void {
    if (!applyRemoteSteps(editor, payload)) {
      void fatalResync(editor)
      return
    }
    if (lock.awaitingConfirm && getVersion(editor.state) >= lock.awaitedVersion) {
      clearLock(lock)
      void flushSendable(editor, provider, lock, () => fatalResync(editor))
    }
    if (!sendableSteps(editor.state)) {
      void flushPendingComments(editor, provider, pendingCommentOps, pendingCreates)
    }
  }

  function subscribe(editor: Editor): void {
    if (subscribed) return
    subscribed = true
    unsubs.push(provider.onSteps((p) => handleSteps(editor, p)))
    unsubs.push(
      provider.onComment((op) =>
        handleComment(editor, op, pendingCreates, pendingCommentOps, provider),
      ),
    )
    unsubs.push(
      provider.onPresence((map) => {
        editor.dispatch(
          editor.state.tr.setMeta(presencePluginKey, map).setMeta('addToHistory', false),
        )
      }),
    )
    unsubs.push(
      provider.onConnection((status) => {
        if (status === 'disconnected') {
          droppedAt = Date.now()
          editor.emit('sync', { status: 'disconnected' })
          return
        }
        void catchUpAfterReconnect(editor)
      }),
    )
  }

  return {
    name: 'collab',
    plugins: ({ editor }) => {
      subscribe(editor)
      return [
        collab({ version: collabConfig.version, clientID: provider.clientID }),
        createPresencePlugin(provider.clientID),
      ]
    },
    prepareSnapshotReset: (snap: Snapshot) => {
      collabConfig.version = snap.version
      lock.inflight = false
      lock.awaitedVersion = 0
      lock.awaitingConfirm = false
      pendingCommentOps.length = 0
      pendingCreates.clear()
    },
    onTransaction: ({ editor, tr }) => {
      if (tr.getMeta(presencePluginKey)) return
      if (!tr.getMeta('weditor-remote')) {
        const op = tr.getMeta('weditor-comment-op') as CommentOp | undefined
        if (op) queueOrSendComment(editor, provider, op, pendingCreates, pendingCommentOps)
        if (tr.selectionSet) {
          if (presenceTimer) clearTimeout(presenceTimer)
          presenceTimer = setTimeout(() => {
            provider.sendPresence({
              clientID: provider.clientID,
              user: { id: '', name: '' },
              selection: editor.state.selection.toJSON() as import('@weditor/core').SelectionJSON,
            })
          }, 50)
        }
        void flushSendable(editor, provider, lock, () => fatalResync(editor))
      }
      if (!sendableSteps(editor.state)) {
        void flushPendingComments(editor, provider, pendingCommentOps, pendingCreates)
      }
    },
    destroy: () => {
      for (const u of unsubs) u()
      unsubs.length = 0
      subscribed = false
      provider.disconnect()
    },
  }
}
