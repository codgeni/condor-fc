import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Nos Équipes & Joueurs (U9 à U17)",
  description: "Consultez l'effectif officiel du Condor FC : catégories U9, U13, U15 et U17, fiches des joueurs et statistiques de la saison.",
  alternates: {
    canonical: '/teams',
  },
};

export default function TeamsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
