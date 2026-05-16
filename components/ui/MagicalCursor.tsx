'use client'

import React, { useEffect, useState } from 'react'

interface Star {
  id: number
  x: number
  y: number
  color: string
}

export default function MagicalCursor() {
  const [stars, setStars] = useState<Star[]>([])
  
  useEffect(() => {
    let idCounter = 0
    let lastTime = 0

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now()
      // Limit to max 1 star every 30ms to avoid DOM overload
      if (now - lastTime < 30) return
      lastTime = now

      if (Math.random() > 0.3) {
        const colors = ['#FF6B6B', '#FECA57', '#4D96FF', '#A855F7', '#4ADE80']
        const color = colors[Math.floor(Math.random() * colors.length)]
        
        const newStar: Star = {
          id: idCounter++,
          x: e.clientX,
          y: e.clientY,
          color
        }
        
        setStars(prev => [...prev.slice(-15), newStar]) // keep max 15
        
        setTimeout(() => {
          setStars(prev => prev.filter(s => s.id !== newStar.id))
        }, 800)
      }
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden" aria-hidden="true">
      {stars.map(s => (
        <div
          key={s.id}
          className="absolute font-bold drop-shadow-md animate-[cursor-star-fade_0.8s_ease-out_forwards]"
          style={{
            left: s.x - 10,
            top: s.y - 10,
            color: s.color,
            fontSize: '18px',
            textShadow: `0 0 8px ${s.color}`
          }}
        >
          ✦
        </div>
      ))}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes cursor-star-fade {
          0% { opacity: 0.8; transform: scale(1) translateY(0) rotate(0deg); }
          100% { opacity: 0; transform: scale(0.2) translateY(30px) rotate(90deg); }
        }
        
        /* Global Custom Cursor overrides */
        body, * {
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="%23FFFFFF" stroke="%23A855F7" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/></svg>') 4 4, auto !important;
        }
        a:hover, button:hover, [role="button"]:hover, .dash-card:hover {
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="%23FECA57" stroke="%23FF6B6B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/></svg>') 4 4, pointer !important;
        }
      `}} />
    </div>
  )
}
