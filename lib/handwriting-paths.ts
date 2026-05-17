import { getTraceDots } from '@/lib/trace-dots'
import { densifyPath, type NormPoint } from '@/lib/handwriting-validation'

export type HandwritingPhase = 'prewriting' | 'letters' | 'numbers'

export interface HandwritingActivity {
  id: string
  phase: HandwritingPhase
  title: string
  label: string
  emoji: string
  instruction: string
  hint: string
  ghostPath: NormPoint[]
  showGuides: boolean
  accent: string
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
  return {
    id: `letter-${upper}`,
    phase: 'letters',
    title: `Letter ${upper}`,
    label: upper,
    emoji: '🔤',
    instruction: `Trace the letter ${upper}. Start at the dot!`,
    hint: 'Follow the glowing path with your finger.',
    ghostPath: fromDots(upper),
    showGuides: true,
    accent: '#FF6B6B',
  }
}

function numberPath(n: number): HandwritingActivity {
  const paths: Record<number, NormPoint[]> = {
    0: circle(50, 50, 32),
    1: line(50, 18, 50, 82),
    2: [
      ...line(28, 22, 72, 22, 4),
      ...line(72, 22, 28, 82, 6),
      ...line(28, 82, 72, 82, 4),
    ],
    3: [
      ...line(30, 20, 65, 20, 4),
      ...line(65, 20, 65, 50, 4),
      ...line(40, 50, 68, 50, 3),
      ...line(68, 50, 68, 80, 4),
      ...line(35, 80, 70, 80, 4),
    ],
    4: [...line(55, 15, 30, 55, 5), ...line(30, 55, 75, 55, 4), ...line(55, 15, 55, 85, 4)],
    5: [
      ...line(70, 18, 28, 18, 4),
      ...line(28, 18, 28, 48, 4),
      ...line(28, 48, 62, 48, 4),
      ...line(62, 48, 70, 65, 4),
      ...line(70, 65, 45, 85, 4),
      ...line(45, 85, 28, 82, 3),
    ],
    6: [
      ...line(65, 25, 40, 15, 4),
      ...circle(48, 55, 28, 14).slice(0, 20),
      ...line(48, 83, 70, 75, 3),
    ],
    7: [...line(25, 18, 75, 18, 4), ...line(75, 18, 45, 85, 6)],
    8: circle(50, 50, 32),
    9: [
      ...circle(52, 38, 26, 12).slice(0, 16),
      ...line(52, 64, 52, 85, 3),
      ...line(35, 85, 70, 85, 3),
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
  }
}

const PREWRITING: HandwritingActivity[] = [
  {
    id: 'standing-line',
    phase: 'prewriting',
    title: 'Standing Line',
    label: '|',
    emoji: '📏',
    instruction: 'Draw a tall line from top to bottom!',
    hint: 'Standing lines go up and down.',
    ghostPath: line(50, 12, 50, 88, 12),
    showGuides: false,
    accent: '#6BCB77',
  },
  {
    id: 'sleeping-line',
    phase: 'prewriting',
    title: 'Sleeping Line',
    label: '—',
    emoji: '😴',
    instruction: 'Draw a line across like a sleepy bridge!',
    hint: 'Sleeping lines go side to side.',
    ghostPath: line(12, 50, 88, 50, 12),
    showGuides: false,
    accent: '#6BCB77',
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
  },
  {
    id: 'curve',
    phase: 'prewriting',
    title: 'Curvy Line',
    label: '〜',
    emoji: '🌙',
    instruction: 'Make a soft curve like a smile!',
    hint: 'Curves are smooth and bendy.',
    ghostPath: [
      { x: 15, y: 55 },
      { x: 30, y: 30 },
      { x: 50, y: 25 },
      { x: 70, y: 30 },
      { x: 85, y: 55 },
    ],
    showGuides: false,
    accent: '#A855F7',
  },
  {
    id: 'zigzag',
    phase: 'prewriting',
    title: 'Zig Zag',
    label: '⚡',
    emoji: '⚡',
    instruction: 'Go up, down, up, down like lightning!',
    hint: 'Zig zags have pointy corners.',
    ghostPath: [
      { x: 15, y: 70 },
      { x: 35, y: 30 },
      { x: 55, y: 70 },
      { x: 75, y: 30 },
      { x: 85, y: 70 },
    ],
    showGuides: false,
    accent: '#FECA57',
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
