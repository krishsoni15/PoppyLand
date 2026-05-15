import { ALPHABET_DATA, NUMBERS_DATA } from './data'

export interface CollectionState {
  letters: string[]
  numbers: number[]
}

export const EMPTY_COLLECTION: CollectionState = {
  letters: [],
  numbers: [],
}

export const TOTAL_STICKERS = ALPHABET_DATA.length + NUMBERS_DATA.length

export function getCollectionCount(state: CollectionState): number {
  return state.letters.length + state.numbers.length
}

export function unlockLetter(state: CollectionState, letter: string): CollectionState {
  const upper = letter.toUpperCase()
  if (state.letters.includes(upper)) return state
  return { ...state, letters: [...state.letters, upper] }
}

export function unlockNumber(state: CollectionState, num: number): CollectionState {
  if (state.numbers.includes(num)) return state
  return { ...state, numbers: [...state.numbers, num] }
}

export function lettersRemaining(state: CollectionState): number {
  return ALPHABET_DATA.length - state.letters.length
}

export function numbersRemaining(state: CollectionState): number {
  return NUMBERS_DATA.length - state.numbers.length
}
