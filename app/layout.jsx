import StyledJsxRegistry from './registry';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

const title = 'Plan Kiwi Joven — Tu casa, en tu país';
const description =
  'Créditos hipotecarios desde 2,25% para jóvenes de 24 a 40 años. La respuesta a la crisis habitacional de Nueva Zelanda. Con el respaldo del Estado y los bancos ANZ, ASB, BNZ y Kiwibank.';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: '%s · Plan Kiwi Joven',
  },
  description,
  keywords: [
    'Plan Kiwi Joven', 'Nueva Zelanda', 'crisis habitacional',
    'créditos hipotecarios', 'primera vivienda', 'economía', 'UADE',
  ],
  openGraph: {
    title,
    description,
    url: '/',
    siteName: 'Plan Kiwi Joven',
    locale: 'es_AR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600&family=Caveat:wght@600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <StyledJsxRegistry>{children}</StyledJsxRegistry>
      </body>
    </html>
  );
}
