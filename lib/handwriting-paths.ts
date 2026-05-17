import { getTraceDots, getLetterSegments } from '@/lib/trace-dots'
import { densifyPath, type NormPoint, type TraceKind } from '@/lib/handwriting-validation'

export type HandwritingPhase = 'prewriting' | 'letters' | 'numbers'

export interface HandwritingActivity {
  id: string
  phase: HandwritingPhase
  title: string
  label: string
  emoji: string
  instruction: string
  hint: string
  ghostPath: NormPoint[]        // flattened all segments — used for validation
  ghostSegments?: NormPoint[][] // separate visual segments — used for rendering
  showGuides: boolean
  accent: string
  traceKind: TraceKind
}

function line(x1: number, y1: number, x2: number, y2: number, steps = 8): NormPoint[] {
  const pts: NormPoint[] = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    pts.push({ x: x1 + (x2 - x1) * t, y: y1 + (y2 - y1) * t })
  }
  return pts
}

function circle(cx: number, cy: number, r: number, segments = 24): NormPoint[] {
  const pts: NormPoint[] = []
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2 - Math.PI / 2
    pts.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r })
  }
  return pts
}

function fromDots(letter: string): NormPoint[] {
  return densifyPath(getTraceDots(letter), 3)
}

function letterPath(letter: string): HandwritingActivity {
  const upper = letter.toUpperCase()
  const multiStroke = new Set(['A','E','F','H','I','K','T','X','Y','B','D','G','P','R','Q','Z'])
  const hint = multiStroke.has(upper)
    ? 'Lift your pen between strokes — all strokes count!'
    : 'Follow the glowing path with your finger.'
  const segs = getLetterSegments(upper)
  const ghostSegments = segs.map(seg => densifyPath(seg, 2.5))
  const ghostPath = ghostSegments.flat()
  return {
    id: `letter-${upper}`,
    phase: 'letters',
    title: `Letter ${upper}`,
    label: upper,
    emoji: '🔤',
    instruction: `Trace the letter ${upper}. Start at the dot!`,
    hint,
    ghostPath,
    ghostSegments,
    showGuides: true,
    accent: '#FF6B6B',
    traceKind: 'letter',
  }
}

function numberPath(n: number): HandwritingActivity {
  const paths: Record<number, NormPoint[]> = {
    // 0: oval
    0: circle(50, 50, 34),
    // 1: straight line down
    1: line(50, 12, 50, 88),
    // 2: top arc, diagonal, bottom bar
    2: [
      ...line(28, 30, 35, 18, 3),
      ...line(35, 18, 65, 18, 4),
      ...line(65, 18, 72, 30, 3),
      ...line(72, 30, 28, 82, 8),
      ...line(28, 82, 72, 82, 4),
    ],
    // 3: top arc right, middle, bottom arc right
    3: [
      ...line(28, 18, 65, 18, 4),
      ...line(65, 18, 72, 30, 3),
      ...line(72, 30, 55, 50, 4),
      ...line(55, 50, 72, 68, 4),
      ...line(72, 68, 65, 82, 3),
      ...line(65, 82, 28, 82, 4),
    ],
    // 4: left diagonal, crossbar, right spine
    4: [
      ...line(60, 12, 22, 60, 6),
      ...line(22, 60, 78, 60, 5),
      ...line(60, 12, 60, 88, 6),
    ],
    // 5: top bar left, spine down, arc right
    5: [
      ...line(72, 12, 28, 12, 4),
      ...line(28, 12, 28, 50, 4),
      ...line(28, 50, 60, 50, 4),
      ...line(60, 50, 72, 62, 3),
      ...line(72, 62, 72, 72, 3),
      ...line(72, 72, 60, 85, 3),
      ...line(60, 85, 28, 82, 4),
    ],
    // 6: arc from top, full circle at bottom
    6: [
      ...line(68, 18, 45, 12, 3),
      ...line(45, 12, 25, 30, 4),
      ...line(25, 30, 22, 55, 3),
      ...circle(48, 68, 22, 16),
    ],
    // 7: top bar, diagonal down
    7: [
      ...line(22, 12, 78, 12, 5),
      ...line(78, 12, 42, 88, 8),
    ],
    // 8: top circle, bottom circle
    8: [
      ...circle(50, 35, 22, 16),
      ...circle(50, 65, 26, 16),
    ],
    // 9: top circle, tail down
    9: [
      ...circle(50, 35, 26, 16),
      ...line(76, 35, 72, 65, 4),
      ...line(72, 65, 55, 85, 4),
      ...line(55, 85, 35, 82, 3),
    ],
  }

  return {
    id: `num-${n}`,
    phase: 'numbers',
    title: `Number ${n}`,
    label: String(n),
    emoji: '🔢',
    instruction: `Trace the number ${n}!`,
    hint: 'Go slow and stay on the sparkly path.',
    ghostPath: densifyPath(paths[n] ?? paths[0], 2.5),
    showGuides: true,
    accent: '#4D96FF',
    traceKind: 'number',
  }
}

