'use client'

import { useCallback, useRef, useState } from 'react'
import NavBar from '@/components/ui/NavBar'
import PageShell from '@/components/ui/PageShell'
import BigDisplay from '@/components/ui/BigDisplay'
import { TRACE_LETTERS, getTraceDots, type TraceDot } from '@/lib/trace-dots'
import { useSpeech } from '@/hooks/useSpeech'
import { useSound } from '@/components/providers/SoundProvider'
import { useApp } from '@/components/providers/AppProvider'

const HIT_RADIUS = 20

export default function TraceScreen() {
  const [letterIndex, setLetterIndex] = useState(0)
  const [litDots, setLitDots] = useState<Set<number>>(new Set())
  const [complete, setComplete] = useState(false)
  const svgRef = useRef<SVGSVGElement>(null)
  const { speak } = useSpeech()
  const { playSuccess } = useSound()
  const { setPoppy } = useApp()

  const letter = TRACE_LETTERS[letterIndex]
  const dots = getTraceDots(letter)

  const toSvgCoords = (dot: TraceDot, rect: DOMRect) => ({
    x: (dot.x / 100) * rect.width,
    y: (dot.y / 100) * rect.height,
  })

  const handlePointer = useCallback(
    (clientX: number, clientY: number) => {
      const svg = svgRef.current
      if (!svg || complete) return
      const rect = svg.getBoundingClientRect()

      setLitDots((prev) => {
        const next = new Set(prev)
        dots.forEach((dot, i) => {
          const { x, y } = toSvgCoords(dot, rect)
          const dx = clientX - rect.left - x
          const dy = clientY - rect.top - y
          if (Math.hypot(dx, dy) < HIT_RADIUS) next.add(i)
        })

        const pct = next.size / dots.length
        if (pct >= 0.8 && !complete) {
          setComplete(true)
          setPoppy('celebrate', 2000)
          void playSuccess()
          speak('Great tracing!')
        }
        return next
      })
    },
    [dots, complete, speak, playSuccess, setPoppy],
  )

  const go = (dir: -1 | 1) => {
    const next = (letterIndex + dir + TRACE_LETTERS.length) % TRACE_LETTERS.length
    setLetterIndex(next)
    setLitDots(new Set())
    setComplete(false)
  }

  return (
    <PageShell variant="warm">
      <NavBar title="Trace Letters ✏️" />

      <main className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 pb-24">
        <BigDisplay value={letter} color="#6BCB77" />

        <div className="card-glass relative w-full rounded-3xl p-4">
          <svg
            ref={svgRef}
            viewBox="0 0 100 100"
            className="aspect-square w-full touch-none"
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId)
              handlePointer(e.clientX, e.clientY)
            }}
            onPointerMove={(e) => {
              if (e.buttons > 0) handlePointer(e.clientX, e.clientY)
            }}
            aria-label={`Trace the letter ${letter}`}
          >
            {dots.map((dot, i) => (
              <circle
                key={i}
                cx={dot.x}
                cy={dot.y}
                r={litDots.has(i) ? 4 : 3}
                fill={litDots.has(i) ? '#6BCB77' : '#ddd'}
                stroke={litDots.has(i) ? '#4ade80' : '#999'}
                strokeWidth="1"
                className="transition-all duration-150"
              />
            ))}
          </svg>
          {complete && (
            <p className="mt-2 text-center font-fredoka text-2xl text-brand-green">
              Great tracing! ⭐
            </p>
          )}
        </div>

        <p className="font-nunito text-sm text-gray-500">
          {litDots.size} / {dots.length} dots — trace with finger or mouse
        </p>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => go(-1)}
            className="btn-3d btn-juice card-glass min-h-[3.75rem] min-w-[3.75rem] rounded-2xl font-fredoka text-3xl"
            aria-label="Previous letter"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            className="btn-3d btn-juice card-glass min-h-[3.75rem] min-w-[3.75rem] rounded-2xl font-fredoka text-3xl"
            aria-label="Next letter"
          >
            →
          </button>
        </div>
      </main>
    </PageShell>
  )
}
