# DocEditor

`<DocEditor />` is the React Docs surface: toolbar, find bar, bubbles, editor, comment sidebar, and composer.

```ts
import { DocEditor } from '@weditor/react'
import type { DocEditorProps } from '@weditor/react'
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `defaultContent` | `JSONContent` | seeded empty `doc > paragraph` | Uncontrolled initial doc. Ignored when `collab` is set (the snapshot wins). |
| `content` | `JSONContent` | — | Controlled doc. Throws if combined with `collab`. |
| `onChange` | `(doc: JSONContent) => void` | — | Fires on local transactions only (`remote === false`). |
| `readOnly` | `boolean` | `false` | Calls `editor.setEditable(!readOnly)`. That is the only read-only switch. |
| `collab` | `CollabProvider` | — | Appends `collabExtension` last after `connect` + `loadDocument`. |
| `extensions` | `Extension[]` | `docsPreset({ placeholder })` | **Replaces** the preset; it does not append. |
| `uploadImage` | `(file: File) => Promise<{ src; alt?; width? }>` | — | Toolbar image control. Demo reads a data URL and rejects files > 200KB. |
| `currentUser` | `User` | `{ id: 'local', name: 'You' }` | Comment author and presence identity. |
| `placeholder` | `string` | `'Start typing…'` | Passed into `docsPreset` when `extensions` is omitted. |
| `className` | `string` | — | Extra class on the root `.weditor-root`. |

`User` is `{ id: string; name: string; color?: string }`. `JSONContent` is ProseMirror node JSON (`type`, optional `attrs` / `content` / `marks` / `text`).

## Extension merge

```
base = props.extensions ?? docsPreset({ placeholder: props.placeholder ?? 'Start typing…' })
if (props.collab) {
  if (base.some(e => e.name === 'collab')) throw new Error('collab extension already present')
  extensions = [...base, collabExtension(props.collab, { version })]  // version from loadDocument
} else {
  extensions = base
}
```

Passing `extensions={[MyExt]}` **replaces** the preset. Integrators who want extras write `[...docsPreset(), MyExt]`. Collab is appended last only via the `collab` prop. If both `collab={provider}` and a collab extension in `extensions`, `DocEditor` throws.

`docsPreset()` does not enable collab. The name `'collab'` is reserved for `collabExtension`.

Keep `extensions` and `collab` referentially stable (`useMemo` / `useRef`). Recreating them remounts the editor.

## `content` + `collab` throws

Controlled `content` and a live `CollabProvider` are incompatible: the authority snapshot is the document, and `setContent` throws when a collab extension is present.

```tsx
<DocEditor content={doc} collab={provider} />
// throws: DocEditor: content + collab is not supported
```

Use either:

- Single-user controlled: `content` + `onChange` (no `collab`).
- Collab: `collab={provider}` + optional `onChange` (remote txs are skipped). `defaultContent` is ignored.

## Controlled vs collab

**Uncontrolled single-user:** omit `content` and `collab`. `defaultContent` seeds `Editor.create`. Later local edits stay inside the editor.

**Controlled single-user:** pass `content`. After mount, when `JSON.stringify(content) !== JSON.stringify(editor.getJSON())`, `DocEditor` calls `editor.setContent(content)`. `setContent` rebuilds state from JSON (history empty, selection at start).

**Collab:** `DocEditor` bootstraps with [the locked sequence](/guide/collab#bootstrap): `connect` → `loadDocument` → `Editor.create` with `collabExtension(provider, { version })` last → `comments.replaceAll` → mount. `onChange` still reports local JSON; do not push it back as `content`.

## `readOnly` → `setEditable`

```ts
editor.setEditable(!readOnly)
```

`setEditable(false)` is the only read-only switch. Commands (including comment resolve / reply / delete) return `false` and do not dispatch. Toolbar, composer, table bubble, and mark bubble are hidden. Highlights and the comment sidebar remain visible.

There is no second path through `EditorView` props.

## Headless chrome

`@weditor/react` also exports `EditorProvider`, `EditorSurface` (mount only), `useEditor()`, `Toolbar`, `FindBar`, `Bubble`, `TableBubble`, `CommentSidebar`, and `CommentComposer` for custom layouts. `useEditor()` reads React context — it is not a singleton. Two-panel collab uses two `DocEditor`s, each with its own provider.
