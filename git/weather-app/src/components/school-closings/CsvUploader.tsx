'use client'

import { useState, useRef, DragEvent, ChangeEvent } from 'react'
import { SchoolClosingRow } from '@/types/schoolClosings'
import { parseCsv } from '@/lib/parsecsv'

interface CsvUploaderProps {
  onData: (rows: SchoolClosingRow[]) => void
  hasExistingData?: boolean
}

export default function CsvUploader({ onData, hasExistingData = false }: CsvUploaderProps) {
  const [dragging, setDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFile(file: File) {
    if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
      setError('Please upload a .csv file')
      return
    }
    setError(null)
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = e => {
      const text = e.target?.result as string
      const rows = parseCsv(text)
      onData(rows)
    }
    reader.onerror = () => setError('Failed to read file')
    reader.readAsText(file)
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`
        border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all
        ${dragging
          ? 'border-sky-400 bg-sky-400/10'
          : 'border-slate-600 hover:border-sky-500 bg-slate-800/40 hover:bg-slate-800/60'
        }
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleChange}
      />
      <div className="text-4xl mb-3">📂</div>
      {fileName ? (
        <p className="text-sky-400 font-medium">{fileName}</p>
      ) : (
        <>
          <p className="text-slate-300 font-medium">Drop your CSV file here</p>
          <p className="text-slate-500 text-sm mt-1">or click to browse</p>
          {hasExistingData && (
            <p className="text-yellow-500/80 text-xs mt-2">Uploading a new file will replace the current data</p>
          )}
        </>
      )}
      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      <p className="text-slate-600 text-xs mt-4">
        Expected columns: school_name, status, date, notes
      </p>
    </div>
  )
}
