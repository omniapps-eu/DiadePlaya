/** Formatea un ISO local "2026-06-14T17:00" a "17:00". */
export function formatHour(iso: string): string {
  return iso.slice(11, 16)
}

/** Redondea a entero y anade unidad. */
export function round(n: number | null, unit = ''): string {
  if (n == null) return '—'
  return `${Math.round(n)}${unit}`
}
