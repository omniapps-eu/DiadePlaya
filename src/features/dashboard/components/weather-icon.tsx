import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudMoon,
  CloudOff,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  CloudSun,
  Moon,
  Sun,
  SunDim,
  type LucideIcon,
} from 'lucide-react'
import { weatherInfo } from '@/features/conditions/lib/weather-codes'

const ICONS: Record<string, LucideIcon> = {
  Sun,
  SunDim,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  CloudLightning,
  CloudOff,
  Moon,
  CloudMoon,
}

/**
 * Renderiza el icono meteorologico segun el WMO code.
 * De noche (isDay = false) usa luna en cielos despejados/poco nubosos.
 */
export function WeatherIcon({
  code,
  size = 18,
  isDay = true,
}: {
  code: number
  size?: number
  isDay?: boolean
}) {
  let name = weatherInfo(code).icon
  if (!isDay) {
    if (code === 0 || code === 1) name = 'Moon'
    else if (code === 2) name = 'CloudMoon'
  }
  const Icon = ICONS[name] ?? CloudOff
  return <Icon size={size} />
}
