import { Schema, type MarkSpec, type NodeSpec } from 'prosemirror-model'
import type { Extension } from './types'

export function schemaFromExtensions(extensions: Extension[]): Schema {
  const nodes: Record<string, NodeSpec> = {}
  const marks: Record<string, MarkSpec> = {}
  for (const ext of extensions) {
    Object.assign(nodes, ext.nodes)
    Object.assign(marks, ext.marks)
  }
  if (!nodes.text) nodes.text = { group: 'inline' }
  if (!nodes.doc) throw new Error('schemaFromExtensions: no doc node')
  return new Schema({ nodes, marks })
}
