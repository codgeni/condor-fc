"use client";

import { motion } from 'framer-motion';

export default function Club() {
  return (
    <div style={{ flex: 1, marginTop: '80px', overflowX: 'hidden' }}>
      
      {/* 1. Values & Vision Hero */}
      <section 
        className="section-padding bg-black text-white" 
        style={{ 
          textAlign: 'center', 
          padding: '100px 0', 
          position: 'relative', 
          overflow: 'hidden',
          background: 'linear-gradient(rgba(17,17,17,0.7), rgba(17,17,17,0.9)), url(/club_hero.png) center/cover no-repeat'
        }}
      >
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }} style={{ position: 'relative', zIndex: 10 }}>
          <img src="/condor_logo_transparent.png" style={{ width: '150px', margin: '0 auto 2rem', borderRadius: '50%' }} />
          <h1 className="hero-title" style={{ color: 'white' }}>Plus Qu'un Club.</h1>
          <p style={{ fontSize: '1.5rem', color: 'var(--clr-gray)', maxWidth: '800px', margin: '0 auto', lineHeight: 1.6 }}>Depuis 1902, le Condor FC est un symbole d'excellence, de résilience et de communauté. Nous ne jouons pas seulement au football ; nous inspirons des générations.</p>
        </motion.div>
      </section>

      {/* 2. Interactive History Timeline */}
      <section className="section-padding bg-gray">
        <div className="container">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', marginBottom: '3rem', textAlign: 'center' }}>Le Parcours</h2>
          <div style={{ position: 'relative', borderLeft: '4px solid var(--clr-primary)', marginLeft: '20px', paddingLeft: '40px', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {[
              { y: '1902', t: 'La Fondation', d: 'Un groupe de travailleurs locaux forme le Condor FC, établissant les couleurs rouge et noir.' },
              { y: '1955', t: 'Premier Titre National', d: 'Le club remporte son premier trophée majeur lors d\'une finale dramatique.' },
              { y: '1998', t: 'La Gloire Européenne', d: 'Le Condor FC choque le continent en remportant la Ligue des Champions.' },
              { y: '2024', t: 'La Nouvelle Arène Condor', d: 'Ouverture du stade à la pointe de la technologie d\'une capacité de 75 000 places.' }
            ].map((era, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-50px', top: 0, width: '16px', height: '16px', background: 'var(--clr-primary)', borderRadius: '50%', border: '4px solid white' }}></div>
                <h3 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', color: 'var(--clr-primary)', margin: 0 }}>{era.y}</h3>
                <h4 style={{ fontSize: '1.5rem', margin: '5px 0' }}>{era.t}</h4>
                <p style={{ color: 'var(--clr-black-light)', fontSize: '1.1rem', maxWidth: '600px' }}>{era.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. The Condor Arena */}
      <section style={{ position: 'relative', padding: '8rem 0', color: 'white' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
          <img src="/stadium_hero_1780681869623.png" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.3)' }} />
        </div>
        <div className="container">
          <motion.div initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}>
            <span style={{ color: 'var(--clr-primary)', fontWeight: 'bold', letterSpacing: '2px' }}>NOTRE FORTERESSE</span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '4rem', margin: '10px 0' }}>L'Arène Condor</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginTop: '3rem', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', color: 'var(--clr-primary)' }}>75 000</div>
                <div style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>Capacité</div>
              </div>
              <div>
                <div style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', color: 'var(--clr-primary)' }}>105x68m</div>
                <div style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>Dimensions</div>
              </div>
              <div>
                <div style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', color: 'var(--clr-primary)' }}>2024</div>
                <div style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>Rénovation</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. Board of Directors */}
      <section className="section-padding">
        <div className="container">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', marginBottom: '3rem', textAlign: 'center' }}>Conseil d'Administration</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'center' }}>
            {[
              { name: 'Alejandro Silva', role: 'Président' },
              { name: 'Maria Gonzalez', role: 'Vice-Présidente' },
              { name: 'David Chen', role: 'Directeur Sportif' },
              { name: 'Laura Smith', role: 'Directrice Commerciale' }
            ].map((member, i) => (
              <motion.div key={i} initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div style={{ width: '150px', height: '150px', background: '#eee', borderRadius: '50%', margin: '0 auto 1.5rem', overflow: 'hidden' }}>
                  <img src="/player_action_1_1780681882713.png" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1)' }} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', margin: 0 }}>{member.name}</h3>
                <p style={{ color: 'var(--clr-primary)', fontWeight: 'bold' }}>{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. The Condor Foundation */}
      <section className="section-padding bg-black text-white" style={{ borderTop: '1px solid #333' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'center' }}>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <img src="/player_action_2_1780681894021.png" style={{ width: '100%', borderRadius: '16px', filter: 'sepia(0.5)' }} />
          </motion.div>
          <motion.div initial={{ x: 50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', marginBottom: '1rem', color: 'white' }}>La Fondation Condor</h2>
            <p style={{ fontSize: '1.2rem', color: '#ccc', marginBottom: '2rem', lineHeight: 1.6 }}>Nous utilisons le pouvoir du football pour impulser le changement social. La Fondation gère plus de 50 centres de jeunes à travers le monde, offrant éducation, installations sportives et mentorat aux enfants défavorisés.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
              <div><h4 style={{ fontSize: '2.5rem', margin: 0, color: 'var(--clr-primary)' }}>5M+ €</h4><span style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>Donnés Chaque Année</span></div>
              <div><h4 style={{ fontSize: '2.5rem', margin: 0, color: 'var(--clr-primary)' }}>100k</h4><span style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>Enfants Aidés</span></div>
            </div>
            <button className="btn btn-primary">Soutenir La Fondation</button>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
