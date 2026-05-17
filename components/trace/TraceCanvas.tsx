'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Stage, Layer, Line, Rect, Circle } from 'react-konva'
import type { NormPoint, TraceKind } from '@/lib/handwriting-validation'
import { isPointOnPath, validateTracing } from '@/lib/handwriting-validation'

export interface TraceCanvasProps {
  ghostPath: NormPoint[]
  ghostSegments?: NormPoint[][]
  traceKind: TraceKind
  showGuides: boolean
  highContrast: boolean
  accent: string
  onProgress: (coverage: number) => void
  onSuccess: (coverage: number) => void
  resetToken: number
  disabled?: boolean
  demoActive?: boolean
}

type Stroke = { points: number[]; color: string }

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

const LINE_KINDS = new Set<TraceKind>(['vertical-line', 'horizontal-line', 'diagonal-line'])
const STROKE_COLORS = ['#FF6B6B', '#FECA57', '#6BCB77', '#4D96FF', '#A855F7', '#FF6BB5']

// Pencil cursor SVG as a data URL
const PENCIL_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <g transform="rotate(-45 16 16)">
    <rect x="13" y="4" width="6" height="18" rx="1" fill="%23FECA57" stroke="%23333" stroke-width="1.5"/>
    <polygon points="13,22 19,22 16,28" fill="%23FF6B6B" stroke="%23333" stroke-width="1.2"/>
    <rect x="13" y="4" width="6" height="4" rx="1" fill="%23aaa" stroke="%23333" stroke-width="1.2"/>
    <line x1="16" y1="28" x2="16" y2="30" stroke="%23333" stroke-width="1.5" stroke-linecap="round"/>
  </g>
