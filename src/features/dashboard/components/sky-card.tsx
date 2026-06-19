'use client'

import { useState } from 'react'
import {
  ChevronRight,
  Cloud,
  CloudFog,
  CloudLightning,
  CloudMoon,
  CloudSnow,
  CloudSun,
  Moon,
  Sun,
  X,
} from 'lucide-react'
import type { ConditionSnapshot, HourlyPoint } from '@/features/conditions/types'
import { weatherInfo } from '@/features/conditions/lib/weather-codes'
import { formatHour, round } from '@/features/conditions/lib/format'
import { WeatherIcon } from './weather-icon'

type SkyCategory = 'clear' | 'partly' | 'cloudy' | 'drizzle' | 'rain' | 'storm' | 'snow' | 'fog'

function categorize(code: number): SkyCategory {
  if (code === 0 || code === 1) return 'clear'
  if (code === 2) return 'partly'
  if (code === 3) return 'cloudy'
  if (code === 45 || code === 48) return 'fog'
  if (code >= 51 && code <= 57) return 'drizzle'
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return 'rain'
  if (code >= 71 && code <= 77) return 'snow'
  if (code >= 95) return 'storm'
  return 'cloudy'
}

/** Tinte del cielo de fondo segun la categoria (tonos medios para que el blanco se lea). */
const TINT: Record<SkyCategory, string> = {
  clear: 'linear-gradient(140deg, #f59e0baa, #0284c766 70%)',
  partly: 'linear-gradient(140deg, #d97706aa, #2563eb66 70%)',
  cloudy: 'linear-gradient(140deg, #64748bcc, #475569aa 70%)',
  drizzle: 'linear-gradient(140deg, #527599cc, #475569aa 70%)',
  rain: 'linear-gradient(140deg, #3b6fa6cc, #334155aa 70%)',
  storm: 'linear-gradient(140deg, #4f46e5bb, #1e293bcc 70%)',
  snow: 'linear-gradient(140deg, #7c93accc, #64748baa 70%)',
  fog: 'linear-gradient(140deg, #6b7a8acc, #57606faa 70%)',
}

/** Tinte para cielo despejado/poco nuboso de noche. */
const NIGHT_TINT = 'linear-gradient(140deg, #1e293b66, #334155aa 70%)'

/** Tarjeta de cielo: escena animada + abre detalle por horas al pulsar. */
export function SkyCard({
  snapshot,
  hourly = [],
}: {
  snapshot: ConditionSnapshot
  hourly?: HourlyPoint[]
}) {
  const [open, setOpen] = useState(false)
  const cat = categorize(snapshot.weatherCode)
  const info = weatherInfo(snapshot.weatherCode)
  const night = !snapshot.isDay
  const tint = night && (cat === 'clear' || cat === 'partly') ? NIGHT_TINT : TINT[cat]

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="gm-card relative col-span-2 flex min-h-[120px] items-center gap-4 overflow-hidden p-4 text-left transition active:scale-[0.99] sm:col-span-3"
      >
        <div
          className="pointer-events-none absolute inset-0 transition-colors duration-700"
          style={{ background: tint }}
          aria-hidden
        />
        <SkyScene category={cat} night={night} />
        <div className="relative min-w-0 flex-1">
          <div className="text-xs font-medium uppercase tracking-wide text-[var(--gm-fg-muted)]">Cielo</div>
          <div className="text-xl font-bold leading-tight text-[var(--gm-fg)] sm:text-2xl">
            {info.label}
          </div>
          <div className="text-sm text-[var(--gm-fg-muted)]">{round(snapshot.cloudCover, '%')} de nubes</div>
        </div>
        <span className="relative flex shrink-0 items-center gap-1 text-sm font-medium text-[var(--gm-fg-muted)]">
          Por horas <ChevronRight size={16} />
        </span>
      </button>

      {open && <HourlyModal hourly={hourly} onClose={() => setOpen(false)} />}
    </>
  )
}

/** Ventana con la prevision de las proximas horas, icono por hora. */
function HourlyModal({ hourly, onClose }: { hourly: HourlyPoint[]; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Próximas horas</h2>
          <button onClick={onClose} aria-label="Cerrar" className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        {hourly.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-500">Sin datos por horas.</p>
        ) : (
          <ul className="max-h-96 space-y-1 overflow-y-auto">
            {hourly.map((h, i) => {
              const info = weatherInfo(h.weatherCode)
              return (
                <li
                  key={h.time}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 odd:bg-slate-50"
                >
                  <span className="w-12 shrink-0 font-semibold text-slate-900">
                    {i === 0 ? 'Ahora' : formatHour(h.time)}
                  </span>
                  <span className="text-sky-600">
                    <WeatherIcon code={h.weatherCode} size={22} isDay={h.isDay} />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm text-slate-600">{info.label}</span>
                  <span className="shrink-0 font-bold text-slate-900">{round(h.airTemp, '°')}</span>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

/** Escena animada: sol/luna, nubes que flotan, gotas que caen. */
function SkyScene({ category, night = false }: { category: SkyCategory; night?: boolean }) {
  return (
    <div className="relative h-16 w-16 shrink-0 text-white drop-shadow">
      {category === 'clear' &&
        (night ? (
          <Moon size={52} className="gm-float text-slate-100" />
        ) : (
          <Sun size={56} className="gm-spin-slow text-amber-300" />
        ))}
      {category === 'partly' &&
        (night ? (
          <CloudMoon size={56} className="gm-float text-slate-100" />
        ) : (
          <CloudSun size={56} className="gm-float text-amber-100" />
        ))}
      {category === 'cloudy' && <Cloud size={56} className="gm-float text-white" />}
      {category === 'fog' && <CloudFog size={56} className="gm-float text-slate-100" />}
      {category === 'snow' && <CloudSnow size={56} className="gm-float text-sky-100" />}
      {category === 'storm' && <CloudLightning size={56} className="gm-float text-indigo-100" />}

      {(category === 'drizzle' || category === 'rain') && (
        <>
          <Cloud size={56} className="gm-float text-slate-100" />
          <Raindrops intense={category === 'rain'} />
        </>
      )}
    </div>
  )
}

function Raindrops({ intense }: { intense: boolean }) {
  const drops = intense ? [0, 0.2, 0.4, 0.6, 0.8] : [0.1, 0.5]
  return (
    <div className="absolute inset-x-2 bottom-0 flex justify-between" aria-hidden>
      {drops.map((delay, i) => (
        <span
          key={i}
          className="gm-rain-drop block h-2.5 w-0.5 rounded-full bg-sky-200/90"
          style={{ animationDelay: `${delay}s` }}
        />
      ))}
    </div>
  )
}
