/** @vitest-environment happy-dom */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

const presetCss = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8')

beforeEach(() => {
  const style = document.createElement('style')
  style.textContent = presetCss
  document.head.append(style)
})

afterEach(() => {
  document.head.replaceChildren()
  document.body.replaceChildren()
})

function documentBackground(
  ancestors: Array<{ theme: 'light' | 'dark'; root?: boolean }>,
  directTheme?: 'light' | 'dark',
) {
  let parent: HTMLElement = document.body
  for (const ancestor of ancestors) {
    const element = document.createElement('div')
    if (ancestor.root) element.className = 'deditor-root'
    element.dataset.theme = ancestor.theme
    parent.append(element)
    parent = element
  }
  const doc = document.createElement('div')
  doc.className = 'deditor-doc'
  if (directTheme) doc.dataset.theme = directTheme
  parent.append(doc)
  return getComputedStyle(doc).backgroundColor
}

describe('preset document theme boundaries', () => {
  it('uses the nearest explicit root or document theme', () => {
    expect([
      documentBackground([{ theme: 'dark' }]),
      documentBackground([], 'dark'),
      documentBackground([{ theme: 'dark' }, { theme: 'light', root: true }]),
      documentBackground([{ theme: 'light' }, { theme: 'dark', root: true }]),
      documentBackground([{ theme: 'dark', root: true }], 'light'),
      documentBackground([{ theme: 'light', root: true }], 'dark'),
    ]).toEqual([
      '#23262b',
      '#23262b',
      '#ffffff',
      '#23262b',
      '#ffffff',
      '#23262b',
    ])
  })
})
