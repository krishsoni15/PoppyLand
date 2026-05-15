'use client'

import Link from 'next/link'
import NavBar from '@/components/ui/NavBar'
import PageShell from '@/components/ui/PageShell'
import { useApp } from '@/components/providers/AppProvider'
import { ALPHABET_DATA, NUMBERS_DATA } from '@/lib/data'
import { getCollectionCount, lettersRemaining, numbersRemaining } from '@/lib/collection'

export default function CollectionScreen() {
  const { collection } = useApp()
  const total = getCollectionCount(collection)
  const lettersLeft = lettersRemaining(collection)
  const numbersLeft = numbersRemaining(collection)

  return (
    <PageShell variant="cool">
      <NavBar title="My Stickers 🎴" />

      <main className="mx-auto max-w-4xl px-4 pb-24 pt-2">
        <div className="card-glass mb-6 rounded-3xl p-4 text-center">
          <p className="font-fredoka text-3xl text-brand-purple">
            {total} / 46 collected
          </p>
          {(lettersLeft === 1 || lettersLeft === 2) && (
            <p className="mt-2 font-nunito text-sm text-brand-orange">
              Almost there! Only {lettersLeft} letter{lettersLeft > 1 ? 's' : ''} left!
            </p>
          )}
          {(numbersLeft === 1 || numbersLeft === 2) && (
            <p className="mt-2 font-nunito text-sm text-brand-teal">
              Almost there! Only {numbersLeft} number{numbersLeft > 1 ? 's' : ''} left!
            </p>
          )}
        </div>

        <h2 className="mb-3 font-fredoka text-xl text-gray-700">Letters A–Z</h2>
        <div className="mb-8 grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8">
          {ALPHABET_DATA.map((entry) => {
            const unlocked = collection.letters.includes(entry.letter)
            return (
              <div
                key={entry.letter}
                className={`flex min-h-[4.5rem] flex-col items-center justify-center rounded-2xl border-2 p-2 ${
                  unlocked
                    ? 'border-brand-yellow bg-white sticker-sparkle'
                    : 'border-gray-200 bg-gray-100 opacity-60'
                }`}
                aria-label={
                  unlocked
                    ? `${entry.letter} ${entry.word} unlocked`
                    : `${entry.letter} locked`
                }
              >
                {unlocked ? (
                  <>
                    <span className="text-3xl" aria-hidden="true">
                      {entry.emoji}
                    </span>
                    <span className="font-fredoka text-lg">{entry.letter}</span>
                  </>
                ) : (
                  <>
                    <span className="text-2xl text-gray-400" aria-hidden="true">
                      🔒
                    </span>
                    <span className="font-fredoka text-lg text-gray-400">{entry.letter}</span>
                  </>
                )}
              </div>
            )
          })}
        </div>

        <h2 className="mb-3 font-fredoka text-xl text-gray-700">Numbers 1–20</h2>
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-6">
          {NUMBERS_DATA.map((entry) => {
            const unlocked = collection.numbers.includes(entry.number)
            return (
              <div
                key={entry.number}
                className={`flex min-h-[4.5rem] flex-col items-center justify-center rounded-2xl border-2 p-2 ${
                  unlocked
                    ? 'border-brand-blue bg-white sticker-sparkle'
                    : 'border-gray-200 bg-gray-100 opacity-60'
                }`}
              >
                {unlocked ? (
                  <>
                    <span className="text-2xl" aria-hidden="true">
                      {entry.emoji}
                    </span>
                    <span className="font-fredoka text-lg">{entry.number}</span>
                  </>
                ) : (
                  <>
                    <span className="text-xl text-gray-400">🔒</span>
                    <span className="font-fredoka text-lg text-gray-400">{entry.number}</span>
                  </>
                )}
              </div>
            )
          })}
        </div>

        <Link
          href="/alphabet"
          className="btn-3d btn-juice mt-8 flex min-h-[3.75rem] items-center justify-center rounded-3xl bg-gradient-to-r from-brand-red to-brand-orange font-fredoka text-xl text-white"
        >
          Collect more stickers! 📖
        </Link>
      </main>
    </PageShell>
  )
}
