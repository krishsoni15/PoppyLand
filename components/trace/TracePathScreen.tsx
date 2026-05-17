'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import NavBar from '@/components/ui/NavBar'
import PageShell from '@/components/ui/PageShell'
import {
  HANDWRITING_CATEGORIES,
  getActivitiesForPhase,
  type HandwritingPhase,
} from '@/lib/handwriting-paths'
import { useHandwritingProgress } from '@/hooks/useHandwritingProgress'
import { useSpeech } from '@/hooks/useSpeech'

const PHASE_IDS = new Set<string>(HANDWRITING_CATEGORIES.map((c) => c.id))

interface TracePathScreenProps {
  phaseId: string
}

export default function TracePathScreen({ phaseId }: TracePathScreenProps) {
  const router = useRouter()
  const { progress, isUnlocked } = useHandwritingProgress()
  const { speak } = useSpeech()

  const category = HANDWRITING_CATEGORIES.find((c) => c.id === phaseId)
  const phase = category?.phase as HandwritingPhase | undefined
  const activities = phase ? getActivitiesForPhase(phase) : []

  if (!category || !phase || !PHASE_IDS.has(phaseId)) {
    return (
      <PageShell variant="warm">
        <NavBar title="Trace Valley" backHref="/trace" />
        <main className="flex min-h-[50dvh] items-center justify-center p-8">
          <button
            type="button"
            onClick={() => router.push('/trace')}
            className="btn-3d rounded-2xl bg-brand-green px-8 py-4 font-fredoka text-2xl text-white"
          >
            Go Back
          </button>
        </main>
      </PageShell>
    )
  }

  return (
    <PageShell variant="warm">
      <NavBar title={`${category.emoji} ${category.title}`} backHref="/trace" />

      <main className="mx-auto flex max-w-lg flex-col gap-3 px-4 pb-28">
        <p className="text-center font-fredoka text-xl text-gray-600">{category.subtitle}</p>

        <ul className="flex flex-col gap-3">
          {activities.map((act, i) => {
            const unlocked = isUnlocked(act.id)
            const done = progress.completed.includes(act.id)
            const stars = progress.stars[act.id] ?? 0

            return (
              <motion.li
                key={act.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                {unlocked ? (
                  <Link
                    href={`/trace/activity/${act.id}`}
                    onClick={() => speak(act.title)}
                    className="btn-3d btn-juice card-glass flex min-h-[4.25rem] items-center gap-4 rounded-2xl px-4"
                  >
                    <span
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl font-fredoka text-3xl"
                      style={{
                        backgroundColor: `${act.accent}22`,
                        color: act.accent,
                      }}
                    >
                      {act.label.length > 2 ? act.emoji : act.label}
                    </span>
                    <div className="flex-1 text-left">
                      <p className="font-fredoka text-xl text-gray-800">{act.title}</p>
                      {done && (
                        <p className="font-nunito text-sm text-brand-green">
                          {'⭐'.repeat(stars) || '✓ Done'}
                        </p>
                      )}
                    </div>
                    <span className="text-2xl">{done ? '✅' : '✏️'}</span>
                  </Link>
                ) : (
                  <div
                    className="card-glass flex min-h-[4.25rem] items-center gap-4 rounded-2xl px-4 opacity-60"
                    aria-disabled
                  >
                    <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100 text-2xl">
                      🔒
                    </span>
                    <p className="font-fredoka text-xl text-gray-400">{act.title}</p>
                  </div>
                )}
              </motion.li>
            )
          })}
        </ul>
      </main>
    </PageShell>
  )
}
