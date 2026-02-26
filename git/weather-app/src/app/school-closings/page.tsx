'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import CsvUploader from '@/components/school-closings/CsvUploader'
import ClosingsTable from '@/components/school-closings/ClosingsTable'
import LocationSearch from '@/components/weather/LocationSearch'
import { SchoolClosingRow } from '@/types/schoolClosings'

const CLOSINGS_KEY = 'school_closings_data'
const LOCATION_KEY = 'weather_location'

export default function SchoolClosingsPage() {
  const [rows, setRows] = useState<SchoolClosingRow[]>([])
  const [savedLocation, setSavedLocation] = useState('')
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [pushStatus, setPushStatus] = useState<'idle' | 'pushing' | 'success' | 'error'>('idle')
  const [pushMessage, setPushMessage] = useState('')

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CLOSINGS_KEY)
      if (saved) setRows(JSON.parse(saved))
      const loc = localStorage.getItem(LOCATION_KEY)
      if (loc) setSavedLocation(loc)
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    localStorage.setItem(CLOSINGS_KEY, JSON.stringify(rows))
  }, [rows])

  function handleNewData(incoming: SchoolClosingRow[]) {
    setRows(incoming)
    setPushStatus('idle')
  }

  function handleFile(file: File) {
    setCsvFile(file)
    setPushStatus('idle')
  }

  function handleLocationSearch(query: string) {
    localStorage.setItem(LOCATION_KEY, query)
    setSavedLocation(query)
  }

  function handleDeleteRow(index: number) {
    setRows(prev => prev.filter((_, i) => i !== index))
  }

  function handleClearAll() {
    setRows([])
  }

  async function handlePushToGit() {
    if (!csvFile) return
    setPushStatus('pushing')
    setPushMessage('')
    try {
      const form = new FormData()
      form.append('file', csvFile)
      const res = await fetch('/api/upload-csv', { method: 'POST', body: form })
      const json = await res.json()
      if (!res.ok) {
        setPushStatus('error')
        setPushMessage(json.error ?? 'Upload failed')
      } else if (json.pushed) {
        setPushStatus('success')
        setPushMessage('Saved and pushed to repository')
      } else {
        setPushStatus('error')
        setPushMessage('File saved locally but git push failed — check GIT_PUSH_TOKEN in .env.local')
      }
    } catch (e) {
      setPushStatus('error')
      setPushMessage(String(e))
    }
  }

  return (
    <div className="h-full overflow-y-auto">
    <div className="flex flex-col gap-8 max-w-4xl mx-auto py-6">

      {/* Header */}
      <div>
        <Link href="/" className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 text-sm mb-4 transition-colors">
          ← Back to Weather
        </Link>
        <h1 className="text-white text-3xl font-bold">Manage</h1>
      </div>

      {/* Location Search */}
      <div>
        <h2 className="text-slate-300 text-lg font-semibold mb-3">Weather Location</h2>
        <p className="text-slate-500 text-sm mb-3">
          {savedLocation
            ? <>Currently set to <span className="text-sky-400 font-medium">{savedLocation}</span>. Search to change it.</>
            : 'Enter a city name or ZIP code to set the weather location.'}
        </p>
        <LocationSearch onSearch={handleLocationSearch} initialValue={savedLocation} />
        {savedLocation && (
          <p className="text-emerald-400 text-sm mt-2">Location saved — return to home to see updated weather.</p>
        )}
      </div>

      {/* CSV Upload */}
      <div>
        <h2 className="text-slate-300 text-lg font-semibold mb-1">School Closings &amp; Events</h2>
        <p className="text-slate-500 text-sm mb-3">
          Upload a CSV file to display school closing and delay information. Data is saved automatically.
        </p>
        <CsvUploader onData={handleNewData} onFile={handleFile} hasExistingData={rows.length > 0} />

        {/* Push to Git */}
        {csvFile && (
          <div className="mt-4 flex items-center gap-4">
            <button
              onClick={handlePushToGit}
              disabled={pushStatus === 'pushing'}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium text-sm transition-colors"
            >
              {pushStatus === 'pushing' ? 'Pushing...' : 'Save & Push to Git'}
            </button>
            {pushStatus === 'success' && (
              <p className="text-emerald-400 text-sm">✓ {pushMessage}</p>
            )}
            {pushStatus === 'error' && (
              <p className="text-red-400 text-sm">✗ {pushMessage}</p>
            )}
          </div>
        )}
      </div>

      {/* Table */}
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
        </div>
      )}
    </div>
    </div>
  )
}
