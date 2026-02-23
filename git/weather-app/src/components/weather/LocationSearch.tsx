'use client'

import { useState, FormEvent, useEffect, useRef } from 'react'

interface LocationSearchProps {
  onSearch: (query: string) => void
  loading?: boolean
  initialValue?: string
}

export default function LocationSearch({ onSearch, loading = false, initialValue = '' }: LocationSearchProps) {
  const [query, setQuery] = useState('')
  const initialized = useRef(false)

  // Populate input with saved location once it becomes available
  useEffect(() => {
    if (initialValue && !initialized.current) {
      setQuery(initialValue)
      initialized.current = true
    }
  }, [initialValue])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed) onSearch(trimmed)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-md mx-auto">
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Enter city name or ZIP code..."
        className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all text-sm"
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading || !query.trim()}
        className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium text-sm transition-colors"
      >
        {loading ? 'Searching...' : 'Search'}
      </button>
    </form>
  )
}
