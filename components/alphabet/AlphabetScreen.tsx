'use client'

import { useCallback, useEffect, useState } from 'react'
import NavBar from '@/components/ui/NavBar'
import PageShell from '@/components/ui/PageShell'
import LetterCard from '@/components/ui/LetterCard'
import BigDisplay from '@/components/ui/BigDisplay'
import WordCard from '@/components/ui/WordCard'
import ProgressBar from '@/components/ui/ProgressBar'
import KeyboardHint from '@/components/ui/KeyboardHint'
import { ALPHABET_DATA, type LetterEntry } from '@/lib/data'
import { useSpeech } from '@/hooks/useSpeech'
import { useAutoPlay } from '@/hooks/useAutoPlay'
import { useKeyboard } from '@/hooks/useKeyboard'
import { useSound } from '@/components/providers/SoundProvider'
import { useApp } from '@/components/providers/AppProvider'
import { AUTO_PLAY_INTERVAL_MS } from '@/lib/constants'

export default function AlphabetScreen() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [popKey, setPopKey] = useState(0)
  const { speak, stop } = useSpeech()
  const sound = useSound()
  const { unlockLetterSticker } = useApp()

  const active: LetterEntry = ALPHABET_DATA[activeIndex]

  // Set music mood
  useEffect(() => {
    sound.setMood('warm')
  }, [sound])


  const selectLetter = useCallback(
    (index: number, fromAutoPlay = false) => {
      const entry = ALPHABET_DATA[index]
      setActiveIndex(index)
      setPopKey((k) => k + 1)

      if (!fromAutoPlay) {
        void sound.playDing()
      }
      unlockLetterSticker(entry.letter)

      speak(entry.letter, () => {
        speak(`${entry.letter} is for ${entry.word}`)
      })
    },
    [speak, sound, unlockLetterSticker],
  )

  const handleLetterClick = useCallback(
    (letter: string) => {
      const index = ALPHABET_DATA.findIndex((e) => e.letter === letter)
      if (index >= 0) selectLetter(index)
    },
    [selectLetter],
  )

  const goPrev = useCallback(() => {
    const next = activeIndex === 0 ? ALPHABET_DATA.length - 1 : activeIndex - 1
    selectLetter(next)
  }, [activeIndex, selectLetter])

  const goNext = useCallback(() => {
    const next = (activeIndex + 1) % ALPHABET_DATA.length
    selectLetter(next)
  }, [activeIndex, selectLetter])

  const onAutoTick = useCallback(
    (index: number) => {
      selectLetter(index, true)
    },
    [selectLetter],
  )

  const { isPlaying, currentIndex, start, stop: stopAuto } = useAutoPlay({
    totalItems: ALPHABET_DATA.length,
    intervalMs: AUTO_PLAY_INTERVAL_MS,
    onTick: onAutoTick,
  })

  const toggleAutoPlay = useCallback(() => {
    if (isPlaying) {
      stopAuto()
      stop()
    } else {
      start()
    }
  }, [isPlaying, start, stop, stopAuto])

  useKeyboard(
    useCallback(
      (event) => {
        const key = event.key

        if (key === 'ArrowLeft') {
          event.preventDefault()
          goPrev()
          return
        }
        if (key === 'ArrowRight') {
          event.preventDefault()
          goNext()
          return
        }
        if (key === ' ' || key === 'Enter') {
          event.preventDefault()
          toggleAutoPlay()
          return
        }

        const letter = key.length === 1 ? key.toUpperCase() : ''
        if (/^[A-Z]$/.test(letter)) {
          event.preventDefault()
          handleLetterClick(letter)
        }
      },
      [goPrev, goNext, toggleAutoPlay, handleLetterClick],
    ),
  )

  return (
    <PageShell variant="warm">
      <NavBar title="Learn ABC 📖" />

      <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 pb-36">
        <section className="flex min-h-[12rem] items-center justify-center">
          <BigDisplay key={popKey} value={active.letter} color={active.color} />
        </section>

        <section className="card-glass rounded-3xl p-4 sm:p-5">
          <p className="mb-3 text-center font-nunito text-sm font-bold text-gray-500">
            Tap a letter or press a key on your keyboard!
          </p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-2.5">
            {ALPHABET_DATA.map((entry, i) => (
              <LetterCard
                key={entry.letter}
                label={entry.letter}
                color={entry.bgColor}
                textColor={entry.textColor}
                isActive={i === activeIndex}
                onClick={handleLetterClick}
                hotkey={entry.letter}
                staggerIndex={i}
                ariaLabel={`Letter ${entry.letter} — ${entry.word}`}
              />
            ))}
          </div>
        </section>

        <WordCard
          title={`${active.letter} is for ${active.word}`}
          emoji={active.emoji}
          letter={active.letter}
          accentColor={active.color}
        />

        <section className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={goPrev}
            className="btn-3d card-glass min-h-14 min-w-14 rounded-2xl px-5 font-fredoka text-3xl text-gray-700 hover:scale-105 focus-visible:ring-4 focus-visible:ring-brand-blue"
            aria-label="Previous letter"
          >
            ←
          </button>

          <button
            type="button"
            onClick={toggleAutoPlay}
            className="btn-3d min-h-14 rounded-3xl bg-gradient-to-r from-brand-purple to-brand-pink px-6 font-fredoka text-xl text-white sm:text-2xl hover:scale-105 focus-visible:ring-4 focus-visible:ring-white"
            aria-label={isPlaying ? 'Stop auto play' : 'Start auto play'}
          >
            {isPlaying ? 'Stop ⏹️' : 'Auto Play ▶️'}
          </button>

          <button
            type="button"
            onClick={goNext}
            className="btn-3d card-glass min-h-14 min-w-14 rounded-2xl px-5 font-fredoka text-3xl text-gray-700 hover:scale-105 focus-visible:ring-4 focus-visible:ring-brand-blue"
            aria-label="Next letter"
          >
            →
          </button>
        </section>

        {isPlaying && (
          <ProgressBar current={currentIndex} total={ALPHABET_DATA.length} />
        )}

        <KeyboardHint hints={['A–Z keys', '← →', 'Space = auto']} />
      </main>
    </PageShell>
  )
}
