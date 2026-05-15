'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import NavBar from '@/components/ui/NavBar'
import PageShell from '@/components/ui/PageShell'
import LetterCard from '@/components/ui/LetterCard'
import { ALPHABET_DATA } from '@/lib/data'
import { useApp } from '@/components/providers/AppProvider'
import { useSpeech } from '@/hooks/useSpeech'
import { useSound } from '@/components/providers/SoundProvider'
import { fireMegaConfetti } from '@/lib/confetti'

export default function MyNameScreen() {
  const router = useRouter()
  const { childName, setPoppy } = useApp()
  const { speak } = useSpeech()
  const { playSuccess } = useSound()
  const [highlightIndex, setHighlightIndex] = useState(0)
  const [found, setFound] = useState<Set<string>>(new Set())
  const [done, setDone] = useState(false)

  const letters = childName.split('').filter((c) => /[A-Z]/i.test(c))
  const uniqueLetters = [...new Set(letters.map((l) => l.toUpperCase()))]
  const currentLetter = uniqueLetters[highlightIndex]

  useEffect(() => {
    if (!childName) {
      router.replace('/')
    }
  }, [childName, router])

  useEffect(() => {
    setPoppy('idle')
  }, [setPoppy])

  const handleLetter = useCallback(
    (label: string) => {
      if (done) return
      const upper = label.toUpperCase()
      if (upper !== currentLetter) return

      const nextFound = new Set(found)
      nextFound.add(upper)
      setFound(nextFound)
      speak(`${upper} is in your name!`)

      if (highlightIndex + 1 >= uniqueLetters.length) {
        setDone(true)
        setPoppy('celebrate', 5000)
        void playSuccess()
        void fireMegaConfetti()
        speak(`You spelled ${childName}! You're amazing!`)
      } else {
        setHighlightIndex((i) => i + 1)
      }
    },
    [
      currentLetter,
      done,
      found,
      highlightIndex,
      uniqueLetters.length,
      childName,
      speak,
      playSuccess,
      setPoppy,
    ],
  )

  if (!childName) return null

  return (
    <PageShell variant="home">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-yellow-200/40 via-pink-200/30 to-blue-200/40" />
      <NavBar title="My Name ✨" />

      <main className="relative mx-auto max-w-4xl px-4 pb-24 pt-4">
        <div className="card-glass mb-6 rounded-3xl p-6 text-center">
          <p className="font-nunito text-sm font-bold text-gray-500">Find the letters in</p>
          <p className="mt-2 font-fredoka text-4xl text-shimmer sm:text-5xl">{childName}</p>
          {!done && currentLetter && (
            <p className="mt-4 font-fredoka text-2xl text-brand-pink">
              Find: <span className="text-4xl">{currentLetter}</span>
            </p>
          )}
          {done && (
            <p className="mt-4 font-fredoka text-2xl text-brand-green">
              You did it! 🎉
            </p>
          )}
        </div>

        <div className="card-glass rounded-3xl p-4">
          <div className="flex flex-wrap justify-center gap-2">
            {ALPHABET_DATA.map((entry) => {
              const isTarget = entry.letter === currentLetter && !done
              const wasFound = found.has(entry.letter)
              return (
                <LetterCard
                  key={entry.letter}
                  label={entry.letter}
                  color={entry.bgColor}
                  textColor={entry.textColor}
                  isActive={isTarget || wasFound}
                  onClick={handleLetter}
                  ariaLabel={`Letter ${entry.letter}`}
                />
              )
            })}
          </div>
        </div>
      </main>
    </PageShell>
  )
}
