import { NextResponse } from 'next/server'
import type { Beach } from '@/features/beaches/types'

/**
 * GET /api/beaches/search?q=...
 * Buscador inteligente de playas (geocoding gratuito via Nominatim/OpenStreetMap).
 * Sin API key. Da prioridad a resultados que son playas reales.
 */

const NOMINATIM = 'https://nominatim.openstreetmap.org/search'

interface NominatimResult {
  osm_id: number
  lat: string
  lon: string
  type: string
  category: string
  name?: string
  display_name: string
  address?: Record<string, string>
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = (searchParams.get('q') ?? '').trim()
  if (q.length < 2) return NextResponse.json({ results: [] })

  const params = new URLSearchParams({
    q,
    format: 'jsonv2',
    limit: '8',
    countrycodes: 'es',
    addressdetails: '1',
    'accept-language': 'es',
  })

  try {
    const res = await fetch(`${NOMINATIM}?${params}`, {
      headers: { 'User-Agent': 'PlayaApp/1.0 (beach-conditions)' },
      next: { revalidate: 86400 },
    })
    if (!res.ok) throw new Error(`Nominatim ${res.status}`)
    const raw: NominatimResult[] = await res.json()
    return NextResponse.json({ results: toBeaches(raw) })
  } catch (err) {
    console.error('[beaches/search] error', err)
    return NextResponse.json({ error: 'No se pudo buscar' }, { status: 502 })
  }
}

function toBeaches(raw: NominatimResult[]): Beach[] {
  return raw
    // Playas reales primero (type=beach), luego el resto de costa
    .sort((a, b) => Number(b.type === 'beach') - Number(a.type === 'beach'))
    .map((r) => ({
      id: `osm-${r.osm_id}`,
      name: r.name || r.display_name.split(',')[0],
      region: regionLabel(r.address),
      latitude: Number(r.lat),
      longitude: Number(r.lon),
    }))
}

function regionLabel(address?: Record<string, string>): string {
  if (!address) return 'España'
  return (
    address.city ||
    address.town ||
    address.village ||
    address.province ||
    address.state ||
    'España'
  )
}
