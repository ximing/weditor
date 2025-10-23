import { useEffect, useRef, useState } from 'react'

interface ToolbarMeasurements {
  groupWidths: number[]
  paddingInline: number
  gap: number
  dividerWidth: number
  moreWidth: number
}

function pixels(value: string): number {
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function outerWidth(element: HTMLElement): number {
  const style = getComputedStyle(element)
  return element.offsetWidth + pixels(style.marginLeft) + pixels(style.marginRight)
}

function fitLeadingGroups(available: number, measurements: ToolbarMeasurements): number {
  const { groupWidths, paddingInline, gap, dividerWidth, moreWidth } = measurements
  let used = paddingInline + dividerWidth + gap + moreWidth
  let count = 0

  for (const [index, groupWidth] of groupWidths.entries()) {
    const groupOccupancy = groupWidth + gap + (index > 0 ? dividerWidth + gap : 0)
    if (used + groupOccupancy > available) break
    used += groupOccupancy
    count++
  }

  return count
}

/**
 * Progressive toolbar overflow: measure each [data-tb-group] once, then on
 * container resize keep as many leading groups as fit and report the rest as
 * overflowed. Zero-layout environments (happy-dom) skip measurement so tests
 * always see the full toolbar.
 */
export function useGroupOverflow(groupCount: number) {
  const containerRef = useRef<HTMLDivElement>(null)
  const measurementsRef = useRef<ToolbarMeasurements | null>(null)
  const [visible, setVisible] = useState(groupCount)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const fit = () => {
      const available = el.clientWidth
      if (!available) return
      if (measurementsRef.current?.groupWidths.length !== groupCount) {
        const groups = Array.from(el.querySelectorAll<HTMLElement>('[data-tb-group]'))
        if (groups.length !== groupCount) return
        const children = Array.from(el.children) as HTMLElement[]
        const moreIndex = children.findIndex((child) => child.classList.contains('deditor-more'))
        const more = children[moreIndex]
        const divider = children[moreIndex - 1]
        if (!divider || !more) return
        if (!divider.classList.contains('deditor-toolbar-divider')) return

        const groupWidths = groups.map(outerWidth)
        const dividerWidth = outerWidth(divider)
        const moreWidth = outerWidth(more)
        if (
          groupWidths.some((width) => width <= 0) ||
          dividerWidth <= 0 ||
          moreWidth <= 0
        ) {
          return
        }

        const containerStyle = getComputedStyle(el)
        measurementsRef.current = {
          groupWidths,
          paddingInline:
            pixels(containerStyle.paddingLeft) + pixels(containerStyle.paddingRight),
          gap: pixels(containerStyle.columnGap),
          dividerWidth,
          moreWidth,
        }
      }
      setVisible(fitLeadingGroups(available, measurementsRef.current))
    }

    fit()
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(fit)
    observer.observe(el)
    return () => observer.disconnect()
  }, [groupCount])

  return { containerRef, visible }
}
