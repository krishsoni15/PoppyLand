'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface UseAutoPlayOptions {
  totalItems: number
  intervalMs?: number
  onTick: (index: number) => void
}

export function useAutoPlay({ totalItems, intervalMs = 2500, onTick }: UseAutoPlayOptions) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const onTickRef = useRef(onTick)

  useEffect(() => {
    onTickRef.current = onTick
  }, [onTick])

  const stop = useCallback(() => {
    setIsPlaying(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const start = useCallback(() => {
    setIsPlaying(true)
    setCurrentIndex(0)
    onTickRef.current(0)
  }, [])

  useEffect(() => {
    if (!isPlaying) return

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1
        if (next >= totalItems) {
          stop()
          return 0
        }
        onTickRef.current(next)
        return next
      })
    }, intervalMs)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isPlaying, totalItems, intervalMs, stop])

  return { isPlaying, currentIndex, start, stop }
}
