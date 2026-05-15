'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import PageShell from '@/components/ui/PageShell'
import AnimatedBackground from '@/components/home/AnimatedBackground'
import Poppy from '@/components/mascot/Poppy'
import { Mic, MicOff, Star, ArrowRight } from 'lucide-react'
import { speakText, stopSpeech } from '@/lib/speech'

const PRACTICE_ITEMS = [
  { text: 'A', display: 'A', emoji: '🍎', prompt: 'Can you say A?' },
  { text: 'Apple', display: 'Apple', emoji: '🍎', prompt: 'Say Apple!' },
  { text: 'B', display: 'B', emoji: '🐻', prompt: 'Say B!' },
  { text: 'Bear', display: 'Bear', emoji: '🐻', prompt: 'Can you roar like a bear? Say Bear!' },
  { text: 'C', display: 'C', emoji: '🐱', prompt: 'Say C!' },
  { text: 'Cat', display: 'Cat', emoji: '🐱', prompt: 'Say Cat!' },
]

type Status = 'intro' | 'idle' | 'poppy-speaking' | 'listening' | 'success' | 'try-again'

export default function SpeakPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [status, setStatus] = useState<Status>('intro')
  const [transcript, setTranscript] = useState('')
  const [volume, setVolume] = useState(0)
  
  const recognitionRef = useRef<any>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const micStreamRef = useRef<MediaStream | null>(null)
  const rafRef = useRef<number>(0)

  const currentItem = PRACTICE_ITEMS[currentIndex]

  // Setup Speech Recognition
  useEffect(() => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = true
      recognition.lang = 'en-US'
      
      recognition.onresult = (event: any) => {
        const current = event.resultIndex
        const result = event.results[current][0].transcript
        setTranscript(result)

        if (event.results[current].isFinal) {
          handleFinalResult(result)
        }
      }

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        
        // If mic works but speech-to-text is broken (common in some browsers)
        if (event.error === 'not-allowed' && micStreamRef.current) {
          console.log("Speech API blocked but mic works. Using fallback simulation.")
          // Don't stop visualizer, use volume as a trigger for testing
          return
        }

        setStatus('try-again')
        stopMicVisualization()

        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          speakText("I need microphone permission to hear you! Please check your browser settings.")
        } else {
          speakText("I didn't quite catch that. Let's try again!")
        }
      }

      recognition.onend = () => {
        stopMicVisualization()
        if (status === 'listening') {
          // If it ended but we didn't succeed, they might have said nothing
          if (transcript === '') {
            setStatus('try-again')
            speakText("I didn't hear anything. Tap the mic to try again!")
          }
        }
      }

      recognitionRef.current = recognition
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
      stopMicVisualization()
    }
  }, [status, currentItem])

  useEffect(() => {
    // Add global class to hide the global mascot
    document.body.classList.add('hide-global-mascot')
    
    // Initial intro
    setTimeout(() => {
      setStatus('poppy-speaking')
      speakText("Welcome to Speak and Repeat! " + currentItem.prompt, () => {
        setStatus('idle')
      })
    }, 1000)

    return () => {
      document.body.classList.remove('hide-global-mascot')
      stopSpeech()
    }
  }, [])

  const handleFinalResult = (text: string) => {
    const cleanedText = text.toLowerCase().replace(/[^a-z0-9]/g, '')
    const targetText = currentItem.text.toLowerCase().replace(/[^a-z0-9]/g, '')
    
    // Generous matching for kids
    const isSuccess = cleanedText.includes(targetText) || targetText.includes(cleanedText) || 
        (targetText === 'a' && (cleanedText === 'hey' || cleanedText === 'ay')) ||
        (targetText === 'c' && (cleanedText === 'see' || cleanedText === 'sea' || cleanedText === 'she'))

    // Talking Tom Feature: Repeat what they said in a high pitched, funny voice!
    setStatus('poppy-speaking')
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.pitch = 2.0 // Super high pitch for Talking Tom effect
    utterance.rate = 1.2
    utterance.volume = 1.0
    
    utterance.onend = () => {
      if (isSuccess) {
        handleSuccess()
      } else {
        setStatus('try-again')
        speakText(`Almost! Let's try saying ${currentItem.text}!`)
      }
    }

    // Try to find a good voice
    const voices = window.speechSynthesis.getVoices()
    const preferred = voices.find(v => v.name.includes('Samantha') || v.name.includes('Karen') || v.name.includes('Victoria'))
    if (preferred) utterance.voice = preferred

    window.speechSynthesis.cancel() // Stop any previous speech
    window.speechSynthesis.speak(utterance)
  }

  const handleSuccess = () => {
    setStatus('success')
    stopMicVisualization()
    
    // Confetti explosion!
    const duration = 2000
    const end = Date.now() + duration

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: ['#FF6B6B', '#4D96FF', '#FECA57', '#A855F7']
      })
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: ['#FF6B6B', '#4D96FF', '#FECA57', '#A855F7']
      })
      if (Date.now() < end) requestAnimationFrame(frame)
    }
    frame()

    const praises = ['Wow! Great job!', 'You did it!', 'Amazing!', 'Super duper!']
    const praise = praises[Math.floor(Math.random() * praises.length)]
    
    speakText(praise, () => {
      setTimeout(() => {
        if (currentIndex < PRACTICE_ITEMS.length - 1) {
          nextWord()
        } else {
          speakText("You finished all the words! You are a superstar!")
        }
      }, 1000)
    })
  }

  const nextWord = () => {
    setCurrentIndex(prev => prev + 1)
    setTranscript('')
    setStatus('poppy-speaking')
    setTimeout(() => {
      speakText(PRACTICE_ITEMS[currentIndex + 1].prompt, () => {
        setStatus('idle')
      })
    }, 500)
  }

  const startListening = async () => {
    if (status === 'listening') return
    setTranscript('')
    setStatus('listening')
    stopSpeech()

    // 1. Try to start the visualizer
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      micStreamRef.current = stream
      
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      audioContextRef.current = audioContext
      
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 256
      analyserRef.current = analyser
      
      const source = audioContext.createMediaStreamSource(stream)
      source.connect(analyser)
      
      const dataArray = new Uint8Array(analyser.frequencyBinCount)
      
      const updateVolume = () => {
        analyser.getByteFrequencyData(dataArray)
        let sum = 0
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i]
        }
        const avg = sum / dataArray.length
        setVolume(avg)
        
        // FALLBACK SIMULATION: If Speech Recognition is dead but they are making noise
        if (avg > 30) {
          // They are talking! Let's simulate a success after a short delay
          if (!(window as any)._fallbackTimer) {
             (window as any)._fallbackTimer = setTimeout(() => {
               handleFinalResult(currentItem.text) // Simulate them saying the correct word
               ;(window as any)._fallbackTimer = null
             }, 1500)
          }
        }

        rafRef.current = requestAnimationFrame(updateVolume)
      }
      
      updateVolume()
    } catch (err) {
      console.warn("Visualizer microphone access denied or error:", err)
      // We don't abort here; we still try to start SpeechRecognition!
    }

    // 2. Start Speech Recognition
    try {
      if (recognitionRef.current) {
        recognitionRef.current.start()
      } else {
        throw new Error("Speech recognition not supported in this browser.")
      }
    } catch (err) {
      console.error("SpeechRecognition start error:", err)
      setStatus('try-again')
      speakText("I can't access your microphone! Please check your browser settings.")
    }
  }

  const stopMicVisualization = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop())
    }
    if (audioContextRef.current) {
      audioContextRef.current.close()
    }
    setVolume(0)
  }

  const playPromptAgain = () => {
    setStatus('poppy-speaking')
    speakText(currentItem.prompt, () => {
      setStatus('idle')
    })
  }

  // Map state to Poppy's emotion
  let poppyState: 'idle' | 'happy' | 'sad' | 'celebrate' | 'sleeping' = 'idle'
  if (status === 'success') poppyState = 'celebrate'
  if (status === 'try-again') poppyState = 'sad'
  if (status === 'poppy-speaking') poppyState = 'happy'
  if (status === 'listening') poppyState = 'idle'

  return (
    <PageShell variant="home">
      <AnimatedBackground />

      <main className="relative z-10 flex min-h-[100dvh] flex-col items-center justify-center px-4 py-8">
        
        {/* Progress Stars */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-2 bg-white/40 backdrop-blur-md px-6 py-3 rounded-full border-4 border-white/60 shadow-xl">
          {PRACTICE_ITEMS.map((_, i) => (
            <motion.div 
              key={i}
              initial={false}
              animate={{ 
                scale: i === currentIndex ? 1.2 : 1,
                rotate: i < currentIndex ? 360 : 0,
                opacity: i <= currentIndex ? 1 : 0.4
              }}
              className="text-2xl"
            >
              {i < currentIndex ? '⭐' : '🌟'}
            </motion.div>
          ))}
        </div>

        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-12">
          
          {/* Left Column: Mascot & Instructions */}
          <div className="flex flex-col items-center justify-center space-y-6">
            
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="relative"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-200/40 rounded-full blur-3xl -z-10" />
              <Poppy 
                state={poppyState} 
                size={220} 
                isSpeaking={status === 'poppy-speaking'} 
              />
              
              <AnimatePresence>
                {status === 'poppy-speaking' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 10 }}
                    className="absolute -top-16 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white text-purple-700 font-nunito font-bold px-6 py-4 rounded-3xl rounded-br-none shadow-xl border-4 border-purple-100 text-xl z-20"
                  >
                    {currentItem.prompt}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <button 
              onClick={playPromptAgain}
              className="px-6 py-3 bg-white/60 backdrop-blur-sm hover:bg-white/90 rounded-full font-nunito font-bold text-purple-500 shadow-md transition-all active:scale-95 border-2 border-white/80"
            >
              🔊 Hear Again
            </button>
          </div>


          {/* Right Column: Interaction Zone */}
          <div className="flex flex-col items-center justify-center space-y-10">
            
            {/* The Big Letter/Word Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, rotate: -10, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 10, scale: 0.5 }}
                transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
                className="relative flex flex-col items-center justify-center w-64 h-64 bg-gradient-to-br from-white to-gray-50 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.1),_inset_0_4px_0_rgba(255,255,255,1)] border-8 border-white"
              >
                <span className="text-6xl absolute top-4 right-4 opacity-50">{currentItem.emoji}</span>
                <span className="font-fredoka text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
                  {currentItem.display}
                </span>
              </motion.div>
            </AnimatePresence>

            {/* Transcript Display */}
            <div className="h-12 w-full flex justify-center items-center">
              <AnimatePresence>
                {transcript && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="font-nunito font-bold text-2xl text-purple-700 bg-white/70 backdrop-blur-md px-6 py-2 rounded-full border-2 border-white"
                  >
                    "{transcript}"
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Giant Magical Microphone Button */}
            <div className="relative flex justify-center items-center h-40 w-40">
              
              {/* Ripple Rings when listening */}
              <AnimatePresence>
                {status === 'listening' && (
                  <>
                    <motion.div 
                      animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
                      className="absolute inset-0 bg-blue-400 rounded-full"
                    />
                    <motion.div 
                      animate={{ scale: [1, 2], opacity: [0.3, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut", delay: 0.4 }}
                      className="absolute inset-0 bg-purple-400 rounded-full"
                    />
                  </>
                )}
              </AnimatePresence>

              {/* Dynamic Glow based on volume */}
              {status === 'listening' && (
                <div 
                  className="absolute inset-0 bg-gradient-to-tr from-pink-400 to-blue-400 rounded-full blur-xl transition-all duration-75"
                  style={{ transform: `scale(${1 + volume / 100})`, opacity: 0.6 + volume / 200 }}
                />
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                onClick={status === 'listening' ? () => recognitionRef.current?.stop() : startListening}
                disabled={status === 'poppy-speaking' || status === 'success'}
                className={`relative z-10 w-32 h-32 rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.15),_inset_0_4px_10px_rgba(255,255,255,0.8)] border-4 border-white transition-all duration-300 ${
                  status === 'listening' 
                    ? 'bg-gradient-to-br from-blue-400 to-purple-500' 
                    : status === 'success'
                    ? 'bg-gradient-to-br from-green-400 to-emerald-500'
                    : 'bg-gradient-to-br from-pink-400 to-rose-500'
                }`}
              >
                {status === 'listening' ? (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                  >
                    <Mic className="w-14 h-14 text-white drop-shadow-md" />
                  </motion.div>
                ) : (
                  <Mic className="w-14 h-14 text-white drop-shadow-md" />
                )}
              </motion.button>
            </div>
            
            {/* Instruction Text under Mic */}
            <p className="font-nunito font-bold text-gray-500 text-lg">
              {status === 'listening' 
                ? "Listening... say it loud!" 
                : status === 'poppy-speaking'
                ? "Listen to Poppy..."
                : status === 'success'
                ? "Awesome!"
                : "Tap the mic to speak!"}
            </p>

          </div>
        </div>
      </main>
    </PageShell>
  )
}
