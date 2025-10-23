/** @vitest-environment happy-dom */
import { docsPreset } from '@deditor/preset-docs'
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react'
import React, { useEffect, useState } from 'react'
import { afterEach, describe, expect, it } from 'vitest'
import { ImageInsert } from '../chrome/ImageInsert'
import { EditorProvider } from '../EditorProvider'
import { EditorSurface } from '../EditorSurface'
import { useEditor } from '../useEditor'

function Inspector() {
  const editor = useEditor()
  const [, setTick] = useState(0)
  useEffect(() => editor.on('transaction', () => setTick((value) => value + 1)), [editor])
  return <div data-testid="json">{JSON.stringify(editor.getJSON())}</div>
}

afterEach(() => cleanup())

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
    const { getByLabelText, getByRole, queryByLabelText } = render(
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
    expect(queryByLabelText('Image URL')).toBeNull()
  })

  it('switches from the upload tab to the URL form', async () => {
    const upload = async () => ({ src: 'data:x' })
    const { getByLabelText, getByRole, queryByRole } = render(
      <EditorProvider extensions={docsPreset()}>
        <ImageInsert uploadImage={upload} />
        <EditorSurface />
      </EditorProvider>,
    )
    await waitFor(() => getByLabelText('Image'))
    fireEvent.click(getByLabelText('Image'))
    await waitFor(() => getByRole('button', { name: 'Upload image' }))
    fireEvent.click(getByRole('tab', { name: 'URL' }))
    await waitFor(() => getByLabelText('Image URL'))
    expect(getByRole('tab', { name: 'URL' }).getAttribute('aria-selected')).toBe('true')
    expect(queryByRole('button', { name: 'Upload image' })).toBeNull()
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
    const input = await waitFor(() => document.querySelector('input[type="file"]')) as HTMLInputElement
    const file = new File([new Uint8Array(8)], 'a.png', { type: 'image/png' })
    fireEvent.change(input, { target: { files: [file] } })
    await waitFor(() => expect(getByTestId('json').textContent).toContain('cdn.example'))
    expect(getByTestId('json').textContent).toContain('A cat')
    expect(getByTestId('json').textContent).toContain('320')
  })
})
