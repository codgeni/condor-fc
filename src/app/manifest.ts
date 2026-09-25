import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Condor FC - École de Football',
    short_name: 'Condor FC',
    description: "Site officiel de l'école de football Condor FC à Delmas, Haïti. Formation d'élite, stages, équipes U9 à U17.",
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#e60000',
    icons: [
      {
        src: '/condor_logo_transparent.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/condor_logo_transparent.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
