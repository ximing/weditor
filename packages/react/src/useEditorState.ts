import type { Editor } from '@deditor/core'
import { useEffect, useRef, useState } from 'react'
import { useEditor } from './useEditor'

/**
 * Subscribe to editor transactions/selection and re-render when the
 * selector's result changes (Object.is). Selector identity is not
 * significant — the latest closure is always used.
 */
export function useEditorState<T>(selector: (editor: Editor) => T): T {
  const editor = useEditor()
  const selectorRef = useRef(selector)
  selectorRef.current = selector
  const [value, setValue] = useState<T>(() => selector(editor))
  useEffect(() => {
    const update = () => {
      const next = selectorRef.current(editor)
      setValue((prev) => (Object.is(prev, next) ? prev : next))
    }
    const offTx = editor.on('transaction', update)
    const offSel = editor.on('selection', update)
    update()
    return () => {
      offTx()
      offSel()
    }
  }, [editor])
  return value
}
