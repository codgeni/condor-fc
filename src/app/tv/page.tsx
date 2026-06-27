"use client";

import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

export default function CondorTV() {
  const VideoCard = ({ img, time, title, tag }: any) => (
    <motion.div 
      initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      whileHover={{ scale: 1.05 }} style={{ cursor: 'pointer' }}
    >
      <div style={{ position: 'relative', paddingTop: '56.25%', background: '#222', borderRadius: '12px', overflow: 'hidden' }}>
        <img src={img} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '50px', height: '50px', background: 'rgba(230,0,0,0.8)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Play fill="white" size={20} style={{ marginLeft: '3px' }} />
        </div>
        <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.8)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>{time}</div>
        {tag && <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'var(--clr-primary)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>{tag}</div>}
      </div>
      <h3 style={{ fontSize: '1.2rem', margin: '15px 0 5px', lineHeight: 1.4 }}>{title}</h3>
    </motion.div>
  );

  return (
    <div style={{ flex: 1, marginTop: '80px', background: 'var(--clr-black)', color: 'white', overflowX: 'hidden' }}>
      
      {/* 1. Live Event Hero */}
      <section className="section-padding" style={{ paddingTop: '2rem' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
            <div style={{ position: 'relative', width: '100%', paddingTop: '45%', background: '#111', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }}>
              <img src="/player_action_2_1780681894021.png" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
              <div style={{ position: 'absolute', top: '30px', left: '30px', background: 'red', color: 'white', padding: '5px 15px', borderRadius: '4px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', animation: 'pulse 2s infinite' }}>
                <div style={{ width: '10px', height: '10px', background: 'white', borderRadius: '50%' }}></div> EN DIRECT
              </div>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100px', height: '100px', background: 'var(--clr-primary)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', boxShadow: '0 0 40px rgba(230,0,0,0.6)' }}>
                <Play fill="white" size={40} style={{ marginLeft: '10px' }} />
              </div>
              <div style={{ position: 'absolute', bottom: '30px', left: '30px', maxWidth: '800px' }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '3.5rem', marginBottom: '10px', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>Conférence de Presse</h2>
                <p style={{ fontSize: '1.2rem', textShadow: '0 2px 10px rgba(0,0,0,0.8)', display: 'none' /* hidden on very small screens optionally */ }}>Regardez en direct l'entraîneur s'adresser aux médias avant le choc de la Ligue des Champions.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Extended Highlights */}
      <section className="section-padding" style={{ borderTop: '1px solid #222' }}>
        <div className="container">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            Résumés des Matchs
            <span style={{ fontSize: '1rem', color: 'var(--clr-primary)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Voir Tout</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            {[1, 2, 3].map((i) => (
              <VideoCard key={i} img="/player_action_1_1780681882713.png" time="12:45" title={`Résumé long : Journée ${24-i}`} tag="Résumé" />
            ))}
          </div>
        </div>
      </section>

      {/* 3. Behind The Scenes / Docs */}
      <section className="section-padding" style={{ background: '#111' }}>
        <div className="container">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: '2rem' }}>En Coulisses & Docs</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
            {[
              { t: 'Entraînement : Séances de Rondo intenses', time: '08:20' },
              { t: 'Tunnel Cam : La Victoire du Derby', time: '15:10' },
              { t: 'Un Jour dans la Vie : Espoirs de l\'Académie', time: '22:05' },
              { t: 'En Route vers la Guérison : Le retour du Capitaine', time: '18:40' }
            ].map((v, i) => (
              <VideoCard key={i} img="/stadium_hero_1780681869623.png" time={v.time} title={v.t} tag="Exclusif" />
            ))}
          </div>
        </div>
      </section>



      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
      `}} />
    </div>
  );
}
