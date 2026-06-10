import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

/* Ícono para iPhone/iPad (pantalla de inicio); iOS redondea solo */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0e2a14 0%, #1d4a27 100%)',
          fontSize: 110,
        }}
      >
        🥝
      </div>
    ),
    { ...size }
  );
}
