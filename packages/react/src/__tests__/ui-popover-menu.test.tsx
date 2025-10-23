/** @vitest-environment happy-dom */
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react'
import React, { useRef, useState } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Menu } from '../ui/Menu'
import { Popover } from '../ui/Popover'

function AnchorHarness(props: { onSelect: (id: string) => void }) {
  const ref = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  return (
    <div className="deditor-root">
      <button type="button" ref={ref} aria-label="anchor" onClick={() => setOpen(true)}>
        anchor
      </button>
      <Popover open={open} onClose={() => setOpen(false)} anchor={ref.current}>
        <Menu
          aria-label="actions"
          items={[
            { id: 'a', label: 'Alpha' },
            { id: 'b', label: 'Beta', checked: true },
          ]}
          onSelect={props.onSelect}
        />
      </Popover>
    </div>
  )
}

function VirtualAnchorHarness() {
  const ref = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  const anchor = ref.current
    ? {
        getBoundingClientRect: () => ref.current!.getBoundingClientRect(),
        contextElement: ref.current,
      }
    : null

  return (
    <div className="deditor-root">
      <button type="button" ref={ref} aria-label="virtual anchor" onClick={() => setOpen(true)}>
        anchor
      </button>
      <Popover open={open} onClose={() => setOpen(false)} anchor={anchor}>
        <div role="dialog">virtual content</div>
      </Popover>
    </div>
  )
}

function BareAnchorHarness() {
  const ref = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)

  return (
    <div>
      <button type="button" ref={ref} aria-label="bare anchor" onClick={() => setOpen(true)}>
        anchor
      </button>
      <Popover open={open} onClose={() => setOpen(false)} anchor={ref.current}>
        <div role="dialog">bare content</div>
      </Popover>
    </div>
  )
}

afterEach(() => cleanup())

describe('Popover + Menu', () => {
  it('keeps the portal inside the token-owning editor root', async () => {
    const { getByLabelText, getByRole } = render(<AnchorHarness onSelect={() => {}} />)
    const root = getByLabelText('anchor').closest('.deditor-root')

    fireEvent.click(getByLabelText('anchor'))
    const menu = await waitFor(() => getByRole('menu'))

    expect(root?.contains(menu)).toBe(true)
  })

  it('uses a virtual anchor context element to preserve the token scope', async () => {
    const { getByLabelText, getByRole } = render(<VirtualAnchorHarness />)
    const root = getByLabelText('virtual anchor').closest('.deditor-root')

    fireEvent.click(getByLabelText('virtual anchor'))
    const dialog = await waitFor(() => getByRole('dialog'))

    expect(root?.contains(dialog)).toBe(true)
  })

  it('falls back to the document body outside an editor root', async () => {
    const { getByLabelText, getByRole } = render(<BareAnchorHarness />)

    fireEvent.click(getByLabelText('bare anchor'))
    const dialog = await waitFor(() => getByRole('dialog'))

    expect(document.body.contains(dialog)).toBe(true)
  })

  it('opens from anchor, selects an item, closes on Escape', async () => {
    const onSelect = vi.fn()
    const { getByLabelText, getByRole } = render(<AnchorHarness onSelect={onSelect} />)
    fireEvent.click(getByLabelText('anchor'))
    await waitFor(() => getByRole('menu'))
    fireEvent.click(getByRole('menuitem', { name: 'Alpha' }))
    expect(onSelect).toHaveBeenCalledWith('a')
    fireEvent.keyDown(getByRole('menu'), { key: 'Escape' })
    await waitFor(() => expect(document.querySelector('[role=menu]')).toBeNull())
  })

  it('marks checked items', async () => {
    const { getByLabelText, getByRole } = render(<AnchorHarness onSelect={() => {}} />)
    fireEvent.click(getByLabelText('anchor'))
    await waitFor(() => getByRole('menu'))
    const beta = getByRole('menuitem', { name: 'Beta' })
    expect(beta.getAttribute('aria-checked')).toBe('true')
  })

  it('moves focus with arrow keys', async () => {
    const { getByLabelText, getByRole } = render(<AnchorHarness onSelect={() => {}} />)
    fireEvent.click(getByLabelText('anchor'))
    const menu = await waitFor(() => getByRole('menu'))
    const first = getByRole('menuitem', { name: 'Alpha' })
    fireEvent.keyDown(menu, { key: 'ArrowDown' })
    expect(document.activeElement).toBe(first)
    fireEvent.keyDown(menu, { key: 'ArrowDown' })
    expect(document.activeElement).toBe(getByRole('menuitem', { name: 'Beta' }))
  })
})
