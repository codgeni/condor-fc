"use client";

import { motion } from 'framer-motion';
import { use } from 'react';
import { playersDB } from '@/lib/playersDB';
import { Trophy, Activity, Medal, User, Award, Star } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { ChaleChaleTripleCup, FlagDaySilverCup, RealMadridStarShield } from '@/components/Trophies';

export default function PlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const [player, setPlayer] = useState<any>(playersDB[unwrappedParams.id] || null);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const { data } = await supabase
          .from('players')
          .select('*')
          .eq('id', unwrappedParams.id)
          .single();
        if (data) {
          setPlayer({
            ...playersDB[unwrappedParams.id],
            ...data,
            detailImg: data.detail_img || data.detailImg || playersDB[unwrappedParams.id]?.detailImg || data.img
          });
        } else {
          setPlayer(playersDB[unwrappedParams.id] || null);
        }
      } catch (err) {
        console.warn("Supabase fetch failed, falling back to local DB", err);
        setPlayer(playersDB[unwrappedParams.id] || null);
      } finally {
        setHasAttemptedFetch(true);
      }
    };
    fetchPlayer();
  }, [unwrappedParams.id]);

  if (!player) {
    if (!hasAttemptedFetch) {
      return (
        <div style={{ flex: 1, marginTop: '80px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 80px)', background: '#f5f7fa', color: 'black' }}>
          <h3>Chargement de la fiche joueur...</h3>
        </div>
      );
    }
    return (
      <div style={{ marginTop: '120px', textAlign: 'center', padding: '50px' }}>
        <h1>Joueur Introuvable</h1>
        <Link href="/teams" className="btn btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>Retour aux Équipes</Link>
      </div>
    );
  }

  // Fallback defaults for personal info if not defined in playersDB
  const pob = player.pob || "Port-au-Prince, Haïti";
  const foot = player.foot || (parseInt(player.id) % 3 === 0 ? "Gauche" : "Droit");
  const nationality = player.nationality || "Haïtienne";
  const bio = player.bio || `Joueur talentueux et déterminé, ${player.name} fait partie intégrante de la catégorie ${player.category || "U17"} du Condor FC. Depuis son arrivée, il s'est distingué par sa discipline, sa rigueur aux entraînements et son sens tactique. Son évolution constante au sein du club laisse présager un avenir brillant dans le football haïtien.`;

  const categoriesDisplay = Array.isArray(player.categories)
    ? player.categories.join(' • ')
    : (player.category || "U17");

  // Picture: In description/player page, exclusively show the 2nd picture (celebration picture)
  const playerPhoto = player.detailImg || player.img;

  return (
    <div style={{ flex: 1, marginTop: '80px', background: '#f8f9fa', minHeight: '100vh', color: 'var(--clr-black)' }}>
      
      {/* 1. Zone Photo & Informations Personnelles */}
      <section className="player-detail-hero">
        <div className="container">
          <div className="player-hero-grid">
            
            {/* Grande photo officielle (Photo 2 / Célébration) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <div className="player-photo-card">
                <img 
                  src={playerPhoto} 
                  alt={player.name} 
                  className="player-photo-img"
                  style={{ filter: player.filter }} 
                />
                <div className="player-photo-number">
                  #{player.num}
                </div>
              </div>
            </motion.div>

            {/* Fiche d'identité à proximité */}
            <motion.div
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="player-header-top">
                <span className="player-badge-id">Fiche d'identité</span>
              </div>
              
              <h1 className="player-profile-name">{player.name}</h1>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <span className="player-profile-pos-tag">{player.pos}</span>
              </div>
              
              <div className="player-identity-card">
                <div className="player-info-row">
                  <span className="player-info-label">Nom complet</span>
                  <span className="player-info-val">{player.name}</span>
                </div>
                <div className="player-info-row">
                  <span className="player-info-label">Numéro</span>
                  <span className="player-info-val player-info-num">#{player.num}</span>
                </div>
                <div className="player-info-row">
                  <span className="player-info-label">Poste</span>
                  <span className="player-info-val" style={{ color: '#ff5260' }}>{player.pos}</span>
                </div>
                <div className="player-info-row">
                  <span className="player-info-label">Catégorie</span>
                  <span className="player-info-val">{categoriesDisplay}</span>
                </div>
                <div className="player-info-row">
                  <span className="player-info-label">Lieu de naissance</span>
                  <span className="player-info-val">{pob}</span>
                </div>
                {player.height ? (
                  <div className="player-info-row">
                    <span className="player-info-label">Taille</span>
                    <span className="player-info-val">{player.height}</span>
                  </div>
                ) : null}
                {player.weight ? (
                  <div className="player-info-row">
                    <span className="player-info-label">Poids</span>
                    <span className="player-info-val">{player.weight}</span>
                  </div>
                ) : null}
                <div className="player-info-row">
                  <span className="player-info-label">Pied fort</span>
                  <span className="player-info-val">{foot}</span>
                </div>
                <div className="player-info-row">
                  <span className="player-info-label">Nationalité</span>
                  <span className="player-info-val">{nationality}</span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Zone de contenu blanche */}
      <div className="container" style={{ padding: '4rem var(--sp-lg)' }}>
        
        {/* 2. Statistiques */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>
            <Activity color="var(--clr-primary)" /> Statistiques de la Saison
          </h2>
          <div className="player-stats-grid">
            
            <motion.div whileHover={{ y: -5 }} style={{ background: 'white', padding: '1.75rem 1rem', borderRadius: '12px', textAlign: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.02)', border: '1px solid #eee' }}>
              <div style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', color: 'var(--clr-primary)', fontWeight: 'bold', lineHeight: 1 }}>{player.matches}</div>
              <div style={{ color: 'var(--clr-gray)', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 'bold', marginTop: '10px' }}>Matchs Joués</div>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} style={{ background: 'white', padding: '1.75rem 1rem', borderRadius: '12px', textAlign: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.02)', border: '1px solid #eee' }}>
              <div style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', color: 'var(--clr-primary)', fontWeight: 'bold', lineHeight: 1 }}>{player.goals || player.stat2val || 0}</div>
              <div style={{ color: 'var(--clr-gray)', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 'bold', marginTop: '10px' }}>{player.stat2lbl === "Arrêts" ? "Arrêts" : "Buts"}</div>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} style={{ background: 'white', padding: '1.75rem 1rem', borderRadius: '12px', textAlign: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.02)', border: '1px solid #eee' }}>
              <div style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', color: 'var(--clr-primary)', fontWeight: 'bold', lineHeight: 1 }}>{player.assists}</div>
              <div style={{ color: 'var(--clr-gray)', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 'bold', marginTop: '10px' }}>Passes Décisives</div>
            </motion.div>

          </div>
        </section>

        {/* 3. Biographie */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>
            <User color="var(--clr-primary)" /> Biographie
          </h2>
          <div style={{ background: 'white', padding: '2.5rem', borderRadius: '12px', boxShadow: '0 5px 15px rgba(0,0,0,0.02)', border: '1px solid #eee', lineHeight: 1.8, fontSize: '1.1rem', color: '#444' }}>
            <p>{bio}</p>
          </div>
        </section>

        {/* 4. Palmarès & Salle des Trophées Officielle (Design Club : Blanc, Rouge, Noir, Gris) */}
        <section style={{ paddingBottom: '3rem' }}>
          <div 
            style={{ 
              background: '#0B0B0E',
              borderRadius: '24px',
              padding: 'clamp(2rem, 4vw, 3.5rem)',
              border: '1px solid #22222b',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* En-tête sobre et officiel */}
            <div style={{ textAlign: 'center', marginBottom: '2.5rem', position: 'relative', zIndex: 1 }}>
              <h2 
                style={{ 
                  fontFamily: 'var(--font-heading)', 
                  fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', 
                  margin: '4px 0 10px', 
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  color: '#ffffff'
                }}
              >
                Palmarès de {player.name}
              </h2>

              <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.5 }}>
                Distinctions, titres et trophées majeurs remportés sous les couleurs du Condor FC.
              </p>
            </div>

            {/* Vitrine des 3 Trophées sur Socles du Club */}
            <div 
              style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
                gap: '2rem',
                position: 'relative',
                zIndex: 1
              }}
            >
              {/* 1. Trophée Or : Titres de Champion */}
              <motion.div 
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                style={{
                  background: '#121217',
                  borderRadius: '18px',
                  border: '1px solid #22222b',
                  padding: '3.2rem 1.5rem 2.4rem',
                  textAlign: 'center',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.6)',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {/* Liseré supérieur Rouge Condor */}
                <div style={{ position: 'absolute', top: 0, left: '25%', right: '25%', height: '3px', background: 'linear-gradient(90deg, transparent, var(--clr-primary), transparent)' }} />

                <div style={{ margin: '1.2rem auto 1.4rem', minHeight: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'translateY(14px)' }}>
                  <ChaleChaleTripleCup size={105} glow={false} withReflection={true} />
                </div>

                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', fontWeight: '900', color: '#ffffff', lineHeight: 1, margin: '10px 0 4px' }}>
                  x {player.honours1 || 1}
                </div>

                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', color: '#ffffff', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Titres de Champion
                </h3>

                <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: 0, lineHeight: 1.4 }}>
                  Sacre suprême en tournois officiels avec les équipes du Condor FC.
                </p>
              </motion.div>

              {/* 2. Trophée Argent : Tournois Majeurs & Podiums */}
              <motion.div 
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                style={{
                  background: '#121217',
                  borderRadius: '18px',
                  border: '1px solid #22222b',
                  padding: '3.2rem 1.5rem 2.4rem',
                  textAlign: 'center',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.6)',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {/* Liseré supérieur Blanc */}
                <div style={{ position: 'absolute', top: 0, left: '25%', right: '25%', height: '3px', background: 'linear-gradient(90deg, transparent, #ffffff, transparent)' }} />

                <div style={{ margin: '1.2rem auto 1.4rem', minHeight: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'translateY(14px)' }}>
                  <FlagDaySilverCup size={105} glow={false} withReflection={true} />
                </div>

                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', fontWeight: '900', color: '#ffffff', lineHeight: 1, margin: '10px 0 4px' }}>
                  x {player.honours2 || 1}
                </div>

                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', color: '#ffffff', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Finales & Podiums Majeurs
                </h3>

                <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: 0, lineHeight: 1.4 }}>
                  Parcours de haut niveau et médailles d'argent en compétitions nationales.
                </p>
              </motion.div>

              {/* 3. Écusson d'Excellence : Promotion Roster Élite */}
              <motion.div 
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                style={{
                  background: '#121217',
                  borderRadius: '18px',
                  border: '1px solid #22222b',
                  padding: '3.2rem 1.5rem 2.4rem',
                  textAlign: 'center',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.6)',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {/* Liseré supérieur Rouge Condor */}
                <div style={{ position: 'absolute', top: 0, left: '25%', right: '25%', height: '3px', background: 'linear-gradient(90deg, transparent, var(--clr-primary), transparent)' }} />

                <div style={{ margin: '1.2rem auto 1.4rem', minHeight: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'translateY(14px)' }}>
                  <RealMadridStarShield size={105} glow={false} />
                </div>

                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.9rem', fontWeight: '900', color: 'var(--clr-primary)', lineHeight: 1, margin: '14px 0 4px' }}>
                  CERTIFIÉ
                </div>

                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', color: '#ffffff', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Roster Officiel Condor FC
                </h3>

                <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: 0, lineHeight: 1.4 }}>
                  Homologation officielle de la direction technique pour l'excellence et l'esprit d'équipe.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
