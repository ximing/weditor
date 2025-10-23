import { useEffect, useRef, useState } from 'react'

/**
 * Progressive toolbar overflow: measure each [data-tb-group] once, then on
 * container resize keep as many leading groups as fit and report the rest as
 * overflowed. Zero-layout environments (happy-dom) skip measurement so tests
 * always see the full toolbar.
 */
export function useGroupOverflow(groupCount: number) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widthsRef = useRef<number[]>([])
  const [visible, setVisible] = useState(groupCount)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const fit = () => {
      const available = el.clientWidth
      if (!available) return
      if (widthsRef.current.length !== groupCount) {
        const groups = Array.from(el.querySelectorAll<HTMLElement>('[data-tb-group]'))
        if (groups.length !== groupCount) return
        const widths = groups.map((group) => group.offsetWidth + 9)
        if (widths.some((width) => width <= 9)) return
        widthsRef.current = widths
      }
      const budget = available - 36
      let used = 0
      let count = 0
      for (const width of widthsRef.current) {
        if (used + width > budget) break
        used += width
        count++
      }
      setVisible(count)
    }

    fit()
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(fit)
    observer.observe(el)
    return () => observer.disconnect()
  }, [groupCount])

  return { containerRef, visible }
}
