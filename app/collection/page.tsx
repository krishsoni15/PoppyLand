import type { Metadata } from 'next'
import CollectionScreen from '@/components/collection/CollectionScreen'
import { SITE_URL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'My Sticker Collection',
  description: 'Collect all 46 letter and number stickers in LetterPop!',
  alternates: { canonical: `${SITE_URL}/collection` },
}

export default function CollectionPage() {
  return <CollectionScreen />
}
