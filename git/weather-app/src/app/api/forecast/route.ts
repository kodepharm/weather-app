import { NextRequest, NextResponse } from 'next/server'
import { fetchForecastByCoords } from '@/lib/openmeteo'

export async function GET(request: NextRequest) {
  const lat = request.nextUrl.searchParams.get('lat')
  const lon = request.nextUrl.searchParams.get('lon')

  if (!lat || !lon) {
    return NextResponse.json({ message: 'lat and lon are required' }, { status: 400 })
  }

  try {
    const data = await fetchForecastByCoords(parseFloat(lat), parseFloat(lon))
    return NextResponse.json(data)
  } catch (error) {
    const message = (error as Error).message || 'Failed to fetch forecast'
    return NextResponse.json({ message }, { status: 500 })
  }
}
