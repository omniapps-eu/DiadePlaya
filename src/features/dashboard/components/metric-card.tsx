import type { ReactNode } from 'react'

interface MetricCardProps {
  label: string
  value: ReactNode
  sub?: ReactNode
  icon?: ReactNode
  className?: string
}

/** Tarjeta de metrica reutilizable sobre el fondo gradient-mesh. */
export function MetricCard({ label, value, sub, icon, className = '' }: MetricCardProps) {
  return (
    <div className={`gm-card flex flex-col gap-1 p-4 ${className}`}>
      <div className="flex items-center justify-between text-[var(--gm-fg-faint)]">
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
        {icon}
      </div>
      <div className="text-2xl font-bold text-[var(--gm-fg)]">{value}</div>
      {sub && <div className="text-sm text-[var(--gm-fg-faint)]">{sub}</div>}
    </div>
  )
}
