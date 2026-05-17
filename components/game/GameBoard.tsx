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
          subLabel={entry.emoji}
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
          subLabel={entry.emoji}
          bgColor={entry.bgColor}
          textColor="text-white"
          hotkey={HOTKEYS[i]}
          showHotkey={false}
          ariaLabel={`Number ${entry.number}, type ${entry.number} on keyboard`}
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
  subLabel,
  bgColor,
  textColor,
  hotkey,
  showHotkey = true,
  ariaLabel,
  onClick,
  state,
  disabled,
}: {
  label: string
  subLabel?: string
  bgColor: string
  textColor: string
  hotkey: string
  showHotkey?: boolean
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
        ${bgColor} ${textColor} btn-3d relative font-fredoka select-none
        min-h-[6.75rem] sm:min-h-[7.5rem] rounded-3xl
        transition-all duration-200 hover:brightness-110 active:scale-95
        focus-visible:ring-4 focus-visible:ring-white
        disabled:cursor-default border-2 border-white/20
        ${state === 'correct' ? 'ring-4 ring-green-400 correct-bounce brightness-110 bg-green-400' : ''}
        ${state === 'wrong' ? 'animate-shake ring-4 ring-red-400 bg-red-400' : ''}
        ${state === 'default' ? 'hover:shadow-[0_0_25px_rgba(255,255,255,0.4)]' : ''}
      `}
    >
      {showHotkey && (
        <span className="absolute left-3.5 top-3.5 flex h-7.5 w-7.5 items-center justify-center rounded-xl bg-black/15 text-xs font-bold font-nunito tracking-wide">
          {hotkey}
        </span>
      )}
      <div className="flex flex-col items-center justify-center gap-0.5">
        <span className="text-5xl sm:text-6xl drop-shadow-sm leading-none">{label}</span>
        {subLabel && (
          <span className="text-2xl sm:text-3xl filter drop-shadow-sm select-none animate-pulse duration-1000 mt-1">
            {subLabel}
          </span>
        )}
      </div>
    </button>
  )
}

export default memo(GameBoard)
