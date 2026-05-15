export default function GameLoading() {
  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center gap-6 px-4">
      <div className="h-16 w-48 animate-pulse rounded-2xl bg-brand-purple/30" />
      <div className="grid grid-cols-2 gap-4 max-w-sm w-full">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-3xl bg-gray-200 animate-pulse" />
        ))}
      </div>
    </div>
  )
}
