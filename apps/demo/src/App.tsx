import { Collab } from './routes/Collab'
import { Home } from './routes/Home'

export function App() {
  const path = typeof location === 'undefined' ? '/' : location.pathname
  return (
    <div className="weditor-demo">
      <nav className="weditor-demo-nav">
        <a href="/">Editor</a>
        {' · '}
        <a href="/collab?room=demo">Collab</a>
      </nav>
      {path.startsWith('/collab') ? <Collab /> : <Home />}
    </div>
  )
}
