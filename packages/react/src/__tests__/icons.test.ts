import { describe, expect, it } from 'vitest'
import * as icons from '../icons'

describe('icons mapping', () => {
  it('exports every icon used by chrome as a component', () => {
    const required = [
      'IconUndo', 'IconRedo', 'IconPaint', 'IconClearFormat',
      'IconBold', 'IconItalic', 'IconUnderline', 'IconStrike',
      'IconCode', 'IconSup', 'IconSub', 'IconTextColor', 'IconHighlight',
      'IconAlignLeft', 'IconAlignCenter', 'IconAlignRight', 'IconAlignJustify',
      'IconBulletList', 'IconOrderedList', 'IconTaskList', 'IconIndent', 'IconOutdent',
      'IconLink', 'IconImage', 'IconTable', 'IconComment', 'IconFind', 'IconPrint',
      'IconMore', 'IconHR', 'IconMention',
      'IconCheck', 'IconChevronDown', 'IconClose', 'IconUpload',
    ]
    for (const name of required) {
      expect(typeof (icons as Record<string, unknown>)[name], name).toBe('object')
    }
  })
})
