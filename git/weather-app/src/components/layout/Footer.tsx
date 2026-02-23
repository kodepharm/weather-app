export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-700/50 bg-slate-900/60">
      <div className="max-w-6xl mx-auto px-4 py-4 text-center text-slate-500 text-xs">
        Weather data provided by{' '}
        <span className="text-sky-500">OpenWeatherMap</span> &mdash; for informational purposes only.
      </div>
    </footer>
  )
}
