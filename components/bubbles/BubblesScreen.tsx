'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import NavBar from '@/components/ui/NavBar'
import PageShell from '@/components/ui/PageShell'
import { ALPHABET_DATA } from '@/lib/data'
import { useSpeech } from '@/hooks/useSpeech'
import { useSound } from '@/components/providers/SoundProvider'
import { useApp } from '@/components/providers/AppProvider'

const MAX_BUBBLES = 5
const COLORS = [
  'bg-red-400',
  'bg-orange-400',
  'bg-yellow-400',
  'bg-green-400',
  'bg-blue-400',
  'bg-purple-400',
  'bg-pink-400',
]

interface Bubble {
  id: number
  letter: string
  color: string
  left: number
  popped: boolean
}

let bubbleId = 0

export default function BubblesScreen() {
  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const { speak } = useSpeech()
  const { playPop, playDing } = useSound()
  const { setPoppy } = useApp()
  const spawnRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const spawnBubble = useCallback(() => {
    const entry = ALPHABET_DATA[Math.floor(Math.random() * ALPHABET_DATA.length)]
    const bubble: Bubble = {
      id: bubbleId++,
      letter: entry.letter,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      left: 10 + Math.random() * 75,
      popped: false,
    }
    setBubbles((prev) => {
      const active = prev.filter((b) => !b.popped)
      if (active.length >= MAX_BUBBLES) return prev
      return [...prev, bubble]
    })
  }, [])

  useEffect(() => {
    setPoppy('happy', 0)
    spawnBubble()
    spawnRef.current = setInterval(spawnBubble, 1400)
    return () => {
      if (spawnRef.current) clearInterval(spawnRef.current)
    }
  }, [spawnBubble, setPoppy])

  const popBubble = (id: number, letter: string) => {
    setBubbles((prev) =>
      prev.map((b) => (b.id === id ? { ...b, popped: true } : b)),
    )
    void playPop()
    void playDing()
    speak(letter)
    setPoppy('happy', 800)
    setTimeout(() => {
      setBubbles((prev) => prev.filter((b) => b.id !== id))
    }, 300)
  }

  return (
    <PageShell variant="cool">
      <NavBar title="Pop Bubbles 🫧" />

      <main className="relative h-[calc(100dvh-4rem)] overflow-hidden">
        <p className="absolute left-0 right-0 top-2 z-10 text-center font-fredoka text-xl text-gray-600">
          Tap the bubbles! Pop pop pop!
        </p>

        {bubbles.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => !b.popped && popBubble(b.id, b.letter)}
            disabled={b.popped}
            className={`
              bubble-float absolute bottom-0 flex min-h-[4.5rem] min-w-[4.5rem]
              items-center justify-center rounded-full border-4 border-white/80
              font-fredoka text-4xl text-white shadow-xl
              ${b.color} ${b.popped ? 'bubble-pop pointer-events-none' : 'btn-juice'}
            `}
            style={{ left: `${b.left}%` }}
            aria-label={`Pop bubble letter ${b.letter}`}
          >
            {b.letter}
          </button>
        ))}
      </main>
    </PageShell>
  )
}
