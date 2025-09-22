import { afterEach, describe, expect, it, vi } from 'vitest'
import { MAX_IMAGE_BYTES, readImageFile } from './upload'

describe('demo upload', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('rejects files larger than 200KB with Upload failed', async () => {
    const file = new File([new Uint8Array(200 * 1024 + 1)], 'a.png', { type: 'image/png' })
    await expect(readImageFile(file)).rejects.toThrow('Upload failed')
  })

  it('reads a small file as a data URL and never uses blob: URLs', async () => {
    class FakeReader {
      result: string | null = null
      onload: null | (() => void) = null
      onerror: null | (() => void) = null
      readAsDataURL(file: Blob) {
        expect(file.size).toBeLessThanOrEqual(MAX_IMAGE_BYTES)
        this.result = 'data:image/png;base64,AAAA'
        queueMicrotask(() => this.onload?.())
      }
    }
    vi.stubGlobal('FileReader', FakeReader)
    const file = new File([new Uint8Array(16)], 'pic.png', { type: 'image/png' })
    const result = await readImageFile(file)
    expect(result.src.startsWith('data:image/')).toBe(true)
    expect(result.src.startsWith('blob:')).toBe(false)
    expect(result.alt).toBe('pic.png')
  })
})

