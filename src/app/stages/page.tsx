"use client";

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Calendar, Phone, Mail, MapPin, CheckCircle, Clock, User, PhoneCall } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const UPCOMING_CAMPS = [
  {
    title: "Stage d'Été Condor - Session 1",
    dates: "15 Juillet - 25 Juillet 2026",
    categories: "U11 à U13",
    price: "1,500 HTG",
    time: "08:00 AM - 12:00 PM",
    desc: "Stage intensif de perfectionnement technique individuel, coordination motrice et initiation aux phases tactiques de base."
  },
  {
    title: "Stage d'Été Condor - Session 2",
    dates: "01 Août - 10 Août 2026",
    categories: "U15 à U17",
    price: "2,000 HTG",
    time: "08:00 AM - 12:00 PM",
    desc: "Stage axé sur le développement physique, la tactique collective, l'analyse vidéo simple et des matchs d'application."
  }
];

export default function Stages() {
  const [stageFormData, setStageFormData] = useState({
    nom: '', prenom: '', dob: '', tel: '', photo: '', stage: '', note: ''
  });
  const [rdvFormData, setRdvFormData] = useState({
    parentNom: '', enfantNom: '', tel: '', date: '', heure: '', raison: 'Inscription académique'
  });
  
  const [stageSubmitted, setStageSubmitted] = useState(false);
  const [rdvSubmitted, setRdvSubmitted] = useState(false);

  const handleStageChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setStageFormData({ ...stageFormData, [e.target.name]: e.target.value });
  };

  const handleRdvChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setRdvFormData({ ...rdvFormData, [e.target.name]: e.target.value });
  };

  const handleStageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save to Supabase Table 'stages_inscriptions'
    const { error } = await supabase.from('stages_inscriptions').insert({
      nom: stageFormData.nom,
      prenom: stageFormData.prenom,
      dob: stageFormData.dob,
      tel: stageFormData.tel,
      stage: stageFormData.stage,
      note: stageFormData.note,
      photo: stageFormData.photo
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

    // Save to Supabase Table 'appointments'
    const { error } = await supabase.from('appointments').insert({
      parent_nom: rdvFormData.parentNom,
      enfant_nom: rdvFormData.enfantNom,
      tel: rdvFormData.tel,
      date: rdvFormData.date,
      heure: rdvFormData.heure,
      raison: rdvFormData.raison
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
            
            {/* 1. Informations sur les Stages */}
            <section style={{ marginBottom: '4rem' }}>
              <h2 style={sectionTitleStyle}>Prochains Stages de Vacances</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {UPCOMING_CAMPS.map((camp, i) => (
                  <motion.div 
                    key={i} 
                    style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 5px 15px rgba(0,0,0,0.02)', border: '1px solid #eee', borderLeft: '5px solid var(--clr-primary)' }}
                    whileHover={{ y: -3 }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>{camp.title}</h3>
                      <span style={{ color: 'var(--clr-primary)', fontWeight: 'bold', fontSize: '1.2rem' }}>{camp.price}</span>
                    </div>
                    <p style={{ color: '#555', lineHeight: 1.6, marginBottom: '1.5rem' }}>{camp.desc}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', fontSize: '0.9rem', color: 'var(--clr-gray)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={16} /> {camp.dates}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={16} /> {camp.time}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><User size={16} /> Catégorie: {camp.categories}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
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
                      {UPCOMING_CAMPS.map((camp, idx) => (
                        <option key={idx} value={camp.title}>{camp.title} ({camp.categories})</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={labelStyle}>Photo de l'enfant (Lien URL ou descriptif)</label>
                    <input type="text" name="photo" value={stageFormData.photo} onChange={handleStageChange} style={inputStyle} placeholder="Ex: photo_enfant.jpg" />
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={labelStyle}>Remarques ou antécédents médicaux</label>
                    <textarea name="note" value={stageFormData.note} onChange={handleStageChange} style={{ ...inputStyle, minHeight: '80px' }} placeholder="Allergies, asthme ou remarques particulières..." />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '15px' }}>Soumettre la Pré-inscription</button>
                </form>
              )}
            </section>

          </div>

          {/* Right Column: Contact, Rendez-vous & Localisation */}
          <div>
            
            {/* 1. Coordonnées du Club */}
            <section style={{ background: 'white', padding: '2.5rem', borderRadius: '16px', border: '1px solid #eee', boxShadow: '0 8px 30px rgba(0,0,0,0.03)', marginBottom: '3rem' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', borderBottom: '2px solid var(--clr-primary)', paddingBottom: '8px', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
                Secrétariat du Club
              </h3>
              <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <li style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                  <MapPin color="var(--clr-primary)" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--clr-gray)' }}>Localisation</strong>
                    <span style={{ fontSize: '0.95rem' }}>1, entrée de Delmas 77 (à côté de BIWI), Delmas, Haïti</span>
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                  <Phone color="var(--clr-primary)" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--clr-gray)' }}>Téléphones</strong>
                    <span style={{ fontSize: '0.95rem' }}>+509 4877 7143<br />+509 5684 1605</span>
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                  <Mail color="var(--clr-primary)" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--clr-gray)' }}>Courriel</strong>
                    <span style={{ fontSize: '0.95rem' }}>condorecoledefootball@gmail.com</span>
                  </div>
                </li>
              </ul>
            </section>

            {/* 2. Prise de Rendez-vous Administratif */}
            <section style={{ background: 'white', padding: '2.5rem', borderRadius: '16px', border: '1px solid #eee', boxShadow: '0 8px 30px rgba(0,0,0,0.03)' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', borderBottom: '2px solid var(--clr-primary)', paddingBottom: '8px', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
                Prendre Rendez-vous
              </h3>
              <p style={{ color: 'var(--clr-gray)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>Planifiez un entretien au secrétariat administratif pour l'inscription officielle, le paiement ou le retrait d'équipements.</p>
              
              {rdvSubmitted ? (
                <div style={{ textAlign: 'center', padding: '2rem 0', color: '#155724' }}>
                  <CheckCircle size={48} color="green" style={{ margin: '0 auto 1rem' }} />
                  <h4>Rendez-vous Demandé !</h4>
                  <p style={{ fontSize: '0.85rem', color: '#555', marginTop: '5px' }}>Le secrétariat validera la plage horaire par SMS ou téléphone sous peu.</p>
                </div>
              ) : (
                <form onSubmit={handleRdvSubmit}>
                  <div>
                    <label style={labelStyle}>Nom du Parent</label>
                    <input type="text" name="parentNom" required value={rdvFormData.parentNom} onChange={handleRdvChange} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Nom de l'enfant</label>
                    <input type="text" name="enfantNom" required value={rdvFormData.enfantNom} onChange={handleRdvChange} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Téléphone</label>
                    <input type="tel" name="tel" required value={rdvFormData.tel} onChange={handleRdvChange} style={inputStyle} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '0.8rem' }}>
                    <div>
                      <label style={labelStyle}>Date souhaitée</label>
                      <input type="date" name="date" required value={rdvFormData.date} onChange={handleRdvChange} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Heure</label>
                      <input type="time" name="heure" required value={rdvFormData.heure} onChange={handleRdvChange} style={inputStyle} />
                    </div>
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={labelStyle}>Raison du rendez-vous</label>
                    <select name="raison" value={rdvFormData.raison} onChange={handleRdvChange} style={inputStyle}>
                      <option value="Inscription académique">Inscription académique</option>
                      <option value="Achat / Retrait uniformes">Achat / Retrait uniformes</option>
                      <option value="Entretien technique">Entretien technique</option>
                    </select>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <PhoneCall size={16} /> Confirmer la demande
                  </button>
                </form>
              )}
            </section>

          </div>

        </div>

      </div>

    </div>
  );
}
