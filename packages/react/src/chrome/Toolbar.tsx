import {
  FONT_FAMILIES,
  FONT_SIZES,
  COLORS_STANDARD,
  COLORS_THEME,
  HIGHLIGHTS,
} from '@weditor/preset-docs'
import { useEditor } from '../useEditor'
import { ColorPalette } from './ColorPalette'

export function Toolbar() {
  const editor = useEditor()
  return (
    <div className="weditor-toolbar" role="toolbar">
      <button type="button" title="Undo" onMouseDown={(e) => { e.preventDefault(); editor.commands.undo() }}>Undo</button>
      <button type="button" title="Redo" onMouseDown={(e) => { e.preventDefault(); editor.commands.redo() }}>Redo</button>
      <button type="button" title="Paint format" disabled>Paint format</button>
      <button type="button" title="Clear formatting" disabled>Clear formatting</button>
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
    </div>
  )
}
