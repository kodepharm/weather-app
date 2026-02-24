'use client'

import { useEffect, useState } from 'react'
import { CurrentWeatherData } from '@/types/weather'
import WeatherIcon from './WeatherIcon'
import { formatTemp, capitalizeWords } from '@/lib/formatters'
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
  const { name, sys, main, weather } = data
  const condition = weather[0]
  const { dateString, timeString } = useClock()

  // Ticks every minute to keep "X min ago" accurate
  const [minuteNow, setMinuteNow] = useState(new Date())
  useEffect(() => {
    const interval = setInterval(() => setMinuteNow(new Date()), 60_000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-slate-800/60 backdrop-blur-md rounded-xl border border-slate-700/50 p-5 text-center shrink-0">
      {/* Clock */}
      {dateString && (
        <div className="border-b border-slate-700/50 pb-3 mb-4">
          <p className="text-sky-300 text-base font-medium">{dateString}</p>
          <p className="text-white text-6xl font-thin tracking-widest leading-tight">{timeString}</p>
        </div>
      )}

      {/* Weather */}
      <p className="text-slate-400 text-base font-medium uppercase tracking-widest mb-1">
        {name}, {sys.country}
      </p>
      <div className="flex items-center justify-center gap-3 mt-1">
        <WeatherIcon icon={condition.icon} description={condition.description} size={80} />
        <span className="text-sky-200 text-8xl font-thin">{formatTemp(main.temp)}</span>
      </div>
      <p className="text-slate-300 text-2xl mt-2 capitalize">{capitalizeWords(condition.description)}</p>
      <p className="text-slate-500 text-base mt-1">
        Feels like {formatTemp(main.feels_like)} &middot; H:{formatTemp(main.temp_max)} L:{formatTemp(main.temp_min)}
      </p>

      {/* Last updated */}
      {lastUpdated && (
        <p className="text-slate-600 text-xs mt-3">
          {getLastUpdatedLabel(lastUpdated, minuteNow)}
        </p>
      )}
    </div>
  )
}
