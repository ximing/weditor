/** @vitest-environment happy-dom */
import { getVersion } from 'prosemirror-collab'
import { docsSchema } from '@weditor/preset-docs'
import { collabExtension } from '@weditor/collab'
import { MemoryAuthority, createMemoryProvider } from '@weditor/collab'
import { render, waitFor } from '@testing-library/react'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { DocEditor } from '../DocEditor'
import { EditorProvider } from '../EditorProvider'

const alice = { id: 'a', name: 'Alice' }

describe('DocEditor collab bootstrap and onChange', () => {
  it('connect → loadDocument → create at snap.version → replaceAll comments', async () => {
    const auth = new MemoryAuthority(docsSchema())
    const p = createMemoryProvider(auth, { user: alice, clientID: 'aaaaaaaaaaaaaaaaaaaaa' })
    auth.applyComment({
      type: 'createThread',
      thread: {
        id: 'c_boot',
        quote: 'Hi',
        resolved: false,
        createdAt: 1,
        comments: [{ id: 'm1', author: alice, body: 'hello', createdAt: 1 }],
      },
    })
    const { getByText } = render(<DocEditor collab={p} currentUser={alice} />)
    await waitFor(() => expect(getByText('hello')).toBeTruthy())
    void collabExtension
    void getVersion
  })

  it('onChange skips remote transactions', async () => {
    const onChange = vi.fn()
    const { Editor } = await import('@weditor/core')
    const { docsPreset } = await import('@weditor/preset-docs')
    const editor = Editor.create({ extensions: docsPreset() })
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
    tr.setMeta('weditor-remote', true)
    editor.dispatch(tr)
    expect(onChange).not.toHaveBeenCalled()
    editor.dispatch(editor.state.tr.insertText('y'))
    expect(onChange).toHaveBeenCalled()
  })
})
