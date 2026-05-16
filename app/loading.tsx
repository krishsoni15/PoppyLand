'use client'

export default function Loading() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-sky-300 via-pink-200 to-yellow-100 text-center">
      <h1 className="text-5xl font-black text-white drop-shadow mb-4 animate-pulse">PoppyLand</h1>
      <div className="relative w-72 h-24 mb-4">
        <div className="absolute inset-0 animate-[rainbowReveal_2.4s_ease-in-out]">🌈</div>
        <div className="absolute right-10 top-4 text-5xl animate-bounce">⭐</div>
        <div className="absolute left-10 top-8 text-5xl animate-[jumpIn_1.2s_ease-out]">🤸</div>
      </div>
      <p className="text-lg font-bold text-white/95">Loading today’s magical world...</p>
      <style jsx>{`
        @keyframes rainbowReveal { from {opacity:0; transform:scaleX(0.2);} to {opacity:1; transform:scaleX(1);} }
        @keyframes jumpIn { from {opacity:0; transform:translateY(50px);} to {opacity:1; transform:translateY(0);} }
      `}</style>
    </main>
  )
}
