import { Collab } from './routes/Collab'
import { Home } from './routes/Home'

function basePath() {
  return (import.meta.env.BASE_URL || '/').replace(/\/$/, '')
}

function pathWithinBase() {
  const base = basePath()
  const raw = typeof location === 'undefined' ? '/' : location.pathname
  const stripped = base && raw.startsWith(base) ? raw.slice(base.length) : raw
  return stripped.startsWith('/') ? stripped : `/${stripped}`
}

export function App() {
  const path = pathWithinBase()
  const base = basePath()
  return (
    <div className="deditor-demo">
      <nav className="deditor-demo-nav">
        <a href={`${base}/`}>Editor</a>
        {' · '}
        <a href={`${base}/collab?room=demo`}>Collab</a>
      </nav>
      {path.startsWith('/collab') ? <Collab /> : <Home />}
    </div>
  )
}
