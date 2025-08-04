export function sanitizeHref(href: string): string | null {
  const t = href.trim()
  if (/^https?:\/\//i.test(t) || /^mailto:/i.test(t)) return t
  return null
}

export function sanitizeSrc(src: string): string | null {
  const t = src.trim()
  if (/^https?:\/\//i.test(t)) return t
  if (/^data:image\/(png|jpe?g|gif|webp);base64,/i.test(t)) return t
  return null
}
