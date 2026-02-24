import { SchoolClosingRow } from '@/types/schoolClosings'

export function parseCsv(text: string): SchoolClosingRow[] {
  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim().split('\n').filter(l => l.trim() !== '')
  if (lines.length < 2) return []

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/\s+/g, '_'))

  return lines.slice(1).map(line => {
    // Handle quoted fields with commas inside
    const values: string[] = []
    let current = ''
    let inQuotes = false
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    values.push(current.trim())

    const row: Record<string, string> = {}
    headers.forEach((h, i) => {
      row[h] = values[i] ?? ''
    })

    return {
      school_name: row['school_name'] || '',
      status: row['status'] || '',
      date: row['date'] || '',
      notes: row['notes'] || '',
    }
  })
}