const PREWRITING: HandwritingActivity[] = [
  {
    id: 'standing-line',
    phase: 'prewriting',
    title: 'Standing Line',
    label: '|',
    emoji: '📏',
    instruction: 'Watch the finger, then drag from the green dot down!',
    hint: 'Top to bottom — like rain falling!',
    ghostPath: line(50, 15, 50, 85, 16),
    showGuides: false,
    accent: '#6BCB77',
    traceKind: 'vertical-line',
  },
  {
    id: 'sleeping-line',
    phase: 'prewriting',
    title: 'Sleeping Line',
    label: '—',
    emoji: '😴',
    instruction: 'Drag from the green dot across to the other side!',
    hint: 'Left to right — like a bridge!',
    ghostPath: line(15, 50, 85, 50, 16),
    showGuides: false,
    accent: '#6BCB77',
    traceKind: 'horizontal-line',
  },
  {
    id: 'diagonal-line',
    phase: 'prewriting',
    title: 'Diagonal Line',
    label: '/',
    emoji: '↗️',
    instruction: 'Slide your finger from corner to corner!',
    hint: 'Diagonal lines are slanted.',
    ghostPath: line(22, 78, 78, 22, 12),
    showGuides: false,
    accent: '#4ECDC4',
    traceKind: 'diagonal-line',
  },
  {
    id: 'curve',
    phase: 'prewriting',
    title: 'Curvy Line',
    label: '〜',
    emoji: '🌙',
    instruction: 'Make a soft curve like a smile!',
    hint: 'Curves are smooth and bendy.',
    ghostPath: densifyPath([
      { x: 12, y: 60 },
      { x: 22, y: 38 },
      { x: 35, y: 22 },
      { x: 50, y: 18 },
      { x: 65, y: 22 },
      { x: 78, y: 38 },
      { x: 88, y: 60 },
    ], 2),
    showGuides: false,
    accent: '#A855F7',
    traceKind: 'curve',
  },
  {
    id: 'zigzag',
    phase: 'prewriting',
    title: 'Zig Zag',
    label: '⚡',
    emoji: '⚡',
    instruction: 'Go up, down, up, down like lightning!',
    hint: 'Zig zags have pointy corners.',
    ghostPath: densifyPath([
      { x: 12, y: 75 },
      { x: 30, y: 25 },
      { x: 48, y: 75 },
      { x: 66, y: 25 },
      { x: 84, y: 75 },
    ], 2),
    showGuides: false,
    accent: '#FECA57',
    traceKind: 'zigzag',
  },
  {
    id: 'circle-shape',
    phase: 'prewriting',
    title: 'Circle',
    label: '○',
    emoji: '⭕',
    instruction: 'Round and round — draw a circle!',
    hint: 'Start at the top and go around.',
    ghostPath: circle(50, 50, 34),
    showGuides: false,
    accent: '#FF6BB5',
    traceKind: 'shape',
  },
  {
    id: 'square-shape',
    phase: 'prewriting',
    title: 'Square',
    label: '□',
    emoji: '🟦',
    instruction: 'Trace all four sides of the square!',
    hint: 'Squares have four equal sides.',
    ghostPath: [
      ...line(25, 25, 75, 25, 4),
      ...line(75, 25, 75, 75, 4),
      ...line(75, 75, 25, 75, 4),
      ...line(25, 75, 25, 25, 4),
    ],
    showGuides: false,
    accent: '#4D96FF',
    traceKind: 'shape',
  },
  {
    id: 'triangle-shape',
    phase: 'prewriting',
    title: 'Triangle',
    label: '△',
    emoji: '🔺',
    instruction: 'Draw a pointy triangle!',
    hint: 'Three sides make a triangle.',
    ghostPath: [
      ...line(50, 18, 22, 78, 6),
      ...line(22, 78, 78, 78, 6),
      ...line(78, 78, 50, 18, 6),
    ],
    showGuides: false,
    accent: '#FF9F43',
    traceKind: 'shape',
  },
]

