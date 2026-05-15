export default function AlphabetLoading() {
  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center gap-6 px-4">
      <div className="h-32 w-32 animate-pulse rounded-3xl bg-red-400/30" />
      <div className="grid grid-cols-6 gap-2 max-w-md w-full">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="h-14 rounded-2xl bg-gray-200 animate-pulse" />
        ))}
      </div>
    </div>
  )
}
