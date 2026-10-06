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
import { User, Sparkles, RotateCcw, ArrowRight, Shield, Star, Eye } from 'lucide-react';

export default function Teams() {
  const [units, setUnits] = useState<UnitItem[]>(DEFAULT_UNITS);
  const [roles, setRoles] = useState<RoleItem[]>(DEFAULT_ROLES);
  const [selectedCategory, setSelectedCategory] = useState('U17');
  const [activePlayer, setActivePlayer] = useState<any>(null);
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

  // Find active unit configuration
  const activeUnit = units.find(u => u.name === selectedCategory) || {
    name: selectedCategory,
    description: `Catégorie ${selectedCategory}`,
    image: '/kick_hero.png'
  };

  const handleCategoryChange = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setActivePlayer(null); // Reset spotlight to unit's default configured image
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

  // Group players by configured roles in order (Rank 1: Gardiens de but on top!)
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

  // Determine current featured image for the section's landing page
  const featuredImage = activePlayer 
    ? (activePlayer.detailImg || activePlayer.detail_img || activePlayer.img)
    : (activeUnit.image || '/kick_hero.png');

  const isPlayerFeatured = Boolean(activePlayer);

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
      <div style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', marginBottom: '2rem', textTransform: 'uppercase', color: 'var(--clr-primary)', borderBottom: '2px solid var(--clr-gray-light)', paddingBottom: '10px' }}>
          {title} ({sortedPlayers.length})
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '2rem' }}>
          {sortedPlayers.map((player, i) => {
            const isLogoPlaceholder = !player.img || player.img.includes('condor_logo');
            const isSelected = activePlayer?.id === player.id;
            return (
              <div 
                key={player.id} 
                className="player-card-wrapper"
                style={{ position: 'relative' }}
              >
                <motion.div 
                  className="player-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: (i % 6) * 0.1 }}
                  whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
                  onClick={() => {
                    setActivePlayer(player);
                    // Smooth scroll up to featured landing banner if needed
                    window.scrollTo({ top: 380, behavior: 'smooth' });
                  }}
                  style={{ 
                    background: '#121217', 
                    border: isSelected ? '2px solid var(--clr-primary)' : '1px solid rgba(255,255,255,0.08)',
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 0 25px rgba(202, 2, 79, 0.4)' : undefined
                  }}
                >
                  {isSelected && (
                    <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 5, background: 'var(--clr-primary)', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
                      <Sparkles size={13} /> À l'affiche
                    </div>
                  )}

                  {isLogoPlaceholder ? (
                    <div style={{ height: '340px', background: 'radial-gradient(circle at center, #252530 0%, #0d0d12 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
                      <img 
                        src={player.img || '/condor_logo_transparent.png'} 
                        alt={player.name}
                        style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', opacity: 0.85, filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.6))' }} 
                      />
                    </div>
                  ) : (
                    <img src={player.img} className="player-img" style={{ filter: player.filter, height: '340px' }} alt={player.name} />
                  )}
                  <span className="player-number">#{player.num}</span>
                  <div className="player-info">
                    <h3 className="player-name">{player.name}</h3>
                    <span className="player-position">{player.pos || player.role || 'Joueur'}</span>
                    
                    <div style={{ marginTop: '12px', display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontStyle: 'italic' }}>
                        Cliquer pour placer en haut ↑
                      </span>
                      <Link 
                        href={`/teams/${player.id}`} 
                        onClick={(e) => e.stopPropagation()}
                        style={{ 
                          fontSize: '0.8rem', 
                          fontWeight: 'bold', 
                          color: 'var(--clr-primary)', 
                          textDecoration: 'none', 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '4px',
                          background: 'rgba(202, 2, 79, 0.15)',
                          padding: '4px 10px',
                          borderRadius: '6px'
                        }}
                      >
                        Fiche <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div style={{ flex: 1, marginTop: '80px', background: '#0b0b0e', color: 'white' }}>
      
      {/* Page Header */}
      <section 
        className="section-padding bg-black text-white" 
        style={{ 
          textAlign: 'center', 
          position: 'relative', 
          overflow: 'hidden', 
          padding: '100px 0 60px',
          background: `linear-gradient(rgba(11,11,14,0.75), rgba(11,11,14,1)), url(${siteContent.teams_hero_bg || '/kick_hero.png'}) center/cover no-repeat`
        }}
      >
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 10 }}>
          <span style={{ color: 'var(--clr-primary)', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 'bold' }}>Saison 2026/27</span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '4.5rem', textTransform: 'uppercase', margin: '15px 0', textShadow: '0 10px 30px rgba(0,0,0,0.8)' }}>Les Équipes du Condor FC</h1>
          <p style={{ fontSize: '1.2rem', color: '#ccc', maxWidth: '750px', margin: '0 auto 2rem' }}>
            Sélectionnez une catégorie ci-dessous. L'affiche officielle s'affiche en grand en haut de section et change dynamiquement lorsque vous cliquez sur un joueur.
          </p>
          
          {/* Menu dynamique de sélection des unités/catégories (U7, U8, U9, U13, U15, U17, Équipe Première) */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.8rem', flexWrap: 'wrap', marginTop: '2rem' }}>
            {units.filter(u => u.is_active !== false).map(unit => (
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

      {/* Global Section Landing Spotlight Header (Configurable via Admin for each unit / Dynamic on player click) */}
      <section style={{ padding: '2rem 0 3rem' }}>
        <div className="container">
          <motion.div 
            key={`${selectedCategory}-${activePlayer?.id || 'unit-default'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ 
              background: '#121218',
              borderRadius: '24px',
              border: '1px solid #22222d',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
              position: 'relative'
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', alignItems: 'center' }}>
              
              {/* Grand cadre photo officielle (Image d'unité configurée OU joueur cliqué) */}
              <div style={{ position: 'relative', height: '450px', background: 'radial-gradient(circle at center, #1a1a24 0%, #0b0b0e 100%)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img 
                  src={featuredImage} 
                  alt={isPlayerFeatured ? activePlayer.name : activeUnit.name}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: isPlayerFeatured && activePlayer.img?.includes('players/') ? 'cover' : 'cover',
                    objectPosition: 'top center',
                    filter: isPlayerFeatured ? activePlayer.filter : 'none'
                  }} 
                />
                
                {/* Badge visuel contextuel */}
                <div style={{ position: 'absolute', top: '16px', left: '16px', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <Shield size={14} color="var(--clr-primary)" />
                  {isPlayerFeatured ? `Joueur à l'Affiche • ${selectedCategory}` : `Affiche Officielle • Unité ${selectedCategory}`}
                </div>

                {isPlayerFeatured && activePlayer.num && (
                  <div style={{ position: 'absolute', bottom: '16px', right: '16px', fontFamily: 'var(--font-heading)', fontSize: '4.5rem', fontWeight: '900', color: 'white', textShadow: '0 4px 20px rgba(0,0,0,0.8)', opacity: 0.9 }}>
                    #{activePlayer.num}
                  </div>
                )}
              </div>

              {/* Panneau d'informations & de contrôle du spot landing */}
              <div style={{ padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span style={{ color: 'var(--clr-primary)', fontWeight: '800', fontSize: '0.85rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={16} /> LANDING PAGE DE LA SECTION {selectedCategory}
                </span>

                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', margin: '0 0 12px', lineHeight: 1.1, textTransform: 'uppercase' }}>
                  {isPlayerFeatured ? activePlayer.name : `${selectedCategory} CONDOR FC`}
                </h2>

                <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: 1.6, margin: '0 0 1.8rem' }}>
                  {isPlayerFeatured ? (
                    activePlayer.bio ? `${activePlayer.bio.substring(0, 180)}...` : `Acteur clé de l'unité ${selectedCategory}. Poste : ${activePlayer.pos || 'Joueur'}.`
                  ) : (
                    activeUnit.description || `Bienvenue sur l'espace officiel de la section ${selectedCategory} du Condor FC. Découvrez ci-dessous tous nos talents.`
                  )}
                </p>

                {/* Métriques / Informations rapide */}
                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                  <div style={{ background: '#181822', padding: '10px 18px', borderRadius: '10px', border: '1px solid #282836' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Catégorie</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'white' }}>{selectedCategory}</div>
                  </div>
                  {isPlayerFeatured ? (
                    <>
                      <div style={{ background: '#181822', padding: '10px 18px', borderRadius: '10px', border: '1px solid #282836' }}>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Poste</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--clr-primary)' }}>{activePlayer.pos || 'Joueur'}</div>
                      </div>
                      <div style={{ background: '#181822', padding: '10px 18px', borderRadius: '10px', border: '1px solid #282836' }}>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Dossard</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'white' }}>#{activePlayer.num}</div>
                      </div>
                    </>
                  ) : (
                    <div style={{ background: '#181822', padding: '10px 18px', borderRadius: '10px', border: '1px solid #282836' }}>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Effectif Rattaché</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'white' }}>{roster.length} Joueur{roster.length > 1 ? 's' : ''}</div>
                    </div>
                  )}
                </div>

                {/* Boutons d'action */}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  {isPlayerFeatured ? (
                    <>
                      <Link 
                        href={`/teams/${activePlayer.id}`} 
                        className="btn btn-primary"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 22px', fontSize: '0.95rem' }}
                      >
                        <User size={18} /> Voir la fiche complète du Joueur
                      </Link>
                      <button 
                        onClick={() => setActivePlayer(null)}
                        className="btn btn-outline"
                        style={{ color: 'white', borderColor: '#444', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 20px', fontSize: '0.95rem' }}
                      >
                        <RotateCcw size={16} /> Image d'Unité Initiale
                      </button>
                    </>
                  ) : (
                    <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Sparkles size={15} color="var(--clr-primary)" />
                      Image configurable dans l'Admin • Cliquez sur n'importe quel joueur ci-dessous pour changer la photo.
                    </span>
                  )}
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </section>

      {/* Roster Sections (Scrollable individually) */}
      <section className="section-padding" style={{ minHeight: '400px', background: '#0b0b0e' }}>
        <div className="container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--clr-gray)' }}>
              <h3>Chargement de l'effectif {selectedCategory}...</h3>
            </div>
          ) : roster.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--clr-gray)', background: '#121218', borderRadius: '16px', border: '1px solid #22222e' }}>
              <h3 style={{ fontSize: '1.6rem', color: 'white', marginBottom: '0.8rem' }}>
                Aucun joueur enregistré dans la catégorie "{selectedCategory}" pour le moment.
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: '550px', margin: '0 auto 1.5rem' }}>
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
