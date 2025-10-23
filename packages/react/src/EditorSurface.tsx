import { formatPainterPluginKey } from '@deditor/preset-docs'
import { useEffect, useRef } from 'react'
import { useEditor } from './useEditor'

export function EditorSurface({ className }: { className?: string }) {
  const editor = useEditor()
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    editor.mount(el)
    return () => editor.unmount()
  }, [editor])
  return (
    <div
      className={['deditor-surface', 'deditor-doc', className].filter(Boolean).join(' ')}
      ref={ref}
      onMouseUp={() => {
        if (!formatPainterPluginKey.getState(editor.state)) return
        if (editor.state.selection.empty) return
        editor.commands.applyFormat()
      }}
    />
  )
}
