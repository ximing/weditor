import { defineConfig } from 'vitepress'
export default defineConfig({
  title: 'weditor',
  description: 'ProseMirror SDK for pageless documents',
  themeConfig: {
    sidebar: [
      { text: 'Introduction', link: '/' },
      { text: 'Install', link: '/guide/install' },
      { text: 'DocEditor', link: '/guide/doc-editor' },
      { text: 'Editor API', link: '/guide/editor-api' },
      { text: 'Schema', link: '/guide/schema' },
      { text: 'Comments', link: '/guide/comments' },
      { text: 'Collaboration', link: '/guide/collab' },
      { text: 'Security', link: '/guide/security' },
      { text: 'Vue later', link: '/guide/vue' },
      { text: 'Migration', link: '/guide/migration' },
    ],
  },
})
