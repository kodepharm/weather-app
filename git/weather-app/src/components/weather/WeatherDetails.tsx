import { CurrentWeatherData } from '@/types/weather'
import { formatWind, formatTime, formatVisibility } from '@/lib/formatters'

interface WeatherDetailsProps {
  data: CurrentWeatherData
}

interface DetailItem {
  label: string
  value: string
  icon: string
}

export default function WeatherDetails({ data }: WeatherDetailsProps) {
  const { main, wind, visibility, sys, timezone } = data

  const details: DetailItem[] = [
    { label: 'Humidity', value: `${main.humidity}%`, icon: '💧' },
    { label: 'Wind', value: formatWind(wind.speed, wind.deg), icon: '💨' },
    { label: 'Pressure', value: `${main.pressure} hPa`, icon: '🌡' },
    { label: 'Visibility', value: formatVisibility(visibility), icon: '👁' },
    { label: 'Sunrise', value: formatTime(sys.sunrise, timezone), icon: '🌅' },
    { label: 'Sunset', value: formatTime(sys.sunset, timezone), icon: '🌇' },
  ]

  return (
    <div className="bg-slate-800/60 backdrop-blur-md rounded-xl border border-slate-700/50 p-3 flex-1 min-h-0">
      <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-2">Details</h3>
      <div className="grid grid-cols-3 gap-2">
        {details.map(({ label, value, icon }) => (
          <div key={label} className="bg-slate-700/40 rounded-lg p-2">
            <p className="text-slate-400 text-xs mb-0.5">{icon} {label}</p>
            <p className="text-white text-sm font-medium">{value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
