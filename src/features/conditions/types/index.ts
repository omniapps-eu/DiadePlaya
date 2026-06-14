/**
 * Tipos del dominio de condiciones de playa.
 * Las condiciones provienen de Open-Meteo (Forecast + Marine APIs).
 */

export type Timeframe = 'now' | 'afternoon' | 'tomorrow'

export const TIMEFRAMES: { id: Timeframe; label: string }[] = [
  { id: 'now', label: 'Ahora' },
  { id: 'afternoon', label: 'Esta tarde' },
  { id: 'tomorrow', label: 'Mañana' },
]

/** Snapshot de condiciones en un instante concreto. */
export interface ConditionSnapshot {
  time: string
  airTemp: number
  apparentTemp: number
  waterTemp: number | null
  cloudCover: number
  windSpeed: number
  windDirection: number
  weatherCode: number
  waveHeight: number | null
  uvIndex: number | null
  isDay: boolean
}

/** Un extremo de marea (pleamar o bajamar). */
export interface TideExtreme {
  time: string
  height: number
}

export interface TideInfo {
  currentHeight: number
  state: 'rising' | 'falling'
  nextHigh: TideExtreme | null
  nextLow: TideExtreme | null
  /** Nivel del agua normalizado 0..1 dentro del ciclo (0 = bajamar, 1 = pleamar). */
  level: number
}

/** Resultado completo para una playa. */
export interface BeachConditions {
  fetchedAt: string
  timezone: string
  snapshots: Record<Timeframe, ConditionSnapshot>
  /** Marea calculada para cada franja temporal (cambia con el dia). */
  tides: Record<Timeframe, TideInfo>
}
