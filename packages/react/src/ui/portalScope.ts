type ContextAnchor = { contextElement?: Element }
type PortalTheme = 'light' | 'dark'

function elementTheme(element: Element | null | undefined): PortalTheme | undefined {
  const theme = element?.getAttribute('data-theme')
  return theme === 'light' || theme === 'dark' ? theme : undefined
}

function closestTheme(element: Element | null | undefined): PortalTheme | undefined {
  let current = element
  while (current) {
    const theme = elementTheme(current)
    if (theme) return theme
    current = current.parentElement
  }
  return undefined
}

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

export function portalTheme(contextElement: Element | null | undefined): PortalTheme | undefined {
  if (!contextElement) return undefined

  const editorRoot = contextElement.closest('.deditor-root')
  const directTheme = elementTheme(editorRoot)
  if (directTheme) return directTheme
  if (editorRoot?.hasAttribute('data-theme')) return 'light'
  return closestTheme(editorRoot?.parentElement ?? contextElement)
}
