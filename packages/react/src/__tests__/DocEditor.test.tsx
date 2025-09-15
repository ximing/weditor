/** @vitest-environment happy-dom */
import { docsPreset } from '@weditor/preset-docs'
import { render, waitFor } from '@testing-library/react'
import React from 'react'
import { describe, expect, it } from 'vitest'
import { DocEditor } from '../DocEditor'
import type { CollabProvider } from '@weditor/core'

describe('DocEditor', () => {
  it('throws when content and collab are both set', () => {
    const collab = { clientID: 'x' } as CollabProvider
    expect(() =>
      render(<DocEditor content={{ type: 'doc', content: [{ type: 'paragraph' }] }} collab={collab} />),
    ).toThrow(/content/)
  })

  it('throws when collab prop and a collab extension are both present', () => {
    const collab = { clientID: 'x' } as CollabProvider
    expect(() =>
      render(
        <DocEditor
          collab={collab}
          extensions={[...docsPreset(), { name: 'collab' }]}
        />,
      ),
    ).toThrow(/collab extension already present/)
  })

  it('renders toolbar and surface in single-user mode', async () => {
    const { container } = render(<DocEditor />)
    await waitFor(() => expect(container.querySelector('.weditor-toolbar')).toBeTruthy())
    expect(container.querySelector('.weditor-surface')).toBeTruthy()
  })
})
