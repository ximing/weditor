import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  { ignores: ['**/dist/**', '**/node_modules/**', 'apps/docs/.vitepress/cache/**'] },
  {
    files: ['packages/core/src/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: 'prosemirror-collab', message: 'core must not import prosemirror-collab' },
            { name: 'react', message: 'core must not import react' },
            { name: 'react-dom', message: 'core must not import react' },
          ],
        },
      ],
    },
  },
  {
    files: ['packages/preset-docs/src/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: '@deditor/collab', message: 'preset-docs must not import @deditor/collab' },
            { name: 'react', message: 'preset-docs must not import react' },
          ],
        },
      ],
    },
  },
  {
    files: ['packages/collab/src/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: 'react', message: 'collab must not import react' },
            { name: 'react-dom', message: 'collab must not import react' },
          ],
        },
      ],
    },
  },
)
