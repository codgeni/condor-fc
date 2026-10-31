"use client";

import { motion } from 'framer-motion';
import { Play, Tv, Clock, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';
import { 
  fetchVideos, VideoItem, parseVideoUrl,
  fetchSiteContent, SiteContent, DEFAULT_SITE_CONTENT,
  getInitialVideos, getInitialSiteContent
} from '@/lib/dataService';
import { formatRelativeTime } from '@/lib/timeUtils';

export default function CondorTV() {
  const [videos, setVideos] = useState<VideoItem[]>(() => getInitialVideos());
  const [siteContent, setSiteContent] = useState<SiteContent>(() => getInitialSiteContent());
  const [activeCategory, setActiveCategory] = useState<string>('Tous');

  useEffect(() => {
    fetchVideos().then(data => {
      if (data) setVideos(data);
    });
    fetchSiteContent().then(content => {
      if (content) setSiteContent(content);
    });
  }, []);

  const categories = ['Tous', 'Résumé des matchs', 'En coulisse', 'Interviews & Conférences', 'Highlights'];

  const filteredVideos = videos.filter(v => {
    return activeCategory === 'Tous' || v.category === activeCategory;
  });

  const featuredVideo = videos[0] || null;

  return (
    <div style={{ flex: 1, marginTop: '80px', background: 'var(--clr-black)', color: 'white', overflowX: 'hidden', minHeight: '100vh' }}>
      
      {/* 1. Header Condor TV */}
      <section 
        className="section-padding" 
        style={{ 
          padding: '80px 0 50px',
          background: `linear-gradient(rgba(17,17,17,0.8), rgba(17,17,17,0.98)), url(${siteContent.tv_hero_bg || '/uploads/site-data-tv_hero_bg.webp'}) center/cover no-repeat`,
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

      {/* 2. Vidéo à la Une (Direct Link vers YouTube / TikTok) */}
      {featuredVideo && (
        <section className="section-padding" style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
          <div className="container">
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
              {(() => {
                const featThumb = featuredVideo.thumbnail || parseVideoUrl(featuredVideo.url).thumbnail || '/player_action_2_1780681894021.png';

                return (
                  <a
                    href={featuredVideo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                  >
                    <div 
                      style={{ 
                        position: 'relative', 
                        width: '100%', 
                        paddingTop: '46%', 
                        background: '#111', 
                        borderRadius: '16px', 
                        overflow: 'hidden', 
                        boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
                        cursor: 'pointer',
                        border: '1px solid #333',
                        transition: 'transform 0.3s ease, border-color 0.3s ease'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'scale(1.008)';
                        e.currentTarget.style.borderColor = 'var(--clr-primary)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.borderColor = '#333';
                      }}
                    >
                      <img 
                        src={featThumb} 
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} 
                        alt={featuredVideo.title}
                      />
                      
                      {/* Gradient overlay for readability */}
                      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.2) 100%)' }} />

                      {/* Play Button Overlay */}
                      <div style={{ 
                        position: 'absolute', 
                        top: '50%', 
                        left: '50%', 
                        transform: 'translate(-50%, -50%)', 
                        width: '85px', 
                        height: '85px', 
                        background: 'var(--clr-primary)', 
                        borderRadius: '50%', 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        boxShadow: '0 0 35px rgba(202, 2, 79, 0.85)',
                        zIndex: 2
                      }}>
                        <Play fill="white" size={36} style={{ marginLeft: '4px' }} />
                      </div>

                      {/* Bottom Info & Direct Link Notice */}
                      <div style={{ position: 'absolute', bottom: '25px', left: '25px', right: '25px', maxWidth: '850px', zIndex: 2 }}>
                        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.8rem', margin: '8px 0', textShadow: '0 2px 10px rgba(0,0,0,0.9)' }}>
                          {featuredVideo.title}
                        </h2>

                        {featuredVideo.description && (
                          <p style={{ fontSize: '1.05rem', color: '#ddd', textShadow: '0 2px 8px rgba(0,0,0,0.9)', margin: '0 0 12px' }}>
                            {featuredVideo.description}
                          </p>
                        )}

                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#fff', background: 'rgba(202, 2, 79, 0.95)', padding: '8px 18px', borderRadius: '30px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                          Regarder la vidéo <ExternalLink size={16} />
                        </div>
                      </div>
                    </div>
                  </a>
                );
              })()}
            </motion.div>
          </div>
        </section>
      )}

      {/* 3. Filtre par Catégories */}
      <section style={{ borderBottom: '1px solid #222', padding: '1.5rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.8rem', overflowX: 'auto', paddingBottom: '5px' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  background: activeCategory === cat ? 'var(--clr-primary)' : 'rgba(255,255,255,0.06)',
                  color: 'white',
                  border: 'none',
                  padding: '8px 18px',
                  borderRadius: '30px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.9rem',
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
        </div>
      </section>

      {/* 4. Grille de Vidéos Responsive */}
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '2rem', alignItems: 'start' }}>
              {filteredVideos.map((video, idx) => {
                const thumbSrc = video.thumbnail || parseVideoUrl(video.url).thumbnail || '/player_action_1_1780681882713.png';

                return (
                  <motion.a 
                    key={video.id || idx}
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: (idx % 6) * 0.05 }}
                    whileHover={{ y: -6 }}
                    style={{ 
                      cursor: 'pointer', 
                      background: '#1a1a1a', 
                      borderRadius: '16px', 
                      overflow: 'hidden', 
                      border: '1px solid #282828',
                      textDecoration: 'none',
                      color: 'inherit',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.5)'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'var(--clr-primary)';
                      e.currentTarget.style.boxShadow = '0 12px 35px rgba(202, 2, 79, 0.25)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = '#282828';
                      e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.5)';
                    }}
                  >
                    {/* Zone Miniature Standard 16:9 */}
                    <div 
                      style={{ 
                        position: 'relative', 
                        width: '100%', 
                        aspectRatio: '16 / 9',
                        background: '#0e0e0e',
                        overflow: 'hidden'
                      }}
                    >
                      <img 
                        src={thumbSrc} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }} 
                        alt={video.title}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                      />

                      {/* Play Icon Glow */}
                      <div style={{ 
                        position: 'absolute', 
                        top: '50%', 
                        left: '50%', 
                        transform: 'translate(-50%, -50%)', 
                        width: '52px', 
                        height: '52px', 
                        background: 'rgba(202, 2, 79, 0.9)', 
                        borderRadius: '50%', 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        boxShadow: '0 0 25px rgba(202, 2, 79, 0.7)'
                      }}>
                        <Play fill="white" size={22} style={{ marginLeft: '3px' }} />
                      </div>
                    </div>
                    
                    {/* Détails de la vidéo */}
                    <div style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      {video.created_at && (
                        <div style={{ marginBottom: '8px' }}>
                          <span style={{ color: '#94a3b8', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
                            <Clock size={12} /> {formatRelativeTime(video.created_at)}
                          </span>
                        </div>
                      )}

                      <h3 style={{ fontSize: '1.25rem', margin: '0 0 8px', lineHeight: 1.3, color: 'white' }}>
                        {video.title}
                      </h3>

                      {video.description && (
                        <p style={{ color: '#aaa', fontSize: '0.85rem', margin: '0 0 16px', lineClamp: 2, WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {video.description}
                        </p>
                      )}

                      {/* Bouton direct "Ouvrir la vidéo" */}
                      <div style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid #2a2a2a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--clr-primary)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          Regarder la vidéo <ExternalLink size={14} />
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#888' }}>
                          Ouvrir ↗
                        </span>
                      </div>
                    </div>
                  </motion.a>
                );
              })}
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
