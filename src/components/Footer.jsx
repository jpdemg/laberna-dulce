import { Link } from 'react-router-dom'
import { brand, footer, mainNav } from '../data/site'

const socialIcons = {
  Instagram: (
    <path d="M12 2c2.7 0 3.06.01 4.12.06 1.06.05 1.79.22 2.43.47.65.25 1.2.6 1.73 1.13.53.53.88 1.08 1.13 1.73.25.64.42 1.37.47 2.43.05 1.06.06 1.42.06 4.12s-.01 3.06-.06 4.12c-.05 1.06-.22 1.79-.47 2.43a4.6 4.6 0 0 1-1.13 1.73 4.6 4.6 0 0 1-1.73 1.13c-.64.25-1.37.42-2.43.47-1.06.05-1.42.06-4.12.06s-3.06-.01-4.12-.06c-1.06-.05-1.79-.22-2.43-.47a4.6 4.6 0 0 1-1.73-1.13 4.6 4.6 0 0 1-1.13-1.73c-.25-.64-.42-1.37-.47-2.43C2.01 15.06 2 14.7 2 12s.01-3.06.06-4.12c.05-1.06.22-1.79.47-2.43.25-.65.6-1.2 1.13-1.73A4.6 4.6 0 0 1 5.39 2.6c.64-.25 1.37-.42 2.43-.47C8.88 2.01 9.24 2 12 2Zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4Zm5.4-8.9a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Z" />
  ),
  Facebook: (
    <path d="M13.5 21v-7.2h2.4l.4-2.8h-2.8v-1.6c0-.8.2-1.4 1.4-1.4h1.5V5.3c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H8v2.8h2.2V21Z" />
  ),
  TikTok: (
    <path d="M14 3h2.3c.2 1.6 1.3 2.9 3.2 3.1V8.6c-1.2 0-2.3-.3-3.2-.9v6.6a4.9 4.9 0 1 1-4.2-4.9v2.4a2.5 2.5 0 1 0 1.9 2.4Z" />
  ),
}

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__grid">
        <div>
          <h3>{brand.name}</h3>
          <p className="eyebrow">Horário de funcionamento</p>
          <ul>
            {footer.hours.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <ul className="site-footer__social">
            {footer.social.map((item) => (
              <li key={item.label}>
                <a href={item.href} aria-label={item.label}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    {socialIcons[item.label]}
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow">Contato</p>
          <address>
            <p>WhatsApp: {footer.contact.whatsapp}</p>
            <p>Telefone: {footer.contact.phone}</p>
            <p>
              <a href={`mailto:${footer.contact.email}`}>{footer.contact.email}</a>
            </p>
            <p>{footer.contact.address}</p>
          </address>
          <ul className="site-footer__marketplaces">
            {footer.marketplaces.map((item) => (
              <li key={item.label}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow">Políticas</p>
          <ul>
            {footer.policies.map((policy) => (
              <li key={policy}>
                <a href="#">{policy}</a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Menu do rodapé">
          <p className="eyebrow">Navegação</p>
          <ul>
            {mainNav
              .filter((item) => !item.children)
              .map((item) => (
                <li key={item.label}>
                  <Link to={item.href}>{item.label}</Link>
                </li>
              ))}
          </ul>
        </nav>

        <div className="site-footer__map" role="img" aria-label="Mapa de localização">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
          </svg>
          <span>{footer.contact.address}</span>
        </div>
      </div>

      <p className="site-footer__legal">{footer.legal}</p>
    </footer>
  )
}
