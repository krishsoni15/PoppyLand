'use client'

import { useState, useCallback, useRef } from 'react'
import { ALPHABET_DATA, NUMBERS_DATA, type LetterEntry, type NumberEntry } from '@/lib/data'
import {
  generateLetterChoices,
  generateNumberChoices,
  getGameLetterPool,
  getGameNumberPool,
} from '@/lib/game-utils'
import { GAME_TOTAL_QUESTIONS } from '@/lib/constants'
import { loadStreak, incrementStreak, resetStreak, saveStreak, type StreakState } from '@/lib/streak'

export type GameMode = 'letters' | 'numbers'
export type GamePhase = 'playing' | 'answered-correct' | 'answered-wrong' | 'finished'

interface LetterGameState {
  mode: 'letters'
  phase: GamePhase
  currentQuestion: LetterEntry
  choices: LetterEntry[]
  score: number
  questionIndex: number
  totalQuestions: number
  selectedAnswer: string | null
  streak: StreakState
}

interface NumberGameState {
  mode: 'numbers'
  phase: GamePhase
  currentQuestion: NumberEntry
  choices: NumberEntry[]
  score: number
  questionIndex: number
  totalQuestions: number
  selectedAnswer: number | null
  streak: StreakState
}

export type GameState = LetterGameState | NumberGameState

function createLetterState(pool: LetterEntry[]): LetterGameState {
  const first = pool[0]
  return {
    mode: 'letters',
    phase: 'playing',
    currentQuestion: first,
    choices: generateLetterChoices(first),
    score: 0,
    questionIndex: 0,
    totalQuestions: GAME_TOTAL_QUESTIONS,
    selectedAnswer: null,
    streak: loadStreak(),
  }
}

function createNumberState(pool: NumberEntry[]): NumberGameState {
  const first = pool[0]
  return {
    mode: 'numbers',
    phase: 'playing',
    currentQuestion: first,
    choices: generateNumberChoices(first),
    score: 0,
    questionIndex: 0,
    totalQuestions: GAME_TOTAL_QUESTIONS,
    selectedAnswer: null,
    streak: loadStreak(),
  }
}

export function useGame(mode: GameMode = 'letters') {
  const letterPoolRef = useRef(getGameLetterPool())
  const numberPoolRef = useRef(getGameNumberPool())

  const [state, setState] = useState<GameState>(() =>
    mode === 'letters'
      ? createLetterState(letterPoolRef.current)
      : createNumberState(numberPoolRef.current),
  )

  const answerLetter = useCallback((letter: string) => {
    setState((prev) => {
      if (prev.mode !== 'letters' || prev.phase !== 'playing') return prev
      const correct = letter === prev.currentQuestion.letter
      const streak = correct ? incrementStreak(prev.streak) : resetStreak(prev.streak)
      saveStreak(streak)
      return {
        ...prev,
        phase: correct ? 'answered-correct' : 'answered-wrong',
        score: correct ? prev.score + 1 : prev.score,
        selectedAnswer: letter,
        streak,
      }
    })
  }, [])

  const answerNumber = useCallback((num: number) => {
    setState((prev) => {
      if (prev.mode !== 'numbers' || prev.phase !== 'playing') return prev
      const correct = num === prev.currentQuestion.number
      const streak = correct ? incrementStreak(prev.streak) : resetStreak(prev.streak)
      saveStreak(streak)
      return {
        ...prev,
        phase: correct ? 'answered-correct' : 'answered-wrong',
        score: correct ? prev.score + 1 : prev.score,
        selectedAnswer: num,
        streak,
      }
    })
  }, [])

  const next = useCallback(() => {
    setState((prev) => {
      const nextIndex = prev.questionIndex + 1
      if (nextIndex >= prev.totalQuestions) {
        return { ...prev, phase: 'finished' }
      }

      if (prev.mode === 'letters') {
        const nextQuestion = letterPoolRef.current[nextIndex]
        return {
          ...prev,
          phase: 'playing',
          currentQuestion: nextQuestion,
          choices: generateLetterChoices(nextQuestion),
          questionIndex: nextIndex,
          selectedAnswer: null,
        }
      }

      const nextQuestion = numberPoolRef.current[nextIndex]
      return {
        ...prev,
        phase: 'playing',
        currentQuestion: nextQuestion,
        choices: generateNumberChoices(nextQuestion),
        questionIndex: nextIndex,
        selectedAnswer: null,
      }
    })
  }, [])

  const retry = useCallback(() => {
    setState((prev) => {
      if (prev.phase !== 'answered-wrong') return prev
      return { ...prev, phase: 'playing', selectedAnswer: null }
    })
  }, [])

  const restart = useCallback(() => {
    const fresh = { current: 0, best: loadStreak().best }
    saveStreak(fresh)
    if (mode === 'letters') {
      letterPoolRef.current = getGameLetterPool()
      const s = createLetterState(letterPoolRef.current)
      setState({ ...s, streak: fresh })
    } else {
      numberPoolRef.current = getGameNumberPool()
      const s = createNumberState(numberPoolRef.current)
      setState({ ...s, streak: fresh })
    }
  }, [mode])

  const setMode = useCallback((newMode: GameMode) => {
    if (newMode === 'letters') {
      letterPoolRef.current = getGameLetterPool()
      setState(createLetterState(letterPoolRef.current))
    } else {
      numberPoolRef.current = getGameNumberPool()
      setState(createNumberState(numberPoolRef.current))
    }
  }, [])

  return {
    state,
    answerLetter,
    answerNumber,
    next,
    retry,
    restart,
    setMode,
  }
}
