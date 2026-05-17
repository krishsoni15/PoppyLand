'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import NavBar from '@/components/ui/NavBar'
import PageShell from '@/components/ui/PageShell'
import ScoreBoard from '@/components/ui/ScoreBoard'
import KeyboardHint from '@/components/ui/KeyboardHint'
import XpBar from '@/components/ui/XpBar'
import StreakBanner from '@/components/ui/StreakBanner'
import RewardBanner from '@/components/ui/RewardBanner'
import GameQuestion from '@/components/game/GameQuestion'
import GameBoard from '@/components/game/GameBoard'
import GameResult from '@/components/game/GameResult'
import { useGame, type GameMode } from '@/hooks/useGame'
import { useSpeech } from '@/hooks/useSpeech'
import { useKeyboard } from '@/hooks/useKeyboard'
import { useSound } from '@/components/providers/SoundProvider'
import { useApp } from '@/components/providers/AppProvider'
import { fireConfetti, fireBigConfetti, fireMegaConfetti } from '@/lib/confetti'
import { rollReward, type RewardResult } from '@/lib/rewards'
import { getStreakMilestone } from '@/lib/streak'
import { GAME_TOTAL_QUESTIONS } from '@/lib/constants'

function vibrate(pattern: number | number[]) {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(pattern)
  }
}

const PRAISE = [
  'Amazing!', 'Superstar!', 'You got it!', 'Brilliant!',
  'Wow!', 'Perfect!', 'Yes!', 'Incredible!', "You're so smart!",
]

