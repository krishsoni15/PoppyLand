import type { Metadata } from 'next'
import AlphabetScreen from '@/components/alphabet/AlphabetScreen'
import { SITE_URL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Learn the Alphabet — A to Z',
  description:
    'Tap any letter A–Z to hear it spoken aloud with a fun word. A is for Apple, B is for Ball! Perfect for toddlers and preschoolers.',
  alternates: { canonical: `${SITE_URL}/alphabet` },
}

export default function AlphabetPage() {
  return <AlphabetScreen />
}
