import type { Metadata } from 'next'
import BubblesScreen from '@/components/bubbles/BubblesScreen'
import { SITE_URL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Pop Letter Bubbles',
  description: 'Pop floating letter bubbles and hear each letter!',
  alternates: { canonical: `${SITE_URL}/bubbles` },
}

export default function BubblesPage() {
  return <BubblesScreen />
}
