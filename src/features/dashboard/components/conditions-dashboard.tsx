'use client'

import { useEffect, useState } from 'react'
import { MapPin } from 'lucide-react'
import { useBeachesStore } from '@/features/beaches/store/use-beaches-store'
import { useConditions } from '@/features/conditions/hooks/use-conditions'
import type { Timeframe } from '@/features/conditions/types'
import { FavoritesBar } from './favorites-bar'
import { BeachSearch } from './beach-search'
import { TimeframeTabs } from './timeframe-tabs'
import { ConditionGrid } from './condition-grid'

/** Pantalla principal: condiciones de la playa seleccionada de un vistazo. */
export function ConditionsDashboard() {
  const [mounted, setMounted] = useState(false)
  const [timeframe, setTimeframe] = useState<Timeframe>('now')
  useEffect(() => setMounted(true), [])

  const favorites = useBeachesStore((s) => s.favorites)
  const selectedId = useBeachesStore((s) => s.selectedId)
  const selectedBeach = favorites.find((b) => b.id === selectedId) ?? null

  const { data, loading, error } = useConditions(mounted ? selectedBeach : null)
  const snapshot = data?.snapshots[timeframe]
  const cloudy = (snapshot?.cloudCover ?? 0) > 60

  // Evita mismatch de hidratacion con el estado persistido en localStorage.
  if (!mounted) return <Shell cloudy={false} />

  return (
    <Shell cloudy={cloudy}>
      <header className="space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-sm font-semibold uppercase tracking-widest text-white/80">
            Mi día de Playa
          </h1>
          <BeachSearch />
        </div>
        <FavoritesBar />
      </header>

      {!selectedBeach ? (
        <EmptyState />
      ) : (
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-white">
            <MapPin size={20} />
            <h2 className="text-2xl font-bold">{selectedBeach.name}</h2>
            <span className="text-white/70">· {selectedBeach.region}</span>
          </div>

          <TimeframeTabs value={timeframe} onChange={setTimeframe} />

          {loading && <p className="text-white/80">Cargando condiciones…</p>}
          {error && <p className="text-white/90">{error}</p>}

          {snapshot && <ConditionGrid snapshot={snapshot} tide={data.tides[timeframe]} />}
        </section>
      )}
    </Shell>
  )
}

function EmptyState() {
  return (
    <div className="gm-card mt-6 flex flex-col items-center gap-3 p-8 text-center">
      <span className="text-5xl">🏖️</span>
      <h2 className="text-xl font-bold text-white">Añade tu primera playa</h2>
      <p className="max-w-xs text-white/85">
        Guarda tus playas favoritas y mira todas sus condiciones de un vistazo: marea, viento,
        temperatura del agua y más.
      </p>
    </div>
  )
}

function Shell({ children, cloudy }: { children?: React.ReactNode; cloudy: boolean }) {
  return (
    <main className={`min-h-screen ${cloudy ? 'gm-mesh-cloudy' : 'gm-mesh'}`}>
      <div className="mx-auto w-full max-w-2xl space-y-6 p-5 pb-16">{children}</div>
    </main>
  )
}
