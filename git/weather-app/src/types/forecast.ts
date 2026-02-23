export interface ForecastDay {
  date: string
  dateLabel: string
  icon: string
  description: string
  high: number
  low: number
}

export interface ForecastResponse {
  days: ForecastDay[]
  city: {
    name: string
    country: string
  }
}
