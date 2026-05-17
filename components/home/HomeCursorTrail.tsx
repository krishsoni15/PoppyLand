'use client'

import { useEffect, useRef } from 'react'

const COLORS = ['#FF6B6B', '#FECA57', '#4D96FF', '#A855F7', '#6BCB77', '#FF6BB5', '#4ECDC4', '#FFD93D']

type Star = {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  color: string
  size: number
  rotation: number
  spin: number
}

function drawStar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  outer: number,
  rotation: number,
  color: string,
  alpha: number,
) {
  const inner = outer * 0.42
  const spikes = 5
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rotation)
  ctx.globalAlpha = alpha
  ctx.beginPath()
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outer : inner
    const a = (Math.PI / spikes) * i - Math.PI / 2
    ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r)
  }
  ctx.closePath()
  ctx.fillStyle = color
  ctx.fill()
  // White outline so stars pop on any background
  ctx.strokeStyle = 'rgba(255,255,255,0.7)'
  ctx.lineWidth = Math.max(1, outer * 0.13)
  ctx.stroke()
  ctx.restore()
}

export default function HomeCursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (isTouch) return

    let stars: Star[] = []
    let mouse = { x: -200, y: -200 }
    let lastMouse = { x: -200, y: -200 }

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const spawn = (x: number, y: number) => {
      stars.push({
        x: x + (Math.random() - 0.5) * 8,
        y: y + (Math.random() - 0.5) * 8,
        vx: (Math.random() - 0.5) * 1.4,
        vy: (Math.random() - 0.5) * 1.4 - 0.5,
        life: 1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        // Bigger stars: 6–14px outer radius
        size: 6 + Math.random() * 8,
        rotation: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.1,
      })
      if (stars.length > 90) stars = stars.slice(-90)
    }

    const spawnBurst = (x: number, y: number) => {
      for (let i = 0; i < 18; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = Math.random() * 4 + 1.5
        stars.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1.1,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          size: 8 + Math.random() * 10,
          rotation: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 0.15,
        })
      }
      if (stars.length > 130) stars = stars.slice(-130)
    }

    const onMouseMove = (e: MouseEvent) => {
      lastMouse.x = mouse.x
      lastMouse.y = mouse.y
      mouse.x = e.clientX
      mouse.y = e.clientY

      const dx = mouse.x - lastMouse.x
      const dy = mouse.y - lastMouse.y
      const dist = Math.hypot(dx, dy)

      // 1 star every ~6px of movement
      const steps = Math.min(Math.floor(dist / 6) + 1, 6)
      for (let i = 0; i < steps; i++) {
        const t = (i + 1) / steps
        spawn(lastMouse.x + dx * t, lastMouse.y + dy * t)
      }
    }

    const onMouseDown = (e: MouseEvent) => spawnBurst(e.clientX, e.clientY)

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mousedown', onMouseDown)

    let reqId = 0
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = stars.length - 1; i >= 0; i--) {
        const s = stars[i]
        s.x += s.vx
        s.y += s.vy
        s.vy += 0.05   // gentle gravity
        s.vx *= 0.97
        s.vy *= 0.97
        s.rotation += s.spin
        s.life -= 0.028
        s.size *= 0.978

        if (s.life <= 0 || s.size < 1) {
          stars.splice(i, 1)
          continue
        }

        // Soft glow behind each star
        const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 2)
        glow.addColorStop(0, s.color + 'aa')
        glow.addColorStop(1, 'transparent')
        ctx.globalAlpha = s.life * 0.35
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.size * 2, 0, Math.PI * 2)
        ctx.fill()

        drawStar(ctx, s.x, s.y, s.size, s.rotation, s.color, Math.min(1, s.life))
      }

      ctx.globalAlpha = 1
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
      className="pointer-events-none fixed inset-0 z-[9998] select-none"
      aria-hidden="true"
    />
  )
}
