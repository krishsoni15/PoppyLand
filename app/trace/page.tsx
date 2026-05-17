import type { Metadata } from 'next'
import TraceHubScreen from '@/components/trace/TraceHubScreen'
import { SITE_URL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Trace Valley — Handwriting Practice',
  description:
    'Mobile-friendly tracing for preschool kids. Lines, letters, and numbers with voice guidance and stars!',
  alternates: { canonical: `${SITE_URL}/trace` },
}

export default function TracePage() {
  return <TraceHubScreen />
}
