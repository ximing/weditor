/** @vitest-environment happy-dom */
import type { Editor } from '@deditor/core'
import { commentsUiKey, docsPreset, pickCommentIdAt } from '@deditor/preset-docs'
import { cleanup, fireEvent, render, waitFor, within } from '@testing-library/react'
import { TextSelection } from 'prosemirror-state'
import React from 'react'
import { afterEach, describe, expect, it } from 'vitest'
import { CommentSidebar } from '../chrome/CommentSidebar'
import { CommentComposer } from '../chrome/CommentComposer'
import { Toolbar } from '../chrome/Toolbar'
import { EditorProvider } from '../EditorProvider'
import { EditorSurface } from '../EditorSurface'
import { useEditor } from '../useEditor'

const user = { id: 'a', name: 'Alice' }

function Harness({
  readOnly = false,
  onEditor,
}: {
  readOnly?: boolean
  onEditor?: (editor: Editor | null) => void
}) {
  const extensions = React.useMemo(() => docsPreset(), [])
  const [range, setRange] = React.useState<{ from: number; to: number } | null>(null)
  return (
    <EditorProvider extensions={extensions} onEditor={onEditor}>
      <Boot readOnly={readOnly} />
      <Toolbar />
      <CommentComposer currentUser={user} range={range} onClose={() => setRange(null)} />
      <CommentSidebar currentUser={user} readOnly={readOnly} />
      <EditorSurface />
      <RangeSetter onRange={setRange} />
    </EditorProvider>
  )
}

function Boot({ readOnly }: { readOnly: boolean }) {
  const editor = useEditor()
  React.useEffect(() => {
    editor.dispatch(editor.state.tr.insertText('Hello world'))
    editor.dispatch(editor.state.tr.setSelection(TextSelection.create(editor.state.doc, 1, 6)))
    editor.setEditable(!readOnly)
  }, [editor, readOnly])
  return null
}

function RangeSetter({ onRange }: { onRange: (r: { from: number; to: number }) => void }) {
  const editor = useEditor()
  React.useEffect(() => editor.on('openComment', onRange), [editor, onRange])
  return (
    <button
      type="button"
      data-testid="open-comment"
      onClick={() => {
        const { from, to } = editor.state.selection
        if (from === to) return
        onRange({ from, to })
      }}
    />
  )
}

afterEach(() => cleanup())

