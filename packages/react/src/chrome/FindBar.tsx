import { findAll } from '@deditor/preset-docs'
import { useEffect, useState } from 'react'
import { useEditor } from '../useEditor'

export function FindBar() {
  const editor = useEditor()
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [repl, setRepl] = useState('')
  const [, bump] = useState(0)
  useEffect(() => {
    const offFind = editor.on('openFind', () => setOpen(true))
    const offTr = editor.on('transaction', () => bump((n) => n + 1))
    return () => {
      offFind()
      offTr()
    }
  }, [editor])
  if (!open) return null
  return (
    <div className="deditor-find" role="search">
      <input
        aria-label="Find"
        value={q}
        onChange={(e) => {
          setQ(e.target.value)
          editor.commands.setSearchQuery(e.target.value)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') setOpen(false)
        }}
      />
      <button type="button" onClick={() => editor.commands.findNext()}>
        Next
      </button>
      <button type="button" onClick={() => editor.commands.findPrev()}>
        Prev
      </button>
      <input aria-label="Replace" value={repl} onChange={(e) => setRepl(e.target.value)} />
      <button type="button" onClick={() => editor.commands.replace({ with: repl })}>
        Replace
      </button>
      <button type="button" onClick={() => editor.commands.replaceAll({ with: repl })}>
        Replace all
      </button>
      <span>{findAll(editor.state).length}</span>
    </div>
  )
}
