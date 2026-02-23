'use client'

import { useState, useCallback } from 'react'
import { CurrentWeatherData } from '@/types/weather'

interface WeatherState {
  data: CurrentWeatherData | null
  loading: boolean
  error: string | null
}

interface UseWeatherReturn extends WeatherState {
  fetchWeather: (q: string) => Promise<void>
}

export function useWeather(): UseWeatherReturn {
  const [state, setState] = useState<WeatherState>({
    data: null,
    loading: false,
    error: null,
  })

  const fetchWeather = useCallback(async (q: string) => {
    setState({ data: null, loading: true, error: null })
    try {
      const res = await fetch(`/api/weather?q=${encodeURIComponent(q)}`)
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Unknown error' }))
        throw new Error(err.message || `Request failed: ${res.status}`)
      }
      const data: CurrentWeatherData = await res.json()
      setState({ data, loading: false, error: null })
    } catch (e) {
      setState({ data: null, loading: false, error: (e as Error).message })
    }
  }, [])

  return { ...state, fetchWeather }
}
