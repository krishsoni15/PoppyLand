'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import NavBar from '@/components/ui/NavBar'
import PageShell from '@/components/ui/PageShell'
import BigDisplay from '@/components/ui/BigDisplay'
import TraceProgressStrip from '@/components/trace/TraceProgressStrip'
import TraceAnimatedDemo from '@/components/trace/TraceAnimatedDemo'
import TraceSuccessOverlay from '@/components/trace/TraceSuccessOverlay'
import { getActivityById, ACTIVITY_ORDER } from '@/lib/handwriting-paths'
import { getNextActivityId } from '@/lib/handwriting-progress'
import { getKidFeedback } from '@/lib/handwriting-validation'
import { useHandwritingProgress } from '@/hooks/useHandwritingProgress'
import { useSpeech } from '@/hooks/useSpeech'
import { useDopamine } from '@/hooks/useDopamine'
import { useApp } from '@/components/providers/AppProvider'

const TraceCanvas = dynamic(() => import('@/components/trace/TraceCanvas'), {
  ssr: false,
  loading: () => (
    <div className="mx-auto flex aspect-square w-full max-w-[520px] items-center justify-center rounded-3xl bg-white/80 ring-4 ring-white">
      <p className="font-fredoka text-2xl text-gray-500">Getting canvas ready… ✨</p>
    </div>
  ),
})

const LINE_KINDS = new Set(['vertical-line', 'horizontal-line', 'diagonal-line'])

interface TraceLessonScreenProps {
  activityId: string
}