</svg>`

export default function TraceCanvas({
  ghostPath,
  ghostSegments,
  traceKind,
  showGuides,
  highContrast,
  accent,
  onProgress,
  onSuccess,
  resetToken,
  disabled = false,
  demoActive = false,
}: TraceCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const touchLayerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 320, height: 320 })
  const [strokes, setStrokes] = useState<Stroke[]>([])
  const [currentPoints, setCurrentPoints] = useState<number[]>([])
  const [currentColor, setCurrentColor] = useState(STROKE_COLORS[0])
  const [isDrawing, setIsDrawing] = useState(false)
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null)
  const [pulse, setPulse] = useState(0)

  const drawing = useRef(false)
  const succeeded = useRef(false)
  const userNormRef = useRef<NormPoint[]>([])
  const activePointerId = useRef<number | null>(null)
  const strokeCountRef = useRef(0)

  const isLineKind = LINE_KINDS.has(traceKind)
  const ghostWidth = isLineKind ? 0.14 : 0.08
  const brush = size.width * (isLineKind ? 0.085 : 0.07)

  // Resize observer
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect
      const side = Math.min(Math.max(width, 280), 520)
      setSize({ width: side, height: side })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Pulse for start dot animation
  useEffect(() => {
    const id = setInterval(() => setPulse((p) => p + 1), 600)
    return () => clearInterval(id)
  }, [])

  // Reset on new activity
  useEffect(() => {
    setStrokes([])
    setCurrentPoints([])
    setIsDrawing(false)
    setCursorPos(null)
    userNormRef.current = []
    succeeded.current = false
    drawing.current = false
    activePointerId.current = null
    strokeCountRef.current = 0
  }, [resetToken, ghostPath])

  const ghostFlat = useMemo(
    () => flatNormPath(ghostPath, size.width, size.height),
    [ghostPath, size.width, size.height],
  )

  const startPoint = useMemo(() => {
    const p = ghostPath[0]
    if (!p) return null
    return normToStage(p.x, p.y, size.width, size.height)
  }, [ghostPath, size.width, size.height])

  const checkProgress = useCallback((onlyProgress = false) => {
    const result = validateTracing(ghostPath, userNormRef.current, traceKind)
    onProgress(result.coverage)
    // Only trigger success on pen lift (onlyProgress=false), never mid-stroke
    if (!onlyProgress && result.success && !succeeded.current) {
      succeeded.current = true
      onSuccess(result.coverage)
    }
  }, [ghostPath, traceKind, onProgress, onSuccess])

  const clientToLocal = useCallback(
    (clientX: number, clientY: number) => {
      const layer = touchLayerRef.current
      if (!layer) return null
      const rect = layer.getBoundingClientRect()
      if (rect.width <= 0 || rect.height <= 0) return null
      const x = Math.max(0, Math.min(size.width, clientX - rect.left))
      const y = Math.max(0, Math.min(size.height, clientY - rect.top))
      return { x, y, nx: (x / size.width) * 100, ny: (y / size.height) * 100 }
    },
    [size.width, size.height],
  )

  const addPoint = useCallback(
    (clientX: number, clientY: number) => {
      if (disabled || succeeded.current || demoActive) return
      const local = clientToLocal(clientX, clientY)
      if (!local) return
      userNormRef.current.push({ x: local.nx, y: local.ny })
      setCurrentPoints((prev) => [...prev, local.x, local.y])
      setCursorPos({ x: local.x, y: local.y })
    },
    [clientToLocal, disabled, demoActive],
  )

  const commitStroke = useCallback(() => {
    if (!drawing.current) return
    drawing.current = false
    setIsDrawing(false)
    activePointerId.current = null

    setCurrentPoints((pts) => {
      if (pts.length >= 4) {
        setStrokes((prev) => {
          const color = STROKE_COLORS[strokeCountRef.current % STROKE_COLORS.length]
          strokeCountRef.current++
          return [...prev, { points: pts, color }]
        })
      }
      return []
    })

    // Always validate on pen lift — this is the only place success can fire
    setTimeout(() => checkProgress(false), 0)
  }, [checkProgress])

  // Pointer handlers on the touch layer
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (disabled || succeeded.current || demoActive) return
      if (e.pointerType === 'mouse' && e.button !== 0) return
      e.preventDefault()
      drawing.current = true
      setIsDrawing(true)
      activePointerId.current = e.pointerId
      setCurrentPoints([])
      try { e.currentTarget.setPointerCapture(e.pointerId) } catch { /* ok */ }
      addPoint(e.clientX, e.clientY)
    },
    [addPoint, disabled, demoActive],
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      // Always update cursor position
      const local = clientToLocal(e.clientX, e.clientY)
      if (local) setCursorPos({ x: local.x, y: local.y })

      if (!drawing.current || disabled || succeeded.current || demoActive) return
      if (activePointerId.current !== null && e.pointerId !== activePointerId.current) return
      e.preventDefault()
      addPoint(e.clientX, e.clientY)
      if (userNormRef.current.length % 6 === 0) checkProgress(true) // progress only, no success mid-stroke
    },
    [addPoint, checkProgress, clientToLocal, disabled, demoActive],
  )

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (activePointerId.current !== null && e.pointerId !== activePointerId.current) return
      try { e.currentTarget.releasePointerCapture(e.pointerId) } catch { /* ok */ }
      commitStroke()
    },
    [commitStroke],
  )

  // Window-level pointer events so drawing continues outside canvas bounds
  useEffect(() => {
    if (disabled || demoActive) return

    const onMove = (e: PointerEvent) => {
      if (!drawing.current || succeeded.current) return
      if (activePointerId.current !== null && e.pointerId !== activePointerId.current) return
      addPoint(e.clientX, e.clientY)
      if (userNormRef.current.length % 6 === 0) checkProgress(true) // progress only mid-stroke
    }

    const onUp = (e: PointerEvent) => {
      if (!drawing.current) return
      if (activePointerId.current !== null && e.pointerId !== activePointerId.current) return
      commitStroke()
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [addPoint, checkProgress, commitStroke, disabled, demoActive])

  // Track cursor position globally via pointermove — works even when pointer is captured by canvas
  useEffect(() => {
    const containerEl = containerRef.current
    const onMove = (e: PointerEvent) => {
      if (disabled || demoActive) return
      // Check if pointer is over the canvas container
      const el = containerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const inside =
        e.clientX >= rect.left && e.clientX <= rect.right &&
        e.clientY >= rect.top && e.clientY <= rect.bottom
      if (inside) {
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        setCursorPos({ x, y })
      } else if (!drawing.current) {
        setCursorPos(null)
      }
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [disabled, demoActive])

  const guideYs = showGuides ? [0.28, 0.5, 0.72] : []
  const pad = size.width * 0.06
  const innerW = size.width - pad * 2

  // Pick current stroke color
  const liveColor = STROKE_COLORS[strokeCountRef.current % STROKE_COLORS.length]

  return (
    <div
      ref={containerRef}
      className="trace-canvas-root relative mx-auto max-w-[520px]"
      style={{ width: size.width, height: size.height, touchAction: 'none', userSelect: 'none' }}
    >
      {/* Konva canvas — pointer-events none, purely visual */}
      <Stage
        width={size.width}
        height={size.height}
        className="mx-auto block rounded-3xl shadow-inner ring-4 ring-white/80"
        style={{ pointerEvents: 'none', touchAction: 'none' }}
      >
        <Layer listening={false}>
          {/* Background */}
          <Rect x={0} y={0} width={size.width} height={size.height}
            fill={highContrast ? '#0a0a12' : '#FFFEF8'} cornerRadius={24} listening={false} />

          {/* Guide lines */}
          {guideYs.map((ratio, i) => (
            <Line key={`g-${i}`}
              points={[pad, size.height * ratio, pad + innerW, size.height * ratio]}
              stroke={highContrast ? '#666' : '#E8D5C4'} strokeWidth={2}
              dash={[10, 8]} opacity={0.85} listening={false} />
          ))}

          {/* Ghost path — render as separate segments if available, else single path */}
          {ghostSegments && ghostSegments.length > 1 ? (
            ghostSegments.map((seg, si) => {
              const segFlat = flatNormPath(seg, size.width, size.height)
              return (
                <React.Fragment key={`seg-${si}`}>
                  <Line points={segFlat} stroke={highContrast ? '#FFD700' : accent}
                    strokeWidth={size.width * ghostWidth}
                    opacity={0.38} lineCap="round" lineJoin="round" tension={0.15} listening={false} />
                  <Line points={segFlat} stroke="#ffffff" strokeWidth={size.width * 0.022}
                    opacity={0.6} lineCap="round" lineJoin="round" tension={0.2}
                    dash={[8, 12]} listening={false} />
                </React.Fragment>
              )
            })
          ) : (
            <>
              <Line points={ghostFlat} stroke={highContrast ? '#FFD700' : accent}
                strokeWidth={size.width * ghostWidth}
                opacity={isLineKind ? 0.55 : 0.38}
                lineCap="round" lineJoin="round" tension={0.2} listening={false} />
              {!isLineKind && (
                <Line points={ghostFlat} stroke="#ffffff" strokeWidth={size.width * 0.022}
                  opacity={0.6} lineCap="round" lineJoin="round" tension={0.35}
                  dash={[8, 12]} listening={false} />
              )}
            </>
          )}

          {/* Start dot */}
          {startPoint && !succeeded.current && (
            <>
              <Circle x={startPoint.x} y={startPoint.y}
                radius={size.width * 0.055 * (1 + Math.sin(pulse) * 0.12)} fill={accent} opacity={0.22} listening={false} />
              <Circle x={startPoint.x} y={startPoint.y}
                radius={size.width * 0.028} fill="#ffffff" stroke={accent} strokeWidth={4} listening={false} />
              <Circle x={startPoint.x} y={startPoint.y}
                radius={size.width * 0.016} fill={accent} listening={false} />
            </>
          )}

          {/* Committed strokes */}
          {strokes.map((s, i) => (
            <Line key={`s-${i}`} points={s.points} stroke={s.color}
              strokeWidth={brush} lineCap="round" lineJoin="round"
              tension={0.3} opacity={0.95} listening={false} />
          ))}

          {/* Live stroke being drawn */}
          {currentPoints.length >= 4 && (
            <Line points={currentPoints} stroke={liveColor}
              strokeWidth={brush} lineCap="round" lineJoin="round"
              tension={0.3} opacity={0.98} listening={false} />
          )}
        </Layer>
      </Stage>

      {/* Invisible touch/pointer capture layer */}
      <div
        ref={touchLayerRef}
        className="absolute inset-0 z-10 rounded-3xl"
        style={{ touchAction: 'none', cursor: 'none' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={() => { if (!drawing.current) setCursorPos(null) }}
        onPointerEnter={(e) => {
          const local = clientToLocal(e.clientX, e.clientY)
          if (local) setCursorPos({ x: local.x, y: local.y })
        }}
        role="img"
        aria-label="Trace here with your finger or mouse"
      />

      {/* Custom pencil cursor — always visible over canvas */}
      {cursorPos && !demoActive && (
        <div
          className="pointer-events-none absolute z-[10000]"
          style={{ left: cursorPos.x, top: cursorPos.y }}
        >
          {isDrawing ? (
            // Pencil icon while drawing
            <svg
              width="36" height="36" viewBox="0 0 36 36"
              style={{
                transform: 'translate(-4px, -32px)',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))',
              }}
            >
              {/* Pencil body */}
              <rect x="14" y="2" width="8" height="22" rx="2" fill="#FECA57" stroke="#333" strokeWidth="1.5"/>
              {/* Eraser */}
              <rect x="14" y="2" width="8" height="5" rx="1.5" fill="#FFB3B3" stroke="#333" strokeWidth="1.2"/>
              {/* Tip */}
              <polygon points="14,24 22,24 18,32" fill="#f5deb3" stroke="#333" strokeWidth="1.2"/>
              {/* Tip point */}
              <line x1="18" y1="32" x2="18" y2="34" stroke="#333" strokeWidth="1.8" strokeLinecap="round"/>
              {/* Shine */}
              <line x1="17" y1="6" x2="17" y2="20" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          ) : (
            // Crosshair dot when hovering
            <div style={{ transform: 'translate(-50%, -50%)' }}>
              <div style={{
                width: 20, height: 20, borderRadius: '50%',
                border: `2.5px solid ${accent}`,
                boxShadow: `0 0 0 2px white, 0 2px 6px rgba(0,0,0,0.2)`,
                backgroundColor: 'transparent',
              }} />
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%,-50%)',
                width: 5, height: 5, borderRadius: '50%',
                backgroundColor: accent,
              }} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
