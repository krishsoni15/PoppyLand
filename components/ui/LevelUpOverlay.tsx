'use client'

import { useEffect } from 'react'
import type { LevelInfo } from '@/lib/progress'
import { fireConfetti } from '@/lib/confetti'
import { playLevelUp } from '@/lib/sounds'
import { useSound } from '@/components/providers/SoundProvider'

interface LevelUpOverlayProps {
  level: LevelInfo
  onClose: () => void
}

export default function LevelUpOverlay({ level, onClose }: LevelUpOverlayProps) {
  const { muted } = useSound()

  useEffect(() => {
    void playLevelUp(muted)
    void fireConfetti()
    const t = setTimeout(onClose, 3500)
    return () => clearTimeout(t)
  }, [level, muted, onClose])

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Level up"
    >
      <div className="card-glass max-w-sm animate-zoom-in rounded-3xl px-8 py-10 text-center">
        <p className="font-nunito text-sm font-bold uppercase tracking-widest text-brand-purple">
          LEVEL UP!
        </p>
        <p className="mt-4 font-fredoka text-4xl text-shimmer">
          {level.emoji} {level.title}
        </p>
        <p className="mt-3 font-nunito text-lg text-gray-600">
          You are now a {level.title}! Keep learning!
        </p>
        <button
          type="button"
          onClick={onClose}
          className="btn-3d btn-juice mt-8 min-h-14 w-full rounded-2xl bg-gradient-to-r from-brand-purple to-brand-pink font-fredoka text-xl text-white"
          aria-label="Continue"
        >
          Awesome! 🎉
        </button>
      </div>
    </div>
  )
}
