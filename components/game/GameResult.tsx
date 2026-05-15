'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { fireConfetti } from '@/lib/confetti'

interface GameResultProps {
  score: number
  total: number
  onPlayAgain: () => void
  answers?: { correct: boolean }[]
}

export default function GameResult({ score, total, onPlayAgain, answers }: GameResultProps) {
  const pct = Math.round((score / total) * 100)
  const confettiFired = useRef(false)

  useEffect(() => {
    if (pct >= 80 && !confettiFired.current) {
      confettiFired.current = true
      void fireConfetti()
      const t1 = setTimeout(() => void fireConfetti(), 1000)
      const t2 = setTimeout(() => void fireConfetti(), 2000)
      return () => { clearTimeout(t1); clearTimeout(t2) }
    }
  }, [pct])

  return (
    <div className="flex flex-col items-center justify-center gap-6 px-6 py-12 text-center">
      {/* Trophy or Emoji */}
      <div className="emoji-bounce text-8xl sm:text-9xl" aria-hidden="true">
        {pct >= 80 ? '🏆' : pct >= 50 ? '🌟' : '💪'}
      </div>

      <div>
        <h2 className="font-fredoka text-4xl text-shimmer sm:text-5xl">
          {pct >= 80 ? "You're a Superstar!" : pct >= 50 ? 'Great Work!' : 'Keep Practicing!'}
        </h2>
        <p className="mt-2 font-nunito text-xl text-gray-600">
          {pct >= 80 ? 'Amazing job!' : pct >= 50 ? 'Nice effort!' : 'You can do it!'}
        </p>
      </div>

      {/* Star Row Display */}
      <div className="card-glass rounded-3xl px-8 py-5">
        <div className="flex items-center justify-center gap-1">
          {Array.from({ length: total }).map((_, i) => (
            <span
              key={i}
              className={`text-3xl ${i < score ? 'star-pop' : 'opacity-30'}`}
              style={i < score ? { animationDelay: `${i * 0.1}s` } : undefined}
            >
              {i < score ? '⭐' : '☆'}
            </span>
          ))}
        </div>
        <p className="mt-2 font-fredoka text-3xl text-brand-purple">
          {score} / {total}
        </p>
      </div>

      {/* Answer Review */}
      {answers && answers.length > 0 && (
        <div className="card-glass rounded-2xl p-4 w-full max-w-sm">
          <p className="font-nunito text-sm font-bold text-gray-500 mb-2">Your answers:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {answers.map((a, i) => (
              <span
                key={i}
                className={`inline-flex items-center justify-center h-8 w-8 rounded-full text-sm font-bold ${
                  a.correct
                    ? 'bg-green-100 text-green-600'
                    : 'bg-red-100 text-red-500'
                }`}
              >
                {a.correct ? '✅' : '❌'}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col gap-4 sm:flex-row w-full max-w-md">
        <button
          type="button"
          onClick={onPlayAgain}
          className="btn-3d min-h-[5rem] flex-1 rounded-3xl bg-gradient-to-r from-brand-green to-brand-teal px-8 font-fredoka text-2xl text-white hover:scale-105"
          aria-label="Play again"
        >
          Play Again 🎮
        </button>
        <Link
          href="/"
          className="btn-3d flex min-h-[5rem] flex-1 items-center justify-center rounded-3xl bg-gradient-to-r from-brand-blue to-brand-purple px-8 font-fredoka text-2xl text-white hover:scale-105"
          aria-label="Go home"
        >
          Home 🏠
        </Link>
      </div>
    </div>
  )
}
