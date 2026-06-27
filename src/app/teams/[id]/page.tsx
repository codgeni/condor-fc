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
  const [player, setPlayer] = useState<any>(null);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const { data } = await supabase
          .from('players')
          .select('*')
          .eq('id', unwrappedParams.id)
          .single();
        if (data) {
          setPlayer(data);
        } else {
          setPlayer(playersDB[unwrappedParams.id] || null);
        }
      } catch (err) {
        console.warn("Supabase fetch failed, falling back to local DB", err);
        setPlayer(playersDB[unwrappedParams.id] || null);
      }
    };
    fetchPlayer();
  }, [unwrappedParams.id]);

  if (!player) {
    return (
      <div style={{ marginTop: '100px', textAlign: 'center', padding: '50px' }}>
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

  return (
    <div style={{ flex: 1, marginTop: '80px', background: '#f8f9fa', minHeight: '100vh', color: 'var(--clr-black)' }}>
      
      {/* 1. Zone Photo & Informations Personnelles */}
      <section style={{ background: 'linear-gradient(135deg, #111 0%, #1a020b 100%)', color: 'white', padding: '60px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
            
            {/* Grande photo officielle */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <div style={{ position: 'relative', width: '100%', maxWidth: '380px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 15px 35px rgba(0,0,0,0.5)', border: '4px solid var(--clr-primary)' }}>
                <img 
                  src={player.img} 
                  alt={player.name} 
                  style={{ width: '100%', height: '480px', objectFit: 'cover', objectPosition: 'top', filter: player.filter }} 
                />
                <div style={{ position: 'absolute', bottom: '20px', left: '20px', background: 'var(--clr-primary)', color: 'white', fontFamily: 'var(--font-heading)', fontSize: '3rem', fontWeight: 'bold', padding: '5px 20px', borderRadius: '8px', lineHeight: 1 }}>
                  #{player.num}
                </div>
              </div>
            </motion.div>

            {/* Fiche d'identité à proximité */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span style={{ color: 'var(--clr-primary)', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 'bold', fontSize: '0.9rem' }}>Fiche d'identité</span>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '3.5rem', margin: '5px 0 0', textTransform: 'uppercase', lineHeight: 1.1 }}>{player.name}</h1>
              <div style={{ fontSize: '1.2rem', color: 'var(--clr-gray)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2rem' }}>{player.pos} | {player.category}</div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
                  <span style={{ color: '#aaa', fontSize: '0.9rem', textTransform: 'uppercase' }}>Nom complet</span>
                  <span style={{ fontWeight: 'bold' }}>{player.name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
                  <span style={{ color: '#aaa', fontSize: '0.9rem', textTransform: 'uppercase' }}>Numéro</span>
                  <span style={{ fontWeight: 'bold', color: 'var(--clr-primary)' }}>{player.num}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
                  <span style={{ color: '#aaa', fontSize: '0.9rem', textTransform: 'uppercase' }}>Poste</span>
                  <span style={{ fontWeight: 'bold' }}>{player.pos}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
                  <span style={{ color: '#aaa', fontSize: '0.9rem', textTransform: 'uppercase' }}>Date de naissance</span>
                  <span style={{ fontWeight: 'bold' }}>{player.dob}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
                  <span style={{ color: '#aaa', fontSize: '0.9rem', textTransform: 'uppercase' }}>Lieu de naissance</span>
                  <span style={{ fontWeight: 'bold' }}>{pob}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
                  <span style={{ color: '#aaa', fontSize: '0.9rem', textTransform: 'uppercase' }}>Taille</span>
                  <span style={{ fontWeight: 'bold' }}>{player.height}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
                  <span style={{ color: '#aaa', fontSize: '0.9rem', textTransform: 'uppercase' }}>Poids</span>
                  <span style={{ fontWeight: 'bold' }}>{player.weight}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
                  <span style={{ color: '#aaa', fontSize: '0.9rem', textTransform: 'uppercase' }}>Pied fort</span>
                  <span style={{ fontWeight: 'bold' }}>{foot}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '4px' }}>
                  <span style={{ color: '#aaa', fontSize: '0.9rem', textTransform: 'uppercase' }}>Nationalité</span>
                  <span style={{ fontWeight: 'bold' }}>{nationality}</span>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
            
            <motion.div whileHover={{ y: -5 }} style={{ background: 'white', padding: '2rem', borderRadius: '12px', textAlign: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.02)', border: '1px solid #eee' }}>
              <div style={{ fontSize: '3.5rem', fontFamily: 'var(--font-heading)', color: 'var(--clr-primary)', fontWeight: 'bold', lineHeight: 1 }}>{player.matches}</div>
              <div style={{ color: 'var(--clr-gray)', fontSize: '0.9rem', textTransform: 'uppercase', fontWeight: 'bold', marginTop: '10px' }}>Matchs Joués</div>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} style={{ background: 'white', padding: '2rem', borderRadius: '12px', textAlign: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.02)', border: '1px solid #eee' }}>
              <div style={{ fontSize: '3.5rem', fontFamily: 'var(--font-heading)', color: 'var(--clr-primary)', fontWeight: 'bold', lineHeight: 1 }}>{player.goals || player.stat2val || 0}</div>
              <div style={{ color: 'var(--clr-gray)', fontSize: '0.9rem', textTransform: 'uppercase', fontWeight: 'bold', marginTop: '10px' }}>{player.stat2lbl === "Arrêts" ? "Arrêts" : "Buts"}</div>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} style={{ background: 'white', padding: '2rem', borderRadius: '12px', textAlign: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.02)', border: '1px solid #eee' }}>
              <div style={{ fontSize: '3.5rem', fontFamily: 'var(--font-heading)', color: 'var(--clr-primary)', fontWeight: 'bold', lineHeight: 1 }}>{player.assists}</div>
              <div style={{ color: 'var(--clr-gray)', fontSize: '0.9rem', textTransform: 'uppercase', fontWeight: 'bold', marginTop: '10px' }}>Passes Décisives</div>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
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
