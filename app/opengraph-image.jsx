import { ImageResponse } from 'next/og';

export const alt = 'Plan Kiwi Joven — Tu casa, en tu país. Créditos hipotecarios desde 2,25% para jóvenes de 24 a 40 años.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/* Imagen para compartir en WhatsApp, X, LinkedIn, etc. (1200×630) */
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: 'linear-gradient(135deg, #081a0c 0%, #0e2a14 45%, #1d4a27 100%)',
          padding: 70,
          position: 'relative',
        }}
      >
        {/* kiwi gigante de fondo */}
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            right: -40,
            bottom: -60,
            fontSize: 380,
            opacity: 0.16,
            transform: 'rotate(-12deg)',
          }}
        >
          🥝
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 26,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              color: '#a4d65e',
              fontSize: 26,
              letterSpacing: 4,
              fontWeight: 700,
            }}
          >
            <div
              style={{
                display: 'flex',
                width: 18,
                height: 18,
                borderRadius: 99,
                background: '#7ac143',
              }}
            />
            PENSADO PARA TU FUTURO
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              fontSize: 110,
              fontWeight: 800,
              color: '#f5f1e6',
              lineHeight: 1.05,
            }}
          >
            <span>PLAN</span>
            <span style={{ color: '#7ac143' }}>KIWI JOVEN</span>
          </div>

          <div style={{ display: 'flex', fontSize: 40, color: '#f2c94c' }}>
            Tu casa, en tu país.
          </div>

          <div style={{ display: 'flex', gap: 18, marginTop: 14 }}>
            <div
              style={{
                display: 'flex',
                background: '#7ac143',
                color: '#0e2a14',
                fontSize: 28,
                fontWeight: 800,
                padding: '14px 30px',
                borderRadius: 99,
              }}
            >
              Créditos desde 2,25%
            </div>
            <div
              style={{
                display: 'flex',
                border: '3px solid rgba(245,241,230,.4)',
                color: '#f5f1e6',
                fontSize: 28,
                padding: '14px 30px',
                borderRadius: 99,
              }}
            >
              Para jóvenes de 24 a 40 años
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
