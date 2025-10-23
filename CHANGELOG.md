# Changelog

## 0.1.0

First release of Deditor (doc editor), a rewrite of the previous Quill-based weditor.

- `@deditor/core` — `Editor`, extensions, comment store, sanitizers
- `@deditor/preset-docs` — pageless Docs schema and commands
- `@deditor/collab` — OT collaboration (`prosemirror-collab`) and WebSocket provider
- `@deditor/react` — `<DocEditor />` chrome

JSON is the canonical document format. Quill Delta is not supported.
