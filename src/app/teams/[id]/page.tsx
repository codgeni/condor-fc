"use client";

import { motion } from 'framer-motion';
import { use } from 'react';
import { playersDB } from '@/lib/playersDB';
import { Trophy, Activity, Medal, User } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

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
                <span className="player-badge-cat">{categoriesDisplay}</span>
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

        {/* 4. Palmarès */}
        <section style={{ paddingBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>
            <Trophy color="var(--clr-primary)" /> Palmarès & Récompenses
          </h2>
          <div className="player-palmares-grid">
            <motion.div 
              whileHover={{ scale: 1.03 }}
              style={{ background: 'white', padding: '2rem', borderRadius: '12px', textAlign: 'center', border: '1px solid #eee', boxShadow: '0 5px 15px rgba(0,0,0,0.02)' }}
            >
              <Medal size={48} color="#ffd700" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', margin: 0, color: 'var(--clr-black)' }}>x {player.honours1 || 1}</h3>
              <p style={{ color: 'var(--clr-gray)', textTransform: 'uppercase', fontSize: '0.9rem', fontWeight: 'bold' }}>Titres de Champion</p>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.03 }}
              style={{ background: 'white', padding: '2rem', borderRadius: '12px', textAlign: 'center', border: '1px solid #eee', boxShadow: '0 5px 15px rgba(0,0,0,0.02)' }}
            >
              <Trophy size={48} color="#c0c0c0" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', margin: 0, color: 'var(--clr-black)' }}>x {player.honours2 || 1}</h3>
              <p style={{ color: 'var(--clr-gray)', textTransform: 'uppercase', fontSize: '0.9rem', fontWeight: 'bold' }}>Tournois Majeurs</p>
            </motion.div>
          </div>
        </section>

      </div>
    </div>
  );
}
