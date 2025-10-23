import {
  COLORS_STANDARD,
  COLORS_THEME,
  FONT_FAMILIES,
  FONT_SIZES,
  HIGHLIGHTS,
} from '@deditor/preset-docs'
import type { MouseEvent } from 'react'
import {
  IconAlignCenter,
  IconAlignJustify,
  IconAlignLeft,
  IconAlignRight,
  IconBold,
  IconBulletList,
  IconClearFormat,
  IconComment,
  IconFind,
  IconHighlight,
  IconIndent,
  IconItalic,
  IconLink,
  IconOrderedList,
  IconOutdent,
  IconPaint,
  IconPrint,
  IconRedo,
  IconStrike,
  IconTable,
  IconTaskList,
  IconTextColor,
  IconUnderline,
  IconUndo,
} from '../icons'
import { useEditor } from '../useEditor'
import { useEditorState } from '../useEditorState'
import { IconButton } from '../ui/IconButton'
import { Select } from '../ui/Select'
import { ColorPalette } from './ColorPalette'
import { ImageInsert } from './ImageInsert'
import { OverflowMore } from './OverflowMore'
import {
  activeAlign,
  activeBlock,
  activeList,
  activeMarkAttr,
  isMarkActive,
} from './toolbar-state'

const BLOCK_OPTIONS = [
  { value: 'paragraph', label: 'Paragraph' },
  { value: 'heading:1', label: 'Heading 1' },
  { value: 'heading:2', label: 'Heading 2' },
  { value: 'heading:3', label: 'Heading 3' },
  { value: 'heading:4', label: 'Heading 4' },
  { value: 'heading:5', label: 'Heading 5' },
  { value: 'heading:6', label: 'Heading 6' },
  { value: 'blockquote', label: 'Quote' },
  { value: 'code_block', label: 'Code block' },
] as const

const FONT_OPTIONS = FONT_FAMILIES.map((f) => ({ value: f as string, label: f as string }))
const SIZE_OPTIONS = FONT_SIZES.map((n) => ({ value: `${n}pt`, label: String(n) }))

