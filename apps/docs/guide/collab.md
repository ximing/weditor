# Collaboration

OT via `prosemirror-collab`, not Yjs. `docsPreset()` does **not** enable collab. Integrators append `collabExtension(provider, { version })` from `@weditor/collab` as the **last** entry in `extensions`. `<DocEditor collab={provider} />` does that internally after `loadDocument()`. `@weditor/core` does not import `prosemirror-collab`.

```ts
function collabExtension(
  provider: CollabProvider,
  opts: { version: number },
): Extension  // name: 'collab'
```

`Editor.create` is synchronous and **must** receive the authority version as `collab({ version })`. Starting at 0 against a non-zero authority causes permanent `VERSION_MISMATCH`.

Shared wire types (`CollabProvider`, `StepsPayload`, `SendStepsResult`, `Snapshot`, `Presence`) live in `@weditor/core`.

## Bootstrap

Locked sequence when `collab` is set:

1. Show loading chrome (no `EditorView`, no typing).
2. `await provider.connect()` (`join`; provider **begins buffering** `steps` / `comment` / `presence`).
3. `await provider.loadDocument()` → `{ version, doc, comments }`.
4. `Editor.create({ extensions: [...docsPreset(), collabExtension(provider, { version })], content: doc })`.
5. `editor.comments.replaceAll(comments)` then `deriveDetached`.
6. `editor.mount(el)`.

```ts
await provider.connect()
const snap = await provider.loadDocument()
const editor = Editor.create({
  extensions: [...docsPreset(), collabExtension(provider, { version: snap.version })],
  content: snap.doc,
})
editor.comments.replaceAll(snap.comments)
editor.comments.deriveDetached(editor.state.doc)
editor.mount(el)
```

Provider subscriptions register once inside `plugins()`. The provider replays its buffer on a **microtask** so `Editor.create` has assigned `editor.state` first, dropping any `StepsPayload` with `version <= lastSnapshot.version`.

On `loadDocument` / `connect` failure: do not create/mount; show the error string.

## Authority algorithm

`apps/collab-server` holds, per `roomId`, a versioned `Node` (`docsSchema()` only), a step log, parallel `clientIDs`, comments, tombstones, and presence.

Sequential apply — never `step.apply(originalDoc)` independently for each step:

```ts
function applyAuthorityBatch(
  doc: Node,
  steps: Step[],
): { ok: true; doc: Node } | { ok: false; failedAt: number; error: string } {
  let current = doc
  for (let i = 0; i < steps.length; i++) {
    const result = steps[i].apply(current)
    if (result.failed) {
      return { ok: false, failedAt: i, error: String(result.failed) }
    }
    current = result.doc!
  }
  return { ok: true, doc: current }
}
```

This function lives in `@weditor/collab`. Naive “apply each to the original document” is forbidden: it accepts batches the real document would reject and diverges from clients.

`sendSteps` handler (room mutex held):

1. Room missing **or** `payload.version > room.version` → `{ ok: false, reason: 'RESET' }`. Do not bump.
2. `payload.version < room.version` → `{ ok: false, reason: 'VERSION_MISMATCH', version: room.version }` — **version only, no steps**.
3. Empty batch or `Step.fromJSON` throw or `applyAuthorityBatch` fail → `APPLY_FAILED`, do not bump.
4. On success: append steps; **stamp** `clientIDs` from the joined socket (ignore `payload.clientIDs`); `room.version += payload.steps.length`; broadcast `{ type: 'steps', version, steps, clientIDs }` to **all** members including the sender.

`VERSION_MISMATCH` has no steps. Applying a slice from the reject would overlap the broadcast and `receiveTransaction` twice.

`RESET` when the client is ahead (`payload.version > room.version`) or the room is unknown (server restart wiped in-memory state). The client must not retry the same JSON; it snapshot-resyncs.

Authority stamps `clientIDs` from the joined socket. A spoofed id would prevent own-step confirm and duplicate text.

## Inflight `SendLock` + `awaitingConfirm`

```ts
interface SendLock {
  inflight: boolean
  awaitedVersion: number
  awaitingConfirm: boolean
}
```

