export function speakText(text: string, onEnd?: () => void) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return

  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = 0.78
  utterance.pitch = 1.2
  utterance.volume = 1.0

  const handleStart = () => window.dispatchEvent(new Event('speech-start'))
  const handleEnd = () => {
    window.dispatchEvent(new Event('speech-end'))
    if (onEnd) onEnd()
  }

  utterance.onstart = handleStart
  utterance.onend = handleEnd
  utterance.onerror = handleEnd

  const voices = window.speechSynthesis.getVoices()
  const preferred = voices.find(
    (v) =>
      v.name.includes('Samantha') ||
      v.name.includes('Karen') ||
      v.name.includes('Moira') ||
      v.name.includes('Tessa') ||
      v.name.includes('Victoria'),
  )
  if (preferred) utterance.voice = preferred

  window.speechSynthesis.speak(utterance)
}

export function stopSpeech() {
  if (typeof window !== 'undefined') window.speechSynthesis.cancel()
}
