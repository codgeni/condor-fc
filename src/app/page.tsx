"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import HeroSlider from '@/components/HeroSlider';
import { Play, ArrowRight, Calendar, MapPin, ShoppingBag, Landmark, Heart, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { playersDB } from '@/lib/playersDB';

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({ d: 1, h: 12, m: 0, s: 0 });
  const [playerIndex, setPlayerIndex] = useState(0);
  const spotlightPlayers = Object.values(playersDB);

  useEffect(() => {
    // Dynamic countdown to next weekend training (Saturday 8:00 AM)
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { d, h, m, s } = prev;
        if (s > 0) s--;
        else {
          s = 59;
          if (m > 0) m--;
          else {
            m = 59;
            if (h > 0) h--;
            else { 
              if (d > 0) {
                h = 23; 
                d--; 
              } else {
                // Reset to next week countdown
                d = 6;
                h = 23;
              }
            }
          }
        }
        return { d, h, m, s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ flex: 1, marginTop: '80px', overflowX: 'hidden' }}>
      
      {/* 1. Hero Section avec Slider */}
      <section style={{ position: 'relative', height: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'black', overflow: 'hidden' }}>
        <HeroSlider />
        {/* Dark overlay to ensure background visibility behind text */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.85) 100%)', zIndex: 2 }} />
        <div className="container" style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, delay: 0.5 }}>
            <span style={{ color: 'var(--clr-primary)', letterSpacing: '5px', textTransform: 'uppercase', fontWeight: 'bold' }}>CHAQUE ENFANT EST UNIQUE</span>
            <h1 className="hero-title" style={{ color: 'white', margin: '15px 0', textShadow: '0 10px 30px rgba(0,0,0,0.9)', fontSize: '4.5rem' }}>Condor École de Football</h1>
            <p style={{ fontSize: '1.4rem', color: '#eee', maxWidth: '700px', margin: '0 auto 2.5rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
              "Plus fort, plus haut dans le score !"
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/contact" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>Nous Rejoindre / S'inscrire <ArrowRight size={18} /></Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Next Match / Session Widget */}
      <section style={{ transform: 'translateY(-50px)', position: 'relative', zIndex: 20 }}>
        <div className="container">
          <motion.div 
            initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              flexWrap: 'wrap', 
              gap: '2rem', 
              background: 'white', 
              padding: '2rem 3rem', 
              borderRadius: '16px', 
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)' 
            }}
          >
            {/* Logo Club (Gauche) */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '90px', height: '90px', background: 'var(--clr-gray-light)', borderRadius: '50%', padding: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
              <img src="/condor_logo_transparent.png" alt="Condor FC" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
            </div>

            {/* Infos Match (Centre) */}
            <div style={{ flex: 1, minWidth: '250px', textAlign: 'center' }}>
              <div style={{ color: 'var(--clr-primary)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px', letterSpacing: '2px', fontSize: '0.9rem' }}>Prochain Match Officiel</div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', margin: '5px 0', textTransform: 'uppercase', color: 'var(--clr-black)' }}>Condor FC <span style={{color: 'var(--clr-primary)'}}>VS</span> AS Delmas</h3>
              <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--clr-gray)', marginTop: '8px', justifyContent: 'center', flexWrap: 'wrap', fontSize: '0.95rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={16} /> Samedi prochain, 16h00</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><MapPin size={16} /> Parc Sportif Delmas</span>
              </div>
            </div>

            {/* Compte à Rebours */}
            <div style={{ display: 'flex', gap: '1.5rem', textAlign: 'center', justifyContent: 'center' }}>
              {[ { l: 'Jours', v: timeLeft.d }, { l: 'Heures', v: timeLeft.h }, { l: 'Min', v: timeLeft.m }, { l: 'Sec', v: timeLeft.s } ].map((t, i) => (
                <div key={i} style={{ minWidth: '60px' }}>
                  <div style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', color: 'var(--clr-black)', lineHeight: 1 }}>{t.v.toString().padStart(2, '0')}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--clr-gray)', textTransform: 'uppercase', fontWeight: 'bold', marginTop: '2px' }}>{t.l}</div>
                </div>
              ))}
            </div>

            {/* Logo Adversaire (Droite) */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '90px', height: '90px', background: 'var(--clr-gray-light)', borderRadius: '50%', padding: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
              {/* Opponent shield using an inline SVG */}
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--clr-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%', color: '#333' }}>
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="rgba(0,0,0,0.05)" />
                <circle cx="12" cy="11" r="3" />
                <path d="M12 2v6" />
                <path d="M12 14v8" />
              </svg>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Section À la Une */}
      <section className="section-padding" style={{ paddingTop: 0 }}>
        <div className="container">
          <motion.h2 initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: '2rem' }}>À la Une</motion.h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            
            {/* Carte 1 : Actualité principale */}
            <Link href="/news" style={{ textDecoration: 'none', color: 'inherit' }}>
              <motion.div 
                initial={{ opacity: 0, y: 50 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.5 }} 
                style={{ display: 'flex', flexDirection: 'column', height: '480px', borderRadius: '12px', overflow: 'hidden', background: 'var(--clr-gray-light)', cursor: 'pointer', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }} 
                whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
              >
                <div style={{ height: '260px', overflow: 'hidden', position: 'relative' }}>
                  <img src="/player_action_1_1780681882713.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Actualité principale" />
                  <span style={{ position: 'absolute', top: '15px', left: '15px', background: 'var(--clr-primary)', color: 'white', padding: '5px 10px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', borderRadius: '4px' }}>Actualités</span>
                </div>
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', margin: '0 0 10px', color: 'var(--clr-black)', lineHeight: 1.3 }}>Triplé historique au 7e Tournoi Chale Chale !</h3>
                    <p style={{ color: 'var(--clr-gray)', fontSize: '0.95rem', margin: 0, lineClamp: 3, WebkitLineClamp: 3, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      Condor remporte les titres de champions dans les catégories U11, U15 et U16 lors d'une édition mémorable en Avril 2026.
                    </p>
                  </div>
                  <span style={{ color: 'var(--clr-primary)', fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '10px' }}>Lire l'article <ArrowRight size={14} /></span>
                </div>
              </motion.div>
            </Link>

            {/* Carte 2 : La Boutique */}
            <Link href="/shop" style={{ textDecoration: 'none', color: 'inherit' }}>
              <motion.div 
                initial={{ opacity: 0, y: 50 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.5, delay: 0.1 }} 
                style={{ display: 'flex', flexDirection: 'column', height: '480px', borderRadius: '12px', overflow: 'hidden', background: 'var(--clr-gray-light)', cursor: 'pointer', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }} 
                whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
              >
                <div style={{ height: '260px', overflow: 'hidden', position: 'relative' }}>
                  <img src="/condor_jersey_1780681923538.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Boutique Condor" />
                  <span style={{ position: 'absolute', top: '15px', left: '15px', background: 'var(--clr-black)', color: 'white', padding: '5px 10px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', borderRadius: '4px' }}>Boutique</span>
                </div>
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', margin: '0 0 10px', color: 'var(--clr-black)', lineHeight: 1.3 }}>Équipez vos Enfants pour la Nouvelle Saison</h3>
                    <p style={{ color: 'var(--clr-gray)', fontSize: '0.95rem', margin: 0, lineClamp: 3, WebkitLineClamp: 3, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      Commandez dès maintenant le maillot officiel et les équipements d'entraînement de la saison 2026/27.
                    </p>
                  </div>
                  <span style={{ color: 'var(--clr-primary)', fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '10px' }}>Visiter la boutique <ArrowRight size={14} /></span>
                </div>
              </motion.div>
            </Link>

            {/* Carte 3 : Communiqués du club */}
            <Link href="/news" style={{ textDecoration: 'none', color: 'inherit' }}>
              <motion.div 
                initial={{ opacity: 0, y: 50 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.5, delay: 0.2 }} 
                style={{ display: 'flex', flexDirection: 'column', height: '480px', borderRadius: '12px', overflow: 'hidden', background: 'var(--clr-gray-light)', cursor: 'pointer', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }} 
                whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
              >
                <div style={{ height: '260px', overflow: 'hidden', position: 'relative' }}>
                  <img src="/club_hero.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Communiqués officiels" />
                  <span style={{ position: 'absolute', top: '15px', left: '15px', background: '#e0a900', color: 'white', padding: '5px 10px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', borderRadius: '4px' }}>Communiqués</span>
                </div>
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', margin: '0 0 10px', color: 'var(--clr-black)', lineHeight: 1.3 }}>Brillante Performance au Flag Day</h3>
                    <p style={{ color: 'var(--clr-gray)', fontSize: '0.95rem', margin: 0, lineClamp: 3, WebkitLineClamp: 3, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      Le Condor FC U15 s'impose brillamment et termine Vice-Champion de la 13e édition du Flag Day (Mai 2026).
                    </p>
                  </div>
                  <span style={{ color: 'var(--clr-primary)', fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '10px' }}>Voir les communiqués <ArrowRight size={14} /></span>
                </div>
              </motion.div>
            </Link>

          </div>
        </div>
      </section>

      {/* 4. Joueurs mis en avant */}
      <section className="section-padding bg-gray">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ color: 'var(--clr-primary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>Distinctions</span>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', margin: '5px 0 0' }}>Joueurs Mis en Avant</h2>
            </div>
            
            {/* Boutons de navigation du Slider */}
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button 
                onClick={() => setPlayerIndex(prev => Math.max(0, prev - 1))}
                disabled={playerIndex === 0}
                className="btn btn-outline"
                style={{ padding: '10px 15px', color: 'var(--clr-black)', borderColor: 'var(--clr-black)', opacity: playerIndex === 0 ? 0.3 : 1, cursor: playerIndex === 0 ? 'not-allowed' : 'pointer', background: 'transparent' }}
              >
                &larr; Préc.
              </button>
              <button 
                onClick={() => setPlayerIndex(prev => Math.min(spotlightPlayers.length - 4, prev + 1))}
                disabled={playerIndex >= spotlightPlayers.length - 4}
                className="btn btn-outline"
                style={{ padding: '10px 15px', color: 'var(--clr-black)', borderColor: 'var(--clr-black)', opacity: playerIndex >= spotlightPlayers.length - 4 ? 0.3 : 1, cursor: playerIndex >= spotlightPlayers.length - 4 ? 'not-allowed' : 'pointer', background: 'transparent' }}
              >
                Suiv. &rarr;
              </button>
              <Link href="/teams" className="btn btn-primary" style={{ padding: '10px 20px', textDecoration: 'none', marginLeft: '10px' }}>Voir tous les Joueurs</Link>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
            {spotlightPlayers.slice(playerIndex, playerIndex + 4).map((player, i) => (
              <Link href={`/teams/${player.id}`} key={player.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                <motion.div 
                  className="player-card"
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
                >
                  <img src={player.img} className="player-img" style={{ filter: player.filter, height: '320px' }} alt={player.name} />
                  <span className="player-number">{player.num}</span>
                  <div className="player-info">
                    <h3 className="player-name" style={{ fontSize: '1.3rem' }}>{player.name}</h3>
                    <span className="player-position" style={{ fontSize: '0.8rem' }}>{player.pos}</span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Vidéos & Highlights */}
      <section className="section-padding" style={{ background: 'var(--clr-black)', color: 'white' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ color: 'var(--clr-primary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>Condor TV</span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', margin: '5px 0' }}>Dernières Vidéos & Highlights</h2>
            <p style={{ color: '#ccc', maxWidth: '600px', margin: '10px auto 0' }}>Revivez les plus beaux moments de nos équipes et les résumés officiels des matchs.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {/* Vidéo principale */}
            <div style={{ background: '#222', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
              <div style={{ position: 'relative', width: '100%', height: '260px' }}>
                <iframe 
                  width="100%" 
                  height="100%" 
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                  title="Résumé du Match" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  style={{ border: 'none' }}
                />
              </div>
              <div style={{ padding: '1.5rem' }}>
                <span style={{ background: 'var(--clr-primary)', padding: '4px 8px', fontSize: '0.75rem', fontWeight: 'bold', borderRadius: '4px' }}>RÉSUMÉ DU MATCH</span>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', margin: '10px 0 5px' }}>Finale U16 : Condor FC vs AS Delmas</h3>
                <p style={{ color: '#aaa', fontSize: '0.9rem', margin: 0 }}>Les meilleurs moments et les buts du match de sacre de notre équipe U16.</p>
              </div>
            </div>

            {/* Vidéo 2 */}
            <div style={{ background: '#222', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
              <div style={{ position: 'relative', width: '100%', height: '260px' }}>
                <iframe 
                  width="100%" 
                  height="100%" 
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                  title="Highlights" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  style={{ border: 'none' }}
                />
              </div>
              <div style={{ padding: '1.5rem' }}>
                <span style={{ background: 'var(--clr-secondary)', padding: '4px 8px', fontSize: '0.75rem', fontWeight: 'bold', borderRadius: '4px' }}>HIGHLIGHTS</span>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', margin: '10px 0 5px' }}>Top 10 Buts de la Saison U17</h3>
                <p style={{ color: '#aaa', fontSize: '0.9rem', margin: 0 }}>Découvrez les plus beaux gestes techniques et buts inscrits par nos attaquants U17.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Palmarès Section (Trophies & Tournaments) */}
      <section className="section-padding">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <Trophy size={48} color="var(--clr-primary)" style={{ marginBottom: '10px' }} />
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem' }}>Notre Palmarès</h2>
            <p style={{ fontSize: '1.2rem', color: 'var(--clr-gray)', maxWidth: '600px', margin: '0 auto' }}>Depuis notre création en Mai 2023, nos jeunes athlètes ont gravi les échelons et remporté de nombreux championnats.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {[
              { title: 'Flag Day (12e édition)', date: 'Mai 2025', rank: 'Vice-Champion U13' },
              { title: 'Tournoi Back To School', date: 'Septembre 2025', rank: 'Champion U17' },
              { title: 'Tournoi Copa Undecima', date: 'Décembre 2025', rank: 'Champion U15' },
              { title: 'Tournoi Chale Chale (7e édition)', date: 'Avril 2026', rank: 'Champion U11 / U15 / U16' },
              { title: 'Flag Day (13e édition)', date: 'Mai 2026', rank: 'Vice-Champion U15' }
            ].map((cup, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: i * 0.1 }}
                style={{ background: 'var(--clr-gray-light)', padding: '2rem', borderRadius: '12px', textAlign: 'center', borderTop: '4px solid var(--clr-primary)' }}
                whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}
              >
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '60px', height: '60px', borderRadius: '50%', background: 'white', marginBottom: '1rem', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                  <Trophy size={30} color={cup.rank.includes('Champion') && !cup.rank.includes('Vice') ? '#ffd700' : '#c0c0c0'} />
                </div>
                <span style={{ color: 'var(--clr-gray)', fontSize: '0.85rem', textTransform: 'uppercase', display: 'block', marginBottom: '5px' }}>{cup.date}</span>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', margin: '5px 0' }}>{cup.title}</h3>
                <span style={{ color: 'var(--clr-primary)', fontWeight: 'bold', fontSize: '1.1rem' }}>{cup.rank}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Official Kits */}
      <section style={{ background: 'var(--clr-black)', color: 'white', padding: '6rem 0', overflow: 'hidden', position: 'relative' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <motion.div initial={{ x: -50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }}>
            <span style={{ color: 'var(--clr-gray)', letterSpacing: '2px', textTransform: 'uppercase' }}>Équipement Officiel</span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '4rem', margin: '10px 0', color: 'var(--clr-primary)' }}>PORTEZ LES COULEURS</h2>
            <p style={{ fontSize: '1.2rem', color: '#ccc', maxWidth: '500px', marginBottom: '2rem' }}>Rejoignez la famille Condor en portant notre maillot officiel et notre équipement d'entraînement de la saison 2026/27.</p>
            <Link href="/shop" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}><ShoppingBag size={18} /> Voir la Boutique</Link>
          </motion.div>
          <motion.div initial={{ x: 50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} className="d-none-mobile">
            <img src="/condor_jersey_1780681923538.png" style={{ width: '400px', transform: 'rotate(10deg)', filter: 'drop-shadow(0 20px 30px rgba(255,0,0,0.2))' }} />
          </motion.div>
        </div>
      </section>

      {/* 8. Edu-Sport Philosophy */}
      <section className="section-padding bg-gray text-center">
        <motion.div className="container" initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <Heart size={48} color="var(--clr-primary)" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: '1rem' }}>Philosophie Edu-Sport</h2>
          <p style={{ fontSize: '1.2rem', color: 'var(--clr-black-light)', maxWidth: '700px', margin: '0 auto 2rem' }}>Pour nous, le football est bien plus qu'un simple jeu. Notre académie met en place un encadrement éducatif et social pour aider chaque jeune à devenir un citoyen accompli et un athlète d'exception.</p>
          <Link href="/club" className="btn btn-outline" style={{ color: 'var(--clr-black)', borderColor: 'var(--clr-black)', textDecoration: 'none' }}>Découvrir Notre Mission</Link>
        </motion.div>
      </section>

      {/* 9. Training Site (Delmas 77) */}
      <section style={{ position: 'relative', padding: '6rem 0', color: 'white' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
          <img src="/stadium_hero_1780681869623.png" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.3)' }} />
        </div>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'center' }}>
          <motion.div initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}>
            <Landmark size={48} color="white" style={{ marginBottom: '1rem' }} />
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', margin: '0 0 1rem' }}>Notre Terrain d'Entraînement</h2>
            <p style={{ fontSize: '1.2rem', color: '#ccc', marginBottom: '2rem' }}>Retrouvez-nous chaque week-end à l'entrée de Delmas 77 (à côté de BIWI). Nos installations permettent un apprentissage structuré et sécurisé pour toutes les tranches d'âge.</p>
            <Link href="/contact" className="btn btn-primary" style={{ background: 'white', color: 'var(--clr-black)', textDecoration: 'none' }}>Nous Contacter & Localiser</Link>
          </motion.div>
        </div>
      </section>

      {/* 10. Infinite Marquee Sponsors */}
      <section style={{ padding: '3rem 0', background: 'var(--clr-black)', borderTop: '1px solid #333', borderBottom: '1px solid #333', overflow: 'hidden' }}>
        <motion.div 
          animate={{ x: [0, -1000] }} 
          transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
          style={{ display: 'flex', gap: '6rem', whiteSpace: 'nowrap', width: 'max-content', opacity: 0.5 }}
        >
          {Array(4).fill(['CONDOR ACADEMY', 'EDU-SPORT', 'DELMAS 77', 'FOOTBALL HAITI', 'CONDOR ECOLE']).flat().map((sponsor, i) => (
            <h3 key={i} style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', color: 'white', margin: 0 }}>{sponsor}</h3>
          ))}
        </motion.div>
      </section>

    </div>
  );
}
