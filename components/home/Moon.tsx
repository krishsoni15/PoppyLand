'use client'

import React, { useState, memo } from 'react'
import { useSpeech } from '@/hooks/useSpeech'
import SpeechBubble from '@/components/ui/SpeechBubble'

interface MoonProps {
  position: number
  onClickManualToggle?: () => void
}

const MOON_PHRASES = [
  "I am the Moon! I light up the night sky! 🌙",
  "I go around the Earth every 28 days!",
  "Astronauts walked on me in 1969!",
  "I cause the ocean tides with my gravity!",
  "I have no air and no sound up here!",
  "I am covered in craters from space rocks!",
  "On a full moon night I am the brightest thing!",
  "I am slowly moving away from Earth each year!"
]

function Moon({ position, onClickManualToggle }: MoonProps) {
  const { speak } = useSpeech()
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [speechText, setSpeechText] = useState('')

  const x = 10 + (position * 80)
  const y = 55 - (Math.sin(position * Math.PI) * 45)

  let opacity = 1
  if (position > 0.85) opacity = Math.max(0, 1 - ((position - 0.85) * 6.66))
  if (position < 0.15) opacity = Math.min(1, position * 6.66)

  const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    if (onClickManualToggle) onClickManualToggle()

    if (isSpeaking) return
    const text = MOON_PHRASES[Math.floor(Math.random() * MOON_PHRASES.length)]
    setSpeechText(text)
    setIsSpeaking(true)
    speak(text)

    setTimeout(() => setIsSpeaking(false), 4500)
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
          className="relative w-[110px] h-[110px] rounded-full cursor-pointer touch-manipulation"
          style={{ backgroundColor: '#FFFDE7' }}
        >
          {/* Simple glow — cheaper than box-shadow */}
          <div
            className="absolute inset-[-14px] rounded-full bg-[#FFFDE7] opacity-30"
            style={{ filter: 'blur(14px)' }}
          />

          {/* Craters */}
          <div className="absolute w-5 h-5 bg-gray-300/40 rounded-full top-4 right-5" />
          <div className="absolute w-3 h-3 bg-gray-300/40 rounded-full top-10 right-3" />
          <div className="absolute w-6 h-6 bg-gray-300/40 rounded-full bottom-5 right-6" />

          {/* Face */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-2 pointer-events-none pr-4">
            <div className="flex gap-4">
              {isSpeaking ? (
                <>
                  <div className="w-3.5 h-3.5 bg-gray-700 rounded-full" />
                  <div className="w-3.5 h-3.5 bg-gray-700 rounded-full" />
                </>
              ) : (
                <>
                  <div className="w-4 h-2 border-b-[3px] border-gray-600 rounded-b-full" />
                  <div className="w-4 h-2 border-b-[3px] border-gray-600 rounded-b-full" />
                </>
              )}
            </div>
            <div className="w-5 h-2 mt-1.5 border-b-[3px] border-gray-600 rounded-b-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(Moon)
