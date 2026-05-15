interface KeyboardHintProps {
  hints: string[]
}

export default function KeyboardHint({ hints }: KeyboardHintProps) {
  return (
    <div
      className="mx-auto flex max-w-xl flex-wrap items-center justify-center gap-2 px-4 py-3"
      aria-label="Keyboard shortcuts"
    >
      <span className="rounded-full bg-white/70 px-3 py-1 font-nunito text-xs font-bold text-gray-500 shadow-sm">
        ⌨️ Keyboard
      </span>
      {hints.map((hint) => (
        <kbd
          key={hint}
          className="rounded-xl border-2 border-white bg-white/95 px-3 py-1.5 font-nunito text-xs font-bold text-gray-700 shadow-md"
        >
          {hint}
        </kbd>
      ))}
    </div>
  )
}
