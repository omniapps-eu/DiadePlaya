import { NextResponse } from 'next/server'
import { getBeachConditions } from '@/features/conditions/services/open-meteo'

/**
 * GET /api/conditions?lat=..&lon=..
 * Devuelve las condiciones combinadas de Open-Meteo para una playa.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lat = Number(searchParams.get('lat'))
  const lon = Number(searchParams.get('lon'))

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return NextResponse.json({ error: 'lat y lon son requeridos' }, { status: 400 })
  }

  try {
    const data = await getBeachConditions(lat, lon)
    return NextResponse.json(data)
  } catch (err) {
    console.error('[conditions] error', err)
    return NextResponse.json({ error: 'No se pudieron obtener las condiciones' }, { status: 502 })
  }
}
