'use client'

import { useCallback, useEffect, useState } from 'react'
import NavBar from '@/components/ui/NavBar'
import PageShell from '@/components/ui/PageShell'
import LetterCard from '@/components/ui/LetterCard'
import BigDisplay from '@/components/ui/BigDisplay'
import WordCard from '@/components/ui/WordCard'
import ProgressBar from '@/components/ui/ProgressBar'
import KeyboardHint from '@/components/ui/KeyboardHint'
import { NUMBERS_DATA, type NumberEntry } from '@/lib/data'
import { useSpeech } from '@/hooks/useSpeech'
import { useAutoPlay } from '@/hooks/useAutoPlay'
import { useKeyboard } from '@/hooks/useKeyboard'
import { useSound } from '@/components/providers/SoundProvider'
import { useApp } from '@/components/providers/AppProvider'
import { AUTO_PLAY_INTERVAL_MS } from '@/lib/constants'

export default function NumbersScreen() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [popKey, setPopKey] = useState(0)
  const { speak, stop } = useSpeech()
  const sound = useSound()
  const { unlockNumberSticker } = useApp()

  // Set music mood
  useEffect(() => {
    sound.setMood('playful')
  }, [sound])

  // Auto-announce on load
  useEffect(() => {
    const t = setTimeout(() => {
      speak(`Number ${active.word}`)
    }, 600)
    return () => clearTimeout(t)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const active: NumberEntry = NUMBERS_DATA[activeIndex]

  const selectNumber = useCallback(
    (index: number, fromAutoPlay = false) => {
      const entry = NUMBERS_DATA[index]
      setActiveIndex(index)
      setPopKey((k) => k + 1)

      if (!fromAutoPlay) {
        void sound.playNumberNote(entry.number)
      }
      unlockNumberSticker(entry.number)

      speak(`Number ${entry.word}!`, () => {
        speak(`${entry.word}`)
      })
    },
    [speak, sound, unlockNumberSticker],
  )

  const handleNumberClick = useCallback(
    (label: string) => {
      const num = parseInt(label, 10)
      const index = NUMBERS_DATA.findIndex((e) => e.number === num)
      if (index >= 0) selectNumber(index)
    },
    [selectNumber],
  )

  const selectByDigit = useCallback(
    (digit: number) => {
      const index = NUMBERS_DATA.findIndex((e) => e.number === digit)
      if (index >= 0) selectNumber(index)
    },
    [selectNumber],
  )

  const goPrev = useCallback(() => {
    const next = activeIndex === 0 ? NUMBERS_DATA.length - 1 : activeIndex - 1
    selectNumber(next)
  }, [activeIndex, selectNumber])

  const goNext = useCallback(() => {
    const next = (activeIndex + 1) % NUMBERS_DATA.length
    selectNumber(next)
  }, [activeIndex, selectNumber])

  const onAutoTick = useCallback(
    (index: number) => {
      selectNumber(index, true)
      void sound.playNumberNote(NUMBERS_DATA[index].number)
    },
    [selectNumber, sound],
  )

  const { isPlaying, currentIndex, start, stop: stopAuto } = useAutoPlay({
    totalItems: NUMBERS_DATA.length,
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

        if (/^[0-9]$/.test(key)) {
          event.preventDefault()
          const digit = key === '0' ? 10 : parseInt(key, 10)
          if (digit >= 1 && digit <= 10) {
            selectByDigit(digit)
          }
        }
      },
      [goPrev, goNext, toggleAutoPlay, selectByDigit],
    ),
  )

  return (
    <PageShell variant="cool">
      <NavBar title="Learn 123 🔢" />

      <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 pb-36">
        <section className="flex min-h-[12rem] items-center justify-center">
          <BigDisplay key={popKey} value={String(active.number)} color="#4D96FF" />
        </section>

        <section className="card-glass rounded-3xl p-4 sm:p-5">
          <p className="mb-3 text-center font-nunito text-sm font-bold text-gray-500">
            Press number keys 1–9, or 0 for ten!
          </p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-2.5">
            {NUMBERS_DATA.map((entry, i) => (
              <LetterCard
                key={entry.number}
                label={String(entry.number)}
                color={entry.bgColor}
                isActive={i === activeIndex}
                onClick={handleNumberClick}
                hotkey={entry.number <= 9 ? String(entry.number) : entry.number === 10 ? '0' : undefined}
                ariaLabel={`Number ${entry.number} — ${entry.word}`}
              />
            ))}
          </div>
        </section>

        <WordCard
          title={active.word}
          subtitle={`Count the ${active.word.toLowerCase()}!`}
          emoji={active.objects}
          accentColor="#4D96FF"
        />

        <section className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={goPrev}
            className="btn-3d card-glass min-h-14 min-w-14 rounded-2xl px-5 font-fredoka text-3xl text-gray-700 hover:scale-105"
            aria-label="Previous number"
          >
            ←
          </button>

          <button
            type="button"
            onClick={toggleAutoPlay}
            className="btn-3d min-h-14 rounded-3xl bg-gradient-to-r from-brand-teal to-brand-blue px-6 font-fredoka text-xl text-white sm:text-2xl hover:scale-105"
            aria-label={isPlaying ? 'Stop auto play' : 'Start auto play'}
          >
            {isPlaying ? 'Stop ⏹️' : 'Auto Play ▶️'}
          </button>

          <button
            type="button"
            onClick={goNext}
            className="btn-3d card-glass min-h-14 min-w-14 rounded-2xl px-5 font-fredoka text-3xl text-gray-700 hover:scale-105"
            aria-label="Next number"
          >
            →
          </button>
        </section>

        {isPlaying && (
          <ProgressBar current={currentIndex} total={NUMBERS_DATA.length} />
        )}

        <KeyboardHint hints={['1–9, 0=10', '← →', 'Space = auto']} />
      </main>
    </PageShell>
  )
}
