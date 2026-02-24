import { ForecastDay, ForecastResponse } from '@/types/forecast'

// WMO weather code → human description
const WMO_DESCRIPTIONS: Record<number, string> = {
  0:  'Clear Sky',
  1:  'Mainly Clear',
  2:  'Partly Cloudy',
  3:  'Overcast',
  45: 'Foggy',
  48: 'Icy Fog',
  51: 'Light Drizzle',
  53: 'Drizzle',
  55: 'Heavy Drizzle',
  61: 'Light Rain',
  63: 'Rain',
  65: 'Heavy Rain',
  66: 'Light Freezing Rain',
  67: 'Freezing Rain',
  71: 'Light Snow',
  73: 'Snow',
  75: 'Heavy Snow',
  77: 'Snow Grains',
  80: 'Light Showers',
  81: 'Showers',
  82: 'Heavy Showers',
  85: 'Snow Showers',
  86: 'Heavy Snow Showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with Hail',
  99: 'Heavy Thunderstorm with Hail',
}

// WMO weather code → OpenWeatherMap icon code (reuses existing WeatherIcon component)
function wmoToIcon(code: number): string {
  if (code === 0 || code === 1)              return '01d'
  if (code === 2)                            return '02d'
  if (code === 3)                            return '04d'
  if (code === 45 || code === 48)            return '50d'
  if (code >= 51 && code <= 55)              return '09d'
  if (code >= 61 && code <= 65)              return '10d'
  if (code === 66 || code === 67)            return '13d'
  if (code >= 71 && code <= 77)              return '13d'
  if (code >= 80 && code <= 82)              return '09d'
  if (code === 85 || code === 86)            return '13d'
  if (code >= 95)                            return '11d'
  return '01d'
}

interface OpenMeteoResponse {
  daily: {
    time: string[]
    weathercode: number[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
  }
}

export async function fetchForecastByCoords(lat: number, lon: number): Promise<ForecastResponse> {
  // fetch_days=8 so we always have 7 future days after skipping today
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,temperature_2m_min&forecast_days=8&temperature_unit=fahrenheit&timezone=auto`
  const res = await fetch(url, { next: { revalidate: 3600 } })
  if (!res.ok) throw new Error(`Forecast fetch failed: ${res.status}`)

  const data: OpenMeteoResponse = await res.json()
  const todayStr = new Date().toISOString().slice(0, 10)
  const days: ForecastDay[] = []

  for (let i = 0; i < data.daily.time.length; i++) {
    const date = data.daily.time[i]
    if (date === todayStr) continue
    if (days.length >= 7) break

    const code = data.daily.weathercode[i]
    const dateLabel = new Date(date + 'T12:00:00').toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })

    days.push({
      date,
      dateLabel,
      icon: wmoToIcon(code),
      description: WMO_DESCRIPTIONS[code] ?? 'Unknown',
      high: Math.round(data.daily.temperature_2m_max[i]),
      low: Math.round(data.daily.temperature_2m_min[i]),
    })
  }

  return { days, city: { name: '', country: '' } }
}
