/** @vitest-environment happy-dom */
import { docsPreset } from '@deditor/preset-docs'
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react'
import React from 'react'
import { afterEach, describe, expect, it } from 'vitest'
import { EditorProvider } from '../EditorProvider'
import { EditorSurface } from '../EditorSurface'
import { FindBar } from '../chrome/FindBar'
import { TableBubble } from '../chrome/TableBubble'
import { Toolbar } from '../chrome/Toolbar'
import { useEditor } from '../useEditor'

function Harness() {
  return (
    <EditorProvider extensions={docsPreset()}>
      <Toolbar />
      <FindBar />
      <TableBubble />
      <EditorSurface />
      <Inspector />
    </EditorProvider>
  )
}

function Inspector() {
  const editor = useEditor()
  return <div data-testid="json">{JSON.stringify(editor.getJSON())}</div>
}

afterEach(() => cleanup())

describe('Toolbar', () => {
  it('icon buttons dispatch commands and selects set block/font/size', async () => {
    const { getByLabelText, getByRole, getByTestId, getByTitle } = render(<Harness />)
    await waitFor(() => getByLabelText('Bold'))
    expect(getByLabelText('Insert table')).toBeTruthy()
    expect(getByRole('button', { name: 'Find' })).toBeTruthy()
    expect(getByLabelText('Bullet list')).toBeTruthy()
    expect(getByLabelText('Ordered list')).toBeTruthy()
    expect(getByLabelText('Task list')).toBeTruthy()
    fireEvent.mouseDown(getByLabelText('Bold'))
    fireEvent.mouseDown(getByLabelText('Italic'))
    fireEvent.mouseDown(getByLabelText('Underline'))
    fireEvent.mouseDown(getByLabelText('Strikethrough'))
    // Block type select
    fireEvent.click(getByLabelText('Block type'))
    fireEvent.click(await waitFor(() => getByRole('option', { name: 'Heading 1' })))
    // Font family / size
    fireEvent.click(getByLabelText('Font family'))
    fireEvent.click(await waitFor(() => getByRole('option', { name: 'Georgia' })))
    fireEvent.click(getByLabelText('Font size'))
    fireEvent.click(await waitFor(() => getByRole('option', { name: '14' })))
    // Text color palette (temporary legacy query until Task 12)
    fireEvent.click(getByTitle('Text color'))
    fireEvent.click(await waitFor(() => getByTitle('Color #ff0000')))
    const json = getByTestId('json').textContent ?? ''
    expect(json.length).toBeGreaterThan(0)
    fireEvent.mouseDown(getByLabelText('Undo'))
    fireEvent.mouseDown(getByLabelText('Redo'))
  })

  it('reflects active mark state via aria-pressed', async () => {
    const { getByLabelText } = render(<Harness />)
    const bold = await waitFor(() => getByLabelText('Bold'))
    expect(bold.getAttribute('aria-pressed')).toBe('false')
    fireEvent.mouseDown(bold)
    await waitFor(() => expect(bold.getAttribute('aria-pressed')).toBe('true'))
    fireEvent.mouseDown(bold)
    await waitFor(() => expect(bold.getAttribute('aria-pressed')).toBe('false'))
  })

  it('Find button emits openFind and FindBar appears', async () => {
    const { getByRole } = render(<Harness />)
    await waitFor(() => getByRole('button', { name: 'Find' }))
    fireEvent.mouseDown(getByRole('button', { name: 'Find' }))
    expect(getByRole('search')).toBeTruthy()
    expect(getByRole('textbox', { name: 'Find' })).toBeTruthy()
    expect(getByRole('textbox', { name: 'Replace' })).toBeTruthy()
  })
})
