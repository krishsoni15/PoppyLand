'use client'

import { useApp } from '@/components/providers/AppProvider'

export default function LevelBadge() {
  const { level } = useApp()
  return (
    <span
      className="hidden sm:inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 font-nunito text-xs font-bold text-gray-600 shadow-sm"
      title={`Level: ${level.title}`}
    >
      <span aria-hidden="true">{level.emoji}</span>
      <span className="max-w-[5rem] truncate">{level.title}</span>
    </span>
  )
}
