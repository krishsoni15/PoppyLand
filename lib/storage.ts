export function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* quota */
  }
}

export const STORAGE_KEYS = {
  xp: 'letterpop_xp',
  collection: 'letterpop_collection',
  name: 'letterpop_name',
  visits: 'letterpop_visits',
  streak: 'letterpop_streak',
  profile: 'letterpop_profile',
  stats: 'letterpop_stats',
} as const
