export type NormPoint = { x: number; y: number }

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

/** Minimum distance from point to polyline (normalized 0–100 space). */
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

const DEFAULT_THRESHOLD = 14
const SUCCESS_COVERAGE = 0.68
const MIN_USER_POINTS = 12

export function validateTracing(
  ghostPath: NormPoint[],
  userPoints: NormPoint[],
  threshold = DEFAULT_THRESHOLD,
): TraceValidationResult {
  const samples = densifyPath(ghostPath, 2)
  if (samples.length === 0 || userPoints.length < MIN_USER_POINTS) {
    return { coverage: 0, success: false, drawnEnough: userPoints.length >= MIN_USER_POINTS }
  }

  let matched = 0
  for (const sample of samples) {
    const near = userPoints.some((p) => distanceToPath(p, [sample]) <= threshold)
    if (near) matched++
  }

  const coverage = matched / samples.length
  const drawnEnough = userPoints.length >= MIN_USER_POINTS
  const success = drawnEnough && coverage >= SUCCESS_COVERAGE

  return { coverage, success, drawnEnough }
}

export function isPointOnPath(
  point: NormPoint,
  ghostPath: NormPoint[],
  threshold = DEFAULT_THRESHOLD,
): boolean {
  return distanceToPath(point, ghostPath) <= threshold
}
