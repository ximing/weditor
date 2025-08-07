import type { MarkSpec } from 'prosemirror-model'

export const fontMarks: Record<string, MarkSpec> = {
  fontSize: {
    attrs: { size: { default: null } },
    parseDOM: [
      {
        style: 'font-size',
        getAttrs: (value) => (value ? { size: value } : false),
      },
    ],
    toDOM: (mark) => ['span', { style: `font-size: ${mark.attrs.size}` }, 0],
  },
  fontFamily: {
    attrs: { family: { default: null } },
    parseDOM: [
      {
        style: 'font-family',
        getAttrs: (value) => (value ? { family: value } : false),
      },
    ],
    toDOM: (mark) => ['span', { style: `font-family: ${mark.attrs.family}` }, 0],
  },
  color: {
    attrs: { color: { default: null } },
    parseDOM: [
      {
        style: 'color',
        getAttrs: (value) => (value ? { color: value } : false),
      },
    ],
    toDOM: (mark) => ['span', { style: `color: ${mark.attrs.color}` }, 0],
  },
  highlight: {
    attrs: { color: { default: null } },
    parseDOM: [
      {
        style: 'background-color',
        getAttrs: (value) => (value ? { color: value } : false),
      },
    ],
    toDOM: (mark) => ['span', { style: `background-color: ${mark.attrs.color}` }, 0],
  },
}
