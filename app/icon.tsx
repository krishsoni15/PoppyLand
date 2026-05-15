import { ImageResponse } from 'next/og'

export const size = { width: 512, height: 512 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #FF6B6B, #FECA57, #4D96FF)',
          borderRadius: 96,
          fontSize: 220,
        }}
      >
        🌈
      </div>
    ),
    { ...size },
  )
}
