import { MemoryAuthority } from '@weditor/collab'
import { docsSchema } from '@weditor/preset-docs'

const rooms = new Map<string, MemoryAuthority>()
const locks = new Map<string, Promise<MemoryAuthority>>()

export function getRoom(roomId: string): Promise<MemoryAuthority> {
  const existing = rooms.get(roomId)
  if (existing) return Promise.resolve(existing)
  const pending = locks.get(roomId)
  if (pending) return pending
  const created = Promise.resolve().then(() => {
    const auth = new MemoryAuthority(docsSchema())
    rooms.set(roomId, auth)
    locks.delete(roomId)
    return auth
  })
  locks.set(roomId, created)
  return created
}
