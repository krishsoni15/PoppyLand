'use client'

import { useEffect, useRef, useState } from 'react'

// Cute custom cursor only for the home page.
// Arrow = small colorful arrow. Pointer = sparkle wand.

export default function HomeCursor() {
  const [pos, setPos] = useState({ x: -200, y: -200 })
  const [isPointer, setIsPointer] = useState(false)
  const [clicked, setClicked] = useState(false)
  const [visible, setVisible] = useState(false)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (isTouch) return

    let tx = -200, ty = -200
    let cx = -200, cy = -200

    const tick = () => {
      cx += (tx - cx) * 0.92
      cy += (ty - cy) * 0.92
      setPos({ x: cx, y: cy })
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    const onMove = (e: MouseEvent) => {
      tx = e.clientX
      ty = e.clientY
      if (!visible) setVisible(true)
      const el = e.target as HTMLElement
      const ptr =
        el.tagName === 'A' || el.tagName === 'BUTTON' ||
        el.closest('a') || el.closest('button') ||
        el.getAttribute('role') === 'button' ||
        window.getComputedStyle(el).cursor === 'pointer'
      setIsPointer(!!ptr)
    }
    const onDown = () => setClicked(true)
    const onUp = () => setClicked(false)
    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
    }
  }, [visible])

  if (!visible) return null

  const scale = clicked ? 0.85 : 1

  return (
    <>
      {/* Hide default cursor on this page */}
      <style dangerouslySetInnerHTML={{ __html: `* { cursor: none !important; }` }} />

      <div
        className="pointer-events-none fixed z-[9999]"
        style={{
          left: pos.x,
          top: pos.y,
          transform: `translate(-4px, -2px) scale(${scale})`,
          transition: 'transform 0.08s ease',
        }}
        aria-hidden="true"
      >
        {isPointer ? (
          // Hand pointer for clickable things
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
            style={{ filter: 'drop-shadow(0 3px 8px rgba(168,85,247,0.9))' }}>
            <path d="M9 11V6a1.5 1.5 0 0 1 3 0v4M12 10V5a1.5 1.5 0 0 1 3 0v5M15 9.5V7a1.5 1.5 0 0 1 3 0v6c0 3.866-2.686 7-6 7-3.314 0-6-3.134-6-7v-2l1.293-1.293A1 1 0 0 1 9 9.414V11"
              stroke="#7C28D4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="#FECA57"/>
          </svg>
        ) : (
          // Arrow cursor
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
            style={{ filter: 'drop-shadow(0 3px 7px rgba(255,107,107,0.8))' }}>
            <path d="M4 2L4 18L8.5 13.5L11.5 20L13.5 19L10.5 12.5L17 12.5L4 2Z"
              fill="#FF6B6B" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
    </>
  )
}
