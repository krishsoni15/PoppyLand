import type { RewardTier } from '@/lib/rewards'

export default function RewardBanner({
  message,
  tier,
}: {
  message: string
  tier: RewardTier
}) {
  if (!message) return null

  const styles: Record<RewardTier, string> = {
    normal: 'hidden',
    big: 'from-brand-yellow to-brand-orange text-xl',
    mega: 'from-brand-purple to-brand-pink text-2xl',
    ultra: 'from-brand-red via-brand-yellow to-brand-blue text-3xl animate-pulse',
  }

  if (tier === 'normal') return null

  return (
    <p
      className={`reward-banner animate-pop rounded-2xl bg-gradient-to-r px-4 py-3 text-center font-fredoka font-bold text-white shadow-xl ${styles[tier]}`}
      role="status"
    >
      {message}
    </p>
  )
}
