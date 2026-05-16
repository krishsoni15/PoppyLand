'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Poppy, { type PoppyState } from './Poppy'
import { useSpeech } from '@/hooks/useSpeech'
import { speakText } from '@/lib/speech'

const TIPS = [
  'Tap a letter to hear it!',
  'Can you find the letter A?',
  "You're doing amazing! ⭐",
  'Try the game mode!',
  'Collect all 46 stickers!',
  'Try tracing letters!',
  'Pop some bubbles!',
  "You're so smart! 🌟",
  'Great job today!',
  'Keep learning! 🎉',
]

interface GlobalMascotProps {
  poppyState?: PoppyState
}

export function GlobalMascot({ poppyState = 'idle' }: GlobalMascotProps) {
  const { isSpeaking } = useSpeech()
  const [speechText, setSpeechText] = useState<string | null>(null)
  const [worldMode, setWorldMode] = useState('summer')
  const speechTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleClick = useCallback(() => {
    const tip = TIPS[Math.floor(Math.random() * TIPS.length)]
    setSpeechText(tip)
    speakText(tip)
    if (speechTimer.current) clearTimeout(speechTimer.current)
    speechTimer.current = setTimeout(() => setSpeechText(null), 3500)
  }, [])

  useEffect(() => {
    const onMode = (e: Event) => {
      const next = (e as CustomEvent<string>).detail
      if (next) setWorldMode(next)
    }
    const initial = document.body.dataset.worldMode
    if (initial) setWorldMode(initial)

    const onEnd = () => {
      if (speechTimer.current) clearTimeout(speechTimer.current)
      speechTimer.current = setTimeout(() => setSpeechText(null), 2000)
    }
    window.addEventListener('speech-end', onEnd)
    window.addEventListener('world-mode-change', onMode as EventListener)

    // Initial Greeting on load
    setTimeout(() => {
      const greeting = "Hey I am Poppy! Welcome! Let's start learning!"
      setSpeechText(greeting)
      speakText(greeting)
      if (speechTimer.current) clearTimeout(speechTimer.current)
      speechTimer.current = setTimeout(() => setSpeechText(null), 4000)
    }, 1000)

    return () => {
      window.removeEventListener('speech-end', onEnd)
      window.removeEventListener('world-mode-change', onMode as EventListener)
      if (speechTimer.current) clearTimeout(speechTimer.current)
    }
  }, [])

  return (
    /* Float the whole container with CSS animation */
    <div
      className="global-mascot-wrapper fixed bottom-2 right-3 z-50 flex flex-col items-end"
      style={{
        width: 140,
        animation: 'poppyIdle 3s ease-in-out infinite',
      }}
    >
      {/* Speech bubble */}
      {speechText && (
        <div
          className="speech-bubble mb-3"
          style={{
            whiteSpace: 'normal',
            maxWidth: 200,
            fontSize: '14px',
            lineHeight: '1.4',
          }}
        >
          {speechText} {worldMode === 'monsoon' ? '☔' : worldMode === 'night' ? '🌙' : worldMode === 'summer' ? '😎' : ''}
        </div>
      )}

      {/* Poppy button — click to get a tip */}
      <button
        type="button"
        onClick={handleClick}
        className="relative border-none bg-transparent p-0 origin-bottom"
        style={{
          width: 140,
          height: 140,
          transition: 'transform 0.2s cubic-bezier(0.34,1.56,0.64,1)',
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        onMouseDown={e  => (e.currentTarget.style.transform = 'scale(0.95)')}
        onMouseUp={e    => (e.currentTarget.style.transform = 'scale(1.05)')}
        aria-label="Poppy the mascot — click for a tip!"
      >
        <div className="relative">
          {worldMode === 'monsoon' && <div className="absolute -top-4 left-8 text-2xl">☔</div>}
          {worldMode === 'summer' && <div className="absolute -top-3 left-9 text-2xl">🕶️</div>}
          <Poppy state={speechText ? 'idle' : poppyState} size={140} isSpeaking={isSpeaking} />
        </div>
      </button>
    </div>
  )
}
