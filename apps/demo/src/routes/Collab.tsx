import { createWsProvider } from '@weditor/collab'
import { DocEditor } from '@weditor/react'
import '@weditor/react/style.css'
import { useEffect, useMemo } from 'react'
import { readImageFile } from '../upload'

export function Collab() {
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
    <div className="weditor-collab-panes">
      <p>Open this room in two windows: /collab?room={room}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <DocEditor collab={left} currentUser={{ id: 'u1', name: 'Alice', color: '#4f81bd' }} uploadImage={readImageFile} />
        <DocEditor collab={right} currentUser={{ id: 'u2', name: 'Bob', color: '#c0504d' }} uploadImage={readImageFile} />
      </div>
    </div>
  )
}
