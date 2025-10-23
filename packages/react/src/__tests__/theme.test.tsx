/** @vitest-environment happy-dom */
import { cleanup, render, waitFor } from '@testing-library/react'
import React from 'react'
import { afterEach, describe, expect, it } from 'vitest'
import { DocEditor } from '../DocEditor'

afterEach(() => cleanup())

describe('DocEditor theme', () => {
  it('defaults to data-theme resolved from auto (light in happy-dom)', async () => {
    const { container } = render(<DocEditor />)
    await waitFor(() => expect(container.querySelector('.deditor-root')).toBeTruthy())
    expect(container.querySelector('.deditor-root')!.getAttribute('data-theme')).toBe('light')
  })

  it('applies explicit dark theme', async () => {
    const { container } = render(<DocEditor theme="dark" />)
    await waitFor(() => expect(container.querySelector('.deditor-root')).toBeTruthy())
    expect(container.querySelector('.deditor-root')!.getAttribute('data-theme')).toBe('dark')
  })
})
