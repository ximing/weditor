# Install

```bash
pnpm add @weditor/react @weditor/preset-docs @weditor/collab
```

Peer: `react` >= 18. Import chrome CSS:

```ts
import { DocEditor } from '@weditor/react'
import '@weditor/react/style.css'

export function App() {
  return <DocEditor />
}
```

`@weditor/react` depends on `@weditor/core`, `@weditor/preset-docs`, and `@weditor/collab`. Collab is optional as a feature: omit the `collab` prop. Integrators who want a headless surface omit `@weditor/react` and depend on `core` + `preset-docs`.

All four packages ship `0.1.0` as dual ESM + CJS with `.d.ts`. Document CSS lives at `@weditor/preset-docs/style.css`; React chrome CSS re-exports it via `@weditor/react/style.css`.
