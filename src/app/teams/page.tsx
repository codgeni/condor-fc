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
import { ArrowRight } from 'lucide-react';

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
          const validUnits = loadedUnits.filter(u => !u.name.toLowerCase().includes('premi'));
          setUnits(validUnits);
          if (!validUnits.some(u => u.name === selectedCategory)) {
            const firstActive = validUnits.find(u => u.is_active !== false) || validUnits[0];
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

  // Configuration de l'unité active
  const activeUnit = units.find(u => u.name === selectedCategory) || {
    name: selectedCategory,
    description: `Catégorie ${selectedCategory}`,
    image: '/kick_hero.png'
  };

  const handleCategoryChange = (categoryName: string) => {
    setSelectedCategory(categoryName);
  };

  const roster = Object.values(db).filter(p => {
    if (Array.isArray(p.categories)) {
      return p.categories.includes(selectedCategory);
    }
    if (Array.isArray(p.category)) {
      return p.category.includes(selectedCategory);
    }
    return p.category === selectedCategory;
  });

  // Groupement des joueurs par poste configuré (Gardiens de but en premier, etc.)
  const sortedRoles = [...roles].sort((a, b) => (a.order || 0) - (b.order || 0));

  const sectionsWithPlayers = sortedRoles.map(role => {
    const matched = roster.filter(p => matchPlayerToRole(p, sortedRoles).id === role.id);
    return {
      role,
      players: matched
    };
  });

  const matchedPlayerIds = new Set(
    sectionsWithPlayers.flatMap(s => s.players.map(p => p.id))
  );
  const unassigned = roster.filter(p => !matchedPlayerIds.has(p.id));

  const renderSection = (title: string, players: typeof roster) => {
    if (players.length === 0) return null;
    const sortedPlayers = [...players].sort((a, b) => {
      const aHasPhoto = a.img && !a.img.includes('condor_logo');
      const bHasPhoto = b.img && !b.img.includes('condor_logo');
      if (aHasPhoto && !bHasPhoto) return -1;
      if (!aHasPhoto && bHasPhoto) return 1;
      return (a.num || 0) - (b.num || 0);
    });

    return (
      <div style={{ marginBottom: '4.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '12px' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', textTransform: 'uppercase', color: '#0f172a', margin: 0, letterSpacing: '1px' }}>
            {title}
          </h2>
          <span style={{ background: '#f1f5f9', color: 'var(--clr-primary)', fontWeight: 'bold', fontSize: '0.9rem', padding: '6px 14px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
            {sortedPlayers.length} Joueur{sortedPlayers.length > 1 ? 's' : ''}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '2rem' }}>
          {sortedPlayers.map((player, i) => {
            const isLogoPlaceholder = !player.img || player.img.includes('condor_logo');
            return (
              <Link 
                key={player.id} 
                href={`/teams/${player.id}`}
                style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
              >
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: (i % 6) * 0.08 }}
                  whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.12)', borderColor: 'rgba(224, 30, 38, 0.4)' }}
                  style={{ 
                    background: '#ffffff',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    transition: 'all 0.3s ease',
                    position: 'relative'
                  }}
                >
                  {/* Photo du joueur avec dossard */}
                  <div style={{ position: 'relative', height: '340px', background: '#0d0d12', overflow: 'hidden' }}>
                    {isLogoPlaceholder ? (
                      <div style={{ height: '100%', background: 'radial-gradient(circle at center, #252530 0%, #0d0d12 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
                        <img 
                          src={player.img || '/condor_logo_transparent.png'} 
                          alt={player.name}
                          style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', opacity: 0.85, filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.6))' }} 
                        />
                      </div>
                    ) : (
                      <img 
                        src={player.img} 
                        alt={player.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%', filter: player.filter || 'none', transition: 'transform 0.4s ease' }} 
                      />
                    )}

                    {/* Numéro de maillot (badge blanc avec numéro rouge) */}
                    {player.num && (
                      <div style={{ 
                        position: 'absolute', 
                        top: '12px', 
                        right: '12px', 
                        background: '#ffffff', 
                        color: 'var(--clr-primary)',
                        padding: '4px 13px',
                        borderRadius: '20px',
                        fontWeight: '900',
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.15rem',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.18)',
                        letterSpacing: '0.5px',
                        zIndex: 3
                      }}>
                        #{player.num.toString().replace(/^#/, '')}
                      </div>
                    )}
                  </div>

                  {/* Informations du joueur */}
                  <div style={{ padding: '1.2rem 1.4rem', background: '#ffffff' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', flexWrap: 'wrap', gap: '4px' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--clr-primary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                        {player.pos || player.role || 'Joueur'}
                      </div>
                      {Array.isArray(player.categories) && player.categories.length > 1 && (
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {player.categories.filter((c: string) => c !== selectedCategory).map((c: string) => (
                            <span key={c} style={{ fontSize: '0.68rem', background: 'rgba(224, 30, 38, 0.08)', color: 'var(--clr-primary)', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                              + {c}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <h3 style={{ fontSize: '1.3rem', margin: '0 0 10px', color: '#0f172a', fontFamily: 'var(--font-heading)', fontWeight: 'bold' }}>
                      {player.name}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                      <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '500' }}>
                        Voir profil complet
                      </span>
                      <span style={{ color: 'var(--clr-primary)', fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        Fiche <ArrowRight size={13} />
                      </span>
                    </div>
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
    <div style={{ flex: 1, marginTop: '80px', background: '#ffffff', color: '#0f172a' }}>
      
      {/* Page Header (Haut de page avec l'image configurable dans l'Admin) */}
      <section 
        className="section-padding bg-black text-white" 
        style={{ 
          textAlign: 'center', 
          position: 'relative', 
          overflow: 'hidden', 
          padding: '110px 0 70px',
          background: `linear-gradient(rgba(11,11,14,0.72), rgba(11,11,14,0.92)), url(${activeUnit.image || siteContent.teams_hero_bg || '/kick_hero.png'}) center/cover no-repeat`,
          transition: 'background 0.4s ease'
        }}
      >
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 10 }}>
          <span style={{ color: 'var(--clr-primary)', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 'bold' }}>Saison 2026/27</span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '4.5rem', textTransform: 'uppercase', margin: '15px 0', textShadow: '0 10px 30px rgba(0,0,0,0.8)' }}>Condor EF</h1>
          <p style={{ fontSize: '1.2rem', color: '#ccc', maxWidth: '750px', margin: '0 auto 2rem' }}>
            Sélectionnez une catégorie ci-dessous pour découvrir l'effectif complet et consulter la fiche détaillée de chaque joueur.
          </p>
          
          {/* Menu dynamique de sélection des unités/catégories (U7, U8, U9, U13, U15, U17) */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.8rem', flexWrap: 'wrap', marginTop: '2rem' }}>
            {units.filter(u => u.is_active !== false && !u.name.toLowerCase().includes('premi')).map(unit => (
              <button
                key={unit.id}
                onClick={() => handleCategoryChange(unit.name)}
                style={{
                  padding: '12px 24px',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.15rem',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  border: '2px solid',
                  borderColor: selectedCategory === unit.name ? 'var(--clr-primary)' : 'rgba(255,255,255,0.25)',
                  background: selectedCategory === unit.name ? 'var(--clr-primary)' : 'rgba(255,255,255,0.05)',
                  color: 'white',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: selectedCategory === unit.name ? '0 6px 20px rgba(202, 2, 79, 0.4)' : 'none'
                }}
              >
                {unit.name}
              </button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Roster Sections (Fond blanc / Light background pour les fiches joueurs) */}
      <section className="section-padding" style={{ minHeight: '500px', background: '#ffffff', padding: '60px 0 100px' }}>
        <div className="container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '5rem 0', color: '#64748b' }}>
              <h3>Chargement de l'effectif {selectedCategory}...</h3>
            </div>
          ) : roster.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 2rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1.6rem', color: '#0f172a', marginBottom: '0.8rem' }}>
                Aucun joueur enregistré dans la catégorie "{selectedCategory}" pour le moment.
              </h3>
              <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '550px', margin: '0 auto 1.5rem' }}>
                Les fiches des joueurs de cette unité seront publiées très prochainement. Vous pouvez configurer ou ajouter des joueurs depuis le panneau d'administration.
              </p>
            </div>
          ) : (
            <>
              {/* Render player positions in order (Gardiens de but on top!) */}
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
