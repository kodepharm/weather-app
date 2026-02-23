'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { SchoolClosingRow } from '@/types/schoolClosings'

const CLOSINGS_KEY = 'school_closings_data'
const MAX_EVENTS = 5

function getStatusBadge(status: string): string {
  const normalized = status.toLowerCase()
  if (normalized.includes('closed')) return 'bg-red-500/20 text-red-400 border border-red-500/30'
  if (normalized.includes('delay') || normalized.includes('late')) return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
  if (normalized.includes('open') || normalized.includes('normal')) return 'bg-green-500/20 text-green-400 border border-green-500/30'
  return 'bg-slate-700/40 text-slate-300 border border-slate-600'
}

function getTodayStr(): string {
  const t = new Date()
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`
}

function formatDate(dateStr: string): string {
  try {
    const [year, month, day] = dateStr.split('-').map(Number)
    return new Date(year, month - 1, day).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return dateStr
  }
}

export default function SchoolClosingsWidget() {
  const [events, setEvents] = useState<SchoolClosingRow[]>([])

  useEffect(() => {
    function loadEvents() {
      try {
        const saved = localStorage.getItem(CLOSINGS_KEY)
        if (!saved) { setEvents([]); return }
        const all: SchoolClosingRow[] = JSON.parse(saved)
        const todayStr = getTodayStr()
        const upcoming = all
          .filter(row => row.date >= todayStr)
          .sort((a, b) => a.date.localeCompare(b.date))
          .slice(0, MAX_EVENTS)
        setEvents(upcoming)
      } catch {
        setEvents([])
      }
    }

    loadEvents()
    // Re-check every minute so past events roll off as the day changes
    const interval = setInterval(loadEvents, 60_000)
    return () => clearInterval(interval)
  }, [])

  if (events.length === 0) return null

  const todayStr = getTodayStr()

  return (
    <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden flex-1 min-h-0">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <span className="text-lg">🏫</span>
          <h2 className="text-white font-semibold text-sm">School Closings &amp; Events</h2>
        </div>
        <Link
          href="/school-closings"
          className="text-xs text-sky-400 hover:text-sky-300 transition-colors"
        >
          Manage →
        </Link>
      </div>

      <div className="divide-y divide-slate-700/30">
        {events.map((event, i) => {
          const isToday = event.date === todayStr
          return (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-1.5 hover:bg-slate-700/20 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{event.school_name}</p>
                {event.notes && (
                  <p className="text-slate-400 text-xs truncate mt-0.5">{event.notes}</p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusBadge(event.status)}`}>
                  {event.status}
                </span>
                <span className={`text-xs whitespace-nowrap ${isToday ? 'text-sky-400 font-medium' : 'text-slate-400'}`}>
                  {isToday ? 'Today' : formatDate(event.date)}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
