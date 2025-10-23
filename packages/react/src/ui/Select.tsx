import { useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { IconCheck, IconChevronDown } from '../icons'
import { Popover } from './Popover'

export interface SelectOption {
  value: string
  label: ReactNode
}

export function Select(props: {
  label: string
  value: string
  options: readonly SelectOption[]
  onChange: (value: string) => void
  width?: number
}) {
  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLSpanElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const current = props.options.find((o) => o.value === props.value)

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
    e.preventDefault()
    const el = listRef.current
    if (!el) return
    const items = Array.from(el.querySelectorAll<HTMLButtonElement>('[role=option]'))
    if (items.length === 0) return
    const currentIndex = items.findIndex((n) => n === document.activeElement)
    const next =
      e.key === 'ArrowDown'
        ? (currentIndex + 1) % items.length
        : currentIndex <= 0
          ? items.length - 1
          : currentIndex - 1
    items[next].focus()
  }

  return (
    <span
      className="deditor-select"
      ref={anchorRef}
      style={props.width ? { width: props.width } : undefined}
    >
      <button
        type="button"
        className="deditor-select-trigger"
        aria-label={props.label}
        aria-haspopup="listbox"
        aria-expanded={open}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="deditor-select-value">{current ? current.label : props.value}</span>
        <IconChevronDown size={14} aria-hidden />
      </button>
      <Popover open={open} onClose={() => setOpen(false)} anchor={anchorRef.current}>
        <div
          ref={listRef}
          role="listbox"
          aria-label={props.label}
          className="deditor-select-list"
          onKeyDown={onKeyDown}
        >
          {props.options.map((o) => (
            <button
              key={o.value}
              type="button"
              role="option"
              aria-selected={o.value === props.value}
              className="deditor-select-option"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                props.onChange(o.value)
                setOpen(false)
              }}
            >
              <span className="deditor-select-option-label">{o.label}</span>
              {o.value === props.value ? <IconCheck size={14} aria-hidden /> : null}
            </button>
          ))}
        </div>
      </Popover>
    </span>
  )
}
