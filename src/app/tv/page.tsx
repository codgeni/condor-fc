"use client";

import { motion } from 'framer-motion';
import { Play, Tv, X, Video } from 'lucide-react';
import { useState, useEffect } from 'react';
import { fetchVideos, VideoItem, parseVideoUrl } from '@/lib/dataService';

export default function CondorTV() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('Tous');

  useEffect(() => {
    fetchVideos().then(data => {
      if (data) setVideos(data);
    });
  }, []);

  const categories = ['Tous', 'Résumé des matchs', 'En coulisse', 'Interviews & Conférences', 'Highlights'];

  const filteredVideos = activeCategory === 'Tous'
    ? videos
    : videos.filter(v => v.category === activeCategory);

  const featuredVideo = videos[0] || null;

  return (
    <div style={{ flex: 1, marginTop: '80px', background: 'var(--clr-black)', color: 'white', overflowX: 'hidden', minHeight: '100vh' }}>
      
      {/* 1. Header Condor TV */}
      <section 
        className="section-padding" 
        style={{ 
          padding: '80px 0 50px',
          background: 'linear-gradient(rgba(17,17,17,0.8), rgba(17,17,17,0.98)), url(/stadium_hero_1780681869623.png) center/cover no-repeat',
          borderBottom: '2px solid rgba(202, 2, 79, 0.4)'
        }}
      >
        <div className="container text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span style={{ color: 'var(--clr-primary)', letterSpacing: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}>MÉDIA & REPORTAGES</span>
            <h1 className="hero-title" style={{ color: 'white', fontSize: '3.8rem', margin: '10px 0' }}>Condor TV Officiel</h1>
            <p style={{ color: '#ccc', maxWidth: '700px', margin: '0 auto', fontSize: '1.2rem' }}>
              Revivez les moments forts, les résumés des rencontres de nos équipes et les séquences exclusives en immersion au sein du club.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. Vidéo à la Une (si disponible) */}
      {featuredVideo && (
        <section className="section-padding" style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
          <div className="container">
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
              <div 
                onClick={() => setSelectedVideo(featuredVideo)}
                style={{ 
                  position: 'relative', 
                  width: '100%', 
                  paddingTop: '45%', 
                  background: '#111', 
                  borderRadius: '16px', 
                  overflow: 'hidden', 
                  boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
                  cursor: 'pointer',
                  border: '1px solid #333'
                }}
              >
                <img 
                  src={featuredVideo.thumbnail || parseVideoUrl(featuredVideo.url).thumbnail || '/player_action_2_1780681894021.png'} 
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} 
                  alt={featuredVideo.title}
                />
                
                {featuredVideo.tag && (
                  <div style={{ position: 'absolute', top: '25px', left: '25px', background: 'var(--clr-primary)', color: 'white', padding: '6px 16px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                    {featuredVideo.tag}
                  </div>
                )}

                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '85px', height: '85px', background: 'var(--clr-primary)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 0 30px rgba(202, 2, 79, 0.7)' }}>
                  <Play fill="white" size={36} style={{ marginLeft: '4px' }} />
                </div>

                <div style={{ position: 'absolute', bottom: '25px', left: '25px', right: '25px', maxWidth: '850px' }}>
                  <span style={{ background: 'rgba(0,0,0,0.7)', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--clr-primary)' }}>
                    {featuredVideo.category}
                  </span>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.8rem', margin: '8px 0', textShadow: '0 2px 10px rgba(0,0,0,0.9)' }}>
                    {featuredVideo.title}
                  </h2>
                  {featuredVideo.description && (
                    <p style={{ fontSize: '1.05rem', color: '#ddd', textShadow: '0 2px 8px rgba(0,0,0,0.9)', margin: 0 }}>
                      {featuredVideo.description}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* 3. Filtre par Catégories */}
      <section style={{ borderBottom: '1px solid #222', padding: '1.5rem 0' }}>
        <div className="container" style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '5px' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                background: activeCategory === cat ? 'var(--clr-primary)' : 'rgba(255,255,255,0.06)',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '30px',
                cursor: 'pointer',
                fontFamily: 'var(--font-heading)',
                fontSize: '0.95rem',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                fontWeight: activeCategory === cat ? 'bold' : 'normal',
                transition: 'all 0.2s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* 4. Grille de Vidéos */}
      <section className="section-padding">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', margin: 0 }}>
              {activeCategory === 'Tous' ? 'Toutes les Vidéos' : activeCategory} ({filteredVideos.length})
            </h2>
          </div>

          {filteredVideos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 2rem', background: '#141414', borderRadius: '16px', border: '1px solid #222' }}>
              <Tv size={56} color="var(--clr-primary)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '10px' }}>
                Aucune vidéo dans cette catégorie
              </h3>
              <p style={{ color: '#aaa', maxWidth: '600px', margin: '0 auto', fontSize: '1.05rem' }}>
                De nouveaux résumés de matchs et séquences en coulisse seront publiés prochainement par notre cellule média.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              {filteredVideos.map((video, idx) => (
                <motion.div 
                  key={video.id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: (idx % 6) * 0.05 }}
                  whileHover={{ y: -6 }}
                  onClick={() => setSelectedVideo(video)}
                  style={{ cursor: 'pointer', background: '#1a1a1a', borderRadius: '12px', overflow: 'hidden', border: '1px solid #282828' }}
                >
                  <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', background: '#0e0e0e' }}>
                    <img 
                      src={video.thumbnail || parseVideoUrl(video.url).thumbnail || '/player_action_1_1780681882713.png'} 
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} 
                      alt={video.title}
                    />
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '50px', height: '50px', background: 'rgba(202, 2, 79, 0.85)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <Play fill="white" size={20} style={{ marginLeft: '3px' }} />
                    </div>
                    {video.duration && (
                      <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.85)', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                        {video.duration}
                      </div>
                    )}
                    <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'var(--clr-primary)', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                      {video.category}
                    </div>
                  </div>
                  
                  <div style={{ padding: '1.2rem' }}>
                    <h3 style={{ fontSize: '1.2rem', margin: '0 0 6px', lineHeight: 1.3, color: 'white' }}>{video.title}</h3>
                    {video.description && (
                      <p style={{ color: '#aaa', fontSize: '0.85rem', margin: 0, lineClamp: 2, WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {video.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. Modal de Lecture Vidéo */}
      {selectedVideo && (
        <div 
          onClick={() => setSelectedVideo(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.92)',
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
              width: '100%', 
              maxWidth: '900px', 
              background: '#151515', 
              borderRadius: '16px', 
              overflow: 'hidden', 
              border: '1px solid #333',
              boxShadow: '0 25px 60px rgba(0,0,0,0.9)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', borderBottom: '1px solid #282828' }}>
              <div>
                <span style={{ color: 'var(--clr-primary)', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>{selectedVideo.category}</span>
                <h4 style={{ margin: 0, fontSize: '1.2rem', color: 'white' }}>{selectedVideo.title}</h4>
              </div>
              <button 
                onClick={() => setSelectedVideo(null)} 
                style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', padding: '5px' }}
              >
                <X size={24} />
              </button>
            </div>

            <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', background: '#000' }}>
              <iframe 
                src={selectedVideo.url.includes('?') ? `${selectedVideo.url}&autoplay=1` : `${selectedVideo.url}?autoplay=1`} 
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
              />
            </div>

            {selectedVideo.description && (
              <div style={{ padding: '15px 20px', color: '#ccc', fontSize: '0.95rem' }}>
                {selectedVideo.description}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