const LOWERCASE: HandwritingActivity[] = [
  {
    id: 'letter-a-lower',
    phase: 'letters',
    title: 'Little a',
    label: 'a',
    emoji: '🔤',
    instruction: 'Trace the little letter a!',
    hint: 'Start on the right side of the circle.',
    ghostPath: densifyPath(
      [
        { x: 62, y: 55 },
        { x: 38, y: 55 },
        { x: 32, y: 70 },
        { x: 45, y: 82 },
        { x: 62, y: 75 },
        { x: 62, y: 88 },
      ],
      3,
    ),
    showGuides: true,
    accent: '#FF6B6B',
    traceKind: 'letter',
  },
  {
    id: 'letter-b-lower',
    phase: 'letters',
    title: 'Little b',
    label: 'b',
    emoji: '🔤',
    instruction: 'Trace the little letter b!',
    hint: 'Line first, then the bump.',
    ghostPath: densifyPath(
      [
        { x: 32, y: 18 },
        { x: 32, y: 88 },
        { x: 32, y: 52 },
        { x: 55, y: 48 },
        { x: 68, y: 58 },
        { x: 68, y: 72 },
        { x: 52, y: 82 },
        { x: 32, y: 78 },
      ],
      3,
    ),
    showGuides: true,
    accent: '#FF6B6B',
    traceKind: 'letter',
  },
  {
    id: 'letter-c-lower',
    phase: 'letters',
    title: 'Little c',
    label: 'c',
    emoji: '🔤',
    instruction: 'Trace the little letter c!',
    hint: 'Like a tiny moon.',
    ghostPath: densifyPath(
      [
        { x: 68, y: 35 },
        { x: 42, y: 28 },
        { x: 28, y: 50 },
        { x: 42, y: 72 },
        { x: 68, y: 65 },
      ],
      3,
    ),
    showGuides: true,
    accent: '#FF6B6B',
    traceKind: 'letter',
  },
]

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letterPath)
const NUMBERS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(numberPath)

export const HANDWRITING_ACTIVITIES: HandwritingActivity[] = [
  ...PREWRITING,
  ...UPPERCASE,
  ...LOWERCASE,
  ...NUMBERS,
]

export const ACTIVITY_ORDER = HANDWRITING_ACTIVITIES.map((a) => a.id)

export const HANDWRITING_CATEGORIES = [
  {
    id: 'prewriting' as const,
    title: 'Lines & Shapes',
    subtitle: 'Warm up your fingers!',
    emoji: '✏️',
    color: '#6BCB77',
    shadow: '#3D9E48',
    phase: 'prewriting' as HandwritingPhase,
  },
  {
    id: 'letters' as const,
    title: 'ABC Letters',
    subtitle: 'Big and little letters',
    emoji: '🔤',
    color: '#FF6B6B',
    shadow: '#C94A4A',
    phase: 'letters' as HandwritingPhase,
  },
  {
    id: 'numbers' as const,
    title: '123 Numbers',
    subtitle: 'Count and trace!',
    emoji: '🔢',
    color: '#4D96FF',
    shadow: '#2E6FCC',
    phase: 'numbers' as HandwritingPhase,
  },
]

export function getActivityById(id: string): HandwritingActivity | undefined {
  return HANDWRITING_ACTIVITIES.find((a) => a.id === id)
}

export function getActivitiesForPhase(phase: HandwritingPhase): HandwritingActivity[] {
  return HANDWRITING_ACTIVITIES.filter((a) => a.phase === phase)
}
