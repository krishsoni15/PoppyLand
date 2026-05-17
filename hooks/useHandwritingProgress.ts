'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  completeActivity,
  isActivityUnlocked,
  loadHandwritingProgress,
  type HandwritingProgressState,
} from '@/lib/handwriting-progress'

export function useHandwritingProgress() {
  const [progress, setProgress] = useState<HandwritingProgressState>({
    completed: [],
    stars: {},
  })
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setProgress(loadHandwritingProgress())
    setReady(true)
  }, [])

  const refresh = useCallback(() => {
    setProgress(loadHandwritingProgress())
  }, [])

  const markComplete = useCallback((id: string, coverage: number) => {
    const next = completeActivity(id, coverage)
    setProgress(next)
    return next
  }, [])

  const isUnlocked = useCallback(
    (id: string) => isActivityUnlocked(id, progress),
    [progress],
  )

  return { progress, ready, refresh, markComplete, isUnlocked }
}
