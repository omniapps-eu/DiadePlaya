import type { TideInfo, TideExtreme } from '../types'

/**
 * Analiza la serie horaria de altura del mar (sea_level_height_msl) para
 * derivar el estado de la marea y las proximas pleamar/bajamar.
 *
 * @param times  array ISO de tiempos horarios
 * @param heights array de alturas en metros (mismo length que times)
 * @param nowIso tiempo actual ISO (para localizar el indice "ahora")
 */
export function analyzeTide(
  times: string[],
  heights: (number | null)[],
  nowIso: string,
): TideInfo {
  const now = Date.parse(nowIso)
  // Indice de la hora actual (la mas cercana hacia atras)
  let i = times.findIndex((t) => Date.parse(t) > now) - 1
  if (i < 0) i = 0

  const current = heights[i] ?? 0
  const next = heights[i + 1] ?? current
  const state: TideInfo['state'] = next >= current ? 'rising' : 'falling'

  const nextHigh = findNextExtreme(times, heights, i, 'high')
  const nextLow = findNextExtreme(times, heights, i, 'low')
  const level = computeLevel(heights, i)

  return { currentHeight: current, state, nextHigh, nextLow, level }
}

/**
 * Nivel del agua 0..1 normalizando la altura actual entre el minimo y maximo
 * de la ventana de marea alrededor de `i` (~un ciclo completo, ±13h).
 */
function computeLevel(heights: (number | null)[], i: number): number {
  const win = 13
  const from = Math.max(0, i - win)
  const to = Math.min(heights.length - 1, i + win)
  let min = Infinity
  let max = -Infinity
  for (let j = from; j <= to; j++) {
    const h = heights[j]
    if (h == null) continue
    if (h < min) min = h
    if (h > max) max = h
  }
  const cur = heights[i] ?? min
  if (!isFinite(min) || !isFinite(max) || max === min) return 0.5
  return Math.min(1, Math.max(0, (cur - min) / (max - min)))
}

/** Busca el siguiente maximo (pleamar) o minimo (bajamar) local a partir de `from`. */
function findNextExtreme(
  times: string[],
  heights: (number | null)[],
  from: number,
  kind: 'high' | 'low',
): TideExtreme | null {
  for (let j = from + 1; j < heights.length - 1; j++) {
    const prev = heights[j - 1]
    const curr = heights[j]
    const nxt = heights[j + 1]
    if (prev == null || curr == null || nxt == null) continue
    const isMax = curr >= prev && curr > nxt
    const isMin = curr <= prev && curr < nxt
    if ((kind === 'high' && isMax) || (kind === 'low' && isMin)) {
      return { time: times[j], height: curr }
    }
  }
  return null
}
