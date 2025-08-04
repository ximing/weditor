import type { EditorState, Selection, Transaction } from 'prosemirror-state'
import type { EditorView } from 'prosemirror-view'
import type { MarkSpec, NodeSpec, Schema } from 'prosemirror-model'
import type { Editor } from './editor'

export interface JSONContent {
  type: string
  attrs?: Record<string, unknown>
  content?: JSONContent[]
  marks?: { type: string; attrs?: Record<string, unknown> }[]
  text?: string
}

export interface User {
  id: string
  name: string
  color?: string
}

export interface Comment {
  id: string
  author: User
  body: string
  createdAt: number
}

export interface CommentThread {
  id: string
  quote: string
  resolved: boolean
  detached: boolean
  createdAt: number
  comments: Comment[]
}

export type CommentThreadWire = Omit<CommentThread, 'detached'>

export type CommentOp =
  | { type: 'createThread'; thread: CommentThreadWire }
  | { type: 'appendComment'; id: string; comment: Comment }
  | { type: 'setResolved'; id: string; resolved: boolean }
  | { type: 'deleteThread'; id: string }

export type Command = (
  state: EditorState,
  dispatch?: (tr: Transaction) => void,
  view?: EditorView,
) => boolean

export interface DocsCommands {
  undo: () => boolean
  redo: () => boolean
  toggleStrong: () => boolean
  toggleEm: () => boolean
  toggleUnderline: () => boolean
  toggleStrike: () => boolean
  toggleCode: () => boolean
  toggleSuperscript: () => boolean
  toggleSubscript: () => boolean
  setFontSize: (size: string | null) => boolean
  setFontFamily: (family: string | null) => boolean
  setColor: (color: string | null) => boolean
  setHighlight: (color: string | null) => boolean
  setLink: (args: { href: string }) => boolean
  unsetLink: () => boolean
  setBlockType: (args: {
    type: 'paragraph' | 'heading' | 'code_block'
    level?: 1 | 2 | 3 | 4 | 5 | 6
  }) => boolean
  toggleBlockquote: () => boolean
  toggleCodeBlock: () => boolean
  setAlign: (args: { align: 'left' | 'center' | 'right' | 'justify' | null }) => boolean
  setLineHeight: (args: { lineHeight: number | null }) => boolean
  setIndent: (args: { indent: number }) => boolean
  indent: () => boolean
  outdent: () => boolean
  toggleBulletList: () => boolean
  toggleOrderedList: () => boolean
  toggleTaskList: () => boolean
  sinkListItem: () => boolean
  liftListItem: () => boolean
  splitListItem: () => boolean
  toggleTaskChecked: () => boolean
  insertTable: (args?: { rows?: number; cols?: number }) => boolean
  addColumnBefore: () => boolean
  addColumnAfter: () => boolean
  deleteColumn: () => boolean
  addRowBefore: () => boolean
  addRowAfter: () => boolean
  deleteRow: () => boolean
  mergeCells: () => boolean
  splitCell: () => boolean
  toggleHeaderRow: () => boolean
  insertImage: (args: { src: string; alt?: string; width?: number }) => boolean
  insertMention: (args: { id: string; name: string }) => boolean
  insertHorizontalRule: () => boolean
  insertHardBreak: () => boolean
  copyFormat: () => boolean
  applyFormat: () => boolean
  clearPainter: () => boolean
  clearFormat: () => boolean
  setSearchQuery: (q: string) => boolean
  findNext: () => boolean
  findPrev: () => boolean
  replace: (args: { with: string }) => boolean
  replaceAll: (args: { with: string }) => boolean
  addComment: (args: { body: string; author: User; from?: number; to?: number }) => boolean
  toggleCommentResolved: (args: { id: string }) => boolean
  replyToComment: (args: { id: string; body: string; author: User }) => boolean
  deleteComment: (args: { id: string }) => boolean
}

export interface CreateEditorOptions {
  extensions: Extension[]
  content?: JSONContent
}

export interface EditorEvents {
  transaction: { tr: Transaction; state: EditorState; remote: boolean }
  selection: Selection
  comments: CommentThread[]
  sync: { status: 'ok' | 'syncing' | 'disconnected' | 'error'; error?: Error }
  openFind: undefined
  openComment: { from: number; to: number }
}

export interface Extension {
  name: string
  nodes?: Record<string, NodeSpec>
  marks?: Record<string, MarkSpec>
  plugins?: (ctx: { schema: Schema; editor: Editor }) => import('prosemirror-state').Plugin[]
  commands?: (ctx: { schema: Schema; editor: Editor }) => Partial<DocsCommands>
  keymap?: (ctx: { schema: Schema; editor: Editor }) => {
    [key: string]: Command | (() => boolean)
  }
  onTransaction?: (ctx: {
    editor: Editor
    tr: Transaction
    oldState: EditorState
  }) => void
  prepareSnapshotReset?: (snap: Snapshot) => void
  destroy?: (ctx: { editor: Editor }) => void
}

export interface StepJSON {
  stepType: string
  [k: string]: unknown
}

export interface SelectionJSON {
  type: string
  anchor: number
  head: number
  [k: string]: unknown
}

export interface Presence {
  clientID: string
  user: User
  selection: SelectionJSON | null
}

export interface StepsPayload {
  version: number
  steps: StepJSON[]
  clientIDs: string[]
}

export interface Snapshot {
  version: number
  doc: JSONContent
  comments: CommentThreadWire[]
}

export type SendStepsResult =
  | { ok: true; version: number }
  | { ok: false; reason: 'VERSION_MISMATCH'; version: number }
  | { ok: false; reason: 'APPLY_FAILED'; error: string }
  | { ok: false; reason: 'RESET' }

export interface CollabProvider {
  readonly clientID: string
  connect(): Promise<void>
  disconnect(): void
  loadDocument(): Promise<Snapshot>
  getStepsSince(version: number): Promise<
    | { reset: false; payload: StepsPayload }
    | { reset: true; snapshot: Snapshot }
  >
  sendSteps(payload: {
    version: number
    steps: StepJSON[]
    clientIDs: string[]
  }): Promise<SendStepsResult>
  onSteps(cb: (payload: StepsPayload) => void): () => void
  sendComment(op: CommentOp): Promise<void>
  onComment(cb: (op: CommentOp) => void): () => void
  sendPresence(presence: Presence): void
  onPresence(cb: (map: Record<string, Presence>) => void): () => void
  onConnection(cb: (status: 'connected' | 'disconnected') => void): () => void
}
