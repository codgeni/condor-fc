import type { Metadata } from 'next';
import Link from 'next/link';
import { Hammer, Shield, Phone, Mail, MapPin, Clock, Lock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Site en Maintenance | École de Football Condor',
  description: "Le site officiel de l'École de Football Condor est actuellement en cours de maintenance et de finalisation. Nous revenons très prochainement.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function MaintenancePage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 50% 20%, #1a1a24 0%, #09090d 100%)',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '2.5rem 1.5rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Halo lumineux d'ambiance Rouge Condor */}
      <div style={{
        position: 'absolute',
        top: '-120px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '520px',
        height: '520px',
        background: 'radial-gradient(circle, rgba(202, 2, 79, 0.22) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />

      {/* Header avec Logo du Condor FC */}
      <header style={{ textAlign: 'center', zIndex: 1, paddingTop: '1rem' }}>
        <div style={{
          width: '110px',
          height: '110px',
          margin: '0 auto 1.2rem',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '2px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '12px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          backdropFilter: 'blur(8px)'
        }}>
          <img 
            src="/condor_logo_transparent.png" 
            alt="Logo Condor FC" 
            style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
          />
        </div>
        <div style={{
          fontSize: '0.85rem',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          color: 'var(--clr-primary, #ca024f)',
          fontWeight: '700'
        }}>
          École de Football Condor • Haïti
        </div>
      </header>

      {/* Bloc Central de Maintenance */}
      <main style={{
        maxWidth: '720px',
        width: '100%',
        textAlign: 'center',
        background: 'rgba(18, 18, 24, 0.75)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '24px',
        padding: '3rem 2rem',
        margin: '2rem 0',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(16px)',
        zIndex: 1
      }}>
        {/* Badge Travaux */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(202, 2, 79, 0.15)',
          border: '1px solid rgba(202, 2, 79, 0.4)',
          borderRadius: '999px',
          padding: '6px 16px',
          fontSize: '0.85rem',
          fontWeight: '600',
          color: '#ff6b8b',
          marginBottom: '1.8rem',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          <Hammer size={16} />
          <span>Site en cours de maintenance</span>
        </div>

        <h1 style={{
          fontFamily: 'var(--font-heading, "Montserrat", sans-serif)',
          fontSize: 'clamp(2rem, 5vw, 3.2rem)',
          fontWeight: '900',
          lineHeight: 1.15,
          margin: '0 0 1.2rem',
          color: '#ffffff',
          letterSpacing: '-0.5px'
        }}>
          NOTRE SITE OFFICIEL ARRIVE TRÈS PROCHAINEMENT
        </h1>

        <p style={{
          fontSize: '1.05rem',
          lineHeight: 1.65,
          color: '#cbd5e1',
          margin: '0 auto 2.5rem',
          maxWidth: '580px'
        }}>
          La plateforme officielle de l'École de Football Condor est actuellement en cours de préparation et de finalisation. Nos équipes travaillent pour vous offrir une expérience complète avec l'effectif des joueurs, les actualités, la boutique officielle et les inscriptions aux stages.
        </p>

        {/* Section Contact Rapide */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '2rem',
          marginTop: '1rem'
        }}>
          <div style={{
            fontSize: '0.85rem',
            color: '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            marginBottom: '1.2rem',
            fontWeight: '600'
          }}>
            Pour toute demande urgente ou inscription
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            textAlign: 'left'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '12px',
              padding: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--clr-primary, #ca024f)', marginBottom: '4px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                <Mail size={16} /> Email officiel
              </div>
              <a href="mailto:ecoledefootballcondor@gmail.com" style={{ color: '#ffffff', fontSize: '0.88rem', textDecoration: 'none', wordBreak: 'break-all' }}>
                ecoledefootballcondor@gmail.com
              </a>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '12px',
              padding: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--clr-primary, #ca024f)', marginBottom: '4px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                <MapPin size={16} /> Localisation
              </div>
              <div style={{ color: '#ffffff', fontSize: '0.88rem' }}>
                Delmas 77, Port-au-Prince, Haïti
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer discret avec accès sécurisé pour l'administrateur */}
      <footer style={{
        textAlign: 'center',
        zIndex: 1,
        color: '#64748b',
        fontSize: '0.82rem',
        paddingBottom: '1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px'
      }}>
        <div>
          © {new Date().getFullYear()} École de Football Condor. Tous droits réservés.
        </div>
        <Link 
          href="/admin" 
          style={{
            color: '#94a3b8',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '0.78rem',
            padding: '4px 10px',
            borderRadius: '6px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <Lock size={12} />
          <span>Accès Administration</span>
        </Link>
      </footer>
    </div>
  );
}
