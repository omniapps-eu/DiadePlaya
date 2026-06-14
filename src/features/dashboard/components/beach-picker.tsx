'use client'

import { useState } from 'react'
import { MapPin, Plus, X } from 'lucide-react'
import { BEACH_CATALOG } from '@/features/beaches/lib/catalog'
import { useBeachesStore } from '@/features/beaches/store/use-beaches-store'

/** Boton + modal para anadir playas favoritas desde el catalogo. */
export function BeachPicker() {
  const [open, setOpen] = useState(false)
  const addFavorite = useBeachesStore((s) => s.addFavorite)
  const isFavorite = useBeachesStore((s) => s.isFavorite)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 rounded-full bg-white/25 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/35"
      >
        <Plus size={16} /> Añadir playa
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Elige una playa</h2>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <ul className="max-h-80 space-y-1 overflow-y-auto">
              {BEACH_CATALOG.map((beach) => {
                const added = isFavorite(beach.id)
                return (
                  <li key={beach.id}>
                    <button
                      disabled={added}
                      onClick={() => addFavorite(beach)}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition hover:bg-sky-50 disabled:opacity-50"
                    >
                      <span className="flex items-center gap-2">
                        <MapPin size={16} className="text-sky-500" />
                        <span>
                          <span className="block font-semibold text-slate-900">{beach.name}</span>
                          <span className="block text-xs text-slate-500">{beach.region}</span>
                        </span>
                      </span>
                      <span className="text-xs font-medium text-sky-600">
                        {added ? 'Añadida' : 'Añadir'}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  )
}
