import { keymap } from 'prosemirror-keymap'
import type { Schema } from 'prosemirror-model'
import { EditorState, type Plugin, type Transaction } from 'prosemirror-state'
import { EditorView, type DirectEditorProps } from 'prosemirror-view'
import { CommentStore } from './comment-store'
import { htmlSerializer } from './html'
import { schemaFromExtensions } from './schema'
import type {
  CreateEditorOptions,
  DocsCommands,
  EditorEvents,
  Extension,
  JSONContent,
  Snapshot,
} from './types'

export class Editor {
  schema!: Schema
  comments!: CommentStore
  #extensions: Extension[] = []
  #state: EditorState | undefined
  #commands!: DocsCommands
  #editable = true
  #view: EditorView | null = null
  #listeners = new Map<keyof EditorEvents, Set<(payload: never) => void>>()

  static create(options: CreateEditorOptions): Editor {
    if (!options.extensions?.length) {
      throw new Error('Editor.create: extensions must be non-empty')
    }
    const names = new Set<string>()
    const nodeNames = new Set<string>()
    const markNames = new Set<string>()
    for (const ext of options.extensions) {
      if (names.has(ext.name)) throw new Error(`Editor.create: duplicate extension ${ext.name}`)
      names.add(ext.name)
      for (const n of Object.keys(ext.nodes ?? {})) {
        if (nodeNames.has(n)) throw new Error(`Editor.create: duplicate node ${n}`)
        nodeNames.add(n)
      }
      for (const m of Object.keys(ext.marks ?? {})) {
        if (markNames.has(m)) throw new Error(`Editor.create: duplicate mark ${m}`)
        markNames.add(m)
      }
    }
    const editor = new Editor()
    editor.#extensions = options.extensions
    editor.schema = schemaFromExtensions(options.extensions)
    editor.comments = new CommentStore()
    editor.#editable = true

    const plugins: Plugin[] = []
    const raw: Partial<DocsCommands> = {}
    for (const ext of options.extensions) {
      const ctx = { schema: editor.schema, editor }
      plugins.push(...(ext.plugins?.(ctx) ?? []))
      if (ext.keymap) plugins.push(keymap(ext.keymap(ctx)))
      const cmds = ext.commands?.(ctx) ?? {}
      for (const key of Object.keys(cmds) as (keyof DocsCommands)[]) {
        if (key in raw) throw new Error(`Editor.create: duplicate command ${String(key)}`)
        const fn = cmds[key]
        if (fn) (raw as unknown as Record<string, unknown>)[key] = fn
      }
    }
    editor.#commands = wrapCommands(editor, raw)

    const doc = options.content
      ? editor.schema.nodeFromJSON(options.content)
      : editor.schema.node('doc', null, [editor.schema.node('paragraph')])
    editor.#state = EditorState.create({ schema: editor.schema, doc, plugins })
    return editor
  }

  get extensions(): readonly Extension[] {
    return this.#extensions
  }

  get state(): EditorState {
    if (!this.#state) throw new Error('Editor.create: state is not initialized')
    return this.#state
  }

  get commands(): DocsCommands {
    return this.#commands
  }

  get editable(): boolean {
    return this.#editable
  }

  get view(): EditorView | null {
    return this.#view
  }

  setEditable(editable: boolean): void {
    this.#editable = editable
    this.#view?.setProps({ editable: () => this.#editable })
  }

  setContent(doc: JSONContent): void {
    if (this.#extensions.some((e) => e.name === 'collab')) {
      throw new Error('setContent: collab is attached')
    }
    const node = this.schema.nodeFromJSON(doc)
    this.#state = EditorState.create({
      schema: this.schema,
      doc: node,
      plugins: this.state.plugins,
    })
    this.comments.deriveDetached(this.#state.doc)
    this.#view?.updateState(this.#state)
  }

  getJSON(): JSONContent {
    return this.state.doc.toJSON() as JSONContent
  }

  getHTML(): string {
    const ser = htmlSerializer(this.schema)
    const wrap = document.createElement('div')
    wrap.appendChild(ser.serializeFragment(this.state.doc.content))
    return wrap.innerHTML
  }

  dispatch(tr: Transaction): void {
    const oldState = this.state
    this.#state = oldState.apply(tr)
    this.comments.deriveDetached(this.#state.doc)
    for (const ext of this.#extensions) {
      ext.onTransaction?.({ editor: this, tr, oldState })
    }
    this.emit('transaction', {
      tr,
      state: this.#state,
      remote: !!tr.getMeta('deditor-remote'),
    })
    if (tr.selectionSet) this.emit('selection', this.#state.selection)
    this.emit('comments', this.comments.list())
    this.#view?.updateState(this.#state)
  }

  resetFromSnapshot(snap: Snapshot): void {
    for (const ext of this.#extensions) ext.prepareSnapshotReset?.(snap)
    this.comments.replaceAll(snap.comments)
    const plugins: Plugin[] = []
    for (const ext of this.#extensions) {
      const ctx = { schema: this.schema, editor: this }
      plugins.push(...(ext.plugins?.(ctx) ?? []))
      if (ext.keymap) plugins.push(keymap(ext.keymap(ctx)))
    }
    this.#state = EditorState.create({
      schema: this.schema,
      doc: this.schema.nodeFromJSON(snap.doc),
      plugins,
    })
    this.comments.deriveDetached(this.#state.doc)
    this.#view?.updateState(this.#state)
    this.emit('comments', this.comments.list())
    this.emit('sync', { status: 'ok' })
  }

  mount(
    place: HTMLElement,
    viewProps?: Omit<DirectEditorProps, 'state' | 'dispatchTransaction'>,
  ): void {
    this.unmount()
    this.#view = new EditorView(place, {
      ...viewProps,
      state: this.state,
      editable: () => this.#editable,
      dispatchTransaction: (tr) => this.dispatch(tr),
    })
  }

  unmount(): void {
    this.#view?.destroy()
    this.#view = null
  }

  destroy(): void {
    this.unmount()
    for (const ext of this.#extensions) ext.destroy?.({ editor: this })
    this.#listeners.clear()
  }

  emit<K extends keyof EditorEvents>(event: K, payload: EditorEvents[K]): void {
    const set = this.#listeners.get(event)
    if (!set) return
    for (const h of set) (h as (p: EditorEvents[K]) => void)(payload)
  }

  on<K extends keyof EditorEvents>(
    event: K,
    handler: (payload: EditorEvents[K]) => void,
  ): () => void {
    let set = this.#listeners.get(event)
    if (!set) {
      set = new Set()
      this.#listeners.set(event, set)
    }
    set.add(handler as (payload: never) => void)
    return () => {
      set!.delete(handler as (payload: never) => void)
    }
  }
}

function wrapCommands(editor: Editor, raw: Partial<DocsCommands>): DocsCommands {
  const wrapped = {} as DocsCommands
  for (const key of Object.keys(raw) as (keyof DocsCommands)[]) {
    const inner = raw[key]
    if (!inner) continue
    ;(wrapped as unknown as Record<string, unknown>)[key] = (...args: unknown[]) => {
      if (!editor.editable) return false
      return (inner as (...a: unknown[]) => boolean)(...args)
    }
  }
  return wrapped
}
