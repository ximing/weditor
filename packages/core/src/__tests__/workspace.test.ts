import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..')

describe('workspace', () => {
  it('pins Node 20, pnpm 9, TypeScript 5.5, private root, package versions 0.6.0', () => {
    const rootPkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'))
    expect(rootPkg.private).toBe(true)
    expect(rootPkg.packageManager).toMatch(/^pnpm@9\./)
    expect(rootPkg.engines.node).toMatch(/20/)
    expect(rootPkg.devDependencies.typescript).toMatch(/^5\.5/)
    expect(rootPkg.devDependencies.vitest).toMatch(/^2\./)
    expect(rootPkg.devDependencies.vite).toMatch(/^6\./)
    expect(rootPkg.devDependencies.tsup).toBeTruthy()
    expect(rootPkg.devDependencies.eslint).toMatch(/^9\./)

    const ws = readFileSync(resolve(root, 'pnpm-workspace.yaml'), 'utf8')
    expect(ws).toContain('packages/*')
    expect(ws).toContain('apps/*')

    for (const name of ['core', 'preset-docs', 'collab', 'react']) {
      const pkg = JSON.parse(
        readFileSync(resolve(root, 'packages', name, 'package.json'), 'utf8'),
      )
      expect(pkg.name).toBe(`@deditor/${name}`)
      expect(pkg.version).toBe('0.6.0')
      expect(pkg.type).toBe('module')
      expect(pkg.exports['.'].types).toBe('./dist/index.d.ts')
      expect(pkg.exports['.'].import).toBe('./dist/index.js')
      expect(pkg.exports['.'].require).toBe('./dist/index.cjs')
      expect(pkg.files).toEqual(['dist'])
    }

    const react = JSON.parse(readFileSync(resolve(root, 'packages/react/package.json'), 'utf8'))
    expect(react.exports['./style.css']).toBe('./dist/style.css')
    expect(react.peerDependencies.react).toMatch(/>=18/)
    expect(react.dependencies['@deditor/core']).toBe('workspace:*')
    expect(react.dependencies['@deditor/preset-docs']).toBe('workspace:*')
    expect(react.dependencies['@deditor/collab']).toBe('workspace:*')

    const preset = JSON.parse(
      readFileSync(resolve(root, 'packages/preset-docs/package.json'), 'utf8'),
    )
    expect(preset.exports['./style.css']).toBe('./dist/style.css')

    const tsconfig = JSON.parse(readFileSync(resolve(root, 'tsconfig.base.json'), 'utf8'))
    expect(tsconfig.compilerOptions.strict).toBe(true)
  })

  it('root README documents install and dev scripts', () => {
    const readme = readFileSync(resolve(root, 'README.md'), 'utf8')
    expect(readme).toContain('pnpm add @deditor/react')
    expect(readme).toContain('pnpm dev:demo')
    expect(readme).toContain('pnpm dev:collab')
    expect(readme).toContain('pnpm dev:docs')
    expect(readme).toContain('@deditor/core')
    expect(readme).toContain('prosemirror')
    expect(readme.toLowerCase()).not.toMatch(/quill delta import/)
  })
})
