"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { playersDB } from '@/lib/playersDB';

export default function Teams() {
  const roster = Object.values(playersDB);

  // Classify players based on French translations in playersDB.ts
  const goalkeepers = roster.filter(p => p.pos.includes('Gardien'));
  const defenders = roster.filter(p => p.pos.includes('Défenseur') || p.pos.includes('Arrière'));
  const midfielders = roster.filter(p => p.pos.includes('Milieu'));
  const forwards = roster.filter(p => p.pos.includes('Ailier') || p.pos.includes('Avant'));

  const renderSection = (title: string, players: typeof roster) => (
    <div style={{ marginBottom: '4rem' }}>
      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: '2rem', textTransform: 'uppercase', color: 'var(--clr-primary)', borderBottom: '2px solid var(--clr-gray-light)', paddingBottom: '10px' }}>
        {title}
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
              <img src={player.img} className="player-img" style={{ filter: player.filter }} alt={player.name} />
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
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '5rem', textTransform: 'uppercase', margin: '15px 0', textShadow: '0 10px 30px rgba(0,0,0,0.8)' }}>L'Armada</h1>
          <p style={{ fontSize: '1.3rem', color: '#ccc', maxWidth: '700px', margin: '0 auto' }}>Rencontrez les 32 guerriers représentant le Condor FC. Une équipe forgée dans la passion, prête à conquérir le monde.</p>
        </motion.div>
      </section>

      {/* Roster Sections */}
      <section className="section-padding">
        <div className="container">
          {renderSection("Gardiens de but", goalkeepers)}
          {renderSection("Défenseurs", defenders)}
          {renderSection("Milieux de terrain", midfielders)}
          {renderSection("Attaquants", forwards)}
        </div>
      </section>

    </div>
  );
}
