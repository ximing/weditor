import type { Extension } from '@deditor/core'
import { commentCommands } from '../commands/comments'
import { markCommands } from '../commands/marks'
import { basicMarks } from '../marks/basic'
import { commentMark } from '../marks/comment'
import { fontMarks } from '../marks/font'
import { linkMark } from '../marks/link'
import { scriptMarks } from '../marks/script'

export function marksExtension(): Extension {
  return {
    name: 'marks',
    marks: { ...basicMarks, ...scriptMarks, ...linkMark, ...fontMarks, ...commentMark },
    commands: (ctx) => ({
      ...markCommands(ctx),
      ...commentCommands(ctx),
    }),
  }
}
