'use client'
import { useEffect, useState, memo } from 'react'
import { useApp } from '@/components/providers/AppProvider'
import { useSound } from '@/components/providers/SoundProvider'
import { useDayNightCycle } from '@/hooks/useDayNightCycle'
import Sun from './Sun'
import Moon from './Moon'
import FloatingStars from './FloatingStars'

function AnimatedBackground() {
  const { setPoppy } = useApp()
  const { setMood } = useSound()
  const { phase, sunPosition, moonPosition, isNight, skyColors, toggleManual, progress } = useDayNightCycle()
  const [isRaining, setIsRaining] = useState(false)
  const [showRainbow, setShowRainbow] = useState(false)
  const [showFrogs, setShowFrogs] = useState(false)
  const [showPlane, setShowPlane] = useState(false)

  // Rain→Rainbow→Frogs cycle every ~2min during day
  useEffect(() => {
    if (isNight) return
    const delay = 20000 + Math.random() * 15000
    const t = setTimeout(() => {
      if (document.visibilityState !== 'visible') return
      setIsRaining(true); setShowFrogs(true)
      setTimeout(() => {
        setIsRaining(false)
        setTimeout(() => { setShowRainbow(true); setTimeout(() => { setShowRainbow(false); setShowFrogs(false) }, 12000) }, 1500)
      }, 8000)
    }, delay)
    return () => clearTimeout(t)
  }, [isNight, showRainbow])

  // Airplane every ~2min
  useEffect(() => {
    const t = setInterval(() => { setShowPlane(true); setTimeout(() => setShowPlane(false), 10000) }, 90000 + Math.random() * 30000)
    setTimeout(() => { setShowPlane(true); setTimeout(() => setShowPlane(false), 10000) }, 15000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => { if (isNight) { setIsRaining(false); setShowRainbow(false); setShowFrogs(false) } }, [isNight])
  useEffect(() => { if (isNight) { setPoppy('sleeping'); setMood('dreamy') } else { setPoppy('idle'); setMood('default') } }, [isNight, setPoppy, setMood])

  const isSunset = phase === 'sunset'
  const isDayPhase = phase === 'day'
  const cc = isRaining ? '#9CA3AF' : 'white'

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, var(--sky-top, ${skyColors[0]}), var(--sky-mid, ${skyColors[1]}), var(--sky-bot, ${skyColors[2]}))` }} />

      {/* ⭐ Night Stars */}
      <div className="absolute inset-0 z-[0]" style={{ opacity: isNight ? 1 : 0, transition: 'opacity 3s' }}>
        {[...Array(25)].map((_, i) => (
          <div key={`s${i}`} className="absolute bg-white rounded-full" style={{
            width: `${2 + (i % 3)}px`, height: `${2 + (i % 3)}px`,
            left: `${(i * 17 + 5) % 95}%`, top: `${(i * 11 + 3) % 45}%`,
            animation: `star-twinkle ${2 + (i % 3)}s ease-in-out infinite ${(i * 0.4) % 3}s`
          }} />
        ))}
      </div>

      {/* 🌧️ Rain (thicker, more visible drops) */}
      <div className="absolute inset-0 overflow-hidden z-[1]" style={{ opacity: isRaining ? 0.6 : 0, transition: 'opacity 1.5s' }}>
        {[...Array(18)].map((_, i) => (
          <div key={`r${i}`} className="absolute rounded-full"
            style={{
              left: `${(i * 6) % 98}%`,
              width: i % 3 === 0 ? '3px' : '2px',
              height: i % 3 === 0 ? '28px' : '22px',
              background: 'linear-gradient(to bottom, transparent, #60A5FA, #3B82F6)',
              animation: `rain-fall ${0.5 + (i % 4) * 0.1}s linear infinite ${(i * 0.12) % 1}s`
            }} />
        ))}
      </div>

      {/* 🌈 Rainbow (soft, blends into bg) */}
      <div className="absolute top-[5%] left-[10%] w-[80%] h-[55%] z-[0]" style={{ opacity: showRainbow ? 0.35 : 0, transition: 'opacity 5s ease-in-out' }}>
        <svg viewBox="0 0 800 400" className="w-full h-full" fill="none">
          <path d="M50 400 A350 350 0 01 750 400" stroke="#EF4444" strokeWidth="22" strokeLinecap="round" opacity=".4" />
          <path d="M85 400 A315 315 0 01 715 400" stroke="#FB923C" strokeWidth="22" strokeLinecap="round" opacity=".4" />
          <path d="M120 400 A280 280 0 01 680 400" stroke="#FBBF24" strokeWidth="22" strokeLinecap="round" opacity=".4" />
          <path d="M155 400 A245 245 0 01 645 400" stroke="#4ADE80" strokeWidth="22" strokeLinecap="round" opacity=".4" />
          <path d="M190 400 A210 210 0 01 610 400" stroke="#60A5FA" strokeWidth="22" strokeLinecap="round" opacity=".4" />
          <path d="M225 400 A175 175 0 01 575 400" stroke="#818CF8" strokeWidth="22" strokeLinecap="round" opacity=".4" />
          <path d="M260 400 A140 140 0 01 540 400" stroke="#C084FC" strokeWidth="22" strokeLinecap="round" opacity=".35" />
        </svg>
      </div>

      <FloatingStars isVisible={isNight || isSunset} />
      <Sun position={sunPosition} phase={phase} onClickManualToggle={() => toggleManual('day')} />
      <Moon position={moonPosition} onClickManualToggle={() => toggleManual('night')} />

      {/* ✈️ Airplane (bigger, slower) */}
      <div className="absolute top-[6%] z-[1]" style={{ opacity: showPlane ? 0.85 : 0, transition: 'opacity 1.5s', animation: showPlane ? 'plane-fly 20s linear forwards' : 'none' }}>
        <svg viewBox="0 0 100 35" className="w-[100px] h-auto">
          <path d="M5 18 L30 18 L42 6 L48 18 L85 18 L92 14 L85 22 L48 22 L42 30 L30 22 L5 22 Z" fill={isNight ? '#94A3B8' : 'white'} />
          <line x1="38" y1="18" x2="38" y2="22" stroke="#CBD5E1" strokeWidth="1.5" />
          <circle cx="88" cy="18" r="2.5" fill="#94A3B8" />
          {/* Contrail */}
          <line x1="0" y1="20" x2="5" y2="20" stroke="white" strokeWidth="1" opacity="0.4" />
        </svg>
      </div>

      {/* 🌸 Floating Flower Petals (random drift across screen) */}
      <div className="absolute inset-0 overflow-hidden z-[1] pointer-events-none" style={{ opacity: isDayPhase ? 0.7 : 0, transition: 'opacity 3s' }}>
        {[0,1,2,3,4].map(i => (
          <div key={`petal-${i}`} className="absolute" style={{
            left: `${(i * 22 + 5) % 100}%`, top: '-20px',
            animation: `petal-fall ${12 + i * 3}s linear infinite ${i * 4}s`,
          }}>
            <svg viewBox="0 0 16 16" className="w-[14px] h-[14px]" style={{ animation: `petal-spin ${3 + i}s linear infinite` }}>
              <ellipse cx="8" cy="8" rx="6" ry="3" fill={['#F472B6','#FBBF24','#A855F7','#FB923C','#F43F5E'][i]} opacity="0.7" />
            </svg>
          </div>
        ))}
      </div>

      {/* Clouds */}
      <div className="absolute top-0 left-0 w-full h-[50%] z-[1]" style={{ opacity: isNight ? 0.15 : 0.85, transition: 'opacity 3s' }}>
        {[[10, 10, 60], [20, 20, 45], [5, 30, 30]].map(([top, left, dur], ci) => (
          <div key={ci} style={{ position: 'absolute', top: `${top}%`, left: `-${left}%`, animation: `slide-right ${dur}s linear infinite`, willChange: 'transform' }}>
            <div style={{ width: ci === 2 ? 192 : ci === 0 ? 160 : 128, height: ci === 2 ? 96 : ci === 0 ? 80 : 64, backgroundColor: cc, borderRadius: 9999, opacity: 0.8, transition: 'background-color 2s', position: 'relative' }}>
              <div style={{ position: 'absolute', top: -24, left: 24, width: 80, height: 80, backgroundColor: cc, borderRadius: 9999, transition: 'background-color 2s' }} />
              <div style={{ position: 'absolute', top: -16, right: 24, width: 64, height: 64, backgroundColor: cc, borderRadius: 9999, transition: 'background-color 2s' }} />
            </div>
          </div>
        ))}
      </div>

      {/* Birds (hide in rain) */}
      <div className="absolute top-[15%] left-0 w-[150%] will-change-transform animate-[slide-right_35s_linear_infinite] z-[1]"
        style={{ opacity: (isDayPhase && !isRaining) ? 0.7 : 0, transition: 'opacity 2s' }}>
        <svg viewBox="0 0 400 100" className="w-[120px]" fill="none" stroke="#4B5563" strokeWidth="4" strokeLinecap="round">
          <g className="animate-[bird-flap_0.8s_ease-in-out_infinite_alternate]">
            <path d="M10 25 Q25 5 40 25 Q55 5 70 25" /><path d="M60 45 Q75 25 90 45 Q105 25 120 45" />
          </g>
        </svg>
      </div>

      {/* ⛰️ Mountains (smaller, more natural, merging with ground) */}
      <div className="absolute bottom-0 left-0 right-0 h-[38vh] z-[1]">
        <svg viewBox="0 0 1200 250" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="mtn1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isNight ? '#1a1a3e' : '#7986CB'} /><stop offset="100%" stopColor={isNight ? '#111130' : '#5C6BC0'} />
            </linearGradient>
            <linearGradient id="mtn2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isNight ? '#151535' : '#5C6BC0'} /><stop offset="100%" stopColor={isNight ? '#0e0e28' : '#3F51B5'} />
            </linearGradient>
          </defs>
          <path d="M-80 250 L100 80 L280 250 Z" fill="url(#mtn1)" />
          <path d="M250 250 L450 50 L650 250 Z" fill="url(#mtn2)" />
          <path d="M550 250 L750 70 L950 250 Z" fill="url(#mtn1)" />
          <path d="M850 250 L1050 55 L1250 250 Z" fill="url(#mtn2)" />
          {/* Snow caps */}
          <path d="M425 65 L450 50 L475 65 Q450 73 425 65 Z" fill="white" opacity={isNight ? 0.25 : 0.8} />
          <path d="M1025 70 L1050 55 L1075 70 Q1050 78 1025 70 Z" fill="white" opacity={isNight ? 0.25 : 0.8} />
        </svg>
      </div>

      {/* Back Hills (textured) */}
      <div className="absolute bottom-0 left-0 right-0 h-[28vh] w-full z-[2]">
        <svg viewBox="0 0 1000 200" className="w-full h-full" preserveAspectRatio="none">
          <path d="M0 100 Q250 -20 500 100 T1000 100 V200 H0 Z" fill="var(--ground-color)" style={{ transition: 'fill 1s' }} />
          {/* Texture stripes */}
          <path d="M0 120 Q250 50 500 120 T1000 120" stroke={isNight ? '#ffffff06' : '#00000008'} strokeWidth="40" fill="none" />
          <g fill="var(--tree-color)" style={{ transition: 'fill 1s' }}>
            <path d="M120 80 L110 110 L130 110 Z" /><rect x="117" y="110" width="6" height="8" fill="#5D4037" />
            <path d="M280 30 L270 60 L290 60 Z" /><rect x="277" y="60" width="6" height="8" fill="#5D4037" />
            <path d="M440 85 L430 115 L450 115 Z" /><rect x="437" y="115" width="6" height="8" fill="#5D4037" />
            <path d="M600 50 L590 80 L610 80 Z" /><rect x="597" y="80" width="6" height="8" fill="#5D4037" />
          </g>
          <g stroke="var(--tree-color)" strokeWidth="2" fill="none"><path d="M50 100 Q55 85 60 100" /><path d="M200 95 Q205 80 210 95" /><path d="M350 100 Q355 85 360 100" /><path d="M700 95 Q705 80 710 95" /><path d="M850 100 Q855 85 860 100" /></g>
          <circle cx="180" cy="98" r="3" fill="#F472B6" /><circle cx="180" cy="98" r="1.5" fill="#FBBF24" />
          <circle cx="520" cy="95" r="3" fill="#A855F7" /><circle cx="520" cy="95" r="1.5" fill="white" />
          <circle cx="780" cy="100" r="3" fill="#EF4444" /><circle cx="780" cy="100" r="1.5" fill="#FBBF24" />
        </svg>
      </div>

      {/* 🐄 Cow (left) */}
      <div className="absolute bottom-[18%] left-[8%] w-[11vw] max-w-[65px] z-[3] animate-[graze_5s_ease-in-out_infinite]">
        <svg viewBox="0 0 80 60"><rect x="20" y="20" width="40" height="25" rx="8" fill="white" /><rect x="20" y="20" width="15" height="10" rx="4" fill="#1F2937" /><circle cx="15" cy="18" r="10" fill="white" /><circle cx="12" cy="15" r="1.5" fill="#1F2937" /><path d="M10 22 Q15 25 18 22" stroke="#F472B6" strokeWidth="1.5" fill="none" /><rect x="8" y="8" width="3" height="8" rx="1" fill="white" /><rect x="18" y="8" width="3" height="8" rx="1" fill="white" /><rect x="22" y="44" width="4" height="10" rx="1" fill="#D4D4D4" /><rect x="35" y="44" width="4" height="10" rx="1" fill="#D4D4D4" /><rect x="45" y="44" width="4" height="10" rx="1" fill="#D4D4D4" /><rect x="54" y="44" width="4" height="10" rx="1" fill="#D4D4D4" /><path d="M58 30 Q68 25 62 35" stroke="#D4D4D4" strokeWidth="2" fill="none" /></svg>
      </div>

      {/* 🐻 Bear */}
      <div className="absolute bottom-[20%] left-[38%] w-[12vw] max-w-[65px] opacity-90 z-[2]">
        <svg viewBox="0 0 100 100"><path d="M20 70 Q50 30 80 70 Z" fill="#92400E" /><circle cx="30" cy="50" r="10" fill="#92400E" /><circle cx="70" cy="50" r="10" fill="#92400E" /><circle cx="50" cy="65" r="15" fill="#D97706" /><path d="M45 60 Q50 65 55 60" stroke="#4B5563" strokeWidth="2" fill="none" /><circle cx="42" cy="55" r="2" fill="#4B5563" /><circle cx="58" cy="55" r="2" fill="#4B5563" /></svg>
      </div>

      {/* 🌍 UNIFIED FRONT GROUND + LAKE (single full-width SVG, no gaps) */}
      <div className="absolute bottom-0 left-0 right-0 h-[22vh] w-full z-[3]">
        <svg viewBox="0 0 1000 200" className="w-full h-full" preserveAspectRatio="none">
          {/* Ground - continuous, dips down on right for lake */}
          <path d="M0 140 Q150 30 350 130 Q500 60 650 120 Q700 135 720 145 Q750 160 780 155 Q850 140 900 150 Q950 155 1000 145 V200 H0 Z" fill="var(--ground-color)" style={{ transition: 'fill 1s' }} />
          {/* Texture stripe */}
          <path d="M0 155 Q200 90 400 150 Q550 100 700 145 Q850 155 1000 155" stroke={isNight ? '#ffffff06' : '#00000008'} strokeWidth="25" fill="none" />
          {/* Lake water (embedded in ground) */}
          <ellipse cx="820" cy="165" rx="130" ry="35" fill={isNight ? '#0D2B5E' : '#4FC3F7'} style={{ transition: 'fill 2s' }} />
          <ellipse cx="820" cy="160" rx="100" ry="22" fill={isNight ? '#1A3D7E' : '#81D4FA'} opacity="0.4" />
          {/* Ripples */}
          <path d="M760 160 Q790 155 820 160" stroke="white" strokeWidth="1" fill="none" opacity="0.3" />
          <path d="M830 168 Q860 163 890 168" stroke="white" strokeWidth="1" fill="none" opacity="0.3" />
          {/* Reeds by lake */}
          <line x1="710" y1="148" x2="710" y2="130" stroke="#388E3C" strokeWidth="2" /><ellipse cx="710" cy="128" rx="3" ry="5" fill="#6D4C41" />
          <line x1="935" y1="152" x2="935" y2="134" stroke="#388E3C" strokeWidth="2" /><ellipse cx="935" cy="132" rx="3" ry="5" fill="#6D4C41" />
          {/* Trees on front hill */}
          <g fill="var(--tree-color)" style={{ transition: 'fill 1s' }}>
            <path d="M60 125 L45 165 L75 165 Z" /><rect x="56" y="165" width="8" height="10" fill="#4E342E" />
            <path d="M250 80 L235 120 L265 120 Z" /><rect x="246" y="120" width="8" height="10" fill="#4E342E" />
            <path d="M450 100 L435 140 L465 140 Z" /><rect x="446" y="140" width="8" height="10" fill="#4E342E" />
            <path d="M600 110 L585 150 L615 150 Z" /><rect x="596" y="150" width="8" height="10" fill="#4E342E" />
          </g>
          {/* Grass tufts */}
          <g stroke="var(--tree-color)" strokeWidth="2" fill="none"><path d="M120 132 Q125 117 130 132" /><path d="M350 120 Q355 105 360 120" /><path d="M530 108 Q535 93 540 108" /><path d="M670 128 Q675 113 680 128" /></g>
          {/* Flowers */}
          <circle cx="180" cy="130" r="4" fill="#FBBF24" /><circle cx="180" cy="130" r="2" fill="white" />
          <circle cx="400" cy="115" r="4" fill="#F472B6" /><circle cx="400" cy="115" r="2" fill="#FBBF24" />
          <circle cx="580" cy="112" r="3" fill="#A855F7" /><circle cx="580" cy="112" r="1.5" fill="white" />
        </svg>
      </div>

      {/* 🦆 Duck on lake */}
      <div className="absolute bottom-[4%] right-[12%] w-[7vw] max-w-[40px] z-[4] animate-[duck-bob_3s_ease-in-out_infinite]">
        <svg viewBox="0 0 60 50"><ellipse cx="30" cy="35" rx="16" ry="10" fill="#FDD835" /><circle cx="42" cy="22" r="8" fill="#FDD835" /><path d="M49 22 L58 19 L49 25 Z" fill="#FF8F00" /><circle cx="44" cy="20" r="1.5" fill="#1F2937" /></svg>
      </div>

      {/* 🐸 Frog (near lake, appears during rain) */}
      <div style={{ opacity: showFrogs ? 1 : 0, transition: 'opacity 2s' }}>
        <div className="absolute bottom-[7%] right-[28%] w-[8vw] max-w-[40px] z-[5] animate-[frog-jump_2s_ease-in-out_infinite]">
          <svg viewBox="0 0 50 40"><ellipse cx="25" cy="30" rx="18" ry="12" fill="#4CAF50" /><circle cx="15" cy="18" r="6" fill="#4CAF50" /><circle cx="35" cy="18" r="6" fill="#4CAF50" /><circle cx="15" cy="16" r="3" fill="white" /><circle cx="35" cy="16" r="3" fill="white" /><circle cx="15" cy="16" r="1.5" fill="#1F2937" /><circle cx="35" cy="16" r="1.5" fill="#1F2937" /><path d="M20 32 Q25 36 30 32" stroke="#2E7D32" strokeWidth="1.5" fill="none" /></svg>
        </div>
      </div>

      {/* 🐰 Bunny (right side of left hill) */}
      <div className="absolute bottom-[12%] left-[28%] w-[10vw] max-w-[50px] animate-[peek_4s_infinite] z-[4]">
        <svg viewBox="0 0 100 100"><path d="M30 40 Q50 10 70 40" fill="#FFF" /><path d="M35 40 Q40 20 45 40" fill="#F472B6" /><path d="M55 40 Q60 20 65 40" fill="#F472B6" /><circle cx="50" cy="65" r="25" fill="#FFF" /><circle cx="40" cy="60" r="3" fill="#1F2937" /><circle cx="60" cy="60" r="3" fill="#1F2937" /><path d="M48 68 Q50 72 52 68" stroke="#1F2937" strokeWidth="2" fill="none" /><circle cx="50" cy="65" r="2" fill="#F472B6" /></svg>
      </div>

      {/* 🦋 Butterfly (day only) */}
      <div className="absolute top-[45%] left-[55%] z-[4] animate-[butterfly_8s_ease-in-out_infinite]" style={{ opacity: isDayPhase ? 0.8 : 0, transition: 'opacity 2s' }}>
        <svg viewBox="0 0 30 20" className="w-[28px]"><g className="animate-[wing-flap_0.4s_ease-in-out_infinite_alternate]"><ellipse cx="10" cy="10" rx="8" ry="6" fill="#A855F7" opacity=".8" /><ellipse cx="20" cy="10" rx="8" ry="6" fill="#E879F9" opacity=".8" /></g><rect x="14" y="4" width="2" height="14" rx="1" fill="#4B5563" /></svg>
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 left-4 z-50 pointer-events-auto flex items-center gap-2 bg-black/10 backdrop-blur-md p-1.5 rounded-full shadow-md border border-white/20">
        <button onClick={() => toggleManual('day')} className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95 ${!isNight && !isSunset ? 'bg-yellow-400 shadow-[0_0_15px_#FDE047]' : 'bg-white/30'}`}><span className="text-xl">☀️</span></button>
        <button onClick={() => toggleManual('night')} className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95 ${isNight ? 'bg-indigo-500 shadow-[0_0_15px_#818CF8]' : 'bg-white/30'}`}><span className="text-xl">🌙</span></button>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slide-right{from{transform:translateX(0)}to{transform:translateX(calc(100vw + 200px))}}
        @keyframes bird-flap{from{transform:translateY(-3px) rotate(-3deg)}to{transform:translateY(3px) rotate(3deg)}}
        @keyframes peek{0%,100%{transform:translateY(20px)}50%{transform:translateY(0)}}
        @keyframes rain-fall{0%{transform:translateY(-80px);opacity:0}15%{opacity:1}85%{opacity:1}100%{transform:translateY(100vh);opacity:0}}
        @keyframes duck-bob{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-4px) rotate(3deg)}}
        @keyframes graze{0%,100%{transform:rotate(0)}30%{transform:rotate(5deg)}60%{transform:rotate(-3deg)}}
        @keyframes butterfly{0%{transform:translate(0,0)}25%{transform:translate(40px,-20px)}50%{transform:translate(-20px,-30px)}75%{transform:translate(30px,10px)}100%{transform:translate(0,0)}}
        @keyframes wing-flap{from{transform:scaleY(1)}to{transform:scaleY(0.3)}}
        @keyframes frog-jump{0%,100%{transform:translateY(0) scaleY(1)}20%{transform:translateY(0) scaleY(0.7)}40%{transform:translateY(-25px) scaleY(1.1)}60%{transform:translateY(0) scaleY(0.8)}80%{transform:translateY(0) scaleY(1)}}
        @keyframes plane-fly{0%{transform:translateX(-150px)}100%{transform:translateX(calc(100vw + 250px))}}
        @keyframes star-twinkle{0%,100%{opacity:0.2;transform:scale(0.8)}50%{opacity:1;transform:scale(1.3)}}
        @keyframes petal-fall{0%{transform:translateY(-20px) translateX(0)}25%{transform:translateY(25vh) translateX(30px)}50%{transform:translateY(50vh) translateX(-20px)}75%{transform:translateY(75vh) translateX(25px)}100%{transform:translateY(110vh) translateX(-10px)}}
        @keyframes petal-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      `}} />
    </div>
  )
}
export default memo(AnimatedBackground)
