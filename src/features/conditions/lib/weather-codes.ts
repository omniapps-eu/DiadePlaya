/**
 * Mapeo de WMO weather codes (Open-Meteo) a etiqueta en español,
 * nombre de icono de lucide-react y si el cielo se considera despejado.
 * Ref: https://open-meteo.com/en/docs (WMO Weather interpretation codes)
 */

export interface WeatherInfo {
  label: string
  icon: string // nombre de icono lucide-react
  clear: boolean
}

const MAP: Record<number, WeatherInfo> = {
  0: { label: 'Despejado', icon: 'Sun', clear: true },
  1: { label: 'Mayormente despejado', icon: 'SunDim', clear: true },
  2: { label: 'Parcialmente nublado', icon: 'CloudSun', clear: true },
  3: { label: 'Nublado', icon: 'Cloud', clear: false },
  45: { label: 'Niebla', icon: 'CloudFog', clear: false },
  48: { label: 'Niebla con escarcha', icon: 'CloudFog', clear: false },
  51: { label: 'Llovizna ligera', icon: 'CloudDrizzle', clear: false },
  53: { label: 'Llovizna', icon: 'CloudDrizzle', clear: false },
  55: { label: 'Llovizna intensa', icon: 'CloudDrizzle', clear: false },
  61: { label: 'Lluvia ligera', icon: 'CloudRain', clear: false },
  63: { label: 'Lluvia', icon: 'CloudRain', clear: false },
  65: { label: 'Lluvia intensa', icon: 'CloudRainWind', clear: false },
  71: { label: 'Nieve ligera', icon: 'CloudSnow', clear: false },
  73: { label: 'Nieve', icon: 'CloudSnow', clear: false },
  75: { label: 'Nieve intensa', icon: 'CloudSnow', clear: false },
  80: { label: 'Chubascos ligeros', icon: 'CloudRain', clear: false },
  81: { label: 'Chubascos', icon: 'CloudRain', clear: false },
  82: { label: 'Chubascos fuertes', icon: 'CloudRainWind', clear: false },
  95: { label: 'Tormenta', icon: 'CloudLightning', clear: false },
  96: { label: 'Tormenta con granizo', icon: 'CloudLightning', clear: false },
  99: { label: 'Tormenta fuerte', icon: 'CloudLightning', clear: false },
}

export function weatherInfo(code: number): WeatherInfo {
  return MAP[code] ?? { label: 'Desconocido', icon: 'CloudOff', clear: false }
}

/** Convierte grados de dirección de viento a punto cardinal. */
export function windCardinal(deg: number): string {
  const points = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO']
  return points[Math.round(deg / 45) % 8]
}
