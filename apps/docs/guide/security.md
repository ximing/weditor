# Security

weditor sanitizes URLs on the way in (paste, `setLink`, `insertImage`) and on the way out (`getHTML()`). Collaboration identity in the demo is **not an auth boundary**.

## `getHTML()` omits comment marks

`editor.getHTML()` uses a `DOMSerializer` that **deletes the `comment` mark**. Exported HTML never contains `data-comment-id`. The clipboard serializer does the same. Internal ProseMirror `Slice` copy keeps marks so in-editor cut/paste preserves threads.

Unknown or unsafe URLs become `#` (href) or empty `src`.

## Href allow-list: `sanitizeHref`

`setLink` / paste / `getHTML()` reject anything that is not `http(s)` or `mailto`:

```ts
function sanitizeHref(href: string): string | null {
  const t = href.trim()
  if (/^https?:\/\//i.test(t) || /^mailto:/i.test(t)) return t
  return null
}
```

Dropped: `javascript:`, `data:`, protocol-relative `//`, relative paths, and any other scheme. A dropped paste mark is omitted; a dropped `toDOM` href becomes `#`. Links serialize with `rel="noopener noreferrer"` and `target="_blank"`.

## `sanitizeSrc`

Images allow `http(s)` and a narrow data-URL prefix:

```ts
function sanitizeSrc(src: string): string | null {
  const t = src.trim()
  if (/^https?:\/\//i.test(t)) return t
  if (/^data:image\/(png|jpe?g|gif|webp);base64,/i.test(t)) return t
  return null
}
```

`blob:` URLs are rejected (they do not exist on a collab peer). The demo `uploadImage` reads a data URL and rejects files larger than 200KB with `"Upload failed"`.

## Demo identity is not an auth boundary

The sample collab server trusts `user` and `clientID` from the `join` frame. They are client-declared and spoofable. Authority **stamps** broadcast `clientIDs` from the joined socket (it ignores `payload.clientIDs`) so a spoofed step id cannot break own-step confirm — but that is not authentication.

Do not ship `apps/collab-server` as production. Add a real identity check before treating `user.id` as an author or ACL subject.
