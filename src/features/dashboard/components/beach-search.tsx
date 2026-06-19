'use client'

import { useState } from 'react'
import { Loader2, MapPin, Search, X } from 'lucide-react'
import { useBeachSearch } from '@/features/beaches/hooks/use-beach-search'
import { useBeachesStore } from '@/features/beaches/store/use-beaches-store'
import type { Beach } from '@/features/beaches/types'

/** Icono de buscador inteligente + modal de busqueda de cualquier playa de Espana. */
export function BeachSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const { results, loading } = useBeachSearch(query)
  const addFavorite = useBeachesStore((s) => s.addFavorite)
  const select = useBeachesStore((s) => s.select)
  const isFavorite = useBeachesStore((s) => s.isFavorite)

  function pick(beach: Beach) {
    addFavorite(beach)
    select(beach.id)
    setOpen(false)
    setQuery('')
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Buscar playa"
        className="flex h-11 w-11 items-center justify-center rounded-full bg-white/25 text-[var(--gm-fg)] backdrop-blur-md transition hover:bg-white/40"
      >
        <Search size={20} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 pt-16"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white p-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 rounded-2xl bg-slate-100 px-3 py-2.5">
              <Search size={18} className="text-slate-400" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Busca una playa de España…"
                className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
              />
              {loading ? (
                <Loader2 size={18} className="animate-spin text-slate-400" />
              ) : (
                <button onClick={() => setOpen(false)} aria-label="Cerrar">
                  <X size={18} className="text-slate-400 hover:text-slate-600" />
                </button>
              )}
            </div>

            <ul className="mt-3 max-h-80 space-y-1 overflow-y-auto">
              {results.map((beach) => {
                const added = isFavorite(beach.id)
                return (
                  <li key={beach.id}>
                    <button
                      onClick={() => pick(beach)}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition hover:bg-sky-50"
                    >
                      <span className="flex items-center gap-2">
                        <MapPin size={16} className="shrink-0 text-sky-500" />
                        <span>
                          <span className="block font-semibold text-slate-900">{beach.name}</span>
                          <span className="block text-xs text-slate-500">{beach.region}</span>
                        </span>
                      </span>
                      <span className="text-xs font-medium text-sky-600">
                        {added ? 'Ya añadida' : 'Añadir'}
                      </span>
                    </button>
                  </li>
                )
              })}

              {!loading && query.trim().length >= 2 && results.length === 0 && (
                <li className="px-3 py-6 text-center text-sm text-slate-500">
                  No encontramos playas para “{query}”.
                </li>
              )}
              {query.trim().length < 2 && (
                <li className="px-3 py-6 text-center text-sm text-slate-400">
                  Escribe el nombre de una playa (p. ej. “Bolonia”, “La Concha”).
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </>
  )
}
