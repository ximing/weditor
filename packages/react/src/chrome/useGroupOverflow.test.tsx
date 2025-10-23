/** @vitest-environment happy-dom */
import { act, cleanup, render, waitFor } from '@testing-library/react'
import { Fragment } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useGroupOverflow } from './useGroupOverflow'

let triggerResize: (() => void) | undefined

class TestResizeObserver {
  constructor(callback: ResizeObserverCallback) {
    triggerResize = () => callback([], this as unknown as ResizeObserver)
  }

  observe() {}
  unobserve() {}
  disconnect() {}
}

function Harness() {
  const { containerRef, visible } = useGroupOverflow(2)
  const groups = ['first', 'second']

  return (
    <>
      <div
        ref={containerRef}
        data-testid="toolbar"
        style={{ columnGap: '2px', paddingLeft: '8px', paddingRight: '8px' }}
      >
        {groups.slice(0, visible).map((group, index) => (
          <Fragment key={group}>
            {index > 0 ? (
              <div
                className="deditor-toolbar-divider"
                style={{ marginLeft: '6px', marginRight: '6px' }}
              />
            ) : null}
            <div data-tb-group={group} />
          </Fragment>
        ))}
        <div
          className="deditor-toolbar-divider"
          style={{ marginLeft: '6px', marginRight: '6px' }}
        />
        <span className="deditor-more">
          <button type="button" aria-label="More" />
        </span>
      </div>
      <output data-testid="visible">{visible}</output>
    </>
  )
}

function setWidth(element: Element, width: number) {
  Object.defineProperty(element, 'offsetWidth', { configurable: true, value: width })
}

function installGeometry(toolbar: HTMLElement, getAvailable: () => number) {
  Object.defineProperty(toolbar, 'clientWidth', {
    configurable: true,
    get: getAvailable,
  })
  toolbar.querySelectorAll('[data-tb-group]').forEach((group) => setWidth(group, 30))
  toolbar.querySelectorAll('.deditor-toolbar-divider').forEach((divider) => setWidth(divider, 1))
  setWidth(toolbar.querySelector('.deditor-more')!, 28)
}

function resize() {
  act(() => triggerResize?.())
}

beforeEach(() => {
  vi.stubGlobal('ResizeObserver', TestResizeObserver)
})

afterEach(() => {
  cleanup()
  triggerResize = undefined
  vi.unstubAllGlobals()
})

describe('useGroupOverflow', () => {
  it('reserves measured padding, divider, gaps, and More before fitting a group', async () => {
    const { getByLabelText, getByTestId } = render(<Harness />)
    const toolbar = getByTestId('toolbar')
    installGeometry(toolbar, () => 90)

    resize()

    await waitFor(() => expect(getByTestId('visible').textContent).toBe('0'))
    expect(getByLabelText('More')).toBeTruthy()
  })

  it('uses exact group boundaries and cached widths when shrinking and growing', async () => {
    let available = 138
    const { getByTestId } = render(<Harness />)
    const toolbar = getByTestId('toolbar')
    installGeometry(toolbar, () => available)

    resize()
    await waitFor(() => expect(getByTestId('visible').textContent).toBe('2'))

    available = 137
    resize()
    await waitFor(() => expect(getByTestId('visible').textContent).toBe('1'))

    available = 90
    resize()
    await waitFor(() => expect(getByTestId('visible').textContent).toBe('0'))

    available = 91
    resize()
    await waitFor(() => expect(getByTestId('visible').textContent).toBe('1'))

    available = 138
    resize()
    await waitFor(() => expect(getByTestId('visible').textContent).toBe('2'))
  })

  it('keeps every group visible when the environment has zero layout width', () => {
    const { getByTestId } = render(<Harness />)

    resize()

    expect(getByTestId('visible').textContent).toBe('2')
  })
})
