import { useState, useEffect, useCallback, useRef } from 'react'

export type DayNightPhase = 'day' | 'sunset' | 'night' | 'sunrise'

export interface DayNightState {
  phase: DayNightPhase
  progress: number
  sunPosition: number
  moonPosition: number
  isNight: boolean
  skyColors: string[]
  toggleManual: (targetPhase?: 'day' | 'night') => void
}

const CYCLE_DURATION_MS = 120000 // 2 minutes

// Color stops based on the 120s loop
const COLOR_STOPS = [
  { time: 0, colors: ['#FFB347', '#FF8C69', '#87CEEB'] },   // Sunrise 0:00
  { time: 15000, colors: ['#87CEEB', '#98D8F0', '#E0F4FF'] }, // Morning 0:15
  { time: 30000, colors: ['#4FC3F7', '#29B6F6', '#B3E5FC'] }, // Midday 0:30
  { time: 45000, colors: ['#64B5F6', '#7986CB', '#CE93D8'] }, // Afternoon 0:45
  { time: 60000, colors: ['#FF7043', '#FF8A65', '#FFCC02'] }, // Sunset 1:00
  { time: 75000, colors: ['#4A148C', '#7B1FA2', '#FF6F00'] }, // Dusk 1:15
  { time: 90000, colors: ['#0D0D2B', '#1A1A4E', '#2D1B69'] }, // Night 1:30
  { time: 105000, colors: ['#050510', '#0A0A2E', '#1A0A3D'] }, // Midnight 1:45
  { time: 120000, colors: ['#FFB347', '#FF8C69', '#87CEEB'] }, // Loop back
]

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [0, 0, 0]
}

function interpolateColor(color1: string, color2: string, factor: number) {
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)
  const result = rgb1.map((c, i) => Math.round(c + factor * (rgb2[i] - c)))
  return `rgb(${result[0]}, ${result[1]}, ${result[2]})`
}

function getSkyColors(elapsed: number): string[] {
  let startStop = COLOR_STOPS[0]
  let endStop = COLOR_STOPS[1]

  for (let i = 0; i < COLOR_STOPS.length - 1; i++) {
    if (elapsed >= COLOR_STOPS[i].time && elapsed < COLOR_STOPS[i + 1].time) {
      startStop = COLOR_STOPS[i]
      endStop = COLOR_STOPS[i + 1]
      break
    }
  }

  const segmentDuration = endStop.time - startStop.time
  const factor = (elapsed - startStop.time) / segmentDuration

  return [
    interpolateColor(startStop.colors[0], endStop.colors[0], factor),
    interpolateColor(startStop.colors[1], endStop.colors[1], factor),
    interpolateColor(startStop.colors[2], endStop.colors[2], factor),
  ]
}

function getPhase(ms: number): DayNightPhase {
  if (ms >= 50000 && ms < 70000) return 'sunset'
  if (ms >= 70000 && ms < 110000) return 'night'
  if (ms >= 110000 || ms < 10000) return 'sunrise'
  return 'day'
}

function getSunPosition(ms: number): number {
  return ms <= 60000 ? ms / 60000 : 1.1
}

function getMoonPosition(ms: number): number {
  if (ms > 50000 && ms <= 120000) return (ms - 50000) / 70000
  if (ms <= 10000) return 1 + (ms / 70000)
  return 1.1
}

export function useDayNightCycle(): DayNightState {
  // Instead of re-rendering at 60fps, we update React state only
  // when something visually meaningful changes (~4 times/sec max)
  const [snapshot, setSnapshot] = useState({
    elapsedMs: 30000,
    phase: 'day' as DayNightPhase,
    sunPosition: 0.5,
    moonPosition: 1.1,
    isNight: false,
    skyColors: ['#4FC3F7', '#29B6F6', '#B3E5FC'],
  })

  const elapsedRef = useRef(30000)
  const manualOverrideRef = useRef(false)
  const manualTimerRef = useRef<NodeJS.Timeout | null>(null)
  const animationRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number | null>(null)
  const lastSnapshotTimeRef = useRef(0)

  useEffect(() => {
    const tick = (time: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = time
      }
      const deltaTime = time - lastTimeRef.current
      lastTimeRef.current = time

      // Advance the clock
      if (!manualOverrideRef.current && document.visibilityState === 'visible') {
        elapsedRef.current = (elapsedRef.current + deltaTime) % CYCLE_DURATION_MS
      }

      // Only update CSS variables directly on the DOM (no React re-render)
      const ms = elapsedRef.current
      const colors = getSkyColors(ms)
      const isNightNow = ms >= 60000 && ms < 120000
      const phaseNow = getPhase(ms)

      document.body.style.setProperty('--sky-top', colors[0])
      document.body.style.setProperty('--sky-mid', colors[1])
      document.body.style.setProperty('--sky-bot', colors[2])
      document.body.style.setProperty('--ground-color', isNightNow ? '#1B5E20' : '#4CAF50')
      document.body.style.setProperty('--tree-color', isNightNow ? '#0D3310' : '#388E3C')
      document.body.style.setProperty('--env-filter', (phaseNow === 'sunset' || phaseNow === 'sunrise') ? 'sepia(0.3)' : 'none')

      // Only trigger a React state update every 250ms (4 times/sec)
      // This is enough for smooth sun/moon position movement
      if (time - lastSnapshotTimeRef.current > 250) {
        lastSnapshotTimeRef.current = time
        setSnapshot({
          elapsedMs: ms,
          phase: phaseNow,
          sunPosition: getSunPosition(ms),
          moonPosition: getMoonPosition(ms),
          isNight: isNightNow,
          skyColors: colors,
        })
      }

      animationRef.current = requestAnimationFrame(tick)
    }

    animationRef.current = requestAnimationFrame(tick)
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [])

  const toggleManual = useCallback((targetPhase?: 'day' | 'night') => {
    manualOverrideRef.current = true
    if (targetPhase === 'day') {
      elapsedRef.current = 30000
    } else if (targetPhase === 'night') {
      elapsedRef.current = 90000
    } else {
      elapsedRef.current = elapsedRef.current < 60000 ? 90000 : 30000
    }

    // Force immediate snapshot
    const ms = elapsedRef.current
    setSnapshot({
      elapsedMs: ms,
      phase: getPhase(ms),
      sunPosition: getSunPosition(ms),
      moonPosition: getMoonPosition(ms),
      isNight: ms >= 60000 && ms < 120000,
      skyColors: getSkyColors(ms),
    })

    if (manualTimerRef.current) clearTimeout(manualTimerRef.current)
    manualTimerRef.current = setTimeout(() => {
      manualOverrideRef.current = false
      lastTimeRef.current = null // Reset so delta doesn't jump
    }, 30000)
  }, [])

  return {
    phase: snapshot.phase,
    progress: snapshot.elapsedMs / CYCLE_DURATION_MS,
    sunPosition: snapshot.sunPosition,
    moonPosition: snapshot.moonPosition,
    isNight: snapshot.isNight,
    skyColors: snapshot.skyColors,
    toggleManual,
  }
}
