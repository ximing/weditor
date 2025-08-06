/** @vitest-environment happy-dom */
import { Plugin } from 'prosemirror-state'
import { describe, expect, it } from 'vitest'
import { Editor } from '../editor'
import type { Extension } from '../types'

const nodes: Extension = {
  name: 'nodes',
  nodes: {
    doc: { content: 'block+' },
    paragraph: { group: 'block', content: 'inline*' },
  },
}

describe('Editor.create', () => {
  it('throws on empty extensions, duplicate extension names, duplicate node names, duplicate mark names, duplicate commands', () => {
    expect(() => Editor.create({ extensions: [] })).toThrow(/extensions/)
    expect(() => Editor.create({ extensions: [nodes, { name: 'nodes' }] })).toThrow(/duplicate/)
    expect(() =>
      Editor.create({
        extensions: [
          nodes,
          { name: 'other', nodes: { paragraph: { group: 'block', content: 'inline*' } } },
        ],
      }),
    ).toThrow(/duplicate/)
    expect(() =>
      Editor.create({
        extensions: [
          nodes,
          { name: 'm1', marks: { em: {} } },
          { name: 'm2', marks: { em: {} } },
        ],
      }),
    ).toThrow(/duplicate/)
    expect(() =>
      Editor.create({
        extensions: [
          nodes,
          {
            name: 'c1',
            commands: () => ({ toggleStrong: () => true }),
          },
          {
            name: 'c2',
            commands: () => ({ toggleStrong: () => true }),
          },
        ],
      }),
    ).toThrow(/duplicate/)
  })

  it('seeds doc > paragraph when content is omitted', () => {
    const editor = Editor.create({ extensions: [nodes] })
    expect(editor.state.doc.childCount).toBe(1)
    expect(editor.state.doc.firstChild?.type.name).toBe('paragraph')
    expect(editor.getJSON()).toEqual({ type: 'doc', content: [{ type: 'paragraph' }] })
  })

  it('throws if plugins() reads editor.state during create', () => {
    const bad: Extension = {
      name: 'bad',
      plugins: ({ editor }) => {
        void editor.state
        return []
      },
    }
    expect(() => Editor.create({ extensions: [nodes, bad] })).toThrow(
      /state is not initialized/,
    )
  })

  it('wraps commands so setEditable(false) returns false without calling them', () => {
    let called = 0
    const ext: Extension = {
      name: 'cmds',
      commands: () => ({
        toggleStrong: () => {
          called += 1
          return true
        },
      }),
    }
    const editor = Editor.create({ extensions: [nodes, ext] })
    expect(editor.commands.toggleStrong()).toBe(true)
    expect(called).toBe(1)
    editor.setEditable(false)
    expect(editor.editable).toBe(false)
    expect(editor.commands.toggleStrong()).toBe(false)
    expect(called).toBe(1)
  })

  it('setContent throws when a collab-named extension is registered', () => {
    const editor = Editor.create({
      extensions: [nodes, { name: 'collab' }],
    })
    expect(() => editor.setContent({ type: 'doc', content: [{ type: 'paragraph' }] })).toThrow(
      /collab/,
    )
  })

  it('loads JSON content and getJSON round-trips', () => {
    const editor = Editor.create({
      extensions: [nodes],
      content: {
        type: 'doc',
        content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Hi' }] }],
      },
    })
    expect(editor.state.doc.textContent).toBe('Hi')
    expect(editor.getJSON().content?.[0]).toMatchObject({ type: 'paragraph' })
  })
})

describe('plugin and keymap order', () => {
  it('pushes plugins() then that extension keymap immediately after', () => {
    const order: string[] = []
    const a: Extension = {
      name: 'a',
      plugins: () => [
        new Plugin({
          props: {
            handleKeyDown() {
              order.push('a-plugin')
              return false
            },
          },
        }),
      ],
      keymap: () => ({
        Enter: () => {
          order.push('a-key')
          return false
        },
      }),
    }
    const editor = Editor.create({ extensions: [nodes, a] })
    const event = new KeyboardEvent('keydown', { key: 'Enter' })
    for (const plugin of editor.state.plugins) {
      plugin.props.handleKeyDown?.(
        { state: editor.state } as never,
        event,
      )
    }
    expect(order[0]).toBe('a-plugin')
  })
})
