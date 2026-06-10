import { ImageResponse } from 'next/og';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

/* Favicon: kiwi sobre verde bosque, generado en el build */
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
          background: 'linear-gradient(135deg, #0e2a14 0%, #1d4a27 100%)',
          borderRadius: 14,
          fontSize: 40,
        }}
      >
        🥝
      </div>
    ),
    { ...size }
  );
}
