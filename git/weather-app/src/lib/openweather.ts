import { CurrentWeatherData } from '@/types/weather'
import { ForecastDay, ForecastResponse } from '@/types/forecast'

const BASE_URL = 'https://api.openweathermap.org/data/2.5'

function getApiKey(): string {
  const key = process.env.OPENWEATHER_API_KEY
  if (!key) throw new Error('OPENWEATHER_API_KEY is not set')
  return key
}

function buildQParam(q: string): string {
  const isZip = /^\d{5}$/.test(q.trim())
  return isZip ? `zip=${q.trim()},US` : `q=${encodeURIComponent(q.trim())}`
}

export async function fetchCurrentWeather(q: string): Promise<CurrentWeatherData> {
  const key = getApiKey()
  const qParam = buildQParam(q)
  const url = `${BASE_URL}/weather?${qParam}&appid=${key}&units=imperial`
  const res = await fetch(url, { next: { revalidate: 300 } })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `Weather fetch failed: ${res.status}`)
  }
  return res.json()
}

interface OWMForecastItem {
  dt: number
  main: { temp_max: number; temp_min: number }
  weather: Array<{ icon: string; description: string }>
  dt_txt: string
}

interface OWMForecastResponse {
  list: OWMForecastItem[]
  city: { name: string; country: string }
}

export async function fetchForecast(q: string): Promise<ForecastResponse> {
  const key = getApiKey()
  const qParam = buildQParam(q)
  const url = `${BASE_URL}/forecast?${qParam}&appid=${key}&units=imperial&cnt=40`
  const res = await fetch(url, { next: { revalidate: 300 } })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `Forecast fetch failed: ${res.status}`)
  }
  const data: OWMForecastResponse = await res.json()

  // Group by day and pick midday slot (12:00 - 15:00 UTC preferred)
  const byDay = new Map<string, OWMForecastItem[]>()
  for (const item of data.list) {
    const day = item.dt_txt.slice(0, 10)
    if (!byDay.has(day)) byDay.set(day, [])
    byDay.get(day)!.push(item)
  }

  const days: ForecastDay[] = []
  const now = new Date()
  const todayStr = now.toISOString().slice(0, 10)

  for (const [date, items] of Array.from(byDay.entries())) {
    if (date === todayStr) continue // skip today
    if (days.length >= 5) break

    const midday = items.find(i => i.dt_txt.includes('12:00:00') || i.dt_txt.includes('15:00:00')) || items[Math.floor(items.length / 2)]
    const high = Math.round(Math.max(...items.map(i => i.main.temp_max)))
    const low = Math.round(Math.min(...items.map(i => i.main.temp_min)))

    const dateObj = new Date(date + 'T12:00:00')
    const dateLabel = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

    days.push({
      date,
      dateLabel,
      icon: midday.weather[0].icon,
      description: midday.weather[0].description,
      high,
      low,
    })
  }

  return {
    days,
    city: { name: data.city.name, country: data.city.country },
  }
}
