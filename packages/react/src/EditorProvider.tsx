import { Editor, type Extension, type JSONContent } from '@deditor/core'
import React, { useEffect, useState } from 'react'
import { EditorContext } from './useEditor'

export function EditorProvider(props: {
  editor?: Editor | null
  extensions?: Extension[]
  defaultContent?: JSONContent
  children: React.ReactNode
  onEditor?: (editor: Editor | null) => void
}) {
  const [created, setCreated] = useState<Editor | null>(null)
  useEffect(() => {
    if (props.editor) return
    if (!props.extensions) return
    let cancelled = false
    const instance = Editor.create({ extensions: props.extensions, content: props.defaultContent })
    if (cancelled) {
      instance.destroy()
      return
    }
    setCreated(instance)
    props.onEditor?.(instance)
    return () => {
      cancelled = true
      instance.destroy()
      setCreated(null)
      props.onEditor?.(null)
    }
  }, [props.editor, props.extensions, props.defaultContent])
  const value = props.editor ?? created
  if (!value) return <EditorContext.Provider value={null}>{null}</EditorContext.Provider>
  return <EditorContext.Provider value={value}>{props.children}</EditorContext.Provider>
}
