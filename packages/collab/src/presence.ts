import type { Presence } from '@deditor/core'
import { Plugin, PluginKey } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'

export const presencePluginKey = new PluginKey<Map<string, Presence>>('presence')

export function createPresencePlugin(localClientID: string): Plugin {
  return new Plugin<Map<string, Presence>>({
    key: presencePluginKey,
    state: {
      init: () => new Map(),
      apply(tr, value) {
        const incoming = tr.getMeta(presencePluginKey) as Record<string, Presence> | undefined
        let next: Map<string, Presence>
        if (incoming) {
          next = new Map(Object.entries(incoming))
        } else {
          next = new Map()
          for (const [id, p] of value) {
            if (!p.selection) continue
            const a = tr.mapping.mapResult(p.selection.anchor, 1)
            const h = tr.mapping.mapResult(p.selection.head, 1)
            if (a.deleted || h.deleted) continue
            next.set(id, {
              ...p,
              selection: { ...p.selection, anchor: a.pos, head: h.pos },
            })
          }
        }
        return next
      },
    },
    props: {
      decorations(state) {
        const map = presencePluginKey.getState(state)
        if (!map) return null
        const decos: Decoration[] = []
        for (const [id, p] of map) {
          if (id === localClientID || !p.selection) continue
          const color = p.user.color ?? colorFromId(p.user.id)
          if (p.selection.type === 'node') {
            decos.push(
              Decoration.node(p.selection.anchor, p.selection.head, {
                style: `outline: 2px solid ${color}`,
              }),
            )
          } else {
            decos.push(
              Decoration.widget(p.selection.head, () => caretEl(p.user.name, color), {
                side: 1,
                key: id,
              }),
            )
          }
        }
        return DecorationSet.create(state.doc, decos)
      },
    },
  })
}

function colorFromId(id: string): string {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  return `hsl(${h % 360} 70% 40%)`
}

function caretEl(name: string, color: string): HTMLElement {
  if (typeof document === 'undefined') {
    return { nodeType: 1 } as HTMLElement
  }
  const wrap = document.createElement('span')
  wrap.className = 'deditor-caret'
  wrap.style.borderLeft = `2px solid ${color}`
  const tag = document.createElement('span')
  tag.className = 'deditor-caret-name'
  tag.style.background = color
  tag.textContent = name
  wrap.appendChild(tag)
  return wrap
}
