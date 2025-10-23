type ContextAnchor = { contextElement?: Element }

export function anchorContextElement(anchor: Element | ContextAnchor): Element | undefined {
  if (
    'nodeType' in anchor &&
    anchor.nodeType === 1 &&
    'closest' in anchor &&
    typeof anchor.closest === 'function'
  ) {
    return anchor as Element
  }
  return anchor.contextElement
}

export function portalTheme(contextElement: Element | null | undefined): string | undefined {
  return contextElement?.closest('.deditor-root')?.getAttribute('data-theme') ?? undefined
}
