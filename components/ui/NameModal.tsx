'use client'

import { useState } from 'react'

interface NameModalProps {
  open: boolean
  onClose: () => void
  onSave: (name: string) => void
  initial?: string
}

export default function NameModal({ open, onClose, onSave, initial = '' }: NameModalProps) {
  const [value, setValue] = useState(initial)

  if (!open) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const clean = value.replace(/[^a-zA-Z]/g, '').slice(0, 12)
    if (clean.length > 0) {
      onSave(clean)
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Enter child's name"
    >
      <form
        onSubmit={handleSubmit}
        className="card-glass w-full max-w-md rounded-3xl p-6"
      >
        <h2 className="font-fredoka text-2xl text-gray-800">My Name ✨</h2>
        <p className="mt-2 font-nunito text-sm text-gray-500">
          Parent: type your child&apos;s first name (letters only, max 12)
        </p>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value.replace(/[^a-zA-Z]/g, ''))}
          maxLength={12}
          className="mt-4 w-full rounded-2xl border-2 border-brand-pink/40 bg-white px-4 py-3 font-fredoka text-2xl uppercase text-gray-800 focus:border-brand-pink focus:outline-none"
          placeholder="EMMA"
          aria-label="Child name"
          autoFocus
        />
        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="btn-juice min-h-12 flex-1 rounded-2xl bg-gray-100 font-fredoka text-lg text-gray-600"
            aria-label="Cancel"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-3d btn-juice min-h-12 flex-1 rounded-2xl bg-gradient-to-r from-brand-pink to-brand-purple font-fredoka text-lg text-white"
            aria-label="Save name"
          >
            Save ✨
          </button>
        </div>
      </form>
    </div>
  )
}
