export type FlashType = 'green' | 'red' | 'gold' | 'rainbow'

export default function ScreenFlash({ type }: { type: FlashType }) {
  return (
    <div
      className={`screen-flash screen-flash--${type}`}
      aria-hidden="true"
    />
  )
}
