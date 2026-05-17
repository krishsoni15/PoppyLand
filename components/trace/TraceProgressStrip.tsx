'use client'

interface TraceProgressStripProps {
  current: number
  total: number
  label?: string
}

export default function TraceProgressStrip({
  current,
  total,
  label,
}: TraceProgressStripProps) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0

  return (
    <div className="w-full px-2">
      {label && (
        <p className="mb-2 text-center font-fredoka text-lg text-gray-600 sm:text-xl">
          {label}
        </p>
      )}
      <div
        className="h-4 w-full overflow-hidden rounded-full bg-white/70 shadow-inner"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Tracing progress"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-green to-brand-teal transition-all duration-300"
          style={{ width: `${Math.min(100, pct)}%` }}
        />
      </div>
    </div>
  )
}
