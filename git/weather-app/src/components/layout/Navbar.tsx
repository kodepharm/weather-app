'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-sky-400 font-bold text-xl hover:text-sky-300 transition-colors">
          <span>WeatherWatch</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors ${
              pathname === '/' ? 'text-sky-400' : 'text-slate-300 hover:text-sky-400'
            }`}
          >
            Weather
          </Link>
          <Link
            href="/school-closings"
            className={`text-sm font-medium transition-colors ${
              pathname === '/school-closings' ? 'text-sky-400' : 'text-slate-300 hover:text-sky-400'
            }`}
          >
            School Closings
          </Link>
        </div>
      </div>
    </nav>
  )
}
