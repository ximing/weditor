import { toggleMark } from 'prosemirror-commands'
import { sanitizeHref, type Command, type DocsCommands, type Editor } from '@weditor/core'
import type { MarkType, Schema } from 'prosemirror-model'

function clearMark(editor: Editor, type: MarkType): boolean {
  const { from, to, empty } = editor.state.selection
  const tr = editor.state.tr
  if (empty) {
    tr.removeStoredMark(type)
  } else {
    tr.removeMark(from, to, type)
  }
  editor.dispatch(tr)
  return true
}

function applyMark(editor: Editor, type: MarkType, attrs?: Record<string, unknown>): boolean {
  const mark = type.create(attrs)
  const { empty, $cursor, from, to } = editor.state.selection
  if (empty) {
    if (!$cursor) return false
    editor.dispatch(editor.state.tr.addStoredMark(mark))
    return true
  }
  editor.dispatch(editor.state.tr.removeMark(from, to, type).addMark(from, to, mark))
  return true
}

export function markCommands({
  schema,
  editor,
}: {
  schema: Schema
  editor: Editor
}): Partial<DocsCommands> {
  const run = (cmd: Command) => cmd(editor.state, (tr) => editor.dispatch(tr))
  const parsePt = (size: string): string | null => {
    const m = /^(\d+)pt$/.exec(size)
    if (!m) return null
    const n = Math.min(72, Math.max(5, Number(m[1])))
    return `${n}pt`
  }
  return {
    toggleStrong: () => run(toggleMark(schema.marks.strong)),
    toggleEm: () => run(toggleMark(schema.marks.em)),
    toggleUnderline: () => run(toggleMark(schema.marks.underline)),
    toggleStrike: () => run(toggleMark(schema.marks.strike)),
    toggleCode: () => run(toggleMark(schema.marks.code)),
    toggleSuperscript: () => run(toggleMark(schema.marks.superscript)),
    toggleSubscript: () => run(toggleMark(schema.marks.subscript)),
    setFontSize: (size) => {
      if (size === null) return clearMark(editor, schema.marks.fontSize)
      const parsed = parsePt(size)
      if (!parsed) return false
      return applyMark(editor, schema.marks.fontSize, { size: parsed })
    },
    setFontFamily: (family) => {
      if (family === null) return clearMark(editor, schema.marks.fontFamily)
      return applyMark(editor, schema.marks.fontFamily, { family })
    },
    setColor: (color) => {
      if (color === null) return clearMark(editor, schema.marks.color)
      return applyMark(editor, schema.marks.color, { color })
    },
    setHighlight: (color) => {
      if (color === null) return clearMark(editor, schema.marks.highlight)
      return applyMark(editor, schema.marks.highlight, { color })
    },
    setLink: ({ href }) => {
      const clean = sanitizeHref(href)
      if (!clean) return false
      const { from, to, empty } = editor.state.selection
      let tr = editor.state.tr
      if (empty) {
        tr = tr.insertText(clean)
        tr = tr.addMark(from, from + clean.length, schema.marks.link.create({ href: clean }))
      } else {
        tr = tr.addMark(from, to, schema.marks.link.create({ href: clean }))
      }
      editor.dispatch(tr)
      return true
    },
    unsetLink: () => clearMark(editor, schema.marks.link),
  }
}
