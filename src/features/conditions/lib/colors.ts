/**
 * Colores indicadores por temperatura.
 * Pensados para teñir las tarjetas de un vistazo.
 */

/** Aire / sensacion termica: frio (azul) → confort (verde) → calor (rojo). */
export function airTempColor(t: number): string {
  if (t >= 32) return '#ef4444' // rojo — calor fuerte
  if (t >= 30) return '#f97316' // naranja
  if (t >= 28) return '#f59e0b' // ambar
  if (t >= 27) return '#eab308' // amarillo
  if (t >= 13) return '#22c55e' // verde — confortable
  if (t >= 8) return '#22d3ee' // cian — fresco
  return '#3b82f6' // azul — frio
}

export interface UvInfo {
  level: string
  color: string
  advice: string
}

/** Indice UV con categoria OMS, color y consejo. */
export function uvInfo(uv: number): UvInfo {
  if (uv >= 11) return { level: 'Extremo', color: '#a855f7', advice: 'Evita exponerte al sol' }
  if (uv >= 8) return { level: 'Muy alto', color: '#ef4444', advice: 'Evita el sol de mediodía' }
  if (uv >= 6) return { level: 'Alto', color: '#f97316', advice: 'Protección necesaria' }
  if (uv >= 3) return { level: 'Moderado', color: '#eab308', advice: 'Protección recomendada' }
  return { level: 'Bajo', color: '#22c55e', advice: 'Sin protección necesaria' }
}

/** Temperatura del agua: verde a 22°, azules al enfriar, naranjas al calentar. */
export function waterTempColor(t: number): string {
  if (t >= 27) return '#f97316' // naranja — caliente
  if (t >= 25) return '#fb923c' // naranja claro
  if (t >= 24) return '#fbbf24' // ambar
  if (t >= 22) return '#22c55e' // verde — agradable
  if (t >= 20) return '#14b8a6' // verde azulado
  if (t >= 18) return '#06b6d4' // cian
  if (t >= 15) return '#0ea5e9' // azul claro
  return '#3b82f6' // azul — fria
}
