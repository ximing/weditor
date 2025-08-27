import type { Extension } from '@weditor/core'
import type { Node } from 'prosemirror-model'
import { Plugin, PluginKey, type EditorState } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'
import { searchCommands } from '../commands/search'

export interface SearchState {
  query: string
  matches: { from: number; to: number }[]
  active: number
}

export const searchPluginKey = new PluginKey<SearchState>('search')

export function findAll(state: EditorState): { from: number; to: number }[] {
  return searchPluginKey.getState(state)?.matches ?? []
}

export function collectMatches(doc: Node, query: string): { from: number; to: number }[] {
  const q = query.toLowerCase()
  if (!q) return []
  const out: { from: number; to: number }[] = []
  const pieces: { pos: number; text: string }[] = []
  doc.descendants((node, pos) => {
    if (node.isText && node.text) pieces.push({ pos, text: node.text })
    else if (!node.isInline && pieces.length) pieces.push({ pos: -1, text: ' ' })
  })
  let hay = ''
  const map: number[] = []
  for (const p of pieces) {
    if (p.pos < 0) {
      hay += ' '
      map.push(-1)
      continue
    }
    for (let i = 0; i < p.text.length; i++) {
      hay += p.text[i]
      map.push(p.pos + i)
    }
  }
  const hayL = hay.toLowerCase()
  let idx = 0
  while (idx < hayL.length) {
    const found = hayL.indexOf(q, idx)
    if (found < 0) break
    const from = map[found]
    const last = map[found + q.length - 1]
    if (from >= 0 && last >= 0) out.push({ from, to: last + 1 })
    idx = found + Math.max(q.length, 1)
  }
  return out
}

export function searchExtension(): Extension {
  return {
    name: 'search',
    plugins: () => [
      new Plugin<SearchState>({
        key: searchPluginKey,
        state: {
          init: () => ({ query: '', matches: [], active: -1 }),
          apply(tr, value) {
            const meta = tr.getMeta(searchPluginKey) as string | number | undefined
            let query = value.query
            let active = value.active
            if (typeof meta === 'string') {
              query = meta
              active = -1
            } else if (typeof meta === 'number') {
              active = meta
            }
            const matches =
              typeof meta === 'string' || tr.docChanged
                ? collectMatches(tr.doc, query)
                : value.matches
            if (active >= matches.length) active = matches.length ? 0 : -1
            return { query, matches, active }
          },
        },
        props: {
          decorations(state) {
            const st = searchPluginKey.getState(state)
            if (!st?.matches.length) return null
            return DecorationSet.create(
              state.doc,
              st.matches.flatMap((m, i) => {
                if (m.from >= m.to) return []
                const className =
                  i === st.active
                    ? 'weditor-search-match weditor-search-match-active'
                    : 'weditor-search-match'
                return [Decoration.inline(m.from, m.to, { class: className })]
              }),
            )
          },
        },
      }),
    ],
    commands: searchCommands,
  }
}
