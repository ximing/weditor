/** @vitest-environment happy-dom */
import { cleanup, render, waitFor } from '@testing-library/react'
import React from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { DocEditor } from '../DocEditor'

afterEach(() => cleanup())
afterEach(() => vi.unstubAllGlobals())

describe('DocEditor theme', () => {
  it('defaults to data-theme resolved from auto (light in happy-dom)', async () => {
    const { container } = render(<DocEditor />)
    await waitFor(() => expect(container.querySelector('.deditor-root')).toBeTruthy())
    expect(container.querySelector('.deditor-root')!.getAttribute('data-theme')).toBe('light')
  })

  it('applies explicit dark theme', async () => {
    const { container } = render(<DocEditor theme="dark" />)
    await waitFor(() => expect(container.querySelector('.deditor-root')).toBeTruthy())
    expect(container.querySelector('.deditor-root')!.getAttribute('data-theme')).toBe('dark')
  })

  it('resolves the current system preference when switching from explicit to auto', async () => {
    const mediaQuery = {
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }
    vi.stubGlobal('matchMedia', vi.fn(() => mediaQuery))
    const { container, rerender } = render(<DocEditor theme="dark" />)
    await waitFor(() => expect(container.querySelector('.deditor-root')).toBeTruthy())

    mediaQuery.matches = true
    rerender(<DocEditor theme="auto" />)
    await waitFor(() =>
      expect(container.querySelector('.deditor-root')!.getAttribute('data-theme')).toBe('dark'),
    )
  })
})
