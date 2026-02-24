'use client'

import { useState, useCallback } from 'react'
import { CurrentWeatherData } from '@/types/weather'

interface WeatherState {
  data: CurrentWeatherData | null
  loading: boolean
  error: string | null
  lastUpdated: Date | null
}

interface UseWeatherReturn extends WeatherState {
  fetchWeather: (q: string) => Promise<void>
}

export function useWeather(): UseWeatherReturn {
  const [state, setState] = useState<WeatherState>({
    data: null,
    loading: false,
    error: null,
    lastUpdated: null,
  })

  const fetchWeather = useCallback(async (q: string) => {
    // Keep existing data visible during background refreshes — no flicker
    setState(prev => ({ ...prev, loading: true, error: null }))
    try {
      const res = await fetch(`/api/weather?q=${encodeURIComponent(q)}`)
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Unknown error' }))
        throw new Error(err.message || `Request failed: ${res.status}`)
      }
      const data: CurrentWeatherData = await res.json()
      setState({ data, loading: false, error: null, lastUpdated: new Date() })
    } catch (e) {
      // On failure keep whatever data was already on screen
      setState(prev => ({ ...prev, loading: false, error: (e as Error).message }))
    }
  }, [])

  return { ...state, fetchWeather }
}
