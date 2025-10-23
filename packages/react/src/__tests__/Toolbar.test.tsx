/** @vitest-environment happy-dom */
import { docsPreset } from '@deditor/preset-docs'
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react'
import React, { useEffect, useState } from 'react'
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
  const [, setRevision] = useState(0)
  useEffect(
    () => editor.on('transaction', () => setRevision((revision) => revision + 1)),
    [editor],
  )
  return (
    <div data-testid="state">
      {JSON.stringify({
        doc: editor.getJSON(),
        storedMarks: (editor.state.storedMarks ?? []).map((mark) => ({
          type: mark.type.name,
          attrs: mark.attrs,
        })),
      })}
    </div>
  )
}

type Snapshot = {
  doc: { content: Array<{ type: string; attrs: Record<string, unknown> }> }
  storedMarks: Array<{ type: string; attrs: Record<string, unknown> }>
}

function readSnapshot(element: HTMLElement): Snapshot {
  return JSON.parse(element.textContent ?? '{}') as Snapshot
}

afterEach(() => cleanup())

describe('Toolbar', () => {
  it('maps mark buttons and block/font/size/color controls to editor state', async () => {
    const { getByLabelText, getByRole, getByTestId } = render(<Harness />)
    const state = getByTestId('state')
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
    await waitFor(() => {
      const names = readSnapshot(state).storedMarks.map((mark) => mark.type).sort()
      expect(names).toEqual(['em', 'strike', 'strong', 'underline'])
    })
    // Block type select
    fireEvent.click(getByLabelText('Block type'))
    fireEvent.click(await waitFor(() => getByRole('option', { name: 'Heading 1' })))
    await waitFor(() => {
      const heading = readSnapshot(state).doc.content[0]
      expect(heading.type).toBe('heading')
      expect(heading.attrs.level).toBe(1)
    })
    // Font family / size
    fireEvent.click(getByLabelText('Font family'))
    fireEvent.click(await waitFor(() => getByRole('option', { name: 'Georgia' })))
    await waitFor(() => {
      const fontFamily = readSnapshot(state).storedMarks.find((mark) => mark.type === 'fontFamily')
      expect(fontFamily?.attrs.family).toBe('Georgia')
    })
    fireEvent.click(getByLabelText('Font size'))
    fireEvent.click(await waitFor(() => getByRole('option', { name: '14' })))
    await waitFor(() => {
      const fontSize = readSnapshot(state).storedMarks.find((mark) => mark.type === 'fontSize')
      expect(fontSize?.attrs.size).toBe('14pt')
    })
    // Text color palette
    fireEvent.click(getByLabelText('Text color'))
    fireEvent.click(await waitFor(() => getByRole('option', { name: 'Color #ff0000' })))
    await waitFor(() => {
      const color = readSnapshot(state).storedMarks.find((mark) => mark.type === 'color')
      expect(color?.attrs.color).toBe('#ff0000')
    })
  })

  it('undoes and redoes a block type change', async () => {
    const { getByLabelText, getByRole, getByTestId } = render(<Harness />)
    const state = getByTestId('state')
    await waitFor(() => getByLabelText('Block type'))
    expect(readSnapshot(state).doc.content[0].type).toBe('paragraph')

    fireEvent.click(getByLabelText('Block type'))
    fireEvent.click(await waitFor(() => getByRole('option', { name: 'Heading 1' })))
    await waitFor(() => expect(readSnapshot(state).doc.content[0].type).toBe('heading'))

    fireEvent.mouseDown(getByLabelText('Undo'))
    await waitFor(() => expect(readSnapshot(state).doc.content[0].type).toBe('paragraph'))
    fireEvent.mouseDown(getByLabelText('Redo'))
    await waitFor(() => {
      const heading = readSnapshot(state).doc.content[0]
      expect(heading.type).toBe('heading')
      expect(heading.attrs.level).toBe(1)
    })
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
