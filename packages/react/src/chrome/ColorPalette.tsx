import { useState } from 'react'

export function ColorPalette(props: {
  title: string
  colors: readonly string[]
  onDefault: () => void
  onPick: (color: string) => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="weditor-color-palette">
      <button
        type="button"
        title={props.title}
        aria-expanded={open}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setOpen((v) => !v)}
      >
        {props.title}
      </button>
      {open ? (
        <div className="weditor-color-palette-grid" role="listbox">
          <button
            type="button"
            title="Default"
            className="weditor-color-default"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              props.onDefault()
              setOpen(false)
            }}
          >
            Default
          </button>
          {props.colors.map((hex) => (
            <button
              key={hex}
              type="button"
              title={`Color ${hex}`}
              className="weditor-color-swatch"
              style={{ background: hex }}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                props.onPick(hex)
                setOpen(false)
              }}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
