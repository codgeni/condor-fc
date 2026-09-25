import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Condor TV - Matchs & Résumés Vidéos",
  description: "Regardez les résumés vidéo des matchs, interviews des coachs et temps forts des jeunes talents du Condor FC sur Condor TV.",
  alternates: {
    canonical: '/tv',
  },
};

export default function TvLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
