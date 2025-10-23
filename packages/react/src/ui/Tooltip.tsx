import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  shift,
  useDismiss,
  useFloating,
  useHover,
  useInteractions,
} from '@floating-ui/react'
import { cloneElement, useEffect, useRef, useState, type ReactElement } from 'react'

export function Tooltip(props: { label: string; children: ReactElement }) {
  const [open, setOpen] = useState(false)
  const hoverTimeout = useRef<number>()
  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: 'bottom',
    middleware: [offset(6), flip(), shift({ padding: 4 })],
    whileElementsMounted: autoUpdate,
  })
  const hover = useHover(context, { delay: { open: 300, close: 0 } })
  const dismiss = useDismiss(context)
  const { getReferenceProps, getFloatingProps } = useInteractions([hover, dismiss])
  const referenceProps = getReferenceProps()

  useEffect(() => () => window.clearTimeout(hoverTimeout.current), [])

  return (
    <>
      {cloneElement(props.children, {
        ref: refs.setReference,
        ...referenceProps,
        onMouseOver: () => {
          window.clearTimeout(hoverTimeout.current)
          hoverTimeout.current = window.setTimeout(() => setOpen(true), 300)
        },
        onMouseOut: () => {
          window.clearTimeout(hoverTimeout.current)
        },
      } as Record<string, unknown>)}
      {open ? (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            className="deditor-tooltip"
            role="tooltip"
            {...getFloatingProps()}
          >
            {props.label}
          </div>
        </FloatingPortal>
      ) : null}
    </>
  )
}
