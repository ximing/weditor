import { LINE_HEIGHTS } from '@weditor/preset-docs'
import { useState } from 'react'
import { useEditor } from '../useEditor'

export function OverflowMore() {
  const editor = useEditor()
  const [open, setOpen] = useState(false)
  return (
    <div className={['weditor-more', open ? 'is-open' : ''].filter(Boolean).join(' ')}>
      <button
        type="button"
        title="More"
        className="weditor-more-toggle"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setOpen((v) => !v)}
      >
        More
      </button>
      <div className="weditor-more-items">
        <button
          type="button"
          title="Inline code"
          onMouseDown={(e) => {
            e.preventDefault()
            editor.commands.toggleCode()
          }}
        >
          Code
        </button>
        <button
          type="button"
          title="Superscript"
          onMouseDown={(e) => {
            e.preventDefault()
            editor.commands.toggleSuperscript()
          }}
        >
          Sup
        </button>
        <button
          type="button"
          title="Subscript"
          onMouseDown={(e) => {
            e.preventDefault()
            editor.commands.toggleSubscript()
          }}
        >
          Sub
        </button>
        <label>
          Line height
          <select
            aria-label="Line height"
            onChange={(e) => editor.commands.setLineHeight({ lineHeight: Number(e.target.value) })}
          >
            {LINE_HEIGHTS.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          title="Horizontal rule"
          onMouseDown={(e) => {
            e.preventDefault()
            editor.commands.insertHorizontalRule()
          }}
        >
          HR
        </button>
        <button
          type="button"
          title="Mention"
          onMouseDown={(e) => {
            e.preventDefault()
            editor.commands.insertMention({ id: 'demo', name: 'Demo' })
          }}
        >
          Mention
        </button>
      </div>
    </div>
  )
}
