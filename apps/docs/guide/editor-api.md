# Editor API

`Editor` is framework-agnostic. It owns `EditorState`, the extension list, the command map, and `CommentStore`. It does not create `EditorView` until `mount`.

```ts
import { Editor, schemaFromExtensions } from '@deditor/core'
import { docsPreset } from '@deditor/preset-docs'
```

## `Editor.create` algorithm

`plugins()` / `commands()` / `keymap()` receive `editor` **before** `editor.state` exists. Accessing `editor.state` during those factories throws `Error('Editor.create: state is not initialized')`.

```
1. Assert options.extensions non-empty; throw on duplicate extension / node / mark names.
2. editor = new Editor(); editor.#extensions = options.extensions
3. editor.schema = schemaFromExtensions(options.extensions)
4. editor.comments = new CommentStore()
5. editor.#editable = true
6. plugins = []
   rawCommands = {}
   for ext of extensions:
     ctx = { schema: editor.schema, editor }
     plugins.push(...(ext.plugins?.(ctx) ?? []))
     if ext.keymap: plugins.push(keymap(ext.keymap(ctx)))
     Object.assign(rawCommands, ext.commands?.(ctx) ?? {})
     throw on command-name collision
7. editor.#commands = wrap thunks around rawCommands
8. doc = options.content
     ? editor.schema.nodeFromJSON(options.content)   // throws on invalid JSON
     : editor.schema.node('doc', null, [editor.schema.node('paragraph')])
9. editor.#state = EditorState.create({ schema, doc, plugins })
10. return editor
```

Default empty document is `doc > paragraph` with no text. Never call `Editor.create({})` without extensions: `create` always seeds the paragraph when `content` is omitted, but it still requires a non-empty `extensions` array.

`Editor.create` wraps each command thunk so `editable === false` short-circuits to `false` without calling the inner function. Keymaps call those thunks (`'Mod-b': () => editor.commands.toggleStrong()`).

## `Extension` fields

```ts
interface Extension {
  name: string
  nodes?: Record<string, NodeSpec>
  marks?: Record<string, MarkSpec>
  plugins?: (ctx: { schema: Schema; editor: Editor }) => Plugin[]
  commands?: (ctx: { schema: Schema; editor: Editor }) => Partial<DocsCommands>
  keymap?: (ctx: { schema: Schema; editor: Editor }) => {
    [key: string]: Command | (() => boolean)
  }
  onTransaction?: (ctx: { editor: Editor; tr: Transaction; oldState: EditorState }) => void
  prepareSnapshotReset?: (snap: Snapshot) => void
  destroy?: (ctx: { editor: Editor }) => void
}
```

Registry rules:

- Duplicate `name` throws. `'collab'` is reserved for `collabExtension`.
- Node and mark names must be unique across extensions; collision throws.
- Command names must be unique; collision throws.
- Plugin order = extension order. For each extension, `plugins()` results are pushed, then that extension’s `keymap` is wrapped in one `keymap()` plugin and pushed immediately after. First plugin that handles a key wins.
- `baseKeymap` must be last in `docsPreset()`. `collabExtension` must be last in the `extensions` array.

`onTransaction` runs after the new state is committed and after `CommentStore.deriveDetached`, before view update.

## `schemaFromExtensions`

Public so `apps/collab-server` and tests can build a `Schema` without constructing `Editor` (no plugins, no keymaps, no NodeViews).

```ts
function schemaFromExtensions(extensions: Extension[]): Schema {
  const nodes: Record<string, NodeSpec> = {}
  const marks: Record<string, MarkSpec> = {}
  for (const ext of extensions) {
    Object.assign(nodes, ext.nodes)
    Object.assign(marks, ext.marks)
  }
  if (!nodes.text) nodes.text = { group: 'inline' }
  if (!nodes.doc) throw new Error('schemaFromExtensions: no doc node')
  return new Schema({ nodes, marks })
}
```

`docsSchema()` is `schemaFromExtensions(docsPreset())`.

## `Editor.emit` events

`emit` is public so `@deditor/collab` and `@deditor/preset-docs` can fire events without a reverse import. `on` returns an unsubscribe function.

| Event | Payload | When |
| --- | --- | --- |
| `transaction` | `{ tr, state, remote }` | After every dispatch. `remote` is `!!tr.getMeta('deditor-remote')`. |
| `selection` | `Selection` | When `tr.selectionSet`. |
| `comments` | `CommentThread[]` | After every dispatch (`comments.list()`). |
| `sync` | `{ status: 'ok' \| 'syncing' \| 'disconnected' \| 'error'; error?: Error }` | Collab send/ack, disconnect, resync. |
| `openFind` | `undefined` | `Mod-f` in the preset keymap. |
| `openComment` | `{ from: number; to: number }` | `Mod-Alt-m` with a non-empty selection. |
| `openLink` | `{ from: number; to: number }` | `Mod-k` with a non-empty selection. Toolbar prompts `URL` then `setLink`. |

Search is **not** on `Editor`. Query state lives in `searchPluginKey` (`@deditor/preset-docs`). UI calls `editor.commands.setSearchQuery(q)` and `findAll(editor.state)`.

## `resetFromSnapshot`

Used by collab fatal-resync. Do **not** `destroy()` + recreate the `Editor` (that would `provider.disconnect()` and drop subscribe-once listeners).

```
1. for ext of extensions: ext.prepareSnapshotReset?.(snap)
2. comments.replaceAll(snap.comments)
3. Rebuild plugins by calling each ext.plugins() / keymap() again
4. #state = EditorState.create({ schema, doc: schema.nodeFromJSON(snap.doc), plugins })
5. comments.deriveDetached(#state.doc)
6. view?.updateState(#state)
7. emit('comments', comments.list()); emit('sync', { status: 'ok' })
```

Collab’s `prepareSnapshotReset` writes `snap.version` into its mutable config, clears `SendLock`, and empties `pendingCommentOps` / `pendingCreates` **before** `plugins()` rebuilds a new `collab({ version })` instance.

## `setContent` throws with collab

```ts
editor.setContent(doc)
```

If any extension is named `'collab'`, this **throws** (`setContent: collab is attached`). Single-user `setContent` replaces the doc with `EditorState.create({ schema, doc, plugins: this.state.plugins })`.

`setEditable(false)` is the only read-only switch.

## Mount / unmount / destroy

```ts
editor.mount(place: HTMLElement)
editor.unmount()
editor.destroy()
```

`mount` constructs `EditorView` with `state: editor.state`, `editable: () => editor.editable`, and `dispatchTransaction: tr => editor.dispatch(tr)`. `unmount` destroys the view only. `destroy` unmounts, calls each extension’s optional `destroy`, and drops listeners. The collab extension’s `destroy` calls `provider.disconnect()`.

`getJSON()` returns ProseMirror node JSON. `getHTML()` serializes for print/export and **omits comment marks** (see [Security](/guide/security)).
