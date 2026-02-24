import { ForecastDay } from '@/types/forecast'
import ForecastCard from './ForecastCard'

interface ForecastStripProps {
  days: ForecastDay[]
}

export default function ForecastStrip({ days }: ForecastStripProps) {
  if (!days.length) return null

  return (
    <div className="bg-slate-800/40 backdrop-blur-md rounded-xl border border-slate-700/50 p-3 shrink-0">
      <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-widest mb-2">
        7-Day Forecast
      </h3>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
        {days.map(day => (
          <ForecastCard key={day.date} day={day} />
        ))}
      </div>
    </div>
  )
}
