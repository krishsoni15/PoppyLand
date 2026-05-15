type PageVariant = 'warm' | 'cool' | 'play' | 'home'

const variantStyles: Record<PageVariant, string> = {
  home: 'from-[#FFF4E8] via-[#FFF9F0] to-[#F0E8FF]',
  warm: 'from-[#FFE8D6] via-[#FFF9F0] to-[#FFD6E8]',
  cool: 'from-[#D6EEFF] via-[#FFF9F0] to-[#E8D6FF]',
  play: 'from-[#E8D6FF] via-[#FFF0F5] to-[#D6F5FF]',
}

interface PageShellProps {
  variant?: PageVariant
  children: React.ReactNode
}

export default function PageShell({ variant = 'warm', children }: PageShellProps) {
  return (
    <div
      className={`relative min-h-[100dvh] overflow-hidden bg-gradient-to-br ${variantStyles[variant]}`}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="blob blob-a" />
        <div className="blob blob-b" />
        <div className="blob blob-c" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.55),transparent_55%)]" />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
