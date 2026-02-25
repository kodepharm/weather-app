import { ForecastDay } from '@/types/forecast'
import WeatherIcon from './WeatherIcon'
import { formatTemp, capitalizeWords } from '@/lib/formatters'

interface ForecastCardProps {
  day: ForecastDay
}

export default function ForecastCard({ day }: ForecastCardProps) {
  return (
    <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50 rounded-xl p-3 flex flex-col items-center gap-1.5 min-w-0">
      <p className="text-slate-300 text-sm font-semibold text-center leading-tight w-full truncate">{day.dateLabel}</p>
      <WeatherIcon icon={day.icon} description={day.description} size={56} />
      <p className="text-slate-400 text-sm text-center capitalize leading-tight w-full truncate">{capitalizeWords(day.description)}</p>
      <div className="flex gap-2 mt-0.5">
        <span className="text-sky-300 text-base font-medium">{formatTemp(day.high)}</span>
        <span className="text-slate-500 text-base">{formatTemp(day.low)}</span>
      </div>
    </div>
  )
}
