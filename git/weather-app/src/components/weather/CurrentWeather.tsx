'use client'

import { useEffect, useState } from 'react'
import { CurrentWeatherData } from '@/types/weather'
import WeatherIcon from './WeatherIcon'
import { formatTemp, capitalizeWords, formatWind, formatTime, formatVisibility } from '@/lib/formatters'
import { useClock } from '@/hooks/useClock'

interface CurrentWeatherProps {
  data: CurrentWeatherData
  lastUpdated?: Date | null
}

function getLastUpdatedLabel(lastUpdated: Date, now: Date): string {
  const mins = Math.floor((now.getTime() - lastUpdated.getTime()) / 60000)
  if (mins < 1) return 'Updated just now'
  if (mins === 1) return 'Updated 1 min ago'
  return `Updated ${mins} min ago`
}

export default function CurrentWeather({ data, lastUpdated }: CurrentWeatherProps) {
  const { name, sys, main, weather, wind, visibility, timezone } = data
  const condition = weather[0]

  const details = [
    { label: 'Humidity',   value: `${main.humidity}%`,                    icon: '💧' },
    { label: 'Wind',       value: formatWind(wind.speed, wind.deg),        icon: '💨' },
    { label: 'Pressure',   value: `${main.pressure} hPa`,                 icon: '🌡' },
    { label: 'Visibility', value: formatVisibility(visibility),            icon: '👁' },
    { label: 'Sunrise',    value: formatTime(sys.sunrise, timezone),       icon: '🌅' },
    { label: 'Sunset',     value: formatTime(sys.sunset, timezone),        icon: '🌇' },
  ]
  const { dateString, timeString } = useClock()

  // Ticks every minute to keep "X min ago" accurate
  const [minuteNow, setMinuteNow] = useState(new Date())
  useEffect(() => {
    const interval = setInterval(() => setMinuteNow(new Date()), 60_000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-slate-800/60 backdrop-blur-md rounded-xl border border-slate-700/50 p-5 flex-1 min-h-0 flex gap-5">
      {/* Left — clock + live temperature */}
      <div className="flex-1 flex flex-col justify-between items-center text-center min-w-0 overflow-hidden">
        {/* Clock */}
        <div className="shrink-0">
          <p className="text-sky-300 text-3xl font-bold tracking-widest leading-tight">{dateString}</p>
          <p className="text-white text-5xl font-bold tracking-widest leading-tight">{timeString}</p>
        </div>

        {/* Current weather */}
        <div className="shrink-0">
          <p className="text-slate-400 text-sm font-medium uppercase tracking-widest mb-1">
            {name}, {sys.country}
          </p>
          <div className="flex items-center justify-center gap-2">
            <WeatherIcon icon={condition.icon} description={condition.description} size={64} />
            <span className="text-sky-200 text-5xl font-bold">{formatTemp(main.temp)}</span>
          </div>
          <p className="text-slate-300 text-lg mt-1 capitalize">{capitalizeWords(condition.description)}</p>
        </div>

        {/* Feels like + last updated */}
        <div className="shrink-0">
          <p className="text-slate-500 text-sm">
            Feels like {formatTemp(main.feels_like)} &middot; H:{formatTemp(main.temp_max)} L:{formatTemp(main.temp_min)}
          </p>
          {lastUpdated && (
            <p className="text-slate-600 text-xs mt-1">
              {getLastUpdatedLabel(lastUpdated, minuteNow)}
            </p>
          )}
        </div>
      </div>

      {/* Vertical divider */}
      <div className="w-px self-stretch bg-slate-700/50 shrink-0" />

      {/* Right — details */}
      <div className="flex-1 flex flex-col justify-center min-w-0">
        <div className="grid grid-cols-2 gap-2">
          {details.map(({ label, value, icon }) => (
            <div key={label} className="bg-slate-700/40 rounded-lg p-3">
              <p className="text-slate-500 text-sm mb-1">{icon} {label}</p>
              <p className="text-slate-200 text-xl font-medium">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
