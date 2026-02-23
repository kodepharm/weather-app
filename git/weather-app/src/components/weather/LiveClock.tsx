'use client'

import { useClock } from '@/hooks/useClock'

export default function LiveClock() {
  const { dateString, timeString } = useClock()

  if (!dateString) return null

  return (
    <div className="shrink-0">
      <p className="text-white text-3xl font-thin tracking-widest leading-none">{timeString}</p>
      <p className="text-sky-300 text-xs font-medium mt-0.5">{dateString}</p>
    </div>
  )
}
