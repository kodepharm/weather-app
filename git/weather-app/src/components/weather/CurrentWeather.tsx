import { CurrentWeatherData } from '@/types/weather'
import WeatherIcon from './WeatherIcon'
import { formatTemp, capitalizeWords } from '@/lib/formatters'

interface CurrentWeatherProps {
  data: CurrentWeatherData
}

export default function CurrentWeather({ data }: CurrentWeatherProps) {
  const { name, sys, main, weather } = data
  const condition = weather[0]

  return (
    <div className="bg-slate-800/60 backdrop-blur-md rounded-xl border border-slate-700/50 p-5 text-center shrink-0">
      <p className="text-slate-300 text-base font-medium uppercase tracking-widest mb-1">
        {name}, {sys.country}
      </p>
      <div className="flex items-center justify-center gap-3 mt-1">
        <WeatherIcon icon={condition.icon} description={condition.description} size={80} />
        <span className="text-sky-200 text-8xl font-thin">{formatTemp(main.temp)}</span>
      </div>
      <p className="text-slate-300 text-2xl mt-2 capitalize">{capitalizeWords(condition.description)}</p>
      <p className="text-slate-400 text-base mt-1">
        Feels like {formatTemp(main.feels_like)} &middot; H:{formatTemp(main.temp_max)} L:{formatTemp(main.temp_min)}
      </p>
    </div>
  )
}
