"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import HeroSlider from '@/components/HeroSlider';
import { Play, ArrowRight, Calendar, MapPin, ShoppingBag, Landmark, Heart, Trophy, Tv, ChevronLeft, ChevronRight, Award, Star, Activity } from 'lucide-react';
import { useEffect, useState } from 'react';
import { playersDB } from '@/lib/playersDB';
import { fetchCurrentMatch, MatchConfig, fetchVideos, VideoItem } from '@/lib/dataService';
import { supabase } from '@/lib/supabaseClient';
import { RealMadridGoldCup, RealMadridSilverCup } from '@/components/Trophies';

export default function Home() {
  const [activeTrophyIndex, setActiveTrophyIndex] = useState(0);
  const [matchConfig, setMatchConfig] = useState<MatchConfig>({
    opponent: '',
    home_team: 'Condor FC',
    match_date: '',
    match_time: '',
    location: 'Parc Sportif Delmas',
    competition: 'Prochain Match Officiel',
    no_matches_now: true,
    is_active: true
  });

  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [latestNews, setLatestNews] = useState<any[]>([]);
  const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);
  const [playerIndex, setPlayerIndex] = useState(0);

  const spotlightPlayers = Object.values(playersDB).filter(p => p.detailImg || (p.img && !p.img.includes('condor_logo')));

  useEffect(() => {
    // 1. Fetch current match configuration
    fetchCurrentMatch().then(data => {
      if (data) {
        setMatchConfig(data);
      }
    });

    // 2. Fetch latest videos
    fetchVideos().then(vids => {
      if (vids && vids.length > 0) {
        setVideos(vids.slice(0, 2));
      }
    });

    // 3. Fetch latest news
    supabase.from('news').select('*').order('created_at', { ascending: false }).limit(3).then(({ data }) => {
      if (data && data.length > 0) {
        setLatestNews(data);
      }
    });
  }, []);

  // Dynamic countdown calculation if a valid date is set and no_matches_now is false
  useEffect(() => {
    if (matchConfig.no_matches_now || !matchConfig.opponent || !matchConfig.match_date) {
      setTimeLeft(null);
      return;
    }

    const calculateTime = () => {
      const targetStr = `${matchConfig.match_date} ${matchConfig.match_time || '16:00'}`;
      const target = new Date(targetStr).getTime();
      const now = new Date().getTime();

      if (isNaN(target) || target <= now) {
        setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
        return;
      }

      const diff = target - now;
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ d, h, m, s });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [matchConfig]);

  return (
    <div style={{ flex: 1, marginTop: '80px', overflowX: 'hidden' }}>
      
      {/* 1. Hero Section avec Slider */}
      <section style={{ position: 'relative', height: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'black', overflow: 'hidden' }}>
        <HeroSlider />
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
              padding: '2.2rem 3rem', 
              borderRadius: '16px', 
              boxShadow: '0 20px 40px rgba(0,0,0,0.18)',
              border: '1px solid rgba(0,0,0,0.05)'
            }}
          >
            {matchConfig.no_matches_now || !matchConfig.opponent ? (
              /* État : Aucun match officiel pour le moment (Zéro donnée mockée) */
              <div style={{ textAlign: 'center', width: '100%', padding: '0.8rem 0' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--clr-primary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem', marginBottom: '8px' }}>
                  <Calendar size={18} /> Calendrier Officiel
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', margin: '4px 0 10px', textTransform: 'uppercase', color: 'var(--clr-black)' }}>
                  Aucun match officiel programmé pour le moment
                </h3>
                <p style={{ color: 'var(--clr-gray)', margin: '0 auto', maxWidth: '680px', fontSize: '1.05rem', lineHeight: 1.5 }}>
                  Nos équipes sont actuellement en période d'entraînement intensif et de préparation technique. Suivez nos actualités pour être tenus informés des prochaines rencontres officielles !
                </p>
              </div>
            ) : (
              /* Match Officiel Réellement Configuré par l'Admin */
              <>
                {/* Logo Club (Gauche) */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '90px', height: '90px', background: 'var(--clr-gray-light)', borderRadius: '50%', padding: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                  <img src="/condor_logo_transparent.png" alt="Condor FC" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                </div>

                {/* Infos Match (Centre) */}
                <div style={{ flex: 1, minWidth: '250px', textAlign: 'center' }}>
                  <div style={{ color: 'var(--clr-primary)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px', letterSpacing: '2px', fontSize: '0.9rem' }}>
                    {matchConfig.competition || 'Prochain Match Officiel'}
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', margin: '5px 0', textTransform: 'uppercase', color: 'var(--clr-black)' }}>
                    {matchConfig.home_team || 'Condor FC'} <span style={{color: 'var(--clr-primary)'}}>VS</span> {matchConfig.opponent}
                  </h3>
                  <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--clr-gray)', marginTop: '8px', justifyContent: 'center', flexWrap: 'wrap', fontSize: '0.95rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={16} /> {matchConfig.match_date} à {matchConfig.match_time}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><MapPin size={16} /> {matchConfig.location || 'Parc Sportif Delmas'}</span>
                  </div>
                </div>

                {/* Compte à Rebours si disponible */}
                {timeLeft ? (
                  <div style={{ display: 'flex', gap: '1.5rem', textAlign: 'center', justifyContent: 'center' }}>
                    {[ { l: 'Jours', v: timeLeft.d }, { l: 'Heures', v: timeLeft.h }, { l: 'Min', v: timeLeft.m }, { l: 'Sec', v: timeLeft.s } ].map((t, i) => (
                      <div key={i} style={{ minWidth: '55px' }}>
                        <div style={{ fontSize: '2.2rem', fontFamily: 'var(--font-heading)', color: 'var(--clr-black)', lineHeight: 1 }}>{t.v.toString().padStart(2, '0')}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--clr-gray)', textTransform: 'uppercase', fontWeight: 'bold', marginTop: '2px' }}>{t.l}</div>
                      </div>
                    ))}
                  </div>
                ) : null}

                {/* Logo Adversaire (Droite) */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '90px', height: '90px', background: 'var(--clr-gray-light)', borderRadius: '50%', padding: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                  {matchConfig.opponent_logo ? (
                    <img src={matchConfig.opponent_logo} alt={matchConfig.opponent} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="var(--clr-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="rgba(0,0,0,0.05)" />
                      <circle cx="12" cy="11" r="3" />
                      <path d="M12 2v6" />
                      <path d="M12 14v8" />
                    </svg>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* 3. Section À la Une (Actualités Réelles) */}
      <section className="section-padding" style={{ paddingTop: 0 }}>
        <div className="container">
          <motion.h2 initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: '2rem' }}>À la Une</motion.h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {latestNews.length > 0 ? (
              latestNews.map((news, i) => (
                <Link href="/news" key={news.id || i} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true }} 
                    transition={{ duration: 0.4, delay: i * 0.1 }} 
                    style={{ display: 'flex', flexDirection: 'column', height: '460px', borderRadius: '12px', overflow: 'hidden', background: 'var(--clr-gray-light)', cursor: 'pointer', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }} 
                    whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                  >
                    <div style={{ height: '240px', overflow: 'hidden', position: 'relative' }}>
                      <img src={news.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={news.title} />
                      <span style={{ position: 'absolute', top: '15px', left: '15px', background: 'var(--clr-primary)', color: 'white', padding: '5px 10px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', borderRadius: '4px' }}>
                        {news.cat || 'Actualité'}
                      </span>
                    </div>
                    <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', margin: '0 0 10px', color: 'var(--clr-black)', lineHeight: 1.3 }}>{news.title}</h3>
                        <p style={{ color: 'var(--clr-gray)', fontSize: '0.95rem', margin: 0, lineClamp: 3, WebkitLineClamp: 3, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {news.desc_text || news.desc}
                        </p>
                      </div>
                      <span style={{ color: 'var(--clr-primary)', fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '10px' }}>Lire l'article <ArrowRight size={14} /></span>
                    </div>
                  </motion.div>
                </Link>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', background: 'var(--clr-gray-light)', padding: '3rem', borderRadius: '12px', textAlign: 'center' }}>
                <p style={{ color: 'var(--clr-gray)', fontSize: '1.1rem', margin: 0 }}>Aucune actualité publiée pour le moment. Consultez notre section Actualités pour les dernières annonces du club.</p>
                <Link href="/news" className="btn btn-outline" style={{ marginTop: '1.5rem', color: 'black', borderColor: '#ccc' }}>Consulter les actualités</Link>
              </div>
            )}
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

      {/* 5. Vidéos & Highlights (Connecté à Condor TV) */}
      <section className="section-padding" style={{ background: 'var(--clr-black)', color: 'white' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ color: 'var(--clr-primary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>Condor TV</span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', margin: '5px 0' }}>Dernières Vidéos & Highlights</h2>
            <p style={{ color: '#ccc', maxWidth: '600px', margin: '10px auto 0' }}>Revivez les plus beaux moments de nos équipes et les résumés officiels des matchs.</p>
          </div>

          {videos.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
              {videos.map(vid => (
                <div key={vid.id} style={{ background: '#222', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                  <div style={{ position: 'relative', width: '100%', height: '260px' }}>
                    <iframe 
                      width="100%" 
                      height="100%" 
                      src={vid.url} 
                      title={vid.title} 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                      style={{ border: 'none' }}
                    />
                  </div>
                  <div style={{ padding: '1.5rem' }}>
                    <span style={{ background: 'var(--clr-primary)', padding: '4px 8px', fontSize: '0.75rem', fontWeight: 'bold', borderRadius: '4px' }}>
                      {vid.category}
                    </span>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', margin: '10px 0 5px' }}>{vid.title}</h3>
                    <p style={{ color: '#aaa', fontSize: '0.9rem', margin: 0 }}>{vid.description || 'Découvrez cette vidéo exclusive Condor TV.'}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', background: '#1c1c1c', borderRadius: '12px', maxWidth: '700px', margin: '0 auto' }}>
              <Tv size={48} color="var(--clr-primary)" style={{ marginBottom: '15px' }} />
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', marginBottom: '8px' }}>Prochainement sur Condor TV</h3>
              <p style={{ color: '#aaa', fontSize: '1rem', margin: '0 auto 1.5rem', maxWidth: '500px' }}>
                Les vidéos de nos matchs, résumés et séances d'entraînement sont en cours de montage. Revenez bientôt !
              </p>
              <Link href="/tv" className="btn btn-primary">Explorer Condor TV</Link>
            </div>
          )}
        </div>
      </section>

      {/* 6. Section Palmarès Officiel (Design Club : Blanc, Rouge, Noir, Gris) */}
      <section 
        style={{ 
          background: '#0B0B0E', 
          color: 'white', 
          padding: '6rem 0',
          position: 'relative',
          overflow: 'hidden',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        {/* Lueur d'ambiance Rouge Condor */}
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '900px', height: '350px', background: 'radial-gradient(ellipse at center, rgba(202, 2, 79, 0.12), transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          
          {/* En-tête sobre et officiel */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 style={{ 
                fontFamily: 'var(--font-heading)', 
                fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
                margin: '4px 0 10px', 
                textTransform: 'uppercase', 
                letterSpacing: '1px',
                color: '#ffffff'
              }}>
                NOTRE PALMARÈS
              </h2>
              
              <p style={{ fontSize: '1.1rem', color: '#94a3b8', maxWidth: '680px', margin: '0 auto 2.2rem', lineHeight: 1.6 }}>
                Les titres officiels et les distinctions majeures remportés par le Condor FC depuis sa fondation en Mai 2023.
              </p>
            </motion.div>

            {/* Compteurs du Club (Blanc, Rouge, Gris) parfaitement centrés dans leurs cases */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(4, 1fr)', 
              background: '#121217', 
              border: '1px solid #22222b', 
              borderRadius: '16px', 
              padding: '1.2rem 0', 
              boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
              maxWidth: '850px',
              margin: '0 auto',
              width: '100%'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 0.8rem' }}>
                <div style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', color: '#ffffff', lineHeight: 1, fontWeight: 'bold' }}>05</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '6px', fontWeight: 'bold' }}>Titres & Podiums</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 0.8rem', borderLeft: '1px solid #22222b' }}>
                <div style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', color: 'var(--clr-primary)', lineHeight: 1, fontWeight: 'bold' }}>03</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '6px', fontWeight: 'bold' }}>Titres de Champion</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 0.8rem', borderLeft: '1px solid #22222b' }}>
                <div style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', color: '#ffffff', lineHeight: 1, fontWeight: 'bold' }}>02</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '6px', fontWeight: 'bold' }}>Vice-Champions</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 0.8rem', borderLeft: '1px solid #22222b' }}>
                <div style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', color: 'var(--clr-primary)', lineHeight: 1, fontWeight: 'bold' }}>01</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '6px', fontWeight: 'bold' }}>Triplé Historique</div>
              </div>
            </div>
          </div>

          {/* SCÈNE DU TROPHÉE SÉLECTIONNÉ */}
          {(() => {
            const currentTrophy = [
              { 
                id: 'chale-chale',
                title: 'Tournoi Chale Chale', 
                edition: '7e Édition · Triplé Inédit',
                date: 'Avril 2026', 
                rank: 'Champion U11 / U15 / U16', 
                isGold: true,
                badge: 'Triplé Historique',
                venue: 'Parc Sportif Delmas',
                stats: '3 Trophées · 1 Édition · Invaincus',
                desc: 'Condor FC s\'impose au sommet en remportant les trophées de champions dans trois catégories différentes (U11, U15, U16) lors d\'une seule et même édition. Une domination tactique absolue saluée par tous les observateurs.'
              },
              { 
                id: 'back-to-school',
                title: 'Tournoi Back To School', 
                edition: 'Édition Annuelle Élite',
                date: 'Septembre 2025', 
                rank: 'Champion National U17', 
                isGold: true,
                badge: 'Champion National',
                venue: 'Stade Municipal',
                stats: 'Meilleure Attaque · Victoire en Finale 3-1',
                desc: 'Parcours parfait des U17 qui s\'imposent avec panache face aux plus prestigieuses académies du pays. Une cohésion d\'équipe exemplaire et une efficacité offensive redoutable jusqu\'au sacre.'
              },
              { 
                id: 'copa-undecima',
                title: 'Tournoi Copa Undecima', 
                edition: 'Coupe d\'Hiver 2025',
                date: 'Décembre 2025', 
                rank: 'Champion U15', 
                isGold: true,
                badge: 'Champion Officiel',
                venue: 'Delmas 77',
                stats: 'Invaincus · Trophée Meilleur Buteur',
                desc: 'Une démonstration offensive magistrale menée par la catégorie U15. En finale, les jeunes Condors ont fait preuve d\'un sang-froid extraordinaire pour décrocher le titre suprême devant un public conquis.'
              },
              { 
                id: 'flag-day-13',
                title: 'Flag Day (13e édition)', 
                edition: 'Tournoi National Fête du Drapeau',
                date: 'Mai 2026', 
                rank: 'Vice-Champion U15', 
                isGold: false,
                badge: 'Médaille d\'Argent',
                venue: 'Complexe National',
                stats: 'Finale aux Tirs au But · Meilleure Défense',
                desc: 'Une épopée courageuse menant l\'équipe U15 jusqu\'aux tirs au but de la grande finale nationale du 18 Mai. Une médaille d\'argent disputée avec honneur face aux meilleures formations du pays.'
              },
              { 
                id: 'flag-day-12',
                title: 'Flag Day (12e édition)', 
                edition: 'Tournoi National Fête du Drapeau',
                date: 'Mai 2025', 
                rank: 'Vice-Champion U13', 
                isGold: false,
                badge: 'Médaille d\'Argent',
                venue: 'Complexe National',
                stats: 'Premier Podium de l\'Histoire du Club',
                desc: 'Le tout premier trophée majeur conquis par l\'académie seulement deux ans après sa fondation officielle en Mai 2023. Le point de départ d\'une série de victoires et d\'une ascension constante.'
              }
            ][activeTrophyIndex] || {
              id: 'chale-chale',
              title: 'Tournoi Chale Chale',
              edition: '7e Édition',
              date: 'Avril 2026',
              rank: 'Champion U11 / U15 / U16',
              isGold: true,
              badge: 'Champion',
              venue: 'Parc Sportif Delmas',
              stats: 'Invaincus',
              desc: 'Trophée officiel'
            };

            const allTrophiesList = [
              { name: 'Triplé Chale Chale', year: '2026', rank: 'Champion U11/15/16', isGold: true },
              { name: 'Back To School', year: '2025', rank: 'Champion U17', isGold: true },
              { name: 'Copa Undecima', year: '2025', rank: 'Champion U15', isGold: true },
              { name: 'Flag Day 13e', year: '2026', rank: 'Vice-Champion U15', isGold: false },
              { name: 'Flag Day 12e', year: '2025', rank: 'Vice-Champion U13', isGold: false }
            ];

            return (
              <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                {/* 1. Vitrine Principale */}
                <div 
                  style={{
                    background: '#111116',
                    borderRadius: '24px',
                    border: '1px solid #22222d',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
                    position: 'relative',
                    overflow: 'hidden',
                    padding: 'clamp(2rem, 4vw, 3.5rem)',
                    marginBottom: '2.5rem'
                  }}
                >
                  <div 
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'minmax(280px, 360px) 1fr',
                      gap: 'clamp(2rem, 4vw, 3.5rem)',
                      alignItems: 'center',
                      position: 'relative',
                      zIndex: 1
                    }}
                    className="trophy-stage-grid"
                  >
                    {/* Colonne Gauche : Trophée */}
                    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', justifyContent: 'center', minHeight: '340px', paddingTop: '2.5rem' }}>
                      <motion.div
                        key={currentTrophy.id}
                        initial={{ opacity: 0, scale: 0.88, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1, transform: 'translateY(22px)', marginBottom: '25px' }}
                      >
                        {currentTrophy.isGold ? (
                          <RealMadridGoldCup size={150} glow={false} withReflection={true} />
                        ) : (
                          <RealMadridSilverCup size={150} glow={false} withReflection={true} />
                        )}
                      </motion.div>

                      {/* Plaque Socle du Trophée */}
                      <div 
                        style={{
                          marginTop: '1.2rem',
                          transform: 'translateY(18px)',
                          background: '#16161f',
                          border: '1px solid #2a2a38',
                          borderRadius: '8px',
                          padding: '10px 24px',
                          boxShadow: '0 8px 20px rgba(0,0,0,0.6)',
                          maxWidth: '280px',
                          width: '100%',
                          position: 'relative',
                          zIndex: 1
                        }}
                      >
                        <div style={{ fontSize: '0.7rem', letterSpacing: '2px', color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase' }}>
                          CONDOR FOOTBALL CLUB
                        </div>
                        <div style={{ fontSize: '0.95rem', color: '#ffffff', fontWeight: 'bold', fontFamily: 'var(--font-heading)', letterSpacing: '1px', marginTop: '2px' }}>
                          {currentTrophy.rank}
                        </div>
                      </div>
                    </div>

                    {/* Colonne Droite : Détails & Récit */}
                    <motion.div
                      key={`desc-${currentTrophy.id}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                    >
                      {/* Badge Supérieur en Rouge Condor */}
                      <div style={{ marginBottom: '0.8rem' }}>
                        <span 
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            background: 'rgba(202, 2, 79, 0.15)',
                            border: '1px solid var(--clr-primary)',
                            color: '#ffffff',
                            padding: '4px 14px',
                            borderRadius: '20px',
                            fontSize: '0.72rem',
                            fontWeight: '800',
                            letterSpacing: '1.5px',
                            textTransform: 'uppercase'
                          }}
                        >
                          {currentTrophy.badge}
                        </span>
                      </div>

                      {/* Titre Majeur en Blanc Net */}
                      <h3 
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
                          margin: '0 0 6px',
                          color: '#ffffff',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          lineHeight: 1.15
                        }}
                      >
                        {currentTrophy.title}
                      </h3>

                      {/* Édition en Rouge Condor */}
                      <div 
                        style={{
                          fontSize: '1rem',
                          color: 'var(--clr-primary)',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          marginBottom: '1.2rem'
                        }}
                      >
                        {currentTrophy.edition}
                      </div>

                      {/* Métadonnées avec Icônes (Zéro Emoji) */}
                      <div 
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '12px 20px',
                          fontSize: '0.86rem',
                          padding: '12px 18px',
                          background: '#16161e',
                          borderRadius: '10px',
                          border: '1px solid #22222d',
                          marginBottom: '1.4rem'
                        }}
                      >
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#e2e8f0' }}>
                          <Calendar size={15} color="var(--clr-primary)" />
                          <span><strong>Date :</strong> {currentTrophy.date}</span>
                        </span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#e2e8f0' }}>
                          <MapPin size={15} color="var(--clr-primary)" />
                          <span><strong>Lieu :</strong> {currentTrophy.venue}</span>
                        </span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#e2e8f0' }}>
                          <Activity size={15} color="var(--clr-primary)" />
                          <span><strong>Bilan :</strong> {currentTrophy.stats}</span>
                        </span>
                      </div>

                      {/* Récit Historique Parfaitement Lisible */}
                      <p style={{ color: '#cbd5e1', fontSize: '1.02rem', lineHeight: 1.7, margin: '0 0 2rem' }}>
                        {currentTrophy.desc}
                      </p>

                      {/* Barre d'Action & Navigation */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => setActiveTrophyIndex((prev) => (prev > 0 ? prev - 1 : 4))}
                          className="btn"
                          style={{
                            background: '#181822',
                            border: '1px solid #2e2e3e',
                            color: 'white',
                            padding: '10px 20px',
                            borderRadius: '30px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '0.85rem',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                          }}
                        >
                          <ChevronLeft size={18} /> Précédent
                        </button>

                        <span style={{ fontSize: '0.88rem', color: '#94a3b8', fontWeight: 'bold', letterSpacing: '1px' }}>
                          0{activeTrophyIndex + 1} / 05
                        </span>

                        <button
                          onClick={() => setActiveTrophyIndex((prev) => (prev < 4 ? prev + 1 : 0))}
                          className="btn btn-primary"
                          style={{
                            padding: '10px 22px',
                            borderRadius: '30px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '0.85rem',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                          }}
                        >
                          Suivant <ChevronRight size={18} />
                        </button>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* 2. Galerie des Socles (Sélection Directe) */}
                <div>
                  <div style={{ textAlign: 'center', marginBottom: '1.2rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', letterSpacing: '2.5px', textTransform: 'uppercase', fontWeight: 'bold' }}>
                      SÉLECTIONNER UN TROPHÉE DANS LA GALERIE
                    </span>
                  </div>

                  <div 
                    style={{
                      display: 'flex',
                      gap: '1rem',
                      overflowX: 'auto',
                      paddingBottom: '1rem',
                      justifyContent: 'center',
                      scrollSnapType: 'x mandatory'
                    }}
                    className="trophy-pedestals-scroll"
                  >
                    {allTrophiesList.map((t, idx) => {
                      const isActive = activeTrophyIndex === idx;
                      return (
                        <div
                          key={idx}
                          onClick={() => setActiveTrophyIndex(idx)}
                          style={{
                            cursor: 'pointer',
                            flex: '0 0 190px',
                            scrollSnapAlign: 'start',
                            borderRadius: '16px',
                            padding: '1.8rem 0.8rem 1.2rem',
                            textAlign: 'center',
                            background: isActive ? '#171720' : '#111116',
                            border: '1px solid #22222b',
                            boxShadow: '0 6px 16px rgba(0,0,0,0.5)',
                            transform: isActive ? 'translateY(-4px)' : 'none',
                            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                            position: 'relative',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {/* Mini Trophée 3D */}
                          <div style={{ height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '4px auto 12px', transform: 'translateY(8px)' }}>
                            {t.isGold ? (
                              <RealMadridGoldCup size={54} glow={false} />
                            ) : (
                              <RealMadridSilverCup size={54} glow={false} />
                            )}
                          </div>

                          {/* Titre & Année */}
                          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.92rem', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 2px' }}>
                            {t.name}
                          </div>
                          
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 'bold' }}>
                            {t.year} · {t.rank}
                          </div>

                          {/* Liseré indicateur d'activation en Rouge Condor */}
                          {isActive && (
                            <div style={{ position: 'absolute', bottom: 0, left: '15%', right: '15%', height: '3px', background: 'var(--clr-primary)', borderRadius: '3px 3px 0 0' }} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            );
          })()}

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
            <img src="/shop/maillot_match_pro_marbre.png" alt="Maillot Condor Match Pro" style={{ width: '380px', maxHeight: '460px', objectFit: 'contain', transform: 'rotate(5deg)', filter: 'drop-shadow(0 20px 30px rgba(230,0,0,0.25))' }} />
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
          <img src="/stadium_hero_1780681869623.png" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.3)' }} alt="Terrain Delmas 77" />
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
