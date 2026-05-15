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
import type { PoppyState } from '@/components/mascot/Poppy'
import LevelUpOverlay from '@/components/ui/LevelUpOverlay'
import ScreenFlash, { type FlashType } from '@/components/ui/ScreenFlash'
import Toast from '@/components/ui/Toast'
import {
  EMPTY_COLLECTION,
  unlockLetter,
  unlockNumber,
  type CollectionState,
} from '@/lib/collection'
import { getLevelForXp, type LevelInfo } from '@/lib/progress'
import { readStorage, writeStorage, STORAGE_KEYS } from '@/lib/storage'
import { recordVisit, type VisitState } from '@/lib/visits'
import { loadStreak, saveStreak, type StreakState } from '@/lib/streak'

interface AppContextValue {
  xp: number
  level: LevelInfo
  addXp: (amount: number) => boolean
  collection: CollectionState
  unlockLetterSticker: (letter: string) => boolean
  unlockNumberSticker: (num: number) => boolean
  childName: string
  setChildName: (name: string) => void
  visitStreak: number
  poppyState: PoppyState
  setPoppy: (state: PoppyState, ms?: number) => void
  flash: (type: FlashType) => void
  toast: (message: string) => void
  streak: StreakState
  setStreak: (s: StreakState) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [xp, setXp] = useState(0)
  const [collection, setCollection] = useState<CollectionState>(EMPTY_COLLECTION)
  const [childName, setChildNameState] = useState('')
  const [visitStreak, setVisitStreak] = useState(0)
  const [poppyState, setPoppyState] = useState<PoppyState>('idle')
  const [flashType, setFlashType] = useState<FlashType | null>(null)
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const [levelUp, setLevelUp] = useState<LevelInfo | null>(null)
  const [streak, setStreakState] = useState<StreakState>({ current: 0, best: 0 })
  const poppyTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hydrated = useRef(false)

  useEffect(() => {
    setXp(readStorage(STORAGE_KEYS.xp, 0))
    setCollection(readStorage(STORAGE_KEYS.collection, EMPTY_COLLECTION))
    setChildNameState(readStorage(STORAGE_KEYS.name, ''))
    setStreakState(loadStreak())

    const visits = readStorage<VisitState>(STORAGE_KEYS.visits, { dates: [] })
    const { next, wasAway, dayStreak } = recordVisit(visits)
    writeStorage(STORAGE_KEYS.visits, next)
    setVisitStreak(dayStreak)
    if (wasAway) {
      setTimeout(() => setToastMsg('Welcome back! 🎉'), 600)
    }
    hydrated.current = true
  }, [])

  const level = useMemo(() => getLevelForXp(xp), [xp])

  const setPoppy = useCallback((state: PoppyState, ms = 0) => {
    if (poppyTimer.current) clearTimeout(poppyTimer.current)
    setPoppyState(state)
    if (ms > 0) {
      poppyTimer.current = setTimeout(() => setPoppyState('idle'), ms)
    }
  }, [])

  const flash = useCallback((type: FlashType) => {
    setFlashType(type)
    setTimeout(() => setFlashType(null), 420)
  }, [])

  const toast = useCallback((message: string) => {
    setToastMsg(message)
    setTimeout(() => setToastMsg(null), 3200)
  }, [])

  const addXp = useCallback(
    (amount: number): boolean => {
      if (!hydrated.current || amount <= 0) return false
      const prevLevel = getLevelForXp(xp)
      const nextXp = xp + amount
      setXp(nextXp)
      writeStorage(STORAGE_KEYS.xp, nextXp)
      const newLevel = getLevelForXp(nextXp)
      if (newLevel.id > prevLevel.id) {
        setLevelUp(newLevel)
        setPoppy('celebrate', 3000)
        return true
      }
      return false
    },
    [xp, setPoppy],
  )

  const setChildName = useCallback((name: string) => {
    const clean = name.replace(/[^a-zA-Z]/g, '').slice(0, 12).toUpperCase()
    setChildNameState(clean)
    writeStorage(STORAGE_KEYS.name, clean)
  }, [])

  const unlockLetterSticker = useCallback((letter: string) => {
    let isNew = false
    setCollection((prev) => {
      const had = prev.letters.includes(letter.toUpperCase())
      if (had) return prev
      isNew = true
      const next = unlockLetter(prev, letter)
      writeStorage(STORAGE_KEYS.collection, next)
      return next
    })
    return isNew
  }, [])

  const unlockNumberSticker = useCallback((num: number) => {
    let isNew = false
    setCollection((prev) => {
      if (prev.numbers.includes(num)) return prev
      isNew = true
      const next = unlockNumber(prev, num)
      writeStorage(STORAGE_KEYS.collection, next)
      return next
    })
    return isNew
  }, [])

  const setStreak = useCallback((s: StreakState) => {
    setStreakState(s)
    saveStreak(s)
  }, [])

  const value = useMemo<AppContextValue>(
    () => ({
      xp,
      level,
      addXp,
      collection,
      unlockLetterSticker,
      unlockNumberSticker,
      childName,
      setChildName,
      visitStreak,
      poppyState,
      setPoppy,
      flash,
      toast,
      streak,
      setStreak,
    }),
    [
      xp,
      level,
      addXp,
      collection,
      unlockLetterSticker,
      unlockNumberSticker,
      childName,
      setChildName,
      visitStreak,
      poppyState,
      setPoppy,
      flash,
      toast,
      streak,
      setStreak,
    ],
  )

  return (
    <AppContext.Provider value={value}>
      {children}
      {flashType && <ScreenFlash type={flashType} />}
      {toastMsg && <Toast message={toastMsg} />}
      {levelUp && (
        <LevelUpOverlay
          level={levelUp}
          onClose={() => setLevelUp(null)}
        />
      )}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
