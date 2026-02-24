'use client'

import { useState, useCallback } from 'react'
import { PrayerTimesData } from '@/types/prayer'

interface PrayerState {
  data: PrayerTimesData | null
  loading: boolean
  error: string | null
}

interface UsePrayerReturn extends PrayerState {
  fetchPrayer: (lat: number, lon: number) => Promise<void>
}

export function usePrayer(): UsePrayerReturn {
  const [state, setState] = useState<PrayerState>({
    data: null,
    loading: false,
    error: null,
  })

  const fetchPrayer = useCallback(async (lat: number, lon: number) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    try {
      const res = await fetch(`/api/prayer?lat=${lat}&lon=${lon}`)
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Unknown error' }))
        throw new Error(err.message || `Request failed: ${res.status}`)
      }
      const data: PrayerTimesData = await res.json()
      setState({ data, loading: false, error: null })
    } catch (e) {
      setState(prev => ({ ...prev, loading: false, error: (e as Error).message }))
    }
  }, [])

  return { ...state, fetchPrayer }
}