A single in-flight `sendSteps`. Do not start a second send while `lock.inflight` is true — including from `onTransaction` of a peer broadcast during the round-trip. Peer steps still apply immediately; they just do not trigger a nested send.

Confirmation is **only** via broadcast `onSteps` → `receiveTransaction` **including own `clientIDs`**. `flushSendable` does not locally confirm. After `sendSteps` returns ok, `awaitingConfirm` is true until own ids confirm.

Document steps apply from **one** path: `onSteps` (broadcast) and `getStepsSince` (catch-up). Both use `StepsPayload`.

## WS protocol

Envelope:

```ts
interface Frame<T = unknown> {
  v: 1
  type: string
  requestId?: string     // client-generated; echoed on the matching response
  body: T
}
```

One socket per `CollabProvider`. Client must not send `steps` / `comment` / `presence` before `joined`. `load`, `steps`, `getStepsSince`, and `comment` require `requestId`.

| type | dir | body | notes |
| --- | --- | --- | --- |
| `join` | C→S | `{ roomId: string, clientID: string, user: User }` | first message after open |
| `joined` | S→C | `{ clientID: string }` | socket ready; does **not** replace `load` |
| `load` | C→S | `{}` | `requestId` required |
| `snapshot` | S→C | `Snapshot` | reply to `load` (and to `getStepsSince` reset) |
| `steps` | C→S | `{ version: number, steps: StepJSON[], clientIDs: string[] }` | client collab version **before** the batch; `requestId` required |
| `steps-ok` | S→C | `{ version: number }` | reply to that `requestId`; broadcast still follows |
| `steps-reject` | S→C | `{ reason: 'VERSION_MISMATCH', version: number } \| { reason: 'APPLY_FAILED', error: string } \| { reason: 'RESET' }` | mismatch has **no** `steps`. `RESET` when `payload.version > room.version` or room missing. |
| `steps` | S→C | `StepsPayload` | broadcast to **all** members including sender; this is what `onSteps` fires |
| `getStepsSince` | C→S | `{ version: number }` | `requestId` required |
| `steps-since` | S→C | `{ reset: false, payload: StepsPayload } \| { reset: true }` | if `reset: true`, a `snapshot` frame with the same `requestId` follows |
| `comment` | C→S | `CommentOp` | `requestId` required |
| `comment-ok` | S→C | `{}` | ack |
| `comment` | S→C | `CommentOp` | broadcast including sender |
| `presence` | C→S | `{ selection: SelectionJSON \| null }` | no ack; server fills `clientID`/`user` from join |
| `presence` | S→C | `{ map: Record<string, Presence> }` | full map |
| `error` | S→C | `{ message: string }` | unexpected; provider rejects inflight promises |

`sendSteps` maps `steps-ok` → `{ ok: true, version }`, `steps-reject` `VERSION_MISMATCH` → `{ ok: false, reason: 'VERSION_MISMATCH', version }` (no steps), `APPLY_FAILED` / `RESET` → tagged false. Provider `onSteps` is **only** the broadcast `steps` frame, not the ack.

## Demo server uses `docsSchema()` only

The sample authority (`apps/collab-server`):

- WebSocket rooms by query `roomId` (and `join` body).
- In-memory only; process restart clears rooms.
- No auth. `clientID` and `user` are client-declared and spoofable — **not an auth boundary**.
- Schema = `docsSchema()` only.
- Reuses `applyAuthorityBatch` from `@weditor/collab`.
- Not a production package.

Empty room: version 0, `doc > paragraph`, empty step log.

## Sample `createWsProvider`

```ts
import { createWsProvider } from '@weditor/collab'
import { DocEditor } from '@weditor/react'
import '@weditor/react/style.css'

const provider = createWsProvider({
  url: 'ws://localhost:8787',
  roomId: 'demo',
  user: { id: 'u1', name: 'Alice', color: '#4f81bd' },
})

export function App() {
  return <DocEditor collab={provider} currentUser={{ id: 'u1', name: 'Alice' }} />
}
```

`clientID` defaults to a 21-char nanoid. A second `connect()` without `disconnect()` throws. `createMemoryProvider` / `MemoryAuthority` exist for tests; they speak the same `CollabProvider` surface.
