'use client'

import { memo, useCallback } from 'react'

interface LetterCardProps {
  label: string
  color: string
  textColor?: string
  isActive: boolean
  onClick: (label: string) => void
  ariaLabel: string
  hotkey?: string | undefined
  staggerIndex?: number
}

const LetterCard = memo(function LetterCard({
  label,
  color,
  textColor = 'text-white',
  isActive,
  onClick,
  ariaLabel,
  hotkey,
  staggerIndex,
}: LetterCardProps) {
  const handleClick = useCallback(() => onClick(label), [label, onClick])

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={ariaLabel}
      aria-pressed={isActive}
      style={staggerIndex !== undefined ? { animationDelay: `${staggerIndex * 0.03}s` } : undefined}
      className={`
        ${color} ${textColor} btn-3d btn-juice relative font-fredoka
        ${staggerIndex !== undefined ? 'letter-wiggle-in' : ''}
        text-2xl sm:text-3xl md:text-4xl
        min-w-[3.25rem] min-h-[3.25rem] sm:min-w-[4rem] sm:min-h-[4rem]
        rounded-2xl transition-all duration-200 select-none
        hover:brightness-110 focus-visible:ring-4 focus-visible:ring-white
        ${isActive ? 'scale-110 ring-4 ring-white brightness-110 z-10' : 'opacity-95 hover:opacity-100'}
      `}
    >
      {hotkey != null && hotkey !== '' && !isActive && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-md bg-white/95 text-[10px] font-bold text-gray-500 shadow-sm">
          {hotkey}
        </span>
      )}
      {label}
    </button>
  )
})

export default LetterCard
