'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import PageShell from '@/components/ui/PageShell'
import NameModal from '@/components/ui/NameModal'
import { useKeyboard } from '@/hooks/useKeyboard'
import { useApp } from '@/components/providers/AppProvider'
import { useSound } from '@/components/providers/SoundProvider'
import { useSpeech } from '@/hooks/useSpeech'
import { APP_NAME } from '@/lib/constants'
import { getCollectionCount, TOTAL_STICKERS } from '@/lib/collection'
import { CATEGORIES } from '@/lib/categories'
import AnimatedBackground from '@/components/home/AnimatedBackground'

/* ── Dashboard cards ── */
const cards = [
  {
    href: '/alphabet',
    label: 'ABC Forest',
    emoji: '🔤',
    bg: '#FF6B6B',
    shadow: '#C94A4A',
    speak: "Let's learn the alphabet!",
  },
  {
    href: '/numbers',
    label: '123 Mountain',
    emoji: '🔢',
    bg: '#4D96FF',
    shadow: '#2E6FCC',
    speak: "Let's count numbers!",
  },
  {
    href: '/game',
    label: 'Play Game',
    emoji: '🎮',
    bg: '#A855F7',
    shadow: '#7C28D4',
    speak: "Let's play a game!",
  },
  {
    href: '/myname',
    label: 'My Name',
    emoji: '✏️',
    bg: '#FF6BB5',
    shadow: '#C93E8A',
    speak: 'Find the letters in your name!',
    action: 'name' as const,
  },
  {
    href: '/trace',
    label: 'Trace Valley',
    emoji: '🖍️',
    bg: '#6BCB77',
    shadow: '#3D9E48',
    speak: "Let's trace letters!",
  },
  {
    href: '/bubbles',
    label: 'Bubble Ocean',
    emoji: '🫧',
    bg: '#4ECDC4',
    shadow: '#2A9A93',
    speak: 'Pop the bubbles!',
  },
  {
    href: '/collection',
    label: 'Stickers',
    emoji: '⭐',
    bg: '#FECA57',
    shadow: '#CC9A20',
    speak: 'View your sticker collection!',
  },
  {
    href: '/profile',
    label: 'Profile',
    emoji: '🧸',
    bg: '#FF9F43',
    shadow: '#CC6E10',
    speak: 'Check your profile!',
  },
]

