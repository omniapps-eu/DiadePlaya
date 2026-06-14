import {
  Cloud,
  CloudFog,
  CloudLightning,
  CloudSnow,
  CloudSun,
  Sun,
} from 'lucide-react'
import type { ConditionSnapshot } from '@/features/conditions/types'
import { weatherInfo } from '@/features/conditions/lib/weather-codes'
import { round } from '@/features/conditions/lib/format'

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

/** Tinte del cielo de fondo segun la categoria. */
const TINT: Record<SkyCategory, string> = {
  clear: 'linear-gradient(140deg, #fde68a88, #38bdf81f 70%)',
  partly: 'linear-gradient(140deg, #fde68a55, #93c5fd33 70%)',
  cloudy: 'linear-gradient(140deg, #cbd5e177, #94a3b81f 70%)',
  drizzle: 'linear-gradient(140deg, #bae6fd66, #64748b22 70%)',
  rain: 'linear-gradient(140deg, #93c5fd66, #47556933 70%)',
  storm: 'linear-gradient(140deg, #a5b4fc66, #1e293b44 70%)',
  snow: 'linear-gradient(140deg, #e0f2fe88, #94a3b822 70%)',
  fog: 'linear-gradient(140deg, #e2e8f088, #94a3b822 70%)',
}

/** Tarjeta de cielo con escena meteorologica animada segun la prevision. */
export function SkyCard({ snapshot }: { snapshot: ConditionSnapshot }) {
  const cat = categorize(snapshot.weatherCode)
  const info = weatherInfo(snapshot.weatherCode)

  return (
    <div className="gm-card relative col-span-2 flex min-h-[120px] items-center gap-4 overflow-hidden p-4 sm:col-span-3">
      <div
        className="pointer-events-none absolute inset-0 transition-colors duration-700"
        style={{ background: TINT[cat] }}
        aria-hidden
      />
      <SkyScene category={cat} />
      <div className="relative min-w-0 flex-1">
        <div className="text-xs font-medium uppercase tracking-wide text-white/90">Cielo</div>
        <div className="text-xl font-bold leading-tight text-white drop-shadow sm:text-2xl">
          {info.label}
        </div>
        <div className="text-sm text-white/90">{round(snapshot.cloudCover, '%')} de nubes</div>
      </div>
    </div>
  )
}

/** Escena animada: sol que gira, nubes que flotan, gotas que caen. */
function SkyScene({ category }: { category: SkyCategory }) {
  return (
    <div className="relative h-16 w-16 shrink-0 text-white drop-shadow">
      {category === 'clear' && <Sun size={56} className="gm-spin-slow text-amber-300" />}
      {category === 'partly' && <CloudSun size={56} className="gm-float text-amber-100" />}
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
