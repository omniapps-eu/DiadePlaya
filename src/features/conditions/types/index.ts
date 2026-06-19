/**
 * Tipos del dominio de condiciones de playa.
 * Las condiciones provienen de Open-Meteo (Forecast + Marine APIs).
 */

export type Timeframe = 'now' | 'slot0' | 'slot1' | 'slot2'

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
  /** Temperatura máxima del día (para la etiqueta "máx X°"). */
  maxAirTemp: number | null
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

/** Punto de la prevision hora a hora. */
export interface HourlyPoint {
  time: string
  airTemp: number
  weatherCode: number
  isDay: boolean
}

/** Punto de la curva de marea (altura del mar en metros respecto al nivel medio). */
export interface TidePoint {
  time: string
  height: number
}

/** Resultado completo para una playa. */
export interface BeachConditions {
  fetchedAt: string
  timezone: string
  snapshots: Record<Timeframe, ConditionSnapshot>
  /** Marea calculada para cada franja temporal (cambia con el dia). */
  tides: Record<Timeframe, TideInfo>
  /** Prevision de las proximas horas (desde la hora actual). */
  hourly: HourlyPoint[]
  /** Curva de marea de las proximas ~12 horas (desde la hora actual). */
  tideSeries: TidePoint[]
}
