'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import CsvUploader from '@/components/school-closings/CsvUploader'
import ClosingsTable from '@/components/school-closings/ClosingsTable'
import { SchoolClosingRow } from '@/types/schoolClosings'

const CLOSINGS_KEY = 'school_closings_data'

export default function SchoolClosingsPage() {
  const [rows, setRows] = useState<SchoolClosingRow[]>([])

  // Restore saved data on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CLOSINGS_KEY)
      if (saved) setRows(JSON.parse(saved))
    } catch {
      // ignore malformed data
    }
  }, [])

  // Persist whenever rows change
  useEffect(() => {
    localStorage.setItem(CLOSINGS_KEY, JSON.stringify(rows))
  }, [rows])

  function handleNewData(incoming: SchoolClosingRow[]) {
    setRows(incoming)
  }

  function handleDeleteRow(index: number) {
    setRows(prev => prev.filter((_, i) => i !== index))
  }

  function handleClearAll() {
    setRows([])
  }

  return (
    <div className="h-full overflow-y-auto">
    <div className="flex flex-col gap-8 max-w-4xl mx-auto py-6">
      <div>
        <Link href="/" className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 text-sm mb-4 transition-colors">
          ← Back to Weather
        </Link>
        <h1 className="text-white text-3xl font-bold">School Closings</h1>
        <p className="text-slate-400 mt-1 text-sm">
          Upload a CSV file to display school closing and delay information. Data is saved automatically.
        </p>
      </div>

      <CsvUploader onData={handleNewData} hasExistingData={rows.length > 0} />

      {rows.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-slate-400 text-sm">
              Showing <span className="text-sky-400 font-medium">{rows.length}</span> records
            </p>
            <button
              onClick={handleClearAll}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors"
            >
              Clear All
            </button>
          </div>
          <ClosingsTable rows={rows} onDeleteRow={handleDeleteRow} />
        </div>
      )}

      {rows.length === 0 && (
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-8">
          <h3 className="text-slate-300 font-medium mb-3">Expected CSV format</h3>
          <pre className="text-xs text-slate-400 bg-slate-900/60 rounded-xl p-4 overflow-x-auto leading-relaxed">
{`school_name,status,date,notes
Lincoln Elementary,closed,2026-02-22,Heavy snow
Washington High,2-hour delay,2026-02-22,Ice on roads
Jefferson Middle,open,2026-02-22,Normal schedule`}
          </pre>
          <div className="mt-4 flex gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
              <span className="text-slate-400">open / normal</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />
              <span className="text-slate-400">delay / late start</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
              <span className="text-slate-400">closed</span>
            </span>
          </div>
        </div>
      )}
    </div>
    </div>
  )
}