export function Toolbar(props: {
  uploadImage?: (file: File) => Promise<{ src: string; alt?: string; width?: number }>
}) {
  const editor = useEditor()
  const run = (fn: () => void) => (e: MouseEvent) => {
    e.preventDefault()
    fn()
  }

  const strong = useEditorState((e) => isMarkActive(e, 'strong'))
  const em = useEditorState((e) => isMarkActive(e, 'em'))
  const underline = useEditorState((e) => isMarkActive(e, 'underline'))
  const strike = useEditorState((e) => isMarkActive(e, 'strike'))
  const block = useEditorState(activeBlock)
  const align = useEditorState(activeAlign)
  const list = useEditorState(activeList)
  const fontFamily = useEditorState((e) => activeMarkAttr(e, 'fontFamily', 'family')) ?? 'Arial'
  const fontSize = useEditorState((e) => activeMarkAttr(e, 'fontSize', 'size')) ?? '11pt'
  const color = useEditorState((e) => activeMarkAttr(e, 'color', 'color'))
  const highlight = useEditorState((e) => activeMarkAttr(e, 'highlight', 'color'))

  const setBlock = (v: string) => {
    if (v === 'paragraph') editor.commands.setBlockType({ type: 'paragraph' })
    else if (v === 'blockquote') editor.commands.toggleBlockquote()
    else if (v === 'code_block') editor.commands.toggleCodeBlock()
    else if (v.startsWith('heading:')) {
      editor.commands.setBlockType({
        type: 'heading',
        level: Number(v.slice(8)) as 1 | 2 | 3 | 4 | 5 | 6,
      })
    }
  }

  return (
    <div className="deditor-toolbar" role="toolbar">
      <div className="deditor-toolbar-group" data-tb-group="history">
        <IconButton icon={IconUndo} label="Undo" onMouseDown={run(() => editor.commands.undo())} />
        <IconButton icon={IconRedo} label="Redo" onMouseDown={run(() => editor.commands.redo())} />
      </div>
      <div className="deditor-toolbar-divider" />
      <div className="deditor-toolbar-group" data-tb-group="format">
        <IconButton icon={IconPaint} label="Paint format" onMouseDown={run(() => editor.commands.copyFormat())} />
        <IconButton icon={IconClearFormat} label="Clear formatting" onMouseDown={run(() => editor.commands.clearFormat())} />
      </div>
      <div className="deditor-toolbar-divider" />
      <div className="deditor-toolbar-group" data-tb-group="block">
        <Select label="Block type" value={block} options={BLOCK_OPTIONS} onChange={setBlock} width={120} />
      </div>
      <div className="deditor-toolbar-group" data-tb-group="font">
        <Select label="Font family" value={fontFamily} options={FONT_OPTIONS} onChange={(v) => editor.commands.setFontFamily(v)} width={130} />
        <Select label="Font size" value={fontSize} options={SIZE_OPTIONS} onChange={(v) => editor.commands.setFontSize(v)} width={64} />
      </div>
      <div className="deditor-toolbar-divider" />
      <div className="deditor-toolbar-group" data-tb-group="marks">
        <IconButton icon={IconBold} label="Bold" active={strong} onMouseDown={run(() => editor.commands.toggleStrong())} />
        <IconButton icon={IconItalic} label="Italic" active={em} onMouseDown={run(() => editor.commands.toggleEm())} />
        <IconButton icon={IconUnderline} label="Underline" active={underline} onMouseDown={run(() => editor.commands.toggleUnderline())} />
        <IconButton icon={IconStrike} label="Strikethrough" active={strike} onMouseDown={run(() => editor.commands.toggleStrike())} />
        <ColorPalette
          icon={IconTextColor}
          title="Text color"
          current={color}
          colors={[...COLORS_STANDARD, ...COLORS_THEME]}
          onDefault={() => editor.commands.setColor(null)}
          onPick={(c) => editor.commands.setColor(c)}
        />
        <ColorPalette
          icon={IconHighlight}
          title="Highlight"
          current={highlight}
          colors={[...HIGHLIGHTS]}
          onDefault={() => editor.commands.setHighlight(null)}
          onPick={(c) => editor.commands.setHighlight(c)}
        />
      </div>
      <div className="deditor-toolbar-divider" />
      <div className="deditor-toolbar-group" data-tb-group="align">
        <IconButton icon={IconAlignLeft} label="Align left" active={align === 'left'} onMouseDown={run(() => editor.commands.setAlign({ align: 'left' }))} />
        <IconButton icon={IconAlignCenter} label="Align center" active={align === 'center'} onMouseDown={run(() => editor.commands.setAlign({ align: 'center' }))} />
        <IconButton icon={IconAlignRight} label="Align right" active={align === 'right'} onMouseDown={run(() => editor.commands.setAlign({ align: 'right' }))} />
        <IconButton icon={IconAlignJustify} label="Align justify" active={align === 'justify'} onMouseDown={run(() => editor.commands.setAlign({ align: 'justify' }))} />
      </div>
      <div className="deditor-toolbar-divider" />
      <div className="deditor-toolbar-group" data-tb-group="lists">
        <IconButton icon={IconBulletList} label="Bullet list" active={list === 'bullet_list'} onMouseDown={run(() => editor.commands.toggleBulletList())} />
        <IconButton icon={IconOrderedList} label="Ordered list" active={list === 'ordered_list'} onMouseDown={run(() => editor.commands.toggleOrderedList())} />
        <IconButton icon={IconTaskList} label="Task list" active={list === 'task_list'} onMouseDown={run(() => editor.commands.toggleTaskList())} />
        <IconButton icon={IconIndent} label="Indent" onMouseDown={run(() => editor.commands.indent())} />
        <IconButton icon={IconOutdent} label="Outdent" onMouseDown={run(() => editor.commands.outdent())} />
      </div>
      <div className="deditor-toolbar-divider" />
      <div className="deditor-toolbar-group" data-tb-group="insert">
        <IconButton
          icon={IconLink}
          label="Link"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            const { from, to } = editor.state.selection
            editor.emit('openLink', { from, to })
          }}
        />
        <ImageInsert uploadImage={props.uploadImage} />
        <IconButton icon={IconTable} label="Insert table" onMouseDown={run(() => editor.commands.insertTable())} />
      </div>
      <div className="deditor-toolbar-divider" />
      <div className="deditor-toolbar-group" data-tb-group="tools">
        <IconButton
          icon={IconComment}
          label="Comment"
          onMouseDown={(e) => {
            e.preventDefault()
            const { from, to } = editor.state.selection
            if (from === to) return
            editor.emit('openComment', { from, to })
          }}
        />
        <IconButton
          icon={IconFind}
          label="Find"
          onMouseDown={(e) => {
            e.preventDefault()
            editor.emit('openFind', undefined)
          }}
        />
        <IconButton icon={IconPrint} label="Print" onClick={() => window.print()} />
      </div>
      <div className="deditor-toolbar-divider" />
      <OverflowMore />
    </div>
  )
}
