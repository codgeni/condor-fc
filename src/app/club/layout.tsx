import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Notre Histoire & Mission",
  description: "Découvrez l'histoire, la vision et la mission éducative et sportive de l'académie de football Condor FC à Delmas, Haïti.",
  alternates: {
    canonical: '/club',
  },
};

export default function ClubLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
