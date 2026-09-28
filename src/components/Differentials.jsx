import { differentials } from '../data/site'

const icons = [
  <path key="gift" d="M12 8v13M4 12h16v9H4v-9Zm-1-4h18v4H3V8Zm5-4a3 3 0 0 1 4 4 3 3 0 0 1 4-4 3 3 0 0 1-4 4 3 3 0 0 1-4-4Z" />,
  <path key="custom" d="M4 20 8 4l4 4 4-4 4 16H4Z" />,
  <path key="calendar" d="M4 6h16v14H4V6Zm0 4h16M8 3v4M16 3v4" />,
  <path key="delivery" d="M3 7h11v8H3zM14 10h4l3 3v2h-7zM6.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm12 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />,
]

export default function Differentials() {
  return (
    <section className="differentials" id="diferenciais" aria-label="Diferenciais">
      <ul>
        {differentials.map((item, index) => (
          <li key={item.title}>
            <svg viewBox="0 0 24 24" aria-hidden="true">{icons[index % icons.length]}</svg>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
