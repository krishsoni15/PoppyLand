'use client'

import { useCallback } from 'react'
import { useSound } from '@/components/providers/SoundProvider'
import { useApp } from '@/components/providers/AppProvider'
import { useSpeech } from '@/hooks/useSpeech'
import { fireConfetti, fireBigConfetti, fireMegaConfetti } from '@/lib/confetti'

const PRAISE_CORRECT = [
  'Amazing!', 'Superstar!', 'You got it!', 'Brilliant!',
  'Wow!', 'Perfect!', 'Yes!', 'Incredible!', "You're so smart!",
]

const PRAISE_WRONG = [
  'Try again!', 'Almost!', 'So close!', "You'll get it!",
]

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function vibrate(pattern: number | number[]) {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(pattern)
  }
}

function spawnGoldCoins(targetEl?: HTMLElement | null) {
  if (typeof document === 'undefined') return
  const parent = targetEl ?? document.body
  const rect = parent.getBoundingClientRect()

  for (let i = 0; i < 3; i++) {
    const coin = document.createElement('div')
    coin.className = 'gold-coin'
    coin.textContent = '🪙'
    coin.style.left = `${rect.left + Math.random() * rect.width}px`
    coin.style.top = `${rect.top}px`
    coin.style.position = 'fixed'
    coin.style.animationDelay = `${i * 0.1}s`
    document.body.appendChild(coin)
    setTimeout(() => coin.remove(), 1000)
  }
}

export function useDopamine() {
  const sound = useSound()
  const { setPoppy, flash, addXp } = useApp()
  const { speak } = useSpeech()

  const triggerCorrect = useCallback(
    (opts?: {
      streakCount?: number
      targetEl?: HTMLElement | null
      xpAmount?: number
      tier?: 'normal' | 'big' | 'mega' | 'ultra'
    }) => {
      const { streakCount = 1, targetEl, xpAmount = 1, tier = 'normal' } = opts ?? {}

      // VISUAL: green edge flash
      flash(tier === 'ultra' ? 'rainbow' : tier === 'mega' ? 'gold' : 'green')

      // VISUAL: gold coins fly up
      spawnGoldCoins(targetEl)

      // VISUAL: Poppy mascot
      if (streakCount >= 5) {
        setPoppy('celebrate', 2000)
      } else {
        setPoppy('happy', 1200)
      }

      // AUDIO
      if (tier === 'ultra') {
        void sound.playUltraWin()
        void fireMegaConfetti()
      } else if (tier === 'mega') {
        void sound.playMegaWin()
        void fireMegaConfetti()
      } else if (tier === 'big') {
        void sound.playBigWin()
        void fireBigConfetti()
      } else {
        void sound.playSuccess()
        void fireConfetti()
      }

      // HAPTIC
      vibrate(50)

      // VOICE
      speak(randomItem(PRAISE_CORRECT))

      // XP
      addXp(xpAmount)
    },
    [flash, setPoppy, sound, speak, addXp],
  )

  const triggerWrong = useCallback(
    (targetEl?: HTMLElement | null) => {
      // VISUAL: red edge flash
      flash('red')

      // VISUAL: shake handled by CSS class
      if (targetEl) {
        targetEl.classList.add('animate-shake')
        setTimeout(() => targetEl.classList.remove('animate-shake'), 500)
      }

      // Poppy
      setPoppy('sad', 1500)

      // AUDIO
      void sound.playWrong()

      // HAPTIC
      vibrate([30, 20, 30])

      // VOICE
      speak(randomItem(PRAISE_WRONG))
    },
    [flash, setPoppy, sound, speak],
  )

  return { triggerCorrect, triggerWrong }
}
