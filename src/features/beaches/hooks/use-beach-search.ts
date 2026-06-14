'use client'

import { useEffect, useState } from 'react'
import type { Beach } from '../types'

/** Busqueda de playas con debounce contra /api/beaches/search. */
export function useBeachSearch(query: string) {
  const [results, setResults] = useState<Beach[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const q = query.trim()
    if (q.length < 2) {
      setResults([])
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    const timer = setTimeout(() => {
      fetch(`/api/beaches/search?q=${encodeURIComponent(q)}`)
        .then((r) => r.json())
        .then((d: { results?: Beach[] }) => {
          if (!cancelled) setResults(d.results ?? [])
        })
        .catch(() => {
          if (!cancelled) setResults([])
        })
        .finally(() => {
          if (!cancelled) setLoading(false)
        })
    }, 350)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [query])

  return { results, loading }
}
