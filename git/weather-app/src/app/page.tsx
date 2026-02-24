'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import LocationSearch from '@/components/weather/LocationSearch'
import CurrentWeather from '@/components/weather/CurrentWeather'
import WeatherDetails from '@/components/weather/WeatherDetails'
import ForecastStrip from '@/components/weather/ForecastStrip'
import PrayerTimes from '@/components/weather/PrayerTimes'
import SchoolClosingsWidget from '@/components/school-closings/SchoolClosingsWidget'
import { useWeather } from '@/hooks/useWeather'
import { useForecast } from '@/hooks/useForecast'
import { usePrayer } from '@/hooks/usePrayer'

const LOCATION_KEY = 'weather_location'
const REFRESH_INTERVAL = 10 * 60 * 1000  // 10 minutes
const STALE_THRESHOLD  = 15 * 60 * 1000  // 15 minutes
const SHIFT_INTERVAL   =  4 * 60 * 1000  //  4 minutes

export default function HomePage() {
  const [savedLocation, setSavedLocation] = useState('')
  const { data: weather, loading: weatherLoading, error: weatherError, lastUpdated, fetchWeather } = useWeather()
  const { days, fetchForecast } = useForecast()
  const { data: prayerData, fetchPrayer } = usePrayer()

  const coordsRef = useRef<{ lat: number; lon: number } | null>(null)

  // ── Pixel shift (burn-in prevention) ──────────────────────────────
  const [shift, setShift] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const interval = setInterval(() => {
      setShift({
        x: Math.floor(Math.random() * 7) - 3, // –3 to +3 px
        y: Math.floor(Math.random() * 7) - 3,
      })
    }, SHIFT_INTERVAL)
    return () => clearInterval(interval)
  }, [])

  // ── Stale-data warning ────────────────────────────────────────────
  const [isStale, setIsStale] = useState(false)
  useEffect(() => {
    function check() {
      setIsStale(!!lastUpdated && Date.now() - lastUpdated.getTime() > STALE_THRESHOLD)
    }
    check()
    const interval = setInterval(check, 60_000)
    return () => clearInterval(interval)
  }, [lastUpdated])

  // ── Data fetching ─────────────────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem(LOCATION_KEY)
    if (saved) {
      setSavedLocation(saved)
      fetchWeather(saved)
    }
  }, [fetchWeather])

  useEffect(() => {
    if (weather?.coord) {
      coordsRef.current = weather.coord
      fetchForecast(weather.coord.lat, weather.coord.lon)
      fetchPrayer(weather.coord.lat, weather.coord.lon)
    }
  }, [weather?.coord?.lat, weather?.coord?.lon, fetchForecast, fetchPrayer])

  useEffect(() => {
    if (!savedLocation) return
    const interval = setInterval(() => {
      fetchWeather(savedLocation)
      if (coordsRef.current) {
        fetchForecast(coordsRef.current.lat, coordsRef.current.lon)
        fetchPrayer(coordsRef.current.lat, coordsRef.current.lon)
      }
    }, REFRESH_INTERVAL)
    return () => clearInterval(interval)
  }, [savedLocation, fetchWeather, fetchForecast, fetchPrayer])

  const handleSearch = useCallback(async (query: string) => {
    localStorage.setItem(LOCATION_KEY, query)
    setSavedLocation(query)
    await fetchWeather(query)
  }, [fetchWeather])

  const loading = weatherLoading && !weather // only show skeleton on first load

  return (
    // Pixel shift wrapper — slow ease so the transition is imperceptible
    <div
      className="h-full flex flex-col gap-2 overflow-hidden transition-transform duration-[3000ms] ease-in-out"
      style={{ transform: `translate(${shift.x}px, ${shift.y}px)` }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-end gap-3 shrink-0">
        <LocationSearch onSearch={handleSearch} loading={weatherLoading} initialValue={savedLocation} />
        <Link href="/school-closings" className="text-slate-600 hover:text-sky-400 text-sm whitespace-nowrap transition-colors">
          Manage →
        </Link>
      </div>

      {/* Stale data warning */}
      {isStale && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-4 py-1.5 shrink-0 flex items-center gap-2">
          <span className="text-yellow-400 text-sm">⚠</span>
          <p className="text-yellow-400 text-sm">
            No internet connection — displaying last known data
            {lastUpdated && ` (${lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`}
          </p>
        </div>
      )}

      {/* Error on first load */}
      {weatherError && !weather && !weatherLoading && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-1.5 shrink-0">
          <p className="text-red-400 text-sm">{weatherError}</p>
        </div>
      )}

      {/* No location yet */}
      {!weather && !loading && !savedLocation && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-500 text-sm">Enter a city name or ZIP code above to get started</p>
        </div>
      )}

      {/* Loading skeleton — only on first load */}
      {loading && (
        <div className="flex-1 grid grid-cols-2 gap-2 animate-pulse">
          <div className="flex flex-col gap-2">
            <div className="h-40 bg-slate-800/60 rounded-xl" />
            <div className="flex-1 bg-slate-800/40 rounded-xl" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-36 bg-slate-800/40 rounded-xl" />
            <div className="h-28 bg-slate-800/40 rounded-xl" />
            <div className="flex-1 bg-slate-800/40 rounded-xl" />
          </div>
        </div>
      )}

      {/* Dashboard */}
      {weather && !loading && (
        <div className="flex-1 grid grid-cols-2 gap-2 min-h-0 overflow-hidden">
          <div className="flex flex-col gap-2 min-h-0">
            <CurrentWeather data={weather} lastUpdated={lastUpdated} />
            <WeatherDetails data={weather} />
          </div>
          <div className="flex flex-col gap-2 min-h-0">
            {days.length > 0 && <ForecastStrip days={days} />}
            {prayerData && <PrayerTimes data={prayerData} />}
            <SchoolClosingsWidget />
          </div>
        </div>
      )}

      {!weather && !loading && savedLocation && <SchoolClosingsWidget />}
    </div>
  )
}
