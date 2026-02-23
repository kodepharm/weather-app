import { ForecastDay } from '@/types/forecast'
import WeatherIcon from './WeatherIcon'
import { formatTemp, capitalizeWords } from '@/lib/formatters'

interface ForecastCardProps {
  day: ForecastDay
}

export default function ForecastCard({ day }: ForecastCardProps) {
  return (
    <div className="flex-shrink-0 bg-slate-800/60 backdrop-blur-md border border-slate-700/50 rounded-xl p-2.5 flex flex-col items-center gap-0.5 w-20">
      <p className="text-slate-300 text-xs font-semibold text-center leading-tight">{day.dateLabel}</p>
      <WeatherIcon icon={day.icon} description={day.description} size={36} />
      <p className="text-slate-400 text-xs text-center capitalize leading-tight">{capitalizeWords(day.description)}</p>
      <div className="flex gap-1.5 mt-0.5">
        <span className="text-sky-300 text-xs font-medium">{formatTemp(day.high)}</span>
        <span className="text-slate-500 text-xs">{formatTemp(day.low)}</span>
      </div>
    </div>
  )
}
