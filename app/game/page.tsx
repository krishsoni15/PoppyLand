import type { Metadata } from 'next'
import GameScreen from '@/components/game/GameScreen'
import { SITE_URL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'ABC Learning Game — Test Your Letters!',
  description:
    'Can you find the right letter? Play the LetterPop quiz game and earn stars! A fun letter recognition game for kids.',
  alternates: { canonical: `${SITE_URL}/game` },
}

export default function GamePage() {
  return <GameScreen />
}
