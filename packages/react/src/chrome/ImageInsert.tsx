import { useId, useRef, useState } from 'react'
import { IconImage, IconUpload } from '../icons'
import { useEditor } from '../useEditor'
import { IconButton } from '../ui/IconButton'
import { Popover } from '../ui/Popover'
import { toast } from './toast'

type ImageUpload = (file: File) => Promise<{ src: string; alt?: string; width?: number }>
type ImageInsertTab = 'upload' | 'url'

export function ImageInsert(props: { uploadImage?: ImageUpload }) {
  const editor = useEditor()
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState('')
  const [tab, setTab] = useState<ImageInsertTab>(props.uploadImage ? 'upload' : 'url')
  const anchorRef = useRef<HTMLSpanElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const tabId = useId()
  const uploadTabId = `${tabId}-upload-tab`
  const urlTabId = `${tabId}-url-tab`
  const uploadPanelId = `${tabId}-upload-panel`
  const urlPanelId = `${tabId}-url-panel`

  const close = () => {
    setOpen(false)
    setUrl('')
    setTab(props.uploadImage ? 'upload' : 'url')
  }

  const insertUrl = () => {
    const src = url.trim()
    if (!src) return
    editor.commands.insertImage({ src })
    close()
  }

  const uploadFile = (file: File) => {
    const upload = props.uploadImage
    if (!upload) return
    void (async () => {
      try {
        editor.commands.insertImage(await upload(file))
        close()
      } catch {
        toast('Upload failed')
      }
    })()
  }

  return (
    <span ref={anchorRef} className="deditor-image-insert-anchor">
      <IconButton
        icon={IconImage}
        label="Image"
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => setOpen((value) => !value)}
      />
      <Popover open={open} onClose={close} anchor={anchorRef.current} className="deditor-image-insert">
        {props.uploadImage ? (
          <>
            <div role="tablist" aria-label="Image source" className="deditor-image-tabs">
              <button
                id={uploadTabId}
                type="button"
                role="tab"
                aria-selected={tab === 'upload'}
                aria-controls={uploadPanelId}
                className="deditor-chip-btn"
                onClick={() => setTab('upload')}
              >
                Upload
              </button>
              <button
                id={urlTabId}
                type="button"
                role="tab"
                aria-selected={tab === 'url'}
                aria-controls={urlPanelId}
                className="deditor-chip-btn"
                onClick={() => setTab('url')}
              >
                URL
              </button>
            </div>
            {tab === 'upload' ? (
              <div id={uploadPanelId} role="tabpanel" aria-labelledby={uploadTabId}>
                <button
                  type="button"
                  className="deditor-chip-btn"
                  onClick={() => fileRef.current?.click()}
                >
                  <IconUpload size={14} aria-hidden /> Upload image
                </button>
              </div>
            ) : null}
            {tab === 'url' ? (
              <div id={urlPanelId} role="tabpanel" aria-labelledby={urlTabId}>
                <ImageUrlForm url={url} onChange={setUrl} onSubmit={insertUrl} />
              </div>
            ) : null}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(event) => {
                const file = event.target.files?.[0]
                event.target.value = ''
                if (file) uploadFile(file)
              }}
            />
          </>
        ) : (
          <ImageUrlForm url={url} onChange={setUrl} onSubmit={insertUrl} />
        )}
      </Popover>
    </span>
  )
}

function ImageUrlForm(props: {
  url: string
  onChange: (url: string) => void
  onSubmit: () => void
}) {
  return (
    <form
      className="deditor-image-form"
      onSubmit={(event) => {
        event.preventDefault()
        props.onSubmit()
      }}
    >
      <input
        aria-label="Image URL"
        placeholder="Paste image URL"
        value={props.url}
        onChange={(event) => props.onChange(event.target.value)}
      />
      <button type="submit" className="deditor-chip-btn is-primary" disabled={!props.url.trim()}>
        Insert
      </button>
    </form>
  )
}
