'use client'

import { useEffect, useRef } from 'react'

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let particles: { x: number; y: number; vx: number; vy: number; life: number; color: string; size: number }[] = []
    
    // Colorful glitter palette for PoppyLand
    const colors = ['#FECA57', '#FF6B6B', '#4D96FF', '#A855F7', '#6BCB77', '#FF6BB5']

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    let mouse = { x: -100, y: -100 }
    let lastMouse = { x: -100, y: -100 }

    const onMouseMove = (e: MouseEvent) => {
      lastMouse.x = mouse.x
      lastMouse.y = mouse.y
      mouse.x = e.clientX
      mouse.y = e.clientY

      const dx = mouse.x - lastMouse.x
      const dy = mouse.y - lastMouse.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      
      const spawnCount = Math.min(Math.floor(dist / 4) + 1, 8)
      
      for (let i = 0; i < spawnCount; i++) {
        particles.push({
          x: lastMouse.x + (dx * i) / spawnCount + (Math.random() - 0.5) * 12,
          y: lastMouse.y + (dy * i) / spawnCount + (Math.random() - 0.5) * 12,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2 + 0.5,
          life: 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 4 + 2.5,
        })
      }
    }

    const onMouseDown = (e: MouseEvent) => {
      // Big magical burst on click!
      for (let i = 0; i < 35; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = Math.random() * 8 + 2
        particles.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1.2,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 5 + 3,
        })
      }
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mousedown', onMouseDown)

    let reqId: number
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.life -= 0.03
        p.size *= 0.96

        if (p.life <= 0) {
          particles.splice(i, 1)
          continue
        }

        ctx.globalAlpha = Math.max(0, p.life)
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      }

      reqId = requestAnimationFrame(draw)
    }
    reqId = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mousedown', onMouseDown)
      cancelAnimationFrame(reqId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[100]"
      style={{ mixBlendMode: 'screen' }}
      aria-hidden="true"
    />
  )
}
