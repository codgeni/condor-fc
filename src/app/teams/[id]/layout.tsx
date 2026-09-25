import type { Metadata } from 'next';
import { playersDB } from '@/lib/playersDB';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const player = playersDB[id];

  if (!player) {
    return {
      title: "Fiche Joueur",
      description: "Fiche officielle du joueur de l'académie de football Condor FC à Delmas, Haïti.",
    };
  }

  const title = `${player.name} (#${player.num} - ${player.pos})`;
  const description = `${player.name}, ${player.pos} en catégorie ${player.category} au Condor FC. Découvrez son profil, ses statistiques et ses performances officielles.`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Condor FC`,
      description,
      images: player.img ? [{ url: player.img, alt: player.name }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Condor FC`,
      description,
      images: player.img ? [player.img] : undefined,
    },
  };
}

export default function PlayerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
