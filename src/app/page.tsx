"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import HeroSlider from '@/components/HeroSlider';
import { Play, ArrowRight, Calendar, MapPin, ShoppingBag, Landmark, Heart, Trophy, Tv, ChevronLeft, ChevronRight, Award, Star, Activity, X, Clock, ExternalLink } from 'lucide-react';
import { useEffect, useState, useRef, useMemo } from 'react';
import { playersDB } from '@/lib/playersDB';
import { 
  fetchCurrentMatch, MatchConfig, fetchVideos, VideoItem, parseVideoUrl,
  fetchSiteContent, SiteContent, DEFAULT_SITE_CONTENT,
  fetchMergedPlayers, fetchNews,
  fetchTrophies, TrophyItem, DEFAULT_TROPHIES,
  parseMatchDateTime
} from '@/lib/dataService';
import { supabase } from '@/lib/supabaseClient';
import { formatRelativeTime } from '@/lib/timeUtils';
import { 
  ChaleChaleTripleCup, 
  BackToSchoolNationalCup, 
  CopaUndecimaWinterCup, 
  FlagDaySilverCup, 
  FlagDayHistoricalSilverCup 
} from '@/components/Trophies';

function renderTrophy(id: string, size = 155, withReflection = false) {
  switch (id) {
    case 'chale-chale':
      return <ChaleChaleTripleCup size={size} glow={false} withReflection={withReflection} />;
    case 'back-to-school':
      return <BackToSchoolNationalCup size={size} glow={false} withReflection={withReflection} />;
    case 'copa-undecima':
      return <CopaUndecimaWinterCup size={size} glow={false} withReflection={withReflection} />;
    case 'flag-day-13':
      return <FlagDaySilverCup size={size} glow={false} withReflection={withReflection} />;
    case 'flag-day-12':
      return <FlagDayHistoricalSilverCup size={size} glow={false} withReflection={withReflection} />;
    default:
      return <ChaleChaleTripleCup size={size} glow={false} withReflection={withReflection} />;
  }
}

