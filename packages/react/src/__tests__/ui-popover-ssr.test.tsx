/** @vitest-environment node */
import { renderToString } from 'react-dom/server'
import React from 'react'
import { describe, expect, it } from 'vitest'
import { Popover } from '../ui/Popover'

describe('Popover SSR', () => {
  it('discriminates a virtual anchor without a global Element constructor', () => {
    const anchor = {
      getBoundingClientRect: () => ({
        x: 0,
        y: 0,
        top: 0,
        right: 1,
        bottom: 1,
        left: 0,
        width: 1,
        height: 1,
        toJSON: () => ({}),
      }),
    }

    expect(() =>
      renderToString(
        <Popover open anchor={anchor} onClose={() => {}}>
          content
        </Popover>,
      ),
    ).not.toThrow()
  })
})
