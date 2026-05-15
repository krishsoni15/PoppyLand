import type { Metadata } from 'next'
import NumbersScreen from '@/components/numbers/NumbersScreen'
import { SITE_URL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Learn Numbers 1 to 20',
  description:
    'Tap numbers 1–20 to count along with fun emojis and voice pronunciation. Great for teaching toddlers to count.',
  alternates: { canonical: `${SITE_URL}/numbers` },
}

export default function NumbersPage() {
  return <NumbersScreen />
}
