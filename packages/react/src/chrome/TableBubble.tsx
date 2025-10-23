import { CellSelection } from 'prosemirror-tables'
import React, { useEffect, useState } from 'react'
import { useEditor } from '../useEditor'

export function TableBubble() {
  const editor = useEditor()
  const [, setTick] = useState(0)
  useEffect(() => {
    const offSel = editor.on('selection', () => setTick((n) => n + 1))
    const offTx = editor.on('transaction', () => setTick((n) => n + 1))
    return () => {
      offSel()
      offTx()
    }
  }, [editor])
  const sel = editor.state.selection
  let inTable = sel instanceof CellSelection
  if (!inTable) {
    const $from = sel.$from
    for (let d = $from.depth; d > 0; d--) {
      if ($from.node(d).type.name === 'table') {
        inTable = true
        break
      }
    }
  }
  if (!inTable) return null
  return (
    <div className="deditor-table-bubble" role="toolbar">
      <button type="button" className="deditor-chip-btn" onMouseDown={(e) => { e.preventDefault(); editor.commands.addColumnBefore() }}>Column before</button>
      <button type="button" className="deditor-chip-btn" onMouseDown={(e) => { e.preventDefault(); editor.commands.addColumnAfter() }}>Column after</button>
      <button type="button" className="deditor-chip-btn" onMouseDown={(e) => { e.preventDefault(); editor.commands.deleteColumn() }}>Delete column</button>
      <button type="button" className="deditor-chip-btn" onMouseDown={(e) => { e.preventDefault(); editor.commands.addRowBefore() }}>Row before</button>
      <button type="button" className="deditor-chip-btn" onMouseDown={(e) => { e.preventDefault(); editor.commands.addRowAfter() }}>Row after</button>
      <button type="button" className="deditor-chip-btn" onMouseDown={(e) => { e.preventDefault(); editor.commands.deleteRow() }}>Delete row</button>
      <button type="button" className="deditor-chip-btn" onMouseDown={(e) => { e.preventDefault(); editor.commands.mergeCells() }}>Merge</button>
      <button type="button" className="deditor-chip-btn" onMouseDown={(e) => { e.preventDefault(); editor.commands.splitCell() }}>Split</button>
      <button type="button" className="deditor-chip-btn" onMouseDown={(e) => { e.preventDefault(); editor.commands.toggleHeaderRow() }}>Header row</button>
    </div>
  )
}
