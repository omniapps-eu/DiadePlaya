'use client'

import { X } from 'lucide-react'
import { useBeachesStore } from '@/features/beaches/store/use-beaches-store'
import { BeachPicker } from './beach-picker'

/** Chips horizontales de playas favoritas + boton para anadir. */
export function FavoritesBar() {
  const favorites = useBeachesStore((s) => s.favorites)
  const selectedId = useBeachesStore((s) => s.selectedId)
  const select = useBeachesStore((s) => s.select)
  const removeFavorite = useBeachesStore((s) => s.removeFavorite)

  return (
    <div className="flex flex-wrap items-center gap-2">
      {favorites.map((beach) => {
        const active = beach.id === selectedId
        return (
          <span
            key={beach.id}
            className={`group flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold backdrop-blur-md transition ${
              active ? 'bg-white text-sky-700 shadow' : 'bg-white/25 text-[var(--gm-fg)] hover:bg-white/35'
            }`}
          >
            <button onClick={() => select(beach.id)}>{beach.name}</button>
            <button
              onClick={() => removeFavorite(beach.id)}
              className="opacity-60 transition hover:opacity-100"
              aria-label={`Quitar ${beach.name}`}
            >
              <X size={14} />
            </button>
          </span>
        )
      })}
      <BeachPicker />
    </div>
  )
}
