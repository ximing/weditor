import { Editor, type CreateEditorOptions, type Extension, type JSONContent } from '@weditor/core'
import React, { useEffect, useState } from 'react'
import { EditorContext } from './useEditor'

export function EditorProvider(props: {
  extensions: Extension[]
  defaultContent?: JSONContent
  children: React.ReactNode
  onEditor?: (editor: Editor | null) => void
}) {
  const [editor, setEditor] = useState<Editor | null>(null)
  const extensions = props.extensions
  const content = props.defaultContent

  useEffect(() => {
    let cancelled = false
    let instance: Editor | undefined
    ;(async () => {
      instance = Editor.create({ extensions, content } satisfies CreateEditorOptions)
      if (cancelled) {
        instance.destroy()
        return
      }
      setEditor(instance)
      props.onEditor?.(instance)
    })()
    return () => {
      cancelled = true
      instance?.destroy()
      setEditor(null)
      props.onEditor?.(null)
    }
    // extensions / content must be referentially stable
  }, [extensions, content])

  if (!editor) return <EditorContext.Provider value={null}>{null}</EditorContext.Provider>
  return <EditorContext.Provider value={editor}>{props.children}</EditorContext.Provider>
}
