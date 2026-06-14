import { Sun } from 'lucide-react'
import { uvInfo } from '@/features/conditions/lib/colors'

/** Tarjeta de indice UV: valor + categoria OMS, tintada por nivel. */
export function UvCard({ uv }: { uv: number | null }) {
  if (uv == null) {
    return (
      <div className="gm-card flex flex-col gap-1 p-4">
        <div className="flex items-center justify-between text-white/90">
          <span className="text-xs font-medium uppercase tracking-wide">Índice UV</span>
          <Sun size={18} />
        </div>
        <div className="text-2xl font-bold text-white">—</div>
        <div className="text-sm text-white/90">No disponible</div>
      </div>
    )
  }

  const info = uvInfo(uv)
  return (
    <div className="gm-card relative flex flex-col gap-1 overflow-hidden p-4">
      <div
        className="pointer-events-none absolute inset-0 transition-colors duration-700"
        style={{ background: `linear-gradient(140deg, ${info.color}66, ${info.color}14 70%)` }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-3 left-0 w-1.5 rounded-full"
        style={{ background: info.color }}
        aria-hidden
      />

      <div className="relative flex items-center justify-between text-white/90">
        <span className="text-xs font-medium uppercase tracking-wide">Índice UV</span>
        <Sun size={18} />
      </div>
      <div className="relative text-2xl font-bold text-white drop-shadow">
        {Math.round(uv)} <span className="text-base font-semibold text-white/90">· {info.level}</span>
      </div>
      <div className="relative text-sm text-white/90">{info.advice}</div>
    </div>
  )
}
