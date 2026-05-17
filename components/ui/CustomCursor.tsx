'use client'

import { useEffect } from 'react'

/**
 * CustomCursor — zero React state, pure DOM manipulation.
 * Uses pointermove so it works even when canvas has pointer capture.
 * The cursor element is always in the DOM; we just move it via transform.
 */
export default function CustomCursor() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (isTouch) return

    // Build the cursor DOM directly — no React re-renders ever
    const root = document.createElement('div')
    root.setAttribute('aria-hidden', 'true')
    root.style.cssText = `
      position: fixed;
      left: 0; top: 0;
      width: 0; height: 0;
      z-index: 999999;
      pointer-events: none;
      opacity: 0;
      will-change: transform;
    `

    // Arrow SVG
    const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    arrow.setAttribute('width', '38')
    arrow.setAttribute('height', '38')
    arrow.setAttribute('viewBox', '0 0 24 24')
    arrow.setAttribute('fill', 'none')
    arrow.style.cssText = `
      position: absolute;
      top: -2px; left: -4px;
      filter: drop-shadow(0 3px 8px rgba(255,107,107,0.8));
      display: block;
    `
    const arrowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    arrowPath.setAttribute('d', 'M4 2L4 18L8.5 13.5L11.5 20L13.5 19L10.5 12.5L17 12.5L4 2Z')
    arrowPath.setAttribute('fill', '#FF6B6B')
    arrowPath.setAttribute('stroke', 'white')
    arrowPath.setAttribute('stroke-width', '1.8')
    arrowPath.setAttribute('stroke-linejoin', 'round')
    arrow.appendChild(arrowPath)

    // Hand SVG
    const hand = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    hand.setAttribute('width', '46')
    hand.setAttribute('height', '46')
    hand.setAttribute('viewBox', '0 0 24 24')
    hand.setAttribute('fill', 'none')
    hand.style.cssText = `
      position: absolute;
      top: -2px; left: -4px;
      filter: drop-shadow(0 3px 8px rgba(168,85,247,0.8));
      display: none;
    `
    const handPath = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    handPath.setAttribute('d', 'M9 12V6a1.5 1.5 0 0 1 3 0v4.5M12 10.5V5a1.5 1.5 0 0 1 3 0v5.5M15 10V7a1.5 1.5 0 0 1 3 0v6c0 3.866-2.686 7-6 7-3.314 0-6-3.134-6-7v-2l1.293-1.293A1 1 0 0 1 9 9.414V12')
    handPath.setAttribute('stroke', '#A855F7')
    handPath.setAttribute('stroke-width', '1.8')
    handPath.setAttribute('stroke-linecap', 'round')
    handPath.setAttribute('stroke-linejoin', 'round')
    handPath.setAttribute('fill', '#FECA57')
    hand.appendChild(handPath)

    root.appendChild(arrow)
    root.appendChild(hand)
    document.body.appendChild(root)

    // Inject cursor:none globally
    const style = document.createElement('style')
    style.textContent = '* { cursor: none !important; }'
    document.head.appendChild(style)

    let cx = -200
    let cy = -200
    let isPointer = false
    let isDown = false

    const setPos = (x: number, y: number, down: boolean) => {
      cx = x; cy = y; isDown = down
      const s = down ? 0.85 : 1
      root.style.transform = `translate(${x}px, ${y}px) scale(${s})`
      root.style.opacity = '1'
    }

    const onMove = (e: PointerEvent) => {
      setPos(e.clientX, e.clientY, isDown)

      const target = e.target as HTMLElement
      const ptr =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        !!target.closest('a') ||
        !!target.closest('button') ||
        target.getAttribute('role') === 'button'

      if (ptr !== isPointer) {
        isPointer = ptr
        arrow.style.display = ptr ? 'none' : 'block'
        hand.style.display = ptr ? 'block' : 'none'
      }
    }

    const onDown = (e: PointerEvent) => { isDown = true;  setPos(e.clientX, e.clientY, true) }
    const onUp   = (e: PointerEvent) => { isDown = false; setPos(cx, cy, false) }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    window.addEventListener('pointercancel', onUp, { passive: true })

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
      document.body.removeChild(root)
      document.head.removeChild(style)
    }
  }, [])

  return null // renders nothing — cursor is pure DOM
}
