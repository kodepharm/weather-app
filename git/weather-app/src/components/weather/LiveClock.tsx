'use client'

import { useClock } from '@/hooks/useClock'

export default function LiveClock() {
  const { dateString, timeString } = useClock()

  if (!dateString) return null

  return (
    <div className="shrink-0">
      <p className="text-white text-6xl font-thin tracking-widest leading-none">{timeString}</p>
      <p className="text-sky-300 text-base font-medium mt-1">{dateString}</p>
    </div>
  )
}
