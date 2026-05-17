export interface LetterEntry {
  letter: string
  word: string
  emoji: string
  color: string
  bgColor: string
  textColor: string
}

export const ALPHABET_DATA: LetterEntry[] = [
  { letter: 'A', word: 'Apple', emoji: '🍎', color: '#FF6B6B', bgColor: 'bg-red-400', textColor: 'text-white' },
  { letter: 'B', word: 'Ball', emoji: '🏀', color: '#FF9F43', bgColor: 'bg-orange-400', textColor: 'text-white' },
  { letter: 'C', word: 'Cat', emoji: '🐱', color: '#FECA57', bgColor: 'bg-yellow-400', textColor: 'text-gray-800' },
  { letter: 'D', word: 'Dog', emoji: '🐶', color: '#6BCB77', bgColor: 'bg-green-400', textColor: 'text-white' },
  { letter: 'E', word: 'Elephant', emoji: '🐘', color: '#4ECDC4', bgColor: 'bg-teal-400', textColor: 'text-white' },
  { letter: 'F', word: 'Fish', emoji: '🐟', color: '#4D96FF', bgColor: 'bg-blue-400', textColor: 'text-white' },
  { letter: 'G', word: 'Grapes', emoji: '🍇', color: '#A855F7', bgColor: 'bg-purple-400', textColor: 'text-white' },
  { letter: 'H', word: 'Hat', emoji: '🎩', color: '#FF6BB5', bgColor: 'bg-pink-400', textColor: 'text-white' },
  { letter: 'I', word: 'Ice Cream', emoji: '🍦', color: '#FF6B6B', bgColor: 'bg-red-300', textColor: 'text-white' },
  { letter: 'J', word: 'Juice', emoji: '🧃', color: '#FF9F43', bgColor: 'bg-orange-300', textColor: 'text-white' },
  { letter: 'K', word: 'Kite', emoji: '🪁', color: '#FECA57', bgColor: 'bg-yellow-300', textColor: 'text-gray-800' },
  { letter: 'L', word: 'Lion', emoji: '🦁', color: '#6BCB77', bgColor: 'bg-green-300', textColor: 'text-white' },
  { letter: 'M', word: 'Moon', emoji: '🌙', color: '#4ECDC4', bgColor: 'bg-teal-300', textColor: 'text-white' },
  { letter: 'N', word: 'Nest', emoji: '🪺', color: '#4D96FF', bgColor: 'bg-blue-300', textColor: 'text-white' },
  { letter: 'O', word: 'Orange', emoji: '🍊', color: '#A855F7', bgColor: 'bg-purple-300', textColor: 'text-white' },
  { letter: 'P', word: 'Penguin', emoji: '🐧', color: '#FF6BB5', bgColor: 'bg-pink-300', textColor: 'text-white' },
  { letter: 'Q', word: 'Queen', emoji: '👑', color: '#FF6B6B', bgColor: 'bg-red-400', textColor: 'text-white' },
  { letter: 'R', word: 'Rainbow', emoji: '🌈', color: '#FF9F43', bgColor: 'bg-orange-400', textColor: 'text-white' },
  { letter: 'S', word: 'Star', emoji: '⭐', color: '#FECA57', bgColor: 'bg-yellow-400', textColor: 'text-gray-800' },
  { letter: 'T', word: 'Tiger', emoji: '🐯', color: '#6BCB77', bgColor: 'bg-green-400', textColor: 'text-white' },
  { letter: 'U', word: 'Umbrella', emoji: '☂️', color: '#4ECDC4', bgColor: 'bg-teal-400', textColor: 'text-white' },
  { letter: 'V', word: 'Violin', emoji: '🎻', color: '#4D96FF', bgColor: 'bg-blue-400', textColor: 'text-white' },
  { letter: 'W', word: 'Watermelon', emoji: '🍉', color: '#A855F7', bgColor: 'bg-purple-400', textColor: 'text-white' },
  { letter: 'X', word: 'Xylophone', emoji: '🎵', color: '#FF6BB5', bgColor: 'bg-pink-400', textColor: 'text-white' },
  { letter: 'Y', word: 'Yarn', emoji: '🧶', color: '#FF6B6B', bgColor: 'bg-red-300', textColor: 'text-white' },
  { letter: 'Z', word: 'Zebra', emoji: '🦓', color: '#FF9F43', bgColor: 'bg-orange-300', textColor: 'text-white' },
]

