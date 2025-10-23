/** @vitest-environment happy-dom */
import type { CollabProvider } from '@deditor/core'
import { cleanup, render, waitFor } from '@testing-library/react'
import React from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { DocEditor } from '../DocEditor'

afterEach(() => cleanup())
afterEach(() => vi.unstubAllGlobals())

describe('DocEditor theme', () => {
  it('keeps loading and bootstrap errors inside the themed consumer root', async () => {
    let rejectConnect!: (reason?: unknown) => void
    const connect = new Promise<void>((_resolve, reject) => {
      rejectConnect = reject
    })
    const collab = {
      clientID: 'failing-provider',
      connect: () => connect,
    } as CollabProvider
    const { container } = render(
      <DocEditor collab={collab} theme="dark" className="consumer-editor" />,
    )

    const loading = container.querySelector('.deditor-loading')
    expect(loading?.closest('.deditor-root.consumer-editor[data-theme="dark"]')).toBeTruthy()

    rejectConnect(new Error('Connection failed'))
    const error = await waitFor(() => {
      const element = container.querySelector<HTMLElement>('.deditor-error')
      expect(element).toBeTruthy()
      return element!
    })
    expect(error?.textContent).toBe('Connection failed')
    expect(error?.closest('.deditor-root.consumer-editor[data-theme="dark"]')).toBeTruthy()
  })

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
