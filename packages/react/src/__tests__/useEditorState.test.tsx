/** @vitest-environment happy-dom */
import { docsPreset } from '@deditor/preset-docs'
import { cleanup, render, waitFor } from '@testing-library/react'
import React from 'react'
import { afterEach, describe, expect, it } from 'vitest'
import { EditorProvider } from '../EditorProvider'
import { EditorSurface } from '../EditorSurface'
import { useEditor } from '../useEditor'
import { useEditorState } from '../useEditorState'

function Probe() {
  const editor = useEditor()
  const firstNodeType = useEditorState((e) => e.state.doc.firstChild?.type.name)
  return (
    <button
      type="button"
      data-testid="count"
      onClick={() => editor.commands.insertHorizontalRule()}
    >
      {firstNodeType}
    </button>
  )
}

afterEach(() => cleanup())

describe('useEditorState', () => {
  it('re-renders when transactions change the selected value', async () => {
    const { getByTestId } = render(
      <EditorProvider extensions={docsPreset()}>
        <Probe />
        <EditorSurface />
      </EditorProvider>,
    )
    await waitFor(() => expect(getByTestId('count').textContent).toBe('paragraph'))
    getByTestId('count').click()
    await waitFor(() => expect(getByTestId('count').textContent).toBe('horizontal_rule'))
  })
})