export interface NumberEntry {
  number: number
  word: string
  emoji: string
  objects: string
  bgColor: string
}

export const NUMBERS_DATA: NumberEntry[] = [
  { number: 0, word: 'Zero', emoji: '✊', objects: '✊', bgColor: 'bg-indigo-400' },
  { number: 1, word: 'One', emoji: '👆', objects: '👆', bgColor: 'bg-red-400' },
  { number: 2, word: 'Two', emoji: '✌️', objects: '✌️', bgColor: 'bg-orange-400' },
  { number: 3, word: 'Three', emoji: '🤟', objects: '🤟', bgColor: 'bg-yellow-400' },
  { number: 4, word: 'Four', emoji: '✌️✌️', objects: '✌️✌️', bgColor: 'bg-green-400' },
  { number: 5, word: 'Five', emoji: '🖐️', objects: '🖐️', bgColor: 'bg-teal-400' },
  { number: 6, word: 'Six', emoji: '🖐️👆', objects: '🖐️👆', bgColor: 'bg-blue-400' },
  { number: 7, word: 'Seven', emoji: '🖐️✌️', objects: '🖐️✌️', bgColor: 'bg-purple-400' },
  { number: 8, word: 'Eight', emoji: '🖐️🤟', objects: '🖐️🤟', bgColor: 'bg-pink-400' },
  { number: 9, word: 'Nine', emoji: '🖐️🖐️', objects: '🖐️🖐️', bgColor: 'bg-red-300' },
  { number: 10, word: 'Ten', emoji: '🎉', objects: '🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉', bgColor: 'bg-orange-300' },
  { number: 11, word: 'Eleven', emoji: '🐸', objects: '🐸🐸🐸🐸🐸🐸🐸🐸🐸🐸🐸', bgColor: 'bg-yellow-300' },
  { number: 12, word: 'Twelve', emoji: '🦄', objects: '🦄🦄🦄🦄🦄🦄🦄🦄🦄🦄🦄🦄', bgColor: 'bg-green-300' },
  { number: 13, word: 'Thirteen', emoji: '🌈', objects: '🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈', bgColor: 'bg-teal-300' },
  { number: 14, word: 'Fourteen', emoji: '🐬', objects: '🐬🐬🐬🐬🐬🐬🐬🐬🐬🐬🐬🐬🐬🐬', bgColor: 'bg-blue-300' },
  { number: 15, word: 'Fifteen', emoji: '🍕', objects: '🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕', bgColor: 'bg-purple-300' },
  { number: 16, word: 'Sixteen', emoji: '🚀', objects: '🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀', bgColor: 'bg-pink-300' },
  { number: 17, word: 'Seventeen', emoji: '🌺', objects: '🌺🌺🌺🌺🌺🌺🌺🌺🌺🌺🌺🌺🌺🌺🌺🌺🌺', bgColor: 'bg-red-400' },
  { number: 18, word: 'Eighteen', emoji: '🦊', objects: '🦊🦊🦊🦊🦊🦊🦊🦊🦊🦊🦊🦊🦊🦊🦊🦊🦊🦊', bgColor: 'bg-orange-400' },
  { number: 19, word: 'Nineteen', emoji: '🎸', objects: '🎸🎸🎸🎸🎸🎸🎸🎸🎸🎸🎸🎸🎸🎸🎸🎸🎸🎸', bgColor: 'bg-yellow-400' },
  { number: 20, word: 'Twenty', emoji: '🏆', objects: '🏆🏆🏆🏆🏆🏆🏆🏆🏆🏆🏆🏆🏆🏆🏆🏆🏆🏆🏆🏆', bgColor: 'bg-green-400' },
]
