import type { Metadata } from 'next'
import MyNameScreen from '@/components/myname/MyNameScreen'
import { SITE_URL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Spell My Name',
  description: 'Find the letters in your name with LetterPop!',
  alternates: { canonical: `${SITE_URL}/myname` },
}

export default function MyNamePage() {
  return <MyNameScreen />
}
