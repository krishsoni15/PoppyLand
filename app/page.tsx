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

/* ── Dashboard cards ── */
const cards = [
  {
    href: '/alphabet',
    label: 'Learn ABC',
    emoji: '🔤',
    bg: '#FF6B6B',
    shadow: '#C94A4A',
    speak: "Let's learn the alphabet!",
  },
  {
    href: '/numbers',
    label: 'Learn 123',
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
    label: 'Trace',
    emoji: '🖍️',
    bg: '#6BCB77',
    shadow: '#3D9E48',
    speak: "Let's trace letters!",
  },
  {
    href: '/bubbles',
    label: 'Bubbles',
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

/* ── Floating decorations ── */
const floaties = [
  { shape: '⭐', x: '6%', y: '15%', size: 22, delay: 0, duration: 7 },
  { shape: '✨', x: '82%', y: '15%', size: 18, delay: 1, duration: 9 },
  { shape: '🌸', x: '70%', y: '50%', size: 20, delay: 2, duration: 8 },
  { shape: '💫', x: '15%', y: '62%', size: 18, delay: 3, duration: 10 },
  { shape: '🌈', x: '45%', y: '8%', size: 22, delay: 0.5, duration: 8 },
  { shape: '🦋', x: '88%', y: '68%', size: 18, delay: 4, duration: 9 },
  { shape: '💜', x: '5%', y: '82%', size: 14, delay: 1.5, duration: 11 },
  { shape: '🎵', x: '78%', y: '28%', size: 14, delay: 2.5, duration: 7 },
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
      {/* Floating decorations */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        {floaties.map((f, i) => (
          <span
            key={i}
            className="absolute float-drift"
            style={{
              left: f.x, top: f.y,
              fontSize: f.size,
              animationDelay: `${f.delay}s`,
              animationDuration: `${f.duration}s`,
              opacity: 0.35,
            }}
          >
            {f.shape}
          </span>
        ))}
      </div>

      <NameModal
        open={nameOpen}
        onClose={() => setNameOpen(false)}
        onSave={handleNameSave}
        initial={childName}
      />

      <main className="relative z-10 flex min-h-[100dvh] flex-col items-center px-4 pt-5 pb-36 lg:px-8">

        {/* Top row: title + music toggle */}
        <div className="flex w-full max-w-sm items-start justify-between mb-4 lg:max-w-3xl">
          <div className="hero-entrance">
            <p className="font-nunito text-[10px] font-bold uppercase tracking-widest text-purple-400">
              ✨ Welcome to ✨
            </p>
            <h1 className="font-fredoka text-4xl leading-tight text-shimmer sm:text-5xl lg:text-6xl">
              {APP_NAME}
            </h1>
            {childName && (
              <p className="font-fredoka text-lg text-pink-400">Hi {childName}! 👋</p>
            )}
          </div>
          <button
            type="button"
            onClick={toggleMute}
            className={`music-btn mt-1 ${!muted ? 'music-btn--playing' : ''} card-glass flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-2xl shadow-md transition-all hover:scale-110 active:scale-90`}
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
                  className="h-full rounded-full"
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

        {/* Dashboard Grid — 2 cols mobile, 4 cols tablet/desktop */}
        <nav className="grid w-full max-w-sm grid-cols-2 gap-4 mb-6 sm:max-w-xl sm:grid-cols-4 sm:gap-5 lg:max-w-3xl lg:gap-6" aria-label="Main navigation">
          {cards.map((card, i) => {
            const isName = card.action === 'name'
            const cls = 'dash-card card-stagger'
            const sty = {
              '--card-bg': card.bg,
              '--card-shadow': card.shadow,
              animationDelay: `${0.1 + i * 0.06}s`,
            } as React.CSSProperties
            const lbl = `${card.label} — press ${i + 1}`
            const inner = (
              <>
                <div className="dash-card-icon" aria-hidden="true">{card.emoji}</div>
                <span className="dash-label font-fredoka">{card.label}</span>
              </>
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
