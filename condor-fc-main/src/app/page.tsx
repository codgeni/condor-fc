"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import ThreeScene from '@/components/ThreeScene';
import { Play, ArrowRight, Calendar, MapPin, ShoppingBag, Landmark, Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { playersDB } from '@/lib/playersDB';

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({ d: 2, h: 14, m: 30, s: 0 });
  const spotlightPlayers = Object.values(playersDB).slice(0, 4);

  useEffect(() => {
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
            else { h = 23; d--; }
          }
        }
        return { d, h, m, s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ flex: 1, marginTop: '80px', overflowX: 'hidden' }}>
      
      {/* 1. 3D Hero Section */}
      <section style={{ position: 'relative', height: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at center, #1a0000 0%, var(--clr-black) 100%)', overflow: 'hidden' }}>
        <ThreeScene />
        <div className="container" style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, delay: 0.5 }}>
            <span style={{ color: 'var(--clr-primary)', letterSpacing: '5px', textTransform: 'uppercase', fontWeight: 'bold' }}>Bienvenue dans</span>
            <h1 className="hero-title" style={{ color: 'white', margin: '10px 0', textShadow: '0 10px 30px rgba(0,0,0,0.8)' }}>L'Ère Condor</h1>
            <p style={{ fontSize: '1.2rem', color: '#ccc', maxWidth: '600px', margin: '0 auto 2rem' }}>Vivez la passion, l'histoire et l'avenir du football. Nous sommes le Condor FC.</p>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/tickets" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>Billetterie <ArrowRight size={18} /></Link>
              <Link href="/club" className="btn btn-outline" style={{ color: 'white', borderColor: 'white' }}>Découvrir le Club</Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Next Match Widget */}
      <section style={{ transform: 'translateY(-50px)', position: 'relative', zIndex: 20 }}>
        <div className="container">
          <motion.div 
            initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem', background: 'white', padding: '2rem 4rem', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
          >
            <div>
              <div style={{ color: 'var(--clr-primary)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '10px' }}>Prochain Match</div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', margin: 0 }}>Condor FC vs City United</h3>
              <div style={{ display: 'flex', gap: '1rem', color: 'var(--clr-gray)', marginTop: '10px', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={16} /> 12 Juin, 20:00 CET</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><MapPin size={16} /> L'Arène Condor</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '2rem', textAlign: 'center' }}>
              {[ { l: 'Jours', v: timeLeft.d }, { l: 'Heures', v: timeLeft.h }, { l: 'Min', v: timeLeft.m }, { l: 'Sec', v: timeLeft.s } ].map((t, i) => (
                <div key={i}>
                  <div style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', color: 'var(--clr-black)', lineHeight: 1 }}>{t.v.toString().padStart(2, '0')}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--clr-gray)', textTransform: 'uppercase' }}>{t.l}</div>
                </div>
              ))}
            </div>
            <button className="btn btn-outline d-none-mobile" style={{ color: 'var(--clr-black)', borderColor: 'var(--clr-black)' }}>Match Center</button>
          </motion.div>
        </div>
      </section>

      {/* 3. Masonry Top Stories */}
      <section className="section-padding" style={{ paddingTop: 0 }}>
        <div className="container">
          <motion.h2 initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: '2rem' }}>À la Une</motion.h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem' }}>
            <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ gridColumn: 'span 8', position: 'relative', borderRadius: '12px', overflow: 'hidden', height: '500px', cursor: 'pointer' }} whileHover="hover">
              <motion.img variants={{ rest: { scale: 1 }, hover: { scale: 1.05 } }} transition={{ duration: 0.4 }} src="/player_action_1_1780681882713.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '3rem 2rem', background: 'linear-gradient(transparent, rgba(0,0,0,0.9))', color: 'white' }}>
                <span style={{ background: 'var(--clr-primary)', padding: '5px 10px', fontSize: '0.8rem', fontWeight: 'bold' }}>ÉQUIPE PREMIÈRE</span>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', margin: '10px 0' }}>L'équipe se prépare pour le Derby</h3>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <motion.div style={{ flex: 1, minHeight: '200px', position: 'relative', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer' }} whileHover="hover">
                <motion.img variants={{ rest: { scale: 1 }, hover: { scale: 1.05 } }} transition={{ duration: 0.4 }} src="/condor_jersey_1780681923538.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.5rem', background: 'linear-gradient(transparent, rgba(0,0,0,0.9))', color: 'white' }}>
                  <span style={{ background: 'var(--clr-black)', padding: '5px 10px', fontSize: '0.8rem', fontWeight: 'bold' }}>BOUTIQUE</span>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', margin: '10px 0 0' }}>Le Nouveau Maillot Extérieur 26/27</h3>
                </div>
              </motion.div>
              <motion.div style={{ flex: 1, background: 'var(--clr-gray-light)', borderRadius: '12px', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }} whileHover={{ y: -5 }}>
                <span style={{ color: 'var(--clr-primary)', fontSize: '0.8rem', fontWeight: 'bold' }}>COMMUNIQUÉ DU CLUB</span>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', margin: '10px 0' }}>Le président annonce l'agrandissement du stade</h3>
                <Link href="/news" style={{ color: 'var(--clr-black)', fontWeight: 'bold', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>Lire Plus <ArrowRight size={16} /></Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. First Team Spotlight */}
      <section className="section-padding bg-gray">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', margin: 0 }}>Projecteur Équipe Première</h2>
            <Link href="/teams" className="btn btn-outline d-none-mobile" style={{ color: 'var(--clr-black)', borderColor: 'var(--clr-black)' }}>Voir les 32 Joueurs</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            {spotlightPlayers.map((player, i) => (
              <Link href={`/teams/${player.id}`} key={player.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                <motion.div 
                  className="player-card"
                  initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
                >
                  <img src={player.img} className="player-img" style={{ filter: player.filter }} alt={player.name} />
                  <span className="player-number">{player.num}</span>
                  <div className="player-info">
                    <h3 className="player-name">{player.name}</h3>
                    <span className="player-position">{player.pos}</span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Condor TV Highlight */}
      <section style={{ position: 'relative', height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
          <img src="/player_action_2_1780681894021.png" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.4)' }} />
        </div>
        <div className="container text-center" style={{ color: 'white' }}>
          <motion.div initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }}>
            <div style={{ width: '80px', height: '80px', background: 'var(--clr-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', cursor: 'pointer', boxShadow: '0 0 30px rgba(230,0,0,0.5)' }}>
              <Play fill="white" size={32} style={{ marginLeft: '5px' }} />
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '4rem', marginBottom: '1rem' }}>En Coulisses</h2>
            <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>Accès exclusif au tunnel des joueurs lors de notre incroyable victoire en Ligue des Champions.</p>
          </motion.div>
        </div>
      </section>

      {/* 6. Academy & Future Stars */}
      <section className="section-padding">
        <div className="container">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: '2rem' }}>Académie & Futures Étoiles</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {[1, 2, 3].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div style={{ background: '#eee', height: '200px', borderRadius: '8px', marginBottom: '1rem', overflow: 'hidden' }}>
                  <img src="/player_action_1_1780681882713.png" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(0.5)' }} />
                </div>
                <span style={{ color: 'var(--clr-primary)', fontWeight: 'bold', fontSize: '0.8rem' }}>ÉQUIPE U19</span>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', margin: '5px 0' }}>Les jeunes remportent une victoire spectaculaire en coupe</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Official Store Highlight */}
      <section style={{ background: 'var(--clr-black)', color: 'white', padding: '6rem 0', overflow: 'hidden', position: 'relative' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <motion.div initial={{ x: -50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }}>
            <span style={{ color: 'var(--clr-gray)', letterSpacing: '2px', textTransform: 'uppercase' }}>Produits Officiels</span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '4rem', margin: '10px 0', color: 'var(--clr-primary)' }}>PORTEZ LES COULEURS</h2>
            <p style={{ fontSize: '1.2rem', color: '#ccc', maxWidth: '500px', marginBottom: '2rem' }}>Obtenez les maillots authentiques 2026/27, les tenues d'entraînement et des vêtements exclusifs Condor FC en édition limitée.</p>
            <Link href="/shop" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}><ShoppingBag size={18} /> Acheter Maintenant</Link>
          </motion.div>
          <motion.div initial={{ x: 50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} className="d-none-mobile">
            <img src="/condor_jersey_1780681923538.png" style={{ width: '400px', transform: 'rotate(10deg)', filter: 'drop-shadow(0 20px 30px rgba(255,0,0,0.2))' }} />
          </motion.div>
        </div>
      </section>

      {/* 8. Condor Foundation */}
      <section className="section-padding bg-gray text-center">
        <motion.div className="container" initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <Heart size={48} color="var(--clr-primary)" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: '1rem' }}>Fondation Condor</h2>
          <p style={{ fontSize: '1.2rem', color: 'var(--clr-black-light)', maxWidth: '700px', margin: '0 auto 2rem' }}>Nous croyons que le football est plus qu'un jeu. Découvrez comment la Fondation Condor a un impact sur les communautés locales.</p>
          <button className="btn btn-outline" style={{ color: 'var(--clr-black)', borderColor: 'var(--clr-black)' }}>Découvrir Notre Impact</button>
        </motion.div>
      </section>

      {/* 9. Stadium Tours & Museum */}
      <section style={{ position: 'relative', padding: '6rem 0', color: 'white' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
          <img src="/stadium_hero_1780681869623.png" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.3)' }} />
        </div>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'center' }}>
          <motion.div initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}>
            <Landmark size={48} color="white" style={{ marginBottom: '1rem' }} />
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', margin: '0 0 1rem' }}>Visitez l'Arène</h2>
            <p style={{ fontSize: '1.2rem', color: '#ccc', marginBottom: '2rem' }}>Traversez le tunnel, asseyez-vous sur le banc et vivez l'histoire glorieuse du Condor FC dans notre musée interactif.</p>
            <button className="btn btn-primary" style={{ background: 'white', color: 'var(--clr-black)' }}>Réserver une Visite</button>
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
          {Array(4).fill(['FLY CONDOR', 'TECHCORP', 'SPORTSBET', 'AUTO GROUP', 'BANQUE CONDOR']).flat().map((sponsor, i) => (
            <h3 key={i} style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', color: 'white', margin: 0 }}>{sponsor}</h3>
          ))}
        </motion.div>
      </section>

    </div>
  );
}
