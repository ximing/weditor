/** @vitest-environment happy-dom */
import { Editor, type Command } from '@deditor/core'
import { describe, expect, it } from 'vitest'
import { docsPreset, docsSchema } from '../preset'

describe('tables', () => {
  it('insertTable defaults to 3x3 and uses table_row / table_cell', () => {
    const editor = Editor.create({ extensions: docsPreset() })
    expect(editor.commands.insertTable()).toBe(true)
    const table = editor.state.doc.firstChild!
    expect(table.type.name).toBe('table')
    expect(table.childCount).toBe(3)
    expect(table.firstChild?.childCount).toBe(3)
    expect(table.firstChild?.firstChild?.type.name).toMatch(/table_cell|table_header/)
  })

  it('insertTable({ rows: 2, cols: 4 })', () => {
    const editor = Editor.create({ extensions: docsPreset() })
    expect(editor.commands.insertTable({ rows: 2, cols: 4 })).toBe(true)
    expect(editor.state.doc.firstChild?.childCount).toBe(2)
    expect(editor.state.doc.firstChild?.firstChild?.childCount).toBe(4)
  })

  it('addColumnAfter / addRowAfter / deleteColumn / deleteRow / mergeCells / splitCell / toggleHeaderRow exist and return boolean', () => {
    const editor = Editor.create({ extensions: docsPreset() })
    editor.commands.insertTable({ rows: 2, cols: 2 })
    expect(typeof editor.commands.addColumnBefore()).toBe('boolean')
    expect(typeof editor.commands.addColumnAfter()).toBe('boolean')
    expect(typeof editor.commands.deleteColumn()).toBe('boolean')
    expect(typeof editor.commands.addRowBefore()).toBe('boolean')
    expect(typeof editor.commands.addRowAfter()).toBe('boolean')
    expect(typeof editor.commands.deleteRow()).toBe('boolean')
    expect(typeof editor.commands.mergeCells()).toBe('boolean')
    expect(typeof editor.commands.splitCell()).toBe('boolean')
    expect(typeof editor.commands.toggleHeaderRow()).toBe('boolean')
  })

  it('tables extension sits before lists so Tab in a table cell does not sink a nested list first', () => {
    const names = docsPreset().map((e) => e.name)
    expect(names.indexOf('tables')).toBeLessThan(names.indexOf('lists'))
    const tables = docsPreset().find((e) => e.name === 'tables')!
    expect(tables.plugins).toBeTypeOf('function')
  })

  it('schema includes table / table_row / table_cell / table_header', () => {
    const schema = docsSchema()
    expect(schema.nodes.table.spec.group).toContain('block')
    expect(schema.nodes.table_row).toBeTruthy()
    expect(schema.nodes.table_cell).toBeTruthy()
    expect(schema.nodes.table_header).toBeTruthy()
  })

  it('getHTML emits table / tr / td', () => {
    const editor = Editor.create({ extensions: docsPreset() })
    expect(editor.commands.insertTable({ rows: 1, cols: 1 })).toBe(true)
    const html = editor.getHTML()
    expect(html).toContain('<table')
    expect(html).toContain('<tr')
    expect(html).toContain('<td')
  })

  it('Tab in a table cell with a nested list moves to the next cell', () => {
    const editor = Editor.create({ extensions: docsPreset() })
    expect(editor.commands.insertTable({ rows: 1, cols: 2 })).toBe(true)
    expect(editor.commands.toggleBulletList()).toBe(true)
    const tables = docsPreset().find((e) => e.name === 'tables')!
    const tab = tables.keymap!({ schema: editor.schema, editor }).Tab as Command
    expect(tab(editor.state, (tr) => editor.dispatch(tr))).toBe(true)
    const $from = editor.state.selection.$from
    let cellIndex: number | null = null
    for (let d = $from.depth; d > 0; d--) {
      if ($from.node(d).type.name === 'table_row') {
        cellIndex = $from.index(d)
        break
      }
    }
    expect(cellIndex).toBe(1)
    const cell0 = editor.state.doc.firstChild!.firstChild!.firstChild!
    expect(cell0.firstChild?.type.name).toBe('bullet_list')
    expect(cell0.firstChild?.childCount).toBe(1)
  })
})
