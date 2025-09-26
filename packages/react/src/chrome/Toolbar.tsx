import {
  FONT_FAMILIES,
  FONT_SIZES,
  COLORS_STANDARD,
  COLORS_THEME,
  HIGHLIGHTS,
} from '@weditor/preset-docs'
import { useEffect, useRef } from 'react'
import { useEditor } from '../useEditor'
import { ColorPalette } from './ColorPalette'
import { OverflowMore } from './OverflowMore'
import { toast } from './toast'

export function Toolbar(props: {
  uploadImage?: (file: File) => Promise<{ src: string; alt?: string; width?: number }>
}) {
  const editor = useEditor()
  const fileRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    return editor.on('openLink', () => {
      const href = window.prompt('URL')
      if (href) editor.commands.setLink({ href })
    })
  }, [editor])
  return (
    <div className="weditor-toolbar" role="toolbar">
      <button type="button" title="Undo" onMouseDown={(e) => { e.preventDefault(); editor.commands.undo() }}>Undo</button>
      <button type="button" title="Redo" onMouseDown={(e) => { e.preventDefault(); editor.commands.redo() }}>Redo</button>
      <button type="button" title="Paint format" onMouseDown={(e) => { e.preventDefault(); editor.commands.copyFormat() }}>Paint format</button>
      <button type="button" title="Clear formatting" onMouseDown={(e) => { e.preventDefault(); editor.commands.clearFormat() }}>Clear formatting</button>
      <label>
        Block type
        <select
          aria-label="Block type"
          onChange={(e) => {
            const v = e.target.value
            if (v === 'paragraph') editor.commands.setBlockType({ type: 'paragraph' })
            else if (v === 'blockquote') editor.commands.toggleBlockquote()
            else if (v === 'code_block') editor.commands.toggleCodeBlock()
            else if (v.startsWith('heading:')) {
              const level = Number(v.slice(8)) as 1 | 2 | 3 | 4 | 5 | 6
              editor.commands.setBlockType({ type: 'heading', level })
            }
          }}
        >
          <option value="paragraph">Paragraph</option>
          <option value="heading:1">Heading 1</option>
          <option value="heading:2">Heading 2</option>
          <option value="heading:3">Heading 3</option>
          <option value="heading:4">Heading 4</option>
          <option value="heading:5">Heading 5</option>
          <option value="heading:6">Heading 6</option>
          <option value="blockquote">Quote</option>
          <option value="code_block">Code block</option>
        </select>
      </label>
      <label>
        Font family
        <select aria-label="Font family" onChange={(e) => editor.commands.setFontFamily(e.target.value)}>
          {FONT_FAMILIES.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </label>
      <label>
        Font size
        <select aria-label="Font size" onChange={(e) => editor.commands.setFontSize(e.target.value)}>
          {FONT_SIZES.map((n) => (
            <option key={n} value={`${n}pt`}>{n}</option>
          ))}
        </select>
      </label>
      <button type="button" title="Bold" onMouseDown={(e) => { e.preventDefault(); editor.commands.toggleStrong() }}>B</button>
      <button type="button" title="Italic" onMouseDown={(e) => { e.preventDefault(); editor.commands.toggleEm() }}>I</button>
      <button type="button" title="Underline" onMouseDown={(e) => { e.preventDefault(); editor.commands.toggleUnderline() }}>U</button>
      <button type="button" title="Strikethrough" onMouseDown={(e) => { e.preventDefault(); editor.commands.toggleStrike() }}>S</button>
      <ColorPalette
        title="Text color"
        colors={[...COLORS_STANDARD, ...COLORS_THEME]}
        onDefault={() => editor.commands.setColor(null)}
        onPick={(c) => editor.commands.setColor(c)}
      />
      <ColorPalette
        title="Highlight"
        colors={[...HIGHLIGHTS]}
        onDefault={() => editor.commands.setHighlight(null)}
        onPick={(c) => editor.commands.setHighlight(c)}
      />
      <button type="button" title="Align left" onMouseDown={(e) => { e.preventDefault(); editor.commands.setAlign({ align: 'left' }) }}>Left</button>
      <button type="button" title="Align center" onMouseDown={(e) => { e.preventDefault(); editor.commands.setAlign({ align: 'center' }) }}>Center</button>
      <button type="button" title="Align right" onMouseDown={(e) => { e.preventDefault(); editor.commands.setAlign({ align: 'right' }) }}>Right</button>
      <button type="button" title="Align justify" onMouseDown={(e) => { e.preventDefault(); editor.commands.setAlign({ align: 'justify' }) }}>Justify</button>
      <button type="button" title="Bullet list" onMouseDown={(e) => { e.preventDefault(); editor.commands.toggleBulletList() }}>Bullet</button>
      <button type="button" title="Ordered list" onMouseDown={(e) => { e.preventDefault(); editor.commands.toggleOrderedList() }}>Ordered</button>
      <button type="button" title="Task list" onMouseDown={(e) => { e.preventDefault(); editor.commands.toggleTaskList() }}>Task</button>
      <OverflowMore />
      <button type="button" title="Indent" onMouseDown={(e) => { e.preventDefault(); editor.commands.indent() }}>Indent</button>
      <button type="button" title="Outdent" onMouseDown={(e) => { e.preventDefault(); editor.commands.outdent() }}>Outdent</button>
      <button
        type="button"
        title="Link"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => {
          const href = window.prompt('URL')
          if (href) editor.commands.setLink({ href })
        }}
      >
        Link
      </button>
      <button
        type="button"
        title="Image"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => {
          if (props.uploadImage) {
            fileRef.current?.click()
            return
          }
          const src = window.prompt('Image URL')
          if (src) editor.commands.insertImage({ src })
        }}
      >
        Image
      </button>
      <button
        type="button"
        title="Insert table"
        onMouseDown={(e) => {
          e.preventDefault()
          editor.commands.insertTable()
        }}
      >
        Table
      </button>
      <button
        type="button"
        title="Comment"
        onMouseDown={(e) => {
          e.preventDefault()
          const { from, to } = editor.state.selection
          if (from === to) return
          editor.emit('openComment', { from, to })
        }}
      >
        Comment
      </button>
      <button
        type="button"
        title="Find"
        onMouseDown={(e) => {
          e.preventDefault()
          editor.emit('openFind', undefined)
        }}
      >
        Find
      </button>
      <button type="button" title="Print" onClick={() => window.print()}>
        Print
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0]
          e.target.value = ''
          const upload = props.uploadImage
          if (!file || !upload) return
          void (async () => {
            try {
              const result = await upload(file)
              editor.commands.insertImage(result)
            } catch {
              toast('Upload failed')
            }
          })()
        }}
      />
    </div>
  )
}
