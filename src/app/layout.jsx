import './globals.css';

export const metadata = {
  metadataBase: new URL('https://docentesglabal.vercel.app'),
  title: 'Manual Digital Docente 2026 | CIIP Latam - Geomina - Biomedic',
  description: 'Manual operativo para docentes del ecosistema CIIP Latam, Geomina y Biomedic. Guía de metodología práctica, horarios de entrega, normas de imagen y programa Docente TOP 2026.',
  robots: {
    index: true,
    follow: true,
    'max-snippet': 160,
    'max-image-preview': 'large',
  },
  openGraph: {
    type: 'website',
    title: 'Manual Digital Docente 2026 | CIIP Latam',
    description: 'Guía de estándares metodológicos, de imagen y calidad para el ecosistema educativo de CIIP Latam, Geomina y Biomedic.',
    locale: 'es_PE',
    siteName: 'CIIP LATAM - Ecosistema Digital de Capacitación',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Manual Digital Docente 2026 | CIIP Latam',
    description: 'Guía de estándares metodológicos, de imagen y calidad para el ecosistema educativo de CIIP Latam, Geomina y Biomedic.',
  },
  alternates: {
    canonical: 'https://docentesglabal.vercel.app/',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Sora:wght@500;600;700;800&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'EducationalOrganization',
              name: 'CIIP LATAM',
              alternateName: ['Geomina', 'Biomedic'],
              url: 'https://docentesglabal.vercel.app/',
              description: 'Ecosistema digital de capacitación profesional en Latinoamérica. Formación práctica en ingeniería, minería y salud.',
              areaServed: 'Latin America',
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+51-925084564',
                contactType: 'customer service',
                availableLanguage: 'Spanish',
              },
            }),
          }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