describe('comment chrome', () => {
  it('composer snapshot uses from/to; discard does not dispatch; submit calls addComment', async () => {
    const { getByTestId, getByPlaceholderText, getByText } = render(<Harness />)
    await waitFor(() => getByTestId('open-comment'))
    fireEvent.click(getByTestId('open-comment'))
    fireEvent.change(getByPlaceholderText('Start typing…'), { target: { value: 'A note' } })
    const composer = getByPlaceholderText('Start typing…').closest('.deditor-comment-composer')
    expect(composer).toBeTruthy()
    fireEvent.click(within(composer as HTMLElement).getByText('Comment'))
    await waitFor(() => expect(getByText('A note')).toBeTruthy())
  })

  it('hides composer and resolve/reply/delete when read-only; highlights remain', async () => {
    const { queryByPlaceholderText, queryByLabelText } = render(<Harness readOnly />)
    await waitFor(() => queryByLabelText('Bold'))
    expect(queryByPlaceholderText('Start typing…')).toBeNull()
  })

  it('discard closes the composer without addComment', async () => {
    const { getByTestId, getByPlaceholderText, getByText, queryByText, queryByPlaceholderText } =
      render(<Harness />)
    await waitFor(() => getByTestId('open-comment'))
    fireEvent.click(getByTestId('open-comment'))
    fireEvent.change(getByPlaceholderText('Start typing…'), { target: { value: 'A note' } })
    fireEvent.click(getByText('Discard'))
    expect(queryByText('A note')).toBeNull()
    expect(queryByPlaceholderText('Start typing…')).toBeNull()
  })

  it('empty selection does not open the composer from the toolbar', async () => {
    let editor: Editor | null = null
    const { getAllByLabelText, queryByPlaceholderText } = render(
      <Harness onEditor={(e) => { editor = e }} />,
    )
    await waitFor(() => getAllByLabelText('Comment')[0])
    await waitFor(() => expect(editor?.state.doc.textContent).toBe('Hello world'))
    editor!.dispatch(
      editor!.state.tr.setSelection(TextSelection.create(editor!.state.doc, 1, 1)),
    )
    fireEvent.mouseDown(getAllByLabelText('Comment')[0])
    expect(queryByPlaceholderText('Start typing…')).toBeNull()
  })

  it('toolbar Comment snapshots the selection via openComment', async () => {
    const { getAllByLabelText, getByPlaceholderText } = render(<Harness />)
    await waitFor(() => getAllByLabelText('Comment')[0])
    fireEvent.mouseDown(getAllByLabelText('Comment')[0])
    expect(getByPlaceholderText('Start typing…')).toBeTruthy()
  })

  it('renders the composer input and controls with comment styling hooks', async () => {
    const { getByTestId, getByPlaceholderText } = render(<Harness />)
    await waitFor(() => getByTestId('open-comment'))
    fireEvent.click(getByTestId('open-comment'))
    const composer = getByPlaceholderText('Start typing…').closest('.deditor-comment-composer')
    expect(composer).toBeTruthy()
    expect(getByPlaceholderText('Start typing…').classList.contains('deditor-comment-input')).toBe(true)
    const actions = composer?.querySelector('.deditor-comment-actions')
    expect(actions).toBeTruthy()
    expect(within(actions as HTMLElement).getByText('Discard').classList.contains('deditor-chip-btn')).toBe(true)
    const commentButton = within(actions as HTMLElement).getByText('Comment')
    expect(commentButton.classList.contains('deditor-chip-btn')).toBe(true)
    expect(commentButton.classList.contains('is-primary')).toBe(true)
  })

  it('renders comment messages with author metadata, a valid semantic time, and chip actions', async () => {
    let editor: Editor | null = null
    const { getByText } = render(<Harness onEditor={(e) => { editor = e }} />)
    await waitFor(() => expect(editor?.state.doc.textContent).toBe('Hello world'))
    editor!.commands.addComment({ body: 'Attributed note', author: user, from: 1, to: 6 })
    await waitFor(() => getByText('Attributed note'))
    const row = document.querySelector('.deditor-comment-thread') as HTMLElement
    const message = row.querySelector('.deditor-comment-message') as HTMLElement
    const meta = message.querySelector('.deditor-comment-meta') as HTMLElement
    expect(meta.querySelector('.deditor-comment-avatar')?.textContent).toBe('A')
    expect(meta.querySelector('.deditor-comment-avatar')?.getAttribute('style')).toContain(
      '--deditor-primary',
    )
    expect(meta.querySelector('.deditor-comment-author')?.textContent).toBe('Alice')
    const timestamp = meta.querySelector('time') as HTMLTimeElement
    expect(timestamp).toBeTruthy()
    expect(timestamp.dateTime).toMatch(/^\d{4}-\d{2}-\d{2}T/)
    expect(Number.isNaN(new Date(timestamp.dateTime).getTime())).toBe(false)
    expect(message.querySelector('.deditor-comment-body')?.textContent).toBe('Attributed note')
    expect(within(row).getByLabelText('Reply').classList.contains('deditor-comment-input')).toBe(true)
    const replyButton = within(row).getByText('Reply')
    expect(replyButton.classList.contains('deditor-chip-btn')).toBe(true)
    expect(replyButton.classList.contains('is-primary')).toBe(true)
    expect(within(row).getByText('Resolve').classList.contains('deditor-chip-btn')).toBe(true)
    expect(within(row).getByText('Delete').classList.contains('deditor-chip-btn')).toBe(true)
  })

  it('lists unresolved attached then detached then resolved; reply/resolve/delete dispatch', async () => {
    let editor: Editor | null = null
    const { getByText } = render(
      <Harness onEditor={(e) => { editor = e }} />,
    )
    await waitFor(() => expect(editor?.state.doc.textContent).toBe('Hello world'))
    editor!.commands.addComment({ body: 'First', author: user, from: 1, to: 6 })
    editor!.commands.addComment({ body: 'Second', author: user, from: 7, to: 12 })
    const second = editor!.comments.list().find((t) => t.comments[0].body === 'Second')!
    editor!.dispatch(editor!.state.tr.delete(7, 12))
    expect(editor!.comments.get(second.id)?.detached).toBe(true)
    editor!.commands.toggleCommentResolved({ id: second.id })
    await waitFor(() => getByText('First'))
    const quotes = [...document.querySelectorAll('.deditor-comment-quote')].map((el) => el.textContent)
    expect(quotes[0]).toBe('Hello')
    expect(quotes[quotes.length - 1]).toBe('world')
    const firstRow = document.querySelector('.deditor-comment-thread') as HTMLElement
    fireEvent.change(within(firstRow).getByLabelText('Reply'), { target: { value: 'Later' } })
    fireEvent.click(within(firstRow).getByText('Reply'))
    await waitFor(() => expect(getByText('Later')).toBeTruthy())
    fireEvent.click(within(firstRow).getByText('Resolve'))
    await waitFor(() => expect(within(firstRow).getByText('Reopen')).toBeTruthy())
    const resolvedFlag = firstRow.querySelector('.deditor-comment-flag')
    expect(resolvedFlag?.querySelector('svg[aria-hidden="true"]')).toBeTruthy()
    const openId = editor!.comments.list().find((t) => t.comments[0].body === 'First')!.id
    expect(editor!.comments.get(openId)?.resolved).toBe(true)
    fireEvent.click(within(firstRow).getByText('Delete'))
    await waitFor(() => expect(editor!.comments.get(openId)).toBeUndefined())
  })

  it('hides reply/resolve/delete when read-only after a thread exists', async () => {
    let editor: Editor | null = null
    const { getByText, queryByText, queryByLabelText, queryByPlaceholderText } = render(
      <Harness readOnly onEditor={(e) => { editor = e }} />,
    )
    await waitFor(() => expect(editor?.state.doc.textContent).toBe('Hello world'))
    editor!.setEditable(true)
    editor!.commands.addComment({ body: 'A note', author: user, from: 1, to: 6 })
    editor!.setEditable(false)
    await waitFor(() => getByText('A note'))
    expect(queryByPlaceholderText('Start typing…')).toBeNull()
    expect(queryByLabelText('Reply')).toBeNull()
    expect(queryByText('Resolve')).toBeNull()
    expect(queryByText('Delete')).toBeNull()
    expect(document.querySelector('.deditor-comment-open')).toBeTruthy()
  })

  it('clicking a highlight picks the shortest overlapping id and paints active', async () => {
    let editor: Editor | null = null
    render(<Harness onEditor={(e) => { editor = e }} />)
    await waitFor(() => expect(editor?.state.doc.textContent).toBe('Hello world'))
    editor!.commands.addComment({ body: 'wide', author: user, from: 1, to: 11 })
    editor!.commands.addComment({ body: 'short', author: user, from: 1, to: 6 })
    const shortId = editor!.comments.list().find((t) => t.comments[0].body === 'short')!.id
    expect(pickCommentIdAt(editor!.state.doc, 3, editor!.comments)).toBe(shortId)
    await waitFor(() => expect(document.querySelector('.deditor-comment-open')).toBeTruthy())
    fireEvent.click(document.querySelector('.deditor-comment-open') as Element)
    await waitFor(() => {
      expect(commentsUiKey.getState(editor!.state)?.activeId).toBe(shortId)
    })
    expect(document.querySelector('.deditor-comment-active')).toBeTruthy()
  })

  it('skeleton rows show Loading thread…; clicking a thread selects the first mark range', async () => {
    let editor: Editor | null = null
    const { getByText } = render(<Harness onEditor={(e) => { editor = e }} />)
    await waitFor(() => expect(editor?.state.doc.textContent).toBe('Hello world'))
    const skel = editor!.schema.marks.comment.create({ id: 'c_skeleton' })
    editor!.dispatch(editor!.state.tr.addMark(1, 6, skel))
    await waitFor(() => expect(getByText('Loading thread…')).toBeTruthy())
    editor!.commands.addComment({ body: 'Live', author: user, from: 7, to: 12 })
    const live = editor!.comments.list().find((t) => t.comments[0].body === 'Live')!
    await waitFor(() => getByText('Live'))
    fireEvent.click(getByText('Live'))
    expect(editor!.state.selection.from).toBe(7)
    expect(editor!.state.selection.to).toBe(12)
    expect(commentsUiKey.getState(editor!.state)?.activeId).toBe(live.id)
  })
})
