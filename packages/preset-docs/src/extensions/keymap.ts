import type { Extension } from '@weditor/core'

export function keymapExtension(): Extension {
  return {
    name: 'keymap',
    keymap: ({ editor }) => ({
      'Mod-b': () => editor.commands.toggleStrong(),
      'Mod-i': () => editor.commands.toggleEm(),
      'Mod-u': () => editor.commands.toggleUnderline(),
      'Mod-Shift-x': () => editor.commands.toggleStrike(),
      'Mod-z': () => editor.commands.undo(),
      'Mod-Shift-z': () => editor.commands.redo(),
      'Mod-y': () => editor.commands.redo(),
      'Mod-Alt-0': () => editor.commands.setBlockType({ type: 'paragraph' }),
      'Mod-Alt-1': () => editor.commands.setBlockType({ type: 'heading', level: 1 }),
      'Mod-Alt-2': () => editor.commands.setBlockType({ type: 'heading', level: 2 }),
      'Mod-Alt-3': () => editor.commands.setBlockType({ type: 'heading', level: 3 }),
      'Mod-Alt-4': () => editor.commands.setBlockType({ type: 'heading', level: 4 }),
      'Mod-Alt-5': () => editor.commands.setBlockType({ type: 'heading', level: 5 }),
      'Mod-Alt-6': () => editor.commands.setBlockType({ type: 'heading', level: 6 }),
      'Mod-k': () => {
        const { from, to } = editor.state.selection
        if (from === to) return false
        return true
      },
      'Mod-f': () => {
        editor.emit('openFind', undefined)
        return true
      },
      'Mod-Alt-m': () => {
        const { from, to } = editor.state.selection
        if (from === to) return false
        editor.emit('openComment', { from, to })
        return true
      },
      'Shift-Enter': () => editor.commands.insertHardBreak(),
      Escape: () =>
        typeof editor.commands.clearPainter === 'function' ? editor.commands.clearPainter() : false,
    }),
  }
}
