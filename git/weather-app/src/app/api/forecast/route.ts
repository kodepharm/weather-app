import { NextRequest, NextResponse } from 'next/server'
import { fetchForecast } from '@/lib/openweather'

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')
  if (!q || !q.trim()) {
    return NextResponse.json({ message: 'Query parameter "q" is required' }, { status: 400 })
  }

  try {
    const data = await fetchForecast(q)
    return NextResponse.json(data)
  } catch (error) {
    const message = (error as Error).message || 'Failed to fetch forecast'
    const status = message.includes('404') || message.includes('city not found') ? 404 : 500
    return NextResponse.json({ message }, { status })
  }
}
