'use client'

interface CssArtProps {
  size?: number
  active?: boolean
}

/* ── Apple ── */
export function AppleArt({ size = 80, active }: CssArtProps) {
  const s = size
  return (
    <div className={active ? 'css-art-bounce' : 'css-art-float'} style={{ width: s, height: s, position: 'relative' }}>
      {/* Stem */}
      <div style={{
        position: 'absolute', left: '50%', top: '8%',
        width: s * 0.06, height: s * 0.15,
        background: '#8B4513', borderRadius: 2, transform: 'translateX(-50%)',
      }} />
      {/* Leaf */}
      <div style={{
        position: 'absolute', left: '53%', top: '5%',
        width: s * 0.22, height: s * 0.14,
        background: '#4CAF50', borderRadius: '50% 0 50% 0',
        transform: 'rotate(25deg)',
      }} />
      {/* Body */}
      <div style={{
        position: 'absolute', left: '10%', top: '20%',
        width: s * 0.8, height: s * 0.72,
        background: 'linear-gradient(135deg, #FF6B6B, #E53935)',
        borderRadius: '45% 45% 50% 50%',
        boxShadow: '3px 5px 12px rgba(229, 57, 53, 0.35)',
      }}>
        {/* Shine */}
        <div style={{
          position: 'absolute', left: '15%', top: '15%',
          width: s * 0.18, height: s * 0.22,
          background: 'rgba(255,255,255,0.35)',
          borderRadius: '50%',
          transform: 'rotate(-30deg)',
        }} />
      </div>
    </div>
  )
}

