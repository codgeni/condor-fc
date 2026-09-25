import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Contactez l'Académie & Inscriptions",
  description: "Prenez contact avec la direction du Condor FC à Delmas 77. Renseignements pour inscriptions, partenariats et essais de détection.",
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
