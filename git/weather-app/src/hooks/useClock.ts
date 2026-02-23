'use client'

import { useState, useEffect } from 'react'

interface ClockState {
  dateString: string
  timeString: string
}

export function useClock(): ClockState {
  const [clock, setClock] = useState<ClockState>({ dateString: '', timeString: '' })

  useEffect(() => {
    function tick() {
      const now = new Date()
      const dateString = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
      const timeString = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      })
      setClock({ dateString, timeString })
    }

    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return clock
}
