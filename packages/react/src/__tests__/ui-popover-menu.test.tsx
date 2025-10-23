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
    <>
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
    </>
  )
}

afterEach(() => cleanup())

describe('Popover + Menu', () => {
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
