import type { LucideIcon } from 'lucide-react'
import { useRef, type KeyboardEvent } from 'react'
import { IconCheck } from '../icons'

export interface MenuItem {
  id: string
  label: string
  icon?: LucideIcon
  checked?: boolean
  disabled?: boolean
  danger?: boolean
}

export function Menu(props: {
  items: MenuItem[]
  onSelect: (id: string) => void
  'aria-label'?: string
}) {
  const listRef = useRef<HTMLDivElement>(null)

  const focusItem = (index: number) => {
    const menu = listRef.current
    if (!menu) return
    const items = Array.from(menu.querySelectorAll<HTMLButtonElement>('[role=menuitem]:not(:disabled)'))
    if (items.length === 0) return
    const clamped = ((index % items.length) + items.length) % items.length
    items[clamped].focus()
  }

  const onKeyDown = (event: KeyboardEvent) => {
    const items = listRef.current
      ? Array.from(listRef.current.querySelectorAll<HTMLButtonElement>('[role=menuitem]:not(:disabled)'))
      : []
    const current = items.findIndex((item) => item === document.activeElement)
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      focusItem(current + 1)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      focusItem(current <= 0 ? items.length - 1 : current - 1)
    } else if (event.key === 'Home') {
      event.preventDefault()
      focusItem(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      focusItem(items.length - 1)
    }
  }

  return (
    <div
      ref={listRef}
      role="menu"
      aria-label={props['aria-label']}
      className="deditor-menu"
      onKeyDown={onKeyDown}
    >
      {props.items.map((item) => {
        const Icon = item.icon
        return (
          <button
            key={item.id}
            type="button"
            role="menuitem"
            aria-checked={item.checked === undefined ? undefined : item.checked}
            disabled={item.disabled}
            className={['deditor-menu-item', item.danger ? 'is-danger' : '']
              .filter(Boolean)
              .join(' ')}
            onClick={() => props.onSelect(item.id)}
          >
            {Icon ? <Icon size={16} strokeWidth={2} aria-hidden /> : null}
            <span className="deditor-menu-label">{item.label}</span>
            {item.checked ? <IconCheck size={14} aria-hidden className="deditor-menu-check" /> : null}
          </button>
        )
      })}
    </div>
  )
}
