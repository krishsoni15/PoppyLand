export type RewardTier = 'normal' | 'big' | 'mega' | 'ultra'

export interface RewardResult {
  tier: RewardTier
  xpBonus: number
  message: string
}

export function rollReward(): RewardResult {
  const r = Math.random() * 100

  if (r < 5) {
    return { tier: 'ultra', xpBonus: 3, message: '🌈 RAINBOW ROUND! 🌈' }
  }
  if (r < 15) {
    return { tier: 'mega', xpBonus: 0, message: 'SUPER STAR! ⭐' }
  }
  if (r < 40) {
    return { tier: 'big', xpBonus: 0, message: 'Amazing! 🌟' }
  }
  return { tier: 'normal', xpBonus: 0, message: '' }
}
