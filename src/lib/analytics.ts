let analyticsInitialized = false

export function initAnalytics(): void {
  if (analyticsInitialized || typeof window === 'undefined') return

  const gaId = import.meta.env.VITE_GA_ID
  const clarityId = import.meta.env.VITE_CLARITY_ID

  if (gaId) {
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
    document.head.appendChild(script)

    window.dataLayer = window.dataLayer || []
    function gtag(...args: unknown[]) {
      window.dataLayer?.push(args)
    }
    gtag('js', new Date())
    gtag('config', gaId, { anonymize_ip: true })
    window.gtag = gtag
  }

  if (clarityId) {
    const script = document.createElement('script')
    script.innerHTML = `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "${clarityId}");`
    document.head.appendChild(script)
  }

  analyticsInitialized = true
}

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

export function trackEvent(name: string, params?: Record<string, string | number | boolean>): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', name, params)
  }
}
