"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  X, 
  AlertCircle,
  MessageCircle,
  FileText
} from 'lucide-react';
import { fetchProducts, fetchSiteContent, SiteContent, DEFAULT_SITE_CONTENT } from '@/lib/dataService';

interface Product {
  id: string;
  title?: string;
  category: 'match' | 'training' | 'accessories';
  categoryLabel: string;
  subtitle?: string;
  price?: number;
  formattedPrice?: string;
  tag?: string;
  tagBg?: string;
  img: string;
  badgeText?: string;
  description: string;
  highlights: string[];
  sizes: string[];
  is_available?: boolean;
}

const PRODUCTS: Product[] = [
  // 1. Kit Polo Domicile
  {
    id: 'kit-officiel-polo-condor',
    title: 'Kit Officiel Match Polo 26/27',
    category: 'match',
    categoryLabel: 'Tenue Officielle Domicile',
    subtitle: 'Tenue Complète : Polo, Short #17 & Chaussettes',
    price: 65,
    formattedPrice: '65.00 $',
    tag: 'DOMICILE',
    tagBg: 'var(--clr-primary)',
    img: '/shop/kit_officiel_polo_condor.png',
    badgeText: 'Pack Complet 3 Pièces',
    description: 'La tenue officielle complète de référence du Condor FC pour la saison 2026/27. Polo bicolore rouge rubis et noir avec col classique boutonné, grand blason Condor Edu-Sport Académie et drapeau national haïtien sur l\'ourlet. Inclus le short de match noir numéroté 17 et les chaussettes hautes bicolores assorties.',
    highlights: [
      'Pack complet 3 pièces : Maillot Polo + Short + Chaussettes',
      'Écusson brodé Condor Edu-Sport Académie & drapeau Haïti',
      'Dos floqué "NOM 17" personnalisable avec votre nom',
      'Tissu respirant haute durabilité adapté au climat des Caraïbes'
    ],
    sizes: ['Enfant (8-12 ans)', 'S', 'M', 'L', 'XL', 'XXL']
  },

  // 2. Kit Extérieur Blanc "Brush Strokes"
  {
    id: 'kit-officiel-exterieur-blanc',
    title: 'Kit Officiel Extérieur 26/27 - Blanc',
    category: 'match',
    categoryLabel: 'Tenue Officielle Extérieure',
    subtitle: 'Maillot Blanc Rayé Pinceau, Short #08 & Chaussettes',
    price: 65,
    formattedPrice: '65.00 $',
    tag: 'EXTÉRIEUR',
    tagBg: '#0284c7',
    img: '/shop/kit_officiel_exterieur_blanc.png',
    badgeText: 'Pack Complet 3 Pièces',
    description: 'La tenue officielle extérieure du Condor FC. Design blanc éclatant avec rayures horizontales artistiques rouges et noires effet coups de pinceau, sponsor officiel DNC, drapeau d\'Haïti sur l\'ourlet, dos orné de la devise officielle "Plus fort, plus haut dans le score" et verset PS60:12, short blanc assorti #08 et chaussettes blanches avec aigle Condor.',
    highlights: [
      'Pack complet 3 pièces : Maillot extérieur + Short #08 + Chaussettes',
      'Design exclusif coups de pinceau dynamique rouge & noir',
      'Devise officielle du club "Plus fort, plus haut dans le score"',
      'Détails haute précision : écussons club et drapeau d\'Haïti'
    ],
    sizes: ['Enfant (8-12 ans)', 'S', 'M', 'L', 'XL', 'XXL']
  },

  // 3. Kit Third "Alvéoles & Lave"
  {
    id: 'kit-third-alveoles-lave',
    title: 'Kit Third 26/27 - Alvéoles & Lave',
    category: 'match',
    categoryLabel: 'Tenue Third Spéciale',
    subtitle: 'Maillot Graphique Grunge, Short à Vagues & Détails',
    price: 65,
    formattedPrice: '65.00 $',
    tag: 'THIRD PRO',
    tagBg: '#475569',
    img: '/shop/kit_third_alveoles_lave.png',
    badgeText: 'Édition Graphique',
    description: 'L\'édition alternative spectaculaire de la saison 2026/27. Maillot noir et blanc à trame nid d\'abeille avec estafilade diagonale rouge lave, sponsor DNC, manche asymétrique blanche avec aigle Condor et drapeau national, dos avec devise officielle du club, et short noir à liserés ondulés blancs et numéro 00.',
    highlights: [
      'Motif alvéolaire haute définition et griffure rouge lave',
      'Manche gauche asymétrique blanche avec blason club',
      'Short noir exclusif à liserés ondulés aérodynamiques',
      'Dos floqué avec devise du club et verset PS60:12'
    ],
    sizes: ['Enfant (8-12 ans)', 'S', 'M', 'L', 'XL', 'XXL']
  },

  // 4. Maillot Match Pro Marbré
  {
    id: 'maillot-match-pro-marbre',
    title: 'Maillot Match Pro 26/27 - Noir & Rouge Marbré',
    category: 'match',
    categoryLabel: 'Maillot de Match Pro',
    subtitle: 'Motif Fusion Marbré & Sponsor Officiel DNC',
    price: 50,
    formattedPrice: '50.00 $',
    tag: 'PRO MATCH',
    tagBg: '#0f172a',
    badgeText: 'Top Vente',
    img: '/shop/maillot_match_pro_marbre.png',
    description: 'Le nouveau maillot de match Pro sensationnel du club. Arborant une texture de lave marbrée rouge feu sur fond noir profond, un col en V athlétique rehaussé de rouge, le logo sponsor officiel DNC en blanc contrasté, et le blason de l\'académie.',
    highlights: [
      'Sublimation numérique haute définition effet marbré',
      'Col V athlétique renforcé et finitions bords-côtes',
      'Sponsor officiel DNC et écusson Condor thermo-appliqué',
      'Coupe moderne ergonomique favorisant l\'agilité'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },

  // 5. Short & Chaussettes Pro Marbré (Assorti au Maillot Match Pro)
  {
    id: 'short-chaussettes-pro-marbre',
    title: 'Short & Chaussettes Match Pro - Marbré',
    category: 'match',
    categoryLabel: 'Ensemble Bas Match Pro',
    subtitle: 'Ensemble Bas Officiel Marbré Assorti',
    price: 30,
    formattedPrice: '30.00 $',
    tag: 'BAS ASSORTI',
    tagBg: '#334155',
    badgeText: 'Complément Pro',
    img: '/shop/short_chaussettes_pro_marbre.png',
    description: 'Le complément parfait du maillot Match Pro marbré. Short noir orné de la texture marbrée rouge et du blason Condor FC, accompagné de la paire de chaussettes hautes de compression coordonnées avec l\'écusson du club.',
    highlights: [
      'Design texturé assorti au Maillot Match Pro 26/27',
      'Ceinture élastique ultra-confortable avec cordon de serrage',
      'Chaussettes montantes anatomiques avec maintien voûte plantaire',
      'Renforts amortissants au talon et aux orteils'
    ],
    sizes: ['Taille Unique Adulte', 'Taille Junior']
  },

  // 6. Kit Polo Édition Manches
  {
    id: 'kit-officiel-polo-sleeves',
    title: 'Kit Officiel Polo - Édition Manches',
    category: 'match',
    categoryLabel: 'Tenue Officielle Club',
    subtitle: 'Torse Épuré & Badges sur Manches',
    price: 65,
    formattedPrice: '65.00 $',
    tag: 'OFFICIEL',
    tagBg: 'var(--clr-primary)',
    img: '/shop/kit_officiel_polo_sleeves.png',
    badgeText: 'Édition Club',
    description: 'Une variante raffinée du polo officiel avec blason circulaire sur le cœur et logos Condor Edu-Sport Académie élégamment disposés sur les manches. Coupe droite impeccable, col polo contrasté, short noir n°17 et chaussettes de performance.',
    highlights: [
      'Finition torse épurée avec écusson club sur le cœur',
      'Double marquage aigle Condor sur chaque manche',
      'Short noir compétition et chaussettes techniques inclus',
      'Confort athlétique stretch et résistant'
    ],
    sizes: ['Enfant (8-12 ans)', 'S', 'M', 'L', 'XL', 'XXL']
  },

  // 6. Kit Entraînement Pro Rouge DNC #10 (Front/Back)
  {
    id: 'kit-entrainement-pro-rouge-10',
    title: 'Kit Entraînement Pro Rouge #10',
    category: 'training',
    categoryLabel: 'Entraînement Pro',
    subtitle: 'Débardeur Rouge #10, Short Assorti & Devise Club',
    price: 45,
    formattedPrice: '45.00 $',
    tag: 'PRO TRAINING',
    tagBg: '#dc2626',
    img: '/shop/kit_entrainement_pro_rouge_10.png',
    badgeText: 'Pack Entraînement',
    description: 'L\'ensemble d\'entraînement sans manches officiel porté par les équipes élite de l\'Académie Condor. Débardeur rouge avec empiècements courbes aérodynamiques noir et blanc, sponsor DNC, dos complet avec numéro 10 et devise du club "Plus fort, plus haut dans le score", et short rouge n°10 coordonné.',
    highlights: [
      'Ensemble 2 pièces : Débardeur d\'entraînement + Short n°10',
      'Dos floqué "NAME 10", PS60:12 et devise officielle',
      'Maille légère anti-humidité et régulation thermique',
      'Short à découpes ergonomiques avec écusson club'
    ],
    sizes: ['Enfant (6-10 ans)', 'Enfant (11-14 ans)', 'S', 'M', 'L', 'XL']
  },

  // 7. Kit Entraînement Débardeur Rouge #08
  {
    id: 'kit-entrainement-debardeur-rouge',
    title: 'Kit Entraînement Sans Manches DNC (#08)',
    category: 'training',
    categoryLabel: 'Entraînement Académie',
    subtitle: 'Débardeur Rouge, Short #08 & Chaussettes Rayées',
    price: 45,
    formattedPrice: '45.00 $',
    tag: 'ENTRAÎNEMENT',
    tagBg: '#e11d48',
    img: '/shop/kit_entrainement_debardeur_rouge.png',
    badgeText: 'Académie Condor',
    description: 'L\'ensemble d\'entraînement sans manches classique de l\'École de Football Condor. Débardeur rouge vif avec sponsor DNC, détails d\'épaules noir et blanc, drapeau national haïtien à la taille, short rouge n°08 et chaussettes montantes à rayures blanches.',
    highlights: [
      'Débardeur ultra-aéré en maille alvéolée anti-transpiration',
      'Logos officiels DNC et Condor École de Football',
      'Drapeau haïtien cousu sur la base du maillot',
      'Short technique avec cordon élastique et chaussettes rayées'
    ],
    sizes: ['Enfant (6-10 ans)', 'Enfant (11-14 ans)', 'S', 'M', 'L', 'XL']
  },

  // 8. Débardeur Noir
  {
    id: 'debardeur-entrainement-noir-fitness',
    title: '',
    category: 'training',
    categoryLabel: 'Entraînement',
    subtitle: '',
    price: 28,
    formattedPrice: '28.00 $',
    tag: '',
    tagBg: '',
    img: '/shop/debardeur_entrainement_noir_fitness.png',
    badgeText: '',
    description: 'Débardeur officiel Condor sans manches, coupe athlétique respirante avec finitions bicolores rouge et blanc.',
    highlights: [
      'Coupe athlétique sans manches libérant les mouvements',
      'Écusson officiel Condor École de Football',
      'Flancs contrastés rouge et blanc',
      'Tissu technique stretch et respirant'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },

  // 9. Débardeur Blanc
  {
    id: 'debardeur-entrainement-blanc',
    title: '',
    category: 'training',
    categoryLabel: 'Entraînement',
    subtitle: '',
    price: 28,
    formattedPrice: '28.00 $',
    tag: '',
    tagBg: '',
    img: '/shop/debardeur_entrainement_blanc.png',
    badgeText: '',
    description: 'Débardeur officiel blanc sans manches de l\'Académie Condor avec écusson club et finitions bicolores noir et rouge.',
    highlights: [
      'Coupe athlétique sans manches haute respirabilité',
      'Écusson officiel Condor École de Football',
      'Flancs bicolores latéraux noir et rouge',
      'Tissu léger et aéré adapté aux entraînements'
    ],
    sizes: ['Enfant (8-12 ans)', 'S', 'M', 'L', 'XL', 'XXL']
  }
];

export default function Shop() {
  const [productList, setProductList] = useState<Product[]>(PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [siteContent, setSiteContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);

  useEffect(() => {
    fetchProducts().then(data => {
      if (data && data.length > 0) {
        // Merge or replace
        const customMap = new Map();
        PRODUCTS.forEach(p => customMap.set(p.id, { ...p, is_available: true }));
        data.forEach((p: any) => {
          customMap.set(p.id, {
            ...p,
            categoryLabel: p.category_label || p.categoryLabel || 'Boutique Condor',
            formattedPrice: '',
            badgeText: p.badge_text || p.badgeText || '',
            sizes: Array.isArray(p.sizes) ? p.sizes : ['S', 'M', 'L', 'XL'],
            is_available: p.is_available !== false
          });
        });
        setProductList(Array.from(customMap.values()));
      }
    });
    fetchSiteContent().then(content => {
      if (content) setSiteContent(content);
    });
  }, []);

  const filteredProducts = selectedCategory === 'all'
    ? productList
    : productList.filter(p => p.category === selectedCategory || (selectedCategory === 'accessories' && p.id === 'short-chaussettes-pro-marbre'));

  const openOrderModal = (product: Product) => {
    setActiveProduct(product);
    setSelectedSize(product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Standard');
  };

  const closeModal = () => {
    setActiveProduct(null);
  };

  return (
    <div style={{ flex: 1, marginTop: '80px', overflowX: 'hidden', background: '#f8f9fa', minHeight: '100vh' }}>
      
      {/* 1. Shop Hero */}
      <section 
        style={{ 
          background: `linear-gradient(rgba(17,17,17,0.78), rgba(17,17,17,0.95)), url(${siteContent.shop_hero_bg || '/shop_hero.png'}) center/cover no-repeat`, 
          color: 'white', 
          padding: '7rem 0 5rem', 
          position: 'relative' 
        }}
      >
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '4.8rem', margin: '0 0 15px', lineHeight: 1.05, textShadow: '0 10px 30px rgba(0,0,0,0.8)' }}>
              ÉQUIPEMENTS OFFICIELS
            </h1>
            
            <p style={{ fontSize: '1.25rem', color: '#e2e8f0', maxWidth: '750px', margin: '0 auto', lineHeight: 1.65 }}>
              Portez fièrement les couleurs officielles du Condor FC. Retrouvez l'ensemble de nos maillots, tenues de match officielles et équipements d'entraînement de la saison 2026/27.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. Filtres & Catalogue */}
      <section className="section-padding" style={{ background: '#f8f9fa', paddingTop: '3.5rem' }}>
        <div className="container" style={{ maxWidth: '1280px' }}>
          
          {/* Header & Categories Filter */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '3rem' }}>
            <span style={{ color: 'var(--clr-primary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1.5px', fontSize: '0.9rem', marginBottom: '8px' }}>
              Collection Saison 2026/27
            </span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.8rem', margin: '0 0 1.5rem', textAlign: 'center', textTransform: 'uppercase', color: 'var(--clr-black)' }}>
              Tous Nos Équipements ({filteredProducts.length})
            </h2>

            {/* Filter Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', background: 'white', padding: '6px', borderRadius: '50px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
              {[
                { id: 'all', label: `Tous (${PRODUCTS.length})` },
                { id: 'match', label: `Tenues de Match (${PRODUCTS.filter(p => p.category === 'match').length})` },
                { id: 'training', label: `Entraînement (${PRODUCTS.filter(p => p.category === 'training').length})` },
                { id: 'accessories', label: `Accessoires (${PRODUCTS.filter(p => p.category === 'accessories' || p.id === 'short-chaussettes-pro-marbre').length})` }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '30px',
                    border: 'none',
                    fontWeight: selectedCategory === cat.id ? 'bold' : '500',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    background: selectedCategory === cat.id ? 'var(--clr-primary)' : 'transparent',
                    color: selectedCategory === cat.id ? 'white' : 'var(--clr-black-light)'
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: (index % 4) * 0.08 }}
                whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.09)' }}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  border: '1px solid #e5e7eb',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                }}
              >
                {/* Image Showcase */}
                <div 
                  onClick={() => openOrderModal(product)}
                  style={{
                    height: '340px',
                    background: '#f8fafc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1.5rem',
                    position: 'relative',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    borderBottom: '1px solid #f1f5f9'
                  }}
                >
                  <img
                    src={product.img}
                    alt={product.title || product.categoryLabel}
                    style={{
                      maxHeight: '100%',
                      maxWidth: '100%',
                      objectFit: 'contain',
                      transition: 'transform 0.4s ease',
                      filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.08))'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                  <div style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(6px)', padding: '5px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--clr-black)', border: '1px solid #e2e8f0' }}>
                    Aperçu & Tailles
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '1.8rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ marginBottom: 'auto' }}>
                    <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--clr-primary)', fontWeight: 'bold', letterSpacing: '1px' }}>
                      {product.categoryLabel}
                    </span>
                    {product.title ? (
                      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.45rem', margin: '6px 0 8px', color: 'var(--clr-black)', lineHeight: 1.25 }}>
                        {product.title}
                      </h3>
                    ) : null}
                    {product.subtitle ? (
                      <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '1rem', lineHeight: 1.5 }}>
                        {product.subtitle}
                      </p>
                    ) : null}

                    {/* Features list */}
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.2rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {product.highlights.slice(0, 2).map((hl, i) => (
                        <li key={i} style={{ fontSize: '0.82rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Check size={14} color="#16a34a" style={{ flexShrink: 0 }} />
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Statut Disponibilité & Bouton Commander */}
                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.2rem', marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Équipement Officiel
                      </span>
                      {product.is_available !== false ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', fontWeight: '700', color: '#15803d', background: 'rgba(22, 163, 74, 0.1)', padding: '4px 10px', borderRadius: '12px' }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a' }} />
                          En vente
                        </span>
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', fontWeight: '700', color: '#b91c1c', background: 'rgba(220, 38, 38, 0.1)', padding: '4px 10px', borderRadius: '12px' }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#dc2626' }} />
                          Hors vente
                        </span>
                      )}
                    </div>

                    {product.is_available !== false ? (
                      <Link
                        href={`/shop/order?id=${product.id}`}
                        className="btn btn-primary"
                        style={{
                          width: '100%',
                          padding: '11px',
                          borderRadius: '10px',
                          fontWeight: '700',
                          fontSize: '0.92rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          textDecoration: 'none',
                          boxShadow: '0 4px 14px rgba(202, 2, 79, 0.25)'
                        }}
                      >
                        Commander cet équipement
                      </Link>
                    ) : (
                      <button
                        onClick={() => openOrderModal(product)}
                        style={{
                          width: '100%',
                          padding: '11px',
                          borderRadius: '10px',
                          fontWeight: '700',
                          fontSize: '0.92rem',
                          background: '#f8fafc',
                          color: '#64748b',
                          border: '1px solid #e2e8f0',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px'
                        }}
                      >
                        Hors vente (Voir détails)
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Modal de Commande & Personnalisation */}
      <AnimatePresence>
        {activeProduct && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0,0,0,0.65)',
              backdropFilter: 'blur(5px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem'
            }}
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'white',
                borderRadius: '20px',
                width: '100%',
                maxWidth: '720px',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                position: 'relative'
              }}
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 10
                }}
              >
                <X size={20} color="#475569" />
              </button>

                <div style={{ padding: '2rem' }}>
                  
                  {/* Top Preview */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.8rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1.5rem' }}>
                    <div style={{ width: '150px', height: '180px', background: '#f8fafc', borderRadius: '12px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0' }}>
                      <img src={activeProduct.img} alt={activeProduct.title} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                    </div>

                    <div style={{ flex: 1, minWidth: '240px' }}>
                      <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--clr-primary)', fontWeight: 'bold', letterSpacing: '1px', display: 'block', marginBottom: '4px' }}>
                        {activeProduct.categoryLabel}
                      </span>
                      {activeProduct.title ? (
                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', margin: '0 0 8px', color: '#0f172a' }}>
                          {activeProduct.title}
                        </h3>
                      ) : null}
                      <p style={{ color: '#64748b', fontSize: '0.88rem', margin: '0 0 12px', lineHeight: 1.5 }}>
                        {activeProduct.description}
                      </p>
                      
                      {/* Disponibilité Badge */}
                      {activeProduct.is_available !== false ? (
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: '#ecfdf5',
                            border: '1px solid #a7f3d0',
                            color: '#065f46',
                            padding: '6px 14px',
                            borderRadius: '8px',
                            fontSize: '0.85rem',
                            fontWeight: '700'
                          }}
                        >
                          <span
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              background: '#10b981',
                              display: 'inline-block'
                            }}
                          />
                          <span>Disponible à la commande</span>
                        </div>
                      ) : (
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: '#fef2f2',
                            border: '1px solid #fecaca',
                            color: '#991b1b',
                            padding: '6px 14px',
                            borderRadius: '8px',
                            fontSize: '0.85rem',
                            fontWeight: '700'
                          }}
                        >
                          <span
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              background: '#ef4444',
                              display: 'inline-block'
                            }}
                          />
                          <span>Hors vente</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Highlights */}
                  {activeProduct.highlights && activeProduct.highlights.length > 0 && (
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '8px', color: '#1e293b' }}>
                        Caractéristiques techniques :
                      </label>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {activeProduct.highlights.map((hl, i) => (
                          <li key={i} style={{ fontSize: '0.85rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Check size={14} color="#16a34a" style={{ flexShrink: 0 }} />
                            <span>{hl}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Size Selector */}
                  <div style={{ marginBottom: '1.8rem' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '8px', color: '#1e293b' }}>
                      Choisir votre taille :
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {activeProduct.sizes.map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setSelectedSize(sz)}
                          style={{
                            padding: '8px 16px',
                            borderRadius: '8px',
                            border: selectedSize === sz ? '2px solid var(--clr-primary)' : '1px solid #cbd5e1',
                            background: selectedSize === sz ? 'rgba(202, 2, 79, 0.08)' : '#f8fafc',
                            color: selectedSize === sz ? 'var(--clr-primary)' : '#334155',
                            fontWeight: '700',
                            fontSize: '0.88rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Action Commande */}
                  {activeProduct.is_available !== false ? (
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.6rem', textAlign: 'center' }}>
                      <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', margin: '0 0 8px', color: '#0f172a' }}>
                        Commander cet équipement officiel
                      </h4>
                      <p style={{ margin: '0 0 1.2rem', color: '#64748b', fontSize: '0.9rem', lineHeight: 1.5, maxWidth: '480px', marginLeft: 'auto', marginRight: 'auto' }}>
                        Équipement officiel certifié Condor FC. Remplissez simplement le bon de commande en ligne : aucun paiement immédiat n'est requis.
                      </p>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '440px', margin: '0 auto' }}>
                        <Link
                          href={`/shop/order?id=${activeProduct.id}&size=${encodeURIComponent(selectedSize)}`}
                          className="btn btn-primary"
                          style={{
                            padding: '13px 22px',
                            borderRadius: '10px',
                            fontWeight: '800',
                            fontSize: '0.98rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            textDecoration: 'none',
                            boxShadow: '0 4px 14px rgba(202, 2, 79, 0.3)'
                          }}
                        >
                          <FileText size={18} />
                          Remplir le bon de commande (Sans paiement)
                        </Link>

                        <a
                          href={`https://wa.me/50946055757?text=${encodeURIComponent(`Bonjour Condor FC, j'ai une question sur l'équipement : ${activeProduct.title || ''}${selectedSize ? ` (Taille : ${selectedSize})` : ''}. Merci !`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline"
                          style={{
                            padding: '10px 18px',
                            borderRadius: '10px',
                            fontWeight: '700',
                            fontSize: '0.86rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            color: '#1e293b',
                            borderColor: '#cbd5e1',
                            textDecoration: 'none'
                          }}
                        >
                          <MessageCircle size={16} />
                          Poser une question via WhatsApp (+509 4605 5757)
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '14px', padding: '1.6rem', textAlign: 'center' }}>
                      <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#fee2e2', color: '#b91c1c', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                        <AlertCircle size={22} />
                      </div>
                      <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', margin: '0 0 6px', color: '#991b1b' }}>
                        Équipement Hors Vente
                      </h4>
                      <p style={{ margin: '0 0 1.2rem', color: '#7f1d1d', fontSize: '0.9rem', lineHeight: 1.6, maxWidth: '480px', marginLeft: 'auto', marginRight: 'auto' }}>
                        Cet article est actuellement hors vente ou réservé. Contactez le secrétariat pour toute question.
                      </p>
                      <button
                        onClick={closeModal}
                        className="btn btn-outline"
                        style={{ padding: '10px 24px', borderRadius: '8px', fontSize: '0.9rem', color: '#1e293b', borderColor: '#cbd5e1' }}
                      >
                        Fermer l'aperçu
                      </button>
                    </div>
                  )}

                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
