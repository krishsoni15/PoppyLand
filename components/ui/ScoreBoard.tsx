interface ScoreBoardProps {
  score: number
  total?: number
  label?: string
}

export default function ScoreBoard({
  score,
  total,
  label = 'Stars',
}: ScoreBoardProps) {
  return (
    <div
      className="card-glass inline-flex items-center gap-3 rounded-full px-6 py-3 font-fredoka text-2xl text-gray-800 sm:text-3xl"
      aria-live="polite"
    >
      <span className="text-3xl animate-float" aria-hidden="true">
        ⭐
      </span>
      <span>
        {label}: {score}
        {total !== undefined ? ` / ${total}` : ''}
      </span>
    </div>
  )
}
