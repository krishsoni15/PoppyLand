'use client'

import { useState } from 'react'
import NavBar from '@/components/ui/NavBar'
import PageShell from '@/components/ui/PageShell'
import { useApp } from '@/components/providers/AppProvider'
import { getCollectionCount, TOTAL_STICKERS } from '@/lib/collection'
import { readStorage, writeStorage, STORAGE_KEYS } from '@/lib/storage'
import type { VisitState } from '@/lib/visits'

const AVATARS = [
  { id: 'star', emoji: '⭐', label: 'Star' },
  { id: 'rocket', emoji: '🚀', label: 'Rocket' },
  { id: 'unicorn', emoji: '🦄', label: 'Unicorn' },
  { id: 'dino', emoji: '🦕', label: 'Dinosaur' },
  { id: 'robot', emoji: '🤖', label: 'Robot' },
  { id: 'cat', emoji: '🐱', label: 'Cat' },
  { id: 'sun', emoji: '☀️', label: 'Sun' },
  { id: 'rainbow', emoji: '🌈', label: 'Rainbow' },
]

const COLORS = [
  { id: 'red', value: '#FF6B6B', label: 'Red' },
  { id: 'orange', value: '#FF9F43', label: 'Orange' },
  { id: 'yellow', value: '#FECA57', label: 'Yellow' },
  { id: 'green', value: '#6BCB77', label: 'Green' },
  { id: 'blue', value: '#4D96FF', label: 'Blue' },
  { id: 'purple', value: '#A855F7', label: 'Purple' },
]

interface ProfileData {
  avatar: string
  color: string
}

export default function ProfilePage() {
  const { xp, collection, childName, streak, setChildName } = useApp()
  const collected = getCollectionCount(collection)
  const visits = readStorage<VisitState>(STORAGE_KEYS.visits, { dates: [] })

  const [profile, setProfileState] = useState<ProfileData>(() =>
    readStorage<ProfileData>(STORAGE_KEYS.profile, { avatar: 'star', color: '#FF6B6B' }),
  )
  const [confirmReset, setConfirmReset] = useState(false)

  const updateProfile = (updates: Partial<ProfileData>) => {
    const next = { ...profile, ...updates }
    setProfileState(next)
    writeStorage(STORAGE_KEYS.profile, next)

    // Update CSS accent
    if (updates.color && typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--color-accent', updates.color)
    }
  }

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true)
      return
    }
    // Clear all storage
    Object.values(STORAGE_KEYS).forEach((key) => {
      if (typeof window !== 'undefined') localStorage.removeItem(key)
    })
    setConfirmReset(false)
    window.location.reload()
  }

  const activeAvatar = AVATARS.find((a) => a.id === profile.avatar) ?? AVATARS[0]

  return (
    <PageShell variant="home">
      <NavBar title="My Profile 👤" />

      <main className="mx-auto flex max-w-lg flex-col gap-6 px-4 pb-36 pt-2">
        {/* Avatar + Name Display */}
        <div className="card-glass rounded-3xl p-6 text-center">
          <div className="mx-auto mb-3 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-brand-yellow to-brand-orange text-5xl shadow-lg">
            {activeAvatar.emoji}
          </div>
          <h2 className="font-fredoka text-3xl text-shimmer">
            {childName || 'Learner'}
          </h2>
          <p className="mt-1 font-nunito text-sm text-gray-500">
            {xp} XP · Level {collection.letters.length > 20 ? 'Super Star' : 'Explorer'}
          </p>
        </div>

        {/* Choose Avatar */}
        <section className="card-glass rounded-3xl p-4">
          <h3 className="mb-3 font-fredoka text-lg text-gray-700">Pick your avatar</h3>
          <div className="grid grid-cols-4 gap-3">
            {AVATARS.map((av) => (
              <button
                key={av.id}
                type="button"
                onClick={() => updateProfile({ avatar: av.id })}
                className={`flex min-h-16 flex-col items-center justify-center rounded-2xl border-2 p-2 text-2xl transition hover:scale-105 ${
                  profile.avatar === av.id
                    ? 'border-brand-purple bg-brand-purple/10 ring-2 ring-brand-purple'
                    : 'border-gray-200 bg-white'
                }`}
                aria-label={`Select ${av.label} avatar`}
                aria-pressed={profile.avatar === av.id}
              >
                {av.emoji}
                <span className="mt-0.5 font-nunito text-[10px] text-gray-500">{av.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Choose Color */}
        <section className="card-glass rounded-3xl p-4">
          <h3 className="mb-3 font-fredoka text-lg text-gray-700">Favorite color</h3>
          <div className="flex justify-center gap-3">
            {COLORS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => updateProfile({ color: c.value })}
                className={`h-12 w-12 rounded-full border-4 transition hover:scale-110 ${
                  profile.color === c.value ? 'border-gray-800 ring-2 ring-offset-2' : 'border-white'
                }`}
                style={{ background: c.value }}
                aria-label={`Select ${c.label} color`}
                aria-pressed={profile.color === c.value}
              />
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="card-glass rounded-3xl p-4">
          <h3 className="mb-4 font-fredoka text-lg text-gray-700">My Stats</h3>
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Total XP" value={String(xp)} emoji="✨" />
            <StatCard label="Stickers" value={`${collected} / ${TOTAL_STICKERS}`} emoji="🎴" />
            <StatCard label="Best Streak" value={String(streak.best)} emoji="🔥" />
            <StatCard label="Days Visited" value={String(visits.dates.length)} emoji="🗓️" />
          </div>
        </section>

        {/* Reset */}
        <section className="card-glass rounded-3xl p-4 text-center">
          <button
            type="button"
            onClick={handleReset}
            className={`btn-juice min-h-12 w-full rounded-2xl font-fredoka text-lg transition ${
              confirmReset
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
            aria-label={confirmReset ? 'Confirm reset' : 'Reset progress'}
          >
            {confirmReset ? 'Are you sure? Tap again to confirm' : '🗑️ Reset Progress'}
          </button>
          {confirmReset && (
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              className="mt-2 font-nunito text-sm text-gray-500 underline"
            >
              Cancel
            </button>
          )}
        </section>
      </main>
    </PageShell>
  )
}

function StatCard({ label, value, emoji }: { label: string; value: string; emoji: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-white/60 p-3">
      <span className="text-2xl">{emoji}</span>
      <span className="mt-1 font-fredoka text-xl text-gray-800">{value}</span>
      <span className="font-nunito text-xs text-gray-500">{label}</span>
    </div>
  )
}
