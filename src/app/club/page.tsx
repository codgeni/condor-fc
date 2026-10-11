"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ShieldCheck, Search, X, Users, Sparkles, Heart, Flag, Zap } from 'lucide-react';
import { 
  fetchStaff, StaffMember, DEFAULT_STAFF,
  fetchTimeline, TimelineItem, DEFAULT_TIMELINE,
  fetchSiteContent, SiteContent, DEFAULT_SITE_CONTENT,
  DEFAULT_PILLARS
} from '@/lib/dataService';

export default function Club() {
  const [staff, setStaff] = useState<StaffMember[]>(DEFAULT_STAFF);
  const [timeline, setTimeline] = useState<TimelineItem[]>(DEFAULT_TIMELINE);
  const [siteContent, setSiteContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [selectedStaffCat, setSelectedStaffCat] = useState<string>('all');
  const [staffSearch, setStaffSearch] = useState<string>('');
  const [activeModalMember, setActiveModalMember] = useState<StaffMember | null>(null);

  useEffect(() => {
    fetchStaff().then(data => {
      if (data && data.length > 0) setStaff(data);
    });
    fetchTimeline().then(data => {
      if (data && data.length > 0) setTimeline(data);
    });
    fetchSiteContent().then(data => {
      if (data) setSiteContent(data);
    });
  }, []);

  const getStaffCategory = (role: string) => {
    const r = (role || '').toLowerCase();
    if (r.includes('conseiller') || r.includes('planificateur') || r.includes('directeur')) {
      return 'Direction & Conseil';
    }
    if (r.includes('formateur') || r.includes('formatrice') || r.includes('entraîneur')) {
      return 'Formateurs & Staff Technique';
    }
    if (r.includes('logistique') || r.includes('outilleur') || r.includes('outillero')) {
      return 'Logistique & Matériel';
    }
    return 'Administration & Médical';
  };

  const sortedStaff = [...staff].sort((a, b) => (a.order || 0) - (b.order || 0));

  const filteredStaff = sortedStaff.filter(member => {
    const matchesCat = 
      selectedStaffCat === 'all' || 
      getStaffCategory(member.role) === selectedStaffCat;
    const matchesSearch = 
      !staffSearch.trim() ||
      member.name.toLowerCase().includes(staffSearch.toLowerCase()) ||
      member.role.toLowerCase().includes(staffSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div style={{ flex: 1, marginTop: '80px', overflowX: 'hidden' }}>
      
      {/* 1. Page Header */}
      <section 
        className="section-padding bg-black text-white" 
        style={{ 
          textAlign: 'center', 
          padding: '100px 0', 
          position: 'relative', 
          overflow: 'hidden',
          background: `linear-gradient(rgba(17,17,17,0.7), rgba(17,17,17,0.9)), url(${siteContent.club_hero_bg || '/club_hero.png'}) center/cover no-repeat`
        }}
      >
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }} style={{ position: 'relative', zIndex: 10 }}>
          <img src="/condor_logo_transparent.png" alt="Condor FC" style={{ width: '150px', margin: '0 auto 2rem', borderRadius: '50%' }} />
          <h1 className="hero-title" style={{ color: 'white', fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', marginBottom: '1.2rem' }}>{siteContent.about_title || "Plus Qu'une École, Une Famille."}</h1>
          <p style={{ fontSize: '1.15rem', color: 'rgba(255, 255, 255, 0.85)', maxWidth: '780px', margin: '0 auto', lineHeight: 1.65, fontWeight: 400 }}>
            {siteContent.about_text || "Depuis Mai 2023, la Condor École de Football est un symbole d'excellence, d'éducation et de passion sportive à Delmas, Haïti. Nous formons les leaders et les champions de demain."}
          </p>
        </motion.div>
      </section>

      {/* Philosophie & Objectifs de Coaching */}
      <section className="section-padding" style={{ background: '#fdfdfd', borderBottom: '1px solid #eee' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ color: 'var(--clr-primary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>
              {siteContent.club_philo_tag || "Notre Philosophie"}
            </span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', margin: '5px 0' }}>
              {siteContent.club_philo_title || "Philosophie de Coaching"}
            </h2>
            <p style={{ color: 'var(--clr-gray)', fontSize: '1.1rem', marginTop: '10px' }}>
              {siteContent.club_philo_intro || "Notre philosophie de coaching des joueurs s’articule autour des objectifs fondamentaux suivants :"}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {(siteContent.club_philo_objectives && siteContent.club_philo_objectives.length > 0 
              ? siteContent.club_philo_objectives 
              : DEFAULT_SITE_CONTENT.club_philo_objectives || []
            ).map((objText, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', border: '1px solid #f0f0f0' }}
              >
                <div style={{ width: '40px', height: '40px', background: 'var(--clr-primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', flexShrink: 0 }}>
                  {idx + 1}
                </div>
                <p style={{ fontSize: '1.15rem', color: '#333', margin: '8px 0 0', lineHeight: 1.5 }}>{objText}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Valeurs Spirituelles, Civiques, Sociales et Morales */}
      <section className="section-padding" style={{ background: '#f5f7fa' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span style={{ color: 'var(--clr-primary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>
              {siteContent.club_values_tag || "Fondation Morale"}
            </span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', margin: '5px 0' }}>
              {siteContent.club_values_title || "Nos Valeurs & Engagements"}
            </h2>
            <p style={{ color: 'var(--clr-gray)', maxWidth: '800px', margin: '15px auto 0', fontSize: '1.15rem', lineHeight: 1.6 }}>
              {siteContent.club_values_intro || "Nos valeurs influencent nos choix, nos actions ainsi que notre satisfaction de vie parce que notre vie concorde avec les valeurs qui sont des références déterminantes pour notre vie personnelle et professionnelle. Ces valeurs spirituelles, civiques et morales que nous inculquons à nos élèves les canaliseront à prendre des décisions futures qui reflètent des actions et des croyances orientées vers la satisfaction des besoins individuels et collectifs."}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', marginBottom: '4rem' }}>
            
            {/* Dieu */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ background: 'white', padding: '2.5rem', borderRadius: '16px', border: '1px solid #eee', boxShadow: '0 8px 30px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1.5rem' }}>
                <div style={{ width: '50px', height: '50px', background: 'rgba(224, 30, 38, 0.08)', color: 'var(--clr-primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Heart size={24} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', margin: 0 }}>
                  {siteContent.club_val_god_title || "Dieu"}
                </h3>
              </div>
              <p style={{ color: '#555', lineHeight: 1.6 }}>
                {siteContent.club_val_god_desc || "Nous plaçons la foi et la reconnaissance au cœur de notre développement. L’humilité devant le Créateur forge le caractère de nos athlètes."}
              </p>
            </motion.div>

            {/* Patrie */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} style={{ background: 'white', padding: '2.5rem', borderRadius: '16px', border: '1px solid #eee', boxShadow: '0 8px 30px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1.5rem' }}>
                <div style={{ width: '50px', height: '50px', background: 'rgba(224, 30, 38, 0.08)', color: 'var(--clr-primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Flag size={24} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', margin: 0 }}>
                  {siteContent.club_val_patrie_title || "Patrie"}
                </h3>
              </div>
              <p style={{ color: '#555', lineHeight: 1.6 }}>
                {siteContent.club_val_patrie_desc || "L'amour de notre pays, Haïti, et la volonté de faire briller notre nation sur l'échiquier sportif international guident notre travail quotidien."}
              </p>
            </motion.div>

            {/* Discipline */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} style={{ background: 'white', padding: '2.5rem', borderRadius: '16px', border: '1px solid #eee', boxShadow: '0 8px 30px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1.5rem' }}>
                <div style={{ width: '50px', height: '50px', background: 'rgba(224, 30, 38, 0.08)', color: 'var(--clr-primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Zap size={24} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', margin: 0 }}>
                  {siteContent.club_val_discipline_title || "Discipline"}
                </h3>
              </div>
              <p style={{ color: '#555', lineHeight: 1.6 }}>
                {siteContent.club_val_discipline_desc || "La rigueur et l'auto-discipline sont les clés pour transformer le talent brut en excellence durable, sur le terrain comme à l'école."}
              </p>
            </motion.div>
          </div>

          {/* Grille des 6 Piliers Fondamentaux */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {(siteContent.club_pillars && siteContent.club_pillars.length > 0 ? siteContent.club_pillars : DEFAULT_PILLARS).map((val, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: (idx % 3) * 0.1 }}
                style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #eee', boxShadow: '0 4px 15px rgba(0,0,0,0.01)' }}
              >
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', color: 'var(--clr-primary)', margin: '0 0 5px' }}>{val.title}</h3>
                <span style={{ fontSize: '0.9rem', color: '#888', fontStyle: 'italic', display: 'block', marginBottom: '15px', textTransform: 'uppercase' }}>{val.subtitle}</span>
                <p style={{ fontSize: '0.95rem', color: '#555', lineHeight: 1.6, margin: 0 }}>{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Timeline Historique Dynamique */}
      <section className="section-padding bg-gray">
        <div className="container">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', marginBottom: '3rem', textAlign: 'center' }}>
            {siteContent.club_timeline_title || "Notre Parcours & Palmarès"}
          </h2>
          <div style={{ position: 'relative', borderLeft: '4px solid var(--clr-primary)', marginLeft: '20px', paddingLeft: '40px', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {[...timeline].sort((a, b) => (a.order || 0) - (b.order || 0)).map((era, i) => (
              <motion.div key={era.id || i} initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-50px', top: 0, width: '16px', height: '16px', background: 'var(--clr-primary)', borderRadius: '50%', border: '4px solid white' }}></div>
                <h3 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', color: 'var(--clr-primary)', margin: 0 }}>{era.year}</h3>
                <h4 style={{ fontSize: '1.5rem', margin: '5px 0' }}>{era.title}</h4>
                <p style={{ color: 'var(--clr-black-light)', fontSize: '1.1rem', maxWidth: '600px' }}>{era.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Section Staff Dynamique */}
      <section className="section-padding" style={{ background: '#f8fafc', position: 'relative' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ color: 'var(--clr-primary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <Users size={18} /> {siteContent.club_staff_tag || "L'Équipe d'Encadrement"}
            </span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '3.2rem', margin: '8px 0 12px' }}>
              {siteContent.club_staff_title || "Notre Staff"}
            </h2>
            <p style={{ color: 'var(--clr-gray)', maxWidth: '650px', margin: '0 auto', fontSize: '1.15rem', lineHeight: 1.6 }}>
              {siteContent.club_staff_desc || "Découvrez les professionnels dévoués qui encadrent, guident et développent le potentiel de chaque jeune athlète au quotidien."}
            </p>

            {/* Barre de Recherche & Filtres par catégorie */}
            <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.2rem' }}>
              
              {/* Champ Recherche */}
              <div style={{ position: 'relative', width: '100%', maxWidth: '460px' }}>
                <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
                <input 
                  type="text"
                  placeholder="Rechercher par nom ou fonction..."
                  value={staffSearch}
                  onChange={e => setStaffSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 18px 12px 45px',
                    borderRadius: '30px',
                    border: '1px solid #ddd',
                    background: 'white',
                    fontSize: '0.95rem',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                    outline: 'none'
                  }}
                />
                {staffSearch && (
                  <button 
                    onClick={() => setStaffSearch('')}
                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Filtres par Catégorie */}
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px' }}>
                {[
                  { id: 'all', label: `Tous (${sortedStaff.length})` },
                  { id: 'Direction & Conseil', label: `Direction & Conseil (${sortedStaff.filter(s => getStaffCategory(s.role) === 'Direction & Conseil').length})` },
                  { id: 'Formateurs & Staff Technique', label: `Formateurs & Technique (${sortedStaff.filter(s => getStaffCategory(s.role) === 'Formateurs & Staff Technique').length})` },
                  { id: 'Administration & Médical', label: `Administration & Médical (${sortedStaff.filter(s => getStaffCategory(s.role) === 'Administration & Médical').length})` },
                  { id: 'Logistique & Matériel', label: `Logistique & Matériel (${sortedStaff.filter(s => getStaffCategory(s.role) === 'Logistique & Matériel').length})` }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedStaffCat(tab.id)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '25px',
                      border: selectedStaffCat === tab.id ? '2px solid var(--clr-primary)' : '1px solid #e2e8f0',
                      background: selectedStaffCat === tab.id ? 'var(--clr-primary)' : 'white',
                      color: selectedStaffCat === tab.id ? 'white' : '#475569',
                      fontWeight: selectedStaffCat === tab.id ? '700' : '500',
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      boxShadow: selectedStaffCat === tab.id ? '0 4px 12px rgba(224, 30, 38, 0.25)' : 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grille du Staff */}
          {filteredStaff.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'white', borderRadius: '16px', border: '1px solid #eee' }}>
              <Users size={48} color="#ccc" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.4rem', color: '#444' }}>Aucun membre du staff trouvé</h3>
              <p style={{ color: '#888', marginTop: '6px' }}>Essayez de modifier votre recherche ou sélectionnez une autre catégorie.</p>
              <button 
                onClick={() => { setStaffSearch(''); setSelectedStaffCat('all'); }}
                className="btn btn-outline"
                style={{ marginTop: '1rem' }}
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
              {filteredStaff.map((member, i) => (
                <motion.div
                  key={member.id || i}
                  onClick={() => setActiveModalMember(member)}
                  style={{
                    background: 'white',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.03)',
                    border: '1px solid #eef2f6',
                    textAlign: 'center',
                    padding: '2rem 1.4rem 1.6rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'relative'
                  }}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: (i % 6) * 0.05 }}
                  whileHover={{ y: -7, boxShadow: '0 16px 35px rgba(224, 30, 38, 0.12)', borderColor: 'rgba(224, 30, 38, 0.35)' }}
                >
                  <div style={{ position: 'relative', width: '130px', height: '130px', margin: '0 auto 1.3rem' }}>
                    <div style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: '3px solid var(--clr-primary)',
                      boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
                      background: '#f8f9fa'
                    }}>
                      <img 
                        src={member.img || '/condor_logo_transparent.png'} 
                        alt={member.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%' }} 
                      />
                    </div>
                    <div style={{
                      position: 'absolute',
                      bottom: '2px',
                      right: '4px',
                      background: 'var(--clr-primary)',
                      color: 'white',
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid white',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                    }}>
                      <ShieldCheck size={14} />
                    </div>
                  </div>

                  <span style={{
                    fontSize: '0.72rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.8px',
                    fontWeight: '700',
                    color: '#64748b',
                    background: '#f1f5f9',
                    padding: '3px 10px',
                    borderRadius: '20px',
                    marginBottom: '10px'
                  }}>
                    {getStaffCategory(member.role)}
                  </span>

                  <h3 style={{ fontSize: '1.3rem', margin: '0 0 6px', color: 'var(--clr-black)', fontFamily: 'var(--font-heading)', fontWeight: 'bold' }}>
                    {member.name}
                  </h3>
                  
                  <span style={{ 
                    color: 'var(--clr-primary)', 
                    fontSize: '0.95rem', 
                    fontWeight: '700', 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.5px',
                    lineHeight: 1.3
                  }}>
                    {member.role}
                  </span>

                  <div style={{ 
                    marginTop: '1.2rem', 
                    paddingTop: '0.8rem', 
                    borderTop: '1px dashed #e2e8f0', 
                    width: '100%', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    gap: '6px', 
                    color: '#94a3b8', 
                    fontSize: '0.82rem',
                    fontWeight: '500'
                  }}>
                    <span>Agrandir la photo</span>
                    <span style={{ color: 'var(--clr-primary)', fontWeight: 'bold' }}>→</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Lightbox Photo Haute Résolution */}
        <AnimatePresence>
          {activeModalMember && (
            <div 
              onClick={() => setActiveModalMember(null)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.8)',
                backdropFilter: 'blur(6px)',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px'
              }}
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                style={{
                  background: 'white',
                  borderRadius: '20px',
                  maxWidth: '440px',
                  width: '100%',
                  overflow: 'hidden',
                  boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
                  position: 'relative'
                }}
              >
                <button
                  onClick={() => setActiveModalMember(null)}
                  style={{
                    position: 'absolute',
                    top: '14px',
                    right: '14px',
                    background: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10
                  }}
                >
                  <X size={20} />
                </button>

                <div style={{ position: 'relative', width: '100%', paddingTop: '100%', background: '#0a0a0a', overflow: 'hidden' }}>
                  <img 
                    src={activeModalMember.img || '/condor_logo_transparent.png'} 
                    alt={activeModalMember.name} 
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%' }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
                    padding: '25px 20px 15px',
                    color: 'white'
                  }}>
                    <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '1.5px', background: 'var(--clr-primary)', padding: '3px 10px', borderRadius: '12px', fontWeight: 'bold' }}>
                      Condor École de Football
                    </span>
                  </div>
                </div>

                <div style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
                  <h3 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-heading)', margin: '0 0 6px', color: '#111' }}>
                    {activeModalMember.name}
                  </h3>
                  <p style={{ color: 'var(--clr-primary)', fontSize: '1.1rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 1rem' }}>
                    {activeModalMember.role}
                  </p>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#f1f5f9', padding: '6px 16px', borderRadius: '20px', fontSize: '0.88rem', color: '#475569' }}>
                    <ShieldCheck size={16} color="var(--clr-primary)" />
                    <span>Membre officiel de l'encadrement Condor FC</span>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </section>

      {/* 4. L'Hymne de Condor */}
      <section className="section-padding" style={{ background: 'linear-gradient(rgba(224, 30, 38, 0.9), rgba(224, 30, 38, 0.95)), url(/club_hero.png) center/cover', color: 'white' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', marginBottom: '2rem', color: 'white' }}>
            {siteContent.club_anthem_title || "L'Hymne de Condor"}
          </h2>
          <div style={{ fontSize: '1.2rem', lineHeight: 1.8, fontStyle: 'italic', background: 'rgba(0,0,0,0.2)', padding: '3rem', borderRadius: '16px' }}>
            <p style={{ marginBottom: '1.5rem', whiteSpace: 'pre-line' }}>
              <strong style={{ color: 'black' }}>(Couplet 1)</strong><br />
              {siteContent.club_anthem_couplet1 || "Pas à pas nous traçons notre chemin, Jusqu'à toucher le ciel, notre destin.\nDéployons nos ailes, voguons sans limite, Élargissons nos horizons, vivons l'infini."}
            </p>
            <p style={{ marginBottom: '1.5rem', fontWeight: 'bold', whiteSpace: 'pre-line' }}>
              <strong style={{ color: 'black' }}>(Refrain)</strong><br />
              {siteContent.club_anthem_refrain || "Travaillons dur pour être des élites, Pensons constructivement, unissons nos passions.\nÉvoluons harmonieusement, sans peur ni frayeur, Ensemble, atteignons les sommets avec grandeur."}
            </p>
            <p style={{ marginBottom: '1.5rem', whiteSpace: 'pre-line' }}>
              <strong style={{ color: 'black' }}>(Couplet 2)</strong><br />
              {siteContent.club_anthem_couplet2 || "N'abandonnons jamais, poursuivons nos rêves, Concrétisons nos aspirations, qu'ils s'élèvent.\nNous sommes le changement, l'avenir de demain, Unis par le cordon, jamais nous ne faisons le vain."}
            </p>
            <p style={{ marginBottom: '1.5rem', whiteSpace: 'pre-line' }}>
              <strong style={{ color: 'black' }}>(Pont)</strong><br />
              {siteContent.club_anthem_pont || "Les plus forts, les plus hauts dans le score, Unis dans l'effort, nous gravirons les échelons,\nDans l'unité, nous trouvons notre puissance, Porteurs d'espoir, symboles de persévérance."}
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
