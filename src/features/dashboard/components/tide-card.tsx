import { ArrowDownRight, ArrowUpRight, Waves } from 'lucide-react'
import type { TideInfo } from '@/features/conditions/types'
import { formatHour } from '@/features/conditions/lib/format'

/** Tarjeta de marea: el agua sube al nivel real del ciclo, con olas suaves. */
export function TideCard({ tide }: { tide?: TideInfo }) {
  if (!tide) return null
  const rising = tide.state === 'rising'
  const pct = Math.round((tide.level ?? 0.5) * 100)

  return (
    <div className="gm-card relative col-span-2 flex min-h-[180px] flex-col gap-3 overflow-hidden p-4">
      {/* Agua que sube hasta el nivel actual de la marea */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 transition-[height] duration-1000 ease-out"
        style={{ height: `${pct}%` }}
        aria-hidden
      >
        <div className="absolute inset-x-0 -top-3 h-5 overflow-hidden">
          <WaveLayer className="gm-wave" fill="rgba(255,255,255,0.45)" />
          <WaveLayer className="gm-wave-slow" fill="rgba(125,198,245,0.55)" />
        </div>
        <div className="absolute inset-0 top-1 bg-gradient-to-b from-sky-400/45 to-sky-600/55" />
      </div>

      {/* Contenido */}
      <div className="relative flex items-center justify-between text-white/90">
        <span className="text-xs font-medium uppercase tracking-wide">Marea</span>
        <Waves size={18} />
      </div>

      <div className="relative flex items-center gap-2 text-white">
        {rising ? <ArrowUpRight size={28} /> : <ArrowDownRight size={28} />}
        <span className="text-2xl font-bold drop-shadow">{rising ? 'Subiendo' : 'Bajando'}</span>
        <span className="ml-auto text-sm font-semibold text-white/90 drop-shadow">{pct}%</span>
      </div>

      <div className="relative mt-auto grid grid-cols-2 gap-2 text-sm">
        <TideRow label="Pleamar" time={tide.nextHigh?.time} />
        <TideRow label="Bajamar" time={tide.nextLow?.time} />
      </div>
    </div>
  )
}

function TideRow({ label, time }: { label: string; time?: string }) {
  return (
    <div className="rounded-xl bg-white/25 px-3 py-2 backdrop-blur-sm">
      <div className="text-xs text-white/80">{label}</div>
      <div className="font-semibold text-white drop-shadow">{time ? formatHour(time) : '—'}</div>
    </div>
  )
}

/** Capa de onda SVG repetible (200% de ancho) para animar en bucle. */
function WaveLayer({ className, fill }: { className: string; fill: string }) {
  return (
    <svg
      className={`absolute left-0 top-0 h-5 w-[200%] ${className}`}
      viewBox="0 0 1200 40"
      preserveAspectRatio="none"
    >
      <path
        d="M0 20 Q 150 0 300 20 T 600 20 T 900 20 T 1200 20 V40 H0 Z"
        fill={fill}
      />
    </svg>
  )
}
