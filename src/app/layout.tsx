import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Analytics } from '@vercel/analytics/next';

const siteUrl = 'https://www.condorecoledefootball.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Condor FC | École de Football & Académie Officielle - Haïti',
    template: '%s | Condor FC',
  },
  description: "Site officiel de l'école de football Condor FC à Delmas, Port-au-Prince, Haïti. Formation d'élite pour jeunes footballeurs (U9 à U17), encadrement éducatif et sportif, stages de perfectionnement, boutique officielle et actualités.",
  keywords: [
    'Condor FC',
    'Condor école de football',
    'École de football Condor',
    'Académie de football Haïti',
    'Club de football Delmas',
    'Centre de formation football Port-au-Prince',
    'Football jeunes Haïti',
    'Stages de football Delmas',
    'Formation football Haïti',
    'Équipes de football U17 U15 U13 U9 Haïti',
    'Delmas 77 football',
    'Académie Condor'
  ],
  authors: [{ name: 'Condor FC', url: siteUrl }],
  creator: 'Condor FC',
  publisher: 'Condor FC - École de Football',
  applicationName: 'Condor FC',
  category: 'Sports',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/condor_logo_transparent.png', type: 'image/png', sizes: '192x192' },
      { url: '/condor_logo_transparent.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [
      { url: '/condor_logo_transparent.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico'],
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: siteUrl,
    siteName: 'Condor FC - École de Football',
    title: 'Condor FC | École de Football & Académie Officielle - Haïti',
    description: "Site officiel de l'école de football Condor FC à Delmas, Haïti. Formation d'élite des jeunes (U9-U17), stages de football, boutique officielle et actualités du club.",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Condor FC - École de Football & Académie Officielle',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Condor FC | École de Football & Académie Officielle',
    description: "Site officiel de l'école de football Condor FC à Delmas, Haïti. Formation des jeunes footballeurs U9-U17, stages et boutique.",
    images: ['/og-image.png'],
    creator: '@CondorFC',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Peut être complété si l'utilisateur ajoute Google Search Console
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': ['SportsOrganization', 'SportsClub'],
  name: 'Condor FC - École de Football',
  alternateName: ['Condor FC', 'École de football Condor', 'Académie Condor FC'],
  url: siteUrl,
  logo: `${siteUrl}/condor_logo_transparent.png`,
  image: `${siteUrl}/og-image.png`,
  description: "École et académie officielle de football pour jeunes de U9 à U17 à Delmas, Port-au-Prince, Haïti. Formation sportive et accompagnement scolaire.",
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Delmas 77',
    addressLocality: 'Delmas, Port-au-Prince',
    addressRegion: 'Ouest',
    addressCountry: 'HT',
  },
  sport: 'Football / Soccer',
  sameAs: [
    'https://www.facebook.com',
    'https://www.instagram.com',
    'https://www.youtube.com'
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Navbar />
        <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
