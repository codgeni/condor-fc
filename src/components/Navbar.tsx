"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if there is an active session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleNavClick = () => {
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <header className="header">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" className="logo" onClick={handleNavClick}>
          <img src="/condor_logo_transparent.png" alt="Condor FC Logo" />
        </Link>
        
        {/* Mobile Toggle */}
        <button 
          className="mobile-menu-btn btn-outline" 
          style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
        </button>

        {/* Navigation */}
        <nav className={`nav ${mobileMenuOpen ? 'mobile-nav-active' : 'desktop-nav'}`}>
          <Link href="/" onClick={handleNavClick}>Accueil</Link>
          <Link href="/news" onClick={handleNavClick}>Actualités</Link>
          <Link href="/teams" onClick={handleNavClick}>Équipes</Link>
          <Link href="/stages" onClick={handleNavClick}>Stages</Link>
          <Link href="/tv" onClick={handleNavClick}>Condor TV</Link>
          <Link href="/club" onClick={handleNavClick}>Le Club</Link>
          <Link href="/shop" onClick={handleNavClick}>Boutique</Link>
          {mobileMenuOpen && (
            <>
              {user ? (
                <>
                  <Link href={user.email === 'admin@gmail.com' ? '/admin' : '/login'} onClick={handleNavClick} style={{ color: 'var(--clr-primary)' }}>
                    {user.email === 'admin@gmail.com' ? 'Admin' : 'Mon Espace'}
                  </Link>
                  <button 
                    onClick={async () => {
                      handleNavClick();
                      await supabase.auth.signOut();
                      window.location.href = '/';
                    }}
                    style={{ background: 'transparent', border: 'none', color: 'var(--clr-primary)', cursor: 'pointer', textAlign: 'left', padding: '10px 15px', fontSize: '1.1rem', fontFamily: 'inherit', fontWeight: 'bold' }}
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <Link href="/login" onClick={handleNavClick} style={{ color: 'var(--clr-primary)' }}>Connexion</Link>
              )}
            </>
          )}
        </nav>
        
        <div className="header-actions desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {user ? (
            <>
              <Link 
                href={user.email === 'admin@gmail.com' ? '/admin' : '/login'} 
                className="btn btn-primary"
                onClick={handleNavClick}
              >
                {user.email === 'admin@gmail.com' ? 'Admin' : 'Mon Espace'}
              </Link>
              <button 
                onClick={async () => {
                  await supabase.auth.signOut();
                  window.location.href = '/';
                }}
                className="btn btn-outline"
                style={{ background: 'transparent', color: 'white', borderColor: '#444', padding: '8px 16px', fontSize: '0.9rem', cursor: 'pointer' }}
              >
                Déconnexion
              </button>
            </>
          ) : (
            <Link href="/login" className="btn btn-primary" onClick={handleNavClick}>Connexion</Link>
          )}
        </div>
      </div>
    </header>
  );
}
