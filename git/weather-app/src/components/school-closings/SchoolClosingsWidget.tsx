'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { SchoolClosingRow } from '@/types/schoolClosings'

const CLOSINGS_KEY = 'school_closings_data'
const MAX_EVENTS = 5

function getTodayStr(): string {
  const t = new Date()
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`
}

function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null

  // YYYY-MM-DD
  const iso = dateStr.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/)
  if (iso) {
    const d = new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]))
    return isNaN(d.getTime()) ? null : d
  }

  // MM/DD/YYYY or M/D/YYYY
  const us = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/)
  if (us) {
    const d = new Date(Number(us[3]), Number(us[1]) - 1, Number(us[2]))
    return isNaN(d.getTime()) ? null : d
  }

  return null
}

function formatDate(dateStr: string): { day: string; date: string } {
  const d = parseDate(dateStr)
  if (!d) return { day: '', date: dateStr }
  return {
    day:  d.toLocaleDateString('en-US', { weekday: 'short' }),
    date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
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
    const interval = setInterval(loadEvents, 60_000)
    return () => clearInterval(interval)
  }, [])

  if (events.length === 0) return null

  const todayStr = getTodayStr()

  return (
    <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden flex-1 min-h-0">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏫</span>
          <h2 className="text-slate-400 font-semibold text-lg">School Closings &amp; Events</h2>
        </div>
        <Link href="/school-closings" className="text-sm text-sky-400 hover:text-sky-300 transition-colors">
          Manage →
        </Link>
      </div>

      <div className="divide-y divide-slate-700/30">
        {events.map((event, i) => {
          const isToday = event.date === todayStr
          const { day, date } = formatDate(event.date)
          return (
            <div key={i} className="flex items-center gap-4 px-4 py-3">
              <div className={`shrink-0 w-20 text-center ${isToday ? 'text-sky-400' : 'text-slate-400'}`}>
                <p className="text-sm font-semibold uppercase">{isToday ? 'Today' : day}</p>
                <p className="text-sm">{date}</p>
              </div>
              <div className="w-px h-8 bg-slate-700/60 shrink-0" />
              <p className="text-white text-lg font-medium truncate">{event.notes || event.school_name}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
