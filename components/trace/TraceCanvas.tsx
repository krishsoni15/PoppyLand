'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Stage, Layer, Line, Rect } from 'react-konva'
import type { KonvaEventObject } from 'konva/lib/Node'
import type { NormPoint } from '@/lib/handwriting-validation'
import { isPointOnPath, validateTracing } from '@/lib/handwriting-validation'

export interface TraceCanvasProps {
  ghostPath: NormPoint[]
  showGuides: boolean
  highContrast: boolean
  accent: string
  onProgress: (coverage: number) => void
  onSuccess: (coverage: number) => void
  onTryAgain?: () => void
  resetToken: number
  disabled?: boolean
}

type Stroke = { points: number[]; onPath: boolean[] }

function normToStage(x: number, y: number, w: number, h: number) {
  return { x: (x / 100) * w, y: (y / 100) * h }
}

function flatNormPath(path: NormPoint[], w: number, h: number): number[] {
  const flat: number[] = []
  for (const p of path) {
    const { x, y } = normToStage(p.x, p.y, w, h)
    flat.push(x, y)
  }
  return flat
}

export default function TraceCanvas({
  ghostPath,
  showGuides,
  highContrast,
  accent,
  onProgress,
  onSuccess,
  resetToken,
  disabled = false,
}: TraceCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 320, height: 320 })
  const [strokes, setStrokes] = useState<Stroke[]>([])
  const [current, setCurrent] = useState<Stroke | null>(null)
  const drawing = useRef(false)
  const succeeded = useRef(false)
  const userNormRef = useRef<NormPoint[]>([])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect
      const side = Math.min(width, 520)
      setSize({ width: side, height: side })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    setStrokes([])
    setCurrent(null)
    userNormRef.current = []
    succeeded.current = false
    drawing.current = false
  }, [resetToken, ghostPath])

  const ghostFlat = useMemo(
    () => flatNormPath(ghostPath, size.width, size.height),
    [ghostPath, size.width, size.height],
  )

  const checkProgress = useCallback(() => {
    const result = validateTracing(ghostPath, userNormRef.current)
    onProgress(result.coverage)
    if (result.success && !succeeded.current) {
      succeeded.current = true
      onSuccess(result.coverage)
    }
    return result
  }, [ghostPath, onProgress, onSuccess])

  const addPoint = useCallback(
    (clientX: number, clientY: number) => {
      const el = containerRef.current
      if (!el || disabled || succeeded.current) return
      const rect = el.getBoundingClientRect()
      const x = clientX - rect.left
      const y = clientY - rect.top
      const nx = (x / size.width) * 100
      const ny = (y / size.height) * 100
      const norm = { x: nx, y: ny }
      userNormRef.current.push(norm)
      const onPath = isPointOnPath(norm, ghostPath)

      setCurrent((prev) => {
        if (!prev) return { points: [x, y], onPath: [onPath] }
        return {
          points: [...prev.points, x, y],
          onPath: [...prev.onPath, onPath],
        }
      })
    },
    [disabled, ghostPath, size.width, size.height],
  )

  const handlePointerDown = (e: KonvaEventObject<PointerEvent>) => {
    if (disabled || succeeded.current) return
    e.evt.preventDefault()
    const stage = e.target.getStage()
    stage?.container().setPointerCapture(e.evt.pointerId)
    drawing.current = true
    setCurrent({ points: [], onPath: [] })
    addPoint(e.evt.clientX, e.evt.clientY)
  }

  const handlePointerMove = (e: KonvaEventObject<PointerEvent>) => {
    if (!drawing.current || disabled) return
    addPoint(e.evt.clientX, e.evt.clientY)
    if (userNormRef.current.length % 8 === 0) checkProgress()
  }

  const handlePointerUp = () => {
    if (!drawing.current) return
    drawing.current = false
    setCurrent((prev) => {
      if (prev && prev.points.length >= 4) {
        setStrokes((s) => [...s, prev])
      }
      return null
    })
    checkProgress()
  }

  const guideYs = showGuides ? [0.28, 0.5, 0.72] : []
  const pad = size.width * 0.06
  const innerW = size.width - pad * 2

  const strokeColor = (onPath: boolean, i: number) => {
    if (highContrast) return onPath ? '#00FF88' : '#FFFFFF'
    if (onPath) {
      const hues = ['#FF6B6B', '#FECA57', '#6BCB77', '#4D96FF', '#A855F7']
      return hues[i % hues.length]
    }
    return accent
  }

  return (
    <div ref={containerRef} className="w-full touch-none select-none">
      <Stage
        width={size.width}
        height={size.height}
        className="mx-auto rounded-3xl shadow-inner"
        style={{
          touchAction: 'none',
          background: highContrast ? '#0a0a12' : 'linear-gradient(180deg, #fffef8 0%, #fff5eb 100%)',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <Layer>
          <Rect
            x={0}
            y={0}
            width={size.width}
            height={size.height}
            fill={highContrast ? '#0a0a12' : '#FFFEF8'}
            cornerRadius={24}
          />

          {guideYs.map((ratio, i) => (
            <Line
              key={`guide-${i}`}
              points={[pad, size.height * ratio, pad + innerW, size.height * ratio]}
              stroke={highContrast ? '#666' : '#E8D5C4'}
              strokeWidth={2}
              dash={[10, 8]}
              opacity={0.85}
            />
          ))}

          <Line
            points={ghostFlat}
            stroke={highContrast ? '#FFD700' : accent}
            strokeWidth={size.width * 0.055}
            opacity={0.35}
            lineCap="round"
            lineJoin="round"
            tension={0.35}
            shadowColor={accent}
            shadowBlur={highContrast ? 16 : 8}
            shadowOpacity={0.4}
          />

          <Line
            points={ghostFlat}
            stroke={highContrast ? '#FFF' : '#ffffff'}
            strokeWidth={size.width * 0.018}
            opacity={0.5}
            lineCap="round"
            lineJoin="round"
            tension={0.35}
            dash={[6, 14]}
          />

          {strokes.map((stroke, si) => (
            <Line
              key={`s-${si}`}
              points={stroke.points}
              stroke={strokeColor(stroke.onPath.some(Boolean), si)}
              strokeWidth={size.width * 0.07}
              lineCap="round"
              lineJoin="round"
              tension={0.4}
              opacity={0.92}
            />
          ))}

          {current && current.points.length >= 4 && (
            <Line
              points={current.points}
              stroke={strokeColor(current.onPath.some(Boolean), strokes.length)}
              strokeWidth={size.width * 0.07}
              lineCap="round"
              lineJoin="round"
              tension={0.4}
              opacity={0.95}
            />
          )}
        </Layer>
      </Stage>
    </div>
  )
}
