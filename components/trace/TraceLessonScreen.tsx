'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import NavBar from '@/components/ui/NavBar'
import PageShell from '@/components/ui/PageShell'
import BigDisplay from '@/components/ui/BigDisplay'
import TraceProgressStrip from '@/components/trace/TraceProgressStrip'
import TraceDirectionArrow from '@/components/trace/TraceDirectionArrow'
import TraceSuccessOverlay from '@/components/trace/TraceSuccessOverlay'
import { getActivityById, ACTIVITY_ORDER } from '@/lib/handwriting-paths'
import { getNextActivityId } from '@/lib/handwriting-progress'
import { useHandwritingProgress } from '@/hooks/useHandwritingProgress'
import { useSpeech } from '@/hooks/useSpeech'
import { useDopamine } from '@/hooks/useDopamine'
import { useApp } from '@/components/providers/AppProvider'

const TraceCanvas = dynamic(() => import('@/components/trace/TraceCanvas'), {
  ssr: false,
  loading: () => (
    <div className="mx-auto flex aspect-square w-full max-w-[520px] items-center justify-center rounded-3xl bg-white/60">
      <p className="font-fredoka text-2xl text-gray-400">Loading magic canvas… ✨</p>
    </div>
  ),
})

interface TraceLessonScreenProps {
  activityId: string
}

export default function TraceLessonScreen({ activityId }: TraceLessonScreenProps) {
  const router = useRouter()
  const activity = getActivityById(activityId)
  const { markComplete, isUnlocked, progress } = useHandwritingProgress()
  const { speak } = useSpeech()
  const { triggerCorrect } = useDopamine()
  const { setPoppy, toast } = useApp()

  const [coverage, setCoverage] = useState(0)
  const [resetToken, setResetToken] = useState(0)
  const [highContrast, setHighContrast] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [earnedStars, setEarnedStars] = useState(3)
  const [canvasWidth, setCanvasWidth] = useState(320)
  const canvasWrapRef = useRef<HTMLDivElement>(null)
  const spokeRef = useRef(false)

  const activityIndex = ACTIVITY_ORDER.indexOf(activityId)
  const unlocked = isUnlocked(activityId)

  useEffect(() => {
    if (!activity) return
    if (!unlocked) {
      router.replace('/trace')
      return
    }
    spokeRef.current = false
    const t = setTimeout(() => {
      if (!spokeRef.current) {
        spokeRef.current = true
        speak(activity.instruction)
      }
    }, 400)
    setPoppy('happy', 1500)
    return () => clearTimeout(t)
  }, [activity, unlocked, speak, setPoppy, router])

  useEffect(() => {
    const el = canvasWrapRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      setCanvasWidth(Math.min(entries[0].contentRect.width, 520))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    document.body.classList.add('trace-lesson-active')
    return () => document.body.classList.remove('trace-lesson-active')
  }, [])

  const handleSuccess = useCallback(
    (cov: number) => {
      const stars = cov >= 0.9 ? 3 : cov >= 0.78 ? 2 : 1
      setEarnedStars(stars)
      markComplete(activityId, cov)
      triggerCorrect({ tier: 'big', xpAmount: 2 })
      setPoppy('celebrate', 2500)
      toast('You traced it! ⭐')
      setShowSuccess(true)
    },
    [activityId, markComplete, triggerCorrect, setPoppy, toast],
  )

  const handleProgress = useCallback((cov: number) => {
    setCoverage(cov)
  }, [])

  const handleReset = () => {
    setCoverage(0)
    setResetToken((t) => t + 1)
    setShowSuccess(false)
    speak('Let us try again!')
  }

  const handleReplayAudio = () => {
    if (activity) speak(activity.instruction)
  }

  if (!activity) {
    return (
      <PageShell variant="warm">
        <NavBar title="Oops!" />
        <main className="flex min-h-[60dvh] flex-col items-center justify-center gap-4 p-8">
          <p className="font-fredoka text-3xl">Activity not found</p>
          <Link href="/trace" className="btn-3d rounded-2xl bg-brand-green px-8 py-4 font-fredoka text-xl text-white">
            Go Back
          </Link>
        </main>
      </PageShell>
    )
  }

  const nextId = getNextActivityId(activityId)
  const nextHref = nextId ? `/trace/activity/${nextId}` : null
  const phaseIndex = activityIndex >= 0 ? activityIndex + 1 : 1

  return (
    <PageShell variant="warm">
      <NavBar title={`${activity.emoji} ${activity.title}`} />

      <main className="mx-auto flex max-w-lg flex-col gap-3 px-3 pb-28 pt-1 sm:gap-4 sm:px-4">
        <TraceProgressStrip
          current={Math.round(coverage * 100)}
          total={100}
          label={`Step ${phaseIndex} of ${ACTIVITY_ORDER.length}`}
        />

        <div className="flex justify-center">
          <BigDisplay value={activity.label} color={activity.accent} />
        </div>

        <p className="text-center font-fredoka text-xl text-gray-600 sm:text-2xl">
          {activity.hint}
        </p>

        <div ref={canvasWrapRef} className="relative mx-auto w-full max-w-[520px]">
          <TraceCanvas
            ghostPath={activity.ghostPath}
            showGuides={activity.showGuides}
            highContrast={highContrast}
            accent={activity.accent}
            onProgress={handleProgress}
            onSuccess={handleSuccess}
            resetToken={resetToken}
            disabled={showSuccess}
          />
          {!showSuccess && (
            <TraceDirectionArrow ghostPath={activity.ghostPath} containerWidth={canvasWidth} />
          )}
        </div>

        <p className="text-center font-nunito text-lg font-bold text-brand-green sm:text-xl">
          {coverage >= 0.68 ? 'Almost there — keep going! ✨' : 'Trace on the glowing path ✏️'}
        </p>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <button
            type="button"
            onClick={handleReplayAudio}
            className="btn-3d btn-juice card-glass flex min-h-[3.75rem] items-center justify-center gap-2 rounded-2xl font-fredoka text-xl sm:text-2xl"
            aria-label="Hear instructions again"
          >
            🔊 Hear
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="btn-3d btn-juice card-glass flex min-h-[3.75rem] items-center justify-center gap-2 rounded-2xl font-fredoka text-xl sm:text-2xl"
            aria-label="Clear and try again"
          >
            🔄 Reset
          </button>
          <button
            type="button"
            onClick={() => setHighContrast((v) => !v)}
            className={`btn-3d btn-juice card-glass col-span-2 flex min-h-[3.25rem] items-center justify-center rounded-2xl font-fredoka text-lg sm:text-xl ${
              highContrast ? 'ring-2 ring-brand-yellow' : ''
            }`}
            aria-pressed={highContrast}
          >
            {highContrast ? '🌓 Easy See Mode ON' : '👀 Easy See Mode'}
          </button>
        </div>

        {nextHref && progress.completed.includes(activityId) && (
          <Link
            href={nextHref}
            className="btn-3d btn-juice mx-auto flex min-h-[4rem] w-full max-w-sm items-center justify-center rounded-2xl bg-brand-green font-fredoka text-2xl text-white shadow-lg"
          >
            Next →
          </Link>
        )}
      </main>

      {showSuccess && (
        <TraceSuccessOverlay
          stars={earnedStars}
          message="You did wonderful tracing!"
          nextHref={nextHref}
          onClose={() => setShowSuccess(false)}
        />
      )}
    </PageShell>
  )
}
