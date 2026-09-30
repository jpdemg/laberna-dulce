import { useCallback, useEffect, useRef } from 'react'

const SITE_KEY = '10b24dae-7c74-4b34-8e08-4524a84a29d6'

function waitForHCaptcha() {
  if (window.hcaptcha) return Promise.resolve(window.hcaptcha)
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (window.hcaptcha) {
        clearInterval(interval)
        resolve(window.hcaptcha)
      }
    }, 100)
  })
}

export default function useHCaptcha() {
  const containerRef = useRef(null)
  const widgetIdRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    waitForHCaptcha().then((hcaptcha) => {
      if (cancelled || !containerRef.current || widgetIdRef.current !== null) return
      widgetIdRef.current = hcaptcha.render(containerRef.current, {
        sitekey: SITE_KEY,
        size: 'invisible',
      })
    })
    return () => {
      cancelled = true
    }
  }, [])

  const execute = useCallback(async () => {
    const hcaptcha = await waitForHCaptcha()
    if (widgetIdRef.current === null) {
      throw new Error('O captcha ainda está carregando, tente novamente em alguns segundos.')
    }
    const { response } = await hcaptcha.execute(widgetIdRef.current, { async: true })
    return response
  }, [])

  const reset = useCallback(() => {
    if (window.hcaptcha && widgetIdRef.current !== null) {
      window.hcaptcha.reset(widgetIdRef.current)
    }
  }, [])

  return { containerRef, execute, reset }
}
