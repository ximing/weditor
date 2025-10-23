import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Deditor',
  description: 'Doc editor — pageless ProseMirror SDK with range comments and OT collab',
  base: process.env.DOCS_BASE || '/',
  lang: 'en-US',
  lastUpdated: true,
  themeConfig: {
    logo: undefined,
    nav: [
      { text: 'Guide', link: '/guide/install' },
      { text: 'Demo', link: 'https://ximing.github.io/weditor/demo/' },
      { text: 'GitHub', link: 'https://github.com/ximing/weditor' },
    ],
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
    socialLinks: [{ icon: 'github', link: 'https://github.com/ximing/weditor' }],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2017-2026 ximing',
    },
    search: { provider: 'local' },
    editLink: {
      pattern: 'https://github.com/ximing/weditor/edit/master/apps/docs/:path',
      text: 'Edit this page',
    },
  },
})
