import type { Metadata } from 'next'
import TraceScreen from '@/components/trace/TraceScreen'
import { SITE_URL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Trace Letters',
  description: 'Practice writing letters by tracing dots!',
  alternates: { canonical: `${SITE_URL}/trace` },
}

export default function TracePage() {
  return <TraceScreen />
}
