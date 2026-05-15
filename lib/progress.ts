export interface LevelInfo {
  id: number
  title: string
  emoji: string
  minXp: number
  maxXp: number | null
}

export const LEVELS: LevelInfo[] = [
  { id: 0, title: 'Explorer', emoji: '🌱', minXp: 0, maxXp: 9 },
  { id: 1, title: 'Learner', emoji: '⭐', minXp: 10, maxXp: 24 },
  { id: 2, title: 'Star Student', emoji: '🌟', minXp: 25, maxXp: 49 },
  { id: 3, title: 'Champion', emoji: '🏆', minXp: 50, maxXp: 99 },
  { id: 4, title: 'Superstar', emoji: '🚀', minXp: 100, maxXp: null },
]

export function getLevelForXp(xp: number): LevelInfo {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXp) return LEVELS[i]
  }
  return LEVELS[0]
}

export function getXpProgress(xp: number): { current: number; max: number; percent: number } {
  const level = getLevelForXp(xp)
  if (level.maxXp === null) {
    const span = 50
    const base = level.minXp
    const inLevel = xp - base
    return { current: inLevel % span, max: span, percent: ((inLevel % span) / span) * 100 }
  }
  const current = xp - level.minXp
  const max = level.maxXp - level.minXp + 1
  return { current, max, percent: Math.min(100, (current / max) * 100) }
}

export function xpToNextLevel(xp: number): number | null {
  const level = getLevelForXp(xp)
  if (level.maxXp === null) return null
  return level.maxXp + 1 - xp
}
