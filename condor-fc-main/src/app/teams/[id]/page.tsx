"use client";

import { motion } from 'framer-motion';
import { use } from 'react';
import { playersDB } from '@/lib/playersDB';
import { Trophy, Activity, Medal } from 'lucide-react';

export default function PlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const player = playersDB[unwrappedParams.id];

  if (!player) {
    return <div style={{ marginTop: '100px', textAlign: 'center', padding: '50px' }}><h1>Joueur Introuvable</h1></div>;
  }

  return (
    <div style={{ flex: 1, marginTop: '80px' }}>
      
      {/* Hero */}
      <section style={{ background: 'linear-gradient(rgba(17,17,17,0.7), rgba(17,17,17,1)), url(/player_action_1_1780681882713.png) center/cover no-repeat', color: 'white', padding: '100px 0 50px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', overflow: 'hidden', position: 'relative' }}>
        <div className="container" style={{ position: 'relative', width: '100%', height: '100%', zIndex: 10 }}>
          <motion.div 
            style={{ zIndex: 2, position: 'relative' }}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div style={{ fontSize: '8rem', fontFamily: 'var(--font-heading)', color: 'var(--clr-primary)', lineHeight: 1, opacity: 0.8 }}>{player.num}</div>
            <h1 className="hero-title" style={{ margin: 0, color: 'white' }}>{player.name}</h1>
            <div style={{ fontSize: '1.5rem', color: 'var(--clr-gray)', textTransform: 'uppercase', letterSpacing: '2px' }}>{player.pos}</div>
          </motion.div>
          <motion.div 
            style={{ position: 'absolute', right: '5%', bottom: '-20px', height: '120%', zIndex: 1 }}
            className="d-none-mobile"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, type: 'spring' }}
          >
            <img src={player.img} alt={player.name} style={{ height: '100%', objectFit: 'cover', filter: player.filter }} />
          </motion.div>
        </div>
      </section>

      <div className="container">
        {/* Bio Data */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', background: 'var(--clr-gray-light)', padding: '2rem', borderRadius: '8px', marginTop: '-30px', position: 'relative', zIndex: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--clr-gray)', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '5px' }}>Date de Naissance</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: 'var(--clr-black)' }}>{player.dob}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--clr-gray)', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '5px' }}>Taille</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: 'var(--clr-black)' }}>{player.height}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--clr-gray)', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '5px' }}>Poids</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: 'var(--clr-black)' }}>{player.weight}</div>
          </div>
        </motion.div>

        {/* Advanced Dashboard */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', padding: '4rem 0' }}>
          
          {/* Season Stats */}
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}><Activity color="var(--clr-primary)" /> Statistiques de la Saison</h2>
            <div className="flex-between" style={{ background: 'var(--clr-white)', padding: '2rem', borderRadius: '8px', border: '1px solid var(--clr-gray-light)' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', color: 'var(--clr-primary)' }}>{player.matches}</div>
                <div style={{ color: 'var(--clr-gray)', fontSize: '0.9rem', textTransform: 'uppercase' }}>Matchs</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', color: 'var(--clr-primary)' }}>{player.stat2val}</div>
                <div style={{ color: 'var(--clr-gray)', fontSize: '0.9rem', textTransform: 'uppercase' }}>{player.stat2lbl}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', color: 'var(--clr-primary)' }}>{player.assists}</div>
                <div style={{ color: 'var(--clr-gray)', fontSize: '0.9rem', textTransform: 'uppercase' }}>Passes Dé.</div>
              </div>
            </div>
          </motion.div>

          {/* Recent Match Performance */}
          <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '1.5rem' }}>Dernier Match</h2>
            <div style={{ background: 'var(--clr-black)', color: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333', paddingBottom: '1rem', marginBottom: '1rem', flexWrap: 'wrap', gap: '10px' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>vs {player.recentMatch.opponent}</span>
                <span style={{ background: 'var(--clr-primary)', padding: '5px 15px', borderRadius: '20px', fontWeight: 'bold' }}>{player.recentMatch.result}</span>
              </div>
              <div className="flex-between">
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)' }}>{player.recentMatch.rating}</div>
                  <div style={{ color: 'var(--clr-gray)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Note du Match</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)' }}>{player.recentMatch.minutes}'</div>
                  <div style={{ color: 'var(--clr-gray)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Minutes Jouées</div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Achievements / Honors */}
        <section style={{ paddingBottom: '4rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}><Trophy color="var(--clr-primary)" /> Palmarès</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              style={{ background: '#f8f9fa', padding: '2rem', borderRadius: '8px', textAlign: 'center', border: '1px solid #e9ecef' }}
            >
              <Medal size={48} color="#ffd700" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', margin: 0 }}>x {player.honours1}</h3>
              <p style={{ color: 'var(--clr-gray)', textTransform: 'uppercase', fontSize: '0.9rem' }}>Titres de Champion</p>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              style={{ background: '#f8f9fa', padding: '2rem', borderRadius: '8px', textAlign: 'center', border: '1px solid #e9ecef' }}
            >
              <Trophy size={48} color="#c0c0c0" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', margin: 0 }}>x {player.honours2}</h3>
              <p style={{ color: 'var(--clr-gray)', textTransform: 'uppercase', fontSize: '0.9rem' }}>Coupes d'Europe</p>
            </motion.div>
          </div>
        </section>

      </div>
    </div>
  );
}
