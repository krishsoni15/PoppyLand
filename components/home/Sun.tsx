'use client'

import React, { useState, memo } from 'react'
import { useSpeech } from '@/hooks/useSpeech'
import SpeechBubble from '@/components/ui/SpeechBubble'

interface SunProps {
  position: number
  phase: string
  onClickManualToggle?: () => void
}

const SUN_PHRASES = [
  "I am the Sun! I make everything bright and warm! ☀️",
  "I travel across the sky every single day!",
  "Plants need me to grow! I give them energy!",
  "I am 93 million miles away from Earth!",
  "Without me there would be no day!",
  "I am so hot — 5500 degrees on my surface!",
  "I make rainbows when I shine through rain!"
]

function Sun({ position, phase, onClickManualToggle }: SunProps) {
  const { speak } = useSpeech()
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [speechText, setSpeechText] = useState('')

  const x = 10 + (position * 80)
  const y = 55 - (Math.sin(position * Math.PI) * 45)

  let opacity = 1
  if (position > 0.85) opacity = Math.max(0, 1 - ((position - 0.85) * 6.66))
  if (position < 0.15) opacity = Math.min(1, position * 6.66)

  const isSunset = phase === 'sunset' || phase === 'sunrise' || position > 0.8 || position < 0.2
  const sunColor = isSunset ? '#FF7043' : '#FFD700'

  const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    if (onClickManualToggle) onClickManualToggle()

    if (isSpeaking) return
    const text = SUN_PHRASES[Math.floor(Math.random() * SUN_PHRASES.length)]
    setSpeechText(text)
    setIsSpeaking(true)
    speak(text)

    setTimeout(() => setIsSpeaking(false), 4000)
  }

  if (position > 1.1 || position < -0.1 || opacity <= 0) return null

  return (
    <div
      className="absolute z-[1] pointer-events-auto"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        opacity,
        transform: `translate(-50%, -50%)`,
        transition: 'left 0.25s linear, top 0.25s linear, opacity 0.5s',
      }}
    >
      <div className="relative">
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-[200px] z-10">
          <SpeechBubble text={speechText} visible={isSpeaking} direction="down" />
        </div>

        <div
          onClick={handleInteraction}
          onTouchStart={handleInteraction}
          className="relative w-[120px] h-[120px] rounded-full cursor-pointer touch-manipulation"
          style={{ backgroundColor: sunColor, transition: 'background-color 1s' }}
        >
          {/* Simple glow ring — way cheaper than box-shadow */}
          <div
            className="absolute inset-[-16px] rounded-full opacity-40"
            style={{ backgroundColor: sunColor, filter: 'blur(16px)', transition: 'background-color 1s' }}
          />

          {/* Rays — simple CSS lines, no SVG overhead */}
          <div
            className="absolute inset-[-20px] animate-[spin_20s_linear_infinite]"
            style={{ transition: 'color 1s', color: sunColor }}
          >
            {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
              <div
                key={deg}
                className="absolute left-1/2 top-0 w-[3px] h-[14px] rounded-full"
                style={{
                  backgroundColor: sunColor,
                  transform: `translateX(-50%) rotate(${deg}deg)`,
                  transformOrigin: `50% 80px`,
                  transition: 'background-color 1s',
                }}
              />
            ))}
          </div>

          {/* Face */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-3 pointer-events-none z-10">
            <div className="flex gap-5">
              {isSpeaking ? (
                <>
                  <div className="w-4 h-2 border-t-[3px] border-gray-800 rounded-t-full" />
                  <div className="w-4 h-2 border-t-[3px] border-gray-800 rounded-t-full" />
                </>
              ) : (
                <>
                  <div className="w-4 h-4 bg-gray-800 rounded-full" />
                  <div className="w-4 h-4 bg-gray-800 rounded-full" />
                </>
              )}
            </div>
            <div className="w-8 h-4 mt-2 border-b-[4px] border-gray-800 rounded-b-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(Sun)
