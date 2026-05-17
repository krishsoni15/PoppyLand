'use client'

import { useEffect, useRef } from 'react'

const COLORS = [
  '#FF6B6B',
  '#FFD93D',
  '#6BCB77',
  '#4D96FF',
  '#D885FF',
  '#FF8E9E',
  '#FECA57',
]

const CLICK_COLORS = ['#FFD93D', '#FECA57', '#FF8E9E', '#D885FF', '#4D96FF']

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  color: string
  rotation: number
  spin: number
  filled: boolean
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function drawStar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  outer: number,
  rotation: number,
  color: string,
  alpha: number,
  filled: boolean,
) {
  const inner = outer * 0.45
  const spikes = 5
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rotation)
  ctx.globalAlpha = alpha
  ctx.beginPath()
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outer : inner
    const a = (Math.PI / spikes) * i - Math.PI / 2
    const px = Math.cos(a) * r
    const py = Math.sin(a) * r
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.closePath()
  if (filled) {
    ctx.fillStyle = color
    ctx.fill()
    ctx.strokeStyle = 'rgba(45, 35, 55, 0.55)'
    ctx.lineWidth = Math.max(1.2, outer * 0.12)
    ctx.stroke()
  } else {
    ctx.strokeStyle = color
    ctx.lineWidth = Math.max(1.5, outer * 0.14)
    ctx.lineJoin = 'round'
    ctx.stroke()
    ctx.fillStyle = color
    ctx.globalAlpha = alpha * 0.35
    ctx.fill()
  }
  ctx.restore()
}

export default function StarTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (isTouch) return

    let particles: Particle[] = []
    let mouse = { x: -200, y: -200 }
    let lastMouse = { x: -200, y: -200 }

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const spawnTrail = (x: number, y: number, count: number) => {
      for (let i = 0; i < count; i++) {
        particles.push({
          x: x + (Math.random() - 0.5) * 6,
          y: y + (Math.random() - 0.5) * 6,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4 + 0.2,
          life: 1,
          maxLife: 1,
          size: 3 + Math.random() * 4,   // was 10–24, now 3–7
          color: pick(COLORS),
          rotation: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 0.08,
          filled: false,
        })
      }
      if (particles.length > 55) {        // was 140
        particles = particles.slice(-55)
      }
    }

    const spawnBurst = (x: number, y: number) => {
      for (let i = 0; i < 16; i++) {     // was 42
        const angle = Math.random() * Math.PI * 2
        const speed = Math.random() * 3.5 + 1
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          maxLife: 1,
          size: 4 + Math.random() * 5,   // was 14–32
          color: pick(CLICK_COLORS),
          rotation: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 0.12,
          filled: true,
        })
      }
    }

    const onPointer = (clientX: number, clientY: number) => {
      lastMouse.x = mouse.x
      lastMouse.y = mouse.y
      mouse.x = clientX
      mouse.y = clientY

      const dx = mouse.x - lastMouse.x
      const dy = mouse.y - lastMouse.y
      const dist = Math.hypot(dx, dy)
      if (dist < 1) {
        spawnTrail(mouse.x, mouse.y, 1)
        return
      }

      const steps = Math.min(Math.floor(dist / 8) + 1, 6)  // was /3, max 14
      for (let i = 0; i < steps; i++) {
        const t = (i + 1) / steps
        spawnTrail(lastMouse.x + dx * t, lastMouse.y + dy * t, 1)
      }
    }

    const onMouseMove = (e: MouseEvent) => onPointer(e.clientX, e.clientY)
    const onMouseDown = (e: MouseEvent) => spawnBurst(e.clientX, e.clientY)

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mousedown', onMouseDown)

    let reqId = 0
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.98
        p.vy *= 0.98
        p.rotation += p.spin
        p.life -= p.filled ? 0.04 : 0.032   // was 0.018 / 0.012 — faster fade
        p.size *= 0.985

        if (p.life <= 0 || p.size < 1.5) {
          particles.splice(i, 1)
          continue
        }

        const alpha = Math.max(0, p.life / p.maxLife)
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 1.8)
        glow.addColorStop(0, p.color)
        glow.addColorStop(1, 'transparent')
        ctx.globalAlpha = alpha * 0.25
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 1.8, 0, Math.PI * 2)
        ctx.fill()

        drawStar(ctx, p.x, p.y, p.size, p.rotation, p.color, alpha, p.filled)
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
      className="star-trail-root pointer-events-none fixed inset-0 z-[9998] select-none"
      aria-hidden="true"
    />
  )
}
