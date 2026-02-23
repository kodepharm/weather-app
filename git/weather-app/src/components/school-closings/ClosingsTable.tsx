import { SchoolClosingRow } from '@/types/schoolClosings'

interface ClosingsTableProps {
  rows: SchoolClosingRow[]
  onDeleteRow?: (index: number) => void
}

function getStatusBadge(status: string): string {
  const normalized = status.toLowerCase()
  if (normalized.includes('closed')) return 'bg-red-500/20 text-red-400 border border-red-500/30'
  if (normalized.includes('delay') || normalized.includes('late')) return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
  if (normalized.includes('open') || normalized.includes('normal')) return 'bg-green-500/20 text-green-400 border border-green-500/30'
  return 'bg-slate-700/40 text-slate-300 border border-slate-600'
}

export default function ClosingsTable({ rows, onDeleteRow }: ClosingsTableProps) {
  if (!rows.length) return null

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-700/50">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-800/80 text-slate-400 text-xs uppercase tracking-wider">
            <th className="px-4 py-3 text-left">School</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Date</th>
            <th className="px-4 py-3 text-left">Notes</th>
            {onDeleteRow && <th className="px-4 py-3 text-left w-20" />}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className={`border-t border-slate-700/30 ${i % 2 === 0 ? 'bg-slate-800/20' : 'bg-slate-800/40'} hover:bg-slate-700/30 transition-colors`}
            >
              <td className="px-4 py-3 text-white font-medium">{row.school_name}</td>
              <td className="px-4 py-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(row.status)}`}>
                  {row.status}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-300">{row.date}</td>
              <td className="px-4 py-3 text-slate-400">{row.notes}</td>
              {onDeleteRow && (
                <td className="px-4 py-3">
                  <button
                    onClick={() => onDeleteRow(i)}
                    className="text-red-400 hover:text-red-300 text-xs px-2 py-1 rounded-lg hover:bg-red-500/10 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
