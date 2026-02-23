export function formatTemp(f: number): string {
  return `${Math.round(f)}°F`
}

export function formatWind(speedMph: number, deg?: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  const dir = deg !== undefined ? directions[Math.round(deg / 22.5) % 16] : ''
  return `${Math.round(speedMph)} mph${dir ? ' ' + dir : ''}`
}

export function formatTime(unixSeconds: number, timezoneOffsetSeconds: number): string {
  const utcMs = unixSeconds * 1000
  const localMs = utcMs + timezoneOffsetSeconds * 1000
  const d = new Date(localMs)
  const h = d.getUTCHours()
  const m = d.getUTCMinutes().toString().padStart(2, '0')
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  return `${h12}:${m} ${ampm}`
}

export function formatVisibility(meters: number): string {
  const miles = meters / 1609.34
  return `${miles.toFixed(1)} mi`
}

export function capitalizeWords(str: string): string {
  return str.replace(/\b\w/g, c => c.toUpperCase())
}
