import { sanitizeHref } from '@weditor/core'
import type { MarkSpec } from 'prosemirror-model'

export const linkMark: Record<string, MarkSpec> = {
  link: {
    attrs: { href: { default: '' } },
    inclusive: false,
    parseDOM: [
      {
        tag: 'a[href]',
        getAttrs: (dom) => {
          const href = sanitizeHref(dom.getAttribute('href') ?? '')
          // spec §7.3: color parseDOM ignores color on <a>
          if (dom.style.color) dom.style.removeProperty('color')
          return href ? { href } : false
        },
      },
    ],
    toDOM: (mark) => [
      'a',
      {
        href: sanitizeHref(mark.attrs.href) ?? '#',
        rel: 'noopener noreferrer',
        target: '_blank',
      },
      0,
    ],
  },
}