export default function GameScreen() {
  const [mode, setModeState] = useState<GameMode>('letters')
  const { state, answerLetter, answerNumber, next, retry, restart, setMode } = useGame(mode)
  const { speak } = useSpeech()
  const sound = useSound()
  const { addXp, setPoppy, flash, setStreak } = useApp()
  const handledPhaseRef = useRef<string | null>(null)
  const [reward, setReward] = useState<RewardResult | null>(null)
  const [streakMilestone, setStreakMilestone] = useState<ReturnType<typeof getStreakMilestone>>(null)
  const [answers, setAnswers] = useState<{ correct: boolean }[]>([])

  const typedBufferRef = useRef<string>('')
  const typedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [pressedKeyFeedback, setPressedKeyFeedback] = useState<string | null>(null)
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showKeyFeedback = useCallback((char: string) => {
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current)
    setPressedKeyFeedback(char)
    feedbackTimerRef.current = setTimeout(() => {
      setPressedKeyFeedback(null)
    }, 750)
  }, [])

  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current)
    }
  }, [])

  useEffect(() => {
    setPoppy('idle')
    sound.setMood('energetic')
  }, [setPoppy, sound])

  const switchMode = (newMode: GameMode) => {
    setModeState(newMode)
    setMode(newMode)
    handledPhaseRef.current = null
    setReward(null)
    setStreakMilestone(null)
    setAnswers([])
  }

  const promptQuestion = useCallback(() => {
    if (state.phase === 'finished') return
    if (state.mode === 'letters') {
      const choiceList = state.choices.map(c => c.letter).join(', ')
      speak(`Find the letter ${state.currentQuestion.letter}. Your choices are ${choiceList}`)
    } else {
      const choiceList = state.choices.map(c => c.number).join(', ')
      speak(`Find the number ${state.currentQuestion.number}. Your choices are ${choiceList}`)
    }
  }, [state, speak])

  useEffect(() => {
    if (state.phase === 'playing') {
      handledPhaseRef.current = null
      setReward(null)
      setStreakMilestone(null)
      const t = setTimeout(promptQuestion, 400)
      return () => clearTimeout(t)
    }
  }, [state.currentQuestion, state.mode, state.phase, promptQuestion])

  useEffect(() => {
    if (state.phase !== 'playing') {
      typedBufferRef.current = ''
      if (typedTimeoutRef.current) {
        clearTimeout(typedTimeoutRef.current)
        typedTimeoutRef.current = null
      }
    }
  }, [state.phase])

  useEffect(() => {
    const phaseKey = `${state.questionIndex}-${state.phase}`
    if (handledPhaseRef.current === phaseKey) return

    if (state.phase === 'answered-correct') {
      handledPhaseRef.current = phaseKey
      setStreak(state.streak)
      setAnswers(prev => [...prev, { correct: true }])

      const rolled = rollReward()
      setReward(rolled)

      const milestone = getStreakMilestone(state.streak.current)
      setStreakMilestone(milestone)

      flash(
        milestone === 10 ? 'gold' : rolled.tier === 'ultra' ? 'rainbow' : 'green',
      )

      // Haptic
      vibrate(50)

      if (milestone) {
        void sound.playStreak(milestone)
        if (milestone >= 5) setPoppy('celebrate', 2000)
        else setPoppy('happy', 1200)
      } else {
        setPoppy('happy', 1000)
      }

      const xpGain = 1 + rolled.xpBonus
      addXp(xpGain)

      if (rolled.tier === 'ultra') {
        void sound.playUltraWin()
        void fireMegaConfetti()
      } else if (rolled.tier === 'mega') {
        void sound.playMegaWin()
        void fireMegaConfetti()
      } else if (rolled.tier === 'big') {
        void sound.playBigWin()
        void fireBigConfetti()
      } else {
        void sound.playSuccess()
        void fireConfetti()
      }

      // Voice praise with letter/number context
      const randomPraise = PRAISE[Math.floor(Math.random() * PRAISE.length)]
      const contextMsg = state.mode === 'letters'
        ? `Yes! ${state.currentQuestion.letter} is correct! ${state.currentQuestion.letter} is for ${state.currentQuestion.word}!`
        : `Yes! ${state.currentQuestion.number} is correct!`

      // Safety fallback timer of 5.5 seconds: if speech synthesizer callback fails to fire or gets blocked, go to next level anyway!
      const safetyTimer = setTimeout(() => {
        next()
      }, 5500)

      speak(`${randomPraise} ${contextMsg}`, () => {
        clearTimeout(safetyTimer)
        setTimeout(next, 1000)
      })

      return () => clearTimeout(safetyTimer)
    } else if (state.phase === 'answered-wrong') {
      handledPhaseRef.current = phaseKey
      setAnswers(prev => [...prev, { correct: false }])
      flash('red')
      setPoppy('sad', 1500)
      void sound.playWrong()
      vibrate([30, 20, 30])

      const wrongMsg = state.mode === 'letters'
        ? `Oops, that's not ${state.currentQuestion.letter}. Try again!`
        : `Oops, that's not ${state.currentQuestion.number}. Try again!`

      // Safety fallback timer of 4.5 seconds in case speech synthesis is blocked
      const safetyTimer = setTimeout(() => {
        retry()
      }, 4500)

      speak(wrongMsg)

      const t = setTimeout(() => {
        clearTimeout(safetyTimer)
        retry()
      }, 1200)

      return () => {
        clearTimeout(safetyTimer)
        clearTimeout(t)
      }
    }
  }, [
    state.phase,
    state.mode,
    state.currentQuestion,
    state.questionIndex,
    state.streak,
    speak,
    sound,
    next,
    retry,
    addXp,
    setPoppy,
    flash,
    setStreak,
  ])

  useEffect(() => {
    if (state.phase === 'finished') {
      if (state.score === GAME_TOTAL_QUESTIONS) {
        addXp(3)
        setPoppy('celebrate', 4000)
      }
    }
  }, [state.phase, state.score, addXp, setPoppy])

  const pickChoiceByIndex = useCallback(
    (index: number) => {
      if (state.phase !== 'playing') return
      if (state.mode === 'letters') {
        const choice = state.choices[index]
        if (choice) answerLetter(choice.letter)
      } else {
        const choice = state.choices[index]
        if (choice) answerNumber(choice.number)
      }
    },
    [state, answerLetter, answerNumber],
  )

  const pickLetterFromKeyboard = useCallback(
    (letter: string) => {
      if (state.phase !== 'playing' || state.mode !== 'letters') return
      const match = state.choices.find((c) => c.letter === letter)
      if (match) answerLetter(match.letter)
    },
    [state, answerLetter],
  )

  const pickNumberFromKeyboard = useCallback(
    (digit: number) => {
      if (state.phase !== 'playing' || state.mode !== 'numbers') return
      const match = state.choices.find((c) => c.number === digit)
      if (match) answerNumber(match.number)
    },
    [state, answerNumber],
  )

  useKeyboard(
    useCallback(
      (event) => {
        if (state.phase !== 'playing') return
        const key = event.key

        // Keyboard hotkeys 1-4 only allowed in letters mode to prevent conflict in numbers mode!
        if (state.mode === 'letters' && key >= '1' && key <= '4') {
          event.preventDefault()
          const index = parseInt(key, 10) - 1
          pickChoiceByIndex(index)
          const choice = state.choices[index]
          if (choice) showKeyFeedback(choice.letter)
          return
        }

        if (state.mode === 'letters') {
          const letter = key.length === 1 ? key.toUpperCase() : ''
          if (/^[A-Z]$/.test(letter)) {
            event.preventDefault()
            pickLetterFromKeyboard(letter)
            showKeyFeedback(letter)
          }
        } else if (/^[0-9]$/.test(key)) {
          event.preventDefault()
          showKeyFeedback(key)

          // Clear any pending timeout
          if (typedTimeoutRef.current) {
            clearTimeout(typedTimeoutRef.current)
            typedTimeoutRef.current = null
          }

          // Append to typing buffer
          typedBufferRef.current += key
          const currentInput = parseInt(typedBufferRef.current, 10)

          // Find matches in choices
          const exactMatches = state.choices.filter(c => c.number === currentInput)
          const prefixMatches = state.choices.filter(c => String(c.number).startsWith(typedBufferRef.current))

          if (exactMatches.length > 0 && prefixMatches.length === 1) {
            // Exactly one matched option exists (e.g. they typed "11" for 11, or "2" for 2 and no "20" exists in choices)
            answerNumber(exactMatches[0].number)
            typedBufferRef.current = ''
          } else if (prefixMatches.length > 0) {
            // Multiple options could match (e.g. typed "1", and choices are both "1" and "11" or "12")
            // Wait to see if they press another key to make it double digit
            typedTimeoutRef.current = setTimeout(() => {
              const finalInput = parseInt(typedBufferRef.current, 10)
              const match = state.choices.find(c => c.number === finalInput)
              if (match) {
                answerNumber(match.number)
              }
              typedBufferRef.current = ''
            }, 600)
          } else {
            // No matches at all, reset buffer
            typedBufferRef.current = ''
          }
        }
      },
      [state.phase, state.mode, state.choices, pickChoiceByIndex, pickLetterFromKeyboard, answerNumber, showKeyFeedback],
    ),
    state.phase === 'playing',
  )

  if (state.phase === 'finished') {
    return (
      <PageShell variant="play">
        <NavBar title="Game 🎮" />
        <GameResult
          score={state.score}
          total={state.totalQuestions}
          onPlayAgain={() => { setAnswers([]); restart() }}
          answers={answers}
        />
      </PageShell>
    )
  }

  const prompt = state.mode === 'letters' ? 'Find the letter...' : 'Find the number...'
  const target =
    state.mode === 'letters'
      ? state.currentQuestion.letter
      : String(state.currentQuestion.number)

  return (
    <PageShell variant="play">
      <NavBar title="Play Game 🎮" />

      <main className="mx-auto flex max-w-2xl flex-col gap-4 px-4 pb-8 pt-2 w-full">
        {state.streak.current > 0 && (
          <p className="text-center font-fredoka text-lg text-brand-orange">
            🔥 Streak: {state.streak.current}
          </p>
        )}

        {streakMilestone && <StreakBanner milestone={streakMilestone} />}
        {reward && <RewardBanner message={reward.message} tier={reward.tier} />}

        <XpBar />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          {/* Star Score Display */}
          <div className="flex items-center gap-1">
            {Array.from({ length: state.totalQuestions }).map((_, i) => (
              <span
                key={i}
                className={`text-2xl ${i < state.score ? 'star-pop' : 'opacity-25'}`}
                style={i < state.score ? { animationDelay: `${i * 0.08}s` } : undefined}
              >
                {i < state.score ? '⭐' : '☆'}
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => switchMode('letters')}
              className={`btn-3d btn-juice min-h-[3.75rem] min-w-[3.75rem] rounded-2xl px-5 font-fredoka text-lg ${
                mode === 'letters'
                  ? 'bg-gradient-to-r from-brand-purple to-brand-pink text-white'
                  : 'card-glass text-gray-700'
              }`}
              aria-pressed={mode === 'letters'}
              aria-label="Switch to letter game"
            >
              ABC
            </button>
            <button
              type="button"
              onClick={() => switchMode('numbers')}
              className={`btn-3d btn-juice min-h-[3.75rem] min-w-[3.75rem] rounded-2xl px-5 font-fredoka text-lg ${
                mode === 'numbers'
                  ? 'bg-gradient-to-r from-brand-teal to-brand-blue text-white'
                  : 'card-glass text-gray-700'
              }`}
              aria-pressed={mode === 'numbers'}
              aria-label="Switch to number game"
            >
              123
            </button>
          </div>
        </div>

        <GameQuestion
          prompt={prompt}
          target={target}
          mode={state.mode}
          word={state.currentQuestion.word}
          emoji={state.currentQuestion.emoji}
          questionIndex={state.questionIndex}
          totalQuestions={state.totalQuestions}
        />

        {state.mode === 'letters' ? (
          <GameBoard
            mode="letters"
            choices={state.choices}
            onSelect={answerLetter}
            selectedAnswer={state.selectedAnswer}
            correctAnswer={state.currentQuestion.letter}
            phase={state.phase}
          />
        ) : (
          <GameBoard
            mode="numbers"
            choices={state.choices}
            onSelect={answerNumber}
            selectedAnswer={state.selectedAnswer}
            correctAnswer={state.currentQuestion.number}
            phase={state.phase}
          />
        )}

        <KeyboardHint
          hints={
            state.mode === 'letters'
              ? ['A–Z or 1–4', 'Letter keys']
              : ['0–9 keys', 'Type the numbers']
          }
        />
      </main>

      {/* Giant high-graphic keypress popup overlay for massive visual feedback and preschool dopamine! */}
      {pressedKeyFeedback && (
        <div className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center select-none overflow-hidden">
          <div className="key-pop-overlay flex h-48 w-48 items-center justify-center rounded-full bg-gradient-to-tr from-brand-purple to-brand-pink text-8xl font-fredoka text-white shadow-[0_16px_48px_rgba(168,85,247,0.5)] border-4 border-white/90 backdrop-blur-sm">
            {pressedKeyFeedback}
          </div>
        </div>
      )}
    </PageShell>
  )
}
