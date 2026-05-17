import { readStorage, writeStorage, STORAGE_KEYS } from '@/lib/storage'
import { ACTIVITY_ORDER, getActivityById } from '@/lib/handwriting-paths'

export interface HandwritingProgressState {
  completed: string[]
  /** 1–3 stars per activity */
  stars: Record<string, number>
}

const EMPTY: HandwritingProgressState = { completed: [], stars: {} }

export function loadHandwritingProgress(): HandwritingProgressState {
  return readStorage(STORAGE_KEYS.handwriting, EMPTY)
}

export function saveHandwritingProgress(state: HandwritingProgressState): void {
  writeStorage(STORAGE_KEYS.handwriting, state)
}

export function isActivityUnlocked(id: string, progress: HandwritingProgressState): boolean {
  const index = ACTIVITY_ORDER.indexOf(id)
  if (index <= 0) return true
  const prevId = ACTIVITY_ORDER[index - 1]
  return progress.completed.includes(prevId)
}

export function completeActivity(
  id: string,
  coverage: number,
): HandwritingProgressState {
  const prev = loadHandwritingProgress()
  const stars = coverage >= 0.9 ? 3 : coverage >= 0.78 ? 2 : 1
  const prevStars = prev.stars[id] ?? 0
  const next: HandwritingProgressState = {
    completed: prev.completed.includes(id) ? prev.completed : [...prev.completed, id],
    stars: { ...prev.stars, [id]: Math.max(prevStars, stars) },
  }
  saveHandwritingProgress(next)
  return next
}

export function getCategoryProgress(
  activityIds: string[],
  progress: HandwritingProgressState,
): { done: number; total: number; stars: number } {
  const done = activityIds.filter((id) => progress.completed.includes(id)).length
  const stars = activityIds.reduce((sum, id) => sum + (progress.stars[id] ?? 0), 0)
  return { done, total: activityIds.length, stars }
}

export function getNextActivityId(currentId: string): string | null {
  const index = ACTIVITY_ORDER.indexOf(currentId)
  if (index < 0 || index >= ACTIVITY_ORDER.length - 1) return null
  return ACTIVITY_ORDER[index + 1] ?? null
}

export function getActivityMeta(id: string) {
  return getActivityById(id)
}
