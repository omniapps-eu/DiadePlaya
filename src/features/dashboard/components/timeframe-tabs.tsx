'use client'

import { TIMEFRAMES, type Timeframe } from '@/features/conditions/types'

interface Props {
  value: Timeframe
  onChange: (t: Timeframe) => void
}

/** Selector de franja temporal: Ahora / Esta tarde / Mañana. */
export function TimeframeTabs({ value, onChange }: Props) {
  return (
    <div className="flex gap-1 rounded-full bg-white/20 p-1 backdrop-blur-md">
      {TIMEFRAMES.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
            value === t.id ? 'bg-white text-sky-700 shadow' : 'text-white/90 hover:bg-white/10'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}
