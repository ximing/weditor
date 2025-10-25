import { Github, Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
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
  const isCollab = path.startsWith('/collab')
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light',
  )

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  return (
    <div className="demo-app">
      <header className="demo-header">
        <span className="demo-brand">Deditor</span>
        <nav className="demo-nav" aria-label="Demo pages">
          <a href={`${base}/`} className={isCollab ? '' : 'is-active'}>
            Editor
          </a>
          <a href={`${base}/collab?room=demo`} className={isCollab ? 'is-active' : ''}>
            Collab
          </a>
        </nav>
        <div className="demo-header-right">
          <button
            type="button"
            className="demo-icon-btn"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <a
            className="demo-icon-btn"
            aria-label="GitHub repository"
            href="https://github.com/ximing/deditor"
            target="_blank"
            rel="noreferrer"
          >
            <Github size={18} />
          </a>
        </div>
      </header>
      <main className="demo-main">
        {isCollab ? <Collab theme={theme} /> : <Home theme={theme} />}
      </main>
    </div>
  )
}
