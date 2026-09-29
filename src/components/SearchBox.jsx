import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { searchProducts } from '../data/site'
import Placeholder from './Placeholder'

export default function SearchBox() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const containerRef = useRef(null)
  const inputRef = useRef(null)

  const results = searchProducts(query)

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const handleClose = () => {
    setOpen(false)
    setQuery('')
  }

  return (
    <div className="search-box" ref={containerRef}>
      <button
        type="button"
        className="site-header__action"
        aria-label="Buscar produtos"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="M20 20 15.3 15.3" />
        </svg>
        <span className="site-header__tooltip">Pesquisar</span>
      </button>

      {open && (
        <div className="search-box__panel">
          <input
            ref={inputRef}
            type="text"
            className="search-box__input"
            placeholder="Buscar produtos..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />

          {query.trim() && (
            <ul className="search-box__results">
              {results.length === 0 && (
                <li className="search-box__empty">Nenhum produto encontrado.</li>
              )}
              {results.map((product, index) => (
                <li key={product.id}>
                  <Link to={`/produto/${product.id}`} onClick={handleClose}>
                    <Placeholder
                      label={product.name}
                      variant={index}
                      reveal={false}
                      className="search-box__thumb"
                    />
                    <span>{product.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
