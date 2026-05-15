'use client'

import { getLetterArt, EmojiFallback } from '@/components/art/CssArt'

interface WordCardProps {
  title: string
  emoji: string
  subtitle?: string
  accentColor?: string
  letter?: string
}

export default function WordCard({
  title,
  emoji,
  subtitle,
  accentColor = '#FF6B6B',
  letter,
}: WordCardProps) {
  const ArtComponent = letter ? getLetterArt(letter) : null

  return (
    <div
      className="card-glass relative overflow-hidden rounded-3xl px-6 py-6 text-center"
      style={{ borderColor: `${accentColor}33` }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1.5"
        style={{
          background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
        }}
      />
      <p className="font-fredoka text-3xl sm:text-4xl text-gray-800">{title}</p>
      {subtitle && (
        <p className="mt-1 font-nunito text-lg font-bold text-gray-500 sm:text-xl">
          {subtitle}
        </p>
      )}
      <div className="mt-4 flex items-center justify-center">
        {ArtComponent ? (
          <ArtComponent size={80} />
        ) : (
          <EmojiFallback emoji={emoji} />
        )}
      </div>
      <span className="sr-only">{title}</span>
    </div>
  )
}
