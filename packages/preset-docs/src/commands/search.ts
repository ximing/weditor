import type { DocsCommands, Editor } from '@deditor/core'
import { closeHistory } from 'prosemirror-history'
import { TextSelection } from 'prosemirror-state'
import { searchPluginKey } from '../extensions/search'

function selectMatch(editor: Editor, index: number): boolean {
  const st = searchPluginKey.getState(editor.state)
  if (!st || index < 0 || index >= st.matches.length) return false
  const m = st.matches[index]
  const tr = editor.state.tr
    .setSelection(TextSelection.create(editor.state.doc, m.from, m.to))
    .scrollIntoView()
    .setMeta(searchPluginKey, index)
    .setMeta('addToHistory', false)
  editor.dispatch(tr)
  return true
}

export function searchCommands({ editor }: { editor: Editor }): Partial<DocsCommands> {
  return {
    setSearchQuery: (q) => {
      if (searchPluginKey.getState(editor.state) == null) return false
      editor.dispatch(editor.state.tr.setMeta(searchPluginKey, q).setMeta('addToHistory', false))
      return true
    },
    findNext: () => {
      const st = searchPluginKey.getState(editor.state)
      if (!st || st.matches.length === 0) return false
      const { to } = editor.state.selection
      let idx = st.matches.findIndex((m) => m.from >= to)
      if (idx < 0) idx = 0
      return selectMatch(editor, idx)
    },
    findPrev: () => {
      const st = searchPluginKey.getState(editor.state)
      if (!st || st.matches.length === 0) return false
      const { from } = editor.state.selection
      let idx = -1
      for (let i = st.matches.length - 1; i >= 0; i--) {
        if (st.matches[i].to <= from) {
          idx = i
          break
        }
      }
      if (idx < 0) idx = st.matches.length - 1
      return selectMatch(editor, idx)
    },
    replace: ({ with: text }) => {
      const st = searchPluginKey.getState(editor.state)
      if (!st || st.matches.length === 0) return false
      const match = st.active >= 0 ? st.matches[st.active] : undefined
      const sel = editor.state.selection
      if (match && sel.from === match.from && sel.to === match.to) {
        editor.dispatch(closeHistory(editor.state.tr.insertText(text, match.from, match.to)))
        editor.commands.findNext()
        return true
      }
      return editor.commands.findNext()
    },
    replaceAll: ({ with: text }) => {
      const st = searchPluginKey.getState(editor.state)
      if (!st || st.matches.length === 0) return false
      let tr = editor.state.tr
      for (const m of st.matches) {
        const from = tr.mapping.map(m.from)
        const to = tr.mapping.map(m.to)
        tr = tr.insertText(text, from, to)
      }
      editor.dispatch(closeHistory(tr))
      return true
    },
  }
}
