import Image from 'next/image'

interface WeatherIconProps {
  icon: string
  description: string
  size?: number
}

export default function WeatherIcon({ icon, description, size = 64 }: WeatherIconProps) {
  return (
    <Image
      src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
      alt={description}
      width={size}
      height={size}
      priority
    />
  )
}
