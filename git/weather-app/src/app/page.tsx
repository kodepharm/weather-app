'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import LiveClock from '@/components/weather/LiveClock'
import LocationSearch from '@/components/weather/LocationSearch'
import CurrentWeather from '@/components/weather/CurrentWeather'
import WeatherDetails from '@/components/weather/WeatherDetails'
import ForecastStrip from '@/components/weather/ForecastStrip'
import SchoolClosingsWidget from '@/components/school-closings/SchoolClosingsWidget'
import { useWeather } from '@/hooks/useWeather'
import { useForecast } from '@/hooks/useForecast'

const LOCATION_KEY = 'weather_location'
const REFRESH_INTERVAL = 10 * 60 * 1000 // 10 minutes

export default function HomePage() {
  const [savedLocation, setSavedLocation] = useState('')
  const { data: weather, loading: weatherLoading, error: weatherError, fetchWeather } = useWeather()
  const { days, loading: forecastLoading, error: forecastError, fetchForecast } = useForecast()

  useEffect(() => {
    const saved = localStorage.getItem(LOCATION_KEY)
    if (saved) {
      setSavedLocation(saved)
      Promise.all([fetchWeather(saved), fetchForecast(saved)])
    }
  }, [fetchWeather, fetchForecast])

  // Auto-refresh weather every 10 minutes
  useEffect(() => {
    if (!savedLocation) return
    const interval = setInterval(() => {
      Promise.all([fetchWeather(savedLocation), fetchForecast(savedLocation)])
    }, REFRESH_INTERVAL)
    return () => clearInterval(interval)
  }, [savedLocation, fetchWeather, fetchForecast])

  const handleSearch = useCallback(async (query: string) => {
    localStorage.setItem(LOCATION_KEY, query)
    setSavedLocation(query)
    await Promise.all([fetchWeather(query), fetchForecast(query)])
  }, [fetchWeather, fetchForecast])

  const loading = weatherLoading || forecastLoading

  return (
    <div className="h-full flex flex-col gap-2 overflow-hidden">
      {/* Top bar: clock left, search + manage right */}
      <div className="flex items-center justify-between gap-4 shrink-0">
        <LiveClock />
        <div className="flex items-center gap-3">
          <LocationSearch onSearch={handleSearch} loading={loading} initialValue={savedLocation} />
          <Link href="/school-closings" className="text-slate-400 hover:text-sky-400 text-xs whitespace-nowrap transition-colors">
            Manage →
          </Link>
        </div>
      </div>

      {/* Error */}
      {(weatherError || forecastError) && !loading && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-1.5 shrink-0">
          <p className="text-red-400 text-xs">{weatherError || forecastError}</p>
        </div>
      )}

      {/* No location yet */}
      {!weather && !loading && !savedLocation && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-500 text-sm">Enter a city name or ZIP code above to get started</p>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="flex-1 grid grid-cols-2 gap-2 animate-pulse">
          <div className="flex flex-col gap-2">
            <div className="h-40 bg-slate-800/60 rounded-xl" />
            <div className="flex-1 bg-slate-800/40 rounded-xl" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-36 bg-slate-800/40 rounded-xl" />
            <div className="flex-1 bg-slate-800/40 rounded-xl" />
          </div>
        </div>
      )}

      {/* Dashboard: 2-column grid */}
      {weather && !loading && (
        <div className="flex-1 grid grid-cols-2 gap-2 min-h-0 overflow-hidden">
          {/* Left: current weather + details */}
          <div className="flex flex-col gap-2 min-h-0">
            <CurrentWeather data={weather} />
            <WeatherDetails data={weather} />
          </div>
          {/* Right: forecast + school closings */}
          <div className="flex flex-col gap-2 min-h-0">
            {days.length > 0 && <ForecastStrip days={days} />}
            <SchoolClosingsWidget />
          </div>
        </div>
      )}

      {/* School closings alone when no weather loaded */}
      {!weather && !loading && savedLocation && <SchoolClosingsWidget />}
    </div>
  )
}
