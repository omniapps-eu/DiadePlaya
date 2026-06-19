'use client'

import type { Timeframe } from '@/features/conditions/types'

interface Props {
  value: Timeframe
  onChange: (t: Timeframe) => void
  /** ISO times de slot0/slot1/slot2 devueltos por la API. */
  slotTimes?: [string, string, string]
  /** Tiempo de referencia "ahora" de la API (para calcular día relativo). */
  fetchedAt?: string
}

const SLOT_IDS: Timeframe[] = ['slot0', 'slot1', 'slot2']

/**
 * Deriva la etiqueta de un slot a partir de su tiempo ISO y el tiempo de referencia.
 * Ej: mismo día → "12h" | "17h"  •  día siguiente → "Mañana 12h"  •  pasado → "Pasado 12h"
 */
function slotLabel(slotIso: string, nowIso: string): string {
  const slotDay = slotIso.slice(0, 10)
  const nowDay = nowIso.slice(0, 10)
  const hour = parseInt(slotIso.slice(11, 13), 10)

  if (slotDay === nowDay) return `${hour}h`

  const diffMs = new Date(slotDay).getTime() - new Date(nowDay).getTime()
  const diffDays = Math.round(diffMs / 86_400_000)

  if (diffDays === 1) return `Mañana ${hour}h`
  return `Pasado ${hour}h`
}

/**
 * Calcula los 3 próximos slots [12h, 17h] desde la hora actual del cliente.
 * Se usa solo como fallback mientras la API no ha respondido aún.
 */
function fallbackLabels(): [string, string, string] {
  const HOURS = [12, 17]
  const now = new Date()
  const labels: string[] = []

  for (let dayOff = 0; dayOff <= 2 && labels.length < 3; dayOff++) {
    for (const hour of HOURS) {
      if (labels.length >= 3) break
      const target = new Date(now)
      target.setDate(target.getDate() + dayOff)
      target.setHours(hour, 0, 0, 0)
      if (target > now) {
        if (dayOff === 0) labels.push(`${hour}h`)
        else if (dayOff === 1) labels.push(`Mañana ${hour}h`)
        else labels.push(`Pasado ${hour}h`)
      }
    }
  }

  while (labels.length < 3) labels.push('—')
  return [labels[0], labels[1], labels[2]]
}

/** Selector de franja temporal: "Ahora" + los 3 próximos francos horarios inteligentes. */
export function TimeframeTabs({ value, onChange, slotTimes, fetchedAt }: Props) {
  const labels: [string, string, string] =
    slotTimes && fetchedAt
      ? [
          slotLabel(slotTimes[0], fetchedAt),
          slotLabel(slotTimes[1], fetchedAt),
          slotLabel(slotTimes[2], fetchedAt),
        ]
      : fallbackLabels()

  return (
    <div className="space-y-2">
      <button
        onClick={() => onChange('now')}
        className={`w-full rounded-2xl px-4 py-2 text-sm font-bold transition ${
          value === 'now'
            ? 'bg-white text-sky-700 shadow'
            : 'bg-white/20 text-[var(--gm-fg)] hover:bg-white/30'
        }`}
      >
        Ahora
      </button>

      <div className="flex gap-1.5">
        {SLOT_IDS.map((id, i) => (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`flex-1 rounded-xl px-2 py-2 text-sm font-semibold transition ${
              value === id
                ? 'bg-white text-sky-700 shadow'
                : 'bg-white/20 text-[var(--gm-fg-muted)] hover:bg-white/30'
            }`}
          >
            {labels[i]}
          </button>
        ))}
      </div>
    </div>
  )
}
