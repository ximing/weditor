import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
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
  const tabRefs = useRef<Record<ImageInsertTab, HTMLButtonElement | null>>({ upload: null, url: null })
  const mountedRef = useRef(true)
  const operationRef = useRef(0)
  const tabId = useId()
  const uploadTabId = `${tabId}-upload-tab`
  const urlTabId = `${tabId}-url-tab`
  const uploadPanelId = `${tabId}-upload-panel`
  const urlPanelId = `${tabId}-url-panel`

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      operationRef.current += 1
    }
  }, [])

  const invalidateUploads = () => {
    operationRef.current += 1
  }

  const close = () => {
    invalidateUploads()
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
    const operation = operationRef.current + 1
    operationRef.current = operation
    const toastOwner = anchorRef.current?.closest<HTMLElement>('.deditor-root')
    void (async () => {
      try {
        const result = await upload(file)
        if (!mountedRef.current || operation !== operationRef.current) return
        editor.commands.insertImage(result)
        close()
      } catch {
        if (!mountedRef.current || operation !== operationRef.current) return
        toast('Upload failed', toastOwner)
      }
    })()
  }

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    let next: ImageInsertTab | null = null
    if (event.key === 'ArrowRight') next = tab === 'upload' ? 'url' : 'upload'
    if (event.key === 'ArrowLeft') next = tab === 'upload' ? 'url' : 'upload'
    if (event.key === 'Home') next = 'upload'
    if (event.key === 'End') next = 'url'
    if (!next) return
    event.preventDefault()
    setTab(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <span ref={anchorRef} className="deditor-image-insert-anchor">
      <IconButton
        icon={IconImage}
        label="Image"
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => {
          if (open) close()
          else setOpen(true)
        }}
      />
      <Popover open={open} onClose={close} anchor={anchorRef.current} className="deditor-image-insert">
        {props.uploadImage ? (
          <>
            <div role="tablist" aria-label="Image source" className="deditor-image-tabs">
              <button
                id={uploadTabId}
                type="button"
                role="tab"
                ref={(element) => { tabRefs.current.upload = element }}
                aria-selected={tab === 'upload'}
                aria-controls={uploadPanelId}
                tabIndex={tab === 'upload' ? 0 : -1}
                className="deditor-chip-btn"
                onClick={() => setTab('upload')}
                onKeyDown={handleTabKeyDown}
              >
                Upload
              </button>
              <button
                id={urlTabId}
                type="button"
                role="tab"
                ref={(element) => { tabRefs.current.url = element }}
                aria-selected={tab === 'url'}
                aria-controls={urlPanelId}
                tabIndex={tab === 'url' ? 0 : -1}
                className="deditor-chip-btn"
                onClick={() => setTab('url')}
                onKeyDown={handleTabKeyDown}
              >
                URL
              </button>
            </div>
            <div id={uploadPanelId} role="tabpanel" aria-labelledby={uploadTabId} hidden={tab !== 'upload'}>
              <button
                type="button"
                className="deditor-chip-btn"
                onClick={() => fileRef.current?.click()}
              >
                <IconUpload size={14} aria-hidden /> Upload image
              </button>
            </div>
            <div id={urlPanelId} role="tabpanel" aria-labelledby={urlTabId} hidden={tab !== 'url'}>
              <ImageUrlForm url={url} onChange={setUrl} onSubmit={insertUrl} />
            </div>
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
