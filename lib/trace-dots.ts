/** Normalized 0–100 coords for letter tracing.
 *  Each letter has `segments`: array of separate strokes (for visual rendering).
 *  `flat`: all points merged (for validation — user can draw in any order).
 */
export type TraceDot = { x: number; y: number }

// Each entry is an array of strokes. Each stroke is an array of points.
const letterSegments: Record<string, TraceDot[][]> = {
  A: [
    [{ x: 50, y: 10 }, { x: 25, y: 90 }],           // left leg
    [{ x: 50, y: 10 }, { x: 75, y: 90 }],           // right leg
    [{ x: 33, y: 55 }, { x: 67, y: 55 }],           // crossbar
  ],
  B: [
    [{ x: 28, y: 10 }, { x: 28, y: 90 }],
    [{ x: 28, y: 10 }, { x: 55, y: 10 }, { x: 68, y: 20 }, { x: 68, y: 36 }, { x: 55, y: 48 }, { x: 28, y: 48 }],
    [{ x: 28, y: 48 }, { x: 58, y: 48 }, { x: 72, y: 60 }, { x: 72, y: 76 }, { x: 58, y: 90 }, { x: 28, y: 90 }],
  ],
  C: [
    [{ x: 72, y: 22 }, { x: 55, y: 10 }, { x: 35, y: 12 }, { x: 20, y: 28 }, { x: 15, y: 50 }, { x: 20, y: 72 }, { x: 35, y: 88 }, { x: 55, y: 90 }, { x: 72, y: 78 }],
  ],
  D: [
    [{ x: 28, y: 10 }, { x: 28, y: 90 }],
    [{ x: 28, y: 10 }, { x: 52, y: 10 }, { x: 70, y: 25 }, { x: 78, y: 50 }, { x: 70, y: 75 }, { x: 52, y: 90 }, { x: 28, y: 90 }],
  ],
  E: [
    [{ x: 28, y: 10 }, { x: 28, y: 90 }],
    [{ x: 28, y: 10 }, { x: 72, y: 10 }],
    [{ x: 28, y: 50 }, { x: 62, y: 50 }],
    [{ x: 28, y: 90 }, { x: 72, y: 90 }],
  ],
  F: [
    [{ x: 28, y: 10 }, { x: 28, y: 90 }],
    [{ x: 28, y: 10 }, { x: 72, y: 10 }],
    [{ x: 28, y: 50 }, { x: 62, y: 50 }],
  ],
  G: [
    [{ x: 72, y: 22 }, { x: 55, y: 10 }, { x: 35, y: 12 }, { x: 20, y: 28 }, { x: 15, y: 50 }, { x: 20, y: 72 }, { x: 35, y: 88 }, { x: 55, y: 90 }, { x: 72, y: 78 }, { x: 72, y: 55 }, { x: 50, y: 55 }],
  ],
  H: [
    [{ x: 28, y: 10 }, { x: 28, y: 90 }],
    [{ x: 72, y: 10 }, { x: 72, y: 90 }],
    [{ x: 28, y: 50 }, { x: 72, y: 50 }],
  ],
  I: [
    [{ x: 35, y: 10 }, { x: 65, y: 10 }],
    [{ x: 50, y: 10 }, { x: 50, y: 90 }],
    [{ x: 35, y: 90 }, { x: 65, y: 90 }],
  ],
  J: [
    [{ x: 35, y: 10 }, { x: 65, y: 10 }],
    [{ x: 60, y: 10 }, { x: 60, y: 72 }, { x: 55, y: 85 }, { x: 42, y: 90 }, { x: 30, y: 80 }, { x: 28, y: 65 }],
  ],
  K: [
    [{ x: 28, y: 10 }, { x: 28, y: 90 }],
    [{ x: 72, y: 10 }, { x: 28, y: 50 }],
    [{ x: 28, y: 50 }, { x: 72, y: 90 }],
  ],
  L: [
    [{ x: 28, y: 10 }, { x: 28, y: 90 }, { x: 72, y: 90 }],
  ],
  M: [
    [{ x: 18, y: 90 }, { x: 18, y: 10 }, { x: 50, y: 52 }, { x: 82, y: 10 }, { x: 82, y: 90 }],
  ],
  N: [
    [{ x: 25, y: 90 }, { x: 25, y: 10 }, { x: 75, y: 90 }, { x: 75, y: 10 }],
  ],
  O: [
    [{ x: 50, y: 10 }, { x: 72, y: 20 }, { x: 82, y: 50 }, { x: 72, y: 80 }, { x: 50, y: 90 }, { x: 28, y: 80 }, { x: 18, y: 50 }, { x: 28, y: 20 }, { x: 50, y: 10 }],
  ],
  P: [
    [{ x: 28, y: 90 }, { x: 28, y: 10 }],
    [{ x: 28, y: 10 }, { x: 55, y: 10 }, { x: 70, y: 20 }, { x: 70, y: 38 }, { x: 55, y: 50 }, { x: 28, y: 50 }],
  ],
  Q: [
    [{ x: 50, y: 10 }, { x: 72, y: 20 }, { x: 82, y: 50 }, { x: 72, y: 80 }, { x: 50, y: 90 }, { x: 28, y: 80 }, { x: 18, y: 50 }, { x: 28, y: 20 }, { x: 50, y: 10 }],
    [{ x: 60, y: 72 }, { x: 80, y: 92 }],
  ],
  R: [
    [{ x: 28, y: 90 }, { x: 28, y: 10 }],
    [{ x: 28, y: 10 }, { x: 55, y: 10 }, { x: 70, y: 20 }, { x: 70, y: 38 }, { x: 55, y: 50 }, { x: 28, y: 50 }],
    [{ x: 50, y: 50 }, { x: 75, y: 90 }],
  ],
  S: [
    [{ x: 72, y: 18 }, { x: 52, y: 10 }, { x: 30, y: 18 }, { x: 26, y: 34 }, { x: 36, y: 46 }, { x: 64, y: 54 }, { x: 74, y: 66 }, { x: 70, y: 82 }, { x: 48, y: 90 }, { x: 28, y: 82 }],
  ],
  T: [
    [{ x: 18, y: 10 }, { x: 82, y: 10 }],
    [{ x: 50, y: 10 }, { x: 50, y: 90 }],
  ],
  U: [
    [{ x: 25, y: 10 }, { x: 25, y: 68 }, { x: 30, y: 82 }, { x: 50, y: 90 }, { x: 70, y: 82 }, { x: 75, y: 68 }, { x: 75, y: 10 }],
  ],
  V: [
    [{ x: 18, y: 10 }, { x: 50, y: 90 }, { x: 82, y: 10 }],
  ],
  W: [
    [{ x: 12, y: 10 }, { x: 28, y: 90 }, { x: 50, y: 48 }, { x: 72, y: 90 }, { x: 88, y: 10 }],
  ],
  X: [
    [{ x: 20, y: 10 }, { x: 80, y: 90 }],
    [{ x: 80, y: 10 }, { x: 20, y: 90 }],
  ],
  Y: [
    [{ x: 18, y: 10 }, { x: 50, y: 50 }, { x: 82, y: 10 }],
    [{ x: 50, y: 50 }, { x: 50, y: 90 }],
  ],
  Z: [
    [{ x: 18, y: 10 }, { x: 82, y: 10 }],
    [{ x: 82, y: 10 }, { x: 18, y: 90 }],
    [{ x: 18, y: 90 }, { x: 82, y: 90 }],
  ],
}

export function getLetterSegments(letter: string): TraceDot[][] {
  return letterSegments[letter.toUpperCase()] ?? letterSegments['A']
}

// Flat path = all segments merged — used for validation
export function getTraceDots(letter: string): TraceDot[] {
  const segs = getLetterSegments(letter)
  return segs.flat()
}

export const TRACE_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
