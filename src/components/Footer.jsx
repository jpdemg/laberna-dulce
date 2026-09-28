import { brand, footer, mainNav } from '../data/site'

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
          <p className="eyebrow">Redes sociais</p>
          <ul>
            {footer.social.map((item) => (
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
            {mainNav.map((item) => (
              <li key={item.label}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <p className="site-footer__legal">{footer.legal}</p>
    </footer>
  )
}
