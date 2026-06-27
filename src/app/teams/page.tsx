"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { playersDB } from '@/lib/playersDB';
import { supabase } from '@/lib/supabaseClient';

export default function Teams() {
  const [selectedCategory, setSelectedCategory] = useState('U17');
  const [db, setDb] = useState<Record<string, any>>(playersDB);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const { data } = await supabase.from('players').select('*');
        if (data && data.length > 0) {
          const dbObj = data.reduce((acc: any, player: any) => {
            acc[player.id] = player;
            return acc;
          }, {});
          setDb(dbObj);
        } else {
          setDb(playersDB);
        }
      } catch (err) {
        console.warn("Supabase fetch failed, falling back to local DB", err);
        setDb(playersDB);
      }
    };
    fetchPlayers();
  }, []);
  
  const roster = Object.values(db).filter(p => p.category === selectedCategory);

  // Classify players based on French translations in playersDB.ts
  const goalkeepers = roster.filter(p => p.pos.includes('Gardien'));
  const defenders = roster.filter(p => p.pos.includes('Défenseur') || p.pos.includes('Arrière') || p.pos.includes('Défenseure'));
  const midfielders = roster.filter(p => p.pos.includes('Milieu'));
  const forwards = roster.filter(p => p.pos.includes('Ailier') || p.pos.includes('Avant') || p.pos.includes('Attaquant'));
  const unassigned = roster.filter(p => p.pos === 'N/A');

  const categories = ['Équipe Première', 'U17', 'U15', 'U13', 'U9'];

  const renderSection = (title: string, players: typeof roster) => {
    if (players.length === 0) return null;
    return (
      <div style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: '2rem', textTransform: 'uppercase', color: 'var(--clr-primary)', borderBottom: '2px solid var(--clr-gray-light)', paddingBottom: '10px' }}>
          {title} ({players.length})
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
          {players.map((player, i) => (
            <Link href={`/teams/${player.id}`} key={player.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <motion.div 
                className="player-card"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (i % 6) * 0.1 }}
                whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
              >
                <img src={player.img} className="player-img" style={{ filter: player.filter, height: '350px' }} alt={player.name} />
                <span className="player-number">{player.num}</span>
                <div className="player-info">
                  <h3 className="player-name">{player.name}</h3>
                  <span className="player-position">{player.pos}</span>
                </div>
              </motion.div>
            </Link>
          ))}
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
          background: 'linear-gradient(rgba(17,17,17,0.7), rgba(17,17,17,1)), url(/kick_hero.png) center/cover no-repeat'
        }}
      >
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 10 }}>
          <span style={{ color: 'var(--clr-primary)', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 'bold' }}>Saison 2026/27</span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '5rem', textTransform: 'uppercase', margin: '15px 0', textShadow: '0 10px 30px rgba(0,0,0,0.8)' }}>Les Joueurs</h1>
          <p style={{ fontSize: '1.3rem', color: '#ccc', maxWidth: '700px', margin: '0 auto 2rem' }}>Rencontrez les talents représentant le Condor FC. Une équipe forgée dans la passion, prête à conquérir le monde.</p>
          
          {/* Menu de sélection des catégories */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '2rem' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '12px 24px',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  border: '2px solid',
                  borderColor: selectedCategory === cat ? 'var(--clr-primary)' : 'rgba(255,255,255,0.3)',
                  background: selectedCategory === cat ? 'var(--clr-primary)' : 'transparent',
                  color: 'white',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Roster Sections */}
      <section className="section-padding" style={{ minHeight: '400px' }}>
        <div className="container">
          {roster.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--clr-gray)' }}>
              <h3>Aucun joueur enregistré dans cette catégorie pour le moment.</h3>
            </div>
          ) : (
            <>
              {renderSection("Gardiens de but", goalkeepers)}
              {renderSection("Défenseurs", defenders)}
              {renderSection("Milieux de terrain", midfielders)}
              {renderSection("Attaquants", forwards)}
              {renderSection("Joueurs", unassigned)}
            </>
          )}
        </div>
      </section>

    </div>
  );
}
