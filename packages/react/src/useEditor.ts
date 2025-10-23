import { createContext, useContext } from 'react'
import type { Editor } from '@deditor/core'

export const EditorContext = createContext<Editor | null>(null)

export function useEditor(): Editor {
  const editor = useContext(EditorContext)
  if (!editor) throw new Error('useEditor: missing EditorProvider')
  return editor
}

export function useEditorOptional(): Editor | null {
  return useContext(EditorContext)
}
