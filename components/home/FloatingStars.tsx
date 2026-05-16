'use client'

import React, { useState, useEffect, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface FloatingStarsProps {
  isVisible: boolean
}

function FloatingStars({ isVisible }: FloatingStarsProps) {
  const [shootingStar, setShootingStar] = useState<any>(null)

  useEffect(() => {
    if (!isVisible) return

    const triggerShootingStar = () => {
      const id = Date.now()
      setShootingStar({
        id,
        x: `${100 + Math.random() * 20}%`,
        y: `${Math.random() * 30}%`,
      })
      setTimeout(() => {
        setShootingStar((prev: any) => (prev?.id === id ? null : prev))
      }, 1000)

      const nextTime = 15000 + Math.random() * 5000
      timeoutId = setTimeout(triggerShootingStar, nextTime)
    }

    let timeoutId = setTimeout(triggerShootingStar, 5000 + Math.random() * 10000)

    return () => clearTimeout(timeoutId)
  }, [isVisible])

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-10" aria-hidden="true">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="absolute inset-0"
          >
            {/* 6 Fireflies only — lightweight */}
            {[...Array(6)].map((_, i) => (
              <div
                key={`firefly-${i}`}
                className="absolute bg-[#FFF59D] rounded-full w-1.5 h-1.5"
                style={{
                  left: `${10 + (i * 15) % 80}%`,
                  bottom: `${5 + (i * 7) % 25}%`,
                  boxShadow: '0 0 6px #FFF59D',
                  animation: `firefly-float ${4 + (i % 3)}s infinite ease-in-out ${i * 0.5}s`,
                }}
              />
            ))}

            {/* Shooting Star */}
            <AnimatePresence>
              {shootingStar && (
                <motion.div
                  key={shootingStar.id}
                  initial={{ opacity: 1, x: 0, y: 0 }}
                  animate={{ opacity: 0, x: -600, y: 600 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="absolute"
                  style={{
                    left: shootingStar.x,
                    top: shootingStar.y,
                  }}
                >
                  <div className="w-[150px] h-[2px] bg-white transform -rotate-45" />
                </motion.div>
              )}
            </AnimatePresence>

            <style dangerouslySetInnerHTML={{__html: `
              @keyframes firefly-float {
                0%, 100% { transform: translate(0, 0); opacity: 0.4; }
                33% { transform: translate(15px, -15px); opacity: 1; }
                66% { transform: translate(-10px, -25px); opacity: 0.6; }
              }
            `}} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default memo(FloatingStars)
