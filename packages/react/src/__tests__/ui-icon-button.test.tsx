/** @vitest-environment happy-dom */
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react'
import React from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { IconBold } from '../icons'
import { IconButton } from '../ui/IconButton'

afterEach(() => cleanup())

describe('IconButton', () => {
  it('renders an accessible button and fires mousedown', () => {
    const onMouseDown = vi.fn()
    const { getByLabelText } = render(
      <IconButton icon={IconBold} label="Bold" onMouseDown={onMouseDown} />,
    )
    const btn = getByLabelText('Bold')
    expect(btn.getAttribute('aria-pressed')).toBeNull()
    fireEvent.mouseDown(btn)
    expect(onMouseDown).toHaveBeenCalledOnce()
  })

  it('reflects active state via aria-pressed and is-active class', () => {
    const { getByLabelText } = render(<IconButton icon={IconBold} label="Bold" active />)
    const btn = getByLabelText('Bold')
    expect(btn.getAttribute('aria-pressed')).toBe('true')
    expect(btn.className).toContain('is-active')
  })

  it('shows a tooltip with the label after hover', async () => {
    const { getByLabelText } = render(<IconButton icon={IconBold} label="Bold" />)
    fireEvent.mouseOver(getByLabelText('Bold'))
    await waitFor(() => expect(document.querySelector('.deditor-tooltip')).toBeTruthy(), {
      timeout: 1500,
    })
    expect(document.querySelector('.deditor-tooltip')!.textContent).toBe('Bold')
  })
})
