"use client";

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Calendar, Phone, Mail, MapPin, CheckCircle, Clock, User, PhoneCall } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { fetchStages, StageSession } from '@/lib/dataService';
import { sanitizeFormRecord, checkRateLimit } from '@/lib/security';

export default function Stages() {
  const [stages, setStages] = useState<StageSession[]>([]);
  const [stageFormData, setStageFormData] = useState({
    nom: '', prenom: '', dob: '', tel: '', photo: '', stage: '', note: ''
  });
  const [rdvFormData, setRdvFormData] = useState({
    parentNom: '', enfantNom: '', tel: '', date: '', heure: '', raison: 'Inscription académique'
  });
  
  const [stageSubmitted, setStageSubmitted] = useState(false);
  const [rdvSubmitted, setRdvSubmitted] = useState(false);

  useEffect(() => {
    fetchStages().then(data => {
      if (data) setStages(data);
    });
  }, []);

  const handleStageChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setStageFormData({ ...stageFormData, [e.target.name]: e.target.value });
  };

  const handleRdvChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setRdvFormData({ ...rdvFormData, [e.target.name]: e.target.value });
  };

  const handleStageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Protection anti-flood
    const rateCheck = checkRateLimit('stage_registration', 3000);
    if (!rateCheck.allowed) {
      alert(`Veuillez patienter ${rateCheck.remainingSeconds} seconde(s) avant de soumettre à nouveau.`);
      return;
    }

    const sanitized = sanitizeFormRecord(stageFormData);

    // Save to Supabase Table 'stages_inscriptions'
    const { error } = await supabase.from('stages_inscriptions').insert({
      nom: sanitized.nom,
      prenom: sanitized.prenom,
      dob: sanitized.dob,
      tel: sanitized.tel,
      stage: sanitized.stage,
      note: sanitized.note,
      photo: sanitized.photo
    });

    if (error) {
      console.error('Error submitting stage registration:', error);
      alert('Une erreur est survenue lors de l\'envoi de l\'inscription.');
      return;
    }

    setStageSubmitted(true);
    setTimeout(() => {
      setStageSubmitted(false);
      setStageFormData({ nom: '', prenom: '', dob: '', tel: '', photo: '', stage: '', note: '' });
    }, 4000);
  };

  const handleRdvSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Protection anti-flood
    const rateCheck = checkRateLimit('rdv_booking', 3000);
    if (!rateCheck.allowed) {
      alert(`Veuillez patienter ${rateCheck.remainingSeconds} seconde(s) avant de réserver à nouveau.`);
      return;
    }

    const sanitized = sanitizeFormRecord(rdvFormData);

    // Save to Supabase Table 'appointments'
    const { error } = await supabase.from('appointments').insert({
      parent_nom: sanitized.parentNom,
      enfant_nom: sanitized.enfantNom,
      tel: sanitized.tel,
      date: sanitized.date,
      heure: sanitized.heure,
      raison: sanitized.raison
    });

    if (error) {
      console.error('Error booking appointment:', error);
      alert('Une erreur est survenue lors de la prise de rendez-vous.');
      return;
    }

    setRdvSubmitted(true);
    setTimeout(() => {
      setRdvSubmitted(false);
      setRdvFormData({ parentNom: '', enfantNom: '', tel: '', date: '', heure: '', raison: 'Inscription académique' });
    }, 4000);
  };

  const sectionTitleStyle = {
    fontFamily: 'var(--font-heading)',
    fontSize: '2rem',
    textTransform: 'uppercase' as const,
    borderBottom: '2px solid #ddd',
    paddingBottom: '10px',
    marginBottom: '1.5rem',
    color: 'var(--clr-black)',
  };

  const labelStyle = { display: 'block', fontSize: '0.85rem', textTransform: 'uppercase' as const, letterSpacing: '1px', marginBottom: '8px', color: 'var(--clr-gray)' };
  const inputStyle = { width: '100%', padding: '12px 16px', background: 'white', border: '1px solid #ddd', borderRadius: '8px', color: 'var(--clr-black)', fontSize: '1rem', outline: 'none', marginBottom: '1rem' };

  return (
    <div style={{ flex: 1, marginTop: '80px', background: '#f8f9fa', minHeight: '100vh' }}>
      
      {/* Page Header */}
      <section 
        className="section-padding bg-black text-white" 
        style={{ 
          textAlign: 'center', 
          padding: '120px 0 80px',
          background: 'linear-gradient(rgba(17,17,17,0.7), rgba(17,17,17,0.9)), url(/stadium_hero_1780681869623.png) center/cover no-repeat'
        }}
      >
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }} style={{ position: 'relative', zIndex: 10 }}>
          <span style={{ color: 'var(--clr-primary)', letterSpacing: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}>Développement & Apprentissage</span>
          <h1 className="hero-title" style={{ color: 'white', fontSize: '3.5rem', marginTop: '10px' }}>Stages & Pré-inscriptions</h1>
          <p style={{ fontSize: '1.2rem', color: '#ccc', maxWidth: '700px', margin: '15px auto 0' }}>Offrez à vos enfants l'opportunité de s'entraîner comme des professionnels lors de nos sessions de vacances intensives.</p>
        </motion.div>
      </section>

      {/* Main Container */}
      <div className="container" style={{ padding: '4rem var(--sp-lg)' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '3rem', alignItems: 'start' }}>
          
          {/* Left Column: Stage Info & Pre-inscription */}
          <div>
            
            {/* 1. Informations sur les Stages (Dynamiques) */}
            <section style={{ marginBottom: '4rem' }}>
              <h2 style={sectionTitleStyle}>Prochains Stages de Vacances</h2>
              {stages.length === 0 ? (
                <div style={{ background: 'white', padding: '2.5rem', borderRadius: '12px', border: '1px solid #eee', textAlign: 'center' }}>
                  <Calendar size={48} color="var(--clr-primary)" style={{ margin: '0 auto 1rem' }} />
                  <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>Aucune session de stage ouverte pour le moment</h3>
                  <p style={{ color: '#666', maxWidth: '500px', margin: '0 auto' }}>
                    Les prochaines sessions de stages de vacances (Pâques, Été) seront publiées ici dès leur ouverture officielle.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  {stages.map((camp, i) => (
                    <motion.div 
                      key={camp.id || i} 
                      style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 5px 15px rgba(0,0,0,0.02)', border: '1px solid #eee', borderLeft: '5px solid var(--clr-primary)' }}
                      whileHover={{ y: -3 }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>{camp.title}</h3>
                        <span style={{ color: 'var(--clr-primary)', fontWeight: 'bold', fontSize: '1.2rem' }}>{camp.price}</span>
                      </div>
                      <p style={{ color: '#555', lineHeight: 1.6, marginBottom: '1.5rem' }}>{camp.description}</p>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', fontSize: '0.9rem', color: 'var(--clr-gray)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={16} /> {camp.dates}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={16} /> {camp.time_schedule}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><User size={16} /> Catégorie : {camp.categories}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </section>

            {/* 2. Formulaire de Pré-inscription */}
            <section style={{ background: 'white', padding: '3rem', borderRadius: '16px', border: '1px solid #eee', boxShadow: '0 8px 30px rgba(0,0,0,0.03)' }}>
              <h2 style={sectionTitleStyle}>Formulaire de Pré-inscription</h2>
              
              {stageSubmitted ? (
                <div style={{ textAlign: 'center', padding: '3rem 0', color: '#155724' }}>
                  <CheckCircle size={64} color="green" style={{ margin: '0 auto 1.5rem' }} />
                  <h3>Demande de Pré-inscription Transmise !</h3>
                  <p style={{ color: '#555', marginTop: '10px' }}>Le secrétariat du club étudiera votre demande et vous contactera très rapidement pour valider l'inscription.</p>
                </div>
              ) : (
                <form onSubmit={handleStageSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={labelStyle}>Nom de l'enfant</label>
                      <input type="text" name="nom" required value={stageFormData.nom} onChange={handleStageChange} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Prénom de l'enfant</label>
                      <input type="text" name="prenom" required value={stageFormData.prenom} onChange={handleStageChange} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Date de naissance</label>
                      <input type="date" name="dob" required value={stageFormData.dob} onChange={handleStageChange} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Téléphone Responsable</label>
                      <input type="tel" name="tel" required value={stageFormData.tel} onChange={handleStageChange} style={inputStyle} placeholder="Ex: +509 3123 4567" />
                    </div>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={labelStyle}>Choisir la session de Stage</label>
                    <select name="stage" required value={stageFormData.stage} onChange={handleStageChange} style={inputStyle}>
                      <option value="">-- Sélectionner une session --</option>
                      {stages.length > 0 ? (
                        stages.map((camp, idx) => (
                          <option key={camp.id || idx} value={camp.title}>{camp.title} ({camp.categories})</option>
                        ))
                      ) : (
                        <option value="Pré-inscription Session Prochaine">Session Prochaine (Générale)</option>
                      )}
                    </select>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={labelStyle}>Remarques ou Besoins Particuliers (Optionnel)</label>
                    <textarea name="note" value={stageFormData.note} onChange={handleStageChange} style={{ ...inputStyle, minHeight: '100px' }} placeholder="Allergies, niveau de pratique, attentes..." />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '16px' }}>Envoyer la Pré-inscription</button>
                </form>
              )}
            </section>

          </div>

          {/* Right Column: Book Appointment Widget */}
          <aside>
            <div style={{ background: 'white', padding: '2.5rem', borderRadius: '16px', border: '1px solid #eee', boxShadow: '0 8px 30px rgba(0,0,0,0.03)', position: 'sticky', top: '100px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem', color: 'var(--clr-primary)' }}>
                <PhoneCall size={24} />
                <h3 style={{ margin: 0, textTransform: 'uppercase', fontFamily: 'var(--font-heading)' }}>Rendez-vous Administratif</h3>
              </div>
              <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '2rem' }}>
                Vous souhaitez inscrire votre enfant, visiter nos installations au Parc Delmas ou rencontrer le directeur sportif ? Réservez votre créneau directement.
              </p>

              {rdvSubmitted ? (
                <div style={{ textAlign: 'center', padding: '2rem 0', color: '#155724' }}>
                  <CheckCircle size={48} color="green" style={{ margin: '0 auto 1rem' }} />
                  <h4>Rendez-vous Confirmé !</h4>
                  <p style={{ color: '#555', fontSize: '0.9rem', marginTop: '5px' }}>Nous avons bien enregistré votre demande de rendez-vous.</p>
                </div>
              ) : (
                <form onSubmit={handleRdvSubmit}>
                  <div>
                    <label style={labelStyle}>Nom du Parent</label>
                    <input type="text" name="parentNom" required value={rdvFormData.parentNom} onChange={handleRdvChange} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Nom & Prénom de l'Enfant</label>
                    <input type="text" name="enfantNom" required value={rdvFormData.enfantNom} onChange={handleRdvChange} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Numéro de Téléphone</label>
                    <input type="tel" name="tel" required value={rdvFormData.tel} onChange={handleRdvChange} style={inputStyle} placeholder="+509..." />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={labelStyle}>Date souhaitée</label>
                      <input type="date" name="date" required value={rdvFormData.date} onChange={handleRdvChange} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Heure souhaitée</label>
                      <input type="time" name="heure" required value={rdvFormData.heure} onChange={handleRdvChange} style={inputStyle} />
                    </div>
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={labelStyle}>Motif du RDV</label>
                    <select name="raison" value={rdvFormData.raison} onChange={handleRdvChange} style={inputStyle}>
                      <option value="Inscription académique">Inscription académique annuelle</option>
                      <option value="Information stages">Renseignements sur les stages</option>
                      <option value="Entretien staff">Entretien avec l'équipe technique</option>
                      <option value="Autre">Autre demande</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-outline" style={{ width: '100%', borderColor: 'var(--clr-primary)', color: 'var(--clr-primary)', background: 'transparent' }}>Confirmer le Rendez-vous</button>
                </form>
              )}

              <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #eee', fontSize: '0.9rem', color: '#777' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <MapPin size={16} /> Entrée Delmas 77 (côté BIWI)
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Phone size={16} /> +509 3737 4004 / +509 4676 0404
                </div>
              </div>
            </div>
          </aside>

        </div>

      </div>

    </div>
  );
}
