# Deditor

**Doc editor.** TypeScript SDK for a pageless document editor built on ProseMirror. The surface is Docs-width (not paged), with operational-transform collaboration, comments (no suggestion mode), and four packages:

| Package | Role |
| --- | --- |
| `@deditor/core` | `Editor`, `Extension`, `CommentStore`, schema merge, sanitizers, shared wire types (`CollabProvider`, `Snapshot`, `CommentOp`, …). Does not import `prosemirror-collab` or React. |
| `@deditor/preset-docs` | Docs schema, commands, keymap, tables, lists, search, comment marks. Does not import `@deditor/collab`. |
| `@deditor/collab` | `collabExtension`, `applyAuthorityBatch`, `createWsProvider`, in-memory authority helpers. OT via `prosemirror-collab`, not Yjs. |
| `@deditor/react` | `<DocEditor />` chrome (toolbar, bubbles, find, comment sidebar). Peer `react` >= 18. |

JSON is the canonical document format. HTML is paste input, print, and `getHTML()` only.

Start at [Install](/guide/install), then [DocEditor](/guide/doc-editor) for the React surface or [Editor API](/guide/editor-api) for a headless mount.

A playground (single-user) is on [GitHub Pages](https://ximing.github.io/deditor/demo/). Two-panel collab needs `pnpm dev:collab` locally.