export default function Home() {
  const [activeTrophyIndex, setActiveTrophyIndex] = useState(0);
  const [trophies, setTrophies] = useState<TrophyItem[]>(DEFAULT_TROPHIES);
  const [siteContent, setSiteContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
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
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);
  const modalOverlayRef = useRef<HTMLDivElement | null>(null);

  // Lock background scrolling on PC and Mobile when article modal is open
  useEffect(() => {
    if (selectedArticle) {
      const originalOverflow = document.body.style.overflow;
      const originalTouchAction = document.body.style.touchAction;
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';

      if (modalOverlayRef.current) {
        modalOverlayRef.current.scrollTop = 0;
      }

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.touchAction = originalTouchAction;
      };
    }
  }, [selectedArticle]);

  const [nowTick, setNowTick] = useState<number>(() => Date.now());
  const [playerIndex, setPlayerIndex] = useState(0);
  const [allPlayers, setAllPlayers] = useState<Record<string, any>>(playersDB);

  const spotlightPlayers = useMemo(() => {
    return Object.values(allPlayers).filter(p => Boolean(p.is_spotlight || p.spotlight));
  }, [allPlayers]);

  const activeMatches = useMemo(() => {
    if (matchConfig.no_matches_now) return [];
    const list = [
      matchConfig,
      ...(Array.isArray(matchConfig.extra_matches) ? matchConfig.extra_matches : [])
    ].filter(m => m && m.opponent && m.opponent.trim() !== '');
    return list;
  }, [matchConfig]);

  const getMatchCountdown = (dateStr?: string, timeStr?: string) => {
    const effectiveDate = dateStr || matchConfig.match_date;
    if (!effectiveDate) return null;
    const targetDate = parseMatchDateTime(effectiveDate, timeStr);
    if (!targetDate) return null;
    const diff = targetDate.getTime() - nowTick;
    if (diff <= 0) {
      const elapsedMinutes = Math.floor(-diff / (1000 * 60));
      if (elapsedMinutes <= 120) {
        return { d: 0, h: 0, m: 0, s: 0, isLive: true, isFinished: false };
      }
      return { d: 0, h: 0, m: 0, s: 0, isLive: false, isFinished: true };
    }
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);
    return { d, h, m, s, isLive: false, isFinished: false };
  };

  useEffect(() => {
    // 0. Fetch site content, players & trophies
    fetchSiteContent().then(sc => {
      if (sc) setSiteContent(sc);
    });
    fetchMergedPlayers().then(pls => {
      if (pls && Object.keys(pls).length > 0) setAllPlayers(pls);
    });
    fetchTrophies().then(tList => {
      if (tList && tList.length > 0) setTrophies(tList);
    });

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
    fetchNews().then(data => {
      if (data && data.length > 0) {
        setLatestNews(data.slice(0, 3));
      } else {
        setLatestNews([]);
      }
    });
  }, []);

  // Dynamic countdown tick if matches are active
  useEffect(() => {
    if (matchConfig.no_matches_now || activeMatches.length === 0) {
      return;
    }
    setNowTick(Date.now());
    const interval = setInterval(() => setNowTick(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [matchConfig, activeMatches.length]);

  return (
    <div style={{ flex: 1, marginTop: '80px', overflowX: 'hidden' }}>
      
      {/* 1. Hero Section avec Slider */}
      <section style={{ position: 'relative', height: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'black', overflow: 'hidden' }}>
        <HeroSlider />
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.85) 100%)', zIndex: 2 }} />
        <div className="container" style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, delay: 0.5 }}>
            <span style={{ color: 'var(--clr-primary)', letterSpacing: '5px', textTransform: 'uppercase', fontWeight: 'bold' }}>
              {siteContent.hero_tag || 'CHAQUE ENFANT EST UNIQUE'}
            </span>
            <h1 className="hero-title" style={{ color: 'white', margin: '15px 0', textShadow: '0 10px 30px rgba(0,0,0,0.9)', fontSize: '4.5rem' }}>
              {siteContent.hero_title || 'Condor École de Football'}
            </h1>
            <p style={{ fontSize: '1.4rem', color: '#eee', maxWidth: '700px', margin: '0 auto 2.5rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
              {siteContent.hero_slogan || '"Plus fort, plus haut dans le score !"'}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/contact" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>Nous Rejoindre / S'inscrire <ArrowRight size={18} /></Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Next Match / Session Widget */}
      <section style={{ marginTop: '-50px', marginBottom: '4.5rem', position: 'relative', zIndex: 20 }}>
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
            {matchConfig.no_matches_now || activeMatches.length === 0 ? (
              /* État : Aucun match officiel pour le moment (Zéro donnée mockée) */
              <div style={{ textAlign: 'center', width: '100%', padding: '0.8rem 0' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--clr-primary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem', marginBottom: '8px' }}>
                  <Calendar size={18} /> Calendrier Officiel
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', margin: '4px 0 10px', textTransform: 'uppercase', color: 'var(--clr-black)' }}>
                  Aucun match officiel programmé pour le moment
                </h3>
                <p style={{ color: 'var(--clr-gray)', margin: '0 auto', maxWidth: '680px', fontSize: '1.05rem', lineHeight: 1.5 }}>
                  {siteContent.no_match_text || "Nos équipes sont actuellement en période d'entraînement intensif et de préparation technique. Suivez nos actualités pour être tenus informés des prochaines rencontres officielles !"}
                </p>
              </div>
            ) : (
              /* Match(s) Officiel(s) Réellement Configuré(s) par l'Admin */
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
                {activeMatches.length > 1 && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '10px',
                    paddingBottom: '1rem',
                    borderBottom: '2px solid #f1f5f9'
                  }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'rgba(202, 2, 79, 0.08)',
                      color: 'var(--clr-primary)',
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '0.82rem',
                      fontWeight: '800',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}>
                      <Calendar size={15} /> Programme Officiel du Jour • {activeMatches.length} Matchs
                    </div>
                    {matchConfig.match_date && (
                      <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#475569' }}>
                        Journée du {matchConfig.match_date}
                      </span>
                    )}
                  </div>
                )}

                {activeMatches.map((m, idx) => {
                  const mDate = m.match_date || matchConfig.match_date;
                  const mLoc = m.location || matchConfig.location || 'Parc Sportif Delmas';
                  const mHome = m.home_team || matchConfig.home_team || 'Condor FC';
                  const mHomeLogo = m.home_team_logo || matchConfig.home_team_logo || '/condor_logo_transparent.png';
                  const mTimeLeft = getMatchCountdown(mDate, m.match_time);

                  return (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '2rem',
                        width: '100%',
                        paddingTop: idx > 0 ? '1.8rem' : 0,
                        borderTop: idx > 0 ? '1px solid #e2e8f0' : 'none'
                      }}
                    >
                      {/* Logo Club (Gauche) */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '90px', height: '90px', background: 'var(--clr-gray-light)', borderRadius: '50%', padding: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                        <img src={mHomeLogo} alt={mHome} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                      </div>

                      {/* Infos Match (Centre) */}
                      <div style={{ flex: 1, minWidth: '250px', textAlign: 'center' }}>
                        <div style={{ color: 'var(--clr-primary)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px', letterSpacing: '2px', fontSize: '0.9rem' }}>
                          {m.competition || 'Prochain Match Officiel'}
                        </div>
                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', margin: '5px 0', textTransform: 'uppercase', color: 'var(--clr-black)' }}>
                          {mHome} <span style={{ color: 'var(--clr-primary)' }}>VS</span> {m.opponent}
                        </h3>
                        <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--clr-gray)', marginTop: '8px', justifyContent: 'center', flexWrap: 'wrap', fontSize: '0.95rem' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Calendar size={16} />
                            {mDate}
                            {m.match_time && (!mDate || !mDate.includes('à')) ? ` à ${m.match_time}` : ''}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <MapPin size={16} /> {mLoc}
                          </span>
                        </div>
                      </div>

                      {/* Compte à Rebours ou Statut du Match */}
                      {mTimeLeft ? (
                        mTimeLeft.isLive ? (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                            <div style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '8px',
                              background: '#ca024f',
                              color: '#ffffff',
                              padding: '8px 20px',
                              borderRadius: '30px',
                              fontSize: '0.92rem',
                              fontWeight: '800',
                              letterSpacing: '1px',
                              boxShadow: '0 4px 15px rgba(202, 2, 79, 0.4)'
                            }}>
                              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffffff', display: 'inline-block' }} />
                              MATCH EN COURS · DIRECT
                            </div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--clr-gray)', fontWeight: '600' }}>
                              Coup d'envoi donné à {m.match_time || '14h00'}
                            </span>
                          </div>
                        ) : mTimeLeft.isFinished ? (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#1e293b', color: '#ffffff', padding: '8px 18px', borderRadius: '20px', fontSize: '0.88rem', fontWeight: '700' }}>
                            ⚽ Rencontre Terminée
                          </div>
                        ) : (
                          <div style={{ display: 'flex', gap: '1rem', textAlign: 'center', justifyContent: 'center' }}>
                            {[{ l: 'Jours', v: mTimeLeft.d }, { l: 'Heures', v: mTimeLeft.h }, { l: 'Min', v: mTimeLeft.m }, { l: 'Sec', v: mTimeLeft.s }].map((t, i) => (
                              <div key={i} style={{ minWidth: '55px', background: 'rgba(0,0,0,0.02)', padding: '6px 8px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)' }}>
                                <div style={{ fontSize: '2.2rem', fontFamily: 'var(--font-heading)', color: 'var(--clr-black)', lineHeight: 1, fontWeight: '800' }}>
                                  {t.v.toString().padStart(2, '0')}
                                </div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--clr-gray)', textTransform: 'uppercase', fontWeight: 'bold', marginTop: '3px', letterSpacing: '0.5px' }}>
                                  {t.l}
                                </div>
                              </div>
                            ))}
                          </div>
                        )
                      ) : null}

                      {/* Logo Adversaire (Droite) */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '90px', height: '90px', background: 'var(--clr-gray-light)', borderRadius: '50%', padding: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                        {m.opponent_logo ? (
                          <img src={m.opponent_logo} alt={m.opponent} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                        ) : (
                          <svg viewBox="0 0 24 24" fill="none" stroke="var(--clr-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="rgba(0,0,0,0.05)" />
                            <circle cx="12" cy="11" r="3" />
                            <path d="M12 2v6" />
                            <path d="M12 14v8" />
                          </svg>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* 3. Section À la Une (Actualités Réelles au Format Carré Joueurs) */}
      <section className="section-padding" style={{ paddingTop: '2.5rem' }}>
        <div className="container" style={{ maxWidth: '1240px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ color: 'var(--clr-primary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.85rem' }}>
                Le Journal du Condor
              </span>
              <motion.h2 
                initial={{ opacity: 0, x: -30 }} 
                whileInView={{ opacity: 1, x: 0 }} 
                viewport={{ once: true }} 
                style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', margin: '4px 0 0' }}
              >
                À la Une
              </motion.h2>
            </div>
            <Link href="/news" className="btn btn-outline" style={{ padding: '8px 18px', fontSize: '0.9rem', color: 'var(--clr-black)', borderColor: '#cbd5e1', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span>Toutes les actualités</span>
              <ArrowRight size={14} />
            </Link>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 360px))', justifyContent: 'center', gap: '2.2rem' }}>
            {latestNews.length > 0 ? (
              latestNews.map((news, i) => (
                <div 
                  key={news.id || i} 
                  onClick={() => setSelectedArticle(news)}
                  style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
                >
                  <motion.div 
                    className="condor-news-card"
                    initial={{ opacity: 0, y: 20 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true, margin: "100px" }} 
                    transition={{ duration: 0.35, delay: i * 0.06 }} 
                    style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      borderRadius: '14px', 
                      overflow: 'hidden', 
                      background: 'white', 
                      cursor: 'pointer', 
                      boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                      border: '1px solid #e5e7eb',
                      position: 'relative',
                      height: '100%'
                    }} 
                  >
                    {/* Photo de l'article au format Carré (1:1 comme les fiches joueurs) */}
                    <div 
                      style={{ 
                        position: 'relative', 
                        width: '100%', 
                        aspectRatio: '1 / 1', 
                        background: 'radial-gradient(circle at center, #242533 0%, #0d0d12 100%)', 
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <img 
                        src={news.img || '/condor_logo_transparent.png'} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        alt={news.title} 
                      />
                      <span 
                        style={{ 
                          position: 'absolute', 
                          top: '14px', 
                          left: '14px', 
                          background: 'var(--clr-primary)', 
                          color: 'white', 
                          padding: '5px 12px', 
                          fontSize: '0.74rem', 
                          fontWeight: '800', 
                          textTransform: 'uppercase', 
                          borderRadius: '20px',
                          letterSpacing: '0.8px',
                          boxShadow: '0 4px 12px rgba(202, 2, 79, 0.45)'
                        }}
                      >
                        {news.cat || 'Actualité'}
                      </span>
                    </div>

                    {/* Contenu Texte sous l'image */}
                    <div style={{ padding: '1.4rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <span style={{ color: '#888', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '8px', fontWeight: 'bold' }}>
                          <Calendar size={13} style={{ color: 'var(--clr-primary)' }} /> {formatRelativeTime(news.created_at || news.date)}
                        </span>
                        <h3 
                          style={{ 
                            fontFamily: 'var(--font-heading)', 
                            fontSize: '1.3rem', 
                            margin: '0 0 10px', 
                            color: 'var(--clr-black)', 
                            lineHeight: 1.3,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >
                          {news.title}
                        </h3>
                        <p 
                          style={{ 
                            color: '#555', 
                            fontSize: '0.88rem', 
                            margin: 0, 
                            lineHeight: 1.5,
                            display: '-webkit-box', 
                            WebkitLineClamp: 2, 
                            WebkitBoxOrient: 'vertical', 
                            overflow: 'hidden' 
                          }}
                        >
                          {news.desc_text || news.desc}
                        </p>
                      </div>

                      {/* Bouton "En savoir plus" / "Voir plus" */}
                      <div style={{ paddingTop: '1.2rem', marginTop: '1.2rem', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedArticle(news);
                          }}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: 'var(--clr-primary)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '8px 16px',
                            fontSize: '0.84rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            boxShadow: '0 3px 10px rgba(202, 2, 79, 0.25)',
                            transition: 'opacity 0.2s'
                          }}
                        >
                          <span>En savoir plus</span>
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', background: 'white', padding: '3.5rem 2rem', borderRadius: '16px', textAlign: 'center', border: '1px solid #eee' }}>
                <p style={{ color: 'var(--clr-gray)', fontSize: '1.1rem', margin: 0 }}>Aucune actualité publiée pour le moment. Consultez notre section Actualités pour les dernières annonces du club.</p>
                <Link href="/news" className="btn btn-outline" style={{ marginTop: '1.5rem', color: 'black', borderColor: '#ccc' }}>Consulter les actualités</Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. Joueurs mis en avant (affiché uniquement si au moins un joueur est sélectionné) */}
      {spotlightPlayers.length > 0 && (
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
                    {player.img && !player.img.includes('condor_logo') ? (
                      <img src={player.img} className="player-img" style={{ filter: player.filter, height: '320px' }} alt={player.name} />
                    ) : (
                      <div style={{ height: '320px', background: 'radial-gradient(circle at center, #23232c 0%, #0e0e13 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '30px' }}>
                        <img src={player.img || '/condor_logo_transparent.png'} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', opacity: 0.85, filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.6))' }} alt={player.name} />
                      </div>
                    )}
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
      )}

      {/* 5. Vidéos & Highlights (Connecté à Condor TV) */}
      <section className="section-padding" style={{ background: 'var(--clr-black)', color: 'white' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ color: 'var(--clr-primary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>Condor TV</span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', margin: '5px 0' }}>Dernières Vidéos & Highlights</h2>
            <p style={{ color: '#ccc', maxWidth: '600px', margin: '10px auto 0' }}>Revivez les plus beaux moments de nos équipes et les résumés officiels des matchs.</p>
          </div>

          {videos.length > 0 ? (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
                {videos.slice(0, 3).map(vid => {
                  const thumbSrc = vid.thumbnail || parseVideoUrl(vid.url).thumbnail || '/player_action_1_1780681882713.png';

                  return (
                    <a
                      key={vid.id}
                      href={vid.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                    >
                      <div 
                        style={{ 
                          background: '#1a1a1a', 
                          borderRadius: '16px', 
                          overflow: 'hidden', 
                          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                          border: '1px solid #282828',
                          transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.transform = 'translateY(-6px)';
                          e.currentTarget.style.borderColor = 'var(--clr-primary)';
                          e.currentTarget.style.boxShadow = '0 15px 35px rgba(202, 2, 79, 0.25)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.borderColor = '#282828';
                          e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
                        }}
                      >
                        <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', background: '#0e0e0e', overflow: 'hidden' }}>
                          <img 
                            src={thumbSrc} 
                            alt={vid.title} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                          />
                          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '56px', height: '56px', background: 'rgba(202, 2, 79, 0.9)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 0 20px rgba(202, 2, 79, 0.7)' }}>
                            <Play fill="white" size={24} style={{ marginLeft: '3px' }} />
                          </div>
                        </div>

                        <div style={{ padding: '1.4rem' }}>
                          {vid.created_at && (
                            <div style={{ marginBottom: '8px' }}>
                              <span style={{ color: '#94a3b8', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Clock size={12} /> {formatRelativeTime(vid.created_at)}
                              </span>
                            </div>
                          )}
                          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', margin: '6px 0 8px', color: '#fff', lineHeight: 1.3 }}>
                            {vid.title}
                          </h3>
                          {vid.description && (
                            <p style={{ color: '#aaa', fontSize: '0.88rem', margin: '0 0 12px', lineClamp: 2, WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {vid.description}
                            </p>
                          )}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--clr-primary)', fontWeight: 'bold', fontSize: '0.85rem' }}>
                            Regarder la vidéo <ExternalLink size={14} />
                          </div>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
              <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                <Link href="/tv" className="btn btn-primary" style={{ padding: '12px 28px' }}>
                  Explorer tout Condor TV
                </Link>
              </div>
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
                {siteContent.palmares_title || 'NOTRE PALMARÈS'}
              </h2>
              
              <p style={{ fontSize: '1.1rem', color: '#94a3b8', maxWidth: '680px', margin: '0 auto 2.2rem', lineHeight: 1.6 }}>
                {siteContent.palmares_subtitle || 'Les titres officiels et les distinctions majeures remportés par le Condor FC depuis sa fondation en Mai 2023.'}
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
                <div style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', color: '#ffffff', lineHeight: 1, fontWeight: 'bold' }}>
                  {siteContent.palmares_stat1_val || '05'}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '6px', fontWeight: 'bold' }}>
                  {siteContent.palmares_stat1_lbl || 'Titres & Podiums'}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 0.8rem', borderLeft: '1px solid #22222b' }}>
                <div style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', color: 'var(--clr-primary)', lineHeight: 1, fontWeight: 'bold' }}>
                  {siteContent.palmares_stat2_val || '03'}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '6px', fontWeight: 'bold' }}>
                  {siteContent.palmares_stat2_lbl || 'Titres de Champion'}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 0.8rem', borderLeft: '1px solid #22222b' }}>
                <div style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', color: '#ffffff', lineHeight: 1, fontWeight: 'bold' }}>
                  {siteContent.palmares_stat3_val || '02'}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '6px', fontWeight: 'bold' }}>
                  {siteContent.palmares_stat3_lbl || 'Vice-Champions'}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 0.8rem', borderLeft: '1px solid #22222b' }}>
                <div style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', color: 'var(--clr-primary)', lineHeight: 1, fontWeight: 'bold' }}>
                  {siteContent.palmares_stat4_val || '01'}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '6px', fontWeight: 'bold' }}>
                  {siteContent.palmares_stat4_lbl || 'Triplé Historique'}
                </div>
              </div>
            </div>
          </div>

          {/* SCÈNE DU TROPHÉE SÉLECTIONNÉ */}
          {(() => {
            const trophyList = trophies && trophies.length > 0 ? trophies : DEFAULT_TROPHIES;
            const currentTrophy = trophyList[activeTrophyIndex] || trophyList[0];
            const allTrophiesList = trophyList.map(t => ({
              id: t.id,
              name: t.title,
              year: t.date?.split(' ')?.pop() || '',
              rank: t.rank || '',
              isGold: Boolean(t.isGold ?? t.is_gold),
              image: t.image
            }));

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
                    {/* Colonne Gauche : Trophée ou Photo de Tournoi */}
                    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', justifyContent: 'center' }}>
                      <motion.div
                        key={currentTrophy.id}
                        initial={{ opacity: 0, scale: 0.88, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1, minHeight: '230px', width: '100%' }}
                      >
                        {currentTrophy.image ? (
                          <div style={{ position: 'relative', width: '100%', maxWidth: '320px', height: '230px', borderRadius: '16px', overflow: 'hidden', border: '2px solid rgba(202, 2, 79, 0.5)', boxShadow: '0 20px 45px rgba(0,0,0,0.8), 0 0 35px rgba(202,2,79,0.3)' }}>
                            <img 
                              src={currentTrophy.image} 
                              alt={currentTrophy.title} 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '8px 12px', background: 'linear-gradient(transparent, rgba(0,0,0,0.85))', color: 'white', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Trophy size={14} color="var(--clr-primary)" /> Photo Officielle du Tournoi
                            </div>
                          </div>
                        ) : (
                          renderTrophy(currentTrophy.id, 155, true)
                        )}
                      </motion.div>

                      {/* Plaque Socle du Trophée */}
                      <div 
                        style={{
                          marginTop: '1.2rem',
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
                        <div style={{ fontSize: '0.75rem', letterSpacing: '2.5px', color: 'var(--clr-primary)', fontWeight: 'bold', textTransform: 'uppercase' }}>
                          CONDOR FC
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
                      style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                    >
                      {/* Titre Majeur en Blanc Net */}
                      <h3 
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: 'clamp(2.1rem, 3.8vw, 3rem)',
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
                          onClick={() => setActiveTrophyIndex((prev) => (prev > 0 ? prev - 1 : trophyList.length - 1))}
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
                          0{activeTrophyIndex + 1} / 0{trophyList.length}
                        </span>

                        <button
                          onClick={() => setActiveTrophyIndex((prev) => (prev < trophyList.length - 1 ? prev + 1 : 0))}
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
                          {/* Mini Trophée 3D ou Photo de Tournoi */}
                          <div style={{ height: '90px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '4px auto 12px' }}>
                            {t.image ? (
                              <div style={{ width: '75px', height: '75px', borderRadius: '10px', overflow: 'hidden', border: isActive ? '2px solid var(--clr-primary)' : '1px solid #333', boxShadow: '0 6px 15px rgba(0,0,0,0.6)' }}>
                                <img src={t.image} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              </div>
                            ) : (
                              <div style={{ transform: 'translateY(8px)' }}>
                                {renderTrophy(t.id, 54, false)}
                              </div>
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
      <section style={{ position: 'relative', padding: '6rem 0', color: 'white', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
          <img 
            src={siteContent.terrain_img || "/stadium_hero_1780681869623.png"} 
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.3)' }} 
            alt="Terrain Delmas 77" 
          />
        </div>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'center' }}>
          <motion.div initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}>
            <Landmark size={48} color="white" style={{ marginBottom: '1rem' }} />
            {siteContent.terrain_tag && (
              <span style={{ display: 'block', color: 'var(--clr-primary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.85rem', marginBottom: '6px' }}>
                {siteContent.terrain_tag}
              </span>
            )}
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', margin: '0 0 1rem' }}>
              {siteContent.terrain_title || "Notre Terrain d'Entraînement"}
            </h2>
            <p style={{ fontSize: '1.2rem', color: '#ccc', marginBottom: '2rem', lineHeight: 1.6 }}>
              {siteContent.terrain_desc || "Retrouvez-nous chaque week-end à l'entrée de Delmas 77 (à côté de BIWI). Nos installations permettent un apprentissage structuré et sécurisé pour toutes les tranches d'âge."}
            </p>
            <Link 
              href={siteContent.terrain_btn_link || "/contact"} 
              className="btn btn-primary" 
              style={{ background: 'white', color: 'var(--clr-black)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              {siteContent.terrain_btn_text || "Nous Contacter & Localiser"}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 10. Infinite Marquee Sponsors */}
      <section style={{ padding: '2.5rem 0', background: 'var(--clr-black)', borderTop: '1px solid #333', borderBottom: '1px solid #333', overflow: 'hidden' }}>
        <motion.div 
          animate={{ x: [0, -1200] }} 
          transition={{ repeat: Infinity, duration: 22, ease: 'linear' }}
          style={{ display: 'flex', gap: '6rem', whiteSpace: 'nowrap', width: 'max-content', alignItems: 'center' }}
        >
          {Array(8).fill([
            { name: 'CONDOR ACADEMY', logo: '/condor_logo_transparent.png', showName: true },
            { name: 'DNC', logo: '/logo-dnc.png', showName: false }
          ]).flat().map((sponsor, i) => (
            <div key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '1.2rem' }}>
              <img 
                src={sponsor.logo} 
                alt={sponsor.name} 
                style={{ 
                  height: sponsor.name === 'DNC' ? '54px' : '52px', 
                  width: 'auto', 
                  objectFit: 'contain'
                }} 
              />
              {sponsor.showName && (
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', color: 'white', margin: 0, letterSpacing: '1px' }}>
                  {sponsor.name}
                </h3>
              )}
            </div>
          ))}
        </motion.div>
      </section>

      {/* Modal Lecture Article Complet — Affichage instantané sur la page d'accueil sans redirection */}
      {selectedArticle && (
        <div 
          ref={modalOverlayRef}
          onClick={() => setSelectedArticle(null)}
          style={{
            position: 'fixed',
            inset: 0,
            width: '100vw',
            height: '100dvh',
            background: 'rgba(0, 0, 0, 0.88)',
            backdropFilter: 'blur(8px)',
            zIndex: 999999,
            overflowY: 'auto',
            overscrollBehavior: 'contain',
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-y',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            padding: '24px 16px 48px 16px'
          }}
        >
          <div 
            onClick={e => e.stopPropagation()}
            style={{
              background: '#ffffff',
              maxWidth: '820px',
              width: '100%',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 25px 70px rgba(0, 0, 0, 0.6)',
              position: 'relative',
              margin: '0 auto',
              flexShrink: 0
            }}
          >
            {/* Header Sticky Close Button Bar */}
            <div style={{ position: 'sticky', top: '12px', zIndex: 60, width: '100%', display: 'flex', justifyContent: 'flex-end', height: 0, pointerEvents: 'none' }}>
              <button 
                type="button"
                onClick={() => setSelectedArticle(null)}
                style={{
                  pointerEvents: 'auto',
                  marginRight: '12px',
                  background: 'rgba(0, 0, 0, 0.8)',
                  color: '#ffffff',
                  border: '1.5px solid rgba(255, 255, 255, 0.35)',
                  borderRadius: '50%',
                  width: '42px',
                  height: '42px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  backdropFilter: 'blur(8px)',
                  boxShadow: '0 4px 18px rgba(0, 0, 0, 0.6)',
                  transition: 'background 0.2s, transform 0.2s'
                }}
                aria-label="Fermer la fenêtre"
              >
                <X size={22} strokeWidth={2.5} />
              </button>
            </div>

            {/* Scène Image Complète (objectFit: contain — Aucun rognage, 100% visible) */}
            <div 
              style={{ 
                position: 'relative', 
                width: '100%', 
                background: '#090a0f', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                minHeight: '260px'
              }}
            >
              <img 
                src={selectedArticle.img || '/condor_logo_transparent.png'} 
                alt={selectedArticle.title}
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '520px', 
                  width: 'auto', 
                  height: 'auto', 
                  objectFit: 'contain', 
                  display: 'block' 
                }} 
              />

              {/* Tag Catégorie */}
              <span 
                style={{ 
                  position: 'absolute', 
                  bottom: '16px', 
                  left: '20px', 
                  background: 'var(--clr-primary)', 
                  color: 'white', 
                  padding: '6px 14px', 
                  fontSize: '0.8rem', 
                  fontWeight: '800', 
                  textTransform: 'uppercase', 
                  borderRadius: '6px',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.6)'
                }}
              >
                {selectedArticle.cat || 'Club'}
              </span>
            </div>

            {/* Corps de l'Article (défile harmonieusement avec l'image) */}
            <div style={{ padding: '2rem 2.2rem' }}>
              <span style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Calendar size={14} style={{ color: 'var(--clr-primary)' }} /> Publié : {formatRelativeTime(selectedArticle.created_at || selectedArticle.date)}
              </span>

              <h2 
                style={{ 
                  fontFamily: 'var(--font-heading)', 
                  fontSize: '2.1rem', 
                  color: 'var(--clr-black)', 
                  margin: '0 0 1.5rem', 
                  lineHeight: 1.25 
                }}
              >
                {selectedArticle.title}
              </h2>

              <div 
                style={{ 
                  fontSize: '1.05rem', 
                  color: '#334155', 
                  lineHeight: 1.75, 
                  whiteSpace: 'pre-line',
                  wordBreak: 'break-word'
                }}
              >
                {selectedArticle.desc_text || selectedArticle.desc}
              </div>

              {/* Pied de l'article avec bouton fermer */}
              <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Condor École de Football — Communication Officielle</span>
                <button
                  type="button"
                  onClick={() => setSelectedArticle(null)}
                  className="btn btn-outline"
                  style={{ padding: '8px 22px', fontSize: '0.88rem', color: '#1e293b', borderColor: '#cbd5e1' }}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
