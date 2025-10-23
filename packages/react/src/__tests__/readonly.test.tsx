/** @vitest-environment happy-dom */
import { docsPreset } from '@deditor/preset-docs'
import { cleanup, fireEvent, render, waitFor, within } from '@testing-library/react'
import { TextSelection } from 'prosemirror-state'
import React, { useEffect, useState } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Bubble } from '../chrome/Bubble'
import { Toolbar } from '../chrome/Toolbar'
import { toast } from '../chrome/toast'
import { DocEditor } from '../DocEditor'
import { EditorProvider } from '../EditorProvider'
import { EditorSurface } from '../EditorSurface'
import { useEditor } from '../useEditor'

afterEach(() => {
  cleanup()
  document.querySelectorAll('.deditor-toast').forEach((el) => el.remove())
})

describe('read-only and chrome', () => {
  it('hides toolbar and composer when readOnly', async () => {
    const { queryByRole, queryByPlaceholderText } = render(
      <DocEditor readOnly defaultContent={{ type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Hi' }] }] }} />,
    )
    await waitFor(() => document.querySelector('.ProseMirror'))
    expect(queryByRole('toolbar')).toBeNull()
    expect(queryByPlaceholderText('Start typing…')).toBeNull()
  })

  it('keeps extras inside the More menu', async () => {
    const { getByLabelText, getByRole } = render(
      <EditorProvider extensions={docsPreset()}>
        <Toolbar />
        <EditorSurface />
      </EditorProvider>,
    )
    await waitFor(() => getByLabelText('Print'))
    fireEvent.click(getByLabelText('More'))
    const menu = await waitFor(() => getByRole('menu', { name: 'More' }))
    for (const name of ['Inline code', 'Superscript', 'Subscript', 'Horizontal rule', 'Mention']) {
      expect(within(menu).getByRole('menuitem', { name })).toBeTruthy()
    }
    expect(getByLabelText('Line height')).toBeTruthy()
    if (typeof window.print === 'function') {
      const print = vi.spyOn(window, 'print').mockImplementation(() => {})
      fireEvent.click(getByLabelText('Print'))
      expect(print).toHaveBeenCalled()
      print.mockRestore()
    } else {
      const print = vi.fn()
      vi.stubGlobal('print', print)
      fireEvent.click(getByLabelText('Print'))
      expect(print).toHaveBeenCalled()
      vi.unstubAllGlobals()
    }
  })

  it('shows bubble on a non-empty selection', async () => {
    function Select() {
      const editor = useEditor()
      useEffect(() => {
        editor.dispatch(editor.state.tr.setSelection(TextSelection.create(editor.state.doc, 1, 3)))
      }, [editor])
      return null
    }
    const { container } = render(
      <EditorProvider
        extensions={docsPreset()}
        defaultContent={{ type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Hi' }] }] }}
      >
        <Select />
        <Bubble />
        <EditorSurface />
      </EditorProvider>,
    )
    await waitFor(() => expect(container.querySelector('.deditor-bubble')).toBeTruthy())
    expect(container.querySelector('.deditor-bubble button[aria-label="Bold"]')).toBeTruthy()
    expect(container.querySelector('.deditor-bubble button[aria-label="Italic"]')).toBeTruthy()
    expect(container.querySelector('.deditor-bubble button[aria-label="Underline"]')).toBeTruthy()
    expect(container.querySelector('.deditor-bubble button[aria-label="Comment"]')).toBeTruthy()
    expect(container.querySelector('.deditor-bubble button[aria-label="Link"]')).toBeTruthy()
  })

  it('toasts Upload failed when uploadImage rejects and does not insert an image', async () => {
    const uploadImage = vi.fn().mockRejectedValue(new Error('nope'))
    function Inspector() {
      const editor = useEditor()
      const [, bump] = useState(0)
      useEffect(() => editor.on('transaction', () => bump((n) => n + 1)), [editor])
      return <div data-testid="json">{JSON.stringify(editor.getJSON())}</div>
    }
    const { getByLabelText, getByTestId } = render(
      <EditorProvider extensions={docsPreset()}>
        <Toolbar uploadImage={uploadImage} />
        <EditorSurface />
        <Inspector />
      </EditorProvider>,
    )
    fireEvent.click(await waitFor(() => getByLabelText('Image')))
    const input = await waitFor(() => document.querySelector('input[type="file"]')) as HTMLInputElement
    const file = new File([new Uint8Array(8)], 'a.png', { type: 'image/png' })
    fireEvent.change(input, { target: { files: [file] } })
    await waitFor(() => expect(document.querySelector('.deditor-toast')?.textContent).toBe('Upload failed'))
    expect(getByTestId('json').textContent).not.toContain('"type":"image"')
  })

  it('inserts an image after uploadImage resolves', async () => {
    const uploadImage = vi.fn().mockResolvedValue({ src: 'https://cdn.example/a.png', alt: 'cat' })
    function Inspector() {
      const editor = useEditor()
      const [, bump] = useState(0)
      useEffect(() => editor.on('transaction', () => bump((n) => n + 1)), [editor])
      return <div data-testid="json">{JSON.stringify(editor.getJSON())}</div>
    }
    const { getByLabelText, getByTestId } = render(
      <EditorProvider extensions={docsPreset()}>
        <Toolbar uploadImage={uploadImage} />
        <EditorSurface />
        <Inspector />
      </EditorProvider>,
    )
    fireEvent.click(await waitFor(() => getByLabelText('Image')))
    const input = await waitFor(() => document.querySelector('input[type="file"]')) as HTMLInputElement
    const file = new File([new Uint8Array(8)], 'a.png', { type: 'image/png' })
    fireEvent.change(input, { target: { files: [file] } })
    await waitFor(() => expect(getByTestId('json').textContent).toContain('https://cdn.example/a.png'))
    expect(document.querySelector('.deditor-toast')).toBeNull()
  })

  it('does not insert from a file path when uploadImage is omitted', async () => {
    function Inspector() {
      const editor = useEditor()
      const [, bump] = useState(0)
      useEffect(() => editor.on('transaction', () => bump((n) => n + 1)), [editor])
      return <div data-testid="json">{JSON.stringify(editor.getJSON())}</div>
    }
    const { getByLabelText, getByRole, getByTestId, queryByRole } = render(
      <EditorProvider extensions={docsPreset()}>
        <Toolbar />
        <EditorSurface />
        <Inspector />
      </EditorProvider>,
    )
    fireEvent.click(await waitFor(() => getByLabelText('Image')))
    expect(getByRole('textbox', { name: 'Image URL' })).toBeTruthy()
    expect(queryByRole('tab', { name: 'Upload' })).toBeNull()
    expect(queryByRole('button', { name: 'Upload image' })).toBeNull()
    expect(document.querySelector('input[type="file"]')).toBeNull()
    expect(getByTestId('json').textContent).not.toContain('"type":"image"')
  })

  it('toast inserts a .deditor-toast for 2s', () => {
    vi.useFakeTimers()
    toast('Upload failed')
    expect(document.querySelector('.deditor-toast')?.textContent).toBe('Upload failed')
    vi.advanceTimersByTime(2000)
    expect(document.querySelector('.deditor-toast')).toBeNull()
    vi.useRealTimers()
  })
})
