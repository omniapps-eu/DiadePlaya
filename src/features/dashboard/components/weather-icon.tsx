import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudOff,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  CloudSun,
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
}

/** Renderiza el icono meteorologico segun el WMO code. */
export function WeatherIcon({ code, size = 18 }: { code: number; size?: number }) {
  const Icon = ICONS[weatherInfo(code).icon] ?? CloudOff
  return <Icon size={size} />
}
