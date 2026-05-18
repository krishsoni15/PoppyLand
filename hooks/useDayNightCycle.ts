import { useState, useEffect, useCallback, useRef } from 'react'

export type DayNightPhase = 'day' | 'sunset' | 'night' | 'sunrise'
export type Season = 'summer' | 'monsoon' | 'winter'

export interface DayNightState {
  phase: DayNightPhase
  progress: number
  sunPosition: number
  moonPosition: number
  isNight: boolean
  skyColors: string[]
  season: Season
  setSeason: (s: Season) => void
  toggleManual: (targetPhase?: 'day' | 'night') => void
}

const CYCLE_DURATION_MS = 120000 // 2 minutes full day/night loop

const SUMMER_COLORS = [
  { time: 0, colors: ['#FFB347', '#FF8C69', '#87CEEB'] },
  { time: 15000, colors: ['#87CEEB', '#98D8F0', '#E0F4FF'] },
  { time: 30000, colors: ['#4FC3F7', '#29B6F6', '#B3E5FC'] },
  { time: 45000, colors: ['#64B5F6', '#7986CB', '#CE93D8'] },
  { time: 60000, colors: ['#FF7043', '#FF8A65', '#FFCC02'] },
  { time: 75000, colors: ['#4A148C', '#7B1FA2', '#FF6F00'] },
  { time: 90000, colors: ['#0D0D2B', '#1A1A4E', '#2D1B69'] },
  { time: 105000, colors: ['#050510', '#0A0A2E', '#1A0A3D'] },
  { time: 120000, colors: ['#FFB347', '#FF8C69', '#87CEEB'] },
]

const MONSOON_COLORS = [
  { time: 0, colors: ['#FFB347', '#A09CA3', '#707075'] },
  { time: 15000, colors: ['#707075', '#8C8C94', '#B0B0B8'] },
  { time: 30000, colors: ['#606068', '#7A7A82', '#9696A0'] },
  { time: 45000, colors: ['#585860', '#6C6C75', '#868690'] },
  { time: 60000, colors: ['#FF7043', '#8C8C94', '#707075'] },
  { time: 75000, colors: ['#4A148C', '#4A4A52', '#383840'] },
  { time: 90000, colors: ['#0D0D2B', '#1A1A24', '#202028'] },
  { time: 105000, colors: ['#050510', '#0A0A18', '#101015'] },
  { time: 120000, colors: ['#FFB347', '#A09CA3', '#707075'] },
]

const WINTER_COLORS = [
  { time: 0, colors: ['#FFB347', '#FF8C69', '#A8DADC'] },
  { time: 15000, colors: ['#A8DADC', '#CBE5F0', '#EAF4F4'] },
  { time: 30000, colors: ['#BDE0FE', '#A2D2FF', '#C8E7FF'] },
  { time: 45000, colors: ['#A2D2FF', '#BDE0FE', '#C8E7FF'] },
  { time: 60000, colors: ['#FFB347', '#FF8C69', '#C8E7FF'] },
  { time: 75000, colors: ['#4A148C', '#7B1FA2', '#5068A8'] },
  { time: 90000, colors: ['#0D0D2B', '#1A1A4E', '#1D2D5B'] },
  { time: 105000, colors: ['#050510', '#0A0A2E', '#1A0A3D'] },
  { time: 120000, colors: ['#FFB347', '#FF8C69', '#A8DADC'] },
]

function hexToRgb(hex: string) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return r ? [parseInt(r[1], 16), parseInt(r[2], 16), parseInt(r[3], 16)] : [0, 0, 0]
}

function interpolateColor(c1: string, c2: string, f: number) {
  const a = hexToRgb(c1), b = hexToRgb(c2)
  const r = a.map((v, i) => Math.round(v + f * (b[i] - v)))
  return `rgb(${r[0]},${r[1]},${r[2]})`
}

function getSkyColors(elapsed: number, season: Season): string[] {
  const stops = season === 'winter' ? WINTER_COLORS : season === 'monsoon' ? MONSOON_COLORS : SUMMER_COLORS
  let s0 = stops[0], s1 = stops[1]
  for (let i = 0; i < stops.length - 1; i++) {
    if (elapsed >= stops[i].time && elapsed < stops[i + 1].time) { s0 = stops[i]; s1 = stops[i + 1]; break }
  }
  const d = s1.time - s0.time
  const f = d > 0 ? (elapsed - s0.time) / d : 0
  return [interpolateColor(s0.colors[0], s1.colors[0], f), interpolateColor(s0.colors[1], s1.colors[1], f), interpolateColor(s0.colors[2], s1.colors[2], f)]
}

function getPhase(ms: number): DayNightPhase {
  if (ms >= 50000 && ms < 70000) return 'sunset'
  if (ms >= 70000 && ms < 110000) return 'night'
  if (ms >= 110000 || ms < 10000) return 'sunrise'
  return 'day'
}