/* ── Ball (Basketball) ── */
export function BallArt({ size = 80, active }: CssArtProps) {
  const s = size
  return (
    <div className={active ? 'css-art-bounce' : 'css-art-pulse'} style={{ width: s, height: s, position: 'relative' }}>
      <div style={{
        width: s * 0.85, height: s * 0.85,
        margin: 'auto', marginTop: s * 0.075,
        background: 'linear-gradient(135deg, #FF9F43, #E67E22)',
        borderRadius: '50%',
        boxShadow: '3px 5px 12px rgba(230, 126, 34, 0.4)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Horizontal line */}
        <div style={{
          position: 'absolute', top: '48%', left: 0, right: 0,
          height: 2, background: 'rgba(0,0,0,0.2)',
        }} />
        {/* Vertical line */}
        <div style={{
          position: 'absolute', left: '48%', top: 0, bottom: 0,
          width: 2, background: 'rgba(0,0,0,0.2)',
        }} />
        {/* Curve left */}
        <div style={{
          position: 'absolute', left: '20%', top: '-10%',
          width: s * 0.4, height: s * 1.0,
          border: '2px solid rgba(0,0,0,0.15)',
          borderRadius: '50%',
          transform: 'rotate(30deg)',
        }} />
        {/* Curve right */}
        <div style={{
          position: 'absolute', right: '20%', top: '-10%',
          width: s * 0.4, height: s * 1.0,
          border: '2px solid rgba(0,0,0,0.15)',
          borderRadius: '50%',
          transform: 'rotate(-30deg)',
        }} />
        {/* Shine */}
        <div style={{
          position: 'absolute', left: '18%', top: '12%',
          width: s * 0.15, height: s * 0.2,
          background: 'rgba(255,255,255,0.3)',
          borderRadius: '50%',
        }} />
      </div>
    </div>
  )
}

/* ── Cat ── */
export function CatArt({ size = 80, active }: CssArtProps) {
  const s = size
  return (
    <div className={active ? 'css-art-bounce' : 'css-art-float'} style={{ width: s, height: s, position: 'relative' }}>
      {/* Left ear */}
      <div style={{
        position: 'absolute', left: '15%', top: '0',
        width: 0, height: 0,
        borderLeft: `${s * 0.12}px solid transparent`,
        borderRight: `${s * 0.12}px solid transparent`,
        borderBottom: `${s * 0.22}px solid #FECA57`,
        transform: 'rotate(-10deg)',
      }} />
      {/* Right ear */}
      <div style={{
        position: 'absolute', right: '15%', top: '0',
        width: 0, height: 0,
        borderLeft: `${s * 0.12}px solid transparent`,
        borderRight: `${s * 0.12}px solid transparent`,
        borderBottom: `${s * 0.22}px solid #FECA57`,
        transform: 'rotate(10deg)',
      }} />
      {/* Head */}
      <div style={{
        position: 'absolute', left: '10%', top: '15%',
        width: s * 0.8, height: s * 0.7,
        background: 'linear-gradient(135deg, #FECA57, #F39C12)',
        borderRadius: '50%',
        boxShadow: '2px 4px 10px rgba(243, 156, 18, 0.3)',
      }}>
        {/* Left eye */}
        <div style={{
          position: 'absolute', left: '22%', top: '35%',
          width: s * 0.1, height: s * 0.1,
          background: '#333', borderRadius: '50%',
        }} />
        {/* Right eye */}
        <div style={{
          position: 'absolute', right: '22%', top: '35%',
          width: s * 0.1, height: s * 0.1,
          background: '#333', borderRadius: '50%',
        }} />
        {/* Nose */}
        <div style={{
          position: 'absolute', left: '50%', top: '55%',
          width: s * 0.08, height: s * 0.06,
          background: '#FF6B6B', borderRadius: '0 0 50% 50%',
          transform: 'translateX(-50%)',
        }} />
        {/* Whiskers left */}
        <div style={{
          position: 'absolute', left: '5%', top: '55%',
          width: s * 0.25, height: 1.5,
          background: '#333',
        }} />
        <div style={{
          position: 'absolute', left: '5%', top: '62%',
          width: s * 0.25, height: 1.5,
          background: '#333',
        }} />
        {/* Whiskers right */}
        <div style={{
          position: 'absolute', right: '5%', top: '55%',
          width: s * 0.25, height: 1.5,
          background: '#333',
        }} />
        <div style={{
          position: 'absolute', right: '5%', top: '62%',
          width: s * 0.25, height: 1.5,
          background: '#333',
        }} />
        {/* Mouth */}
        <div style={{
          position: 'absolute', left: '50%', top: '64%',
          width: s * 0.12, height: s * 0.06,
          borderBottom: '2px solid #333',
          borderRadius: '0 0 50% 50%',
          transform: 'translateX(-50%)',
        }} />
      </div>
    </div>
  )
}

/* ── Dog ── */
export function DogArt({ size = 80, active }: CssArtProps) {
  const s = size
  return (
    <div className={active ? 'css-art-bounce' : 'css-art-float'} style={{ width: s, height: s, position: 'relative' }}>
      {/* Left floppy ear */}
      <div style={{
        position: 'absolute', left: '5%', top: '18%',
        width: s * 0.25, height: s * 0.35,
        background: '#8B5E3C',
        borderRadius: '50% 50% 60% 40%',
        transform: 'rotate(-15deg)',
      }} />
      {/* Right floppy ear */}
      <div style={{
        position: 'absolute', right: '5%', top: '18%',
        width: s * 0.25, height: s * 0.35,
        background: '#8B5E3C',
        borderRadius: '50% 50% 40% 60%',
        transform: 'rotate(15deg)',
      }} />
      {/* Head */}
      <div style={{
        position: 'absolute', left: '12%', top: '12%',
        width: s * 0.76, height: s * 0.68,
        background: 'linear-gradient(135deg, #D4A76A, #B8860B)',
        borderRadius: '50% 50% 45% 45%',
        boxShadow: '2px 4px 10px rgba(184, 134, 11, 0.3)',
        zIndex: 1,
      }}>
        {/* Eyes */}
        <div style={{
          position: 'absolute', left: '25%', top: '38%',
          width: s * 0.09, height: s * 0.09,
          background: '#333', borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute', right: '25%', top: '38%',
          width: s * 0.09, height: s * 0.09,
          background: '#333', borderRadius: '50%',
        }} />
        {/* Snout */}
        <div style={{
          position: 'absolute', left: '50%', top: '52%',
          width: s * 0.35, height: s * 0.25,
          background: '#E8C98E',
          borderRadius: '50%',
          transform: 'translateX(-50%)',
        }}>
          {/* Nose */}
          <div style={{
            position: 'absolute', left: '50%', top: '15%',
            width: s * 0.12, height: s * 0.09,
            background: '#333',
            borderRadius: '50% 50% 40% 40%',
            transform: 'translateX(-50%)',
          }} />
        </div>
        {/* Tongue */}
        <div style={{
          position: 'absolute', left: '50%', bottom: '5%',
          width: s * 0.1, height: s * 0.1,
          background: '#FF6B6B',
          borderRadius: '0 0 50% 50%',
          transform: 'translateX(-50%)',
        }} />
      </div>
    </div>
  )
}

/* ── Fish ── */
export function FishArt({ size = 80, active }: CssArtProps) {
  const s = size
  return (
    <div className={active ? 'css-art-bounce' : 'css-art-float'} style={{ width: s, height: s, position: 'relative' }}>
      {/* Tail */}
      <div style={{
        position: 'absolute', left: '2%', top: '25%',
        width: 0, height: 0,
        borderTop: `${s * 0.2}px solid transparent`,
        borderBottom: `${s * 0.2}px solid transparent`,
        borderRight: `${s * 0.25}px solid #4D96FF`,
      }} />
      {/* Body */}
      <div style={{
        position: 'absolute', left: '18%', top: '15%',
        width: s * 0.7, height: s * 0.6,
        background: 'linear-gradient(135deg, #4D96FF, #2980B9)',
        borderRadius: '50% 40% 40% 50%',
        boxShadow: '2px 4px 10px rgba(41, 128, 185, 0.3)',
      }}>
        {/* Eye */}
        <div style={{
          position: 'absolute', right: '20%', top: '30%',
          width: s * 0.12, height: s * 0.12,
          background: 'white', borderRadius: '50%',
        }}>
          <div style={{
            position: 'absolute', right: '20%', top: '30%',
            width: s * 0.06, height: s * 0.06,
            background: '#333', borderRadius: '50%',
          }} />
        </div>
        {/* Fin */}
        <div style={{
          position: 'absolute', left: '30%', bottom: '-10%',
          width: s * 0.2, height: s * 0.15,
          background: '#3498DB',
          borderRadius: '0 0 50% 50%',
          transform: 'rotate(10deg)',
        }} />
      </div>
    </div>
  )
}

/* ── Sun ── */
export function SunArt({ size = 80, active }: CssArtProps) {
  const s = size
  const rayCount = 8
  return (
    <div className={active ? 'css-art-bounce' : 'css-art-pulse'} style={{ width: s, height: s, position: 'relative' }}>
      {/* Rays */}
      {Array.from({ length: rayCount }).map((_, i) => (
        <div key={i} style={{
          position: 'absolute', left: '50%', top: '50%',
          width: 3, height: s * 0.38,
          background: '#FFD700',
          borderRadius: 2,
          transform: `translate(-50%, -50%) rotate(${(360 / rayCount) * i}deg) translateY(-${s * 0.13}px)`,
          transformOrigin: 'center center',
        }} />
      ))}
      {/* Center circle */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        width: s * 0.5, height: s * 0.5,
        background: 'linear-gradient(135deg, #FECA57, #F39C12)',
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        boxShadow: '0 0 15px rgba(254, 202, 87, 0.5)',
      }}>
        {/* Happy face */}
        <div style={{
          position: 'absolute', left: '25%', top: '35%',
          width: s * 0.06, height: s * 0.06,
          background: '#333', borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute', right: '25%', top: '35%',
          width: s * 0.06, height: s * 0.06,
          background: '#333', borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute', left: '50%', top: '55%',
          width: s * 0.2, height: s * 0.1,
          borderBottom: '2px solid #333',
          borderRadius: '0 0 50% 50%',
          transform: 'translateX(-50%)',
        }} />
      </div>
    </div>
  )
}

/* ── Star ── */
export function StarArt({ size = 80, active }: CssArtProps) {
  const s = size
  return (
    <div className={active ? 'css-art-bounce' : 'css-art-pulse'} style={{ width: s, height: s, position: 'relative' }}>
      <div style={{
        width: s * 0.8, height: s * 0.8,
        margin: 'auto', marginTop: s * 0.1,
        background: 'linear-gradient(135deg, #FECA57, #FF9F43)',
        clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
        boxShadow: '2px 4px 12px rgba(255, 159, 67, 0.4)',
        filter: 'drop-shadow(2px 4px 8px rgba(254, 202, 87, 0.4))',
      }} />
    </div>
  )
}

/* ── Emoji fallback for items without CSS art ── */
export function EmojiFallback({ emoji, active }: { emoji: string; active?: boolean }) {
  return (
    <span
      className={active ? 'css-art-bounce' : 'css-art-float'}
      style={{
        display: 'inline-block',
        fontSize: 64,
        lineHeight: 1,
        filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.2))',
      }}
    >
      {emoji}
    </span>
  )
}

/* ── Map of which letters have CSS art ── */
const CSS_ART_MAP: Record<string, React.ComponentType<CssArtProps>> = {
  'A': AppleArt,
  'B': BallArt,
  'C': CatArt,
  'D': DogArt,
  'F': FishArt,
}

const NUMBER_ART_MAP: Record<number, React.ComponentType<CssArtProps>> = {
  1: SunArt,
  2: StarArt,
}

export function getLetterArt(letter: string): React.ComponentType<CssArtProps> | null {
  return CSS_ART_MAP[letter.toUpperCase()] ?? null
}

export function getNumberArt(num: number): React.ComponentType<CssArtProps> | null {
  return NUMBER_ART_MAP[num] ?? null
}
