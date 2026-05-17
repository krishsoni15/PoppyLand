import type { Metadata } from 'next'
import TracePathScreen from '@/components/trace/TracePathScreen'
import { HANDWRITING_CATEGORIES } from '@/lib/handwriting-paths'
import { SITE_URL } from '@/lib/constants'

interface PageProps {
  params: Promise<{ phase: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { phase } = await params
  const cat = HANDWRITING_CATEGORIES.find((c) => c.id === phase)
  return {
    title: cat ? `${cat.title} — Tracing` : 'Tracing Path',
    alternates: { canonical: `${SITE_URL}/trace/path/${phase}` },
  }
}

export default async function TracePathPage({ params }: PageProps) {
  const { phase } = await params
  return <TracePathScreen phaseId={phase} />
}
