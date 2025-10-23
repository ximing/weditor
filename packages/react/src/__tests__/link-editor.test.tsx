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

function EmitCurrentLink() {
  const editor = useEditor()
  return (
    <button
      type="button"
      aria-label="Emit current openLink"
      onClick={() => editor.emit('openLink', {
        from: editor.state.selection.from,
        to: editor.state.selection.to,
      })}
    >
      emit current
    </button>
  )
}

function OpenExistingLink() {
  const editor = useEditor()
  return (
    <button
      type="button"
      aria-label="Open existing link"
      onClick={() => {
        const link = editor.state.schema.marks.link.create({ href: 'https://old.example' })
        const tr = editor.state.tr.addMark(1, 6, link)
        tr.setSelection(TextSelection.create(tr.doc, 3))
        editor.dispatch(tr)
        editor.emit('openLink', { from: 3, to: 3 })
      }}
    >
      open existing
    </button>
  )
}

function MoveSelection() {
  const editor = useEditor()
  return (
    <button
      type="button"
      aria-label="Move selection"
      onClick={() => editor.dispatch(
        editor.state.tr.setSelection(TextSelection.create(editor.state.doc, 7, 12)),
      )}
    >
      move
    </button>
  )
}

function DeleteTarget() {
  const editor = useEditor()
  return (
    <button
      type="button"
      aria-label="Delete target"
      onClick={() => editor.dispatch(editor.state.tr.delete(1, 6))}
    >
      delete target
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
      <EmitCurrentLink />
      <OpenExistingLink />
      <MoveSelection />
      <DeleteTarget />
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

  it('preloads and changes the full link at a cursor inside it', async () => {
    const { getByLabelText, getByRole, getByTestId } = render(<Harness />)
    await waitFor(() => getByLabelText('Open existing link'))
    fireEvent.click(getByLabelText('Open existing link'))
    const input = await waitFor(() => getByLabelText('Link URL'))
    expect((input as HTMLInputElement).value).toBe('https://old.example')
    fireEvent.change(input, { target: { value: 'https://new.example' } })
    fireEvent.click(getByRole('button', { name: 'Apply' }))
    await waitFor(() => expect(getByTestId('json').textContent).toContain('new.example'))
    expect(getByTestId('json').textContent).not.toContain('old.example')
    expect(getByTestId('json').textContent).not.toContain('https://new.examplehello')
  })

  it('removes the full link at a cursor inside it', async () => {
    const { getByLabelText, getByRole, getByTestId } = render(<Harness />)
    await waitFor(() => getByLabelText('Open existing link'))
    fireEvent.click(getByLabelText('Open existing link'))
    await waitFor(() => getByLabelText('Link URL'))
    fireEvent.click(getByRole('button', { name: 'Remove' }))
    await waitFor(() => expect(getByTestId('json').textContent).not.toContain('old.example'))
    expect(getByTestId('json').textContent).toContain('hello world')
  })

  it('does not open for an empty selection without a link', async () => {
    const { getByLabelText } = render(<Harness />)
    await waitFor(() => getByLabelText('Emit current openLink'))
    fireEvent.click(getByLabelText('Emit current openLink'))
    expect(document.querySelector('.deditor-link-editor')).toBeNull()
  })

  it('applies to the emitted range after the selection moves', async () => {
    const { getByLabelText, getByRole, getByTestId } = render(<Harness />)
    await waitFor(() => getByLabelText('Emit openLink'))
    fireEvent.click(getByLabelText('Emit openLink'))
    const input = await waitFor(() => getByLabelText('Link URL'))
    fireEvent.change(input, { target: { value: 'https://hello.example' } })
    fireEvent.click(getByLabelText('Move selection'))
    fireEvent.click(getByRole('button', { name: 'Apply' }))
    await waitFor(() => expect(getByTestId('json').textContent).toContain('hello.example'))
    expect(JSON.parse(getByTestId('json').textContent ?? '')).toMatchObject({
      content: [{
        content: [
          { text: 'hello', marks: [{ type: 'link', attrs: { href: 'https://hello.example' } }] },
          { text: ' world' },
        ],
      }],
    })
  })

  it('closes when a document transaction deletes the entire emitted range', async () => {
    const { getByLabelText, getByTestId } = render(<Harness />)
    await waitFor(() => getByLabelText('Emit openLink'))
    fireEvent.click(getByLabelText('Emit openLink'))
    const input = await waitFor(() => getByLabelText('Link URL'))
    fireEvent.change(input, { target: { value: 'https://stale.example' } })
    fireEvent.click(getByLabelText('Delete target'))
    await waitFor(() => expect(document.querySelector('.deditor-link-editor')).toBeNull())
    expect(getByTestId('json').textContent).not.toContain('stale.example')
  })
})
