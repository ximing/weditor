import type { Command, DocsCommands, Editor } from '@deditor/core'
import type { Node, ResolvedPos, Schema } from 'prosemirror-model'
import { TextSelection, type Transaction } from 'prosemirror-state'
import {
  addColumnAfter as pmAddColumnAfter,
  addColumnBefore as pmAddColumnBefore,
  addRowAfter as pmAddRowAfter,
  addRowBefore as pmAddRowBefore,
  deleteColumn as pmDeleteColumn,
  deleteRow as pmDeleteRow,
  mergeCells as pmMergeCells,
  splitCell as pmSplitCell,
  toggleHeaderRow as pmToggleHeaderRow,
} from 'prosemirror-tables'

function createTable(schema: Schema, rows: number, cols: number): Node | null {
  const cellType = schema.nodes.table_cell
  const rowType = schema.nodes.table_row
  const tableType = schema.nodes.table
  if (!cellType || !rowType || !tableType) return null
  const rowNodes: Node[] = []
  for (let r = 0; r < rows; r++) {
    const cells: Node[] = []
    for (let c = 0; c < cols; c++) {
      const cell = cellType.createAndFill()
      if (!cell) return null
      cells.push(cell)
    }
    rowNodes.push(rowType.create(null, cells))
  }
  return tableType.create(null, rowNodes)
}

function selectFirstCell(tr: Transaction, tablePos: number) {
  const inserted = tr.doc.nodeAt(tablePos)
  if (!inserted) return tr
  let inner: number | null = null
  inserted.descendants((node, pos) => {
    if (inner != null) return false
    if (node.isTextblock) {
      inner = tablePos + 1 + pos + 1
      return false
    }
    return true
  })
  if (inner == null) return tr
  return tr.setSelection(TextSelection.create(tr.doc, inner))
}

function tablePosAround($pos: ResolvedPos): number | null {
  for (let d = $pos.depth; d > 0; d--) {
    if ($pos.node(d).type.name === 'table') return $pos.before(d)
  }
  if ($pos.nodeBefore?.type.name === 'table') return $pos.pos - $pos.nodeBefore.nodeSize
  if ($pos.nodeAfter?.type.name === 'table') return $pos.pos
  return null
}

function insertTableNode(editor: Editor, table: Node): boolean {
  const { $from } = editor.state.selection
  let tr = editor.state.tr
  if ($from.parent.isTextblock && $from.parent.content.size === 0 && $from.depth >= 1) {
    tr = tr.replaceWith($from.before(), $from.after(), table)
  } else {
    if ($from.parent.isTextblock && $from.parent.content.size > 0 && tr.doc.canSplit($from.pos)) {
      tr = tr.split($from.pos)
    }
    tr = tr.replaceSelectionWith(table)
  }
  const tablePos = tablePosAround(tr.selection.$from)
  editor.dispatch(tablePos != null ? selectFirstCell(tr, tablePos) : tr)
  return true
}

export function tableCommands(editor: Editor): Partial<DocsCommands> {
  const run = (cmd: Command) => cmd(editor.state, (tr) => editor.dispatch(tr))
  return {
    insertTable: (args) => {
      const rows = Math.max(1, Math.floor(args?.rows ?? 3))
      const cols = Math.max(1, Math.floor(args?.cols ?? 3))
      const table = createTable(editor.schema, rows, cols)
      if (!table) return false
      return insertTableNode(editor, table)
    },
    addColumnBefore: () => run(pmAddColumnBefore),
    addColumnAfter: () => run(pmAddColumnAfter),
    deleteColumn: () => run(pmDeleteColumn),
    addRowBefore: () => run(pmAddRowBefore),
    addRowAfter: () => run(pmAddRowAfter),
    deleteRow: () => run(pmDeleteRow),
    mergeCells: () => run(pmMergeCells),
    splitCell: () => run(pmSplitCell),
    toggleHeaderRow: () => run(pmToggleHeaderRow),
  }
}
