'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { speakText, stopSpeech } from '@/lib/speech'

export function useSpeech() {
  const voicesLoaded = useRef(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

  useEffect(() => {
    const handleStart = () => setIsSpeaking(true)
    const handleEnd = () => setIsSpeaking(false)

    if (typeof window !== 'undefined') {
      window.addEventListener('speech-start', handleStart)
      window.addEventListener('speech-end', handleEnd)
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('speech-start', handleStart)
        window.removeEventListener('speech-end', handleEnd)
      }
    }
  }, [])

  useEffect(() => {
    const loadVoices = () => {
      window.speechSynthesis.getVoices()
      voicesLoaded.current = true
    }
    if (typeof window !== 'undefined') {
      loadVoices()
      window.speechSynthesis.onvoiceschanged = loadVoices
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.speechSynthesis.onvoiceschanged = null
      }
    }
  }, [])

  const speak = useCallback((text: string, onEnd?: () => void) => {
    speakText(text, onEnd)
  }, [])

  const stop = useCallback(() => {
    stopSpeech()
    setIsSpeaking(false)
  }, [])

  return { speak, stop, isSpeaking }
}
