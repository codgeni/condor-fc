"use client";

import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, X, Calendar, Layers, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { fetchSiteContent, SiteContent, DEFAULT_SITE_CONTENT } from '@/lib/dataService';

export default function News() {
  const [allNews, setAllNews] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);
  const [siteContent, setSiteContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newsRes, contentData] = await Promise.all([
          supabase.from('news').select('*').order('created_at', { ascending: false }),
          fetchSiteContent()
        ]);

        if (!newsRes.error && newsRes.data) {
          setAllNews(newsRes.data);
        }
        if (contentData) {
          setSiteContent(contentData);
        }
      } catch (err) {
        console.warn("Fetch news or site content note:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categories = ['Tous', 'Match', 'Transferts', 'Entraînement', 'Académie', 'Club', 'Récompense', 'Stages'];

  const filteredNews = selectedCategory === 'Tous'
    ? allNews
    : allNews.filter(n => (n.cat || '').trim().toLowerCase() === selectedCategory.trim().toLowerCase());

  const heroBg = siteContent.news_hero_bg || '/news_hero.png';

  return (
    <div style={{ flex: 1, marginTop: '80px', overflowX: 'hidden', minHeight: '100vh', background: '#f8f9fa' }}>
      
      {/* 1. Page Header (Bandeau d'en-tête dynamique) */}
      <section 
        className="section-padding bg-black text-white" 
        style={{ 
          textAlign: 'center', 
          position: 'relative', 
          overflow: 'hidden', 
          padding: '120px 0 80px',
          background: `linear-gradient(rgba(17,17,17,0.72), rgba(17,17,17,0.92)), url(${heroBg}) center/cover no-repeat`,
          transition: 'background 0.3s ease'
        }}
      >
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }} style={{ position: 'relative', zIndex: 10 }}>
          <span style={{ color: 'var(--clr-primary)', letterSpacing: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}>Le Journal du Condor</span>
          <h1 className="hero-title" style={{ color: 'white', fontSize: '3.5rem', marginTop: '10px' }}>Actualités Officielles</h1>
          <p style={{ fontSize: '1.2rem', color: '#ccc', maxWidth: '650px', margin: '15px auto 0' }}>
            Suivez en direct la vie du club, les résultats des matchs, les communiqués de presse et l'évolution de nos jeunes athlètes.
          </p>
        </motion.div>
      </section>

      {/* 2. Catégories Filter */}
      <section style={{ background: 'white', borderBottom: '1px solid #eee', padding: '1.2rem 0' }}>
        <div className="container" style={{ display: 'flex', gap: '0.8rem', overflowX: 'auto', paddingBottom: '4px' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                background: selectedCategory === cat ? 'var(--clr-primary)' : '#f0f0f0',
                color: selectedCategory === cat ? 'white' : 'var(--clr-black)',
                border: 'none',
                padding: '8px 18px',
                borderRadius: '25px',
                cursor: 'pointer',
                fontFamily: 'var(--font-heading)',
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                fontWeight: selectedCategory === cat ? 'bold' : 'normal',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                boxShadow: selectedCategory === cat ? '0 4px 12px rgba(202, 2, 79, 0.3)' : 'none'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* 3. Rubrique Actualités (Format Cartes Joueurs avec Image Carrée) */}
      <section className="section-padding">
        <div className="container" style={{ maxWidth: '1240px' }}>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: '#888' }}>
              <p>Chargement des actualités...</p>
            </div>
          ) : filteredNews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'white', borderRadius: '16px', border: '1px solid #eee', maxWidth: '700px', margin: '0 auto' }}>
              <BookOpen size={48} color="var(--clr-primary)" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>Aucun article dans cette catégorie</h3>
              <p style={{ color: '#666', fontSize: '1rem', lineHeight: 1.6 }}>
                Notre rédaction sportive prépare les prochains reportages et communiqués pour la catégorie « {selectedCategory} ».
              </p>
            </div>
          ) : (
            <div 
              style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 360px))', 
                justifyContent: 'center',
                gap: '2.2rem' 
              }}
            >
              {filteredNews.map((news, i) => (
                <motion.div 
                  key={news.id || i} 
                  onClick={() => setSelectedArticle(news)}
                  style={{ 
                    background: 'white', 
                    borderRadius: '14px', 
                    overflow: 'hidden', 
                    boxShadow: '0 8px 24px rgba(0,0,0,0.06)', 
                    cursor: 'pointer',
                    border: '1px solid #e5e7eb',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease'
                  }}
                  initial={{ opacity: 0, y: 25 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }} 
                  transition={{ duration: 0.4, delay: (i % 4) * 0.08 }}
                  whileHover={{ y: -8, boxShadow: '0 18px 38px rgba(0,0,0,0.12)' }}
                >
                  {/* Photo de l'article au format Carré (1:1 comme les fiches joueurs) */}
                  <div 
                    style={{ 
                      position: 'relative', 
                      width: '100%', 
                      aspectRatio: '1 / 1', 
                      background: 'radial-gradient(circle at center, #242533 0%, #0d0d12 100%)', 
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <img 
                      src={news.img || '/condor_logo_transparent.png'} 
                      alt={news.title}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        transition: 'transform 0.4s ease'
                      }} 
                    />
                    
                    {/* Badge Catégorie */}
                    <span 
                      style={{ 
                        position: 'absolute', 
                        top: '14px', 
                        left: '14px', 
                        background: 'var(--clr-primary)', 
                        color: 'white', 
                        padding: '5px 12px', 
                        fontSize: '0.74rem', 
                        fontWeight: '800', 
                        textTransform: 'uppercase', 
                        borderRadius: '20px',
                        letterSpacing: '0.8px',
                        boxShadow: '0 4px 12px rgba(202, 2, 79, 0.45)'
                      }}
                    >
                      {news.cat || 'Club'}
                    </span>
                  </div>

                  {/* Contenu Texte sous l'image */}
                  <div style={{ padding: '1.4rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      {/* Date de publication */}
                      <span style={{ color: '#888', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '8px', fontWeight: 'bold' }}>
                        <Calendar size={13} style={{ color: 'var(--clr-primary)' }} /> {news.date || "Récemment"}
                      </span>

                      {/* Titre concis (2 lignes max) */}
                      <h3 
                        style={{ 
                          fontFamily: 'var(--font-heading)', 
                          fontSize: '1.3rem', 
                          margin: '0 0 10px', 
                          color: 'var(--clr-black)', 
                          lineHeight: 1.3,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {news.title}
                      </h3>

                      {/* Court extrait du texte (2 lignes max) */}
                      <p 
                        style={{ 
                          color: '#555', 
                          fontSize: '0.88rem', 
                          margin: 0, 
                          lineHeight: 1.5,
                          display: '-webkit-box', 
                          WebkitLineClamp: 2, 
                          WebkitBoxOrient: 'vertical', 
                          overflow: 'hidden' 
                        }}
                      >
                        {news.desc_text || news.desc}
                      </p>
                    </div>

                    {/* Bouton "En savoir plus" / "Voir plus" */}
                    <div style={{ paddingTop: '1.2rem', marginTop: '1.2rem', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedArticle(news);
                        }}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: 'var(--clr-primary)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '8px 16px',
                          fontSize: '0.84rem',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          boxShadow: '0 3px 10px rgba(202, 2, 79, 0.25)',
                          transition: 'opacity 0.2s'
                        }}
                      >
                        <span>En savoir plus</span>
                        <ArrowRight size={14} />
                      </button>

                      <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '500' }}>
                        Lire l'article
                      </span>
                    </div>

                  </div>
                </motion.div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* 4. Modal Lecture Article Complet — Image affichée en entier sans découpe */}
      {selectedArticle && (
        <div 
          onClick={() => setSelectedArticle(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.88)',
            backdropFilter: 'blur(6px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
        >
          <div 
            onClick={e => e.stopPropagation()}
            style={{
              background: 'white',
              maxWidth: '820px',
              width: '100%',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
              maxHeight: '92vh',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative'
            }}
          >
            {/* Scène Image Complète (objectFit: contain — Aucun rognage, 100% visible) */}
            <div 
              style={{ 
                position: 'relative', 
                width: '100%', 
                maxHeight: '56vh', 
                minHeight: '240px',
                background: '#090a0f', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexShrink: 0,
                borderBottom: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              <img 
                src={selectedArticle.img} 
                alt={selectedArticle.title}
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '56vh', 
                  width: 'auto', 
                  height: 'auto', 
                  objectFit: 'contain', 
                  display: 'block' 
                }} 
              />

              {/* Bouton Fermer */}
              <button 
                onClick={() => setSelectedArticle(null)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.25)',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 20,
                  transition: 'background 0.2s'
                }}
                aria-label="Fermer"
              >
                <X size={20} />
              </button>

              {/* Tag Catégorie */}
              <span 
                style={{ 
                  position: 'absolute', 
                  bottom: '16px', 
                  left: '20px', 
                  background: 'var(--clr-primary)', 
                  color: 'white', 
                  padding: '6px 14px', 
                  fontSize: '0.8rem', 
                  fontWeight: '800', 
                  textTransform: 'uppercase', 
                  borderRadius: '6px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.6)'
                }}
              >
                {selectedArticle.cat || 'Club'}
              </span>
            </div>

            {/* Corps de l'Article */}
            <div style={{ padding: '2rem 2.2rem', overflowY: 'auto', flex: 1 }}>
              <span style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Calendar size={14} style={{ color: 'var(--clr-primary)' }} /> Publié : {selectedArticle.date || "Récemment"}
              </span>

              <h2 
                style={{ 
                  fontFamily: 'var(--font-heading)', 
                  fontSize: '2.1rem', 
                  color: 'var(--clr-black)', 
                  margin: '0 0 1.5rem', 
                  lineHeight: 1.25 
                }}
              >
                {selectedArticle.title}
              </h2>

              <div 
                style={{ 
                  fontSize: '1.05rem', 
                  color: '#334155', 
                  lineHeight: 1.75, 
                  whiteSpace: 'pre-line',
                  wordBreak: 'break-word'
                }}
              >
                {selectedArticle.desc_text || selectedArticle.desc}
              </div>

              {/* Pied de l'article avec bouton fermer */}
              <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Condor École de Football — Communication Officielle</span>
                <button
                  type="button"
                  onClick={() => setSelectedArticle(null)}
                  className="btn btn-outline"
                  style={{ padding: '8px 22px', fontSize: '0.88rem', color: '#1e293b', borderColor: '#cbd5e1' }}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
