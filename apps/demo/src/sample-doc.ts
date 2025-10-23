import sampleImage from './assets/deditor-sample.png?inline'

export const sampleDoc = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 1 },
      content: [{ type: 'text', text: 'Deditor' }],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'A pageless Docs editor with range comments and OT collaboration.',
        },
      ],
    },
    {
      type: 'bullet_list',
      content: [
        {
          type: 'list_item',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Headings and paragraphs' }] }],
        },
        {
          type: 'list_item',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Lists and tables' }] }],
        },
        {
          type: 'list_item',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Comments and collab' }] }],
        },
      ],
    },
    {
      type: 'table',
      content: [
        {
          type: 'table_row',
          content: [
            {
              type: 'table_cell',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Feature' }] }],
            },
            {
              type: 'table_cell',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Status' }] }],
            },
          ],
        },
        {
          type: 'table_row',
          content: [
            {
              type: 'table_cell',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Single-user' }] }],
            },
            {
              type: 'table_cell',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Ready' }] }],
            },
          ],
        },
      ],
    },
    {
      type: 'blockquote',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Pageless by design — comments and collab included.' },
          ],
        },
      ],
    },
    {
      type: 'code_block',
      content: [{ type: 'text', text: 'pnpm add @deditor/react' }],
    },
    {
      type: 'image',
      attrs: {
        src: sampleImage,
        alt: 'Collaborative document editing interface with comments and tables',
        width: 480,
      },
    },
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'Text and marks' }],
    },
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: 'Bold', marks: [{ type: 'strong' }] },
        { type: 'text', text: ', ' },
        { type: 'text', text: 'italic', marks: [{ type: 'em' }] },
        { type: 'text', text: ', ' },
        { type: 'text', text: 'underline', marks: [{ type: 'underline' }] },
        { type: 'text', text: ', ' },
        { type: 'text', text: 'strike', marks: [{ type: 'strike' }] },
        { type: 'text', text: ', ' },
        { type: 'text', text: 'code', marks: [{ type: 'code' }] },
        { type: 'text', text: ', ' },
        {
          type: 'text',
          text: 'colored',
          marks: [{ type: 'color', attrs: { color: '#c00000' } }],
        },
        { type: 'text', text: ', ' },
        {
          type: 'text',
          text: 'highlighted',
          marks: [{ type: 'highlight', attrs: { color: 'yellow' } }],
        },
        { type: 'text', text: ', and a ' },
        {
          type: 'text',
          text: 'link',
          marks: [{ type: 'link', attrs: { href: 'https://github.com/ximing/weditor' } }],
        },
        { type: 'text', text: '.' },
      ],
    },
    {
      type: 'task_list',
      content: [
        {
          type: 'task_item',
          attrs: { checked: true },
          content: [
            { type: 'paragraph', content: [{ type: 'text', text: 'Production-grade UI' }] },
          ],
        },
        {
          type: 'task_item',
          attrs: { checked: false },
          content: [
            { type: 'paragraph', content: [{ type: 'text', text: 'Mobile support' }] },
          ],
        },
      ],
    },
    { type: 'horizontal_rule' },
  ],
}
