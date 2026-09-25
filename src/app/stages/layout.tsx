import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Stages & Perfectionnement Football",
  description: "Inscrivez vos enfants aux stages intensifs de football du Condor FC à Delmas : perfectionnement technique, coaching d'experts et développement physique.",
  alternates: {
    canonical: '/stages',
  },
};

export default function StagesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
