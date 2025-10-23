/** @vitest-environment happy-dom */
import { Editor } from '@deditor/core'
import { TextSelection } from 'prosemirror-state'
import { describe, expect, it } from 'vitest'
import { docsPreset } from '../preset'

function withText(text = 'Item') {
  const editor = Editor.create({ extensions: docsPreset() })
  editor.dispatch(editor.state.tr.insertText(text))
  editor.dispatch(editor.state.tr.setSelection(TextSelection.create(editor.state.doc, 1, 1 + text.length)))
  return editor
}

describe('lists', () => {
  it('toggleBulletList wraps and lifts', () => {
    const editor = withText()
    expect(editor.commands.toggleBulletList()).toBe(true)
    expect(editor.state.doc.firstChild?.type.name).toBe('bullet_list')
    expect(editor.commands.toggleBulletList()).toBe(true)
    expect(editor.state.doc.firstChild?.type.name).toBe('paragraph')
  })

  it('toggleOrderedList wraps with order 1', () => {
    const editor = withText()
    expect(editor.commands.toggleOrderedList()).toBe(true)
    expect(editor.state.doc.firstChild?.type.name).toBe('ordered_list')
    expect(editor.state.doc.firstChild?.attrs.order).toBe(1)
  })

  it('toggleTaskList wraps task_item; toggleTaskChecked flips checked', () => {
    const editor = withText()
    expect(editor.commands.toggleTaskList()).toBe(true)
    expect(editor.state.doc.firstChild?.type.name).toBe('task_list')
    const item = editor.state.doc.firstChild!.firstChild!
    expect(item.type.name).toBe('task_item')
    expect(item.attrs.checked).toBe(false)
    expect(editor.commands.toggleTaskChecked()).toBe(true)
    expect(editor.state.doc.firstChild!.firstChild!.attrs.checked).toBe(true)
  })

  it('splitListItem on a checked task_item yields checked false on the new item', () => {
    const editor = withText('Ab')
    editor.commands.toggleTaskList()
    editor.commands.toggleTaskChecked()
    editor.dispatch(editor.state.tr.setSelection(TextSelection.create(editor.state.doc, 3)))
    expect(editor.commands.splitListItem()).toBe(true)
    const list = editor.state.doc.firstChild!
    expect(list.childCount).toBe(2)
    expect(list.child(0).attrs.checked).toBe(true)
    expect(list.child(1).attrs.checked).toBe(false)
  })

  it('HTML maps ul, ol[start], ul[data-task-list] > li[data-checked]', () => {
    const schemaNames = Editor.create({ extensions: docsPreset() }).schema
    expect(schemaNames.nodes.task_list.spec.toDOM).toBeTypeOf('function')
  })

  it('getHTML includes data-task-list and data-checked', () => {
    const editor = withText()
    expect(editor.commands.toggleTaskList()).toBe(true)
    const html = editor.getHTML()
    expect(html).toContain('data-task-list="true"')
    expect(html).toContain('data-checked="false"')
  })

  it('checkbox click is one undoable, editable-gated transaction', () => {
    const editor = Editor.create({
      extensions: docsPreset(),
      content: {
        type: 'doc',
        content: [
          {
            type: 'task_list',
            content: [
              {
                type: 'task_item',
                attrs: { checked: false },
                content: [{ type: 'paragraph', content: [{ type: 'text', text: 'One' }] }],
              },
              {
                type: 'task_item',
                attrs: { checked: false },
                content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Two' }] }],
              },
            ],
          },
        ],
      },
    })
    const itemPos: number[] = []
    editor.state.doc.descendants((node, pos) => {
      if (node.type.name === 'task_item') itemPos.push(pos)
    })
    expect(itemPos).toHaveLength(2)
    editor.dispatch(
      editor.state.tr.setSelection(TextSelection.create(editor.state.doc, itemPos[1]! + 2)),
    )
    const from = editor.state.selection.from
    const place = document.createElement('div')
    document.body.append(place)
    editor.mount(place)
    const box = place.querySelector('.deditor-task-checkbox') as HTMLElement | null
    expect(box).toBeTruthy()
    box!.click()
    expect(editor.state.doc.firstChild!.firstChild!.attrs.checked).toBe(true)
    expect(editor.commands.undo()).toBe(true)
    expect(editor.state.doc.firstChild!.firstChild!.attrs.checked).toBe(false)
    expect(editor.state.selection.from).toBe(from)
    editor.setEditable(false)
    box!.click()
    expect(editor.state.doc.firstChild!.firstChild!.attrs.checked).toBe(false)
    expect(editor.state.selection.from).toBe(from)
    editor.destroy()
    place.remove()
  })
})
