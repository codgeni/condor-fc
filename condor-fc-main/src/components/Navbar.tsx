"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = () => {
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <header className="header">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" className="logo">
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
          <Link href="/tv" onClick={handleNavClick}>Condor TV</Link>
          <Link href="/club" onClick={handleNavClick}>Le Club</Link>
          <Link href="/shop" onClick={handleNavClick}>Boutique</Link>
        </nav>
        
        <div className="header-actions desktop-nav">
          <Link href="/tickets" className="btn btn-outline">Billetterie</Link>
          <Link href="/login" className="btn btn-primary">Connexion</Link>
        </div>
      </div>
    </header>
  );
}
