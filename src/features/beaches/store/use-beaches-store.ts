import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Beach } from '../types'

/**
 * Estado de playas favoritas + seleccion actual.
 * Persiste en localStorage para v1 (sin auth). Cuando se conecte Supabase,
 * la sincronizacion de favoritas se anadira aqui.
 */
interface BeachesState {
  favorites: Beach[]
  selectedId: string | null
  addFavorite: (beach: Beach) => void
  removeFavorite: (id: string) => void
  select: (id: string) => void
  isFavorite: (id: string) => boolean
}

export const useBeachesStore = create<BeachesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      selectedId: null,
      addFavorite: (beach) =>
        set((s) =>
          s.favorites.some((b) => b.id === beach.id)
            ? s
            : { favorites: [...s.favorites, beach], selectedId: s.selectedId ?? beach.id },
        ),
      removeFavorite: (id) =>
        set((s) => {
          const favorites = s.favorites.filter((b) => b.id !== id)
          const selectedId = s.selectedId === id ? (favorites[0]?.id ?? null) : s.selectedId
          return { favorites, selectedId }
        }),
      select: (id) => set({ selectedId: id }),
      isFavorite: (id) => get().favorites.some((b) => b.id === id),
    }),
    { name: 'playa-favorites' },
  ),
)
