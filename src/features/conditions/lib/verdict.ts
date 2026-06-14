import type { ConditionSnapshot } from '../types'

export type VerdictLevel = 'great' | 'ok' | 'poor'

export interface Verdict {
  level: VerdictLevel
  title: string
  emoji: string
}

/**
 * Veredicto familiar de un vistazo: "¿vale la pena ir?".
 * Heuristica simple pensada para un dia de playa en familia.
 */
export function getVerdict(s: ConditionSnapshot): Verdict {
  if (s.weatherCode >= 51) {
    return { level: 'poor', title: 'Mejor otro día — hay lluvia', emoji: '🌧️' }
  }
  if (s.windSpeed > 30) {
    return { level: 'poor', title: 'Demasiado viento para la sombrilla', emoji: '💨' }
  }
  if (s.apparentTemp < 19) {
    return { level: 'ok', title: 'Fresco para bañarse', emoji: '🧥' }
  }
  if (s.windSpeed > 22 || s.cloudCover > 70) {
    return { level: 'ok', title: 'Se puede ir, con reservas', emoji: '⛅' }
  }
  return { level: 'great', title: '¡Buen día de playa!', emoji: '🏖️' }
}
