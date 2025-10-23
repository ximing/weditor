import type {
  CommentOp,
  JSONContent,
  Presence,
  SendStepsResult,
  Snapshot,
  StepJSON,
  StepsPayload,
  User,
} from '@deditor/core'
import { CommentStore } from '@deditor/core'
import type { Node, Schema } from 'prosemirror-model'
import { Step } from 'prosemirror-transform'
import { applyAuthorityBatch } from './apply-authority-batch'

interface Room {
  version: number
  doc: Node
  steps: StepJSON[]
  clientIDs: string[]
  comments: CommentStore
  presence: Record<string, Presence>
  users: Record<string, User>
}

type Listener = {
  onSteps?: (p: StepsPayload) => void
  onComment?: (op: CommentOp) => void
  onPresence?: (map: Record<string, Presence>) => void
}

export class MemoryAuthority {
  #schema: Schema
  #room: Room
  #mutex: Promise<void> = Promise.resolve()
  #listeners = new Map<string, Listener>()

  constructor(schema: Schema) {
    this.#schema = schema
    this.#room = {
      version: 0,
      doc: schema.node('doc', null, [schema.node('paragraph')]),
      steps: [],
      clientIDs: [],
      comments: new CommentStore(),
      presence: {},
      users: {},
    }
  }

  join(clientID: string, user: User): void {
    this.#room.users[clientID] = user
  }

  leave(clientID: string): void {
    delete this.#room.users[clientID]
    delete this.#room.presence[clientID]
    this.#broadcastPresence()
  }

  subscribe(clientID: string, listener: Listener): () => void {
    this.#listeners.set(clientID, listener)
    return () => this.#listeners.delete(clientID)
  }

  snapshot(): Snapshot {
    return {
      version: this.#room.version,
      doc: toJSONContent(this.#room.doc),
      comments: this.#room.comments.list().map((thread) => {
        const { id, quote, resolved, createdAt, comments } = thread
        return { id, quote, resolved, createdAt, comments }
      }),
    }
  }

  async sendSteps(
    socketClientID: string,
    payload: { version: number; steps: StepJSON[]; clientIDs: string[] },
  ): Promise<SendStepsResult> {
    return this.#run(() => this.#sendSteps(socketClientID, payload))
  }

  getStepsSince(v: number): { reset: false; payload: StepsPayload } | { reset: true; snapshot: Snapshot } {
    if (v > this.#room.version) return { reset: true, snapshot: this.snapshot() }
    return {
      reset: false,
      payload: {
        version: this.#room.version,
        steps: this.#room.steps.slice(v),
        clientIDs: this.#room.clientIDs.slice(v),
      },
    }
  }

  applyComment(op: CommentOp): void {
    this.#room.comments.applyOp(op)
    for (const l of this.#listeners.values()) l.onComment?.(op)
  }

  setPresence(clientID: string, selection: Presence['selection']): void {
    const user = this.#room.users[clientID]
    if (!user) return
    this.#room.presence[clientID] = { clientID, user, selection }
    this.#broadcastPresence()
  }

  #broadcastPresence(): void {
    const map = { ...this.#room.presence }
    for (const l of this.#listeners.values()) l.onPresence?.(map)
  }

  #sendSteps(
    socketClientID: string,
    payload: { version: number; steps: StepJSON[]; clientIDs: string[] },
  ): SendStepsResult {
    if (payload.version > this.#room.version) return { ok: false, reason: 'RESET' }
    if (payload.version < this.#room.version) {
      return { ok: false, reason: 'VERSION_MISMATCH', version: this.#room.version }
    }
    if (payload.steps.length === 0) return { ok: false, reason: 'APPLY_FAILED', error: 'empty batch' }
    let pmSteps: Step[]
    try {
      pmSteps = payload.steps.map((j) => Step.fromJSON(this.#schema, j))
    } catch (err) {
      return { ok: false, reason: 'APPLY_FAILED', error: String(err) }
    }
    const applied = applyAuthorityBatch(this.#room.doc, pmSteps)
    if (!applied.ok) return { ok: false, reason: 'APPLY_FAILED', error: applied.error }
    this.#room.doc = applied.doc
    this.#room.steps.push(...payload.steps)
    const stamped = payload.steps.map(() => socketClientID)
    this.#room.clientIDs.push(...stamped)
    this.#room.version += payload.steps.length
    const broadcast: StepsPayload = {
      version: this.#room.version,
      steps: payload.steps,
      clientIDs: stamped,
    }
    for (const l of this.#listeners.values()) l.onSteps?.(broadcast)
    return { ok: true, version: this.#room.version }
  }

  #run<T>(fn: () => T): Promise<T> {
    const next = this.#mutex.then(fn, fn)
    this.#mutex = next.then(
      () => undefined,
      () => undefined,
    )
    return next
  }
}

function toJSONContent(node: Node): JSONContent {
  const json = node.toJSON() as JSONContent
  stripDefaultAttrs(json, node)
  return json
}

function stripDefaultAttrs(json: JSONContent, node: Node): void {
  if (json.attrs) {
    const spec = node.type.spec.attrs
    if (spec) {
      for (const name of Object.keys(json.attrs)) {
        const attrSpec = spec[name]
        if (
          attrSpec &&
          Object.prototype.hasOwnProperty.call(attrSpec, 'default') &&
          json.attrs[name] === attrSpec.default
        ) {
          delete json.attrs[name]
        }
      }
      if (Object.keys(json.attrs).length === 0) delete json.attrs
    }
  }
  if (json.marks) {
    json.marks.forEach((m, i) => {
      const mark = node.marks[i]
      if (!m.attrs || !mark) return
      const spec = mark.type.spec.attrs
      if (!spec) return
      for (const name of Object.keys(m.attrs)) {
        const attrSpec = spec[name]
        if (
          attrSpec &&
          Object.prototype.hasOwnProperty.call(attrSpec, 'default') &&
          m.attrs[name] === attrSpec.default
        ) {
          delete m.attrs[name]
        }
      }
      if (Object.keys(m.attrs).length === 0) delete m.attrs
    })
  }
  if (json.content) {
    let i = 0
    node.forEach((child) => {
      const childJson = json.content![i++]
      if (childJson) stripDefaultAttrs(childJson, child)
    })
  }
}
