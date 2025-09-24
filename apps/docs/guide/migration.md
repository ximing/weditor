# Migration

JSON is the canonical document format. Persist and exchange `editor.getJSON()` / `Snapshot.doc` (`JSONContent`: ProseMirror node JSON).

Quill Delta is **not** supported. There is no Delta import, no `ops` array, and no converter in this SDK. A legacy Delta document must be rewritten to ProseMirror JSON (nodes, marks, attrs) before `Editor.create({ content })` or `setContent`.

HTML is not a storage format. Use it for paste, print, and `getHTML()` only. Comment marks are omitted from HTML; round-tripping HTML will drop threads.

Collaborative history is a step log against `docsSchema()`, not a CRDT. OT runs through `prosemirror-collab`. There is no Yjs document and no suggestion-mode layer to migrate.

Checklist:

- Store `JSONContent`, not Delta, not HTML.
- Comment bodies live beside the doc (`CommentThreadWire[]` on `Snapshot.comments`), not as Delta attributes.
- Re-home any custom Quill blot onto an `Extension` (`nodes` / `marks` / `commands` / `keymap`).
- Authority and clients must share `docsSchema()` (or the same `schemaFromExtensions` list).
