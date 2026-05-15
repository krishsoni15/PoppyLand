interface GameQuestionProps {
  prompt: string
  target: string
  mode: 'letters' | 'numbers'
  questionIndex: number
  totalQuestions: number
}

export default function GameQuestion({ prompt, target, mode, questionIndex, totalQuestions }: GameQuestionProps) {
  const progressPct = totalQuestions > 0 ? Math.round(((questionIndex + 1) / totalQuestions) * 100) : 0

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Progress bar at top */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="font-nunito text-xs font-bold text-gray-500">
            Question {questionIndex + 1} of {totalQuestions}
          </span>
          <span className="font-nunito text-xs font-bold text-brand-purple">
            {progressPct}%
          </span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-white/60 shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-purple to-brand-pink transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <div className="card-glass rounded-3xl px-6 py-8 text-center">
        <p className="font-nunito text-sm font-bold uppercase tracking-widest text-brand-purple">
          Your mission
        </p>
        <p className="mt-2 font-fredoka text-2xl text-gray-700 sm:text-3xl">{prompt}</p>
        <div className="mt-6 inline-flex items-center justify-center gap-3 rounded-3xl bg-gradient-to-br from-brand-red/15 to-brand-purple/15 px-8 py-4">
          <p
            className="font-fredoka text-[96px] leading-none shimmer-target"
            aria-label={mode === 'letters' ? `Letter ${target}` : `Number ${target}`}
          >
            {target}
          </p>
        </div>
      </div>
    </div>
  )
}
