import type { LucideIcon } from 'lucide-react'
import type { MouseEventHandler } from 'react'
import { Tooltip } from './Tooltip'

export function IconButton(props: {
  icon: LucideIcon
  label: string
  active?: boolean
  disabled?: boolean
  onMouseDown?: MouseEventHandler<HTMLButtonElement>
  onClick?: MouseEventHandler<HTMLButtonElement>
}) {
  const Icon = props.icon
  return (
    <Tooltip label={props.label}>
      <button
        type="button"
        className={['deditor-icon-btn', props.active ? 'is-active' : '']
          .filter(Boolean)
          .join(' ')}
        aria-label={props.label}
        aria-pressed={props.active === undefined ? undefined : props.active}
        disabled={props.disabled}
        onMouseDown={props.onMouseDown}
        onClick={props.onClick}
      >
        <Icon size={16} strokeWidth={2} aria-hidden />
      </button>
    </Tooltip>
  )
}
