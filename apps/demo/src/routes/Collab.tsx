import { createWsProvider } from '@deditor/collab'
import { DocEditor } from '@deditor/react'
import '@deditor/react/style.css'
import { useEffect, useMemo } from 'react'
import { readImageFile } from '../upload'

export function Collab(props: { theme: 'light' | 'dark' }) {
  const room = new URLSearchParams(location.search).get('room') || 'demo'
  const left = useMemo(
    () =>
      createWsProvider({
        url: 'ws://localhost:8787',
        roomId: room,
        user: { id: 'u1', name: 'Alice', color: '#4f81bd' },
      }),
    [room],
  )
  const right = useMemo(
    () =>
      createWsProvider({
        url: 'ws://localhost:8787',
        roomId: room,
        user: { id: 'u2', name: 'Bob', color: '#c0504d' },
      }),
    [room],
  )
  useEffect(() => {
    return () => {
      left.disconnect()
      right.disconnect()
    }
  }, [left, right])
  return (
    <div>
      <div className="demo-collab-status" aria-label={`Collaboration room ${room}`}>
        <span>
          Room <code>{room}</code>
        </span>
        <span className="demo-collab-users" aria-label="Online users: Alice and Bob">
          <span className="demo-user">
            <span className="demo-user-dot demo-user-dot-alice" aria-hidden="true" />
            Alice
          </span>
          <span className="demo-user">
            <span className="demo-user-dot demo-user-dot-bob" aria-hidden="true" />
            Bob
          </span>
          <span className="demo-online-label">online</span>
        </span>
      </div>
      <p className="demo-collab-note">
        Two-panel collab talks to <code>ws://localhost:8787</code> — run{' '}
        <code>pnpm dev:collab</code> locally. Open this room in two windows:{' '}
        {`${(import.meta.env.BASE_URL || '/').replace(/\/$/, '')}/collab?room=${room}`}
      </p>
      <div className="demo-collab-grid">
        <DocEditor
          collab={left}
          theme={props.theme}
          currentUser={{ id: 'u1', name: 'Alice', color: '#4f81bd' }}
          uploadImage={readImageFile}
        />
        <DocEditor
          collab={right}
          theme={props.theme}
          currentUser={{ id: 'u2', name: 'Bob', color: '#c0504d' }}
          uploadImage={readImageFile}
        />
      </div>
    </div>
  )
}
