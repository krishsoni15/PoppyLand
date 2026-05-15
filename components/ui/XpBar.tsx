'use client'

import { useEffect, useState } from 'react'
import { useApp } from '@/components/providers/AppProvider'
import { getXpProgress } from '@/lib/progress'

export default function XpBar() {
  const { xp, level } = useApp()
  const progress = getXpProgress(xp)
  const [juice, setJuice] = useState(false)

  useEffect(() => {
    setJuice(true)
    const t = setTimeout(() => setJuice(false), 600)
    return () => clearTimeout(t)
  }, [xp])

  return (
    <div className="w-full" aria-label={`Experience: level ${level.title}`}>
      <div className="mb-1 flex justify-between font-nunito text-xs font-bold text-gray-500">
        <span>
          {level.emoji} {level.title}
        </span>
        <span>{xp} XP</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-white/70 shadow-inner">
        <div
          className={`xp-bar-fill h-full rounded-full bg-gradient-to-r from-brand-yellow to-brand-orange ${juice ? 'xp-bar-fill--juice' : ''}`}
          style={{ width: `${progress.percent}%` }}
        />
      </div>
    </div>
  )
}
