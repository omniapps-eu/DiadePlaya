'use client'

import { useEffect, useState } from 'react'
import type { Beach } from '@/features/beaches/types'
import type { BeachConditions } from '../types'

/** Carga las condiciones de una playa desde /api/conditions. */
export function useConditions(beach: Beach | null) {
  const [data, setData] = useState<BeachConditions | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!beach) {
      setData(null)
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)
    fetch(`/api/conditions?lat=${beach.latitude}&lon=${beach.longitude}`)
      .then(async (r) => {
        if (!r.ok) throw new Error('fetch failed')
        return r.json()
      })
      .then((d: BeachConditions) => {
        if (!cancelled) setData(d)
      })
      .catch(() => {
        if (!cancelled) setError('No se pudieron cargar las condiciones')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [beach])

  return { data, loading, error }
}
