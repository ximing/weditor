/** @vitest-environment happy-dom */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { portalTheme } from '../ui/portalScope'

const tokenCss = readFileSync(resolve(process.cwd(), 'src/tokens.css'), 'utf8')

afterEach(() => {
  document.head.replaceChildren()
  document.body.replaceChildren()
})

describe('editor and portal token scopes', () => {
  it('keeps explicit light isolated while allowing unthemed scopes to inherit dark', () => {
    const style = document.createElement('style')
    style.textContent = tokenCss
    document.head.append(style)
    const darkAncestor = document.createElement('div')
    darkAncestor.setAttribute('data-theme', 'dark')
    const explicitLightPortal = document.createElement('div')
    explicitLightPortal.className = 'deditor-portal-scope'
    explicitLightPortal.setAttribute('data-theme', 'light')
    const inheritedDarkPortal = document.createElement('div')
    inheritedDarkPortal.className = 'deditor-portal-scope'
    const explicitLightEditor = document.createElement('div')
    explicitLightEditor.className = 'deditor-root'
    explicitLightEditor.setAttribute('data-theme', 'light')
    const inheritedDarkEditor = document.createElement('div')
    inheritedDarkEditor.className = 'deditor-root'
    darkAncestor.append(
      explicitLightPortal,
      inheritedDarkPortal,
      explicitLightEditor,
      inheritedDarkEditor,
    )
    document.body.append(darkAncestor)

    for (const scope of [explicitLightPortal, explicitLightEditor]) {
      expect(getComputedStyle(scope).getPropertyValue('--deditor-bg-surface').trim()).toBe('#ffffff')
    }
    for (const scope of [inheritedDarkPortal, inheritedDarkEditor]) {
      expect(getComputedStyle(scope).getPropertyValue('--deditor-bg-surface').trim()).toBe('#23262b')
    }
  })

  it('copies an inherited editor theme onto a body-level portal outside that ancestor', () => {
    const style = document.createElement('style')
    style.textContent = tokenCss
    document.head.append(style)
    const darkAncestor = document.createElement('div')
    darkAncestor.setAttribute('data-theme', 'dark')
    const editor = document.createElement('div')
    editor.className = 'deditor-root'
    const anchor = document.createElement('button')
    editor.append(anchor)
    darkAncestor.append(editor)
    const bodyPortal = document.createElement('div')
    bodyPortal.className = 'deditor-portal-scope'
    document.body.append(darkAncestor, bodyPortal)

    const resolvedTheme = portalTheme(anchor)
    if (resolvedTheme) bodyPortal.setAttribute('data-theme', resolvedTheme)

    expect(darkAncestor.contains(bodyPortal)).toBe(false)
    expect(resolvedTheme).toBe('dark')
    expect(bodyPortal.getAttribute('data-theme')).toBe('dark')
    expect(getComputedStyle(bodyPortal).getPropertyValue('--deditor-bg-surface').trim()).toBe(
      '#23262b',
    )
  })

  it('ignores invalid direct values when resolving the nearest valid theme', () => {
    const darkAncestor = document.createElement('div')
    darkAncestor.setAttribute('data-theme', 'dark')
    const editor = document.createElement('div')
    editor.className = 'deditor-root'
    editor.setAttribute('data-theme', 'sepia')
    const anchor = document.createElement('button')
    editor.append(anchor)
    darkAncestor.append(editor)
    document.body.append(darkAncestor)

    expect(portalTheme(anchor)).toBe('dark')
    editor.setAttribute('data-theme', 'light')
    expect(portalTheme(anchor)).toBe('light')
    editor.removeAttribute('data-theme')
    darkAncestor.setAttribute('data-theme', 'sepia')
    expect(portalTheme(anchor)).toBeUndefined()
  })
})
