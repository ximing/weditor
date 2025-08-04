import { describe, expect, it } from 'vitest'
import { sanitizeHref, sanitizeSrc } from '../sanitize'

describe('sanitizeHref', () => {
  it('allows http, https, mailto', () => {
    expect(sanitizeHref('https://example.com/x')).toBe('https://example.com/x')
    expect(sanitizeHref('http://example.com')).toBe('http://example.com')
    expect(sanitizeHref('mailto:a@b.c')).toBe('mailto:a@b.c')
  })
  it('rejects javascript, data, protocol-relative, and empty junk', () => {
    expect(sanitizeHref('javascript:alert(1)')).toBeNull()
    expect(sanitizeHref('data:text/html;base64,xxxx')).toBeNull()
    expect(sanitizeHref('//evil.example')).toBeNull()
    expect(sanitizeHref('  javascript:alert(1)  ')).toBeNull()
  })
})

describe('sanitizeSrc', () => {
  it('allows http(s) and data:image png/jpeg/jpg/gif/webp base64', () => {
    expect(sanitizeSrc('https://cdn.example/a.png')).toBe('https://cdn.example/a.png')
    expect(sanitizeSrc('data:image/png;base64,abc')).toBe('data:image/png;base64,abc')
    expect(sanitizeSrc('data:image/jpeg;base64,abc')).toBe('data:image/jpeg;base64,abc')
    expect(sanitizeSrc('data:image/jpg;base64,abc')).toBe('data:image/jpg;base64,abc')
    expect(sanitizeSrc('data:image/gif;base64,abc')).toBe('data:image/gif;base64,abc')
    expect(sanitizeSrc('data:image/webp;base64,abc')).toBe('data:image/webp;base64,abc')
  })
  it('rejects javascript, non-image data, and protocol-relative', () => {
    expect(sanitizeSrc('javascript:alert(1)')).toBeNull()
    expect(sanitizeSrc('data:text/html;base64,abc')).toBeNull()
    expect(sanitizeSrc('//cdn.example/a.png')).toBeNull()
  })
})
