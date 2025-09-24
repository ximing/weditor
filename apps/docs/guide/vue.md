# Vue later

This window ships React chrome only. A Vue (or any DOM) view is a thin adapter around the same headless `Editor`.

Implement a view that calls `editor.mount` / `editor.unmount`. Reuse `@weditor/preset-docs` and `@weditor/collab`. Do not fork the schema or the OT provider.

```ts
import { Editor } from '@weditor/core'
import { docsPreset } from '@weditor/preset-docs'
import { collabExtension, createWsProvider } from '@weditor/collab'
import { onBeforeUnmount, onMounted, ref } from 'vue'

export default {
  setup() {
    const el = ref<HTMLElement | null>(null)
    let editor: Editor | undefined

    onMounted(async () => {
      const provider = createWsProvider({
        url: 'ws://localhost:8787',
        roomId: 'demo',
        user: { id: 'u1', name: 'Ada' },
      })
      await provider.connect()
      const snap = await provider.loadDocument()
      editor = Editor.create({
        extensions: [...docsPreset(), collabExtension(provider, { version: snap.version })],
        content: snap.doc,
      })
      editor.comments.replaceAll(snap.comments)
      if (el.value) editor.mount(el.value)
    })

    onBeforeUnmount(() => {
      editor?.unmount()
      editor?.destroy()
    })

    return { el }
  },
}
```

Single-user: skip the provider, pass `docsPreset()` only, and `editor.mount` the same way.

NodeViews for image, task checkbox, and mention live in `@weditor/preset-docs`, so they work without React. Toolbar, find bar, and comment sidebar are React-only in this release — rebuild those in Vue against `editor.commands`, `editor.on('openFind' | 'openComment' | 'comments' | 'selection')`, and `editor.setEditable`.

`extensions` must stay referentially stable across the view’s lifetime. Call `editor.destroy()` on teardown so `collabExtension` disconnects the provider.
