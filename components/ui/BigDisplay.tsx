'use client'

interface BigDisplayProps {
  value: string
  color?: string
  animate?: boolean
}

export default function BigDisplay({ value, color, animate = true }: BigDisplayProps) {
  return (
    <div
      className={`
        display-stage card-glass relative flex min-h-[11rem] min-w-[11rem]
        items-center justify-center rounded-[2.5rem] px-8 py-6
        sm:min-h-[13rem] sm:min-w-[13rem]
        ${animate ? 'animate-pop' : ''}
      `}
      aria-live="polite"
    >
      <div
        className="pointer-events-none absolute inset-3 rounded-[2rem] opacity-30"
        style={{
          background: color
            ? `radial-gradient(circle at 30% 30%, ${color}55, transparent 70%)`
            : 'radial-gradient(circle at 30% 30%, rgba(255,107,107,0.35), transparent 70%)',
        }}
      />
      <span
        className="relative font-fredoka text-[7rem] sm:text-[9rem] md:text-[10rem] leading-none drop-shadow-md"
        style={{ color: color ?? '#FF6B6B' }}
      >
        {value}
      </span>
    </div>
  )
}
