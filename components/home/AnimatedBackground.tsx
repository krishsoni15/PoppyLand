'use client'
import { useEffect, useState, memo, useRef } from 'react'
import { useApp } from '@/components/providers/AppProvider'
import { useSound } from '@/components/providers/SoundProvider'
import { useDayNightCycle } from '@/hooks/useDayNightCycle'
import { setEnvironmentWeather } from '@/lib/sounds'
import Sun from './Sun'
import Moon from './Moon'
import FloatingStars from './FloatingStars'

function AnimatedBackground() {
  const { setPoppy } = useApp()
  const { setMood } = useSound()
  const { phase, sunPosition, moonPosition, isNight, skyColors, season, setSeason, toggleManual, progress } = useDayNightCycle()
  const [isRaining, setIsRaining] = useState(false)
  const [showRainbow, setShowRainbow] = useState(false)
  const [showFrogs, setShowFrogs] = useState(false)
  const [showPlane, setShowPlane] = useState(false)
  const [showSanta, setShowSanta] = useState(false)
  const [currentTime, setCurrentTime] = useState<string>('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  // Unified Season specific settings & cycles
  useEffect(() => {
    // Start ambient sounds
    setEnvironmentWeather(season, false).catch(console.error)
    let timeoutId: NodeJS.Timeout;
    let isActive = true;

    if (season === 'monsoon') {
      setIsRaining(true);
      setShowFrogs(true);
      setShowRainbow(!isNight);
    } else if (season === 'winter') {
      setIsRaining(false);
      setShowFrogs(false);
      setShowRainbow(false);
    } else if (season === 'summer') {
      if (isNight) {
        setIsRaining(false);
        setShowFrogs(false);
        setShowRainbow(false);
      } else {
        // Summer day cycle (Clear)
        setIsRaining(false);
        setShowFrogs(false);
        setShowRainbow(false);
      }
    }

    return () => {
      isActive = false;
      clearTimeout(timeoutId);
    };
  }, [season, isNight])

  // Airplane/Santa Loop
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let isActive = true;

    const runCycle = () => {
      if (!isActive) return;
      timeoutId = setTimeout(() => {
        if (!isActive) return;
        if (season === 'winter') {
          setShowSanta(true);
          timeoutId = setTimeout(() => {
            if (!isActive) return;
            setShowSanta(false);
            runCycle();
          }, 45000); // 45s slow santa
        } else {
          setShowPlane(true);
          timeoutId = setTimeout(() => {
            if (!isActive) return;
            setShowPlane(false);
            runCycle();
          }, 20000); // 20s plane fly time
        }
      }, 30000 + Math.random() * 30000);
    };

    timeoutId = setTimeout(() => {
      if (!isActive) return;
      if (season === 'winter') {
        setShowSanta(true);
        timeoutId = setTimeout(() => { if (!isActive) return; setShowSanta(false); runCycle(); }, 45000);
      } else {
        setShowPlane(true);
        timeoutId = setTimeout(() => { if (!isActive) return; setShowPlane(false); runCycle(); }, 20000);
      }
    }, 5000); // Initial delay

    return () => {
      isActive = false;
      clearTimeout(timeoutId);
    };
  }, [season])

  useEffect(() => { if (isNight) { setPoppy('sleeping'); setMood('dreamy') } else { setPoppy('idle'); setMood('default') } }, [isNight, setPoppy, setMood])

  const isSunset = phase === 'sunset'
  const isDayPhase = phase === 'day'
  const cc = season === 'monsoon' ? (isNight ? '#1E293B' : '#4B5563') : (isRaining || season === 'winter') ? (isNight ? '#374151' : '#9CA3AF') : (isNight ? '#1E293B' : 'white')

  return (
    <>
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

        {/* 🌩️ Lightning Flash (Monsoon Night only) */}
        <div className="absolute inset-0 z-[10] bg-white pointer-events-none" style={{ opacity: season === 'monsoon' && isNight ? 0.8 : 0, mixBlendMode: 'overlay', animation: season === 'monsoon' && isNight ? 'lightning 8s infinite' : 'none', display: season === 'monsoon' && isNight ? 'block' : 'none', transition: 'opacity 3s' }} />

        {/* 🌧️ Storm Rain / ❄️ Winter Snow */}
        <div className="absolute inset-0 overflow-hidden z-[10] pointer-events-none" style={{ opacity: season === 'winter' ? 0.9 : (isRaining ? (season === 'monsoon' ? 0.95 : 0.6) : 0), transition: 'opacity 3s ease-in-out' }}>
          {[...Array(season === 'monsoon' ? 45 : (season === 'winter' ? 50 : 20))].map((_, i) => (
            <div key={`r${i}`} className="absolute rounded-full"
              style={{
                left: season === 'monsoon' ? `${(i * 5) % 150 - 20}%` : `${(i * 6) % 100}%`,
                width: season === 'winter' ? `${5 + (i % 5)}px` : (i % 3 === 0 ? '3px' : '2px'),
                height: season === 'winter' ? `${5 + (i % 5)}px` : (season === 'monsoon' ? '50px' : '30px'),
                background: season === 'winter' ? 'white' : 'linear-gradient(to bottom, transparent, #93C5FD, #3B82F6)',
                borderRadius: season === 'winter' ? '50%' : '9999px',
                animation: season === 'winter'
                  ? `snow-fall-gentle ${5 + (i % 6)}s ease-in-out infinite ${(i * 0.15)}s`
                  : (season === 'monsoon'
                    ? `storm-rain-fall ${0.3 + (i % 4) * 0.05}s linear infinite ${(i * 0.08) % 1}s`
                    : `rain-fall ${0.4 + (i % 4) * 0.1}s linear infinite ${(i * 0.12) % 1}s`)
              }} />
          ))}
        </div>

        {/* 🌈 Rainbow (vibrant in monsoon, soft in summer) */}
        <div className="absolute bottom-[20%] left-[10%] w-[80%] h-[60%] z-[0] pointer-events-none" style={{ opacity: showRainbow ? (season === 'monsoon' ? 0.8 : 0.4) : 0, transition: 'opacity 4s ease-in-out', filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.4))' }}>
          <svg viewBox="0 0 1000 600" className="w-full h-full" fill="none" preserveAspectRatio="none">
            <path d="M0 600 A 500 500 0 0 1 1000 600" stroke="#EF4444" strokeWidth="50" opacity=".9" />
            <path d="M50 600 A 450 450 0 0 1 950 600" stroke="#FB923C" strokeWidth="50" opacity=".9" />
            <path d="M100 600 A 400 400 0 0 1 900 600" stroke="#FBBF24" strokeWidth="50" opacity=".9" />
            <path d="M150 600 A 350 350 0 0 1 850 600" stroke="#4ADE80" strokeWidth="50" opacity=".9" />
            <path d="M200 600 A 300 300 0 0 1 800 600" stroke="#60A5FA" strokeWidth="50" opacity=".9" />
            <path d="M250 600 A 250 250 0 0 1 750 600" stroke="#818CF8" strokeWidth="50" opacity=".9" />
            <path d="M300 600 A 200 200 0 0 1 700 600" stroke="#C084FC" strokeWidth="50" opacity=".8" />
          </svg>
        </div>

        <FloatingStars isVisible={isNight || isSunset} />
        <Sun position={sunPosition} phase={phase} onClickManualToggle={() => toggleManual('day')} />
        <Moon position={moonPosition} onClickManualToggle={() => toggleManual('night')} />

        {/* ✈️ Airplane (Summer/Monsoon) */}
        <div className="absolute top-[6%] z-[1]" style={{ opacity: showPlane ? 0.9 : 0, transition: 'opacity 1.5s', animation: showPlane ? 'plane-fly 25s linear forwards' : 'none', display: season === 'winter' ? 'none' : 'block' }}>
          <svg viewBox="0 0 200 80" className="w-[150px] h-auto drop-shadow-lg">
            <path d="M 100 45 L 70 25 L 85 25 L 115 45 Z" fill={isNight ? '#475569' : '#94A3B8'} />
            <path d="M 30 45 C 10 45, 10 30, 30 30 L 160 30 C 180 30, 195 38, 195 45 C 195 50, 180 50, 160 50 L 30 50 Z" fill={isNight ? '#CBD5E1' : '#FFFFFF'} />
            <path d="M 40 30 L 20 5 L 40 5 L 60 30 Z" fill={isNight ? '#2563EB' : '#3B82F6'} />
            <path d="M 175 35 Q 185 35 185 40 L 170 40 Q 170 35 175 35 Z" fill={isNight ? '#FEF08A' : '#1E293B'} />
            <g fill={isNight ? '#FEF08A' : '#1E293B'}>
              {[...Array(8)].map((_, i) => <circle key={i} cx={70 + i * 12} cy="38" r="2.5" />)}
            </g>
            <path d="M 100 45 L 60 75 L 80 75 L 125 45 Z" fill={isNight ? '#94A3B8' : '#E2E8F0'} />
            <rect x="85" y="48" width="20" height="8" rx="4" fill={isNight ? '#334155' : '#64748B'} />
            <circle cx="60" cy="75" r="2" fill="#EF4444" className="animate-[pulse_1s_infinite]" />
            <circle cx="20" cy="5" r="2" fill="#EF4444" className="animate-[pulse_1s_infinite]" />
            <circle cx="190" cy="42" r="1.5" fill="#FFFFFF" className="animate-[pulse_0.5s_infinite]" />
          </svg>
        </div>

        {/* 🎅 Santa Sleigh (Winter Day only) */}
        <div className="absolute top-[0%] left-0 z-[15] pointer-events-none" style={{ opacity: showSanta ? 0.9 : 0, transition: 'opacity 1.5s', animation: showSanta ? 'santa-deliver 25s linear forwards' : 'none', display: season === 'winter' ? 'block' : 'none' }}>
          <svg viewBox="0 0 200 100" className="w-[200px] h-auto drop-shadow-lg">
            {/* Reindeer 1 */}
            <path d="M160 50 Q170 30 180 50 Q170 70 160 50 Z" fill="#795548" />
            <path d="M175 40 Q180 30 185 40" stroke="#4E342E" strokeWidth="2" fill="none" />
            {/* Reindeer 2 */}
            <path d="M43 10 L45 15 M47 10 L45 15" stroke="#654321" strokeWidth="1.5" />
            {/* Sleigh */}
            <path d="M80 30 C 80 35, 120 35, 120 30 L120 20 L80 20 Z" fill="#D32F2F" />
            <path d="M75 35 C 90 40, 110 40, 125 35" stroke="#FFC107" strokeWidth="3" fill="none" />
            {/* Santa */}
            <circle cx="100" cy="12" r="6" fill="#FFCDD2" />
            <path d="M94 12 L100 2 L106 12 Z" fill="#D32F2F" />
            <circle cx="100" cy="2" r="2" fill="white" />
            <path d="M90 20 L110 20 L105 12 L95 12 Z" fill="#D32F2F" />
            <path d="M94 14 L106 14 L100 22 Z" fill="white" opacity="0.9" />
            {/* Reigns */}
            <path d="M22 18 C 50 10, 80 15, 100 15" stroke="#8D6E63" strokeWidth="1" fill="none" />
            <path d="M47 18 C 65 12, 85 16, 100 15" stroke="#8D6E63" strokeWidth="1" fill="none" />
          </svg>
        </div>

        {/* 🌸 Floating Flower Petals (Summer Day only) */}
        <div className="absolute inset-0 overflow-hidden z-[10] pointer-events-none" style={{ opacity: (isDayPhase && season === 'summer') ? 0.7 : 0, transition: 'opacity 3s' }}>
          {[0, 1, 2, 3, 4].map(i => (
            <div key={`petal-${i}`} className="absolute" style={{
              left: `${(i * 22 + 5) % 100}%`, top: '-20px',
              animation: `petal-fall ${12 + i * 3}s linear infinite ${i * 4}s`,
            }}>
              <svg viewBox="0 0 16 16" className="w-[14px] h-[14px]" style={{ animation: `petal-spin ${3 + i}s linear infinite` }}>
                <ellipse cx="8" cy="8" rx="6" ry="3" fill={['#F472B6', '#FBBF24', '#A855F7', '#FB923C', '#F43F5E'][i]} opacity="0.7" />
              </svg>
            </div>
          ))}
        </div>

        {/* Clouds - Visible even at night during monsoon */}
        <div className="absolute top-0 left-0 w-full h-[50%] z-[1]" style={{ opacity: (isNight ? (season === 'monsoon' ? 0.6 : 0.15) : 0.85), transition: 'opacity 3s ease-in-out' }}>
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

        {/* ⛰️ Mountains (Highly detailed, foggy, seamlessly bleeds off right edge) */}
        <div className="absolute bottom-[-2vh] left-0 right-0 h-[75vh] z-[1]" style={{ opacity: 0.9, filter: 'blur(0.5px)', transition: 'opacity 3s' }}>
          <svg viewBox="0 0 1200 400" className="w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="fog-bg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isNight ? '#2A1F1D' : '#9CA3AF'} stopOpacity="0.6" />
                <stop offset="100%" stopColor={isNight ? '#140D0C' : '#6B7280'} stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="mtn-main" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isNight ? '#1A1817' : '#795548'} />
                <stop offset="100%" stopColor={isNight ? '#0D0B0A' : '#4E342E'} />
              </linearGradient>
              <linearGradient id="mtn-shadow" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgba(0,0,0,0)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0.4)" />
              </linearGradient>
              <linearGradient id="mtn-highlight" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
              <linearGradient id="fog-bottom" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isNight ? '#000000' : '#FFFFFF'} stopOpacity="0" />
                <stop offset="100%" stopColor={isNight ? '#000000' : '#FFFFFF'} stopOpacity={season === 'monsoon' ? "0.6" : "0.3"} />
              </linearGradient>
            </defs>

            {/* Deep Foggy Background Mountains (Large, very faint) */}
            <path d="M-100 400 L150 100 L400 400 Z" fill="url(#fog-bg)" opacity="0.4" />
            <path d="M300 400 L550 120 L800 400 Z" fill="url(#fog-bg)" opacity="0.4" />
            <path d="M700 400 L950 150 L1200 400 Z" fill="url(#fog-bg)" opacity="0.4" />

            {/* Foggy Background Mountains (Small) */}
            <path d="M50 400 L200 250 L350 400 Z" fill="url(#fog-bg)" />
            <path d="M400 400 L600 220 L800 400 Z" fill="url(#fog-bg)" />
            <path d="M850 400 L1000 260 L1150 400 Z" fill="url(#fog-bg)" />

            {/* Mountain 1 (Left) */}
            <g>
              <path d="M-50 400 L120 150 Q140 120 160 150 L350 400 Z" fill="url(#mtn-main)" />
              <path d="M140 135 Q160 120 160 150 L350 400 L140 400 Z" fill="url(#mtn-shadow)" />
              <path d="M140 135 L120 150 L-50 400 L140 400 Z" fill="url(#mtn-highlight)" />
            </g>

            {/* Mountain 2 (Mid-Left) */}
            <g>
              <path d="M200 400 L420 100 Q450 60 480 100 L700 400 Z" fill="url(#mtn-main)" />
              <path d="M450 80 Q480 60 480 100 L700 400 L450 400 Z" fill="url(#mtn-shadow)" />
              <path d="M450 80 L420 100 L200 400 L450 400 Z" fill="url(#mtn-highlight)" />
            </g>

            {/* Mountain 3 (Mid-Right) */}
            <g>
              <path d="M550 400 L760 160 Q790 120 820 160 L1000 400 Z" fill="url(#mtn-main)" />
              <path d="M790 140 Q820 120 820 160 L1000 400 L790 400 Z" fill="url(#mtn-shadow)" />
              <path d="M790 140 L760 160 L550 400 L790 400 Z" fill="url(#mtn-highlight)" />
            </g>

            {/* Mountain 4 (Right - extends off-screen to avoid gaps) */}
            <g>
              <path d="M800 400 L1050 120 Q1080 80 1110 120 L1350 400 Z" fill="url(#mtn-main)" />
              <path d="M1080 100 Q1110 80 1110 120 L1350 400 L1080 400 Z" fill="url(#mtn-shadow)" />
              <path d="M1080 100 L1050 120 L800 400 L1080 400 Z" fill="url(#mtn-highlight)" />
            </g>

            {/* Snow caps */}
            <g opacity={(isNight && season !== 'winter') ? 0.25 : 0.9} style={{ transition: 'opacity 2s ease-in-out' }}>
              <path d="M420 100 Q450 60 480 100 L460 130 Q450 140 440 130 Z" fill="white" />
              <path d="M1050 120 Q1080 80 1110 120 L1090 150 Q1080 160 1070 150 Z" fill="white" />
            </g>

            {/* Winter frost overlays */}
            <g fill="white" opacity={season === 'winter' ? 0.4 : 0} style={{ transition: 'opacity 3s ease-in-out' }}>
              <path d="M-50 400 L120 150 Q140 120 160 150 L350 400 Z" />
              <path d="M200 400 L420 100 Q450 60 480 100 L700 400 Z" />
              <path d="M550 400 L760 160 Q790 120 820 160 L1000 400 Z" />
              <path d="M800 400 L1050 120 Q1080 80 1110 120 L1350 400 Z" />
            </g>

            {/* Fog Overlay */}
            <rect x="0" y="250" width="1200" height="150" fill="url(#fog-bottom)" />
          </svg>
        </div>

        {/* Back Hills (textured) */}
        <div className="absolute bottom-0 left-0 right-0 h-[28vh] w-full z-[2]">
          <svg viewBox="0 0 1000 200" className="w-full h-full drop-shadow-[0_-5px_15px_rgba(0,0,0,0.15)]" preserveAspectRatio="none">
            <path d="M0 100 Q250 -20 500 100 T1000 100 V200 H0 Z" fill="var(--ground-color)" style={{ transition: 'fill 1s' }} />
            {/* Texture stripes */}
            <path d="M0 120 Q250 50 500 120 T1000 120" stroke={isNight ? '#ffffff06' : '#00000008'} strokeWidth="40" fill="none" />
            <circle cx="180" cy="98" r="3" fill="#F472B6" opacity={season === 'winter' ? 0 : 1} /><circle cx="180" cy="98" r="1.5" fill="#FBBF24" opacity={season === 'winter' ? 0 : 1} />
            <circle cx="520" cy="95" r="3" fill="#A855F7" opacity={season === 'winter' ? 0 : 1} /><circle cx="520" cy="95" r="1.5" fill="white" opacity={season === 'winter' ? 0 : 1} />
            <circle cx="780" cy="100" r="3" fill="#EF4444" opacity={season === 'winter' ? 0 : 1} /><circle cx="780" cy="100" r="1.5" fill="#FBBF24" opacity={season === 'winter' ? 0 : 1} />
          </svg>
        </div>

        {/* 🐄 Cow (Meadow, Summer only) */}
        <div className="absolute bottom-[6%] w-[11vw] max-w-[65px] z-[4] animate-[walk-cow_40s_linear_infinite]" style={{ opacity: season === 'summer' ? 1 : 0, transition: 'opacity 2s' }}>
          <svg viewBox="0 0 80 60" className="drop-shadow-lg animate-[graze_4s_ease-in-out_infinite]">
            <g fill="#D4D4D4">
              <rect className="animate-[leg-swing-short_40s_linear_infinite]" x="22" y="44" width="4" height="10" rx="1" />
              <rect className="animate-[leg-swing-short-rev_40s_linear_infinite]" x="35" y="44" width="4" height="10" rx="1" />
              <rect className="animate-[leg-swing-short_40s_linear_infinite]" x="45" y="44" width="4" height="10" rx="1" />
              <rect className="animate-[leg-swing-short-rev_40s_linear_infinite]" x="54" y="44" width="4" height="10" rx="1" />
            </g>
            <rect x="20" y="20" width="40" height="25" rx="8" fill="white" />
            <rect x="20" y="20" width="15" height="10" rx="4" fill="#1F2937" />
            <circle cx="15" cy="18" r="10" fill="white" />
            <circle cx="12" cy="15" r="1.5" fill="#1F2937" />
            <path d="M10 22 Q15 25 18 22" stroke="#F472B6" strokeWidth="1.5" fill="none" />
            <rect x="8" y="8" width="3" height="8" rx="1" fill="white" />
            <rect x="18" y="8" width="3" height="8" rx="1" fill="white" />
            <path d="M58 30 Q68 25 62 35" stroke="#D4D4D4" strokeWidth="2" fill="none" />
          </svg>
        </div>

        {/* 🐑 Sheep (Meadow, Summer only) */}
        <div className="absolute bottom-[10%] w-[9vw] max-w-[55px] z-[4] animate-[walk-sheep_40s_linear_infinite]" style={{ opacity: season === 'summer' ? 1 : 0, transition: 'opacity 2s' }}>
          <svg viewBox="0 0 80 60" className="drop-shadow-lg animate-[graze_3s_ease-in-out_infinite]">
            <g fill="#1F2937">
              <rect className="animate-[leg-swing-short_40s_linear_infinite]" x="25" y="40" width="4" height="12" rx="2" />
              <rect className="animate-[leg-swing-short-rev_40s_linear_infinite]" x="35" y="40" width="4" height="12" rx="2" />
              <rect className="animate-[leg-swing-short_40s_linear_infinite]" x="45" y="40" width="4" height="12" rx="2" />
              <rect className="animate-[leg-swing-short-rev_40s_linear_infinite]" x="55" y="40" width="4" height="12" rx="2" />
            </g>
            <g fill="#F3F4F6">
              <circle cx="40" cy="30" r="16" />
              <circle cx="30" cy="25" r="12" />
              <circle cx="50" cy="25" r="12" />
              <circle cx="50" cy="35" r="12" />
              <circle cx="30" cy="35" r="12" />
            </g>
            <rect x="10" y="15" width="20" height="15" rx="6" fill="#1F2937" />
            <circle cx="15" cy="20" r="2" fill="white" />
          </svg>
        </div>

        {/* 🐼 Panda (Summer only) */}
        <div className="absolute bottom-[8%] left-[45%] w-[8vw] max-w-[50px] z-[4]" style={{ opacity: season === 'summer' ? 1 : 0, transition: 'opacity 2s' }}>
          <svg viewBox="0 0 80 80" className="drop-shadow-lg">
            {/* Body */}
            <circle cx="45" cy="55" r="18" fill="white" />
            <circle cx="32" cy="65" r="7" fill="#1F2937" />
            <circle cx="58" cy="65" r="7" fill="#1F2937" />
            {/* Head */}
            <circle cx="45" cy="35" r="15" fill="white" />
            {/* Ears */}
            <circle cx="35" cy="23" r="5" fill="#1F2937" />
            <circle cx="55" cy="23" r="5" fill="#1F2937" />
            {/* Eye Patches */}
            <path d="M 36 32 Q 40 30 40 36 Q 40 40 36 40 Q 32 40 32 36 Q 32 32 36 32 Z" fill="#1F2937" transform="rotate(-15 36 36)" />
            <path d="M 54 32 Q 50 30 50 36 Q 50 40 54 40 Q 58 40 58 36 Q 58 32 54 32 Z" fill="#1F2937" transform="rotate(15 54 36)" />
            {/* Pupils */}
            <circle cx="38" cy="35" r="1.5" fill="white" />
            <circle cx="52" cy="35" r="1.5" fill="white" />
            {/* Nose */}
            <circle cx="45" cy="40" r="2" fill="#1F2937" />
            {/* Arms & Bamboo */}
            <g className="animate-[arm-swing_2s_infinite_alternate]" transform-origin="32px 48px">
              <ellipse cx="32" cy="48" rx="8" ry="4" fill="#1F2937" transform="rotate(20 32 48)" />
              <rect x="22" y="30" width="4" height="30" fill="#4ADE80" transform="rotate(-15 24 45)" />
              <path d="M 24 35 Q 30 32 32 38 Z" fill="#22C55E" transform="rotate(-15 24 45)" />
            </g>
            <ellipse cx="58" cy="48" rx="8" ry="4" fill="#1F2937" transform="rotate(-20 58 48)" />
          </svg>
        </div>



        {/* ⛄ Snowman (Winter only) */}
        <div className="absolute bottom-[8%] left-[12%] w-[11vw] max-w-[65px] z-[4]" style={{ opacity: season === 'winter' ? 1 : 0, transition: 'opacity 2s' }}>
          <svg viewBox="0 0 80 100">
            <circle cx="40" cy="75" r="20" fill="white" />
            <circle cx="40" cy="45" r="15" fill="white" />
            <circle cx="40" cy="22" r="12" fill="white" />
            {/* Eyes */}
            <circle cx="35" cy="18" r="1.5" fill="#1F2937" />
            <circle cx="45" cy="18" r="1.5" fill="#1F2937" />
            {/* Nose */}
            <path d="M40 22 L55 25 L40 25 Z" fill="#F97316" />
            {/* Buttons */}
            <circle cx="40" cy="40" r="1.5" fill="#1F2937" />
            <circle cx="40" cy="50" r="1.5" fill="#1F2937" />
            <circle cx="40" cy="65" r="1.5" fill="#1F2937" />
            <circle cx="40" cy="75" r="1.5" fill="#1F2937" />
            {/* Hat */}
            <rect x="25" y="10" width="30" height="4" fill="#1F2937" />
            <rect x="30" y="0" width="20" height="10" fill="#1F2937" />
            <rect x="30" y="8" width="20" height="2" fill="#EF4444" />
          </svg>
        </div>

        {/* 🌍 UNIFIED FRONT GROUND + LAKE (single full-width SVG, no gaps) */}
        <div className="absolute bottom-0 left-0 right-0 h-[22vh] w-full z-[3]">
          <svg viewBox="0 0 1000 200" className="w-full h-full drop-shadow-[0_-5px_15px_rgba(0,0,0,0.2)]" preserveAspectRatio="none">
            {/* Ground - continuous, dips down on right for lake */}
            <path d="M0 140 Q150 30 350 130 Q500 60 650 120 Q700 135 720 145 Q750 160 780 155 Q850 140 900 150 Q950 155 1000 145 V200 H0 Z" fill="var(--ground-color)" style={{ transition: 'fill 1s' }} />
            {/* Texture stripe */}
            <path d="M0 155 Q200 90 400 150 Q550 100 700 145 Q850 155 1000 155" stroke={isNight ? '#ffffff06' : '#00000008'} strokeWidth="25" fill="none" />

            {/* House and Path */}
            <g>
              {/* Path */}
              <path d="M 100 200 Q 145 150 145 95 L 155 95 Q 160 150 130 200 Z" fill={isNight ? '#3E2723' : '#D7CCC8'} style={{ transition: 'fill 3s' }} />
              {/* House */}
              <g transform="translate(125, 45)">
                <rect x="0" y="20" width="40" height="30" fill={isNight ? '#3E2723' : '#FFCC80'} style={{ transition: 'fill 3s' }} />
                <rect x="5" y="25" width="4" height="25" fill={isNight ? '#212121' : '#F57C00'} style={{ transition: 'fill 3s' }} />
                <path d="M -5 20 L 20 -5 L 45 20 Z" fill={isNight ? '#1B0000' : '#E64A19'} style={{ transition: 'fill 3s' }} />
                <rect x="25" y="0" width="8" height="15" fill={isNight ? '#212121' : '#D84315'} style={{ transition: 'fill 3s' }} />
                <circle cx="29" cy="-5" r="4" fill="white" opacity={season === 'summer' ? 0.2 : 0.6} className="animate-[smoke_3s_infinite]" />
                <circle cx="29" cy="-15" r="6" fill="white" opacity={season === 'summer' ? 0.1 : 0.4} className="animate-[smoke_3s_infinite_0.5s]" />
                <rect x="15" y="30" width="10" height="20" fill={isNight ? '#1A1110' : '#795548'} style={{ transition: 'fill 3s' }} />
                <rect x="4" y="30" width="8" height="8" rx="1" fill={isNight ? '#FDE047' : '#81D4FA'} style={{ transition: 'fill 3s' }} />
                <rect x="28" y="30" width="8" height="8" rx="1" fill={isNight ? '#FDE047' : '#81D4FA'} style={{ transition: 'fill 3s' }} />
                <rect x="4" y="30" width="8" height="8" rx="1" fill="#FEF08A" opacity={isNight ? 0.6 : 0} filter="blur(2px)" style={{ transition: 'opacity 3s' }} />
                <rect x="28" y="30" width="8" height="8" rx="1" fill="#FEF08A" opacity={isNight ? 0.6 : 0} filter="blur(2px)" style={{ transition: 'opacity 3s' }} />
              </g>
              {/* Christmas Tree & Gifts (Winter only) */}
              <g transform="translate(175, 45)" style={{ opacity: season === 'winter' ? 1 : 0, transition: 'opacity 3s' }}>
                <rect x="-3" y="20" width="6" height="15" fill="#4E342E" />
                <path d="M0 -15 L15 10 L5 10 L20 25 L-20 25 L-5 10 L-15 10 Z" fill="#166534" />
                <circle cx="0" cy="-5" r="2" fill="#FDE047" />
                <circle cx="-5" cy="5" r="1.5" fill="#EF4444" />
                <circle cx="8" cy="8" r="1.5" fill="#3B82F6" />
                <circle cx="-10" cy="18" r="1.5" fill="#F59E0B" />
                <circle cx="12" cy="20" r="1.5" fill="#EF4444" />
                <circle cx="0" cy="15" r="1.5" fill="#A855F7" />
                {/* Gifts (Appear magically after Santa lands) */}
                <g style={{ opacity: showSanta ? 1 : 0, transition: 'opacity 2s', transitionDelay: showSanta ? '6s' : '0s' }}>
                  <rect x="-15" y="20" width="10" height="10" fill="#EF4444" />
                  <rect x="-11" y="20" width="2" height="10" fill="#FCD34D" />
                  <rect x="-15" y="24" width="10" height="2" fill="#FCD34D" />
                  <rect x="5" y="22" width="12" height="8" fill="#3B82F6" />
                  <rect x="10" y="22" width="2" height="8" fill="#FCD34D" />
                </g>
              </g>
            </g>
            {/* Lake water (organic shape with gradients) */}
            <defs>
              <linearGradient id="lakeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={season === 'winter' ? '#E0F2FE' : (isNight ? '#0D2B5E' : '#4FC3F7')} style={{ transition: 'stop-color 3s ease-in-out' }} />
                <stop offset="100%" stopColor={season === 'winter' ? '#BAE6FD' : (isNight ? '#08183A' : '#0284C7')} style={{ transition: 'stop-color 3s ease-in-out' }} />
              </linearGradient>
              <linearGradient id="lakeGradInner" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={season === 'winter' ? '#F0F9FF' : (isNight ? '#1A3D7E' : '#81D4FA')} style={{ transition: 'stop-color 3s ease-in-out' }} />
                <stop offset="100%" stopColor={season === 'winter' ? '#E0F2FE' : (isNight ? '#122D60' : '#38BDF8')} style={{ transition: 'stop-color 3s ease-in-out' }} />
              </linearGradient>
            </defs>
            <path d="M650 160 C 720 120, 950 120, 1000 160 C 950 200, 720 200, 650 160 Z" fill="url(#lakeGrad)" style={{ transition: 'all 3s ease-in-out', transform: season === 'monsoon' ? 'scale(1.1) translate(-50px, -15px)' : 'scale(1) translate(0, 0)' }} />
            <path d="M700 160 C 750 140, 900 140, 950 160 C 900 180, 750 180, 700 160 Z" fill="url(#lakeGradInner)" style={{ transition: 'all 3s ease-in-out', transform: season === 'monsoon' ? 'scale(1.1) translate(-50px, -15px)' : 'scale(1) translate(0, 0)' }} />

            {/* Reeds by lake */}
            <line x1="680" y1="148" x2="680" y2="130" stroke="#388E3C" strokeWidth="2" /><ellipse cx="680" cy="128" rx="3" ry="5" fill="#6D4C41" />
            <line x1="970" y1="152" x2="970" y2="134" stroke="#388E3C" strokeWidth="2" /><ellipse cx="970" cy="132" rx="3" ry="5" fill="#6D4C41" />
            {/* Diverse Trees on front hill */}
            <g style={{ transition: 'fill 1s', filter: 'drop-shadow(0 6px 8px rgba(0,0,0,0.5))' }}>
              {/* Pine Tree 1 */}
              <g transform="translate(60, 150)">
                <rect x="-3" y="0" width="6" height="20" fill="#4E342E" />
                <path d="M0 -35 L18 -5 L8 -5 L22 20 L-22 20 L-8 -5 L-18 -5 Z" fill="var(--tree-color)" />
                <path d="M0 -35 L18 -5 L8 -5 L22 20 L0 20 Z" fill="rgba(0,0,0,0.15)" />
              </g>
              {/* Oak Tree 1 */}
              <g transform="translate(250, 105)">
                <rect x="-5" y="0" width="10" height="20" fill="#4E342E" />
                <circle cx="-12" cy="-15" r="14" fill="var(--tree-color)" />
                <circle cx="12" cy="-15" r="14" fill="var(--tree-color)" />
                <circle cx="0" cy="-28" r="16" fill="var(--tree-color)" />
                <circle cx="0" cy="-5" r="12" fill="var(--tree-color)" />
                <path d="M0 -44 A 16 16 0 0 1 16 -28 A 14 14 0 0 1 26 -15 A 12 12 0 0 1 12 7 L 0 7 Z" fill="rgba(0,0,0,0.15)" />
              </g>
              {/* Pine Tree 2 */}
              <g transform="translate(450, 125)">
                <rect x="-3" y="0" width="6" height="15" fill="#4E342E" />
                <path d="M0 -30 L15 -5 L5 -5 L18 15 L-18 15 L-5 -5 L-15 -5 Z" fill="var(--tree-color)" />
                <path d="M0 -30 L15 -5 L5 -5 L18 15 L0 15 Z" fill="rgba(0,0,0,0.15)" />
              </g>
              {/* Oak Tree 2 */}
              <g transform="translate(600, 135)">
                <rect x="-4" y="0" width="8" height="15" fill="#4E342E" />
                <circle cx="-10" cy="-12" r="12" fill="var(--tree-color)" />
                <circle cx="10" cy="-12" r="12" fill="var(--tree-color)" />
                <circle cx="0" cy="-22" r="14" fill="var(--tree-color)" />
                <circle cx="0" cy="-5" r="10" fill="var(--tree-color)" />
                <path d="M0 -36 A 14 14 0 0 1 14 -22 A 12 12 0 0 1 22 -12 A 10 10 0 0 1 10 5 L 0 5 Z" fill="rgba(0,0,0,0.15)" />
              </g>
            </g>
            {/* Mangoes! */}
            <g style={{ opacity: season === 'summer' ? 1 : 0, transition: 'opacity 2s', filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.5))' }}>
              <circle cx="60" cy="140" r="4" fill="#F59E0B" /><circle cx="53" cy="152" r="4" fill="#F59E0B" /><circle cx="67" cy="152" r="4" fill="#F59E0B" />
              <circle cx="250" cy="95" r="4" fill="#F59E0B" /><circle cx="243" cy="107" r="4" fill="#F59E0B" /><circle cx="257" cy="107" r="4" fill="#F59E0B" />
              <circle cx="450" cy="115" r="4" fill="#F59E0B" /><circle cx="443" cy="127" r="4" fill="#F59E0B" /><circle cx="457" cy="127" r="4" fill="#F59E0B" />
              <circle cx="600" cy="125" r="4" fill="#F59E0B" /><circle cx="593" cy="137" r="4" fill="#F59E0B" /><circle cx="607" cy="137" r="4" fill="#F59E0B" />
            </g>
            {/* Grass tufts */}
            <g stroke="var(--tree-color)" strokeWidth="2" fill="none" opacity="0.8">
              <path d="M120 132 Q125 117 130 132 M125 132 Q125 122 120 132 M125 132 Q130 122 135 132" />
              <path d="M350 120 Q355 105 360 120 M355 120 Q355 110 350 120 M355 120 Q360 110 365 120" />
              <path d="M530 108 Q535 93 540 108 M535 108 Q535 98 530 108 M535 108 Q540 98 545 108" />
              <path d="M670 128 Q675 113 680 128 M675 128 Q675 118 670 128 M675 128 Q680 118 685 128" />
            </g>
            {/* Flowers (hidden in winter) */}
            <circle cx="180" cy="130" r="4" fill="#FBBF24" opacity={season === 'winter' ? 0 : 1} /><circle cx="180" cy="130" r="2" fill="white" opacity={season === 'winter' ? 0 : 1} />
            <circle cx="400" cy="115" r="4" fill="#F472B6" opacity={season === 'winter' ? 0 : 1} /><circle cx="400" cy="115" r="2" fill="#FBBF24" opacity={season === 'winter' ? 0 : 1} />
            <circle cx="580" cy="112" r="3" fill="#A855F7" opacity={season === 'winter' ? 0 : 1} /><circle cx="580" cy="112" r="1.5" fill="white" opacity={season === 'winter' ? 0 : 1} />
          </svg>
        </div>

        {/* 🦆 Duck on lake (Summer/Monsoon) */}
        <div className="absolute bottom-[4%] right-[12%] w-[7vw] max-w-[40px] z-[4] animate-[duck-bob_3s_ease-in-out_infinite]" style={{ opacity: season === 'winter' ? 0 : 1, transition: 'opacity 2s' }}>
          <svg viewBox="0 0 60 50"><ellipse cx="30" cy="35" rx="16" ry="10" fill="#FDD835" /><circle cx="42" cy="22" r="8" fill="#FDD835" /><path d="M49 22 L58 19 L49 25 Z" fill="#FF8F00" /><circle cx="44" cy="20" r="1.5" fill="#1F2937" /></svg>
        </div>

        {/* 🐸 Frog (near lake, appears during rain) */}
        <div style={{ opacity: showFrogs ? 1 : 0, transition: 'opacity 2s' }}>
          <div className="absolute bottom-[7%] right-[28%] w-[8vw] max-w-[40px] z-[5] animate-[frog-jump_2s_ease-in-out_infinite]">
            <svg viewBox="0 0 50 40"><ellipse cx="25" cy="30" rx="18" ry="12" fill="#4CAF50" /><circle cx="15" cy="18" r="6" fill="#4CAF50" /><circle cx="35" cy="18" r="6" fill="#4CAF50" /><circle cx="15" cy="16" r="3" fill="white" /><circle cx="35" cy="16" r="3" fill="white" /><circle cx="15" cy="16" r="1.5" fill="#1F2937" /><circle cx="35" cy="16" r="1.5" fill="#1F2937" /><path d="M20 32 Q25 36 30 32" stroke="#2E7D32" strokeWidth="1.5" fill="none" /></svg>
          </div>
        </div>

        {/* 🐰 Bunny (All seasons) */}
        <div className="absolute bottom-[12%] left-[28%] w-[10vw] max-w-[50px] animate-[peek_4s_infinite] z-[4]">
          <svg viewBox="0 0 100 100"><path d="M30 40 Q50 10 70 40" fill="#FFF" /><path d="M35 40 Q40 20 45 40" fill={season === 'winter' ? '#A1A1AA' : '#F472B6'} /><path d="M55 40 Q60 20 65 40" fill={season === 'winter' ? '#A1A1AA' : '#F472B6'} /><circle cx="50" cy="65" r="25" fill="#FFF" /><circle cx="40" cy="60" r="3" fill="#1F2937" /><circle cx="60" cy="60" r="3" fill="#1F2937" /><path d="M48 68 Q50 72 52 68" stroke="#1F2937" strokeWidth="2" fill="none" /><circle cx="50" cy="65" r="2" fill={season === 'winter' ? '#A1A1AA' : '#F472B6'} /></svg>
        </div>

        {/* 🦋 Butterfly (Summer day only) */}
        <div className="absolute top-[45%] left-[55%] z-[4] animate-[butterfly_8s_ease-in-out_infinite]" style={{ opacity: (isDayPhase && season === 'summer') ? 0.8 : 0, transition: 'opacity 2s' }}>
          <svg viewBox="0 0 30 20" className="w-[28px]"><g className="animate-[wing-flap_0.4s_ease-in-out_infinite_alternate]"><ellipse cx="10" cy="10" rx="8" ry="6" fill="#A855F7" opacity=".8" /><ellipse cx="20" cy="10" rx="8" ry="6" fill="#E879F9" opacity=".8" /></g><rect x="14" y="4" width="2" height="14" rx="1" fill="#4B5563" /></svg>
        </div>

        <style dangerouslySetInnerHTML={{
          __html: `
        @keyframes slide-right{from{transform:translateX(0)}to{transform:translateX(calc(100vw + 200px))}}
        @keyframes santa-deliver{0%{transform:translate(-20vw, 10vh) rotate(15deg)}20%{transform:translate(15vw, 65vh) rotate(0deg)}60%{transform:translate(15vw, 65vh) rotate(0deg)}80%{transform:translate(50vw, 10vh) rotate(-15deg)}100%{transform:translate(120vw, 5vh) rotate(-15deg)}}
        @keyframes walk-cow{0%,40%{transform:translateX(10vw) scaleX(-1)}42%,80%{transform:translateX(13vw) scaleX(-1)}82%{transform:translateX(13vw) scaleX(1)}84%,96%{transform:translateX(10vw) scaleX(1)}98%,100%{transform:translateX(10vw) scaleX(-1)}}
        @keyframes walk-sheep{0%,40%{transform:translateX(18vw) scaleX(1)}42%,80%{transform:translateX(15vw) scaleX(1)}82%{transform:translateX(15vw) scaleX(-1)}84%,96%{transform:translateX(18vw) scaleX(-1)}98%,100%{transform:translateX(18vw) scaleX(1)}}
        @keyframes leg-swing-short{0%,40%{transform:rotate(0deg);transform-origin:50% 0}40.5%{transform:rotate(15deg);transform-origin:50% 0}41%{transform:rotate(-15deg);transform-origin:50% 0}41.5%{transform:rotate(15deg);transform-origin:50% 0}42%{transform:rotate(0deg);transform-origin:50% 0}42.1%,82%{transform:rotate(0deg);transform-origin:50% 0}82.5%{transform:rotate(15deg);transform-origin:50% 0}83%{transform:rotate(-15deg);transform-origin:50% 0}83.5%{transform:rotate(15deg);transform-origin:50% 0}84%,100%{transform:rotate(0deg);transform-origin:50% 0}}
        @keyframes leg-swing-short-rev{0%,40%{transform:rotate(0deg);transform-origin:50% 0}40.5%{transform:rotate(-15deg);transform-origin:50% 0}41%{transform:rotate(15deg);transform-origin:50% 0}41.5%{transform:rotate(-15deg);transform-origin:50% 0}42%{transform:rotate(0deg);transform-origin:50% 0}42.1%,82%{transform:rotate(0deg);transform-origin:50% 0}82.5%{transform:rotate(-15deg);transform-origin:50% 0}83%{transform:rotate(15deg);transform-origin:50% 0}83.5%{transform:rotate(-15deg);transform-origin:50% 0}84%,100%{transform:rotate(0deg);transform-origin:50% 0}}
        @keyframes smoke{0%{transform:translateY(0) scale(1);opacity:0.8}100%{transform:translateY(-20px) scale(2);opacity:0}}
        @keyframes arm-swing{from{transform:rotate(0deg)}to{transform:rotate(-20deg)}}
        @keyframes bird-flap{from{transform:translateY(-3px) rotate(-3deg)}to{transform:translateY(3px) rotate(3deg)}}
        @keyframes peek{0%,100%{transform:translateY(20px)}50%{transform:translateY(0)}}
        @keyframes rain-fall{0%{transform:translateY(-80px);opacity:0}15%{opacity:1}85%{opacity:1}100%{transform:translateY(100vh);opacity:0}}
        @keyframes storm-rain-fall{0%{transform:translateY(-100px) translateX(0);opacity:0}15%{opacity:0.95}85%{opacity:0.95}100%{transform:translateY(100vh) translateX(-180px);opacity:0}}
        @keyframes snow-fall-gentle{0%{transform:translateY(-80px) translateX(0px) rotate(0deg);opacity:0}20%{opacity:0.9}80%{opacity:0.9}100%{transform:translateY(100vh) translateX(40px) rotate(180deg);opacity:0}}
        @keyframes lightning{0%,95%,98%,100%{opacity:0}96%,97%,99%{opacity:0.4}}
        @keyframes duck-bob{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-4px) rotate(3deg)}}
        @keyframes graze{0%,100%{transform:rotate(0);transform-origin:20% 80%}30%{transform:rotate(4deg);transform-origin:20% 80%}60%{transform:rotate(-2deg);transform-origin:20% 80%}}
        @keyframes butterfly{0%{transform:translate(0,0)}25%{transform:translate(40px,-20px)}50%{transform:translate(-20px,-30px)}75%{transform:translate(30px,10px)}100%{transform:translate(0,0)}}
        @keyframes wing-flap{from{transform:scaleY(1)}to{transform:scaleY(0.3)}}
        @keyframes frog-jump{0%,100%{transform:translateY(0) scaleY(1)}20%{transform:translateY(0) scaleY(0.7)}40%{transform:translateY(-35px) translateX(-15px) scaleY(1.1)}60%{transform:translateY(0) translateX(-30px) scaleY(0.8)}80%{transform:translateY(0) translateX(-30px) scaleY(1)}}
        @keyframes plane-fly{0%{transform:translateX(-150px)}100%{transform:translateX(calc(100vw + 250px))}}
        @keyframes santa-fly{0%{transform:translate(-150px, -20px)}25%{transform:translate(25vw, 20px) rotate(3deg)}50%{transform:translate(50vw, -20px) rotate(-2deg)}75%{transform:translate(75vw, 20px) rotate(3deg)}100%{transform:translate(calc(100vw + 250px), -20px)}}
        @keyframes ice-shine{0%{opacity:0.1;transform:scaleX(0.9)}100%{opacity:0.6;transform:scaleX(1.1)}}
        @keyframes star-twinkle{0%,100%{opacity:0.2;transform:scale(0.8)}50%{opacity:1;transform:scale(1.3)}}
        @keyframes petal-fall{0%{transform:translateY(-20px) translateX(0)}25%{transform:translateY(25vh) translateX(30px)}50%{transform:translateY(50vh) translateX(-20px)}75%{transform:translateY(75vh) translateX(25px)}100%{transform:translateY(110vh) translateX(-10px)}}
        @keyframes petal-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      `}} />
      </div>

      {/* Controls - Time, Clock & Seasons - Moved out of the pointer-events-none stacking context */}
      <div className="fixed inset-0 z-20 pointer-events-none">
        <div className="absolute bottom-4 left-4 z-50 pointer-events-auto flex flex-col gap-2">
          {/* Clock */}
          <div className="flex items-center justify-center bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md border border-white/20 mb-1">
            <span className="font-fredoka text-white text-sm font-bold tracking-wider">{currentTime}</span>
          </div>
          <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md p-1.5 rounded-full shadow-md border border-white/20">
            <button onClick={() => toggleManual('day')} className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95 ${!isNight && !isSunset ? 'bg-yellow-400 shadow-[0_0_15px_#FDE047]' : 'bg-white/30'}`} title="Day"><span className="text-xl">☀️</span></button>
            <button onClick={() => toggleManual('night')} className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95 ${isNight ? 'bg-indigo-500 shadow-[0_0_15px_#818CF8]' : 'bg-white/30'}`} title="Night"><span className="text-xl">🌙</span></button>
          </div>
          <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md p-1.5 rounded-full shadow-md border border-white/20">
            <button onClick={() => setSeason('summer')} className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95 ${season === 'summer' ? 'bg-green-500 shadow-[0_0_10px_#4ADE80]' : 'bg-white/30'}`} title="Summer"><span className="text-sm">🌻</span></button>
            <button onClick={() => setSeason('monsoon')} className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95 ${season === 'monsoon' ? 'bg-blue-500 shadow-[0_0_10px_#60A5FA]' : 'bg-white/30'}`} title="Monsoon"><span className="text-sm">🌧️</span></button>
            <button onClick={() => setSeason('winter')} className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95 ${season === 'winter' ? 'bg-cyan-300 shadow-[0_0_10px_#67E8F9]' : 'bg-white/30'}`} title="Winter"><span className="text-sm">❄️</span></button>
          </div>
        </div>
      </div>
    </>
  )
}
export default memo(AnimatedBackground)
