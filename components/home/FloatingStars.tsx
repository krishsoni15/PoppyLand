'use client'

const particles = [
  { shape: '⭐', x: '8%', y: '10%', size: 22, delay: 0, duration: 7 },
  { shape: '✨', x: '82%', y: '15%', size: 18, delay: 1, duration: 9 },
  { shape: '🌟', x: '70%', y: '50%', size: 26, delay: 2, duration: 8 },
  { shape: '💫', x: '15%', y: '62%', size: 20, delay: 3, duration: 10 },
  { shape: '🌸', x: '45%', y: '8%', size: 20, delay: 0.5, duration: 8 },
  { shape: '🦋', x: '55%', y: '75%', size: 22, delay: 4, duration: 9 },
  { shape: '💜', x: '90%', y: '55%', size: 16, delay: 2.5, duration: 7 },
  { shape: '🎵', x: '25%', y: '85%', size: 14, delay: 1.5, duration: 11 },
]

export default function FloatingStars() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute float-drift"
          style={{
            left: p.x,
            top: p.y,
            fontSize: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            opacity: 0.35,
          }}
        >
          {p.shape}
        </span>
      ))}
    </div>
  )
}
