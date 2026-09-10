"use client";

import { motion } from 'framer-motion';

const matches = [
  { date: "12 Juin", time: "20:00 CET", match: "Condor FC vs City United", comp: "Match de Championnat | L'Arène Condor", isHome: true },
  { date: "18 Juin", time: "18:30 CET", match: "Athletic Club vs Condor FC", comp: "Match de Championnat | À l'extérieur", isHome: false },
  { date: "24 Juin", time: "21:00 CET", match: "Condor FC vs Sporting", comp: "Coupe d'Europe | L'Arène Condor", isHome: true },
];

export default function Tickets() {
  return (
    <div style={{ flex: 1, marginTop: '80px' }}>
      
      {/* Page Header */}
      <section className="section-padding bg-black text-white" style={{ 
        backgroundImage: "linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url('/stadium_hero_1780681869623.png')", 
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        padding: '100px 0',
        textAlign: 'center'
      }}>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
          <h1 className="section-title text-white">Billetterie</h1>
          <p style={{ fontSize: '1.2rem', color: '#ddd', maxWidth: '600px', margin: '0 auto' }}>Réservez votre place à l'Arène Condor. Vivez la magie en direct.</p>
        </motion.div>
      </section>

      {/* Fixtures List */}
      <section className="section-padding">
        <div className="container">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '1.5rem', textTransform: 'uppercase' }}>Prochains Matchs</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {matches.map((match, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                  padding: '1.5rem', border: '1px solid var(--clr-gray-light)', 
                  borderRadius: '8px', background: 'var(--clr-white)',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
                }}
                whileHover={{ scale: 1.01 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                  <div style={{ textAlign: 'center', borderRight: '1px solid #eee', paddingRight: '2rem' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--clr-primary)' }}>{match.date}</span>
                    <br />
                    <span style={{ color: 'var(--clr-gray)' }}>{match.time}</span>
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '0' }}>{match.match}</h3>
                    <p style={{ color: 'var(--clr-gray)', margin: '0' }}>{match.comp}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {match.isHome ? (
                    <>
                      <button className="btn btn-outline" style={{ color: 'var(--clr-black)', borderColor: 'var(--clr-black)' }}>VIP</button>
                      <button className="btn btn-primary">Acheter des Billets</button>
                    </>
                  ) : (
                    <button className="btn btn-outline" style={{ color: 'var(--clr-black)', borderColor: 'var(--clr-black)' }}>Déplacement</button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
