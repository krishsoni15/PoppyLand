export default function Toast({ message }: { message: string }) {
  return (
    <div
      className="toast-enter fixed bottom-24 left-1/2 z-[60] -translate-x-1/2 rounded-2xl bg-white px-6 py-3 font-fredoka text-lg text-gray-800 shadow-xl"
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  )
}
