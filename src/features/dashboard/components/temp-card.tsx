import type { ReactNode } from 'react'
import { airTempColor, waterTempColor } from '@/features/conditions/lib/colors'

interface TempCardProps {
  label: string
  /** Temperatura que define el color del indicador. */
  temp: number | null
  scale: 'air' | 'water'
  value: ReactNode
  sub?: ReactNode
  icon?: ReactNode
}

/** Tarjeta de temperatura que se tiñe segun el valor (frio→calor). */
export function TempCard({ label, temp, scale, value, sub, icon }: TempCardProps) {
  const color = temp == null ? '#94a3b8' : scale === 'water' ? waterTempColor(temp) : airTempColor(temp)

  return (
    <div className="gm-card relative flex flex-col gap-1 overflow-hidden p-4">
      {/* Tinte de color segun temperatura */}
      <div
        className="pointer-events-none absolute inset-0 transition-colors duration-700"
        style={{ background: `linear-gradient(140deg, ${color}66, ${color}14 70%)` }}
        aria-hidden
      />
      {/* Barra-indicador lateral */}
      <div
        className="pointer-events-none absolute inset-y-3 left-0 w-1.5 rounded-full transition-colors duration-700"
        style={{ background: color }}
        aria-hidden
      />

      <div className="relative flex items-center justify-between text-white/90">
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
        {icon}
      </div>
      <div className="relative text-2xl font-bold text-white drop-shadow">{value}</div>
      {sub && <div className="relative text-sm text-white/90">{sub}</div>}
    </div>
  )
}
