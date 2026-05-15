'use client'

import { useApp } from '@/components/providers/AppProvider'
import { getLast7Days } from '@/lib/visits'
import { readStorage, STORAGE_KEYS } from '@/lib/storage'
import type { VisitState } from '@/lib/visits'

export default function DailyStamps() {
  const { visitStreak } = useApp()
  const visits = readStorage<VisitState>(STORAGE_KEYS.visits, { dates: [] })
  const days = getLast7Days(visits)

  return (
    <div className="card-glass w-full max-w-md rounded-2xl px-4 py-3">
      <div className="flex items-center justify-between">
        <p className="font-nunito text-xs font-bold text-gray-500">Daily stamps</p>
        {visitStreak > 0 && (
          <p className="font-fredoka text-sm text-brand-orange">
            🗓️ {visitStreak} day streak!
          </p>
        )}
      </div>
      <div className="mt-2 flex justify-between gap-1" aria-label="Last 7 days visits">
        {days.map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div
              className={`h-8 w-8 rounded-full border-2 transition ${
                d.visited
                  ? 'border-yellow-400 bg-gradient-to-br from-yellow-300 to-yellow-500 shadow-md'
                  : 'border-gray-200 bg-gray-100'
              }`}
              aria-label={d.visited ? 'Visited' : 'Not visited'}
            />
            <span className="font-nunito text-[10px] text-gray-400">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
