import { toggleMark } from 'prosemirror-commands'
import { sanitizeHref, type Command, type Extension } from '@weditor/core'
import { basicMarks } from '../marks/basic'
import { fontMarks } from '../marks/font'
import { linkMark } from '../marks/link'
import { scriptMarks } from '../marks/script'

export function marksExtension(): Extension {
  return {
    name: 'marks',
    marks: { ...basicMarks, ...scriptMarks, ...linkMark, ...fontMarks },
    commands: ({ schema, editor }) => {
      const run = (cmd: Command) => cmd(editor.state, (tr) => editor.dispatch(tr))
      return {
        toggleStrong: () => run(toggleMark(schema.marks.strong)),
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
      }
    },
  }
}
