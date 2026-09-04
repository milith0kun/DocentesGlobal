import './globals.css';

export const metadata = {
  metadataBase: new URL('https://manualdocente.cgbacademy.tech'),
  title: 'Manual Digital Docente 2026 | CGB Academy & Instituciones',
  description: 'Guía oficial de estándares metodológicos, de imagen y excelencia para los docentes de CGB Academy, CIIP Latam, Geomina y Biomedic 2026.',
  robots: {
    index: true,
    follow: true,
    'max-snippet': 160,
    'max-image-preview': 'large',
  },
  openGraph: {
    type: 'website',
    title: 'Manual Digital Docente 2026 | CGB Academy',
    description: 'Guía oficial de estándares metodológicos, de imagen y calidad para los docentes de CGB Academy, CIIP Latam, Geomina y Biomedic.',
    locale: 'es_PE',
    siteName: 'CGB Academy - Ecosistema Educativo Global',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Manual Digital Docente 2026 | CGB Academy',
    description: 'Guía oficial de estándares metodológicos, de imagen y calidad para los docentes de CGB Academy, CIIP Latam, Geomina y Biomedic.',
  },
  alternates: {
    canonical: 'https://manualdocente.cgbacademy.tech/',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:ital,wght@0,300..900;1,300..900&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'EducationalOrganization',
              name: 'CGB Academy',
              alternateName: ['CIIP LATAM', 'Geomina', 'Biomedic'],
              url: 'https://manualdocente.cgbacademy.tech/',
              description: 'Ecosistema digital de capacitación profesional global. Formación práctica en ingeniería, minería, gestión y salud.',
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
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
