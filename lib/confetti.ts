export const fireConfetti = async () => {
  const confetti = (await import('canvas-confetti')).default
  confetti({
    particleCount: 180,
    spread: 90,
    origin: { y: 0.55 },
    colors: ['#FF6B6B', '#FECA57', '#6BCB77', '#4D96FF', '#FF6BB5', '#A855F7'],
    ticks: 200,
  })
  setTimeout(() => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.4, x: 0.3 },
      colors: ['#FF9F43', '#4ECDC4'],
    })
  }, 250)
}

export const fireBigConfetti = async () => {
  const confetti = (await import('canvas-confetti')).default
  confetti({ particleCount: 120, spread: 100, origin: { y: 0.5 } })
  setTimeout(() => confetti({ particleCount: 100, spread: 120, origin: { y: 0.6, x: 0.7 } }), 200)
}

export const fireMegaConfetti = async () => {
  const confetti = (await import('canvas-confetti')).default
  const burst = () =>
    confetti({ particleCount: 150, spread: 100, startVelocity: 45, origin: { y: 0.5 } })
  burst()
  setTimeout(burst, 150)
  setTimeout(burst, 300)
}
