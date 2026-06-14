import type { TidePoint } from '@/features/conditions/types'
import { formatHour } from '@/features/conditions/lib/format'

const W = 320
const H = 160
const PAD = { left: 10, right: 10, top: 18, bottom: 26 }

/** Grafico de curva de la marea (altura del mar) para las proximas horas. */
export function TideChart({ points }: { points: TidePoint[] }) {
  if (points.length < 2) {
    return <p className="py-6 text-center text-sm text-slate-500">Sin datos de marea.</p>
  }

  const heights = points.map((p) => p.height)
  let min = Math.min(...heights)
  let max = Math.max(...heights)
  if (max === min) {
    max += 0.5
    min -= 0.5
  }
  const pad = (max - min) * 0.15
  min -= pad
  max += pad

  const innerW = W - PAD.left - PAD.right
  const innerH = H - PAD.top - PAD.bottom
  const x = (i: number) => PAD.left + (i * innerW) / (points.length - 1)
  const y = (h: number) => PAD.top + (1 - (h - min) / (max - min)) * innerH

  const pts = points.map((p, i) => ({ x: x(i), y: y(p.height) }))
  const line = smoothPath(pts)
  const area = `${line} L ${pts[pts.length - 1].x} ${H - PAD.bottom} L ${pts[0].x} ${H - PAD.bottom} Z`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Curva de marea">
      <defs>
        <linearGradient id="tideFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#38bdf8" stopOpacity="0.5" />
          <stop offset="1" stopColor="#38bdf8" stopOpacity="0.04" />
        </linearGradient>
      </defs>

      <path d={area} fill="url(#tideFill)" />
      <path d={line} fill="none" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" />

      {/* Punto "ahora" */}
      <circle cx={pts[0].x} cy={pts[0].y} r="5" fill="#0284c7" stroke="#fff" strokeWidth="2" />
      <text x={pts[0].x} y={pts[0].y - 10} textAnchor="middle" fontSize="10" fill="#0f172a" fontWeight="700">
        Ahora
      </text>

      {/* Etiquetas de hora cada 3 h */}
      {points.map((p, i) =>
        i !== 0 && i % 3 === 0 ? (
          <text
            key={p.time}
            x={x(i)}
            y={H - 8}
            textAnchor="middle"
            fontSize="10"
            fill="#64748b"
          >
            {formatHour(p.time)}
          </text>
        ) : null,
      )}
    </svg>
  )
}

/** Construye un path SVG suavizado a partir de puntos (suavizado por cuadraticas). */
function smoothPath(pts: { x: number; y: number }[]): string {
  let d = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 0; i < pts.length - 1; i++) {
    const xMid = (pts[i].x + pts[i + 1].x) / 2
    const yMid = (pts[i].y + pts[i + 1].y) / 2
    d += ` Q ${(xMid + pts[i].x) / 2} ${pts[i].y} ${xMid} ${yMid}`
    d += ` Q ${(xMid + pts[i + 1].x) / 2} ${pts[i + 1].y} ${pts[i + 1].x} ${pts[i + 1].y}`
  }
  return d
}
