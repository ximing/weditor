import { tableNodes } from 'prosemirror-tables'

export const tableNodeSpecs = tableNodes({
  tableGroup: 'block',
  cellContent: 'block+',
  cellAttributes: {},
})
