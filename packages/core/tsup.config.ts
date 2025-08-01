import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  splitting: false,
  treeshake: true,
  external: [/^@weditor\//, /^prosemirror-/, 'react', 'react-dom', 'nanoid'],
})
