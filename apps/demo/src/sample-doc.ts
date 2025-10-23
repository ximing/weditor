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
  ],
}
