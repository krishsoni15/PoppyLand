import { readStorage, writeStorage, STORAGE_KEYS } from './storage'

export interface StreakState {
  current: number
  best: number
}

export function loadStreak(): StreakState {
  return readStorage<StreakState>(STORAGE_KEYS.streak, { current: 0, best: 0 })
}

export function saveStreak(state: StreakState): void {
  writeStorage(STORAGE_KEYS.streak, state)
}

export function incrementStreak(state: StreakState): StreakState {
  const current = state.current + 1
  return { current, best: Math.max(state.best, current) }
}

export function resetStreak(state: StreakState): StreakState {
  return { ...state, current: 0 }
}

export type StreakMilestone = 3 | 5 | 10 | null

export function getStreakMilestone(streak: number): StreakMilestone {
  if (streak === 10) return 10
  if (streak === 5) return 5
  if (streak === 3) return 3
  return null
}

export function getStreakMessage(milestone: StreakMilestone): string {
  switch (milestone) {
    case 3:
      return '🔥 3 Streak!'
    case 5:
      return '🔥🔥 On Fire!'
    case 10:
      return '🔥🔥🔥 UNSTOPPABLE!'
    default:
      return ''
  }
}
