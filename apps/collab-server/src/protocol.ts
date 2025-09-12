export interface Frame<T = unknown> {
  v: 1
  type: string
  requestId?: string
  body: T
}

export function parseFrame(raw: string): Frame {
  const f = JSON.parse(raw) as Frame
  if (f.v !== 1 || typeof f.type !== 'string') throw new Error('bad frame')
  return f
}
