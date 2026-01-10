import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Nayos Burgers - Las Mejores Hamburguesas de La Ceiba'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 80,
          background: '#F5E6D3',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#9B292C',
          fontWeight: 900,
          padding: '40px',
        }}
      >
        <div style={{
          fontSize: 120,
          fontWeight: 900,
          marginBottom: 20,
          textTransform: 'uppercase',
          letterSpacing: '-0.05em',
        }}>
          NAYOS
        </div>
        <div style={{
          fontSize: 50,
          fontWeight: 700,
          textAlign: 'center',
        }}>
          Las Mejores Hamburguesas de La Ceiba
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
