# Schema

Source of truth is ProseMirror **JSON**. HTML is paste input, print, and `getHTML()` only. Quill Delta is not a document format in this SDK.

`docsSchema()` = `schemaFromExtensions(docsPreset())`. The demo collab server uses `docsSchema()` only — never `Editor.create`.

`doc.content = 'block+'`. Every node that may appear at doc / blockquote / table-cell / list-item-tail declares `group: 'block'`. `paragraph` is first in the `block` group so default inserts produce paragraphs, not nested `blockquote`.

## Nodes

| Node | group | content | atom | marks | Attrs (defaults) |
| --- | --- | --- | --- | --- | --- |
| `doc` | — | `block+` | no | — | |
| `paragraph` | `block` | `inline*` | no | `_` | `align: null`, `lineHeight: null`, `indent: 0` |
| `heading` | `block` | `inline*` | no | `_` | `level: 1`, `align: null`, `lineHeight: null`, `indent: 0` |
| `blockquote` | `block` | `block+` | no | — | |
| `code_block` | `block` | `text*` | no | `''` (none) | `code: true` on spec |
| `horizontal_rule` | `block` | none | **yes** | — | |
| `image` | `block` | none | **yes** | — | `src: ''`, `alt: ''`, `width: null` (number px) |
| `bullet_list` | `block` | `list_item+` | no | — | |
| `ordered_list` | `block` | `list_item+` | no | — | `order: 1` |
| `task_list` | `block` | `task_item+` | no | — | |
| `list_item` | — | `paragraph block*` | no | — | |
| `task_item` | — | `paragraph block*` | no | — | `checked: false` |
| `table` | `block` | `table_row+` | no | — | `prosemirror-tables` `tableNodes()` defaults |
| `table_row` | — | `(table_cell \| table_header)+` | no | — | |
| `table_cell` / `table_header` | — | `block+` | no | — | colspan, rowspan, cell attrs |
| `text` | `inline` | — | no | — | injected if missing |
| `hard_break` | `inline` | none | no | — | `inline: true` |
| `mention` | `inline` | none | **yes** | — | `inline: true`, `id: ''`, `name: ''` |

`align`: `'left' | 'center' | 'right' | 'justify' | null` (null = CSS default left).

`lineHeight`: `1 | 1.15 | 1.5 | 2 | 2.5 | 3 | null` (null = CSS 1.5).

`indent`: integer 0–8, one step = 24px `padding-left`.

Image is **block-level only**. Inline images and text-wrap are out of scope. `heading.level` is 1–6.

## Marks

| Mark | Attrs | Spec notes |
| --- | --- | --- |
| `strong` `em` `underline` `strike` `code` | none | |
| `superscript` | none | `excludes: 'subscript'` |
| `subscript` | none | `excludes: 'superscript'` |
| `link` | `href: string` | `inclusive: false` |
| `fontSize` | `size: string` (`"11pt"`) | |
| `fontFamily` | `family: string` | |
| `color` | `color: string` (hex) | |
| `highlight` | `color: string` | |
| `comment` | `id: string` | `excludes: ''` (threads stack); `inclusive: true` |

Font size whitelist in the default toolbar: 9, 10, 11, 12, 14, 16, 18, 20, 24, 30, 36, 48, 72 (`pt`). Schema accepts any `${n}pt` with `n` in `[5, 72]`. Command clamps; invalid strings return false.

## HTML mapping (`toDOM` / `parseDOM`)

Used by the live `EditorView`, `getHTML()` (with `comment` stripped), and paste (`DOMParser.fromSchema`).

### Nodes

| Node | `toDOM` | `parseDOM` |
| --- | --- | --- |
| `paragraph` | `['p', { style: styleFromAttrs(node) }, 0]` | `{ tag: 'p' }`, `{ tag: 'div' }` |
| `heading` | `['h' + level, { style }, 0]` | `{ tag: 'h1' }` … `{ tag: 'h6' }` → `level` |
| `blockquote` | `['blockquote', 0]` | `{ tag: 'blockquote' }` |
| `code_block` | `['pre', ['code', 0]]` | `{ tag: 'pre' }`, `{ tag: 'code', preserveWhitespace: 'full' }` at block context |
| `horizontal_rule` | `['hr']` | `{ tag: 'hr' }` |
| `image` | `['img', { src: sanitizeSrc(src) ?? '', alt, width }]` | `{ tag: 'img[src]', getAttrs }` — drop if `sanitizeSrc` is null |
| `bullet_list` | `['ul', 0]` | `{ tag: 'ul' }` |
| `ordered_list` | `['ol', { start: order === 1 ? null : order }, 0]` | `{ tag: 'ol', getAttrs: start → order }` |
| `task_list` | `['ul', { 'data-task-list': 'true' }, 0]` | `{ tag: 'ul[data-task-list]' }` |
| `list_item` | `['li', 0]` | `{ tag: 'li' }` (not inside `data-task-list`) |
| `task_item` | `['li', { 'data-checked': checked ? 'true' : 'false' }, 0]` | `{ tag: 'ul[data-task-list] > li' }` |
| `table` / row / cell | `prosemirror-tables` defaults (`<table>`, `<tr>`, `<td>`, `<th>`) | same |
| `hard_break` | `['br']` | `{ tag: 'br' }` |
| `mention` | `['span', { class: 'mention-embed', 'data-mention-id': id, 'data-mention-name': name }, '@' + name]` | `{ tag: 'span.mention-embed', getAttrs }` |

`styleFromAttrs`: `text-align` from `align` (omit if null), `line-height` from `lineHeight`, `padding-left: ${indent * 24}px` if indent > 0.

### Marks

| Mark | `toDOM` | `parseDOM` |
| --- | --- | --- |
| `strong` | `['strong', 0]` | `strong`, `b`, `span[style font-weight=bold]` |
| `em` | `['em', 0]` | `em`, `i`, `span[style font-style=italic]` |
| `underline` | `['u', 0]` | `u`, `span[style text-decoration=underline]` |
| `strike` | `['s', 0]` | `s`, `del`, `span[style text-decoration=line-through]` |
| `code` | `['code', 0]` | `{ tag: 'code' }` (not inside `pre`) |
| `superscript` | `['sup', 0]` | `{ tag: 'sup' }` |
| `subscript` | `['sub', 0]` | `{ tag: 'sub' }` |
| `link` | `['a', { href: sanitizeHref(href) ?? '#', rel: 'noopener noreferrer', target: '_blank' }, 0]` | `{ tag: 'a[href]', getAttrs }` — drop mark if `sanitizeHref` is null |
| `fontSize` | `['span', { style: \`font-size: ${size}\` }, 0]` | `{ style: 'font-size', getAttrs }` |
| `fontFamily` | `['span', { style: \`font-family: ${family}\` }, 0]` | `{ style: 'font-family', getAttrs }` |
| `color` | `['span', { style: \`color: ${color}\` }, 0]` | `{ style: 'color', getAttrs }` (ignore `color` on `a`) |
| `highlight` | `['span', { style: \`background-color: ${color}\` }, 0]` | `{ style: 'background-color', getAttrs }` |
| `comment` | `['span', { 'data-comment-id': id }, 0]` | **clipboard/`getHTML()`: omitted.** Live view uses this `toDOM`. Paste parser: `{ tag: 'span[data-comment-id]', ignore: true }`. Internal ProseMirror `Slice` copy keeps marks. |

`javascript:`, `data:` (except `data:image/(png|jpeg|jpg|gif|webp);base64,` on `img`), and protocol-relative `//` hrefs are dropped at parse time. See [Security](/guide/security).
