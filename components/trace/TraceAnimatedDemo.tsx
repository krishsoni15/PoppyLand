'use client'

import { useEffect, useRef, useState } from 'react'
import type { NormPoint, TraceKind } from '@/lib/handwriting-validation'

interface TraceAnimatedDemoProps {
  ghostPath: NormPoint[]
  traceKind: TraceKind
  accent: string
  size: number
  onFinished: () => void
}

export default function TraceAnimatedDemo({
  ghostPath,
  traceKind,
  accent,
  size,
  onFinished,
}: TraceAnimatedDemoProps) {
  const [show, setShow] = useState(true)
  const [fingerPos, setFingerPos] = useState<{ x: number; y: number } | null>(null)
  const [trailPoints, setTrailPoints] = useState<{ x: number; y: number; id: number }[]>([])
  const rafRef = useRef<number>(0)
  const startTimeRef = useRef<number>(0)
  const trailIdRef = useRef(0)
  const finishedRef = useRef(false)

  const DURATION = 2800

  const label =
    traceKind === 'vertical-line' ? 'Watch! Top ↓ bottom'
    : traceKind === 'horizontal-line' ? 'Watch! Side → side'
    : 'Watch the finger! 👆'

  useEffect(() => {
    if (!ghostPath || ghostPath.length < 2) {
      // Nothing to animate — just finish
      const t = setTimeout(() => { setShow(false); onFinished() }, 500)
      return () => clearTimeout(t)
    }

    finishedRef.current = false
    startTimeRef.current = performance.now()

    const animate = (now: number) => {
      const elapsed = now - startTimeRef.current
      const t = Math.min(elapsed / DURATION, 1)

      // Safe interpolation — clamp both indices strictly within bounds
      const last = ghostPath.length - 1
      const floatIdx = t * last
      const lo = Math.min(Math.floor(floatIdx), last)
      const hi = Math.min(lo + 1, last)
      const frac = hi > lo ? floatIdx - lo : 0

      const ptLo = ghostPath[lo]
      const ptHi = ghostPath[hi]

      if (!ptLo) {
        rafRef.current = requestAnimationFrame(animate)
        return
      }

      const px = ptLo.x + ((ptHi?.x ?? ptLo.x) - ptLo.x) * frac
      const py = ptLo.y + ((ptHi?.y ?? ptLo.y) - ptLo.y) * frac

      const sx = (px / 100) * size
      const sy = (py / 100) * size

      setFingerPos({ x: sx, y: sy })
      setTrailPoints(prev => {
        const id = trailIdRef.current++
        return [...prev, { x: sx, y: sy, id }].slice(-10)
      })

      if (t < 1) {
        rafRef.current = requestAnimationFrame(animate)
      } else if (!finishedRef.current) {
        finishedRef.current = true
        setTimeout(() => { setShow(false); onFinished() }, 400)
      }
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => {
      cancelAnimationFrame(rafRef.current)
    }
  }, [ghostPath, size, onFinished])

  if (!show) return null

  const start = ghostPath[0] ?? { x: 50, y: 50 }

  return (
    <div className="pointer-events-none absolute inset-0 z-30 rounded-3xl overflow-hidden">
      {/* Label */}
      <div
        className="absolute left-1/2 top-3 -translate-x-1/2 rounded-full px-4 py-1 font-fredoka text-lg font-bold text-white shadow-md whitespace-nowrap z-10"
        style={{ backgroundColor: accent }}
      >
        {label}
      </div>

      {/* Trail dots */}
      <svg className="absolute inset-0" width={size} height={size} style={{ overflow: 'visible' }}>
        {trailPoints.map((pt, i) => (
          <circle
            key={pt.id}
            cx={pt.x} cy={pt.y}
            r={4 + (i / trailPoints.length) * 5}
            fill={accent}
            opacity={(i / trailPoints.length) * 0.5}
          />
        ))}
      </svg>

      {/* Pulsing start dot */}
      <div
        className="absolute rounded-full border-4 border-white shadow-lg animate-pulse"
        style={{
          width: size * 0.1, height: size * 0.1,
          backgroundColor: accent,
          left: (start.x / 100) * size - size * 0.05,
          top: (start.y / 100) * size - size * 0.05,
          opacity: 0.7,
        }}
      />

      {/* Finger following path */}
      {fingerPos && (
        <div
          className="absolute select-none pointer-events-none"
          style={{
            left: fingerPos.x - 18,
            top: fingerPos.y - 32,
            fontSize: Math.max(28, size * 0.1),
            lineHeight: 1,
            filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.3))',
          }}
        >
          👆
        </div>
      )}
    </div>
  )
}
