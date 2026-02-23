'use client'

import { useState, useCallback } from 'react'
import { ForecastDay } from '@/types/forecast'

interface ForecastState {
  days: ForecastDay[]
  cityName: string
  loading: boolean
  error: string | null
}

interface UseForecastReturn extends ForecastState {
  fetchForecast: (q: string) => Promise<void>
}

export function useForecast(): UseForecastReturn {
  const [state, setState] = useState<ForecastState>({
    days: [],
    cityName: '',
    loading: false,
    error: null,
  })

  const fetchForecast = useCallback(async (q: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    try {
      const res = await fetch(`/api/forecast?q=${encodeURIComponent(q)}`)
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Unknown error' }))
        throw new Error(err.message || `Request failed: ${res.status}`)
      }
      const data = await res.json()
      setState({ days: data.days, cityName: data.city?.name || '', loading: false, error: null })
    } catch (e) {
      setState(prev => ({ ...prev, days: [], loading: false, error: (e as Error).message }))
    }
  }, [])

  return { ...state, fetchForecast }
}
