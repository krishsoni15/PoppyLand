'use client'

import { memo } from 'react'
import type { LetterEntry, NumberEntry } from '@/lib/data'

interface LetterGameBoardProps {
  mode: 'letters'
  choices: LetterEntry[]
  onSelect: (letter: string) => void
  selectedAnswer: string | null
  correctAnswer: string
  phase: string
}

interface NumberGameBoardProps {
  mode: 'numbers'
  choices: NumberEntry[]
  onSelect: (num: number) => void
  selectedAnswer: number | null
  correctAnswer: number
  phase: string
}

type GameBoardProps = LetterGameBoardProps | NumberGameBoardProps

const HOTKEYS = ['1', '2', '3', '4']

function GameBoard(props: GameBoardProps) {
  if (props.mode === 'letters') {
    return <LetterChoices {...props} />
  }
  return <NumberChoices {...props} />
}

const LetterChoices = memo(function LetterChoices({
  choices,
  onSelect,
  selectedAnswer,
  correctAnswer,
  phase,
}: LetterGameBoardProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5 max-w-lg mx-auto w-full px-2">
      {choices.map((entry, i) => (
        <ChoiceButton
          key={entry.letter}
          label={entry.letter}
          bgColor={entry.bgColor}
          textColor={entry.textColor}
          hotkey={HOTKEYS[i]}
          ariaLabel={`Letter ${entry.letter}, press ${HOTKEYS[i]} on keyboard`}
          onClick={() => onSelect(entry.letter)}
          state={getChoiceState(entry.letter, selectedAnswer, correctAnswer, phase)}
          disabled={phase === 'answered-correct'}
        />
      ))}
    </div>
  )
})

const NumberChoices = memo(function NumberChoices({
  choices,
  onSelect,
  selectedAnswer,
  correctAnswer,
  phase,
}: NumberGameBoardProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5 max-w-lg mx-auto w-full px-2">
      {choices.map((entry, i) => (
        <ChoiceButton
          key={entry.number}
          label={String(entry.number)}
          bgColor={entry.bgColor}
          textColor="text-white"
          hotkey={HOTKEYS[i]}
          ariaLabel={`Number ${entry.number}, press ${HOTKEYS[i]} on keyboard`}
          onClick={() => onSelect(entry.number)}
          state={getChoiceState(entry.number, selectedAnswer, correctAnswer, phase)}
          disabled={phase === 'answered-correct'}
        />
      ))}
    </div>
  )
})

function getChoiceState<T>(
  value: T,
  selected: T | null,
  correct: T,
  phase: string,
): 'default' | 'correct' | 'wrong' {
  if (phase === 'playing' || selected === null) return 'default'
  if (value === correct) return 'correct'
  if (value === selected) return 'wrong'
  return 'default'
}

function ChoiceButton({
  label,
  bgColor,
  textColor,
  hotkey,
  ariaLabel,
  onClick,
  state,
  disabled,
}: {
  label: string
  bgColor: string
  textColor: string
  hotkey: string
  ariaLabel: string
  onClick: () => void
  state: 'default' | 'correct' | 'wrong'
  disabled: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`
        ${bgColor} ${textColor} btn-3d relative font-fredoka
        min-h-[6.25rem] sm:min-h-[7rem] rounded-3xl text-5xl sm:text-6xl
        transition-all duration-200 hover:brightness-110
        focus-visible:ring-4 focus-visible:ring-white
        disabled:cursor-default
        ${state === 'correct' ? 'ring-4 ring-green-400 correct-bounce brightness-110 bg-green-400' : ''}
        ${state === 'wrong' ? 'animate-shake ring-4 ring-red-400 bg-red-400' : ''}
        ${state === 'default' ? 'hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]' : ''}
      `}
    >
      <span className="absolute left-3 top-3 flex h-7 w-7 items-center justify-center rounded-lg bg-black/15 text-sm font-bold">
        {hotkey}
      </span>
      {label}
    </button>
  )
}

export default memo(GameBoard)
