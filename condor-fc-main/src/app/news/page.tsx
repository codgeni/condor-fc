"use client";

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function News() {
  return (
    <div style={{ flex: 1, marginTop: '80px', overflowX: 'hidden' }}>
      
      {/* Page Header */}
      <section 
        className="section-padding bg-black text-white" 
        style={{ 
          textAlign: 'center', 
          position: 'relative', 
          overflow: 'hidden',
          padding: '120px 0 80px',
          background: 'linear-gradient(rgba(17,17,17,0.7), rgba(17,17,17,0.9)), url(/news_hero.png) center/cover no-repeat'
        }}
      >
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }} style={{ position: 'relative', zIndex: 10 }}>
          <h1 className="section-title text-white">Actualités Officielles</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--clr-gray)', maxWidth: '600px', margin: '0 auto' }}>La source unique pour toutes les dernières nouvelles, résumés de matchs et communiqués du club.</p>
        </motion.div>
      </section>

      {/* 1. Breaking News Hero */}
      <section className="section-padding" style={{ paddingTop: '2rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem' }}>
            <motion.div 
              style={{ gridColumn: 'span 8', position: 'relative', borderRadius: '12px', overflow: 'hidden', height: '600px', cursor: 'pointer' }}
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
            >
              <img src="/player_action_1_1780681882713.png" alt="Dernière Heure" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.9))', padding: '3rem', color: 'white' }}>
                <span style={{ background: 'var(--clr-primary)', color: 'white', padding: '5px 15px', fontSize: '0.9rem', textTransform: 'uppercase', fontWeight: 'bold', borderRadius: '4px' }}>Dernière Heure</span>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '3.5rem', margin: '15px 0' }}>Le Condor FC décroche une victoire cruciale à l'extérieur</h2>
                <p style={{ color: '#ccc', fontSize: '1.2rem' }}>Une performance époustouflante en seconde période assure les trois points sur la route.</p>
              </div>
            </motion.div>

            <div style={{ gridColumn: 'span 4', display: 'grid', gridTemplateRows: '1fr 1fr', gap: '2rem' }}>
              {[
                { cat: 'Transferts', title: 'Nouvelle recrue officiellement dévoilée à l\'Arène', img: '/condor_jersey_1780681923538.png' },
                { cat: 'Entraîneur', title: 'Conférence de presse : "Nous sommes prêts pour la Ligue des Champions"', img: '/player_action_2_1780681894021.png' }
              ].map((news, i) => (
                <motion.div 
                  key={i} style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', minHeight: '200px' }}
                  initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 + (i * 0.2) }}
                  whileHover={{ scale: 1.03 }}
                >
                  <img src={news.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.9))', padding: '1.5rem', color: 'white' }}>
                    <span style={{ color: 'var(--clr-primary)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 'bold' }}>{news.cat}</span>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', margin: '5px 0 0' }}>{news.title}</h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. First Team Updates */}
      <section className="section-padding bg-gray">
        <div className="container">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: '2rem', borderLeft: '5px solid var(--clr-primary)', paddingLeft: '15px' }}>Équipe Première</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {[
              "Le Onze de départ annoncé pour le match de ce soir",
              "Galerie d'entraînement : Derniers préparatifs avant la coupe",
              "Le titre de Joueur du Mois décerné au Capitaine",
              "Résumé du Match : Condor FC 3 - 0 Sporting"
            ].map((title, i) => (
              <motion.div 
                key={i} style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', cursor: 'pointer' }}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(0,0,0,0.1)' }}
              >
                <div style={{ height: '200px', background: '#ddd' }}>
                  <img src="/player_action_1_1780681882713.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ color: 'var(--clr-gray)', fontSize: '0.8rem', marginBottom: '10px' }}>Il y a 2 Heures</div>
                  <h4 style={{ fontSize: '1.2rem', margin: 0 }}>{title}</h4>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Academy & Youth */}
      <section className="section-padding">
        <div className="container">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: '2rem', borderLeft: '5px solid var(--clr-primary)', paddingLeft: '15px' }}>Académie & Jeunesse</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <img src="/stadium_hero_1780681869623.png" style={{ width: '100%', borderRadius: '12px', filter: 'grayscale(0.3)' }} />
            </motion.div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', justifyContent: 'center' }}>
              {[
                "Les U19 remportent une victoire tardive en Youth League",
                "Le directeur de l'Académie sur la nouvelle génération de talents",
                "Trois joueurs U17 appelés à l'entraînement de l'équipe première"
              ].map((title, i) => (
                <div key={i} style={{ borderBottom: '1px solid var(--clr-gray-light)', paddingBottom: '1.5rem', cursor: 'pointer' }}>
                  <span style={{ color: 'var(--clr-primary)', fontWeight: 'bold', fontSize: '0.9rem' }}>DÉVELOPPEMENT DES JEUNES</span>
                  <h3 style={{ fontSize: '1.5rem', margin: '10px 0' }}>{title}</h3>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--clr-black)', fontWeight: 'bold' }}>Lire Plus <ArrowRight size={16} /></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Medical Center & Statements */}
      <section className="section-padding bg-black text-white">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
            
            {/* Medical */}
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: '2rem', color: 'white' }}>Centre Médical</h2>
              <div style={{ background: '#111', padding: '2rem', borderRadius: '12px', borderLeft: '4px solid red' }}>
                <span style={{ color: 'red', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.9rem' }}>Bilan Médical Officiel</span>
                <h3 style={{ fontSize: '1.5rem', margin: '10px 0' }}>Point sur la blessure de notre milieu de terrain</h3>
                <p style={{ color: '#aaa', lineHeight: 1.6 }}>Suite aux examens réalisés aujourd'hui par les Services Médicaux du Condor FC, notre joueur a été diagnostiqué avec une élongation musculaire au mollet gauche. Son rétablissement sera suivi de près.</p>
              </div>
            </motion.div>

            {/* Statements */}
            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: '2rem', color: 'white' }}>Communiqués du Club</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  "Annonce officielle concernant la billetterie",
                  "Le Condor FC annonce un nouveau partenariat technologique mondial",
                  "Résultats financiers pour la saison 2025/2026"
                ].map((title, i) => (
                  <motion.div key={i} whileHover={{ x: 10 }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 + (i * 0.1) }} style={{ background: '#111', padding: '1.5rem', borderRadius: '8px', cursor: 'pointer', border: '1px solid #333' }}>
                    <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{title}</h4>
                    <div style={{ color: 'var(--clr-gray)', fontSize: '0.8rem', marginTop: '10px' }}>Corporate</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </section>

    </div>
  );
}
