/** @vitest-environment happy-dom */
import { docsPreset } from '@deditor/preset-docs'
import { cleanup, fireEvent, render, waitFor, within } from '@testing-library/react'
import React, { useEffect, useState } from 'react'
import { afterEach, describe, expect, it } from 'vitest'
import { ImageInsert } from '../chrome/ImageInsert'
import { DocEditor } from '../DocEditor'
import { EditorProvider } from '../EditorProvider'
import { EditorSurface } from '../EditorSurface'
import { useEditor } from '../useEditor'

function Inspector() {
  const editor = useEditor()
  const [, setTick] = useState(0)
  useEffect(() => editor.on('transaction', () => setTick((value) => value + 1)), [editor])
  return <div data-testid="json">{JSON.stringify(editor.getJSON())}</div>
}

function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (reason?: unknown) => void
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise
    reject = rejectPromise
  })
  return { promise, resolve, reject }
}

async function imageFileInput() {
  return await waitFor(() => document.querySelector('input[type="file"]')) as HTMLInputElement
}

afterEach(() => {
  cleanup()
  document.querySelectorAll('.deditor-toast').forEach((element) => element.remove())
})

describe('ImageInsert', () => {
  it('inserts an image from a URL', async () => {
    const { getByLabelText, getByRole, getByTestId } = render(
      <EditorProvider extensions={docsPreset()}>
        <ImageInsert />
        <EditorSurface />
        <Inspector />
      </EditorProvider>,
    )
    await waitFor(() => getByLabelText('Image'))
    fireEvent.click(getByLabelText('Image'))
    const input = await waitFor(() => getByLabelText('Image URL'))
    fireEvent.change(input, { target: { value: 'https://img.example/x.png' } })
    fireEvent.click(getByRole('button', { name: 'Insert' }))
    await waitFor(() => expect(getByTestId('json').textContent).toContain('img.example'))
  })

  it('shows the upload tab by default only when uploadImage is provided', async () => {
    const upload = async (file: File) => ({ src: 'data:x', alt: file.name })
    const { getByLabelText, getByRole } = render(
      <EditorProvider extensions={docsPreset()}>
        <ImageInsert uploadImage={upload} />
        <EditorSurface />
      </EditorProvider>,
    )
    await waitFor(() => getByLabelText('Image'))
    fireEvent.click(getByLabelText('Image'))
    await waitFor(() => getByRole('button', { name: 'Upload image' }))
    expect(getByRole('tablist')).toBeTruthy()
    expect(getByRole('tab', { name: 'Upload' }).getAttribute('aria-selected')).toBe('true')
    expect(document.querySelector('[role="tabpanel"] input[aria-label="Image URL"]')).toBeTruthy()
  })

  it('uses roving tab focus and keeps matching tabpanels mounted', async () => {
    const upload = async () => ({ src: 'data:x' })
    const { getByLabelText, getByRole } = render(
      <EditorProvider extensions={docsPreset()}>
        <ImageInsert uploadImage={upload} />
        <EditorSurface />
      </EditorProvider>,
    )
    await waitFor(() => getByLabelText('Image'))
    fireEvent.click(getByLabelText('Image'))
    await waitFor(() => getByRole('button', { name: 'Upload image' }))
    const uploadTab = getByRole('tab', { name: 'Upload' })
    const urlTab = getByRole('tab', { name: 'URL' })
    const uploadPanel = document.getElementById(uploadTab.getAttribute('aria-controls') ?? '')
    const urlPanel = document.getElementById(urlTab.getAttribute('aria-controls') ?? '')

    expect(uploadTab.tabIndex).toBe(0)
    expect(urlTab.tabIndex).toBe(-1)
    expect(uploadPanel?.getAttribute('role')).toBe('tabpanel')
    expect(urlPanel?.getAttribute('role')).toBe('tabpanel')
    expect(urlPanel?.hidden).toBe(true)

    fireEvent.keyDown(uploadTab, { key: 'ArrowRight' })
    await waitFor(() => expect(urlTab.getAttribute('aria-selected')).toBe('true'))
    expect(document.activeElement).toBe(urlTab)
    expect(uploadTab.tabIndex).toBe(-1)
    expect(urlTab.tabIndex).toBe(0)
    expect(uploadPanel?.hidden).toBe(true)
    expect(urlPanel?.hidden).toBe(false)

    fireEvent.keyDown(urlTab, { key: 'Home' })
    await waitFor(() => expect(uploadTab.getAttribute('aria-selected')).toBe('true'))
    fireEvent.keyDown(uploadTab, { key: 'End' })
    await waitFor(() => expect(urlTab.getAttribute('aria-selected')).toBe('true'))
    fireEvent.keyDown(urlTab, { key: 'ArrowLeft' })
    await waitFor(() => expect(uploadTab.getAttribute('aria-selected')).toBe('true'))
    expect(document.activeElement).toBe(uploadTab)
  })

  it('resets the selected tab and URL when the trigger closes the popover', async () => {
    const upload = async () => ({ src: 'data:x' })
    const { getByLabelText, getByRole } = render(
      <EditorProvider extensions={docsPreset()}>
        <ImageInsert uploadImage={upload} />
        <EditorSurface />
      </EditorProvider>,
    )
    await waitFor(() => getByLabelText('Image'))
    fireEvent.click(getByLabelText('Image'))
    fireEvent.click(getByRole('tab', { name: 'URL' }))
    const url = await waitFor(() => getByLabelText('Image URL'))
    fireEvent.change(url, { target: { value: 'https://img.example/old.png' } })
    fireEvent.click(getByLabelText('Image'))
    fireEvent.click(getByLabelText('Image'))
    await waitFor(() => expect(getByRole('tab', { name: 'Upload' }).getAttribute('aria-selected')).toBe('true'))
    const urlPanel = document.getElementById(getByRole('tab', { name: 'URL' }).getAttribute('aria-controls') ?? '')
    expect((urlPanel?.querySelector('input') as HTMLInputElement).value).toBe('')
  })

  it('inserts the uploaded image details', async () => {
    const upload = async () => ({ src: 'https://cdn.example/a.png', alt: 'A cat', width: 320 })
    const { getByLabelText, getByTestId } = render(
      <EditorProvider extensions={docsPreset()}>
        <ImageInsert uploadImage={upload} />
        <EditorSurface />
        <Inspector />
      </EditorProvider>,
    )
    await waitFor(() => getByLabelText('Image'))
    fireEvent.click(getByLabelText('Image'))
    const input = await imageFileInput()
    const file = new File([new Uint8Array(8)], 'a.png', { type: 'image/png' })
    fireEvent.change(input, { target: { files: [file] } })
    await waitFor(() => expect(getByTestId('json').textContent).toContain('cdn.example'))
    expect(getByTestId('json').textContent).toContain('A cat')
    expect(getByTestId('json').textContent).toContain('320')
  })

  it('trims URL whitespace before inserting', async () => {
    const { getByLabelText, getByRole, getByTestId } = render(
      <EditorProvider extensions={docsPreset()}>
        <ImageInsert />
        <EditorSurface />
        <Inspector />
      </EditorProvider>,
    )
    await waitFor(() => getByLabelText('Image'))
    fireEvent.click(getByLabelText('Image'))
    fireEvent.change(await waitFor(() => getByLabelText('Image URL')), {
      target: { value: '  https://img.example/trim.png  ' },
    })
    fireEvent.click(getByRole('button', { name: 'Insert' }))
    await waitFor(() => expect(getByTestId('json').textContent).toContain('https://img.example/trim.png'))
    expect(getByTestId('json').textContent).not.toContain('  https://img.example/trim.png  ')
  })

  it('shows the upload failure toast', async () => {
    const upload = async () => { throw new Error('network') }
    const { getByLabelText } = render(
      <EditorProvider extensions={docsPreset()}>
        <ImageInsert uploadImage={upload} />
        <EditorSurface />
      </EditorProvider>,
    )
    await waitFor(() => getByLabelText('Image'))
    fireEvent.click(getByLabelText('Image'))
    fireEvent.change(await imageFileInput(), {
      target: { files: [new File(['x'], 'failed.png', { type: 'image/png' })] },
    })
    await waitFor(() => expect(document.querySelector('.deditor-toast')?.textContent).toBe('Upload failed'))
  })

  it('keeps upload failure toasts inside their owning editor roots', async () => {
    const fail = async () => { throw new Error('network') }
    const { container } = render(
      <>
        <DocEditor className="editor-one" theme="dark" uploadImage={fail} />
        <DocEditor className="editor-two" theme="light" uploadImage={fail} />
      </>,
    )
    await waitFor(() => expect(container.querySelector('.editor-one')).toBeTruthy())
    await waitFor(() => expect(container.querySelector('.editor-two')).toBeTruthy())
    const one = container.querySelector<HTMLElement>('.editor-one')!
    const two = container.querySelector<HTMLElement>('.editor-two')!

    fireEvent.click(within(one).getByLabelText('Image'))
    fireEvent.change(await imageFileInput(), {
      target: { files: [new File(['x'], 'one.png', { type: 'image/png' })] },
    })
    await waitFor(() => expect(one.querySelector('.deditor-toast')).toBeTruthy())
    const firstToast = one.querySelector<HTMLElement>('.deditor-toast')!
    expect(firstToast.textContent).toBe('Upload failed')
    expect(firstToast.parentElement).toBe(one)
    expect(two.querySelector('.deditor-toast')).toBeNull()

    fireEvent.click(within(one).getByLabelText('Image'))
    await waitFor(() => expect(document.querySelector('input[type="file"]')).toBeNull())
    fireEvent.click(within(two).getByLabelText('Image'))
    fireEvent.change(await imageFileInput(), {
      target: { files: [new File(['x'], 'two.png', { type: 'image/png' })] },
    })
    await waitFor(() => expect(two.querySelector('.deditor-toast')).toBeTruthy())
    const secondToast = two.querySelector<HTMLElement>('.deditor-toast')!
    expect(secondToast.textContent).toBe('Upload failed')
    expect(secondToast.parentElement).toBe(two)
    expect(one.querySelector('.deditor-toast')).toBe(firstToast)
  })

  it('ignores an upload that resolves after the popover closes', async () => {
    const pending = deferred<{ src: string }>()
    const upload = () => pending.promise
    const { getByLabelText, getByTestId } = render(
      <EditorProvider extensions={docsPreset()}>
        <ImageInsert uploadImage={upload} />
        <EditorSurface />
        <Inspector />
      </EditorProvider>,
    )
    await waitFor(() => getByLabelText('Image'))
    fireEvent.click(getByLabelText('Image'))
    fireEvent.change(await imageFileInput(), {
      target: { files: [new File(['x'], 'pending.png', { type: 'image/png' })] },
    })
    fireEvent.click(getByLabelText('Image'))
    pending.resolve({ src: 'https://img.example/stale.png' })
    await pending.promise
    await Promise.resolve()
    await Promise.resolve()
    expect(getByTestId('json').textContent).not.toContain('stale.png')
  })

  it('ignores an upload rejection after unmount', async () => {
    const pending = deferred<{ src: string }>()
    const upload = () => pending.promise
    const { getByLabelText, unmount } = render(
      <EditorProvider extensions={docsPreset()}>
        <ImageInsert uploadImage={upload} />
        <EditorSurface />
      </EditorProvider>,
    )
    await waitFor(() => getByLabelText('Image'))
    fireEvent.click(getByLabelText('Image'))
    fireEvent.change(await imageFileInput(), {
      target: { files: [new File(['x'], 'pending.png', { type: 'image/png' })] },
    })
    unmount()
    pending.reject(new Error('network'))
    await pending.promise.catch(() => undefined)
    await Promise.resolve()
    expect(document.querySelector('.deditor-toast')).toBeNull()
  })

  it('keeps only the latest concurrent upload result', async () => {
    const first = deferred<{ src: string }>()
    const second = deferred<{ src: string }>()
    const upload = (file: File) => file.name === 'first.png' ? first.promise : second.promise
    const { getByLabelText, getByTestId } = render(
      <EditorProvider extensions={docsPreset()}>
        <ImageInsert uploadImage={upload} />
        <EditorSurface />
        <Inspector />
      </EditorProvider>,
    )
    await waitFor(() => getByLabelText('Image'))
    fireEvent.click(getByLabelText('Image'))
    const input = await imageFileInput()
    fireEvent.change(input, { target: { files: [new File(['x'], 'first.png', { type: 'image/png' })] } })
    fireEvent.change(input, { target: { files: [new File(['x'], 'second.png', { type: 'image/png' })] } })
    first.reject(new Error('stale'))
    second.resolve({ src: 'https://img.example/current.png' })
    await waitFor(() => expect(getByTestId('json').textContent).toContain('current.png'))
    expect(getByTestId('json').textContent).not.toContain('first.png')
    expect(document.querySelector('.deditor-toast')).toBeNull()
  })
})
