# weditor

TypeScript SDK for a pageless document editor built on ProseMirror. Packages: `@weditor/core`, `@weditor/preset-docs`, `@weditor/collab`, `@weditor/react`.

## Install

```bash
pnpm add @weditor/react @weditor/preset-docs @weditor/collab
```

```ts
import { DocEditor } from '@weditor/react'
import '@weditor/react/style.css'

export function App() {
  return <DocEditor />
}
```

JSON is the document format. Quill Delta is not supported.

## Workspace scripts

- `pnpm build` — build the four packages
- `pnpm test` — Vitest on packages
- `pnpm lint` — ESLint
- `pnpm dev:demo` — Vite playground at `/` and `/collab`
- `pnpm dev:collab` — in-memory WebSocket authority (not production)
- `pnpm dev:docs` — VitePress

## Architecture

`Editor` is framework-agnostic. React mounts an `EditorView`. Collaboration is optional OT (`prosemirror-collab`) via `CollabProvider`. Comments are range marks plus a side store.

See the VitePress site (`pnpm dev:docs`) for API, comment ops, the collab protocol, and how a Vue view would call `editor.mount` / `unmount`.
