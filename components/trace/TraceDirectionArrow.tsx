'use client'

import { motion } from 'framer-motion'
import type { NormPoint } from '@/lib/handwriting-validation'

interface TraceDirectionArrowProps {
  ghostPath: NormPoint[]
  containerWidth: number
}

export default function TraceDirectionArrow({
  ghostPath,
  containerWidth,
}: TraceDirectionArrowProps) {
  if (ghostPath.length < 2) return null

  const start = ghostPath[0]
  const next = ghostPath[Math.min(3, ghostPath.length - 1)]
  const left = (start.x / 100) * containerWidth
  const top = (start.y / 100) * containerWidth
  const angle =
    (Math.atan2(next.y - start.y, next.x - start.x) * 180) / Math.PI

  return (
    <motion.div
      className="pointer-events-none absolute z-20 text-4xl drop-shadow-md sm:text-5xl"
      style={{ left: left - 20, top: top - 28, rotate: angle }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: [1, 1.15, 1], x: [0, 6, 0] }}
      transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
      aria-hidden
    >
      👆
    </motion.div>
  )
}
