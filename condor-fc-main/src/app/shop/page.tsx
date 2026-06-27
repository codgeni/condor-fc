"use client";

import { motion } from 'framer-motion';

export default function Shop() {
  const ProductCard = ({ title, price, img, filter, tag, delay = 0 }: any) => (
    <motion.div 
      className="product-card"
      initial={{ opacity: 0, y: 50 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true, margin: "-50px" }} 
      transition={{ duration: 0.6, delay, type: "spring", stiffness: 100 }}
      whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} 
      style={{ position: 'relative' }}
    >
      {tag && <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'var(--clr-primary)', color: 'white', padding: '5px 10px', fontSize: '0.8rem', fontWeight: 'bold', zIndex: 5 }}>{tag}</div>}
      <img src={img} alt={title} className="product-img" style={{ filter }} />
      <h3 className="product-title">{title}</h3>
      <p className="product-price">{price}</p>
      <button className="btn btn-primary" style={{ width: '100%' }}>Ajouter au Panier</button>
    </motion.div>
  );

  return (
    <div style={{ flex: 1, marginTop: '80px', overflowX: 'hidden' }}>
      
      {/* 1. Shop Hero (26/27 Kits) */}
      <section 
        style={{ 
          background: 'linear-gradient(rgba(17,17,17,0.6), rgba(17,17,17,0.9)), url(/shop_hero.png) center/cover no-repeat', 
          color: 'white', 
          padding: '8rem 0', 
          position: 'relative' 
        }}
      >
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
            <span style={{ color: 'var(--clr-primary)', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 'bold' }}>La Nouvelle Ère</span>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '5rem', margin: '15px 0', lineHeight: 1, textShadow: '0 10px 30px rgba(0,0,0,0.8)' }}>COLLECTION<br/>2026/27</h1>
            <p style={{ fontSize: '1.3rem', color: '#ccc', maxWidth: '600px', margin: '0 auto 2.5rem' }}>Conçu pour la grandeur. Porté par des légendes. Les maillots authentiques du Condor FC sont disponibles.</p>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn btn-primary" style={{ padding: '15px 40px', fontSize: '1.2rem' }}>Acheter la Collection</motion.button>
          </motion.div>
        </div>
      </section>

      {/* 2. Matchday Kits */}
      <section className="section-padding bg-gray">
        <div className="container">
          <motion.h2 
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }}
            style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: '2rem', borderBottom: '2px solid var(--clr-gray-light)', paddingBottom: '10px' }}
          >
            Tenues de Match Officielles
          </motion.h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <ProductCard delay={0.1} title="Maillot Domicile 26/27 Authentique" price="120.00 €" img="/condor_jersey_1780681923538.png" tag="NOUVEAU" />
            <ProductCard delay={0.2} title="Maillot Extérieur 26/27 Authentique" price="120.00 €" img="/condor_jersey_1780681923538.png" filter="hue-rotate(200deg)" tag="NOUVEAU" />
            <ProductCard delay={0.3} title="Maillot Third 26/27 Authentique" price="120.00 €" img="/condor_jersey_1780681923538.png" filter="grayscale(1) invert(0.2)" tag="NOUVEAU" />
            <ProductCard delay={0.4} title="Maillot Gardien 26/27" price="95.00 €" img="/condor_jersey_1780681923538.png" filter="hue-rotate(100deg) saturate(2)" />
          </div>
        </div>
      </section>

      {/* 3. Personalization Banner */}
      <section style={{ padding: '6rem 0', background: 'linear-gradient(90deg, var(--clr-primary), #800000)', color: 'white', textAlign: 'center', overflow: 'hidden' }}>
        <motion.div className="container" initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '4rem', margin: 0 }}>Personnalisez-le.</h2>
          <p style={{ fontSize: '1.3rem', margin: '15px auto 2.5rem', maxWidth: '600px', opacity: 0.9 }}>Ajoutez votre nom et numéro, ou choisissez votre joueur préféré. Flocage officiel du Condor FC.</p>
          <motion.button whileHover={{ scale: 1.05, background: 'white', color: 'var(--clr-primary)' }} className="btn btn-outline" style={{ color: 'white', borderColor: 'white', padding: '15px 40px', fontSize: '1.2rem' }}>
            Personnaliser la Tenue
          </motion.button>
        </motion.div>
      </section>

      {/* 4. Training & Lifestyle */}
      <section className="section-padding">
        <div className="container">
          <motion.h2 
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }}
            style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: '2rem', borderBottom: '2px solid var(--clr-gray-light)', paddingBottom: '10px' }}
          >
            Entraînement & Lifestyle
          </motion.h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <ProductCard delay={0.1} title="Haut d'Échauffement Avant-Match" price="65.00 €" img="/condor_jersey_1780681923538.png" filter="hue-rotate(45deg) saturate(1.5)" />
            <ProductCard delay={0.2} title="Veste d'Entraînement Hiver" price="110.00 €" img="/condor_jersey_1780681923538.png" filter="grayscale(1)" />
            <ProductCard delay={0.3} title="Polo de Voyage Condor FC" price="55.00 €" img="/condor_jersey_1780681923538.png" filter="brightness(0.5)" />
            <ProductCard delay={0.4} title="Short d'Entraînement 26/27" price="45.00 €" img="/condor_jersey_1780681923538.png" filter="sepia(1)" />
          </div>
        </div>
      </section>

      {/* 5. Retro & Accessories */}
      <section className="section-padding bg-black text-white">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', marginBottom: '1rem', color: 'white' }}>La Collection Héritage</h2>
              <p style={{ color: '#aaa', marginBottom: '3rem', fontSize: '1.2rem' }}>Revivez les jours de gloire. Reproductions authentiques des maillots portés lors de nos parcours légendaires.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <ProductCard delay={0.2} title="Maillot des Champions 1998" price="85.00 €" img="/condor_jersey_1780681923538.png" filter="sepia(0.8) hue-rotate(320deg)" tag="RÉTRO" />
                <ProductCard delay={0.4} title="Maillot Domicile Vintage 1982" price="80.00 €" img="/condor_jersey_1780681923538.png" filter="contrast(1.5) saturate(0.5)" tag="RÉTRO" />
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, delay: 0.3 }}
              style={{ background: '#111', padding: '4rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', border: '1px solid #333' }}
            >
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '3.5rem', margin: 0, color: 'white' }}>Accessoires</h2>
              <p style={{ color: '#aaa', margin: '20px 0 3rem', fontSize: '1.2rem' }}>Écharpes, bonnets, ballons, et plus encore.</p>
              <motion.button whileHover={{ scale: 1.05, background: 'white', color: 'black' }} className="btn btn-outline" style={{ color: 'white', borderColor: 'white', width: '100%', padding: '15px' }}>
                Voir Tous Les Accessoires
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
}
