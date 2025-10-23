/** @vitest-environment happy-dom */
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react'
import React from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ColorPalette } from '../chrome/ColorPalette'
import { IconTextColor } from '../icons'

afterEach(() => cleanup())

describe('ColorPalette', () => {
  it('marks the current color and moves roving focus through palette options', async () => {
    const onPick = vi.fn()
    const { getByRole } = render(
      <ColorPalette
        icon={IconTextColor}
        title="Text color"
        current="#FF0000"
        colors={['#ff0000', '#00ff00']}
        onDefault={() => {}}
        onPick={onPick}
      />,
    )

    fireEvent.click(getByRole('button', { name: 'Text color' }))
    const listbox = await waitFor(() => getByRole('listbox', { name: 'Text color' }))
    const defaultColor = getByRole('option', { name: 'Default color' })
    const red = getByRole('option', { name: 'Color #ff0000' })
    const green = getByRole('option', { name: 'Color #00ff00' })

    expect(red.getAttribute('aria-selected')).toBe('true')
    expect(red.querySelector('svg')).toBeTruthy()
    expect(defaultColor.getAttribute('aria-selected')).toBe('false')
    expect(defaultColor.tabIndex).toBe(-1)
    expect(red.tabIndex).toBe(0)

    red.focus()
    fireEvent.keyDown(listbox, { key: 'ArrowRight' })
    expect(document.activeElement).toBe(green)
    expect(green.tabIndex).toBe(0)
    fireEvent.keyDown(listbox, { key: 'Home' })
    expect(document.activeElement).toBe(defaultColor)
    fireEvent.keyDown(listbox, { key: 'End' })
    expect(document.activeElement).toBe(green)
    fireEvent.keyDown(listbox, { key: 'ArrowLeft' })
    expect(document.activeElement).toBe(red)

    fireEvent.click(green)
    expect(onPick).toHaveBeenCalledWith('#00ff00')
    await waitFor(() => expect(document.querySelector('[role=listbox]')).toBeNull())
  })
})
