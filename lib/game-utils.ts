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
  // strictly limit choices to single digit numbers (0 to 9)
  const pool = NUMBERS_DATA.filter((n) => n.number >= 0 && n.number <= 9)
  const wrong = shuffle(pool.filter((e) => e.number !== correct.number)).slice(0, 3)
  return shuffle([correct, ...wrong])
}

export function getGameLetterPool() {
  return shuffle(ALPHABET_DATA)
}

export function getGameNumberPool() {
  // strictly only return single digit numbers (0 to 9) shuffled
  return shuffle(NUMBERS_DATA.filter((n) => n.number >= 0 && n.number <= 9))
}
