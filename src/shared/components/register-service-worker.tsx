'use client'

import { useEffect } from 'react'

/**
 * Registra el service worker de la PWA en produccion.
 * En desarrollo NO se registra (y se desregistra cualquiera existente) para
 * evitar servir bundles viejos en cache durante el hot-reload.
 */
export function RegisterServiceWorker() {
  useEffect(() => {
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return

    if (process.env.NODE_ENV !== 'production') {
      navigator.serviceWorker.getRegistrations().then((regs) => regs.forEach((r) => r.unregister()))
      return
    }

    navigator.serviceWorker.register('/sw.js').catch(() => {
      /* silencioso: la app funciona igual sin SW */
    })
  }, [])

  return null
}
