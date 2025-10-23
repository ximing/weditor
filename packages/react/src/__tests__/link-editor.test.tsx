/** @vitest-environment happy-dom */
import { docsPreset } from '@deditor/preset-docs'
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react'
import React, { useEffect, useState } from 'react'
import { afterEach, describe, expect, it } from 'vitest'
import { TextSelection } from 'prosemirror-state'
import { LinkEditor } from '../chrome/LinkEditor'
import { EditorProvider } from '../EditorProvider'
import { EditorSurface } from '../EditorSurface'
import { useEditor } from '../useEditor'

function EmitLink() {
  const editor = useEditor()
  return (
    <button
      type="button"
      aria-label="Emit openLink"
      onClick={() => {
        editor.dispatch(editor.state.tr.setSelection(TextSelection.create(editor.state.doc, 1, 6)))
        editor.emit('openLink', {
          from: editor.state.selection.from,
          to: editor.state.selection.to,
        })
      }}
    >
      emit
    </button>
  )
}

function Inspector() {
  const editor = useEditor()
  const [, setTick] = useState(0)
  useEffect(() => editor.on('transaction', () => setTick((n) => n + 1)), [editor])
  return <div data-testid="json">{JSON.stringify(editor.getJSON())}</div>
}

function Harness() {
  return (
    <EditorProvider
      extensions={docsPreset()}
      defaultContent={{
        type: 'doc',
        content: [
          { type: 'paragraph', content: [{ type: 'text', text: 'hello world' }] },
        ],
      }}
    >
      <LinkEditor />
      <EmitLink />
      <EditorSurface />
      <Inspector />
    </EditorProvider>
  )
}

afterEach(() => cleanup())

describe('LinkEditor', () => {
  it('opens on openLink and applies the URL', async () => {
    const { getByLabelText, getByTestId, getByRole } = render(<Harness />)
    await waitFor(() => getByLabelText('Emit openLink'))
    fireEvent.click(getByLabelText('Emit openLink'))
    const input = await waitFor(() => getByLabelText('Link URL'))
    fireEvent.change(input, { target: { value: 'https://ok.example' } })
    fireEvent.click(getByRole('button', { name: 'Apply' }))
    await waitFor(() => expect(getByTestId('json').textContent).toContain('ok.example'))
    await waitFor(() => expect(document.querySelector('.deditor-link-editor')).toBeNull())
  })

  it('closes on Escape without applying', async () => {
    const { getByLabelText, getByTestId } = render(<Harness />)
    await waitFor(() => getByLabelText('Emit openLink'))
    fireEvent.click(getByLabelText('Emit openLink'))
    const input = await waitFor(() => getByLabelText('Link URL'))
    fireEvent.change(input, { target: { value: 'https://nope.example' } })
    fireEvent.keyDown(input, { key: 'Escape' })
    await waitFor(() => expect(document.querySelector('.deditor-link-editor')).toBeNull())
    expect(getByTestId('json').textContent).not.toContain('nope.example')
  })
})
