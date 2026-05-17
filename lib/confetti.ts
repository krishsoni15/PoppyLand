export const fireConfetti = async () => {
  const confetti = (await import('canvas-confetti')).default
  confetti({
    particleCount: 120,
    spread: 80,
    origin: { y: 0.5 },
    colors: ['#FF6B6B', '#FECA57', '#6BCB77', '#4D96FF', '#FF6BB5', '#A855F7'],
    ticks: 180,
  })
}

export const fireBigConfetti = async () => {
  const confetti = (await import('canvas-confetti')).default
  confetti({
    particleCount: 180,
    spread: 100,
    origin: { y: 0.5 },
    colors: ['#FF6B6B', '#FECA57', '#6BCB77', '#4D96FF', '#FF6BB5', '#A855F7'],
    ticks: 180,
  })
}

export const fireMegaConfetti = async () => {
  const confetti = (await import('canvas-confetti')).default
  confetti({
    particleCount: 260,
    spread: 120,
    origin: { y: 0.5 },
    colors: ['#FF6B6B', '#FECA57', '#6BCB77', '#4D96FF', '#FF6BB5', '#A855F7'],
    ticks: 180,
  })
}
