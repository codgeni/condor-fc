"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { 
  fetchUnits, UnitItem, DEFAULT_UNITS,
  fetchRoles, RoleItem, DEFAULT_ROLES, matchPlayerToRole,
  fetchMergedPlayers,
  fetchSiteContent, SiteContent, DEFAULT_SITE_CONTENT
} from '@/lib/dataService';

export default function Teams() {
  const [units, setUnits] = useState<UnitItem[]>(DEFAULT_UNITS);
  const [roles, setRoles] = useState<RoleItem[]>(DEFAULT_ROLES);
  const [selectedCategory, setSelectedCategory] = useState('U17');
  const [db, setDb] = useState<Record<string, any>>({});
  const [siteContent, setSiteContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [loadedUnits, loadedRoles, loadedPlayers, loadedContent] = await Promise.all([
          fetchUnits(),
          fetchRoles(),
          fetchMergedPlayers(),
          fetchSiteContent()
        ]);

        if (loadedContent) {
          setSiteContent(loadedContent);
        }

        if (loadedUnits && loadedUnits.length > 0) {
          setUnits(loadedUnits);
          // Set initial category if not selected or if previous selection not in list
          if (!loadedUnits.some(u => u.name === selectedCategory)) {
            const firstActive = loadedUnits.find(u => u.is_active !== false) || loadedUnits[0];
            if (firstActive) setSelectedCategory(firstActive.name);
          }
        }

        if (loadedRoles && loadedRoles.length > 0) {
          setRoles(loadedRoles);
        }

        if (loadedPlayers) {
          setDb(loadedPlayers);
        }
      } catch (err) {
        console.warn("Failed to load teams data", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);
  
  const roster = Object.values(db).filter(p => {
    if (Array.isArray(p.categories)) {
      return p.categories.includes(selectedCategory);
    }
    if (Array.isArray(p.category)) {
      return p.category.includes(selectedCategory);
    }
    return p.category === selectedCategory;
  });

  // Group players by configured roles in order (Rank 1: Gardiens de but on top!)
  const sortedRoles = [...roles].sort((a, b) => (a.order || 0) - (b.order || 0));

  const sectionsWithPlayers = sortedRoles.map(role => {
    const matched = roster.filter(p => matchPlayerToRole(p, sortedRoles).id === role.id);
    return {
      role,
      players: matched
    };
  });

  // Check if any player didn't match any section
  const matchedPlayerIds = new Set(
    sectionsWithPlayers.flatMap(s => s.players.map(p => p.id))
  );
  const unassigned = roster.filter(p => !matchedPlayerIds.has(p.id));

  const renderSection = (title: string, players: typeof roster) => {
    if (players.length === 0) return null;
    // Prioritize players with official photos first, then by jersey number
    const sortedPlayers = [...players].sort((a, b) => {
      const aHasPhoto = a.img && !a.img.includes('condor_logo');
      const bHasPhoto = b.img && !b.img.includes('condor_logo');
      if (aHasPhoto && !bHasPhoto) return -1;
      if (!aHasPhoto && bHasPhoto) return 1;
      return (a.num || 0) - (b.num || 0);
    });

    return (
      <div style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: '2rem', textTransform: 'uppercase', color: 'var(--clr-primary)', borderBottom: '2px solid var(--clr-gray-light)', paddingBottom: '10px' }}>
          {title} ({sortedPlayers.length})
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
          {sortedPlayers.map((player, i) => {
            const isLogoPlaceholder = !player.img || player.img.includes('condor_logo');
            return (
              <Link href={`/teams/${player.id}`} key={player.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                <motion.div 
                  className="player-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: (i % 6) * 0.1 }}
                  whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
                  style={{ background: '#121217', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  {isLogoPlaceholder ? (
                    <div style={{ height: '350px', background: 'radial-gradient(circle at center, #252530 0%, #0d0d12 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
                      <img 
                        src={player.img || '/condor_logo_transparent.png'} 
                        alt={player.name}
                        style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', opacity: 0.85, filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.6))' }} 
                      />
                    </div>
                  ) : (
                    <img src={player.img} className="player-img" style={{ filter: player.filter, height: '350px' }} alt={player.name} />
                  )}
                  <span className="player-number">{player.num}</span>
                  <div className="player-info">
                    <h3 className="player-name">{player.name}</h3>
                    <span className="player-position">{player.pos || player.role || 'Joueur'}</span>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div style={{ flex: 1, marginTop: '80px' }}>
      
      {/* Page Header */}
      <section 
        className="section-padding bg-black text-white" 
        style={{ 
          textAlign: 'center', 
          position: 'relative', 
          overflow: 'hidden', 
          padding: '120px 0 80px',
          background: `linear-gradient(rgba(17,17,17,0.7), rgba(17,17,17,1)), url(${siteContent.teams_hero_bg || '/kick_hero.png'}) center/cover no-repeat`
        }}
      >
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 10 }}>
          <span style={{ color: 'var(--clr-primary)', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 'bold' }}>Saison 2026/27</span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '5rem', textTransform: 'uppercase', margin: '15px 0', textShadow: '0 10px 30px rgba(0,0,0,0.8)' }}>Les Joueurs</h1>
          <p style={{ fontSize: '1.3rem', color: '#ccc', maxWidth: '700px', margin: '0 auto 2rem' }}>Rencontrez les talents représentant le Condor FC. Une équipe forgée dans la passion, prête à conquérir le monde.</p>
          
          {/* Menu dynamique de sélection des unités/catégories */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.8rem', flexWrap: 'wrap', marginTop: '2rem' }}>
            {units.filter(u => u.is_active !== false).map(unit => (
              <button
                key={unit.id}
                onClick={() => setSelectedCategory(unit.name)}
                style={{
                  padding: '12px 24px',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  border: '2px solid',
                  borderColor: selectedCategory === unit.name ? 'var(--clr-primary)' : 'rgba(255,255,255,0.3)',
                  background: selectedCategory === unit.name ? 'var(--clr-primary)' : 'transparent',
                  color: 'white',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                {unit.name}
              </button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Roster Sections */}
      <section className="section-padding" style={{ minHeight: '400px' }}>
        <div className="container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--clr-gray)' }}>
              <h3>Chargement de l'effectif...</h3>
            </div>
          ) : roster.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--clr-gray)' }}>
              <h3 style={{ fontSize: '1.6rem', color: 'var(--clr-black)', marginBottom: '0.8rem' }}>
                Aucun joueur enregistré dans l'unité "{selectedCategory}" pour le moment.
              </h3>
              <p style={{ color: 'var(--clr-gray)', fontSize: '1rem', maxWidth: '500px', margin: '0 auto' }}>
                Les fiches officielles de cette catégorie seront publiées très prochainement ou peuvent être ajoutées par l'administrateur.
              </p>
            </div>
          ) : (
            <>
              {/* Dynamic sections ordered by role order (Gardiens de but on top!) */}
              {sectionsWithPlayers.map(section => (
                <div key={section.role.id}>
                  {renderSection(section.role.name, section.players)}
                </div>
              ))}
              {unassigned.length > 0 && renderSection("Autres Joueurs", unassigned)}
            </>
          )}
        </div>
      </section>

    </div>
  );
}
