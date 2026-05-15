'use client'

import { getStreakMessage, type StreakMilestone } from '@/lib/streak'

export default function StreakBanner({ milestone }: { milestone: StreakMilestone }) {
  if (!milestone) return null
  const msg = getStreakMessage(milestone)
  const big = milestone >= 10

  return (
    <div
      className={`
        streak-banner animate-zoom-in rounded-2xl px-4 py-2 text-center font-fredoka text-xl text-white shadow-lg
        ${big ? 'bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 text-2xl' : 'bg-gradient-to-r from-orange-400 to-red-500'}
      `}
      role="status"
      aria-live="assertive"
    >
      {msg}
    </div>
  )
}
