export type NormPoint = { x: number; y: number }

export type TraceKind =
  | 'vertical-line'
  | 'horizontal-line'
  | 'diagonal-line'
  | 'curve'
  | 'zigzag'
  | 'shape'
  | 'letter'
  | 'number'

function pointToSegmentDistance(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): number {
  const dx = x2 - x1
  const dy = y2 - y1
  const lenSq = dx * dx + dy * dy
  if (lenSq === 0) return Math.hypot(px - x1, py - y1)
  let t = ((px - x1) * dx + (py - y1) * dy) / lenSq
  t = Math.max(0, Math.min(1, t))
  const projX = x1 + t * dx
  const projY = y1 + t * dy
  return Math.hypot(px - projX, py - projY)
}

export function distanceToPath(point: NormPoint, path: NormPoint[]): number {
  if (path.length === 0) return Infinity
  if (path.length === 1) return Math.hypot(point.x - path[0].x, point.y - path[0].y)

  let min = Infinity
  for (let i = 0; i < path.length - 1; i++) {
    const d = pointToSegmentDistance(
      point.x,
      point.y,
      path[i].x,
      path[i].y,
      path[i + 1].x,
      path[i + 1].y,
    )
    if (d < min) min = d
  }
  return min
}

export function densifyPath(path: NormPoint[], step = 2.5): NormPoint[] {
  if (path.length < 2) return [...path]
  const out: NormPoint[] = []
  for (let i = 0; i < path.length - 1; i++) {
    const a = path[i]
    const b = path[i + 1]
    const dist = Math.hypot(b.x - a.x, b.y - a.y)
    const steps = Math.max(1, Math.ceil(dist / step))
    for (let s = 0; s <= steps; s++) {
      const t = s / steps
      out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t })
    }
  }
  return out
}

export interface TraceValidationResult {
  coverage: number
  success: boolean
  drawnEnough: boolean
}

function validateVerticalLine(ghostPath: NormPoint[], userPoints: NormPoint[]): TraceValidationResult {
  if (userPoints.length < 8) {
    return { coverage: 0, success: false, drawnEnough: false }
  }

  const xs = ghostPath.map((p) => p.x)
  const ys = ghostPath.map((p) => p.y)
  const pathX = (Math.min(...xs) + Math.max(...xs)) / 2
  const pathMinY = Math.min(...ys)
  const pathMaxY = Math.max(...ys)
  const pathLen = pathMaxY - pathMinY || 1

  const userYs = userPoints.map((p) => p.y)
  const userMinY = Math.min(...userYs)
  const userMaxY = Math.max(...userYs)
  const overlapTop = Math.max(userMinY, pathMinY)
  const overlapBottom = Math.min(userMaxY, pathMaxY)
  const spanCoverage = Math.max(0, overlapBottom - overlapTop) / pathLen

  const inCorridor = userPoints.filter((p) => Math.abs(p.x - pathX) <= 22).length / userPoints.length

  const coverage = Math.min(1, spanCoverage * 0.7 + inCorridor * 0.3)
  const success = spanCoverage >= 0.92 && inCorridor >= 0.65

  return { coverage, success, drawnEnough: true }
}

function validateHorizontalLine(ghostPath: NormPoint[], userPoints: NormPoint[]): TraceValidationResult {
  if (userPoints.length < 8) {
    return { coverage: 0, success: false, drawnEnough: false }
  }

  const xs = ghostPath.map((p) => p.x)
  const ys = ghostPath.map((p) => p.y)
  const pathY = (Math.min(...ys) + Math.max(...ys)) / 2
  const pathMinX = Math.min(...xs)
  const pathMaxX = Math.max(...xs)
  const pathLen = pathMaxX - pathMinX || 1

  const userXs = userPoints.map((p) => p.x)
  const userMinX = Math.min(...userXs)
  const userMaxX = Math.max(...userXs)
  const overlapLeft = Math.max(userMinX, pathMinX)
  const overlapRight = Math.min(userMaxX, pathMaxX)
  const spanCoverage = Math.max(0, overlapRight - overlapLeft) / pathLen

  const inCorridor = userPoints.filter((p) => Math.abs(p.y - pathY) <= 20).length / userPoints.length
  const coverage = Math.min(1, spanCoverage * 0.7 + inCorridor * 0.3)
  const success = spanCoverage >= 0.92 && inCorridor >= 0.65

  return { coverage, success, drawnEnough: true }
}

