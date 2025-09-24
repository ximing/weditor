# Comments

Comments split the same way as a Docs surface: **anchor in the document**, **body outside the document**. There is no suggestion mode.

The `comment` mark is `{ id }`. Thread bodies live in `CommentStore` (`editor.comments`). `id` is `'c_' + nanoid(21)`.

## Mark vs store

| Piece | Where | Wire |
| --- | --- | --- |
| Range | `comment` mark on text | Document steps (`AddMark` / `RemoveMark`) |
| Body, quote, resolved, replies | `CommentStore` | Incremental `CommentOp` |
| `detached` | Derived locally from marks vs store | **Never** serialized |

```ts
type CommentOp =
  | { type: 'createThread'; thread: CommentThreadWire }
  | { type: 'appendComment'; id: string; comment: Comment }
  | { type: 'setResolved'; id: string; resolved: boolean }
  | { type: 'deleteThread'; id: string }
```

`CommentThreadWire` is `CommentThread` without `detached`. `createThread` / `Snapshot.comments` carry wire form only.

`list()` order: unresolved + attached, unresolved + detached, resolved. Stable by `createdAt` then `id`.

`createdAt` is client-declared and **display-only**. Authority serializes by recv order, not by timestamp.

`quote` is `state.doc.textBetween(from, to, ' ')` at create. It is never updated when the marked text later changes.

## Incremental ops

`applyOp` is idempotent:

| Op | Apply |
| --- | --- |
| `createThread` | if tombstoned or id exists → no-op; else insert (`detached: false` initially) |
| `appendComment` | if tombstoned or missing thread → no-op; if `comment.id` already in `thread.comments` → no-op; else append |
| `setResolved` | if tombstoned or missing → no-op; else set `resolved` |
| `deleteThread` | add tombstone, delete from map |

`replaceAll(threads)` clears the map **and** the tombstone set, inserts each thread with `detached: false`, then the caller runs `deriveDetached`. Used at bootstrap and snapshot resync.

## Tombstones

`deleteThread` (local or remote) adds `id` to a `Set<string>`. `get(id)` returns `undefined` for tombstoned ids. `createThread` / `appendComment` / `setResolved` on a tombstoned id are no-ops.

Skeleton rule:

- Mark present + `get(id) === undefined` + **not** tombstoned → React shows “Loading thread…”.
- Mark present + tombstoned → no highlight chrome, no sidebar row.
- No mark + thread → detached (quote only).

## `deriveDetached`

Collect all `comment` mark ids in `doc`. A thread whose id is missing from that set is `detached: true`. Derived locally after every doc transaction; **not** a comment op. Clients converge because they share the document.

Deleting marked *text* is a normal document step (on the undo stack). `deriveDetached` then marks the thread detached. Redo restores the text and the mark; the thread was never deleted.

## Command seam: `weditor-comment-op`

Preset-docs commands **never** import `@weditor/collab` and **never** touch `pendingCreates` / `pendingCommentOps` / `provider.sendComment`. They only `applyOp` + dispatch with `tr.setMeta('weditor-comment-op', op)`. Collab is the sole enqueue seam (`onTransaction`). Single-user: the meta is ignored.

**`addComment`:** apply `createThread` on the store **before** dispatch so the `comments` event already has the thread, then `addMark` with:

```
tr.setMeta('addToHistory', false)
tr.setMeta('weditor-comment-op', { type: 'createThread', thread })
```

**`deleteComment`:** `applyOp({ type: 'deleteThread', id })` before dispatch (tombstone; no skeleton), then RemoveMark everywhere for that id with the same metas.

**`replyToComment` / `toggleCommentResolved`:** store only. **No document steps**, but they still dispatch a no-step transaction so collab sees the same meta:

```ts
const tr = editor.state.tr
tr.setMeta('addToHistory', false)
tr.setMeta('weditor-comment-op', op)  // appendComment | setResolved
editor.dispatch(tr)
```

Empty range (`from === to`) → `addComment` returns false (no zero-width threads).

## `pendingCreates` lives only in `collabExtension`

FIFO lives **only** inside `collabExtension`:

```
pendingCreates: Set<string>          // ids whose createThread has not been echoed
pendingCommentOps: CommentOp[]       // FIFO, including create/delete/reply/resolve for those ids
```

`appendComment` / `setResolved` on a missing thread is a no-op on the authority. A reply typed during create RTT is queued until the `createThread` echo, so the authority sees `createThread` then `appendComment`. Mark-bearing ops (create / delete) send the comment op only after the document steps are accepted.

The sidebar does **not** read `pendingCreates` (that `Set` is not on `CommentStore`).

## Not undoable: `addToHistory: false`

Comment mark transactions use `tr.setMeta('addToHistory', false)`. Comments are **not undoable**. There is no inverse-op history plugin.

- `undo` after `addComment` does not remove the mark or send `deleteThread`.
- `replyToComment` / `toggleCommentResolved` dispatch a no-step tx (`addToHistory: false`), so they are not undoable.
- Under collab, undoing document text does not send comment ops. Remote document steps enter the state through `receiveTransaction`, which also sets `addToHistory: false`.