function getSunPos(ms: number) { return ms <= 60000 ? ms / 60000 : 1.1 }
function getMoonPos(ms: number) {
  if (ms > 50000 && ms <= 120000) return (ms - 50000) / 70000
  if (ms <= 10000) return 1 + ms / 70000
  return 1.1
}

export function useDayNightCycle(): DayNightState {
  const [season, setSeasonRaw] = useState<Season>('summer')
  const manualSeasonRef = useRef(false)
  const seasonRef = useRef<Season>('summer')

  const [snapshot, setSnapshot] = useState(() => {
    return { elapsedMs: 0, phase: 'sunrise' as DayNightPhase, sunPosition: 0, moonPosition: 1.1, isNight: false, skyColors: getSkyColors(0, 'summer') }
  })

  useEffect(() => { seasonRef.current = season }, [season])

  const elapsedRef = useRef(0)
  const manualOverrideRef = useRef(false)
  const manualTimerRef = useRef<NodeJS.Timeout | null>(null)
  const animRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number | null>(null)
  const lastSnapRef = useRef(0)

  // No longer needed to auto-detect real day, we will cycle internally

  // Main animation loop - runs forever
  useEffect(() => {
    const tick = (time: number) => {
      if (lastTimeRef.current === null) lastTimeRef.current = time
      const dt = time - lastTimeRef.current
      lastTimeRef.current = time

      if (!manualOverrideRef.current && document.visibilityState === 'visible') {
        const prevElapsed = elapsedRef.current;
        elapsedRef.current = (elapsedRef.current + dt) % CYCLE_DURATION_MS
        
        // When a full day completes, rotate the season if not manually overridden
        if (prevElapsed > elapsedRef.current) {
          if (!manualSeasonRef.current) {
            setSeasonRaw(prev => prev === 'summer' ? 'monsoon' : prev === 'monsoon' ? 'winter' : 'summer')
          }
          // Reset manual season override on the next day cycle so it doesn't get permanently stuck
          manualSeasonRef.current = false;
        }
      }

      const ms = elapsedRef.current
      const cs = seasonRef.current
      const colors = getSkyColors(ms, cs)
      const isNightNow = ms >= 60000 && ms < 120000
      const phaseNow = getPhase(ms)

      document.body.style.setProperty('--sky-top', colors[0])
      document.body.style.setProperty('--sky-mid', colors[1])
      document.body.style.setProperty('--sky-bot', colors[2])

      let gc = isNightNow ? '#1B5E20' : '#4CAF50'
      let tc = isNightNow ? '#0D3310' : '#388E3C'
      if (cs === 'winter') { gc = isNightNow ? '#B0BEC5' : '#ECEFF1'; tc = isNightNow ? '#263238' : '#78909C' }
      else if (cs === 'monsoon') { gc = isNightNow ? '#143C16' : '#388E3C'; tc = isNightNow ? '#09250B' : '#2E7D32' }

      document.body.style.setProperty('--ground-color', gc)
      document.body.style.setProperty('--tree-color', tc)
      document.body.style.setProperty('--env-filter', (phaseNow === 'sunset' || phaseNow === 'sunrise') ? 'sepia(0.3)' : 'none')

      if (time - lastSnapRef.current > 250) {
        lastSnapRef.current = time
        setSnapshot({ elapsedMs: ms, phase: phaseNow, sunPosition: getSunPos(ms), moonPosition: getMoonPos(ms), isNight: isNightNow, skyColors: colors })
      }
      animRef.current = requestAnimationFrame(tick)
    }
    animRef.current = requestAnimationFrame(tick)
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [])

  const toggleManual = useCallback((tp?: 'day' | 'night') => {
    manualOverrideRef.current = true
    elapsedRef.current = tp === 'day' ? 30000 : tp === 'night' ? 90000 : (elapsedRef.current < 60000 ? 90000 : 30000)
    const ms = elapsedRef.current
    setSnapshot({ elapsedMs: ms, phase: getPhase(ms), sunPosition: getSunPos(ms), moonPosition: getMoonPos(ms), isNight: ms >= 60000 && ms < 120000, skyColors: getSkyColors(ms, seasonRef.current) })
    if (manualTimerRef.current) clearTimeout(manualTimerRef.current)
    manualTimerRef.current = setTimeout(() => { manualOverrideRef.current = false; lastTimeRef.current = null }, 15000)
  }, [])

  const setSeason = useCallback((s: Season) => {
    manualSeasonRef.current = true
    setSeasonRaw(s)
    elapsedRef.current = 5000 // Start near sunrise for dramatic reveal
    manualOverrideRef.current = true
    if (manualTimerRef.current) clearTimeout(manualTimerRef.current)
    manualTimerRef.current = setTimeout(() => { manualOverrideRef.current = false; lastTimeRef.current = null }, 3000)
  }, [])

  return { phase: snapshot.phase, progress: snapshot.elapsedMs / CYCLE_DURATION_MS, sunPosition: snapshot.sunPosition, moonPosition: snapshot.moonPosition, isNight: snapshot.isNight, skyColors: snapshot.skyColors, season, setSeason, toggleManual }
}
