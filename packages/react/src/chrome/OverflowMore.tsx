import { LINE_HEIGHTS } from '@deditor/preset-docs'
import { useRef, useState, type ReactNode } from 'react'
import {
  IconCode,
  IconHR,
  IconMention,
  IconMore,
  IconSub,
  IconSup,
} from '../icons'
import { useEditor } from '../useEditor'
import { useEditorState } from '../useEditorState'
import { IconButton } from '../ui/IconButton'
import { Menu } from '../ui/Menu'
import { Popover } from '../ui/Popover'
import { Select } from '../ui/Select'
import { isMarkActive } from './toolbar-state'

export function OverflowMore(props: { overflow?: ReactNode }) {
  const editor = useEditor()
  const [open, setOpen] = useState(false)
  const [lineHeight, setLineHeight] = useState('')
  const anchorRef = useRef<HTMLSpanElement>(null)
  const codeActive = useEditorState((e) => isMarkActive(e, 'code'))
  const supActive = useEditorState((e) => isMarkActive(e, 'superscript'))
  const subActive = useEditorState((e) => isMarkActive(e, 'subscript'))

  const close = () => setOpen(false)
  const run = (fn: () => void) => () => {
    fn()
    close()
  }

  return (
    <span ref={anchorRef} className="deditor-more">
      <IconButton
        icon={IconMore}
        label="More"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setOpen((value) => !value)}
      />
      <Popover open={open} onClose={close} anchor={anchorRef.current} placement="bottom-end">
        {props.overflow ? <div className="deditor-more-overflow">{props.overflow}</div> : null}
        <Menu
          aria-label="More"
          items={[
            { id: 'code', label: 'Inline code', icon: IconCode, checked: codeActive },
            { id: 'sup', label: 'Superscript', icon: IconSup, checked: supActive },
            { id: 'sub', label: 'Subscript', icon: IconSub, checked: subActive },
            { id: 'hr', label: 'Horizontal rule', icon: IconHR },
            { id: 'mention', label: 'Mention', icon: IconMention },
          ]}
          onSelect={(id) => {
            if (id === 'code') run(() => editor.commands.toggleCode())()
            else if (id === 'sup') run(() => editor.commands.toggleSuperscript())()
            else if (id === 'sub') run(() => editor.commands.toggleSubscript())()
            else if (id === 'hr') run(() => editor.commands.insertHorizontalRule())()
            else if (id === 'mention')
              run(() => editor.commands.insertMention({ id: 'demo', name: 'Demo' }))()
          }}
        />
        <div className="deditor-more-lineheight">
          <Select
            label="Line height"
            value={lineHeight}
            options={LINE_HEIGHTS.map((height) => ({
              value: String(height),
              label: String(height),
            }))}
            onChange={(value) => {
              setLineHeight(value)
              editor.commands.setLineHeight({ lineHeight: Number(value) })
            }}
            width={96}
          />
        </div>
      </Popover>
    </span>
  )
}
