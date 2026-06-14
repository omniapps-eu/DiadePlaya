import { z } from 'zod'
import type {
  BeachConditions,
  ConditionSnapshot,
  HourlyPoint,
  TidePoint,
  Timeframe,
} from '../types'
import { analyzeTide } from '../lib/tides'

/**
 * Cliente de Open-Meteo (Forecast + Marine APIs).
 * Gratuito, sin API key. Devuelve condiciones combinadas por playa.
 */

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'
const MARINE_URL = 'https://marine-api.open-meteo.com/v1/marine'

const numArray = z.array(z.number().nullable())

const forecastSchema = z.object({
  timezone: z.string(),
  current: z.object({
    time: z.string(),
    temperature_2m: z.number(),
    apparent_temperature: z.number(),
    cloud_cover: z.number(),
    wind_speed_10m: z.number(),
    wind_direction_10m: z.number(),
    weather_code: z.number(),
    uv_index: z.number().nullable(),
    is_day: z.number(),
  }),
  hourly: z.object({
    time: z.array(z.string()),
    temperature_2m: numArray,
    apparent_temperature: numArray,
    cloud_cover: numArray,
    wind_speed_10m: numArray,
    wind_direction_10m: numArray,
    weather_code: numArray,
    uv_index: numArray,
    is_day: numArray,
  }),
})

const marineSchema = z.object({
  current: z.object({
    sea_surface_temperature: z.number().nullable(),
    wave_height: z.number().nullable(),
  }),
  hourly: z.object({
    time: z.array(z.string()),
    sea_surface_temperature: numArray,
    wave_height: numArray,
    sea_level_height_msl: numArray,
  }),
})

type Forecast = z.infer<typeof forecastSchema>
type Marine = z.infer<typeof marineSchema>

async function fetchJson(url: string): Promise<unknown> {
  const res = await fetch(url, { next: { revalidate: 900 } })
  if (!res.ok) throw new Error(`Open-Meteo ${res.status}: ${url}`)
  return res.json()
}

export async function getBeachConditions(
  latitude: number,
  longitude: number,
): Promise<BeachConditions> {
  const fParams = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current:
      'temperature_2m,apparent_temperature,cloud_cover,wind_speed_10m,wind_direction_10m,weather_code,uv_index,is_day',
    hourly:
      'temperature_2m,apparent_temperature,cloud_cover,wind_speed_10m,wind_direction_10m,weather_code,uv_index,is_day',
    forecast_days: '2',
    timezone: 'auto',
  })
  const mParams = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: 'sea_surface_temperature,wave_height',
    hourly: 'sea_surface_temperature,wave_height,sea_level_height_msl',
    forecast_days: '3',
    timezone: 'auto',
  })

  const [fRaw, mRaw] = await Promise.all([
    fetchJson(`${FORECAST_URL}?${fParams}`),
    fetchJson(`${MARINE_URL}?${mParams}`),
  ])

  const forecast = forecastSchema.parse(fRaw)
  const marine = marineSchema.parse(mRaw)

  const now = forecast.current.time
  const snapshots: Record<Timeframe, ConditionSnapshot> = {
    now: currentSnapshot(forecast, marine),
    afternoon: snapshotAt(forecast, marine, hourIndexFor(forecast.hourly.time, now, 0, 17)),
    tomorrow: snapshotAt(forecast, marine, hourIndexFor(forecast.hourly.time, now, 1, 13)),
  }

  // La marea se calcula respecto al momento de cada franja: cambia con el dia.
  const tideFor = (ref: string) =>
    analyzeTide(marine.hourly.time, marine.hourly.sea_level_height_msl, ref)
  const tides: Record<Timeframe, ReturnType<typeof tideFor>> = {
    now: tideFor(now),
    afternoon: tideFor(snapshots.afternoon.time),
    tomorrow: tideFor(snapshots.tomorrow.time),
  }

  const hourly = buildHourly(forecast, now, 10)
  const tideSeries = buildTideSeries(marine, now, 25)

  return { fetchedAt: now, timezone: forecast.timezone, snapshots, tides, hourly, tideSeries }
}

