interface ProgressBarProps {
  current: number
  total: number
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percent = total > 0 ? Math.round(((current + 1) / total) * 100) : 0

  return (
    <div
      className="w-full max-w-md"
      role="progressbar"
      aria-valuenow={current + 1}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-label={`Auto play progress: ${current + 1} of ${total}`}
    >
      <div className="h-3 overflow-hidden rounded-full bg-white/60 shadow-inner">
        <div
          className="h-full rounded-full bg-gradient-to-r from-orange-400 to-pink-400 transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
