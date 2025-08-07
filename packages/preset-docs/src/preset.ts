import { schemaFromExtensions, type Extension } from '@weditor/core'
import { marksExtension } from './extensions/marks'
import { nodesExtension } from './extensions/nodes'

export function docsPreset(): Extension[] {
  return [nodesExtension(), marksExtension()]
}

export function docsSchema() {
  return schemaFromExtensions(docsPreset())
}