/** Snapshot del momento actual (usa los bloques `current`). */
function currentSnapshot(f: Forecast, m: Marine): ConditionSnapshot {
  return {
    time: f.current.time,
    airTemp: f.current.temperature_2m,
    apparentTemp: f.current.apparent_temperature,
    waterTemp: m.current.sea_surface_temperature,
    cloudCover: f.current.cloud_cover,
    windSpeed: f.current.wind_speed_10m,
    windDirection: f.current.wind_direction_10m,
    weatherCode: f.current.weather_code,
    waveHeight: m.current.wave_height,
    uvIndex: f.current.uv_index,
    isDay: f.current.is_day === 1,
  }
}

/** Snapshot en un indice horario concreto. */
function snapshotAt(f: Forecast, m: Marine, i: number): ConditionSnapshot {
  const mi = matchMarineIndex(m.hourly.time, f.hourly.time[i])
  return {
    time: f.hourly.time[i],
    airTemp: f.hourly.temperature_2m[i] ?? 0,
    apparentTemp: f.hourly.apparent_temperature[i] ?? 0,
    waterTemp: m.hourly.sea_surface_temperature[mi] ?? null,
    cloudCover: f.hourly.cloud_cover[i] ?? 0,
    windSpeed: f.hourly.wind_speed_10m[i] ?? 0,
    windDirection: f.hourly.wind_direction_10m[i] ?? 0,
    weatherCode: f.hourly.weather_code[i] ?? 0,
    waveHeight: m.hourly.wave_height[mi] ?? null,
    uvIndex: f.hourly.uv_index[i] ?? null,
    isDay: (f.hourly.is_day[i] ?? 1) === 1,
  }
}

/** Prevision hora a hora desde la hora actual (incluida). */
function buildHourly(f: Forecast, nowIso: string, count: number): HourlyPoint[] {
  const floor = `${nowIso.slice(0, 13)}:00` // "2026-06-14T09:15" -> "2026-06-14T09:00"
  let start = f.hourly.time.indexOf(floor)
  if (start < 0) {
    const n = Date.parse(nowIso)
    start = f.hourly.time.findIndex((t) => Date.parse(t) >= n)
    if (start < 0) start = 0
  }
  const out: HourlyPoint[] = []
  for (let k = 0; k < count && start + k < f.hourly.time.length; k++) {
    const i = start + k
    out.push({
      time: f.hourly.time[i],
      airTemp: f.hourly.temperature_2m[i] ?? 0,
      weatherCode: f.hourly.weather_code[i] ?? 0,
      isDay: (f.hourly.is_day[i] ?? 1) === 1,
    })
  }
  return out
}

/** Serie de altura del mar desde la hora actual (incluida) para la curva de marea. */
function buildTideSeries(m: Marine, nowIso: string, count: number): TidePoint[] {
  const floor = `${nowIso.slice(0, 13)}:00`
  let start = m.hourly.time.indexOf(floor)
  if (start < 0) {
    const n = Date.parse(nowIso)
    start = m.hourly.time.findIndex((t) => Date.parse(t) >= n)
    if (start < 0) start = 0
  }
  const out: TidePoint[] = []
  for (let k = 0; k < count && start + k < m.hourly.time.length; k++) {
    const i = start + k
    const h = m.hourly.sea_level_height_msl[i]
    if (h == null) continue
    out.push({ time: m.hourly.time[i], height: h })
  }
  return out
}

/** Indice horario para `dayOffset` dias desde hoy a la hora `hour` local. */
function hourIndexFor(times: string[], nowIso: string, dayOffset: number, hour: number): number {
  // Construimos la fecha objetivo sin pasar por UTC para no desplazar el dia.
  const d = new Date(`${nowIso.slice(0, 10)}T00:00:00`)
  d.setDate(d.getDate() + dayOffset)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const target = `${y}-${m}-${day}T${String(hour).padStart(2, '0')}:00`
  const idx = times.indexOf(target)
  return idx >= 0 ? idx : Math.max(0, Math.min(times.length - 1, 0))
}

/** Empareja el indice de la serie marina con un tiempo de la serie de clima. */
function matchMarineIndex(marineTimes: string[], time: string): number {
  const idx = marineTimes.indexOf(time)
  return idx >= 0 ? idx : 0
}
