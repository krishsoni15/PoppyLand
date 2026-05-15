export default function NumbersLoading() {
  const Wrapper = 'div' as const
  const Box = 'div' as const
  const Cell = 'div' as const

  return (
    <Wrapper className="min-h-screen bg-bg flex flex-col items-center justify-center gap-6 px-4">
      <Box className="h-32 w-32 animate-pulse rounded-3xl bg-blue-400/30" />
      <Box className="grid grid-cols-5 gap-2 max-w-md w-full">
        {Array.from({ length: 10 }).map((_, i) => (
          <Cell key={i} className="h-14 rounded-2xl bg-gray-200 animate-pulse" />
        ))}
      </Box>
    </Wrapper>
  )
}
