'use client'

import Link from 'next/link'
import { useSound } from '@/components/providers/SoundProvider'
import LevelBadge from '@/components/ui/LevelBadge'

interface NavBarProps {
  title: string
  backHref?: string
}

export default function NavBar({ title, backHref = '/' }: NavBarProps) {
  const { muted, toggleMute } = useSound()

  return (
    <nav className="flex items-center justify-between gap-2 px-4 py-3">
      <Link
        href={backHref}
        className="card-glass flex h-10 items-center justify-center rounded-full px-4 font-fredoka text-sm text-gray-600 shadow-sm transition hover:scale-105"
        aria-label="Go back home"
      >
        ← Back
      </Link>
      <div className="flex flex-1 flex-col items-center gap-0.5">
        <h1 className="text-center font-fredoka text-base text-gray-700 sm:text-xl">{title}</h1>
        <LevelBadge />
      </div>
      <button
        type="button"
        onClick={toggleMute}
        className={`music-btn ${!muted ? 'music-btn--playing' : ''} card-glass flex h-10 w-10 items-center justify-center rounded-full text-lg shadow-sm transition hover:scale-110`}
        aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
      >
        {muted ? '🔇' : '🎵'}
      </button>
    </nav>
  )
}
