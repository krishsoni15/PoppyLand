'use client'

import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 })
  const [isPointer, setIsPointer] = useState(false)
  const [clicked, setClicked] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (isTouchDevice) return

    let targetX = -100
    let targetY = -100
    let currentX = -100
    let currentY = -100

    // Smooth follow animation - almost instantaneous so glitter spawns correctly behind it
    const animate = () => {
      currentX += (targetX - currentX) * 0.95
      currentY += (targetY - currentY) * 0.95
      setPosition({ x: currentX, y: currentY })
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX
      targetY = e.clientY
      if (!isVisible) setIsVisible(true)

      const target = e.target as HTMLElement
      const clickable =
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') !== null ||
        target.closest('button') !== null ||
        target.getAttribute('role') === 'button' ||
        window.getComputedStyle(target).cursor === 'pointer'

      setIsPointer(clickable)
    }

    const onMouseDown = () => setClicked(true)
    const onMouseUp = () => setClicked(false)
    const onMouseLeave = () => setIsVisible(false)
    const onMouseEnter = () => setIsVisible(true)

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseenter', onMouseEnter)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mouseenter', onMouseEnter)
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        * { cursor: none !important; }
      ` }} />
      <div
        className="pointer-events-none fixed z-[9999]"
        style={{
          left: position.x,
          top: position.y,
          transform: 'translate(-4px, -2px)',
        }}
        aria-hidden="true"
      >
        {isPointer ? (
          /* Hand pointer cursor */
          <svg
            width={clicked ? 26 : 28}
            height={clicked ? 26 : 28}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              filter: 'drop-shadow(0 2px 6px rgba(168,85,247,0.55))',
              transition: 'width 0.1s, height 0.1s',
            }}
          >
            {/* Palm */}
            <path
              d="M9 12V6a1.5 1.5 0 0 1 3 0v4.5M12 10.5V5a1.5 1.5 0 0 1 3 0v5.5M15 10V7a1.5 1.5 0 0 1 3 0v6c0 3.866-2.686 7-6 7-3.314 0-6-3.134-6-7v-2l1.293-1.293A1 1 0 0 1 9 9.414V12"
              stroke="#A855F7"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="white"
            />
          </svg>
        ) : (
          /* Arrow cursor */
          <svg
            width={clicked ? 20 : 24}
            height={clicked ? 20 : 24}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              filter: 'drop-shadow(0 2px 6px rgba(255,107,107,0.55))',
              transition: 'width 0.1s, height 0.1s',
              transform: clicked ? 'scale(0.9)' : 'scale(1)',
            }}
          >
            <path
              d="M4 2L4 18L8.5 13.5L11.5 20L13.5 19L10.5 12.5L17 12.5L4 2Z"
              fill="#FF6B6B"
              stroke="white"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
    </>
  )
}
