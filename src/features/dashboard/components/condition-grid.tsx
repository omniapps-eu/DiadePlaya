import { Droplets, Thermometer } from 'lucide-react'
import type {
  ConditionSnapshot,
  HourlyPoint,
  TideInfo,
  TidePoint,
} from '@/features/conditions/types'
import { windCardinal } from '@/features/conditions/lib/weather-codes'
import { round } from '@/features/conditions/lib/format'
import { MetricCard } from './metric-card'
import { TempCard } from './temp-card'
import { TideCard } from './tide-card'
import { SkyCard } from './sky-card'
import { UvCard } from './uv-card'
import { WindCompass } from './wind-compass'

/** Cuadricula con todas las condiciones de un snapshot. */
export function ConditionGrid({
  snapshot,
  tide,
  tideSeries,
  hourly,
}: {
  snapshot: ConditionSnapshot
  tide?: TideInfo
  tideSeries?: TidePoint[]
  hourly?: HourlyPoint[]
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      <TideCard tide={tide} series={tideSeries} />

      <SkyCard snapshot={snapshot} hourly={hourly} />

      <TempCard
        label="Sensación"
        temp={snapshot.apparentTemp}
        scale="air"
        value={round(snapshot.apparentTemp, '°')}
        sub={`Aire ${round(snapshot.airTemp, '°')}`}
        icon={<Thermometer size={18} />}
      />

      <TempCard
        label="Aire"
        temp={snapshot.airTemp}
        scale="air"
        value={round(snapshot.airTemp, '°')}
        sub="Temperatura"
        icon={<Thermometer size={18} />}
      />

      <TempCard
        label="Agua"
        temp={snapshot.waterTemp}
        scale="water"
        value={round(snapshot.waterTemp, '°')}
        sub={snapshot.waveHeight != null ? `Olas ${snapshot.waveHeight.toFixed(1)} m` : 'Olas —'}
        icon={<Droplets size={18} />}
      />

      <MetricCard
        label="Viento"
        value={round(snapshot.windSpeed, ' km/h')}
        sub={`Dirección ${windCardinal(snapshot.windDirection)}`}
        icon={<WindCompass direction={snapshot.windDirection} />}
      />

      <UvCard uv={snapshot.uvIndex} />
    </div>
  )
}
