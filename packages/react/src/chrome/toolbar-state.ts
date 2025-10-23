import type { Editor } from '@deditor/core'

export function isMarkActive(editor: Editor, name: string): boolean {
  const type = editor.state.schema.marks[name]
  if (!type) return false
  const { selection, storedMarks } = editor.state
  if (selection.empty) {
    return !!type.isInSet(storedMarks ?? selection.$from.marks())
  }
  let found = false
  editor.state.doc.nodesBetween(selection.from, selection.to, (node) => {
    if (found) return false
    if (node.isText && type.isInSet(node.marks)) found = true
    return true
  })
  return found
}

export function activeMarkAttr(editor: Editor, mark: string, attr: string): string | null {
  const type = editor.state.schema.marks[mark]
  if (!type) return null
  const { selection, storedMarks } = editor.state
  if (selection.empty) {
    const m = type.isInSet(storedMarks ?? selection.$from.marks())
    return m && m.attrs[attr] ? String(m.attrs[attr]) : null
  }
  let value: string | null = null
  editor.state.doc.nodesBetween(selection.from, selection.to, (node) => {
    if (value !== null) return false
    if (!node.isText) return true
    const m = type.isInSet(node.marks)
    if (m && m.attrs[attr]) value = String(m.attrs[attr])
    return true
  })
  return value
}

export function activeBlock(editor: Editor): string {
  const { $from } = editor.state.selection
  for (let d = $from.depth; d > 0; d--) {
    const node = $from.node(d)
    const name = node.type.name
    if (name === 'heading') return `heading:${node.attrs.level as number}`
    if (name === 'blockquote') return 'blockquote'
    if (name === 'code_block') return 'code_block'
  }
  return 'paragraph'
}

export function activeAlign(editor: Editor): string {
  const { $from } = editor.state.selection
  for (let d = $from.depth; d > 0; d--) {
    const node = $from.node(d)
    if (node.type.name === 'paragraph' || node.type.name === 'heading') {
      return (node.attrs.align as string | null) ?? 'left'
    }
  }
  return 'left'
}

export function activeList(editor: Editor): 'bullet_list' | 'ordered_list' | 'task_list' | null {
  const { $from } = editor.state.selection
  for (let d = $from.depth; d > 0; d--) {
    const name = $from.node(d).type.name
    if (name === 'bullet_list' || name === 'ordered_list' || name === 'task_list') return name
  }
  return null
}
