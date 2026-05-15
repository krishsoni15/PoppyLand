import { ALPHABET_DATA, NUMBERS_DATA, type LetterEntry, type NumberEntry } from './data'
import { GAME_NUMBER_MAX } from './constants'

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function generateLetterChoices(correct: LetterEntry): LetterEntry[] {
  const wrong = shuffle(ALPHABET_DATA.filter((e) => e.letter !== correct.letter)).slice(0, 3)
  return shuffle([correct, ...wrong])
}

export function generateNumberChoices(correct: NumberEntry): NumberEntry[] {
  const pool = NUMBERS_DATA.filter((n) => n.number <= GAME_NUMBER_MAX)
  const wrong = shuffle(pool.filter((e) => e.number !== correct.number)).slice(0, 3)
  return shuffle([correct, ...wrong])
}

export function getGameLetterPool() {
  return shuffle(ALPHABET_DATA)
}

export function getGameNumberPool() {
  return shuffle(NUMBERS_DATA.filter((n) => n.number <= GAME_NUMBER_MAX))
}
