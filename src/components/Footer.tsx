"use client";

import Link from 'next/link';
import { MapPin, Phone, Mail, MessageSquare } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <img src="/condor_logo_transparent.png" alt="Condor Ecole de Football" style={{ height: '80px', marginBottom: '1.5rem' }} />
            <p style={{ color: 'var(--clr-gray)' }}>Condor Ecole de Football - Former et éduquer les champions de demain. Fondée en Mai 2023 à Delmas, Haïti.</p>
          </div>
          <div className="footer-col">
            <h3>Le Club</h3>
            <ul className="footer-links">
              <li><Link href="/club">Histoire & Philosophie</Link></li>
              <li><Link href="/club">Palmarès</Link></li>
              <li><Link href="/teams">Nos Catégories</Link></li>
              <li><Link href="/contact">Nous Contacter</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Contact & Localisation</h3>
            <ul className="footer-links" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ color: 'var(--clr-primary)', display: 'flex', marginTop: '4px' }}>
                  <MapPin size={18} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--clr-gray)', fontWeight: 'bold' }}>Adresse</span>
                  <span style={{ color: 'white', fontSize: '0.9rem', lineHeight: 1.4 }}>1, entrée de Delmas 77 (à côté de BIWI), Haïti</span>
                </div>
              </li>
              <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ color: 'var(--clr-primary)', display: 'flex', marginTop: '4px' }}>
                  <Phone size={18} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--clr-gray)', fontWeight: 'bold' }}>Téléphones</span>
                  <span style={{ color: 'white', fontSize: '0.9rem' }}>+509 4877 7143 / +509 5684 1605</span>
                </div>
              </li>
              <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ color: 'var(--clr-primary)', display: 'flex', marginTop: '4px' }}>
                  <MessageSquare size={18} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--clr-gray)', fontWeight: 'bold' }}>WhatsApp</span>
                  <span style={{ color: 'white', fontSize: '0.9rem' }}>+509 4877 7143 / +509 3141 4270</span>
                </div>
              </li>
              <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ color: 'var(--clr-primary)', display: 'flex', marginTop: '4px' }}>
                  <Mail size={18} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--clr-gray)', fontWeight: 'bold' }}>Courriel</span>
                  <a href="mailto:condorecoledefootball@gmail.com" style={{ padding: 0, color: 'var(--clr-primary)', textDecoration: 'none', fontSize: '0.9rem' }}>
                    condorecoledefootball@gmail.com
                  </a>
                </div>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Réseaux Sociaux</h3>
            <ul className="footer-links">
              <li>
                <a href="https://www.facebook.com/profile.php?id=100093665796338" target="_blank" rel="noopener noreferrer">
                  Facebook : Condor Edu-Sport
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/Condorecoledefootball" target="_blank" rel="noopener noreferrer">
                  Instagram : @Condorecoledefootball
                </a>
              </li>
              <li>
                <a href="https://www.tiktok.com/@CondorHaiti" target="_blank" rel="noopener noreferrer">
                  TikTok : @CondorHaiti
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Condor Ecole de Football. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
