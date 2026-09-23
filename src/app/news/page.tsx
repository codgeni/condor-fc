"use client";

import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, X, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function News() {
  const [allNews, setAllNews] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          setAllNews(data);
        }
      } catch (err) {
        console.warn("Supabase fetch news error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const categories = ['Tous', 'Match', 'Transferts', 'Entraînement', 'Académie', 'Club', 'Récompense'];

  const filteredNews = selectedCategory === 'Tous'
    ? allNews
    : allNews.filter(n => (n.cat || '').toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div style={{ flex: 1, marginTop: '80px', overflowX: 'hidden', minHeight: '100vh', background: '#f8f9fa' }}>
      
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
          <span style={{ color: 'var(--clr-primary)', letterSpacing: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}>Le Journal du Condor</span>
          <h1 className="hero-title" style={{ color: 'white', fontSize: '3.5rem', marginTop: '10px' }}>Actualités Officielles</h1>
          <p style={{ fontSize: '1.2rem', color: '#ccc', maxWidth: '650px', margin: '15px auto 0' }}>
            Suivez en direct la vie du club, les résultats des matchs, les communiqués de presse et l'évolution de nos jeunes athlètes.
          </p>
        </motion.div>
      </section>

      {/* Catégories Filter */}
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
                transition: 'all 0.2s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Rubrique Actualités */}
      <section className="section-padding">
        <div className="container">
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: '#888' }}>
              <p>Chargement des actualités...</p>
            </div>
          ) : filteredNews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'white', borderRadius: '16px', border: '1px solid #eee', maxWidth: '700px', margin: '0 auto' }}>
              <BookOpen size={48} color="var(--clr-primary)" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>Aucun article publié pour le moment</h3>
              <p style={{ color: '#666', fontSize: '1rem', lineHeight: 1.6 }}>
                Notre rédaction sportive prépare les prochains reportages et communiqués officiels du Condor FC.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
              {filteredNews.map((news, i) => (
                <motion.div 
                  key={news.id || i} 
                  onClick={() => setSelectedArticle(news)}
                  style={{ 
                    background: 'white', 
                    borderRadius: '12px', 
                    overflow: 'hidden', 
                    boxShadow: '0 8px 25px rgba(0,0,0,0.05)', 
                    cursor: 'pointer',
                    border: '1px solid #eee',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '460px'
                  }}
                  initial={{ opacity: 0, y: 30 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }} 
                  transition={{ duration: 0.4, delay: (i % 3) * 0.1 }}
                  whileHover={{ y: -8, boxShadow: '0 15px 35px rgba(0,0,0,0.1)' }}
                >
                  {/* Image */}
                  <div style={{ height: '220px', position: 'relative', overflow: 'hidden' }}>
                    <img src={news.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={news.title} />
                    <span style={{ position: 'absolute', top: '15px', left: '15px', background: 'var(--clr-primary)', color: 'white', padding: '4px 10px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', borderRadius: '4px' }}>
                      {news.cat}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ color: 'var(--clr-gray)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '8px', fontWeight: 'bold' }}>
                        <Calendar size={13} /> {news.date || "Récemment"}
                      </span>
                      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', margin: '0 0 10px', color: 'var(--clr-black)', lineHeight: 1.3 }}>
                        {news.title}
                      </h3>
                      <p style={{ color: '#666', fontSize: '0.9rem', margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {news.desc_text || news.desc}
                      </p>
                    </div>

                    <span style={{ color: 'var(--clr-primary)', fontWeight: 'bold', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '10px' }}>
                      Lire l'article complet <ArrowRight size={14} />
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* Modal Lecture Article Complet */}
      {selectedArticle && (
        <div 
          onClick={() => setSelectedArticle(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.85)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
          }}
        >
          <div 
            onClick={e => e.stopPropagation()}
            style={{
              background: 'white',
              maxWidth: '750px',
              width: '100%',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{ position: 'relative', height: '280px', flexShrink: 0 }}>
              <img src={selectedArticle.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={selectedArticle.title} />
              <button 
                onClick={() => setSelectedArticle(null)}
                style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  background: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={20} />
              </button>
              <span style={{ position: 'absolute', bottom: '15px', left: '20px', background: 'var(--clr-primary)', color: 'white', padding: '5px 12px', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', borderRadius: '4px' }}>
                {selectedArticle.cat}
              </span>
            </div>

            <div style={{ padding: '2rem', overflowY: 'auto' }}>
              <span style={{ color: 'var(--clr-gray)', fontSize: '0.85rem', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
                Publié : {selectedArticle.date || "Récemment"}
              </span>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--clr-black)', margin: '0 0 1.5rem', lineHeight: 1.25 }}>
                {selectedArticle.title}
              </h2>
              <div style={{ fontSize: '1.05rem', color: '#444', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                {selectedArticle.desc_text || selectedArticle.desc}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