export default function TraceLessonScreen({ activityId }: TraceLessonScreenProps) {
  const router = useRouter()
  const activity = getActivityById(activityId)
  const { markComplete, progress } = useHandwritingProgress()
  const { speak } = useSpeech()
  const { triggerCorrect } = useDopamine()
  const { setPoppy, toast } = useApp()

  const [coverage, setCoverage] = useState(0)
  const [resetToken, setResetToken] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [earnedStars, setEarnedStars] = useState(3)
  const [canvasWidth, setCanvasWidth] = useState(320)
  const [demoPlaying, setDemoPlaying] = useState(true)
  const [didSucceed, setDidSucceed] = useState(false)
  const didSucceedRef = useRef(false)
  const canvasWrapRef = useRef<HTMLDivElement>(null)
  const spokeRef = useRef(false)

  const activityIndex = ACTIVITY_ORDER.indexOf(activityId)
  const isLineLesson = activity ? LINE_KINDS.has(activity.traceKind) : false

  // Prev / Next activity IDs
  const prevId = activityIndex > 0 ? ACTIVITY_ORDER[activityIndex - 1] : null
  const nextId = getNextActivityId(activityId)
  const prevHref = prevId ? `/trace/activity/${prevId}` : null
  const nextHref = nextId ? `/trace/activity/${nextId}` : null

  // Reset everything when activity changes
  useEffect(() => {
    if (!activity) return
    didSucceedRef.current = false
    setDemoPlaying(true)
    setDidSucceed(false)
    setCoverage(0)
    setShowSuccess(false)
    setResetToken(t => t + 1)
    spokeRef.current = false
    const t = setTimeout(() => {
      if (!spokeRef.current) { spokeRef.current = true; speak(activity.instruction) }
    }, 500)
    setPoppy('happy', 1500)
    return () => clearTimeout(t)
  }, [activityId, activity, speak, setPoppy])

  useEffect(() => {
    const el = canvasWrapRef.current
    if (!el) return
    const ro = new ResizeObserver(entries => {
      setCanvasWidth(Math.min(entries[0].contentRect.width, 520))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    document.body.classList.add('trace-lesson-active')
    return () => document.body.classList.remove('trace-lesson-active')
  }, [])

  const handleDemoFinished = useCallback(() => {
    setDemoPlaying(false)
    speak('Now you try! Start at the green dot.')
  }, [speak])

  const handleSuccess = useCallback((cov: number) => {
    if (didSucceedRef.current) return
    didSucceedRef.current = true
    setDidSucceed(true)
    const stars = cov >= 0.85 ? 3 : cov >= 0.65 ? 2 : 1
    setEarnedStars(stars)
    markComplete(activityId, cov)
    triggerCorrect({ tier: 'big', xpAmount: 2 })
    setPoppy('celebrate', 2500)
    toast('Amazing tracing! ⭐')
    setShowSuccess(true)
    speak('Wow! You did it!')
  }, [activityId, markComplete, triggerCorrect, setPoppy, toast, speak])

  const handleProgress = useCallback((cov: number) => setCoverage(cov), [])

  const handleTryAgain = () => {
    didSucceedRef.current = false
    setCoverage(0)
    setDidSucceed(false)
    setShowSuccess(false)
    setDemoPlaying(false)
    setResetToken(t => t + 1)
    speak('Try again! Start at the green dot!')
  }

  const handleReplayAudio = () => { if (activity) speak(activity.instruction) }

  if (!activity) {
    return (
      <PageShell variant="warm">
        <NavBar title="Oops!" backHref="/trace" />
        <main className="flex min-h-[60dvh] flex-col items-center justify-center gap-4 p-8">
          <p className="font-fredoka text-3xl">Activity not found</p>
          <Link href="/trace" className="btn-3d rounded-2xl bg-brand-green px-8 py-4 font-fredoka text-xl text-white">
            Go Back
          </Link>
        </main>
      </PageShell>
    )
  }

  const feedback = getKidFeedback(coverage, didSucceed, activity.traceKind)
  const alreadyDone = progress.completed.includes(activityId)

  return (
    <PageShell variant="warm">
      <NavBar title={`${activity.emoji} ${activity.title}`} backHref="/trace" />

      <main className="mx-auto flex max-w-lg flex-col gap-3 px-3 pb-32 pt-1 sm:gap-4 sm:px-4">

        {/* Progress strip */}
        <TraceProgressStrip
          current={Math.round(coverage * 100)}
          total={100}
          label={isLineLesson ? 'Draw on the big green line' : `Step ${activityIndex + 1} of ${ACTIVITY_ORDER.length}`}
        />

        {/* Letter / shape display */}
        {!isLineLesson && (
          <div className="flex justify-center">
            <BigDisplay value={activity.label} color={activity.accent} />
          </div>
        )}
        {isLineLesson && (
          <p className="text-center font-fredoka text-3xl font-bold sm:text-4xl" style={{ color: activity.accent }}>
            {activity.traceKind === 'vertical-line' ? 'Standing Line |' : activity.label}
          </p>
        )}

        <p className="text-center font-fredoka text-lg text-gray-500 sm:text-xl">{activity.hint}</p>

        {/* Direction hint */}
        {!demoPlaying && !showSuccess && (
          <p className="text-center font-fredoka text-xl font-bold text-brand-purple">
            {activity.traceKind === 'vertical-line' ? '👇 Green dot → drag DOWN'
              : activity.traceKind === 'horizontal-line' ? '👉 Green dot → drag ACROSS'
              : '👆 Drag on the green path'}
          </p>
        )}

        {/* Canvas */}
        <div ref={canvasWrapRef} className="relative mx-auto w-full max-w-[520px] touch-none">
          <TraceCanvas
            ghostPath={activity.ghostPath}
            ghostSegments={activity.ghostSegments}
            traceKind={activity.traceKind}
            showGuides={activity.showGuides}
            highContrast={false}
            accent={activity.accent}
            onProgress={handleProgress}
            onSuccess={handleSuccess}
            resetToken={resetToken}
            disabled={showSuccess}
            demoActive={demoPlaying}
          />
          {demoPlaying && !showSuccess && (
            <TraceAnimatedDemo
              ghostPath={activity.ghostPath}
              traceKind={activity.traceKind}
              accent={activity.accent}
              size={canvasWidth}
              onFinished={handleDemoFinished}
            />
          )}
        </div>

        {/* Feedback text */}
        <p className={`text-center font-fredoka text-2xl font-bold sm:text-3xl ${
          didSucceed ? 'text-brand-green'
          : coverage > 0.6 ? 'text-brand-orange'
          : 'text-brand-blue'
        }`}>
          {feedback}
        </p>

        {/* Almost there banner */}
        {!didSucceed && coverage >= 0.72 && (
          <p className="animate-pulse text-center font-fredoka text-lg font-bold text-brand-green">
            🔥 Almost there — keep going!
          </p>
        )}

        {/* Action buttons row */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <button type="button" onClick={handleReplayAudio}
            className="btn-3d btn-juice card-glass flex min-h-[3.5rem] items-center justify-center gap-2 rounded-2xl font-fredoka text-xl">
            🔊 Hear
          </button>
          <button type="button" onClick={handleTryAgain}
            className="btn-3d btn-juice card-glass flex min-h-[3.5rem] items-center justify-center gap-2 rounded-2xl font-fredoka text-xl">
            🔄 Try Again
          </button>
        </div>

        {/* Prev / Next navigation — always visible */}
        <div className="flex gap-3">
          {prevHref ? (
            <Link href={prevHref}
              className="btn-3d btn-juice card-glass flex flex-1 min-h-[3.5rem] items-center justify-center gap-2 rounded-2xl font-fredoka text-xl text-gray-600">
              ← Prev
            </Link>
          ) : (
            <div className="flex-1" />
          )}

          {nextHref ? (
            <Link href={nextHref}
              className={`btn-3d btn-juice flex flex-1 min-h-[3.5rem] items-center justify-center gap-2 rounded-2xl font-fredoka text-xl text-white ${
                didSucceed || alreadyDone
                  ? 'bg-brand-green shadow-lg'
                  : 'bg-gray-300 opacity-60'
              }`}
              onClick={e => {
                // Allow navigation even if not completed — just skip
              }}
            >
              {didSucceed || alreadyDone ? '⭐ Next →' : 'Skip →'}
            </Link>
          ) : (
            <Link href="/trace"
              className="btn-3d btn-juice flex flex-1 min-h-[3.5rem] items-center justify-center gap-2 rounded-2xl bg-brand-purple font-fredoka text-xl text-white">
              🏠 Done!
            </Link>
          )}
        </div>

      </main>

      {showSuccess && (
        <TraceSuccessOverlay
          stars={earnedStars}
          message="You traced it perfectly!"
          nextHref={nextHref}
          onClose={() => {
            setShowSuccess(false)
            if (nextHref) router.push(nextHref)
            else router.push('/trace')
          }}
        />
      )}
    </PageShell>
  )
}
