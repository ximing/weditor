import { Editor, type CollabProvider, type Extension, type JSONContent, type User } from '@weditor/core'
import { collabExtension } from '@weditor/collab'
import { docsPreset } from '@weditor/preset-docs'
import React, { useEffect, useState } from 'react'
import { EditorProvider } from './EditorProvider'
import { EditorSurface } from './EditorSurface'
import { Toolbar } from './chrome/Toolbar'
import { FindBar } from './chrome/FindBar'
import { CommentSidebar } from './chrome/CommentSidebar'
import { CommentComposer } from './chrome/CommentComposer'
import { TableBubble } from './chrome/TableBubble'

export interface DocEditorProps {
  defaultContent?: JSONContent
  content?: JSONContent
  onChange?: (doc: JSONContent) => void
  readOnly?: boolean
  collab?: CollabProvider
  extensions?: Extension[]
  uploadImage?: (file: File) => Promise<{ src: string; alt?: string; width?: number }>
  currentUser?: User
  placeholder?: string
  className?: string
}

export function DocEditor(props: DocEditorProps) {
  if (props.content && props.collab) {
    throw new Error('DocEditor: content + collab is not supported')
  }
  const base = props.extensions ?? docsPreset({ placeholder: props.placeholder ?? 'Start typing…' })
  if (props.collab && base.some((e) => e.name === 'collab')) {
    throw new Error('collab extension already present')
  }
  return <DocEditorBoot {...props} base={base} />
}

function DocEditorBoot(
  props: DocEditorProps & { base: Extension[] },
) {
  const [editor, setEditor] = useState<Editor | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [range, setRange] = useState<{ from: number; to: number } | null>(null)
  const user = props.currentUser ?? { id: 'local', name: 'You' }

  useEffect(() => {
    let cancelled = false
    let instance: Editor | undefined
    ;(async () => {
      try {
        if (props.collab) {
          await props.collab.connect()
          const snap = await props.collab.loadDocument()
          if (cancelled) return
          instance = Editor.create({
            extensions: [...props.base, collabExtension(props.collab, { version: snap.version })],
            content: snap.doc,
          })
          instance.comments.replaceAll(snap.comments)
          instance.comments.deriveDetached(instance.state.doc)
        } else {
          instance = Editor.create({
            extensions: props.base,
            content: props.defaultContent ?? props.content,
          })
        }
        if (cancelled) {
          instance.destroy()
          return
        }
        const off = instance.on('transaction', ({ remote }) => {
          if (!remote) props.onChange?.(instance!.getJSON())
        })
        instance.on('openComment', (r) => setRange(r))
        instance.on('openFind', () => undefined)
        setEditor(instance)
        void off
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err : new Error(String(err)))
      }
    })()
    return () => {
      cancelled = true
      instance?.destroy()
      setEditor(null)
    }
  }, [props.base, props.collab, props.defaultContent])

  useEffect(() => {
    if (!editor) return
    editor.setEditable(!props.readOnly)
  }, [editor, props.readOnly])

  useEffect(() => {
    if (!editor || !props.content || props.collab) return
    if (JSON.stringify(props.content) !== JSON.stringify(editor.getJSON())) {
      editor.setContent(props.content)
    }
  }, [editor, props.content, props.collab])

  if (error) return <div className="weditor-error">{error.message}</div>
  if (!editor) return <div className="weditor-loading">Loading</div>
  return (
    <EditorProvider editor={editor}>
      <div className={['weditor-root', props.className].filter(Boolean).join(' ')}>
        {!props.readOnly ? <Toolbar /> : null}
        <FindBar />
        <TableBubble />
        <EditorSurface />
        <CommentSidebar currentUser={user} readOnly={!!props.readOnly} />
        <CommentComposer currentUser={user} range={range} onClose={() => setRange(null)} />
      </div>
    </EditorProvider>
  )
}
