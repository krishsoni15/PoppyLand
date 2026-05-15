'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import PageShell from '@/components/ui/PageShell'
import NameModal from '@/components/ui/NameModal'
import XpBar from '@/components/ui/XpBar'
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
  const { collection, childName, setChildName, setPoppy } = useApp()
  const { muted, toggleMute } = useSound()
  const { speak } = useSpeech()
  const [nameOpen, setNameOpen] = useState(false)
  const [lastTapped, setLastTapped] = useState<string | null>(null)
  const collected = getCollectionCount(collection)

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

      <main className="relative z-10 flex min-h-[100dvh] flex-col items-center px-4 pt-5 pb-36 lg:px-8">

        {/* Top row: title + music toggle */}
        <div className="flex w-full max-w-sm items-center justify-between mb-8 lg:max-w-3xl relative z-20 mt-4">
          <div className="hero-entrance flex flex-col justify-center">
            <p className="font-nunito text-[12px] font-bold uppercase tracking-widest text-purple-600 mb-1 opacity-90">
              ✨ Welcome to
            </p>
            <h1 className="font-fredoka text-5xl sm:text-6xl lg:text-7xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B6B] via-[#A855F7] to-[#4D96FF] drop-shadow-md pb-2 hover:scale-105 transition-transform duration-300">
              {APP_NAME}
            </h1>
            {childName && (
              <p className="font-fredoka text-lg text-pink-500 mt-1">Hi {childName}! 👋</p>
            )}
          </div>
          <button
            type="button"
            onClick={toggleMute}
            className={`music-btn ${!muted ? 'music-btn--playing' : ''} card-glass flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full text-2xl shadow-lg transition-all hover:scale-110 active:scale-90 border-4 border-white/60 bg-white/40`}
            aria-label={muted ? 'Turn music on' : 'Turn music off'}
          >
            {muted ? '🔇' : '🎵'}
          </button>
        </div>

        {/* XP + sticker progress */}
        <div className="w-full max-w-sm mb-4 space-y-2 slide-up lg:max-w-3xl" style={{ animationDelay: '0.15s' }}>
          <XpBar />
          <Link
            href="/collection"
            className="card-glass flex items-center gap-3 rounded-2xl px-4 py-2.5 transition-all hover:scale-[1.02] hover:shadow-md"
            aria-label={`${collected} of ${TOTAL_STICKERS} stickers`}
          >
            <span className="text-xl">⭐</span>
            <div className="flex flex-1 flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="font-fredoka text-sm text-gray-600">Sticker Collection</span>
                <span className="font-fredoka text-sm font-bold text-purple-500">{collected}/{TOTAL_STICKERS}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="animate-shine h-full rounded-full"
                  style={{
                    width: `${Math.max(3, Math.round((collected / TOTAL_STICKERS) * 100))}%`,
                    background: 'linear-gradient(90deg, #FECA57, #FF9F43)',
                    transition: 'width 0.6s ease',
                  }}
                />
              </div>
            </div>
          </Link>
        </div>

        {/* Last-tapped indicator */}
        {lastTapped && (
          <div className="animate-zoom-in card-glass mb-3 rounded-full px-5 py-1.5 font-fredoka text-sm text-purple-600 shadow-sm">
            🎯 Going to: {lastTapped}
          </div>
        )}

        {/* ✨ Giant Magical Glow Bloom behind the cards */}
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-tr from-pink-300/30 via-yellow-200/30 to-purple-300/30 blur-[80px] rounded-full pointer-events-none mix-blend-screen animate-pulse" style={{ animationDuration: '6s' }} />

        {/* Dashboard Grid — 2 cols mobile, 4 cols tablet/desktop */}
        <nav className="relative z-10 grid w-full max-w-sm grid-cols-2 gap-4 mb-8 sm:max-w-2xl sm:grid-cols-4 sm:gap-6 lg:max-w-4xl lg:gap-8 animate-hero-fade-in" aria-label="Main navigation">
          {cards.map((card, i) => {
            const isName = card.action === 'name'
            const cls = 'dash-card card-stagger shadow-[0_12px_0_rgba(0,0,0,0.15)]'
            // Add tiny organic random rotations so it looks like scattered toy blocks
            const organicRotations = ['rotate-[-2deg]', 'rotate-[1deg]', 'rotate-[2deg]', 'rotate-[-1deg]', 'rotate-[3deg]', 'rotate-[-3deg]', 'rotate-[1deg]', 'rotate-[-2deg]']
            const sty = {
              '--card-bg': card.bg,
              '--card-shadow': card.shadow,
              animationDelay: `${0.4 + i * 0.1}s`,
            } as React.CSSProperties
            const lbl = `${card.label} — press ${i + 1}`
            const inner = (
              <div className={organicRotations[i % organicRotations.length] + " transition-transform duration-300"}>
                <div className="dash-card-icon mx-auto mb-2" aria-hidden="true">{card.emoji}</div>
                <span className="dash-label font-fredoka">{card.label}</span>
              </div>
            )

            return isName ? (
              <button key={card.label} type="button" onClick={() => handleCardTap(card)} className={cls} style={sty} aria-label={lbl}>
                {inner}
              </button>
            ) : (
              <Link key={card.label} href={card.href} onClick={() => { setLastTapped(card.label); speak(card.speak) }} className={cls} style={sty} aria-label={lbl}>
                {inner}
              </Link>
            )
          })}
        </nav>

        {/* Coming Soon */}
        <section className="w-full max-w-sm slide-up sm:max-w-xl lg:max-w-3xl" style={{ animationDelay: '0.6s' }}>
          <h2 className="mb-3 font-fredoka text-xs text-gray-400 text-center tracking-widest uppercase">Coming Soon 🔮</h2>
          <div className="flex justify-center gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => speak(`${cat.name} is coming soon!`)}
                className="coming-soon-card card-glass relative flex h-14 w-14 flex-col items-center justify-center rounded-2xl transition hover:scale-110"
                aria-label={`${cat.name} — coming soon`}
              >
                <span className="coming-soon-badge">Soon</span>
                <span className="text-lg">{cat.emoji}</span>
                <span className="font-nunito text-[8px] font-bold text-gray-500">{cat.name}</span>
              </button>
            ))}
          </div>
        </section>

        <p className="mt-6 font-nunito text-xs text-gray-400 text-center">
          Free · No ads · Made with 💖 for kids age 2–6
        </p>
      </main>
    </PageShell>
  )
}
