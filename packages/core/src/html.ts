import { DOMSerializer, type Schema } from 'prosemirror-model'
import { sanitizeHref, sanitizeSrc } from './sanitize'

export function htmlSerializer(schema: Schema): DOMSerializer {
  const nodes = { ...DOMSerializer.nodesFromSchema(schema) }
  const marks = { ...DOMSerializer.marksFromSchema(schema) }
  for (const name in schema.nodes) {
    if (name === 'text' || nodes[name]) continue
    nodes[name] = (node) =>
      node.isLeaf ? [name, { ...node.attrs }] : [name, { ...node.attrs }, 0]
  }
  delete marks.comment
  const origImg = nodes.image
  if (origImg) {
    nodes.image = (node) => {
      const spec = origImg(node)
      if (!Array.isArray(spec)) return spec
      const [tag, attrs, ...rest] = spec as [string, Record<string, unknown>, ...unknown[]]
      if (tag === 'img' && attrs && typeof attrs === 'object') {
        return ['img', { ...attrs, src: sanitizeSrc(String(attrs.src ?? '')) ?? '' }, ...rest]
      }
      return spec
    }
  }
  const origLink = marks.link
  if (origLink) {
    marks.link = (mark, inline) => {
      const spec = origLink(mark, inline)
      if (!Array.isArray(spec)) return spec
      const [tag, attrs, ...rest] = spec as [string, Record<string, unknown>, ...unknown[]]
      if (tag === 'a' && attrs && typeof attrs === 'object') {
        return ['a', { ...attrs, href: sanitizeHref(String(attrs.href ?? '')) ?? '#' }, ...rest]
      }
      return spec
    }
  }
  return new DOMSerializer(nodes, marks)
}
