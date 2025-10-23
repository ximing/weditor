/** @vitest-environment happy-dom */
import { docsPreset } from '@deditor/preset-docs'
import { cleanup, render, waitFor } from '@testing-library/react'
import React, { StrictMode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { TableBubble } from '../chrome/TableBubble'
import { EditorProvider } from '../EditorProvider'
import { EditorSurface } from '../EditorSurface'
import { useEditor } from '../useEditor'

afterEach(() => cleanup())

function Probe({ onReady }: { onReady: (n: number) => void }) {
  const editor = useEditor()
  React.useEffect(() => {
    if (editor) onReady(editor.state.doc.childCount)
  }, [editor, onReady])
  return (
    <>
      <TableBubble />
      <EditorSurface />
    </>
  )
}

describe('EditorProvider', () => {
  it('throws when useEditor is called outside a provider', () => {
    function Bare() {
      useEditor()
      return null
    }
    expect(() => render(<Bare />)).toThrow(/EditorProvider/)
  })

  it('mounts one Editor in Strict Mode (dev double-invoke does not leak two views)', async () => {
    const childCounts: number[] = []
    render(
      <StrictMode>
        <EditorProvider extensions={docsPreset()} defaultContent={undefined}>
          <Probe onReady={(n) => childCounts.push(n)} />
        </EditorProvider>
      </StrictMode>,
    )
    await waitFor(() => expect(childCounts.length).toBeGreaterThan(0))
    const surfaces = document.querySelectorAll('.deditor-surface .ProseMirror')
    expect(surfaces.length).toBe(1)
  })

  it('two providers yield two independent editors', async () => {
    const ids: string[] = []
    function Tag() {
      const editor = useEditor()
      React.useEffect(() => {
        if (editor) ids.push(String(editor.state.doc.nodeSize))
      }, [editor])
      return (
        <>
          <TableBubble />
          <EditorSurface />
        </>
      )
    }
    render(
      <>
        <EditorProvider extensions={docsPreset()}>
          <Tag />
        </EditorProvider>
        <EditorProvider extensions={docsPreset()}>
          <Tag />
        </EditorProvider>
      </>,
    )
    await waitFor(() => expect(ids.length).toBeGreaterThanOrEqual(2))
    expect(document.querySelectorAll('.ProseMirror').length).toBe(2)
  })

  it('accepts a pre-built Editor without creating another instance', async () => {
    const { Editor } = await import('@deditor/core')
    const editor = Editor.create({ extensions: docsPreset() })
    function Probe() {
      const e = useEditor()
      return <span data-testid="same">{String(e === editor)}</span>
    }
    const { getByTestId } = render(
      <EditorProvider editor={editor}>
        <Probe />
      </EditorProvider>,
    )
    await waitFor(() => expect(getByTestId('same').textContent).toBe('true'))
  })

  it('onChange skips remote transactions', async () => {
    const onChange = vi.fn()
    const { Editor } = await import('@deditor/core')
    const { docsPreset: preset } = await import('@deditor/preset-docs')
    const editor = Editor.create({ extensions: preset() })
    function Wrap() {
      React.useEffect(() => {
        const off = editor.on('transaction', ({ remote }) => {
          if (!remote) onChange(editor.getJSON())
        })
        return off
      }, [])
      return (
        <EditorProvider editor={editor}>
          <span />
        </EditorProvider>
      )
    }
    render(<Wrap />)
    const tr = editor.state.tr.insertText('x')
    tr.setMeta('deditor-remote', true)
    editor.dispatch(tr)
    expect(onChange).not.toHaveBeenCalled()
    editor.dispatch(editor.state.tr.insertText('y'))
    expect(onChange).toHaveBeenCalled()
  })
})
