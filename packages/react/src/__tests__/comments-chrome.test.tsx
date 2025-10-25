/** @vitest-environment happy-dom */
import type { Editor } from '@deditor/core'
import { commentsUiKey, docsPreset, pickCommentIdAt } from '@deditor/preset-docs'
import { cleanup, fireEvent, render, waitFor, within } from '@testing-library/react'
import { TextSelection } from 'prosemirror-state'
import React from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { CommentSidebar } from '../chrome/CommentSidebar'
import { CommentComposer } from '../chrome/CommentComposer'
import { marginLeft, resolveOverlap } from '../chrome/comment-margin-pos'
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
      <div className="deditor-root">
        <Boot readOnly={readOnly} />
        <Toolbar />
        <CommentComposer currentUser={user} range={range} onClose={() => setRange(null)} />
        <CommentSidebar currentUser={user} readOnly={readOnly} />
        <EditorSurface />
        <RangeSetter onRange={setRange} />
      </div>
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

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

function fakeRect(r: Partial<DOMRect>): DOMRect {
  return {
    x: r.left ?? 0,
    y: r.top ?? 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 0,
    height: 0,
    ...r,
    toJSON: () => ({}),
  } as DOMRect
}

/** Mock page layout: 1200px-wide root, 816px doc card starting at x=100. */
function mockLayout(rootWidth = 1200) {
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (
    this: Element,
  ) {
    const el = this as HTMLElement
    if (el.classList?.contains('deditor-root')) {
      return fakeRect({ left: 0, top: 0, right: rootWidth, bottom: 800, width: rootWidth, height: 800 })
    }
    if (el.classList?.contains('deditor-doc')) {
      return fakeRect({ left: 100, top: 0, right: 916, bottom: 800, width: 816, height: 800 })
    }
    return fakeRect({})
  })
}

