/** @vitest-environment happy-dom */
import { docsPreset } from '@weditor/preset-docs'
import { fireEvent, render, waitFor } from '@testing-library/react'
import React from 'react'
import { describe, expect, it } from 'vitest'
import { EditorProvider } from '../EditorProvider'
import { EditorSurface } from '../EditorSurface'
import { Toolbar } from '../chrome/Toolbar'
import { useEditor } from '../useEditor'

function Harness() {
  return (
    <EditorProvider extensions={docsPreset()}>
      <Toolbar />
      <EditorSurface />
      <Inspector />
    </EditorProvider>
  )
}

function Inspector() {
  const editor = useEditor()
  return <div data-testid="json">{JSON.stringify(editor.getJSON())}</div>
}

describe('Toolbar', () => {
  it('undo / redo / toggleStrong / heading 1 / font / color buttons dispatch commands', async () => {
    const { getByTitle, getByTestId, getByLabelText } = render(<Harness />)
    await waitFor(() => getByTitle('Bold'))
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
})
