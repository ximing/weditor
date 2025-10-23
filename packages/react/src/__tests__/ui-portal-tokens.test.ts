/** @vitest-environment happy-dom */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'

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
})