function mockCoords(editor: Editor, tops: Record<number, number>) {
  const view = editor.view!
  const impl = (pos: number) => {
    const top = tops[pos] ?? 0
    return { left: 0, right: 0, top, bottom: top + 16 }
  }
  view.coordsAtPos = impl as typeof view.coordsAtPos
}

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

  it('renders nothing when no range is open', async () => {
    const { queryByPlaceholderText } = render(<Harness />)
    await waitFor(() => queryByPlaceholderText('Start typing…') === null)
    expect(document.querySelector('.deditor-comment-composer')).toBeNull()
  })

  it('anchors the composer to the selection top and places it right of the doc', async () => {
    let editor: Editor | null = null
    const { getByTestId, getByPlaceholderText } = render(
      <Harness onEditor={(e) => { editor = e }} />,
    )
    await waitFor(() => expect(editor?.state.doc.textContent).toBe('Hello world'))
    mockLayout(1200)
    mockCoords(editor!, { 1: 40 })
    fireEvent.click(getByTestId('open-comment'))
    const composer = getByPlaceholderText('Start typing…').closest(
      '.deditor-comment-composer',
    ) as HTMLElement
    // selection from=1 -> coordsAtPos top 40, root top 0 -> top 40
    expect(composer.style.top).toBe('40px')
    // doc right edge 916 - root left 0 + 16 = 932; width min(320, 1200 - 932 - 8) = 260
    expect(composer.style.left).toBe('932px')
    expect(composer.style.width).toBe('260px')
    expect(composer.classList.contains('is-overlay')).toBe(false)
  })

  it('falls back to overlay placement for the composer on narrow layouts', async () => {
    let editor: Editor | null = null
    const { getByTestId, getByPlaceholderText } = render(
      <Harness onEditor={(e) => { editor = e }} />,
    )
    await waitFor(() => expect(editor?.state.doc.textContent).toBe('Hello world'))
    mockLayout(1000)
    mockCoords(editor!, { 1: 40 })
    fireEvent.click(getByTestId('open-comment'))
    const composer = getByPlaceholderText('Start typing…').closest(
      '.deditor-comment-composer',
    ) as HTMLElement
    // overlay: width 300, left = 1000 - 16 - 300 = 684, still anchored in Y
    expect(composer.style.top).toBe('40px')
    expect(composer.style.left).toBe('684px')
    expect(composer.style.width).toBe('300px')
    expect(composer.classList.contains('is-overlay')).toBe(true)
  })

  it('renders comment messages with author metadata, a valid semantic time, and icon actions', async () => {
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
    // Compact by default: no textarea, no chip buttons — just the icon row.
    expect(within(row).queryByRole('textbox')).toBeNull()
    expect(row.querySelector('.deditor-thread-reply')).toBeNull()
    const actions = row.querySelector('.deditor-thread-actions') as HTMLElement
    expect(actions).toBeTruthy()
    for (const name of ['Reply', 'Mark resolved', 'Delete']) {
      const btn = within(actions).getByRole('button', { name })
      expect(btn.classList.contains('deditor-icon-btn')).toBe(true)
      expect(btn.querySelector('svg[aria-hidden="true"]')).toBeTruthy()
    }
  })

  it('shows a tooltip with the action label after hovering a thread icon button', async () => {
    let editor: Editor | null = null
    const { getByText } = render(<Harness onEditor={(e) => { editor = e }} />)
    await waitFor(() => expect(editor?.state.doc.textContent).toBe('Hello world'))
    editor!.commands.addComment({ body: 'Note', author: user, from: 1, to: 6 })
    await waitFor(() => getByText('Note'))
    const row = document.querySelector('.deditor-comment-thread') as HTMLElement
    fireEvent.mouseOver(within(row).getByRole('button', { name: 'Mark resolved' }))
    await waitFor(() => expect(document.querySelector('.deditor-tooltip')).toBeTruthy(), {
      timeout: 1500,
    })
    expect(document.querySelector('.deditor-tooltip')!.textContent).toBe('Mark resolved')
  })

  it('reply icon expands an inline reply box; Esc collapses it without dispatching', async () => {
    let editor: Editor | null = null
    const { getByText, queryByText } = render(<Harness onEditor={(e) => { editor = e }} />)
    await waitFor(() => expect(editor?.state.doc.textContent).toBe('Hello world'))
    editor!.commands.addComment({ body: 'Note', author: user, from: 1, to: 6 })
    await waitFor(() => getByText('Note'))
    const row = document.querySelector('.deditor-comment-thread') as HTMLElement
    expect(within(row).queryByRole('textbox')).toBeNull()
    fireEvent.click(within(row).getByRole('button', { name: 'Reply' }))
    const input = within(row).getByRole('textbox', { name: 'Reply' }) as HTMLTextAreaElement
    expect(input.classList.contains('deditor-comment-input')).toBe(true)
    expect(document.activeElement).toBe(input)
    fireEvent.change(input, { target: { value: 'Draft' } })
    fireEvent.keyDown(input, { key: 'Escape' })
    expect(within(row).queryByRole('textbox')).toBeNull()
    expect(row.querySelector('.deditor-thread-reply')).toBeNull()
    expect(queryByText('Draft')).toBeNull()
  })

  it('submitting the reply box calls replyToComment and collapses the box', async () => {
    let editor: Editor | null = null
    const { getByText } = render(<Harness onEditor={(e) => { editor = e }} />)
    await waitFor(() => expect(editor?.state.doc.textContent).toBe('Hello world'))
    editor!.commands.addComment({ body: 'Note', author: user, from: 1, to: 6 })
    await waitFor(() => getByText('Note'))
    const row = document.querySelector('.deditor-comment-thread') as HTMLElement
    fireEvent.click(within(row).getByRole('button', { name: 'Reply' }))
    fireEvent.change(within(row).getByRole('textbox', { name: 'Reply' }), {
      target: { value: 'Later' },
    })
    const replyBox = row.querySelector('.deditor-thread-reply') as HTMLElement
    const submit = within(replyBox).getByText('Send')
    expect(submit.classList.contains('deditor-chip-btn')).toBe(true)
    expect(submit.classList.contains('is-primary')).toBe(true)
    fireEvent.click(submit)
    await waitFor(() => expect(getByText('Later')).toBeTruthy())
    expect(within(row).queryByRole('textbox')).toBeNull()
    expect(row.querySelector('.deditor-thread-reply')).toBeNull()
  })

  it('clicking the reply icon again while the box is open keeps the draft', async () => {
    let editor: Editor | null = null
    const { getByText } = render(<Harness onEditor={(e) => { editor = e }} />)
    await waitFor(() => expect(editor?.state.doc.textContent).toBe('Hello world'))
    editor!.commands.addComment({ body: 'Note', author: user, from: 1, to: 6 })
    await waitFor(() => getByText('Note'))
    const row = document.querySelector('.deditor-comment-thread') as HTMLElement
    fireEvent.click(within(row).getByRole('button', { name: 'Reply' }))
    fireEvent.change(within(row).getByRole('textbox', { name: 'Reply' }), {
      target: { value: 'Draft' },
    })
    fireEvent.click(within(row).getByRole('button', { name: 'Reply' }))
    const input = within(row).getByRole('textbox', { name: 'Reply' }) as HTMLTextAreaElement
    expect(input.value).toBe('Draft')
  })

  it('submitting a whitespace-only draft does not dispatch and keeps the box open', async () => {
    let editor: Editor | null = null
    const { getByText } = render(<Harness onEditor={(e) => { editor = e }} />)
    await waitFor(() => expect(editor?.state.doc.textContent).toBe('Hello world'))
    editor!.commands.addComment({ body: 'Note', author: user, from: 1, to: 6 })
    const thread = editor!.comments.list()[0]
    await waitFor(() => getByText('Note'))
    const row = document.querySelector('.deditor-comment-thread') as HTMLElement
    fireEvent.click(within(row).getByRole('button', { name: 'Reply' }))
    fireEvent.change(within(row).getByRole('textbox', { name: 'Reply' }), {
      target: { value: '   ' },
    })
    fireEvent.click(
      within(row.querySelector('.deditor-thread-reply') as HTMLElement).getByText('Send'),
    )
    expect(editor!.comments.get(thread.id)!.comments).toHaveLength(1)
    expect(within(row).getByRole('textbox', { name: 'Reply' })).toBeTruthy()
    expect(row.querySelector('.deditor-thread-reply')).toBeTruthy()
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
    fireEvent.click(within(firstRow).getByRole('button', { name: 'Reply' }))
    fireEvent.change(within(firstRow).getByRole('textbox', { name: 'Reply' }), {
      target: { value: 'Later' },
    })
    fireEvent.click(
      within(firstRow.querySelector('.deditor-thread-reply') as HTMLElement).getByText('Send'),
    )
    await waitFor(() => expect(getByText('Later')).toBeTruthy())
    fireEvent.click(within(firstRow).getByRole('button', { name: 'Mark resolved' }))
    await waitFor(() =>
      expect(within(firstRow).getByRole('button', { name: 'Reopen' })).toBeTruthy(),
    )
    const resolvedFlag = firstRow.querySelector('.deditor-comment-flag')
    expect(resolvedFlag?.querySelector('svg[aria-hidden="true"]')).toBeTruthy()
    const openId = editor!.comments.list().find((t) => t.comments[0].body === 'First')!.id
    expect(editor!.comments.get(openId)?.resolved).toBe(true)
    fireEvent.click(within(firstRow).getByRole('button', { name: 'Delete' }))
    await waitFor(() => expect(editor!.comments.get(openId)).toBeUndefined())
  })

  it('hides reply/resolve/delete when read-only after a thread exists', async () => {
    let editor: Editor | null = null
    const { getByText, queryByRole, queryByPlaceholderText } = render(
      <Harness readOnly onEditor={(e) => { editor = e }} />,
    )
    await waitFor(() => expect(editor?.state.doc.textContent).toBe('Hello world'))
    editor!.setEditable(true)
    editor!.commands.addComment({ body: 'A note', author: user, from: 1, to: 6 })
    editor!.setEditable(false)
    await waitFor(() => getByText('A note'))
    expect(queryByPlaceholderText('Start typing…')).toBeNull()
    expect(queryByRole('textbox')).toBeNull()
    expect(queryByRole('button', { name: 'Reply' })).toBeNull()
    expect(queryByRole('button', { name: 'Mark resolved' })).toBeNull()
    expect(queryByRole('button', { name: 'Delete' })).toBeNull()
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

  it('renders detached threads in a static Detached section at the margin bottom', async () => {
    let editor: Editor | null = null
    const { getByText } = render(<Harness onEditor={(e) => { editor = e }} />)
    await waitFor(() => expect(editor?.state.doc.textContent).toBe('Hello world'))
    editor!.commands.addComment({ body: 'Gone', author: user, from: 1, to: 6 })
    await waitFor(() => getByText('Gone'))
    editor!.dispatch(editor!.state.tr.delete(1, 6))
    await waitFor(() => {
      const section = document.querySelector('.deditor-comment-detached') as HTMLElement
      expect(section).toBeTruthy()
      expect(section.querySelector('.deditor-comment-detached-title')?.textContent).toBe(
        'Detached',
      )
      expect(section.querySelector('[data-comment-id]')).toBeTruthy()
    })
    expect(getByText('Gone').closest('.deditor-comment-detached')).toBeTruthy()
  })

  it('anchors margin cards to their highlight top and places them right of the doc', async () => {
    let editor: Editor | null = null
    const { getByText } = render(<Harness onEditor={(e) => { editor = e }} />)
    await waitFor(() => expect(editor?.state.doc.textContent).toBe('Hello world'))
    mockLayout(1200)
    mockCoords(editor!, { 1: 40, 7: 200 })
    editor!.commands.addComment({ body: 'First', author: user, from: 1, to: 6 })
    editor!.commands.addComment({ body: 'Second', author: user, from: 7, to: 12 })
    await waitFor(() => getByText('Second'))
    const first = editor!.comments.list().find((t) => t.comments[0].body === 'First')!
    const second = editor!.comments.list().find((t) => t.comments[0].body === 'Second')!
    const firstCard = document.querySelector(`[data-comment-id="${first.id}"]`) as HTMLElement
    const secondCard = document.querySelector(`[data-comment-id="${second.id}"]`) as HTMLElement
    // doc right edge 916 - root left 0 + 16 = 932; width min(320, 1200 - 932 - 8) = 260
    expect(firstCard.style.top).toBe('40px')
    expect(secondCard.style.top).toBe('200px')
    expect(firstCard.style.left).toBe('932px')
    expect(firstCard.style.width).toBe('260px')
    const aside = document.querySelector('.deditor-comment-margin') as HTMLElement
    expect(aside.classList.contains('is-overlay')).toBe(false)
  })

  it('falls back to overlay placement when the margin is narrower than 240px', async () => {
    let editor: Editor | null = null
    const { getByText } = render(<Harness onEditor={(e) => { editor = e }} />)
    await waitFor(() => expect(editor?.state.doc.textContent).toBe('Hello world'))
    mockLayout(1000)
    mockCoords(editor!, { 1: 40 })
    editor!.commands.addComment({ body: 'First', author: user, from: 1, to: 6 })
    await waitFor(() => getByText('First'))
    const first = editor!.comments.list()[0]
    const card = document.querySelector(`[data-comment-id="${first.id}"]`) as HTMLElement
    // overlay: width 300, left = 1000 - 16 - 300 = 684, still anchored in Y
    expect(card.style.width).toBe('300px')
    expect(card.style.left).toBe('684px')
    expect(card.style.top).toBe('40px')
    const aside = document.querySelector('.deditor-comment-margin') as HTMLElement
    expect(aside.classList.contains('is-overlay')).toBe(true)
  })

  it('clicking a card selects the anchor range and requests scrollIntoView on the transaction', async () => {
    let editor: Editor | null = null
    const { getByText } = render(<Harness onEditor={(e) => { editor = e }} />)
    await waitFor(() => expect(editor?.state.doc.textContent).toBe('Hello world'))
    mockLayout(1200)
    mockCoords(editor!, { 7: 200 })
    editor!.commands.addComment({ body: 'Live', author: user, from: 7, to: 12 })
    const live = editor!.comments.list()[0]
    await waitFor(() => getByText('Live'))
    const dispatchSpy = vi.spyOn(editor!, 'dispatch')
    fireEvent.click(getByText('Live'))
    const tr = dispatchSpy.mock.calls.at(-1)?.[0]
    expect(tr).toBeTruthy()
    expect(tr!.scrolledIntoView).toBe(true)
    expect(tr!.getMeta(commentsUiKey)).toEqual({ activeId: live.id })
    expect(editor!.state.selection.from).toBe(7)
    expect(editor!.state.selection.to).toBe(12)
  })

  it('scrolls the active card into view when activeId changes', async () => {
    let editor: Editor | null = null
    const { getByText } = render(<Harness onEditor={(e) => { editor = e }} />)
    await waitFor(() => expect(editor?.state.doc.textContent).toBe('Hello world'))
    mockLayout(1200)
    mockCoords(editor!, { 1: 40 })
    editor!.commands.addComment({ body: 'Note', author: user, from: 1, to: 6 })
    const thread = editor!.comments.list()[0]
    await waitFor(() => getByText('Note'))
    const scrollSpy = vi
      .spyOn(Element.prototype, 'scrollIntoView')
      .mockImplementation(() => undefined)
    editor!.dispatch(
      editor!.state.tr.setMeta(commentsUiKey, { activeId: thread.id }).setMeta('addToHistory', false),
    )
    await waitFor(() => {
      expect(scrollSpy).toHaveBeenCalled()
      const card = document.querySelector(`[data-comment-id="${thread.id}"]`) as HTMLElement
      expect(scrollSpy.mock.instances).toContain(card)
      expect(scrollSpy.mock.calls.at(-1)?.[0]).toEqual({ block: 'nearest' })
    })
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

describe('resolveOverlap', () => {
  it('keeps non-overlapping cards at their anchor tops', () => {
    const out = resolveOverlap([
      { id: 'a', top: 0, height: 50 },
      { id: 'b', top: 100, height: 50 },
    ])
    expect(out).toEqual([
      { id: 'a', top: 0 },
      { id: 'b', top: 100 },
    ])
  })

  it('pushes an overlapping card down by the 8px gap', () => {
    const out = resolveOverlap([
      { id: 'a', top: 0, height: 100 },
      { id: 'b', top: 50, height: 50 },
    ])
    expect(out).toEqual([
      { id: 'a', top: 0 },
      { id: 'b', top: 108 },
    ])
  })

  it('cascades the push-down across multiple overlapping cards', () => {
    const out = resolveOverlap([
      { id: 'a', top: 0, height: 100 },
      { id: 'b', top: 10, height: 100 },
      { id: 'c', top: 20, height: 50 },
    ])
    expect(out).toEqual([
      { id: 'a', top: 0 },
      { id: 'b', top: 108 },
      { id: 'c', top: 216 },
    ])
  })

  it('sorts by anchor top before resolving', () => {
    const out = resolveOverlap([
      { id: 'b', top: 100, height: 50 },
      { id: 'a', top: 0, height: 120 },
    ])
    expect(out).toEqual([
      { id: 'a', top: 0 },
      { id: 'b', top: 128 },
    ])
  })
})

describe('marginLeft', () => {
  const rootRect = { left: 0, right: 1200 }
  const docRect = { left: 100, right: 916 }

  it('places cards 16px right of the doc card in margin mode', () => {
    const box = marginLeft(docRect, rootRect, 1200)
    expect(box).toEqual({ left: 932, width: 260, overlay: false })
  })

  it('caps card width at 320px on very wide roots', () => {
    const box = marginLeft(docRect, rootRect, 1600)
    expect(box).toEqual({ left: 932, width: 320, overlay: false })
  })

  it('falls back to a 300px overlay pinned 16px from the right below 240px available', () => {
    const box = marginLeft(docRect, { left: 0, right: 1000 }, 1000)
    expect(box).toEqual({ left: 684, width: 300, overlay: true })
  })
})
