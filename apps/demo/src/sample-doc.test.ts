import { docsSchema } from '@deditor/preset-docs'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'
import { describe, expect, it } from 'vitest'
import { sampleDoc } from './sample-doc'

describe('sample doc', () => {
  it('showcases every promised block type', () => {
    const types = new Set<string>()
    const walk = (node: { type: string; content?: unknown[] }) => {
      types.add(node.type)
      for (const child of node.content ?? []) walk(child as { type: string; content?: unknown[] })
    }
    walk(sampleDoc)
    expect([...types]).toEqual(
      expect.arrayContaining([
        'heading',
        'paragraph',
        'bullet_list',
        'table',
        'blockquote',
        'task_list',
        'task_item',
        'code_block',
        'horizontal_rule',
        'image',
      ]),
    )
  })

  it('showcases every promised text mark', () => {
    const marks = new Set<string>()
    const walk = (node: { content?: unknown[]; marks?: Array<{ type: string }> }) => {
      for (const mark of node.marks ?? []) marks.add(mark.type)
      for (const child of node.content ?? []) {
        walk(child as { content?: unknown[]; marks?: Array<{ type: string }> })
      }
    }
    walk(sampleDoc)
    expect(marks).toEqual(
      new Set(['strong', 'em', 'underline', 'strike', 'code', 'color', 'highlight', 'link']),
    )
  })

  it('embeds a meaningful local PNG sample image', async () => {
    const server = await createServer({
      configFile: false,
      root: fileURLToPath(new URL('..', import.meta.url)),
      server: { hmr: false, middlewareMode: true, ws: false },
      optimizeDeps: { noDiscovery: true },
    })
    try {
      const module = (await server.ssrLoadModule('/src/sample-doc.ts')) as {
        sampleDoc: {
          content: Array<{
            type: string
            attrs?: { src?: string; alt?: string; width?: number }
          }>
        }
      }
      const image = module.sampleDoc.content.find((node) => node.type === 'image')

      expect(image?.attrs?.src).toMatch(/^data:image\/png;base64,[A-Za-z0-9+/]+=*$/)
      expect(image?.attrs?.alt).toMatch(/\S{10,}/)
      expect(image?.attrs?.width).toBe(480)
    } finally {
      await server.close()
    }
  })

  it('matches docsSchema()', () => {
    expect(() => docsSchema().nodeFromJSON(sampleDoc)).not.toThrow()
  })
})
