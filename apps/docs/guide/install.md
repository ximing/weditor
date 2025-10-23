# Install

```bash
pnpm add @deditor/react @deditor/preset-docs @deditor/collab
```

Peer: `react` >= 18. Import chrome CSS:

```ts
import { DocEditor } from '@deditor/react'
import '@deditor/react/style.css'

export function App() {
  return <DocEditor />
}
```

`@deditor/react` depends on `@deditor/core`, `@deditor/preset-docs`, and `@deditor/collab`. Collab is optional as a feature: omit the `collab` prop. Integrators who want a headless surface omit `@deditor/react` and depend on `core` + `preset-docs`.

All four packages ship `0.6.0` as dual ESM + CJS with `.d.ts`. Document CSS lives at `@deditor/preset-docs/style.css`; React chrome CSS re-exports it via `@deditor/react/style.css`.
