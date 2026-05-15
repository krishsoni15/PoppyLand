export interface VisitState {
  dates: string[]
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

function yesterdayKey(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}

export function recordVisit(state: VisitState): {
  next: VisitState
  isNewDay: boolean
  wasAway: boolean
  dayStreak: number
} {
  const today = todayKey()
  const hadToday = state.dates.includes(today)
  const nextDates = hadToday ? state.dates : [...state.dates, today].slice(-30)
  const wasAway =
    !hadToday && state.dates.length > 0 && !state.dates.includes(yesterdayKey())

  return {
    next: { dates: nextDates },
    isNewDay: !hadToday,
    wasAway,
    dayStreak: computeDayStreak(nextDates),
  }
}

export function computeDayStreak(dates: string[]): number {
  if (dates.length === 0) return 0
  const sorted = [...new Set(dates)].sort()
  let streak = 1
  const today = todayKey()

  if (!sorted.includes(today)) {
    const yesterday = yesterdayKey()
    if (!sorted.includes(yesterday)) return 0
  }

  let cursor = sorted.includes(today) ? today : yesterdayKey()

  for (let i = 0; i < 30; i++) {
    const d = new Date(cursor)
    d.setDate(d.getDate() - 1)
    const key = d.toISOString().slice(0, 10)
    if (sorted.includes(key)) {
      streak++
      cursor = key
    } else {
      break
    }
  }

  return streak
}

export function getLast7Days(state: VisitState): { label: string; visited: boolean }[] {
  const result: { label: string; visited: boolean }[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    const label = ['S', 'M', 'T', 'W', 'T', 'F', 'S'][d.getDay()]
    result.push({ label, visited: state.dates.includes(key) })
  }
  return result
}
