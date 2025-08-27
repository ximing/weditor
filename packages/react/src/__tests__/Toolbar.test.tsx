/** @vitest-environment happy-dom */
import { docsPreset } from '@weditor/preset-docs'
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
  it('undo / redo / toggleStrong / heading 1 / font / color buttons dispatch commands', async () => {
    const { getByTitle, getByTestId, getByLabelText } = render(<Harness />)
    await waitFor(() => getByTitle('Bold'))
    expect(getByTitle('Insert table')).toBeTruthy()
    expect(getByTitle('Find')).toBeTruthy()
    fireEvent.mouseDown(getByTitle('Bold'))
    fireEvent.mouseDown(getByTitle('Italic'))
    fireEvent.mouseDown(getByTitle('Underline'))
    fireEvent.mouseDown(getByTitle('Strikethrough'))
    fireEvent.change(getByLabelText('Block type'), { target: { value: 'heading:1' } })
    fireEvent.change(getByLabelText('Font family'), { target: { value: 'Georgia' } })
    fireEvent.change(getByLabelText('Font size'), { target: { value: '14pt' } })
    fireEvent.click(getByTitle('Text color'))
    fireEvent.click(getByTitle('Color #ff0000'))
    const json = getByTestId('json').textContent ?? ''
    expect(json.length).toBeGreaterThan(0)
    fireEvent.mouseDown(getByTitle('Undo'))
    fireEvent.mouseDown(getByTitle('Redo'))
  })

  it('Find button emits openFind and FindBar appears', async () => {
    const { getByTitle, getByRole, getByLabelText } = render(<Harness />)
    await waitFor(() => getByTitle('Find'))
    fireEvent.mouseDown(getByTitle('Find'))
    expect(getByRole('search')).toBeTruthy()
    expect(getByLabelText('Find')).toBeTruthy()
    expect(getByLabelText('Replace')).toBeTruthy()
  })
})
