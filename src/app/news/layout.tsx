import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Actualités & Résultats du Club",
  description: "Toutes les dernières actualités, comptes-rendus de matchs, tournois et événements de l'école de football Condor FC.",
  alternates: {
    canonical: '/news',
  },
};

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
