import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Boutique Officielle - Maillots & Équipements",
  description: "Découvrez la collection officielle d'équipements du Condor FC : maillots de match, tenues d'entraînement et accessoires officiels 2026/27.",
  alternates: {
    canonical: '/shop',
  },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
