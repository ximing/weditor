/** @vitest-environment happy-dom */
import { Editor, type CollabProvider } from '@deditor/core'
import { act, cleanup, render, waitFor } from '@testing-library/react'
import React from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { DocEditor } from '../DocEditor'

afterEach(() => cleanup())
afterEach(() => vi.unstubAllGlobals())
afterEach(() => vi.restoreAllMocks())

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

  it('preserves edited content and editor DOM identity across light-dark-light rerenders', async () => {
    const create = vi.spyOn(Editor, 'create')
    const initialContent = {
      type: 'doc',
      content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Original' }] }],
    }
    const { container, rerender } = render(
      <DocEditor theme="light" defaultContent={initialContent} />,
    )
    const proseMirror = await waitFor(() => {
      const element = container.querySelector<HTMLElement>('.ProseMirror')
      expect(element).toBeTruthy()
      return element!
    })
    const editor = create.mock.results[0]?.value
    expect(editor).toBeInstanceOf(Editor)
    const view = editor.view

    act(() => editor.dispatch(editor.state.tr.insertText('Edited ', 1)))
    expect(proseMirror.textContent).toBe('Edited Original')

    rerender(<DocEditor theme="dark" defaultContent={initialContent} />)
    await waitFor(() => {
      expect(container.querySelector('.deditor-root')?.getAttribute('data-theme')).toBe('dark')
      expect(container.querySelector('.ProseMirror')?.textContent).toBe('Edited Original')
    })
    expect(create).toHaveBeenCalledTimes(1)
    expect(container.querySelector('.ProseMirror')).toBe(proseMirror)
    expect(editor.view).toBe(view)

    rerender(<DocEditor theme="light" defaultContent={initialContent} />)
    await waitFor(() => {
      expect(container.querySelector('.deditor-root')?.getAttribute('data-theme')).toBe('light')
      expect(container.querySelector('.ProseMirror')?.textContent).toBe('Edited Original')
    })
    expect(create).toHaveBeenCalledTimes(1)
    expect(container.querySelector('.ProseMirror')).toBe(proseMirror)
    expect(editor.view).toBe(view)
  })

  it('uses the latest onChange callback without recreating the editor', async () => {
    const create = vi.spyOn(Editor, 'create')
    const firstChange = vi.fn()
    const latestChange = vi.fn()
    const initialContent = {
      type: 'doc',
      content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Original' }] }],
    }
    const { rerender } = render(
      <DocEditor theme="light" defaultContent={initialContent} onChange={firstChange} />,
    )
    await waitFor(() => expect(create).toHaveBeenCalledTimes(1))
    const editor = create.mock.results[0]?.value

    rerender(
      <DocEditor theme="dark" defaultContent={initialContent} onChange={latestChange} />,
    )
    act(() => editor.dispatch(editor.state.tr.insertText('Edited ', 1)))

    expect(create).toHaveBeenCalledTimes(1)
    expect(firstChange).not.toHaveBeenCalled()
    expect(latestChange).toHaveBeenCalledOnce()
    expect(latestChange.mock.calls[0]?.[0]).toEqual(editor.getJSON())
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
