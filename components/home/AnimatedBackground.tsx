'use client'
import { useEffect, useMemo, useState, memo } from 'react'
import { useApp } from '@/components/providers/AppProvider'
import { useSound } from '@/components/providers/SoundProvider'
import { useDayNightCycle } from '@/hooks/useDayNightCycle'
import Sun from './Sun'
import Moon from './Moon'
import FloatingStars from './FloatingStars'

type WorldMode = 'summer' | 'monsoon' | 'winter' | 'night' | 'rainbow'

function AnimatedBackground() {
  const { setPoppy } = useApp()
  const { setMood } = useSound()
  const { phase, sunPosition, moonPosition, isNight, skyColors, toggleManual, progress } = useDayNightCycle()
  const [showPlane, setShowPlane] = useState(false)

  const worldMode: WorldMode = useMemo(() => {
    if (isNight) return 'night'
    if (progress < 0.18) return 'summer'
    if (progress < 0.34) return 'monsoon'
    if (progress < 0.5) return 'rainbow'
    if (progress < 0.62) return 'winter'
    return 'summer'
  }, [progress, isNight])

  useEffect(() => {
    document.body.dataset.worldMode = worldMode
    window.dispatchEvent(new CustomEvent('world-mode-change', { detail: worldMode }))
  }, [worldMode])

  useEffect(() => {
    const t = setInterval(() => { setShowPlane(true); setTimeout(() => setShowPlane(false), 10000) }, 90000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (isNight) { setPoppy('sleeping'); setMood('dreamy') } else { setPoppy('idle'); setMood('default') }
  }, [isNight, setPoppy, setMood])

  const isMonsoon = worldMode === 'monsoon'
  const isWinter = worldMode === 'winter'
  const isRainbow = worldMode === 'rainbow'

  return <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none" aria-hidden="true">
    <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${skyColors[0]}, ${skyColors[1]}, ${skyColors[2]})` }} />
    <div className="absolute inset-0" style={{ background: isWinter ? 'radial-gradient(circle at 80% 10%, rgba(255,255,255,0.25), transparent 40%)' : 'none' }} />

    <FloatingStars isVisible={isNight} />
    <Sun position={sunPosition} phase={phase} onClickManualToggle={() => toggleManual('day')} />
    <Moon position={moonPosition} onClickManualToggle={() => toggleManual('night')} />

    {isMonsoon && <div className="absolute inset-0 opacity-60">{[...Array(20)].map((_, i) => <div key={i} className="absolute bg-blue-300 rounded-full" style={{ left: `${(i * 5) % 100}%`, width: 2, height: 18, animation: `rain-fall ${0.55 + (i % 4) * 0.11}s linear infinite` }} />)}</div>}
    {isWinter && <div className="absolute inset-0 opacity-80">{[...Array(14)].map((_, i) => <div key={i} className="absolute text-white" style={{ left: `${(i * 9) % 100}%`, top: `${(i * 17) % 80}%`, animation: `snow-fall ${6 + (i % 5)}s linear infinite` }}>❄️</div>)}</div>}
    {isRainbow && <div className="absolute top-[8%] left-[12%] w-[76%] h-[50%] opacity-40"><svg viewBox="0 0 800 400" className="w-full h-full"><path d="M70 390 A330 330 0 01 730 390" stroke="#ef4444" strokeWidth="18" fill="none" /><path d="M100 390 A300 300 0 01 700 390" stroke="#fbbf24" strokeWidth="18" fill="none" /><path d="M130 390 A270 270 0 01 670 390" stroke="#4ade80" strokeWidth="18" fill="none" /><path d="M160 390 A240 240 0 01 640 390" stroke="#60a5fa" strokeWidth="18" fill="none" /></svg></div>}

    <div className="absolute top-[6%] z-[1]" style={{ opacity: showPlane && !isNight ? 0.85 : 0, animation: showPlane ? 'plane-fly 20s linear forwards' : 'none' }}>✈️</div>
    <div className="absolute bottom-4 left-4 z-50 pointer-events-auto flex gap-2 bg-black/20 p-1.5 rounded-full">
      <button onClick={() => toggleManual('day')} className="w-10 h-10 rounded-full bg-yellow-300">☀️</button>
      <button onClick={() => toggleManual('night')} className="w-10 h-10 rounded-full bg-indigo-400">🌙</button>
    </div>
    <div className="absolute top-3 left-1/2 -translate-x-1/2 rounded-full bg-white/35 px-4 py-1 text-xs font-bold text-white shadow">{worldMode.toUpperCase()} magical world</div>

    <style dangerouslySetInnerHTML={{ __html: `
      @keyframes rain-fall{0%{transform:translateY(-80px);opacity:0}15%{opacity:1}100%{transform:translateY(110vh);opacity:0}}
      @keyframes plane-fly{0%{transform:translateX(-140px)}100%{transform:translateX(calc(100vw + 160px))}}
      @keyframes snow-fall{0%{transform:translateY(-10vh) translateX(0)}100%{transform:translateY(100vh) translateX(30px)}}
    `}} />
  </div>
}

export default memo(AnimatedBackground)