export default function HomePage() {
  const router = useRouter()
  const { collection, childName, setChildName, setPoppy, streak } = useApp()
  const { muted, toggleMute, setMood } = useSound()
  const { speak } = useSpeech()
  const streakCount = streak?.current || 0
  const collected = getCollectionCount(collection)

  const [nameOpen, setNameOpen] = useState(false)
  const [lastTapped, setLastTapped] = useState<string | null>(null)

  useEffect(() => {
    setPoppy(childName ? 'idle' : 'sleeping')
  }, [setPoppy, childName])

  useEffect(() => {
    if (!lastTapped) return
    const t = setTimeout(() => setLastTapped(null), 2000)
    return () => clearTimeout(t)
  }, [lastTapped])

  const handleCardTap = useCallback(
    (card: (typeof cards)[0]) => {
      setLastTapped(card.label)
      speak(card.speak)
      if (card.action === 'name') {
        if (childName) router.push('/myname')
        else setNameOpen(true)
      } else {
        router.push(card.href)
      }
    },
    [router, childName, speak],
  )

  const handleNameSave = (name: string) => {
    setChildName(name)
    router.push('/myname')
  }

  useKeyboard(
    useCallback(
      (event) => {
        const k = event.key
        const num = parseInt(k, 10)
        if (num >= 1 && num <= cards.length) handleCardTap(cards[num - 1])
        if (k === 'm' || k === 'M') toggleMute()
      },
      [handleCardTap, toggleMute],
    ),
    !nameOpen,
  )

  return (
    <PageShell variant="home">
      <AnimatedBackground />

      <NameModal
        open={nameOpen}
        onClose={() => setNameOpen(false)}
        onSave={handleNameSave}
        initial={childName}
      />

      <main className="relative z-10 flex min-h-[100dvh] flex-col items-center px-4 pt-3 pb-32 lg:px-8">
        
        {/* HEADER — zero background, sky fully visible */}
        <section className="w-full max-w-sm mb-2 lg:max-w-4xl relative z-20 mt-1 px-2 py-1">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-fredoka text-4xl sm:text-5xl font-bold tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]" style={{WebkitTextStroke:'1px rgba(255,255,255,0.3)', color:'transparent', backgroundImage:'linear-gradient(135deg,#FF6EB4,#FF9A3C,#FFD93D)', WebkitBackgroundClip:'text', backgroundClip:'text'}}>
                {APP_NAME}
              </h1>
              {childName ? (
                <p className="font-fredoka text-sm text-white font-bold drop-shadow-md mt-0.5">Hey {childName}! 🚀</p>
              ) : (
                <button onClick={() => setNameOpen(true)} className="font-fredoka text-xs font-bold text-white bg-purple-500/70 hover:bg-purple-600/90 px-3 py-1 rounded-full shadow-lg mt-0.5 backdrop-blur-sm">
                  Tell me your name! 👋
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={toggleMute}
                className="w-9 h-9 flex items-center justify-center rounded-full text-base transition-transform hover:scale-110 active:scale-95 bg-black/20 backdrop-blur-sm border border-white/20 shadow">
                {muted ? '🔇' : '🎵'}
              </button>
              <div className="flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 px-2.5 py-1.5 rounded-full shadow-lg hover:scale-105 transition-transform">
                <span className="text-base">🔥</span>
                <span className="font-fredoka font-bold text-sm text-white">{streakCount}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Sticker Progress Bar — transparent */}
        <div className="w-full max-w-sm mb-2 lg:max-w-4xl">
          <Link href="/collection"
            className="flex items-center gap-2 rounded-xl px-3 py-1.5 transition-all hover:scale-[1.02] bg-black/15 backdrop-blur-sm border border-white/15 shadow"
          >
            <span className="text-xl">⭐</span>
            <div className="flex flex-1 flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="font-fredoka text-sm text-white font-bold drop-shadow">Sticker Collection</span>
                <span className="font-fredoka text-xs font-bold text-yellow-300">{collected} / {TOTAL_STICKERS}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/20">
                <div className="h-full rounded-full" style={{ width:`${Math.max(4,Math.round((collected/TOTAL_STICKERS)*100))}%`, background:'linear-gradient(90deg,#FECA57,#FF9F43)', transition:'width 1s ease' }} />
              </div>
            </div>
          </Link>
        </div>

        {/* Last-tapped indicator */}
        {lastTapped && (
          <div className="animate-[zoom-in_0.3s_ease-out] bg-white/80 backdrop-blur-sm mb-4 rounded-full px-6 py-2 font-fredoka text-sm font-bold text-purple-600 shadow-lg border-2 border-white z-20">
            🎯 Going to: {lastTapped}
          </div>
        )}

        {/* Dashboard Grid */}
        <nav className="relative z-10 grid w-full max-w-sm grid-cols-2 gap-4 mb-8 sm:max-w-2xl sm:grid-cols-4 sm:gap-6 lg:max-w-4xl lg:gap-8" aria-label="Main navigation">
          {cards.map((card, i) => {
            const isName = card.action === 'name'
            const cls = 'dash-card shadow-[0_8px_0_rgba(0,0,0,0.15)] hover:shadow-[0_12px_0_rgba(0,0,0,0.2)] active:shadow-[0_0px_0_rgba(0,0,0,0.2)] active:translate-y-2 transition-all duration-200'
            const organicRotations = ['rotate-[-2deg]', 'rotate-[1deg]', 'rotate-[2deg]', 'rotate-[-1deg]']
            
            const sty = {
              '--card-bg': card.bg,
              '--card-shadow': card.shadow,
            } as React.CSSProperties

            const inner = (
              <div className={organicRotations[i % organicRotations.length] + " transition-transform duration-300"}>
                <div className="dash-card-icon mx-auto mb-2 text-5xl" aria-hidden="true">{card.emoji}</div>
                <span className="dash-label font-fredoka text-lg">{card.label}</span>
              </div>
            )

            return isName ? (
              <button key={card.label} type="button" onClick={() => handleCardTap(card)} className={cls} style={sty}>
                {inner}
              </button>
            ) : (
              <Link key={card.label} href={card.href} onClick={() => { setLastTapped(card.label); speak(card.speak) }} className={cls} style={sty}>
                {inner}
              </Link>
            )
          })}
        </nav>

        {/* Removed Coming Soon Section as requested */}

      </main>
    </PageShell>
  )
}
