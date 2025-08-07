import type { Extension } from '@weditor/core'
import { markCommands } from '../commands/marks'
import { basicMarks } from '../marks/basic'
import { fontMarks } from '../marks/font'
import { linkMark } from '../marks/link'
import { scriptMarks } from '../marks/script'

export function marksExtension(): Extension {
  return {
    name: 'marks',
    marks: { ...basicMarks, ...scriptMarks, ...linkMark, ...fontMarks },
    commands: markCommands,
  }
}
