import type { Node } from 'prosemirror-model'

const ALIGNS = new Set(['left', 'center', 'right', 'justify'])
const LINE_HEIGHTS = new Set([1, 1.15, 1.5, 2, 2.5, 3])

export function styleFromAttrs(node: Node): string | undefined {
  const bits: string[] = []
  if (node.attrs.align) bits.push(`text-align: ${node.attrs.align}`)
  if (node.attrs.lineHeight) bits.push(`line-height: ${node.attrs.lineHeight}`)
  if (node.attrs.indent > 0) bits.push(`padding-left: ${node.attrs.indent * 24}px`)
  return bits.length ? bits.join('; ') : undefined
}

export function blockAttrsFromDom(dom: HTMLElement): {
  align: 'left' | 'center' | 'right' | 'justify' | null
  lineHeight: number | null
  indent: number
} {
  const alignRaw = dom.style.textAlign
  const align = ALIGNS.has(alignRaw)
    ? (alignRaw as 'left' | 'center' | 'right' | 'justify')
    : null
  const lhRaw = dom.style.lineHeight
  const lhNum = lhRaw ? Number(lhRaw) : Number.NaN
  const lineHeight = LINE_HEIGHTS.has(lhNum) ? lhNum : null
  const pad = dom.style.paddingLeft
  const px = pad ? parseFloat(pad) : 0
  const indent = !Number.isNaN(px) && px > 0 ? Math.round(px / 24) : 0
  return { align, lineHeight, indent }
}
