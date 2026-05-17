'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

interface TraceSuccessOverlayProps {
  stars: number
  message: string
  nextHref: string | null
  onClose: () => void
}

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex justify-center gap-2 text-5xl sm:text-6xl" aria-label={`${count} stars`}>
      {[1, 2, 3].map((i) => (
        <motion.span
          key={i}
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.15 * i, type: 'spring', stiffness: 400 }}
        >
          {i <= count ? '⭐' : '☆'}
        </motion.span>
      ))}
    </div>
  )
}

export default function TraceSuccessOverlay({
  stars,
  message,
  nextHref,
  onClose,
}: TraceSuccessOverlayProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="trace-success-title"
    >
      <motion.div
        className="card-glass w-full max-w-md rounded-[2rem] p-8 text-center shadow-2xl"
        initial={{ scale: 0.6, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      >
        <p className="text-6xl" aria-hidden>
          🎉
        </p>
        <h2
          id="trace-success-title"
          className="mt-2 font-fredoka text-3xl text-brand-green sm:text-4xl"
        >
          Amazing!
        </h2>
        <p className="mt-2 font-nunito text-xl text-gray-600">{message}</p>
        <div className="mt-6">
          <StarRow count={stars} />
        </div>
        <div className="mt-8 flex flex-col gap-3">
          {nextHref && (
            <Link
              href={nextHref}
              className="btn-3d btn-juice min-h-[3.5rem] rounded-2xl bg-brand-green px-6 font-fredoka text-2xl text-white shadow-lg"
              onClick={onClose}
            >
              Next Adventure →
            </Link>
          )}
          <button
            type="button"
            onClick={onClose}
            className="btn-3d card-glass min-h-[3.25rem] rounded-2xl font-fredoka text-xl text-gray-700"
          >
            Trace Again
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
