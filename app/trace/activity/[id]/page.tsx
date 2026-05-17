import type { Metadata } from 'next'
import TraceLessonScreen from '@/components/trace/TraceLessonScreen'
import { getActivityById } from '@/lib/handwriting-paths'
import { SITE_URL } from '@/lib/constants'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const activity = getActivityById(id)
  return {
    title: activity ? `Trace ${activity.title}` : 'Tracing',
    description: activity?.instruction ?? 'Practice handwriting tracing for kids.',
    alternates: { canonical: `${SITE_URL}/trace/activity/${id}` },
  }
}

export default async function TraceActivityPage({ params }: PageProps) {
  const { id } = await params
  return <TraceLessonScreen activityId={id} />
}
