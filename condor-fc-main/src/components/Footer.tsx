"use client";

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <img src="/condor_logo_transparent.png" alt="Condor FC" style={{ height: '80px', marginBottom: '1.5rem' }} />
            <p style={{ color: 'var(--clr-gray)' }}>L'excellence, la passion, et la fierté. Nous sommes Condor FC.</p>
          </div>
          <div className="footer-col">
            <h3>Le Club</h3>
            <ul className="footer-links">
              <li><Link href="/club">Histoire</Link></li>
              <li><Link href="/club">Palmarès</Link></li>
              <li><Link href="/club">L'Arène Condor</Link></li>
              <li><Link href="/club">Fondation</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Équipes</h3>
            <ul className="footer-links">
              <li><Link href="/teams">Équipe Première</Link></li>
              <li><Link href="/teams">Académie</Link></li>
              <li><Link href="/teams">Staff Technique</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Contact & Info</h3>
            <ul className="footer-links">
              <li><Link href="/contact">Nous Contacter</Link></li>
              <li><Link href="/jobs">Carrières</Link></li>
              <li><Link href="/press">Presse</Link></li>
              <li><Link href="/privacy">Politique de Confidentialité</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Condor Football Club. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