function validatePathTrace(
  ghostPath: NormPoint[],
  userPoints: NormPoint[],
  threshold: number,
  minCoverage: number,
): TraceValidationResult {
  const samples = densifyPath(ghostPath, 3)
  // Need at least 12 user points before we even consider success
  if (samples.length === 0 || userPoints.length < 12) {
    return { coverage: 0, success: false, drawnEnough: userPoints.length >= 12 }
  }

  let matched = 0
  for (const sample of samples) {
    const near = userPoints.some((p) => distanceToPath(p, [sample]) <= threshold)
    if (near) matched++
  }

  const coverage = matched / samples.length
  const success = userPoints.length >= 12 && coverage >= minCoverage
  return { coverage, success, drawnEnough: userPoints.length >= 12 }
}

const KIND_CONFIG: Record<TraceKind, { threshold: number; minCoverage: number }> = {
  'vertical-line':   { threshold: 22, minCoverage: 0.90 },
  'horizontal-line': { threshold: 22, minCoverage: 0.90 },
  'diagonal-line':   { threshold: 22, minCoverage: 0.82 },
  curve:             { threshold: 22, minCoverage: 0.78 },
  zigzag:            { threshold: 20, minCoverage: 0.78 },
  shape:             { threshold: 20, minCoverage: 0.75 },
  letter:            { threshold: 20, minCoverage: 0.68 },
  number:            { threshold: 20, minCoverage: 0.68 },
}

export function validateTracing(
  ghostPath: NormPoint[],
  userPoints: NormPoint[],
  kind: TraceKind = 'letter',
): TraceValidationResult {
  if (kind === 'vertical-line') return validateVerticalLine(ghostPath, userPoints)
  if (kind === 'horizontal-line') return validateHorizontalLine(ghostPath, userPoints)

  const { threshold, minCoverage } = KIND_CONFIG[kind]
  return validatePathTrace(ghostPath, userPoints, threshold, minCoverage)
}

export function isPointOnPath(
  point: NormPoint,
  ghostPath: NormPoint[],
  kind: TraceKind = 'letter',
): boolean {
  if (kind === 'vertical-line') {
    const pathX = ghostPath.reduce((s, p) => s + p.x, 0) / ghostPath.length
    return Math.abs(point.x - pathX) <= 24
  }
  if (kind === 'horizontal-line') {
    const pathY = ghostPath.reduce((s, p) => s + p.y, 0) / ghostPath.length
    return Math.abs(point.y - pathY) <= 24
  }
  const threshold = KIND_CONFIG[kind]?.threshold ?? 18
  return distanceToPath(point, ghostPath) <= threshold
}

export function getKidFeedback(coverage: number, success: boolean, kind: TraceKind): string {
  if (success) return 'You did it! 🌟'
  if (kind === 'vertical-line') {
    if (coverage < 0.15) return 'Start at the green dot ⬇️ drag down!'
    if (coverage < 0.4)  return 'Good! Keep going down! 👇'
    if (coverage < 0.7)  return 'Halfway there! Keep going! 💪'
    if (coverage < 0.88) return 'Almost done! Just a little more! 🔥'
    return 'So close! Lift your pen to finish! ✨'
  }
  if (kind === 'horizontal-line') {
    if (coverage < 0.15) return 'Start at the dot → drag across!'
    if (coverage < 0.4)  return 'Nice! Keep going sideways! ↔️'
    if (coverage < 0.7)  return 'Halfway! Keep dragging across! 💪'
    if (coverage < 0.88) return 'Almost done! Nearly there! 🔥'
    return 'So close! Lift your pen to finish! ✨'
  }
  if (coverage < 0.2)  return 'Drag along the colorful path! ✏️'
  if (coverage < 0.45) return 'Great start — keep tracing! 💪'
  if (coverage < 0.7)  return 'Halfway there! Keep going! 🎨'
  if (coverage < 0.88) return 'Almost done! Finish the path! 🔥'
  return 'So close! Lift your pen to finish! ⭐'
}
