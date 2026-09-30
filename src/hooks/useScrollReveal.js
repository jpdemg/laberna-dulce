import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function useScrollReveal() {
  const { pathname } = useLocation()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -80px 0px' },
    )

    const observeNode = (node) => {
      if (node.nodeType !== 1) return
      if (node.matches?.('.reveal:not(.is-visible)')) observer.observe(node)
      node.querySelectorAll?.('.reveal:not(.is-visible)').forEach((el) => observer.observe(el))
    }

    observeNode(document.body)

    // Conteúdo carregado depois do mount (produtos vindos do Supabase, por exemplo)
    // entra no DOM tarde demais pro escaneamento inicial acima, então observa também
    // qualquer `.reveal` novo que apareça enquanto a página estiver montada.
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach(observeNode)
      })
    })
    mutationObserver.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mutationObserver.disconnect()
    }
  }, [pathname])
}
