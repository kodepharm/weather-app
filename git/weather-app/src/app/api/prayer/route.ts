import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const lat = request.nextUrl.searchParams.get('lat')
  const lon = request.nextUrl.searchParams.get('lon')

  if (!lat || !lon) {
    return NextResponse.json({ message: 'lat and lon are required' }, { status: 400 })
  }

  try {
    const today = new Date()
    const dateStr = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`
    const url = `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${lat}&longitude=${lon}&method=2`

    const res = await fetch(url, { next: { revalidate: 3600 } })
    if (!res.ok) throw new Error(`Prayer times fetch failed: ${res.status}`)

    const data = await res.json()
    const { Fajr, Dhuhr, Asr, Maghrib, Isha } = data.data.timings

    return NextResponse.json({
      times: [
        { name: 'Fajr',    arabicName: 'فجر',  time: Fajr },
        { name: 'Dhuhr',   arabicName: 'ظهر',  time: Dhuhr },
        { name: 'Asr',     arabicName: 'عصر',  time: Asr },
        { name: 'Maghrib', arabicName: 'مغرب', time: Maghrib },
        { name: 'Isha',    arabicName: 'عشاء', time: Isha },
      ],
    })
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 })
  }
}
