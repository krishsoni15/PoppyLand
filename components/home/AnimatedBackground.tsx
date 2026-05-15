'use client'

import { useApp } from '@/components/providers/AppProvider'

export default function AnimatedBackground() {
  const { isNightMode, toggleNightMode } = useApp()

  return (
    <div className={`fixed inset-0 z-0 overflow-hidden pointer-events-none transition-colors duration-1000 ${isNightMode ? 'bg-[#0f172a]' : 'bg-[#BAE6FD]'}`} aria-hidden="true">
      {/* Soft gradient sky */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${isNightMode ? 'opacity-0' : 'opacity-80 bg-gradient-to-b from-[#60A5FA] via-[#BAE6FD] to-[#FEF08A]'}`} />
      
      {/* Night Sky Gradient & Stars */}
      <div className={`absolute inset-0 bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-[#312e81] transition-opacity duration-1000 ${isNightMode ? 'opacity-100' : 'opacity-0'}`}>
        {/* Stars */}
        {[...Array(40)].map((_, i) => (
          <div 
            key={`star-${i}`} 
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              top: `${Math.random() * 60}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: Math.random() * 0.5 + 0.3
            }}
          />
        ))}
      </div>


      {/* 🌈 Giant Dreamy Rainbow (diagonal, blurred, behind cards) */}
      <div className={`absolute top-[-10%] left-[-10%] w-[120%] h-[120%] blur-[20px] mix-blend-multiply transform -rotate-12 animate-pulse transition-opacity duration-1000 ${isNightMode ? 'opacity-0' : 'opacity-40'}`} style={{ animationDuration: '4s' }}>
        <svg viewBox="0 0 1000 500" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M 100 500 A 400 400 0 0 1 900 500" stroke="#EF4444" strokeWidth="40" strokeLinecap="round" />
          <path d="M 140 500 A 360 360 0 0 1 860 500" stroke="#F97316" strokeWidth="40" strokeLinecap="round" />
          <path d="M 180 500 A 320 320 0 0 1 820 500" stroke="#FBBF24" strokeWidth="40" strokeLinecap="round" />
          <path d="M 220 500 A 280 280 0 0 1 780 500" stroke="#4ADE80" strokeWidth="40" strokeLinecap="round" />
          <path d="M 260 500 A 240 240 0 0 1 740 500" stroke="#3B82F6" strokeWidth="40" strokeLinecap="round" />
          <path d="M 300 500 A 200 200 0 0 1 700 500" stroke="#A855F7" strokeWidth="40" strokeLinecap="round" />
        </svg>
      </div>

      {/* ☀️ Smiling Glowing Sun */}
      <div 
        onClick={toggleNightMode}
        className={`absolute top-[8%] left-[8%] w-[160px] h-[160px] animate-sun-wobble transition-all duration-1000 pointer-events-auto cursor-pointer hover:scale-110 active:scale-95 ${isNightMode ? 'translate-y-[100px] opacity-0 pointer-events-none' : 'translate-y-0 opacity-90'}`}
        role="button"
        aria-label="Switch to Night Mode"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_25px_rgba(251,191,36,0.8)]" fill="#FBBF24" xmlns="http://www.w3.org/2000/svg">
          {/* Sun body */}
          <circle cx="50" cy="50" r="28" fill="#F59E0B" />
          <circle cx="50" cy="50" r="24" fill="#FCD34D" />
          {/* Smiling Face */}
          <g className="animate-sun-blink">
            <circle cx="42" cy="45" r="3" fill="#4B5563" />
            <circle cx="58" cy="45" r="3" fill="#4B5563" />
          </g>
          <path d="M 42 55 Q 50 62 58 55" stroke="#4B5563" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {/* Rosy cheeks */}
          <circle cx="36" cy="48" r="4" fill="#F87171" opacity="0.6" />
          <circle cx="64" cy="48" r="4" fill="#F87171" opacity="0.6" />
          {/* Sun rays */}
          <path d="M50 5 L54 15 L46 15 Z" />
          <path d="M50 95 L54 85 L46 85 Z" />
          <path d="M5 50 L15 46 L15 54 Z" />
          <path d="M95 50 L85 46 L85 54 Z" />
          <path d="M18 18 L26 23 L21 28 Z" />
          <path d="M82 82 L74 77 L79 72 Z" />
          <path d="M18 82 L26 77 L21 72 Z" />
          <path d="M82 18 L74 23 L79 28 Z" />
        </svg>
      </div>

      {/* 🌙 Sleepy Moon */}
      <div 
        onClick={toggleNightMode}
        className={`absolute top-[8%] right-[15%] w-[140px] h-[140px] animate-sun-wobble transition-all duration-1000 pointer-events-auto cursor-pointer hover:scale-110 active:scale-95 ${isNightMode ? 'translate-y-0 opacity-90' : 'translate-y-[100px] opacity-0 pointer-events-none'}`}
        role="button"
        aria-label="Switch to Day Mode"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_30px_rgba(255,255,255,0.6)]" fill="#FDE047" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 10 A 40 40 0 1 0 90 50 A 30 30 0 1 1 50 10 Z" fill="#FEF08A" />
          {/* Sleepy Face */}
          <path d="M35 45 Q 40 40 45 45" stroke="#713F12" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M55 45 Q 60 40 65 45" stroke="#713F12" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M45 58 Q 50 63 55 58" stroke="#713F12" strokeWidth="2" strokeLinecap="round" fill="none" />
          <text x="70" y="30" fontSize="12" fill="#FEF08A" className="animate-pulse">Z</text>
          <text x="85" y="15" fontSize="16" fill="#FEF08A" className="animate-pulse" style={{ animationDelay: '0.5s' }}>z</text>
        </svg>
      </div>



      {/* 🌧️ Magical Little Rain */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40 z-0">
        {[...Array(25)].map((_, i) => (
          <div
            key={`rain-${i}`}
            className="absolute bg-gradient-to-b from-blue-300/0 via-blue-400/80 to-blue-300/0 rounded-full w-[2px] h-[25px] animate-rain-fall"
            style={{
              left: `${(i * 17) % 100}%`,
              animationDelay: `${(i * 0.3) % 2}s`,
              animationDuration: `${0.8 + ((i * 13) % 10) / 10}s`,
            }}
          />
        ))}
      </div>

      {/* ☁️ Moving Clouds (Background) - SEAMLESS LOOP */}
      <div className="absolute top-[5%] -left-[10%] w-[250%] animate-clouds-slow">
        <svg viewBox="0 0 1000 120" className="w-full h-auto opacity-70" fill="#ffffff" style={{ filter: 'drop-shadow(0px 8px 6px rgba(0,0,0,0.05))' }} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0 80 C 20 60, 40 60, 50 80 C 70 50, 90 50, 100 80 C 130 40, 160 40, 180 80 C 200 60, 230 60, 250 80 C 280 40, 310 40, 340 80 C 360 60, 380 60, 400 80 C 430 40, 460 40, 480 80 C 500 60, 530 60, 550 80 C 580 40, 610 40, 640 80 C 660 60, 680 60, 700 80 C 730 40, 760 40, 780 80 C 800 60, 830 60, 850 80 C 880 40, 910 40, 940 80 C 960 60, 980 60, 1000 80 L1000 120 L0 120 Z" />
        </svg>
      </div>
+
+      {/* ☁️ Extra Clouds (High Background) */}
+      <div className="absolute top-[12%] -left-[10%] w-[200%] animate-clouds-slow opacity-50" style={{ animationDuration: '75s' }}>
+        <svg viewBox="0 0 1000 120" className="w-full h-auto" fill="#ffffff" style={{ filter: 'drop-shadow(0px 8px 6px rgba(0,0,0,0.03))' }} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
+          <path d="M0 80 C 20 60, 40 60, 50 80 C 70 50, 90 50, 100 80 C 130 40, 160 40, 180 80 C 200 60, 230 60, 250 80 C 280 40, 310 40, 340 80 C 360 60, 380 60, 400 80 C 430 40, 460 40, 480 80 C 500 60, 530 60, 550 80 C 580 40, 610 40, 640 80 C 660 60, 680 60, 700 80 C 730 40, 760 40, 780 80 C 800 60, 830 60, 850 80 C 880 40, 910 40, 940 80 C 960 60, 980 60, 1000 80 L1000 120 L0 120 Z" />
+        </svg>
+      </div>

      {/* 🦅 Flying Birds (Far Background) */}
      <div className="absolute top-[15%] left-0 w-[150%] animate-clouds-med" style={{ animationDuration: '45s' }}>
        <svg viewBox="0 0 400 100" className="w-[300px] h-auto opacity-50" fill="none" stroke="#6B7280" strokeWidth="3" strokeLinecap="round" xmlns="http://www.w3.org/2000/svg">
          <g className="animate-bird-flap">
            <path d="M10 20 Q 20 10 30 20 Q 40 10 50 20" />
            <path d="M70 40 Q 80 30 90 40 Q 100 30 110 40" />
            <path d="M130 15 Q 140 5 150 15 Q 160 5 170 15" />
          </g>
        </svg>
      </div>

      {/* ☁️ Moving Clouds (Midground) - SEAMLESS LOOP */}
      <div className="absolute top-[25%] -left-[10%] w-[300%] animate-clouds-med">
        <svg viewBox="0 0 1000 120" className="w-full h-auto opacity-80" fill="#ffffff" style={{ filter: 'drop-shadow(0px 12px 10px rgba(0,0,0,0.06))' }} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0 80 C 25 50, 50 50, 60 80 C 90 40, 120 40, 140 80 C 165 50, 190 50, 200 80 C 230 40, 260 40, 280 80 C 305 50, 330 50, 340 80 C 370 40, 400 40, 420 80 C 445 50, 470 50, 480 80 C 510 40, 540 40, 560 80 C 585 50, 610 50, 620 80 C 650 40, 680 40, 700 80 C 725 50, 750 50, 760 80 C 790 40, 820 40, 840 80 C 865 50, 890 50, 900 80 C 930 40, 960 40, 980 80 C 990 65, 995 65, 1000 80 L1000 120 L0 120 Z" />
        </svg>
      </div>

      {/* ⛰️ Soft rolling hills (Back) */}
      <div className={`absolute bottom-0 left-0 right-0 h-[28vh] w-full transition-all duration-1000 ${isNightMode ? 'brightness-50' : 'brightness-100'}`} style={{ filter: 'drop-shadow(0px -4px 12px rgba(34, 197, 94, 0.2))' }}>
        <svg viewBox="0 0 1000 200" className="w-full h-full" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 100 Q 250 -20 500 100 T 1000 100 V200 H0 Z" fill="#86EFAC" />

          {/* 🌲 Trees on Back Hill */}
          <g fill="#22C55E">
            <path d="M150 80 L140 110 L160 110 Z" />
            <rect x="147" y="110" width="6" height="8" fill="#92400E" />

            <path d="M300 30 L290 60 L310 60 Z" />
            <rect x="297" y="60" width="6" height="8" fill="#92400E" />

            <path d="M750 110 L740 140 L760 140 Z" />
            <rect x="747" y="140" width="6" height="8" fill="#92400E" />
          </g>
        </svg>
      </div>

      {/* 🐻 Sleepy Bear on the back hill */}
      <div className="absolute bottom-[20%] left-[65%] w-[80px] h-[60px] animate-breathe opacity-90 drop-shadow-md">
        <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 70 Q 50 30 80 70 Z" fill="#92400E" />
          <circle cx="30" cy="50" r="10" fill="#92400E" />
          <circle cx="70" cy="50" r="10" fill="#92400E" />
          <circle cx="50" cy="65" r="15" fill="#D97706" />
          <path d="M45 60 Q 50 65 55 60" stroke="#4B5563" strokeWidth="2" fill="none" />
          <circle cx="42" cy="55" r="2" fill="#4B5563" />
          <circle cx="58" cy="55" r="2" fill="#4B5563" />
          <text x="35" y="40" fontSize="12" fill="#6B7280" className="animate-pulse">Z</text>
          <text x="50" y="25" fontSize="16" fill="#6B7280" className="animate-pulse" style={{ animationDelay: '0.5s' }}>z</text>
        </svg>
      </div>

      {/* ⛰️ Soft rolling hills (Front) */}
      <div className={`absolute bottom-0 left-0 right-0 h-[20vh] w-full transition-all duration-1000 ${isNightMode ? 'brightness-[0.4] hue-rotate-15' : 'brightness-100'}`} style={{ filter: 'drop-shadow(0px -8px 16px rgba(21, 128, 61, 0.25))' }}>
        <svg viewBox="0 0 1000 200" className="w-full h-full" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 150 Q 250 20 500 150 T 1000 150 V200 H0 Z" fill="#4ADE80" />

          {/* 🌲 Trees on Front Hill */}
          <g fill="#16A34A">
            <path d="M100 135 L85 175 L115 175 Z" />
            <rect x="96" y="175" width="8" height="10" fill="#78350F" />

            <path d="M450 90 L435 130 L465 130 Z" />
            <rect x="446" y="130" width="8" height="10" fill="#78350F" />

            <path d="M850 145 L835 185 L865 185 Z" />
            <rect x="846" y="185" width="8" height="10" fill="#78350F" />
          </g>
        </svg>
      </div>

      {/* 🐰 Bunny Peeking from front hill */}
      <div className="absolute bottom-[10%] left-[25%] w-[60px] h-[60px] animate-peek z-10 drop-shadow-md">
        <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path d="M30 40 Q 50 10 70 40" fill="#FFFFFF" />
          <path d="M35 40 Q 40 20 45 40" fill="#F472B6" />
          <path d="M55 40 Q 60 20 65 40" fill="#F472B6" />
          <circle cx="50" cy="65" r="25" fill="#FFFFFF" />
          <circle cx="40" cy="60" r="3" fill="#1F2937" />
          <circle cx="60" cy="60" r="3" fill="#1F2937" />
          <path d="M48 68 Q 50 72 52 68" stroke="#1F2937" strokeWidth="2" fill="none" />
          <circle cx="50" cy="65" r="2" fill="#F472B6" />
        </svg>
      </div>

      {/* 🐼 Waving Panda */}
      <div className="absolute bottom-[2%] left-[80%] w-[70px] h-[70px] z-10 drop-shadow-md">
        <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <circle cx="30" cy="30" r="12" fill="#1F2937" />
          <circle cx="70" cy="30" r="12" fill="#1F2937" />
          <circle cx="50" cy="50" r="30" fill="#FFFFFF" />
          <circle cx="40" cy="45" r="10" fill="#1F2937" />
          <circle cx="60" cy="45" r="10" fill="#1F2937" />
          <circle cx="42" cy="43" r="3" fill="#FFFFFF" />
          <circle cx="62" cy="43" r="3" fill="#FFFFFF" />
          <circle cx="50" cy="55" r="4" fill="#1F2937" />
          <path d="M 45 60 Q 50 65 55 60" stroke="#1F2937" strokeWidth="2" fill="none" />
          {/* Waving Arm */}
          <g className="animate-wave" style={{ transformOrigin: '75px 60px' }}>
            <rect x="70" y="50" width="25" height="15" rx="8" fill="#1F2937" />
          </g>
        </svg>
      </div>

    </div>
  )
}
