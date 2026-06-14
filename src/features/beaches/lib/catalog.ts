import type { Beach } from '../types'

/**
 * Catalogo de playas populares de Espana para arrancar sin auth.
 * Mas adelante el usuario podra anadir las suyas (persistidas en Supabase).
 */
export const BEACH_CATALOG: Beach[] = [
  { id: 'malvarrosa', name: 'La Malvarrosa', region: 'Valencia', latitude: 39.4775, longitude: -0.3247 },
  { id: 'concha', name: 'La Concha', region: 'San Sebastián', latitude: 43.3183, longitude: -1.9889 },
  { id: 'barceloneta', name: 'La Barceloneta', region: 'Barcelona', latitude: 41.3784, longitude: 2.1925 },
  { id: 'bolonia', name: 'Bolonia', region: 'Cádiz', latitude: 36.0892, longitude: -5.7714 },
  { id: 'maspalomas', name: 'Maspalomas', region: 'Gran Canaria', latitude: 27.7372, longitude: -15.5861 },
  { id: 'sardinero', name: 'El Sardinero', region: 'Santander', latitude: 43.4772, longitude: -3.7843 },
  { id: 'rodas', name: 'Playa de Rodas', region: 'Islas Cíes', latitude: 42.2197, longitude: -8.9047 },
  { id: 'levante', name: 'Playa de Levante', region: 'Benidorm', latitude: 38.5411, longitude: -0.1225 },
  { id: 'muro', name: 'Playa de Muro', region: 'Mallorca', latitude: 39.7861, longitude: 3.1206 },
  { id: 'zahara', name: 'Zahara de los Atunes', region: 'Cádiz', latitude: 36.1369, longitude: -5.8472 },
]

export function findBeach(id: string): Beach | undefined {
  return BEACH_CATALOG.find((b) => b.id === id)
}
