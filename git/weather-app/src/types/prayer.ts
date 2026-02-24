export interface PrayerTime {
  name: string
  arabicName: string
  time: string // "HH:MM" 24-hour
}

export interface PrayerTimesData {
  times: PrayerTime[]
}
