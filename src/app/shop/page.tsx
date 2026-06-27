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
      style={{ position: 'relative', background: 'white', borderRadius: '12px', border: '1px solid #eee', padding: '2rem', textAlign: 'center' }}
    >
      {tag && <div style={{ position: 'absolute', top: '15px', right: '15px', background: 'var(--clr-primary)', color: 'white', padding: '5px 10px', fontSize: '0.8rem', fontWeight: 'bold', zIndex: 5, borderRadius: '4px' }}>{tag}</div>}
      <img src={img} alt={title} className="product-img" style={{ filter, height: '300px', objectFit: 'contain', width: '100%', marginBottom: '1.5rem' }} />
      <h3 className="product-title" style={{ fontFamily: 'var(--font-body)', fontWeight: 'bold', fontSize: '1.3rem', margin: '0 0 10px' }}>{title}</h3>
      <p className="product-price" style={{ color: 'var(--clr-primary)', fontWeight: 'bold', fontSize: '1.5rem', marginBottom: '1.5rem' }}>{price}</p>
      <button className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>Acheter l'Équipement</button>
    </motion.div>
  );

  return (
    <div style={{ flex: 1, marginTop: '80px', overflowX: 'hidden', background: '#f8f9fa', minHeight: '100vh' }}>
      
      {/* 1. Shop Hero */}
      <section 
        style={{ 
          background: 'linear-gradient(rgba(17,17,17,0.7), rgba(17,17,17,0.95)), url(/shop_hero.png) center/cover no-repeat', 
          color: 'white', 
          padding: '8rem 0', 
          position: 'relative' 
        }}
      >
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
            <span style={{ color: 'var(--clr-primary)', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 'bold' }}>Boutique Officielle</span>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '5rem', margin: '15px 0', lineHeight: 1, textShadow: '0 10px 30px rgba(0,0,0,0.8)' }}>ÉQUIPEMENTS</h1>
            
            {/* Texte fourni par les dirigeants (ou rédigé professionnellement pour eux) */}
            <p style={{ fontSize: '1.25rem', color: '#eee', maxWidth: '750px', margin: '20px auto 0', lineHeight: 1.6 }}>
              Portez fièrement les couleurs officielles du club. Le maillot authentique du Condor FC est le symbole de notre engagement pour l'excellence et l'esprit d'équipe. Tous les profits des ventes d'équipements sont directement réinvestis dans la formation et l'encadrement social de nos jeunes athlètes de Delmas, Haïti.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. Liste des équipements limités à 2 maximum */}
      <section className="section-padding" style={{ background: '#f8f9fa' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center', textTransform: 'uppercase' }}>
            Équipements Disponibles (Saison 2026/27)
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem' }}>
            <ProductCard delay={0.1} title="Maillot Domicile 26/27 Authentique" price="50.00 $" img="/condor_jersey_1780681923538.png" tag="OFFICIEL" />
            <ProductCard delay={0.2} title="Short d'Entraînement 26/27 Officiel" price="25.00 $" img="/condor_jersey_1780681923538.png" filter="hue-rotate(45deg) saturate(1.5) brightness(0.6)" tag="OFFICIEL" />
          </div>
        </div>
      </section>

    </div>
  );
}
