'use client'

import { useEffect, useRef, useState } from 'react'
import { ALPHABET_DATA, NUMBERS_DATA } from '@/lib/data'
import { speakText } from '@/lib/speech'

interface DisplayItem {
  letter: string
  emoji: string
  word: string
  color: string
  id: number
}

let idCounter = 0

export default function KeyTypeDisplay() {
  const [item, setItem] = useState<DisplayItem | null>(null)
  const [visible, setVisible] = useState(false)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const clearTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Ignore if typing in an input/textarea/contenteditable
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase()
      if (tag === 'input' || tag === 'textarea') return
      if ((e.target as HTMLElement)?.isContentEditable) return

      const key = e.key

      let next: DisplayItem | null = null

      if (/^[a-zA-Z]$/.test(key)) {
        const upper = key.toUpperCase()
        const entry = ALPHABET_DATA.find(d => d.letter === upper)
        if (!entry) return
        next = { letter: upper, emoji: entry.emoji, word: entry.word, color: entry.color, id: idCounter++ }
        speakText(`${upper}, for ${entry.word}`)
      } else if (/^[0-9]$/.test(key)) {
        const num = parseInt(key, 10)
        const entry = NUMBERS_DATA.find(d => d.number === num)
        if (!entry) return
        next = { letter: String(num), emoji: entry.emoji, word: entry.word, color: '#4D96FF', id: idCounter++ }
        speakText(entry.word)
      }

      if (!next) return

      // Clear any pending hide/clear timers
      if (hideTimer.current) clearTimeout(hideTimer.current)
      if (clearTimer.current) clearTimeout(clearTimer.current)

      setItem(next)
      setVisible(true)

      // Start hiding after 2.5s
      hideTimer.current = setTimeout(() => {
        setVisible(false)
        // Remove from DOM after fade-out animation (300ms)
        clearTimer.current = setTimeout(() => setItem(null), 350)
      }, 2500)
    }

    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      if (hideTimer.current) clearTimeout(hideTimer.current)
      if (clearTimer.current) clearTimeout(clearTimer.current)
    }
  }, [])

  if (!item) return null

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[200] flex items-center justify-center"
      aria-live="polite"
      aria-atomic="true"
    >
      <div
        style={{
          background: `linear-gradient(135deg, ${item.color}ee, ${item.color}99)`,
          border: '4px solid rgba(255,255,255,0.55)',
          backdropFilter: 'blur(14px)',
          boxShadow: `0 8px 48px ${item.color}99, 0 2px 16px rgba(0,0,0,0.18)`,
          opacity: visible ? 1 : 0,
          transform: visible ? 'scale(1)' : 'scale(0.88)',
          transition: 'opacity 0.3s ease, transform 0.3s ease',
        }}
        className="flex flex-col items-center gap-2 rounded-3xl px-12 py-8 shadow-2xl"
      >
        {/* Big letter / number */}
        <span
          className="font-fredoka font-bold leading-none"
          style={{ fontSize: '7rem', color: '#fff', textShadow: '0 4px 20px rgba(0,0,0,0.22)' }}
        >
          {item.letter}
        </span>

        {/* Emoji */}
        <span style={{ fontSize: '3.5rem', lineHeight: 1 }}>{item.emoji}</span>

        {/* Word */}
        <span
          className="font-fredoka font-bold"
          style={{ fontSize: '2rem', color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.18)' }}
        >
          {item.word}
        </span>
      </div>
    </div>
  )
}
