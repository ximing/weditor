import { findAll } from '@deditor/preset-docs'
import { useEffect, useState } from 'react'
import { IconClose } from '../icons'
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
  const close = () => {
    editor.commands.setSearchQuery('')
    setQ('')
    setOpen(false)
  }
  return (
    <div className="deditor-find" role="search">
      <input
        aria-label="Find"
        placeholder="Find"
        value={q}
        onChange={(e) => {
          setQ(e.target.value)
          editor.commands.setSearchQuery(e.target.value)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') close()
        }}
      />
      <span className="deditor-find-count">{q ? findAll(editor.state).length : 0}</span>
      <button type="button" className="deditor-chip-btn" onClick={() => editor.commands.findNext()}>
        Next
      </button>
      <button type="button" className="deditor-chip-btn" onClick={() => editor.commands.findPrev()}>
        Prev
      </button>
      <input
        aria-label="Replace"
        placeholder="Replace"
        value={repl}
        onChange={(e) => setRepl(e.target.value)}
      />
      <button type="button" className="deditor-chip-btn" onClick={() => editor.commands.replace({ with: repl })}>
        Replace
      </button>
      <button type="button" className="deditor-chip-btn" onClick={() => editor.commands.replaceAll({ with: repl })}>
        Replace all
      </button>
      <button type="button" aria-label="Close find" className="deditor-icon-btn" onClick={close}>
        <IconClose size={16} aria-hidden />
      </button>
    </div>
  )
}
