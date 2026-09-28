import { newIn } from '../data/site'

export default function NewIn() {
  return (
    <section className="new-in" aria-labelledby="new-in-title">
      <h2 id="new-in-title">{newIn.title}</h2>
      <p>{newIn.text}</p>
      <p className="new-in__empty">{newIn.emptyMessage}</p>
    </section>
  )
}
