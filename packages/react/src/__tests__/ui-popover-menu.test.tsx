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
    <div className="deditor-root" data-theme="dark" style={{ overflow: 'hidden' }}>
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
    <div data-theme="dark">
      <div className="deditor-root" data-theme="light">
        <button type="button" ref={ref} aria-label="virtual anchor" onClick={() => setOpen(true)}>
          anchor
        </button>
        <Popover open={open} onClose={() => setOpen(false)} anchor={anchor}>
          <div role="dialog">virtual content</div>
        </Popover>
      </div>
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

function ThemedAnchorHarness(props: { label: string; theme: 'light' | 'dark' }) {
  const ref = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)

  return (
    <div className="deditor-root" data-theme={props.theme}>
      <button type="button" ref={ref} aria-label={props.label} onClick={() => setOpen(true)}>
        {props.label}
      </button>
      <Popover open={open} onClose={() => setOpen(false)} anchor={ref.current}>
        <div role="dialog">{props.label} content</div>
      </Popover>
    </div>
  )
}

afterEach(() => cleanup())

describe('Popover + Menu', () => {
  it('body-portals an element anchor outside its clipped root with the owning theme', async () => {
    const { getByLabelText, getByRole } = render(<AnchorHarness onSelect={() => {}} />)
    const root = getByLabelText('anchor').closest('.deditor-root')

    fireEvent.click(getByLabelText('anchor'))
    const menu = await waitFor(() => getByRole('menu'))
    const popover = menu.closest('.deditor-popover')

    expect(root?.contains(popover)).toBe(false)
    expect(popover?.classList.contains('deditor-portal-scope')).toBe(true)
    expect(popover?.getAttribute('data-theme')).toBe('dark')
    expect(popover?.closest('[data-floating-ui-portal]')?.parentElement).toBe(document.body)
  })

  it('body-portals a virtual anchor with explicit light isolated from a dark ancestor', async () => {
    const { getByLabelText, getByRole } = render(<VirtualAnchorHarness />)
    const root = getByLabelText('virtual anchor').closest('.deditor-root')

    fireEvent.click(getByLabelText('virtual anchor'))
    const dialog = await waitFor(() => getByRole('dialog'))
    const popover = dialog.closest('.deditor-popover')

    expect(root?.contains(popover)).toBe(false)
    expect(popover?.classList.contains('deditor-portal-scope')).toBe(true)
    expect(popover?.getAttribute('data-theme')).toBe('light')
  })

  it('body-portals a standalone anchor with the default unthemed scope', async () => {
    const { getByLabelText, getByRole } = render(<BareAnchorHarness />)

    fireEvent.click(getByLabelText('bare anchor'))
    const dialog = await waitFor(() => getByRole('dialog'))
    const popover = dialog.closest('.deditor-popover')

    expect(popover?.classList.contains('deditor-portal-scope')).toBe(true)
    expect(popover?.hasAttribute('data-theme')).toBe(false)
    expect(popover?.closest('[data-floating-ui-portal]')?.parentElement).toBe(document.body)
  })

  it('keeps simultaneous editor portals isolated to their owning themes', async () => {
    const { getByLabelText, getAllByRole } = render(
      <>
        <ThemedAnchorHarness label="light anchor" theme="light" />
        <ThemedAnchorHarness label="dark anchor" theme="dark" />
      </>,
    )

    fireEvent.click(getByLabelText('light anchor'))
    fireEvent.click(getByLabelText('dark anchor'))
    const dialogs = await waitFor(() => getAllByRole('dialog'))
    const themes = new Map(
      dialogs.map((dialog) => [
        dialog.textContent,
        dialog.closest('.deditor-popover')?.getAttribute('data-theme'),
      ]),
    )

    expect(themes).toEqual(new Map([
      ['light anchor content', 'light'],
      ['dark anchor content', 'dark'],
    ]))
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
