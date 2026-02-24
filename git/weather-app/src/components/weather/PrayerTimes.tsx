'use client'

import { useEffect, useState } from 'react'
import { PrayerTimesData } from '@/types/prayer'

interface PrayerTimesProps {
  data: PrayerTimesData
}

function formatPrayerTime(time: string): string {
  const [hourStr, minStr] = time.split(':')
  let hour = parseInt(hourStr, 10)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  if (hour === 0) hour = 12
  else if (hour > 12) hour -= 12
  return `${hour}:${minStr} ${ampm}`
}

function getActivePrayer(times: { time: string }[], now: Date): { active: number; next: number } {
  const currentMins = now.getHours() * 60 + now.getMinutes()
  const prayerMins = times.map(t => {
    const [h, m] = t.time.split(':').map(Number)
    return h * 60 + m
  })

  let active = -1
  for (let i = 0; i < prayerMins.length; i++) {
    if (currentMins >= prayerMins[i]) active = i
  }
  if (active === -1) active = times.length - 1

  const next = (active + 1) % times.length
  return { active, next }
}

export default function PrayerTimes({ data }: PrayerTimesProps) {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(interval)
  }, [])

  const { active, next } = getActivePrayer(data.times, now)

  return (
    <div className="bg-slate-800/40 backdrop-blur-md rounded-xl border border-slate-700/50 p-3 shrink-0">
      <h3 className="text-slate-600 text-sm font-semibold uppercase tracking-widest mb-2">
        Prayer Times
      </h3>
      <div className="flex gap-2">
        {data.times.map((prayer, i) => {
          const isActive = i === active
          const isNext = i === next
          return (
            <div
              key={prayer.name}
              className={`flex-1 rounded-xl p-2.5 flex flex-col items-center gap-0.5 border ${
                isActive
                  ? 'bg-sky-500/20 border-sky-500/40'
                  : isNext
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : 'bg-slate-800/60 border-slate-700/50'
              }`}
            >
              <p className="text-slate-400 text-sm font-medium">{prayer.arabicName}</p>
              <p className="text-slate-300 text-xs font-semibold uppercase tracking-wide">{prayer.name}</p>
              <p className={`text-lg font-medium mt-0.5 ${
                isActive ? 'text-sky-300' : isNext ? 'text-emerald-400' : 'text-white'
              }`}>
                {formatPrayerTime(prayer.time)}
              </p>
              {isActive && <p className="text-sky-400 text-xs font-semibold">Now</p>}
              {isNext && <p className="text-emerald-400 text-xs font-semibold">Next</p>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
