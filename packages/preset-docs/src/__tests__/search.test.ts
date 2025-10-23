import { Editor } from '@deditor/core'
import { PluginKey } from 'prosemirror-state'
import { describe, expect, it } from 'vitest'
import { docsPreset, findAll, searchPluginKey } from '../index'

describe('find/replace', () => {
  it('searchPluginKey is a PluginKey exported from preset-docs', () => {
    expect(searchPluginKey).toBeInstanceOf(PluginKey)
  })

  it('search sits before formatPainter in docsPreset', () => {
    const names = docsPreset().map((e) => e.name)
    expect(names.indexOf('search')).toBeGreaterThan(-1)
    expect(names.indexOf('search')).toBeLessThan(names.indexOf('formatPainter'))
  })

  it('empty query yields no matches and findNext returns false', () => {
    const editor = Editor.create({ extensions: docsPreset() })
    editor.dispatch(editor.state.tr.insertText('Hello Hello'))
    expect(editor.commands.setSearchQuery('')).toBe(true)
    expect(findAll(editor.state)).toEqual([])
    expect(editor.commands.findNext()).toBe(false)
  })

  it('case-insensitive wrap-around findNext / findPrev', () => {
    const editor = Editor.create({ extensions: docsPreset() })
    editor.dispatch(editor.state.tr.insertText('Hello hello HELLO'))
    expect(editor.commands.setSearchQuery('hello')).toBe(true)
    const matches = findAll(editor.state)
    expect(matches.length).toBe(3)
    expect(editor.commands.findNext()).toBe(true)
    const first = editor.state.selection
    expect(editor.commands.findNext()).toBe(true)
    expect(editor.commands.findNext()).toBe(true)
    expect(editor.commands.findNext()).toBe(true)
    expect(editor.state.selection.from).toBe(first.from)
    expect(editor.commands.findPrev()).toBe(true)
  })

  it('replace only replaces when the selection is a match, else findNext', () => {
    const editor = Editor.create({ extensions: docsPreset() })
    editor.dispatch(editor.state.tr.insertText('cat dog cat'))
    editor.commands.setSearchQuery('cat')
    editor.commands.findNext()
    expect(editor.commands.replace({ with: 'x' })).toBe(true)
    expect(editor.state.doc.textContent.startsWith('x')).toBe(true)
  })

  it('replaceAll is one transaction / one undo item', () => {
    const editor = Editor.create({ extensions: docsPreset() })
    editor.dispatch(editor.state.tr.insertText('ab ab ab'))
    editor.commands.setSearchQuery('ab')
    expect(editor.commands.replaceAll({ with: 'Q' })).toBe(true)
    expect(editor.state.doc.textContent).toBe('Q Q Q')
    expect(editor.commands.undo()).toBe(true)
    expect(editor.state.doc.textContent).toBe('ab ab ab')
    expect(editor.commands.undo()).toBe(true)
    expect(editor.state.doc.textContent).toBe('')
  })

  it('replace without an active match only findNexts', () => {
    const editor = Editor.create({ extensions: docsPreset() })
    editor.dispatch(editor.state.tr.insertText('cat dog cat'))
    editor.commands.setSearchQuery('cat')
    expect(editor.commands.replace({ with: 'x' })).toBe(true)
    expect(editor.state.doc.textContent).toBe('cat dog cat')
    expect(editor.state.selection.from).toBe(findAll(editor.state)[0].from)
  })

  it('setSearchQuery returns false if the search plugin is missing', () => {
    const editor = Editor.create({
      extensions: docsPreset().filter((e) => e.name !== 'search'),
    })
    expect(editor.commands.setSearchQuery).toBeUndefined()
  })
})
