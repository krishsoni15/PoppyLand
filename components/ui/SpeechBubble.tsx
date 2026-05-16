import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface SpeechBubbleProps {
  text: string
  visible: boolean
  direction?: 'up' | 'down' | 'left' | 'right'
}

export default function SpeechBubble({ text, visible, direction = 'up' }: SpeechBubbleProps) {
  const [show, setShow] = useState(visible)

  useEffect(() => {
    if (visible) {
      setShow(true)
    } else {
      const t = setTimeout(() => setShow(false), 500) // auto-hide delay
      return () => clearTimeout(t)
    }
  }, [visible])

  if (!show && !visible) return null

  // Triangle positioning based on direction
  const triangleStyles = {
    up: 'bottom-[-8px] left-1/2 -translate-x-1/2 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-white',
    down: 'top-[-8px] left-1/2 -translate-x-1/2 border-l-[8px] border-r-[8px] border-b-[8px] border-l-transparent border-r-transparent border-b-white',
    left: 'right-[-8px] top-1/2 -translate-y-1/2 border-t-[8px] border-b-[8px] border-l-[8px] border-t-transparent border-b-transparent border-l-white',
    right: 'left-[-8px] top-1/2 -translate-y-1/2 border-t-[8px] border-b-[8px] border-r-[8px] border-t-transparent border-b-transparent border-r-white',
  }

  const origins = {
    up: 'bottom',
    down: 'top',
    left: 'right',
    right: 'left'
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ type: 'spring', bounce: 0.5, duration: 0.5 }}
          style={{ transformOrigin: origins[direction] }}
          className="absolute z-50 pointer-events-none"
        >
          <div className="relative bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] px-4 py-3 min-w-[120px] max-w-[220px]">
            <p className="font-fredoka text-[14px] text-gray-800 break-words leading-tight text-center">
              {text}
            </p>
            <div className={`absolute w-0 h-0 ${triangleStyles[direction]}`} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
