'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import NavBar from '@/components/ui/NavBar'
import PageShell from '@/components/ui/PageShell'
import {
  ACTIVITY_ORDER,
  HANDWRITING_CATEGORIES,
  getActivitiesForPhase,
} from '@/lib/handwriting-paths'
import { getCategoryProgress } from '@/lib/handwriting-progress'
import { useHandwritingProgress } from '@/hooks/useHandwritingProgress'
import { useSpeech } from '@/hooks/useSpeech'
import { useApp } from '@/components/providers/AppProvider'

export default function TraceHubScreen() {
  const { progress, ready } = useHandwritingProgress()
  const { speak } = useSpeech()
  const { streak } = useApp()

  const totalDone = progress.completed.length
  const totalActs = ACTIVITY_ORDER.length
  const journeyPct = totalActs > 0 ? Math.round((totalDone / totalActs) * 100) : 0

  const continueId =
    ACTIVITY_ORDER.find((id) => !progress.completed.includes(id)) ?? ACTIVITY_ORDER[0]

  return (
    <PageShell variant="warm">
      <NavBar title="Trace Valley ✏️" />

      <main className="mx-auto flex max-w-lg flex-col gap-5 px-4 pb-28 pt-2">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-glass rounded-3xl p-5 text-center"
        >
          <p className="font-fredoka text-2xl text-gray-700 sm:text-3xl">
            Magic Handwriting Playground
          </p>
          <p className="mt-2 font-nunito text-lg text-gray-500">
            Lines → Letters → Numbers. Trace with your finger!
          </p>
          {ready && (
            <div className="mt-4">
              <p className="font-fredoka text-lg text-brand-green">
                Journey: {totalDone} / {totalActs} ⭐
              </p>
              <div className="mx-auto mt-2 h-3 max-w-xs overflow-hidden rounded-full bg-white/80">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-brand-pink to-brand-green"
                  style={{ width: `${journeyPct}%` }}
                  layout
                />
              </div>
              {streak.current > 0 && (
                <p className="mt-2 font-nunito text-base text-brand-orange">
                  🔥 {streak.current} day streak!
                </p>
              )}
            </div>
          )}
        </motion.div>

        <Link
          href={`/trace/activity/${continueId}`}
          onClick={() => speak("Let's keep tracing!")}
          className="btn-3d btn-juice flex min-h-[4.5rem] items-center justify-center gap-3 rounded-3xl bg-brand-green font-fredoka text-2xl text-white shadow-lg sm:text-3xl"
        >
          <span className="text-4xl">▶️</span>
          Continue Tracing
        </Link>

        <p className="text-center font-fredoka text-xl text-gray-600">Pick a path</p>

        <div className="flex flex-col gap-4">
          {HANDWRITING_CATEGORIES.map((cat, i) => {
            const acts = getActivitiesForPhase(cat.phase)
            const { done, total, stars } = getCategoryProgress(
              acts.map((a) => a.id),
              progress,
            )

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  href={`/trace/path/${cat.id}`}
                  onClick={() => speak(cat.subtitle)}
                  className="btn-3d btn-juice card-glass flex min-h-[5.5rem] items-center gap-4 rounded-3xl p-4 transition-transform active:scale-[0.98]"
                  style={{
                    boxShadow: `0 6px 0 ${cat.shadow}`,
                  }}
                >
                  <span
                    className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-4xl"
                    style={{ backgroundColor: `${cat.color}33` }}
                  >
                    {cat.emoji}
                  </span>
                  <div className="flex-1 text-left">
                    <p className="font-fredoka text-2xl" style={{ color: cat.color }}>
                      {cat.title}
                    </p>
                    <p className="font-nunito text-base text-gray-500">{cat.subtitle}</p>
                    <p className="mt-1 font-nunito text-sm font-bold text-gray-400">
                      {done}/{total} done · {stars} ⭐
                    </p>
                  </div>
                  <span className="font-fredoka text-3xl text-gray-400">→</span>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </main>
    </PageShell>
  )
}
