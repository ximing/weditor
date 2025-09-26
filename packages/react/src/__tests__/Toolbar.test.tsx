/** @vitest-environment happy-dom */
import { docsPreset } from '@weditor/preset-docs'
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react'
import React from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
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
    expect(getByTitle('Mention')).toBeTruthy()
    expect(getByTitle('Bullet list')).toBeTruthy()
    expect(getByTitle('Ordered list')).toBeTruthy()
    expect(getByTitle('Task list')).toBeTruthy()
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

  it('openLink prompts URL like the Link button', async () => {
    const prompt = vi.spyOn(window, 'prompt').mockReturnValue('https://ok.example')
    function EmitLink() {
      const editor = useEditor()
      return (
        <button
          type="button"
          title="Emit openLink"
          onClick={() => editor.emit('openLink', { from: editor.state.selection.from, to: editor.state.selection.to })}
        >
          Emit openLink
        </button>
      )
    }
    const { getByTitle } = render(
      <EditorProvider extensions={docsPreset()}>
        <Toolbar />
        <EmitLink />
        <EditorSurface />
      </EditorProvider>,
    )
    await waitFor(() => getByTitle('Emit openLink'))
    fireEvent.click(getByTitle('Emit openLink'))
    expect(prompt).toHaveBeenCalledWith('URL')
    prompt.mockRestore()
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
