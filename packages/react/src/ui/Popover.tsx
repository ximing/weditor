import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingPortal,
  offset,
  shift,
  useDismiss,
  useFloating,
  useInteractions,
  type Placement,
  type ReferenceElement,
} from '@floating-ui/react'
import { useEffect, type ReactNode } from 'react'

export type PopoverAnchor =
  | Element
  | { getBoundingClientRect: () => DOMRect; contextElement?: Element }
  | null

export function Popover(props: {
  open: boolean
  onClose: () => void
  anchor: PopoverAnchor
  placement?: Placement
  className?: string
  children: ReactNode
}) {
  const { refs, floatingStyles, context } = useFloating({
    open: props.open,
    onOpenChange: (open) => {
      if (!open) props.onClose()
    },
    placement: props.placement ?? 'bottom-start',
    middleware: [offset(6), flip({ padding: 8 }), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  })
  useEffect(() => {
    if (props.anchor) refs.setReference(props.anchor as ReferenceElement)
  }, [props.anchor, refs])
  const dismiss = useDismiss(context)
  const { getFloatingProps } = useInteractions([dismiss])

  if (!props.open || !props.anchor) return null

  const contextElement =
    props.anchor instanceof Element ? props.anchor : props.anchor.contextElement
  const portalRoot = contextElement?.closest<HTMLElement>('.deditor-root') ?? undefined

  return (
    <FloatingPortal root={portalRoot}>
      <FloatingFocusManager context={context} modal={false} initialFocus={-1}>
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          className={['deditor-popover', props.className].filter(Boolean).join(' ')}
          {...getFloatingProps()}
        >
          {props.children}
        </div>
      </FloatingFocusManager>
    </FloatingPortal>
  )
}
