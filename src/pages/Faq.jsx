import { useState } from 'react'
import usePageMeta from '../hooks/usePageMeta'
import { faq } from '../data/site'

export default function Faq() {
  usePageMeta({
    title: 'Perguntas frequentes',
    description: 'Tire suas dúvidas sobre encomendas, entregas, pagamento e retirada na Laberna Dulce.',
  })

  const [openIndex, setOpenIndex] = useState(null)

  return (
    <div className="faq-page">
      <h1 className="reveal">Perguntas frequentes</h1>
      <p className="eyebrow reveal">tire suas dúvidas sobre a laberna dulce</p>

      <div className="faq-list">
        {faq.map((item, index) => {
          const isOpen = openIndex === index
          return (
            <div key={item.question} className={`faq-item reveal ${isOpen ? 'is-open' : ''}`}>
              <button
                type="button"
                className="faq-item__question"
                aria-expanded={isOpen}
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                {item.question}
                <span className="faq-item__icon" aria-hidden="true">
                  +
                </span>
              </button>
              <div className="faq-item__answer-wrap">
                <div className="faq-item__answer">
                  <p>{item.answer}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
