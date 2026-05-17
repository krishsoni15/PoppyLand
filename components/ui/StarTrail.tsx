'use client'

import { useEffect, useState } from 'react'

interface Star {
  id: number
  x: number
  y: number
  color: string
  size: number
  angle: number
}

const COLORS = [
  '#FF6B6B', // beautiful coral red
  '#FFD93D', // bright sunshine yellow
  '#6BCB77', // playground green
  '#4D96FF', // sky blue
  '#D885FF', // brand purple
  '#FF8E9E', // pastel pink
]

export default function StarTrail() {
  const [stars, setStars] = useState<Star[]>([])

  useEffect(() => {
    let lastSpawn = 0
    
    const handleMove = (e: MouseEvent | TouchEvent) => {
      const now = Date.now()
      // Throttle spawning to every 35ms to ensure buttery smooth performance
      if (now - lastSpawn < 35) return
      lastSpawn = now

      let clientX = 0
      let clientY = 0

      if ('touches' in e) {
        if (e.touches.length === 0) return
        clientX = e.touches[0].clientX
        clientY = e.touches[0].clientY
      } else {
        clientX = e.clientX
        clientY = e.clientY
      }

      const newStar: Star = {
        id: now + Math.random(),
        x: clientX,
        y: clientY,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: Math.random() * 20 + 16, // size from 16px to 36px
        angle: Math.random() * 360,
      }

      setStars((prev) => [...prev.slice(-20), newStar]) // cap active stars to 20 to preserve speed
    }

    window.addEventListener('mousemove', handleMove, { passive: true })
    window.addEventListener('touchmove', handleMove, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('touchmove', handleMove)
    }
  }, [])

  // Prune expired stars automatically
  useEffect(() => {
    if (stars.length === 0) return
    const timer = setTimeout(() => {
      setStars((prev) => prev.slice(1))
    }, 750)
    return () => clearTimeout(timer)
  }, [stars])

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none">
      {stars.map((star) => (
        <span
          key={star.id}
          className="absolute inline-block pointer-events-none animate-star-fade"
          style={{
            left: star.x,
            top: star.y,
            color: star.color,
            fontSize: `${star.size}px`,
            textShadow: `0 0 8px ${star.color}`,
          }}
        >
          ⭐
        </span>
      ))}
    </div>
  )
}
