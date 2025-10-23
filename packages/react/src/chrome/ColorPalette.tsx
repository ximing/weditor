import type { LucideIcon } from 'lucide-react'
import { useRef, useState, type KeyboardEvent } from 'react'
import { IconCheck } from '../icons'
import { IconButton } from '../ui/IconButton'
import { Popover } from '../ui/Popover'

export function ColorPalette(props: {
  icon: LucideIcon
  title: string
  current?: string | null
  colors: readonly string[]
  onDefault: () => void
  onPick: (color: string) => void
}) {
  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLSpanElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const selectedColorIndex = props.colors.findIndex(
    (hex) => props.current?.toLowerCase() === hex.toLowerCase(),
  )
  const selectedIndex = selectedColorIndex < 0 ? 0 : selectedColorIndex + 1
  const [focusedIndex, setFocusedIndex] = useState(selectedIndex)
  const close = () => setOpen(false)

  const focusOption = (index: number) => {
    const options = listRef.current
      ? Array.from(listRef.current.querySelectorAll<HTMLButtonElement>('[role=option]'))
      : []
    if (options.length === 0) return
    const nextIndex = ((index % options.length) + options.length) % options.length
    setFocusedIndex(nextIndex)
    options[nextIndex].focus()
  }

  const onKeyDown = (event: KeyboardEvent) => {
    const options = listRef.current
      ? Array.from(listRef.current.querySelectorAll<HTMLButtonElement>('[role=option]'))
      : []
    const currentIndex = options.findIndex((option) => option === document.activeElement)
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault()
      focusOption(currentIndex + 1)
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault()
      focusOption(currentIndex - 1)
    } else if (event.key === 'Home') {
      event.preventDefault()
      focusOption(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      focusOption(options.length - 1)
    }
  }

  const toggle = () => {
    if (!open) setFocusedIndex(selectedIndex)
    setOpen((value) => !value)
  }

  return (
    <span ref={anchorRef} className="deditor-color-palette">
      <IconButton
        icon={props.icon}
        label={props.title}
        active={!!props.current}
        onMouseDown={(event) => event.preventDefault()}
        onClick={toggle}
      />
      <Popover open={open} onClose={close} anchor={anchorRef.current}>
        <div
          ref={listRef}
          className="deditor-color-palette-panel"
          role="listbox"
          aria-label={props.title}
          onKeyDown={onKeyDown}
        >
          <button
            type="button"
            role="option"
            aria-selected={!props.current}
            aria-label="Default color"
            tabIndex={focusedIndex === 0 ? 0 : -1}
            className="deditor-color-default"
            onFocus={() => setFocusedIndex(0)}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              props.onDefault()
              close()
            }}
          >
            Default
          </button>
          <div className="deditor-color-palette-grid">
            {props.colors.map((hex, index) => {
              const selected = props.current?.toLowerCase() === hex.toLowerCase()
              return (
                <button
                  key={hex}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  aria-label={`Color ${hex}`}
                  tabIndex={focusedIndex === index + 1 ? 0 : -1}
                  className="deditor-color-swatch"
                  style={{ background: hex }}
                  onFocus={() => setFocusedIndex(index + 1)}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    props.onPick(hex)
                    close()
                  }}
                >
                  {selected ? <IconCheck size={12} aria-hidden /> : null}
                </button>
              )
            })}
          </div>
        </div>
      </Popover>
    </span>
  )
}
