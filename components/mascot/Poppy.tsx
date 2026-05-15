'use client'

import { useEffect, useRef, useState } from 'react'

export type PoppyState = 'idle' | 'happy' | 'sad' | 'celebrate' | 'sleeping'

interface PoppyProps {
  state?: PoppyState
  size?: number
  className?: string
  isSpeaking?: boolean
}

export default function Poppy({
  state = 'idle',
  size = 120,
  className = '',
  isSpeaking = false,
}: PoppyProps) {
  const [blinking, setBlinking] = useState(false)
  const [mouthOpen, setMouthOpen] = useState(0)
  const blinkTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mouthRef   = useRef<ReturnType<typeof setInterval> | null>(null)

  // ── blink scheduler ──
  useEffect(() => {
    const schedule = () => {
      blinkTimer.current = setTimeout(() => {
        setBlinking(true)
        setTimeout(() => {
          setBlinking(false)
          schedule()
        }, 130)
      }, 2400 + Math.random() * 2200)
    }
    schedule()
    return () => { if (blinkTimer.current) clearTimeout(blinkTimer.current) }
  }, [])

  // ── mouth when speaking ──
  useEffect(() => {
    if (isSpeaking) {
      const seq = [0, 9, 4, 12, 2, 8, 5, 11, 1, 7]
      let i = 0
      mouthRef.current = setInterval(() => {
        setMouthOpen(seq[i++ % seq.length])
      }, 95)
    } else {
      setMouthOpen(0)
      if (mouthRef.current) clearInterval(mouthRef.current)
    }
    return () => { if (mouthRef.current) clearInterval(mouthRef.current) }
  }, [isSpeaking])

  // Wake up if speaking!
  const activeState = isSpeaking && state === 'sleeping' ? 'idle' : state
  const isSleeping = activeState === 'sleeping'
  const uid = `p${size}x`

  // ── eye open/close scale ──
  const eyeSY = blinking || isSleeping ? 0.06 : 1

  // ── shared eye styles — reliable SVG transform origin ──
  const getEyeStyle = (cx: number, cy: number, closed: boolean): React.CSSProperties => ({
    transformOrigin: `${cx}px ${cy}px`,
    transform: `scaleY(${closed ? 0.06 : 1})`,
    transition: `transform ${closed ? '0.05s' : '0.09s'} ease`,
  })

  return (
    <div
      className={`poppy poppy--${state} ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Poppy the mascot is ${state}`}
    >
      {state === 'celebrate' && (
        <div className="poppy-burst" aria-hidden="true">
          {[0,45,90,135,180,225,270,315].map(d => (
            <span key={d} className="poppy-spark"
              style={{ '--deg': `${d}deg` } as React.CSSProperties} />
          ))}
        </div>
      )}
      {isSleeping && <span className="poppy-zzz" aria-hidden="true">z z z</span>}

      <svg viewBox="0 0 100 100" width={size} height={size}
        style={{ overflow: 'visible', display: 'block' }}>
        <defs>
          {/* Star gradient — bright gold → warm amber */}
          <linearGradient id={`${uid}-body`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#FFE966"/>
            <stop offset="100%" stopColor="#FFAA20"/>
          </linearGradient>
          {/* Darker shade for depth polygon */}
          <linearGradient id={`${uid}-shade`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#FFC020"/>
            <stop offset="100%" stopColor="#D97000"/>
          </linearGradient>
          {/* Iris — sky blue → royal blue */}
          <radialGradient id={`${uid}-iris`} cx="42%" cy="38%" r="62%">
            <stop offset="0%"   stopColor="#A0DCFF"/>
            <stop offset="55%"  stopColor="#3A8FE0"/>
            <stop offset="100%" stopColor="#1A5CB0"/>
          </radialGradient>
          {/* Pupil — very dark with subtle highlight */}
          <radialGradient id={`${uid}-pupil`} cx="30%" cy="25%" r="68%">
            <stop offset="0%"   stopColor="#3a3060"/>
            <stop offset="100%" stopColor="#050510"/>
          </radialGradient>
          {/* Drop shadow under star */}
          <filter id={`${uid}-dropshadow`} x="-20%" y="-10%" width="140%" height="135%">
            <feDropShadow dx="0" dy="6" stdDeviation="4"
              floodColor="#AA5500" floodOpacity="0.28"/>
          </filter>
        </defs>

        {/* ── depth layer ── */}
        <polygon
          points="50,12 60,37 90,37 67,54 76,82 50,66 24,82 33,54 10,37 40,37"
          fill={`url(#${uid}-shade)`}
          opacity="0.35"
          transform="translate(1,4) scale(1.02)"
          style={{ transformOrigin: '50px 50px' }}
        />

        {/* ── main star ── */}
        <polygon
          points="50,12 60,37 90,37 67,54 76,82 50,66 24,82 33,54 10,37 40,37"
          fill={`url(#${uid}-body)`}
          stroke="#D07800"
          strokeWidth="0.8"
          filter={`url(#${uid}-dropshadow)`}
        />

        {/* ── top-left gloss ── */}
        <ellipse cx="40" cy="26" rx="11" ry="6" fill="white" opacity="0.16"
          transform="rotate(-22,40,26)"/>

        {/* ── cheek blush — well below eyes ── */}
        <ellipse cx="28" cy="65" rx="7.5" ry="4.5" fill="#FFB4B4" opacity="0.45"/>
        <ellipse cx="72" cy="65" rx="7.5" ry="4.5" fill="#FFB4B4" opacity="0.45"/>

        {/* ══════════════ LEFT EYE ══════════════ */}
        {isSleeping ? (
          // Sleeping: closed eyelids (downward curve)
          <path d="M 29 48 Q 38 54 47 48"
            stroke="#8B5200" strokeWidth="3.2" fill="none" strokeLinecap="round"/>
        ) : (
          <g style={getEyeStyle(37, 49, blinking)}>
            {/* sclera — nice big round white */}
            <circle cx="37" cy="49" r="10" fill="white"/>
            {/* limbal ring — thin dark edge for realism */}
            <circle cx="37" cy="49" r="10" fill="none" stroke="#ddd" strokeWidth="0.5"/>
            {/* iris */}
            <circle cx="37" cy="49.5" r="6.8" fill={`url(#${uid}-iris)`}/>
            {/* pupil */}
            <circle cx="37" cy="49.5" r="4.2" fill={`url(#${uid}-pupil)`}/>
            {/* primary shine — top right */}
            <circle cx="40.5" cy="46.5" r="2" fill="white" opacity="0.94"/>
            {/* secondary tiny shine — bottom left */}
            <circle cx="34.5" cy="52.5" r="0.9" fill="white" opacity="0.58"/>
          </g>
        )}

        {/* ══════════════ RIGHT EYE ══════════════ */}
        {isSleeping ? (
          <path d="M 53 48 Q 62 54 71 48"
            stroke="#8B5200" strokeWidth="3.2" fill="none" strokeLinecap="round"/>
        ) : (
          <g style={getEyeStyle(63, 49, blinking)}>
            <circle cx="63" cy="49" r="10" fill="white"/>
            <circle cx="63" cy="49" r="10" fill="none" stroke="#ddd" strokeWidth="0.5"/>
            <circle cx="63" cy="49.5" r="6.8" fill={`url(#${uid}-iris)`}/>
            <circle cx="63" cy="49.5" r="4.2" fill={`url(#${uid}-pupil)`}/>
            <circle cx="66.5" cy="46.5" r="2" fill="white" opacity="0.94"/>
            <circle cx="60.5" cy="52.5" r="0.9" fill="white" opacity="0.58"/>
          </g>
        )}

        {/* ══════════════ MOUTH ══════════════ */}
        {isSpeaking ? (
          /* Speaking: animated oval that opens/closes */
          <ellipse
            cx="50" cy="65"
            rx="5.5"
            ry={Math.max(1.5, mouthOpen * 0.75)}
            fill="#7A4000"
            style={{ transition: 'ry 0.06s ease' }}
          />
        ) : isSleeping ? (
          /* Sleeping: content small smile */
          <path d="M 43 69 Q 50 75 57 69"
            fill="none" stroke="#8B5200" strokeWidth="2.5" strokeLinecap="round"/>
        ) : state === 'sad' ? (
          <path d="M 42 71 Q 50 64 58 71"
            fill="none" stroke="#666" strokeWidth="2.2" strokeLinecap="round"/>
        ) : state === 'happy' ? (
          <>
            <path d="M 38 63 Q 50 79 62 63"
              fill="#CC4000" stroke="#CC4000" strokeWidth="0.5" strokeLinecap="round"/>
            <path d="M 39 64 Q 50 77 61 64 L 61 70 Q 50 79 39 70 Z"
              fill="white" opacity="0.9"/>
          </>
        ) : (
          /* Idle: gentle warm smile */
          <path d="M 41 64 Q 50 75 59 64"
            fill="none" stroke="#8B5200" strokeWidth="2.6" strokeLinecap="round"/>
        )}
      </svg>
    </div>
  )
}
