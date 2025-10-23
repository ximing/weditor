import type { Editor } from '@deditor/core'
import { useEffect, useRef, useState } from 'react'
import { TextSelection } from 'prosemirror-state'
import { useEditor } from '../useEditor'
import { Popover, type PopoverAnchor } from '../ui/Popover'

type LinkRange = { from: number; to: number }

function selectionRect(editor: Editor, range: LinkRange): DOMRect | null {
  const view = editor.view
  if (!view) return null
  const { from, to } = range
  try {
    const start = view.coordsAtPos(from)
    const end = view.coordsAtPos(Math.max(from, to - 1))
    const left = Math.min(start.left, end.left)
    const top = Math.min(start.top, end.top)
    return new DOMRect(
      left,
      top,
      Math.max(Math.max(start.right, end.right) - left, 1),
      Math.max(Math.max(start.bottom, end.bottom) - top, 1),
    )
  } catch {
    return null
  }
}

function selectionAnchor(
  editor: Editor,
  getRange: () => LinkRange | null,
): PopoverAnchor {
  const view = editor.view
  const range = getRange()
  if (!view || !range || !selectionRect(editor, range)) return null
  return {
    getBoundingClientRect: () => {
      const current = getRange()
      return current ? selectionRect(editor, current) ?? new DOMRect() : new DOMRect()
    },
    contextElement: view.dom,
  }
}

function linkAtRange(editor: Editor, range: LinkRange): string | null {
  const type = editor.state.schema.marks.link
  if (!type) return null
  let href: string | null = null
  editor.state.doc.nodesBetween(range.from, range.to, (node) => {
    if (href !== null) return false
    const mark = type.isInSet(node.marks)
    if (mark?.attrs.href != null) href = String(mark.attrs.href)
    return true
  })
  return href
}

function expandedLinkRange(editor: Editor, pos: number): (LinkRange & { href: string }) | null {
  const type = editor.state.schema.marks.link
  if (!type) return null
  const $pos = editor.state.doc.resolve(pos)
  const mark = type.isInSet($pos.marks())
  if (!mark?.attrs.href) return null

  const { parent, parentOffset } = $pos
  let childIndex = -1
  parent.forEach((node, offset, index) => {
    if (
      childIndex === -1
      && offset <= parentOffset
      && parentOffset <= offset + node.nodeSize
      && type.isInSet(node.marks)?.eq(mark)
    ) {
      childIndex = index
    }
  })
  if (childIndex === -1) return null

  let startIndex = childIndex
  let endIndex = childIndex
  while (startIndex > 0 && type.isInSet(parent.child(startIndex - 1).marks)?.eq(mark)) startIndex--
  while (endIndex + 1 < parent.childCount && type.isInSet(parent.child(endIndex + 1).marks)?.eq(mark)) endIndex++

  let from = $pos.start()
  for (let index = 0; index < startIndex; index++) from += parent.child(index).nodeSize
  let to = from
  for (let index = startIndex; index <= endIndex; index++) to += parent.child(index).nodeSize
  return { from, to, href: String(mark.attrs.href) }
}

export function LinkEditor() {
  const editor = useEditor()
  const [anchor, setAnchor] = useState<PopoverAnchor>(null)
  const [href, setHref] = useState('')
  const hadLink = useRef(false)
  const rangeRef = useRef<LinkRange | null>(null)

  useEffect(() => {
    let active = true
    const offOpen = editor.on('openLink', ({ from, to }) => {
      const eventRange = { from, to }
      const expanded = from === to ? expandedLinkRange(editor, from) : null
      const range = expanded ?? eventRange
      const current = expanded?.href ?? linkAtRange(editor, range)
      if (from === to && !current) return
      rangeRef.current = range
      hadLink.current = !!current
      setHref(current ?? '')
      setAnchor(selectionAnchor(editor, () => rangeRef.current))
    })
    const offTransaction = editor.on('transaction', ({ tr }) => {
      const range = rangeRef.current
      if (!range) return
      const from = tr.mapping.mapResult(range.from, 1)
      const to = tr.mapping.mapResult(range.to, -1)
      if (range.from < range.to && from.deleted && to.deleted && from.pos === to.pos) {
        rangeRef.current = null
        setAnchor(null)
        return
      }
      const mappedRange = {
        from: Math.min(from.pos, to.pos),
        to: Math.max(from.pos, to.pos),
      }
      rangeRef.current = mappedRange
      queueMicrotask(() => {
        if (!active || rangeRef.current !== mappedRange) return
        setAnchor(selectionAnchor(editor, () => rangeRef.current))
      })
    })
    return () => {
      active = false
      offOpen()
      offTransaction()
    }
  }, [editor])

  const close = () => {
    rangeRef.current = null
    setAnchor(null)
  }
  const selectRange = () => {
    const range = rangeRef.current
    if (!range) return false
    const { doc } = editor.state
    editor.dispatch(editor.state.tr.setSelection(TextSelection.create(doc, range.from, range.to)))
    return true
  }
  const apply = () => {
    if (!selectRange()) return
    const value = href.trim()
    if (value) editor.commands.setLink({ href: value })
    else editor.commands.unsetLink()
    close()
  }

  return (
    <Popover open={!!anchor} anchor={anchor} onClose={close} className="deditor-link-editor">
      <form
        className="deditor-link-form"
        onSubmit={(e) => {
          e.preventDefault()
          apply()
        }}
      >
        <input
          aria-label="Link URL"
          placeholder="Paste a link"
          value={href}
          autoFocus
          onChange={(e) => setHref(e.target.value)}
        />
        <button type="submit" className="deditor-chip-btn is-primary" disabled={!href.trim() && !hadLink.current}>
          Apply
        </button>
        {hadLink.current ? (
          <button
            type="button"
            className="deditor-chip-btn"
            onClick={() => {
              if (selectRange()) editor.commands.unsetLink()
              close()
            }}
          >
            Remove
          </button>
        ) : null}
      </form>
    </Popover>
  )
}
