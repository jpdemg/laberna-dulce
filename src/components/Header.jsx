import { useState } from 'react'
import { brand, mainNav } from '../data/site'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <button
          className="site-header__burger"
          aria-expanded={menuOpen}
          aria-controls="main-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
          <span className="sr-only">Abrir menu</span>
        </button>

        <a href="#topo" className="site-header__logo">
          {brand.name}
        </a>

        <nav id="main-nav" className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Principal">
          <ul>
            {mainNav.map((item) => (
              <li key={item.label} className={item.children ? 'has-submenu' : ''}>
                <a href={item.href}>{item.label}</a>
                {item.children && (
                  <ul className="submenu">
                    {item.children.map((child) => (
                      <li key={child.label}>
                        <a href={child.href}>{child.label}</a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-header__actions">
          <button aria-label="Entrar na conta">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-5 0-9 2.5-9 6v2h18v-2c0-3.5-4-6-9-6Z" /></svg>
          </button>
          <button aria-label="Buscar produtos">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.5 14h-.8l-.3-.3a6.5 6.5 0 1 0-.7.7l.3.3v.8l5 5 1.5-1.5-5-5Zm-6 0a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9Z" /></svg>
          </button>
          <button aria-label="Lista de desejos">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-4.35-9.5-8.5C.6 9 2 5 5.6 5c2 0 3.4 1.1 4.4 2.6C11 6.1 12.4 5 14.4 5 18 5 19.4 9 21.5 12.5 19 16.65 12 21 12 21Z" /></svg>
          </button>
        </div>
      </div>
    </header>
  )
}
