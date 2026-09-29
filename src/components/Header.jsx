import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { brand, mainNav } from '../data/site'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useProfile } from '../hooks/useProfile'
import SearchBox from './SearchBox'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user } = useAuth()
  const { count } = useCart()
  const { profile } = useProfile()

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

        <Link to="/" className="site-header__logo">
          {brand.name}
        </Link>

        <nav id="main-nav" className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Principal">
          <ul>
            {mainNav.map((item) => (
              <li key={item.label} className={item.children ? 'has-submenu' : ''}>
                <NavLink to={item.href}>{item.label}</NavLink>
                {item.children && (
                  <ul className="submenu">
                    {item.children.map((child) => (
                      <li key={child.label}>
                        <NavLink to={child.href}>{child.label}</NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-header__actions">
          {profile?.is_admin && (
            <Link to="/admin" aria-label="Painel de administração" className="site-header__action">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
              </svg>
              <span className="site-header__tooltip">Admin</span>
            </Link>
          )}
          <Link to={user ? '/conta' : '/login'} aria-label={user ? 'Minha conta' : 'Login'} className="site-header__action">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="8" r="3.5" />
              <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
            </svg>
            <span className="site-header__tooltip">{user ? 'Minha conta' : 'Login'}</span>
          </Link>
          <SearchBox />
          <Link to="/carrinho" aria-label="Carrinho" className="site-header__action site-header__cart">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 8h14l-1.3 11H6.3Z" />
              <path d="M8.5 8V6a3.5 3.5 0 0 1 7 0v2" />
            </svg>
            <span className="site-header__cart-count">{count}</span>
            <span className="site-header__tooltip">Carrinho</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
