'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import {
  playDing,
  playNumberNote,
  playSuccess,
  playWrong,
  playBigWin,
  playMegaWin,
  playUltraWin,
  playStreak,
  playPop,
  playLevelUp,
  startBackgroundMusic,
  stopBackgroundMusic,
  setMusicMood,
  setGlobalMute,
  type MusicMood,
} from '@/lib/sounds'

interface SoundContextValue {
  muted: boolean
  toggleMute: () => void
  playDing: () => Promise<void>
  playSuccess: () => Promise<void>
  playWrong: () => Promise<void>
  playNumberNote: (num: number) => Promise<void>
  playBigWin: () => Promise<void>
  playMegaWin: () => Promise<void>
  playUltraWin: () => Promise<void>
  playStreak: (level: 3 | 5 | 10) => Promise<void>
  playPop: () => Promise<void>
  playLevelUp: () => Promise<void>
  setMood: (mood: MusicMood) => void
}

const SoundContext = createContext<SoundContextValue | null>(null)

export function SoundProvider({ children }: { children: ReactNode }) {
  const [muted, setMuted] = useState(false)
  const musicStarted = useRef(false)

  const startMusic = useCallback(() => {
    if (musicStarted.current || muted) return
    musicStarted.current = true
    void startBackgroundMusic(muted)
  }, [muted])

  useEffect(() => {
    const handleInteraction = () => {
      startMusic()
      window.removeEventListener('click', handleInteraction)
      window.removeEventListener('touchstart', handleInteraction)
    }
    window.addEventListener('click', handleInteraction)
    window.addEventListener('touchstart', handleInteraction)
    return () => {
      window.removeEventListener('click', handleInteraction)
      window.removeEventListener('touchstart', handleInteraction)
    }
  }, [startMusic])

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const next = !m
      void setGlobalMute(next)
      if (next) {
        stopBackgroundMusic()
        musicStarted.current = false
      } else {
        musicStarted.current = true
        void startBackgroundMusic(false)
      }
      return next
    })
  }, [])

  const setMood = useCallback((mood: MusicMood) => {
    setMusicMood(mood)
  }, [])

  const value = useMemo<SoundContextValue>(
    () => ({
      muted,
      toggleMute,
      playDing: () => playDing(muted),
      playSuccess: () => playSuccess(muted),
      playWrong: () => playWrong(muted),
      playNumberNote: (num: number) => playNumberNote(num, muted),
      playBigWin: () => playBigWin(muted),
      playMegaWin: () => playMegaWin(muted),
      playUltraWin: () => playUltraWin(muted),
      playStreak: (level) => playStreak(level, muted),
      playPop: () => playPop(muted),
      playLevelUp: () => playLevelUp(muted),
      setMood,
    }),
    [muted, toggleMute, setMood],
  )

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
}

export function useSound() {
  const ctx = useContext(SoundContext)
  if (!ctx) {
    throw new Error('useSound must be used within SoundProvider')
  }
  return ctx
}
