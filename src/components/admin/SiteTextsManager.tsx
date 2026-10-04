"use client";

import { useState } from 'react';
import { 
  Type, Save, RotateCcw, Plus, Trash2, Shield, Heart, 
  FileText, Home, Award, Music, AlertTriangle, CheckCircle 
} from 'lucide-react';
import { SiteContent, DEFAULT_SITE_CONTENT, DEFAULT_PILLARS, PillarItem, saveSiteContent } from '@/lib/dataService';

interface SiteTextsManagerProps {
  content: SiteContent;
  onRefresh: () => void;
  showToast: (msg: string) => void;
}

export default function SiteTextsManager({ content, onRefresh, showToast }: SiteTextsManagerProps) {
  const [activeSubTab, setActiveSubTab] = useState<'home' | 'club' | 'inscription'>('inscription');
  const [form, setForm] = useState<SiteContent>({
    ...DEFAULT_SITE_CONTENT,
    ...content,
    club_philo_objectives: content.club_philo_objectives || DEFAULT_SITE_CONTENT.club_philo_objectives || [],
    club_pillars: content.club_pillars || DEFAULT_PILLARS,
    inscr_conditions_items: content.inscr_conditions_items || DEFAULT_SITE_CONTENT.inscr_conditions_items || []
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await saveSiteContent(form);
      if (res.success) {
        showToast("Textes, clauses et contenus enregistrés avec succès !");
        onRefresh();
      } else {
        showToast("Erreur lors de la sauvegarde.");
      }
    } catch (err) {
      showToast("Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  const handleResetSection = (section: 'home' | 'club' | 'inscription') => {
    if (confirm(`Rétablir tous les textes par défaut pour cette section ?`)) {
      if (section === 'home') {
        setForm(prev => ({
          ...prev,
          hero_tag: DEFAULT_SITE_CONTENT.hero_tag,
          hero_title: DEFAULT_SITE_CONTENT.hero_title,
          hero_slogan: DEFAULT_SITE_CONTENT.hero_slogan,
          no_match_text: DEFAULT_SITE_CONTENT.no_match_text
        }));
      } else if (section === 'club') {
        setForm(prev => ({
          ...prev,
          about_title: DEFAULT_SITE_CONTENT.about_title,
          about_text: DEFAULT_SITE_CONTENT.about_text,
          club_philo_tag: DEFAULT_SITE_CONTENT.club_philo_tag,
          club_philo_title: DEFAULT_SITE_CONTENT.club_philo_title,
          club_philo_intro: DEFAULT_SITE_CONTENT.club_philo_intro,
          club_philo_objectives: [...(DEFAULT_SITE_CONTENT.club_philo_objectives || [])],
          club_values_tag: DEFAULT_SITE_CONTENT.club_values_tag,
          club_values_title: DEFAULT_SITE_CONTENT.club_values_title,
          club_values_intro: DEFAULT_SITE_CONTENT.club_values_intro,
          club_val_god_title: DEFAULT_SITE_CONTENT.club_val_god_title,
          club_val_god_desc: DEFAULT_SITE_CONTENT.club_val_god_desc,
          club_val_patrie_title: DEFAULT_SITE_CONTENT.club_val_patrie_title,
          club_val_patrie_desc: DEFAULT_SITE_CONTENT.club_val_patrie_desc,
          club_val_discipline_title: DEFAULT_SITE_CONTENT.club_val_discipline_title,
          club_val_discipline_desc: DEFAULT_SITE_CONTENT.club_val_discipline_desc,
          club_pillars: [...DEFAULT_PILLARS],
          club_staff_tag: DEFAULT_SITE_CONTENT.club_staff_tag,
          club_staff_title: DEFAULT_SITE_CONTENT.club_staff_title,
          club_staff_desc: DEFAULT_SITE_CONTENT.club_staff_desc,
          club_timeline_title: DEFAULT_SITE_CONTENT.club_timeline_title,
          club_anthem_title: DEFAULT_SITE_CONTENT.club_anthem_title,
          club_anthem_couplet1: DEFAULT_SITE_CONTENT.club_anthem_couplet1,
          club_anthem_refrain: DEFAULT_SITE_CONTENT.club_anthem_refrain,
          club_anthem_couplet2: DEFAULT_SITE_CONTENT.club_anthem_couplet2,
          club_anthem_pont: DEFAULT_SITE_CONTENT.club_anthem_pont
        }));
      } else if (section === 'inscription') {
        setForm(prev => ({
          ...prev,
          inscr_hero_tag: DEFAULT_SITE_CONTENT.inscr_hero_tag,
          inscr_hero_title: DEFAULT_SITE_CONTENT.inscr_hero_title,
          inscr_hero_desc: DEFAULT_SITE_CONTENT.inscr_hero_desc,
          inscr_conditions_title: DEFAULT_SITE_CONTENT.inscr_conditions_title,
          inscr_conditions_items: [...(DEFAULT_SITE_CONTENT.inscr_conditions_items || [])],
          inscr_uniform_note: DEFAULT_SITE_CONTENT.inscr_uniform_note,
          inscr_payment_title: DEFAULT_SITE_CONTENT.inscr_payment_title,
          inscr_payment_bullet1: DEFAULT_SITE_CONTENT.inscr_payment_bullet1,
          inscr_payment_bullet2: DEFAULT_SITE_CONTENT.inscr_payment_bullet2,
          inscr_payment_bullet3: DEFAULT_SITE_CONTENT.inscr_payment_bullet3,
          inscr_payment_modalities: DEFAULT_SITE_CONTENT.inscr_payment_modalities,
          inscr_payment_penalties: DEFAULT_SITE_CONTENT.inscr_payment_penalties,
          inscr_payment_refund: DEFAULT_SITE_CONTENT.inscr_payment_refund,
          inscr_payment_image_rights: DEFAULT_SITE_CONTENT.inscr_payment_image_rights,
          inscr_emergency_title: DEFAULT_SITE_CONTENT.inscr_emergency_title,
          inscr_emergency_clause1: DEFAULT_SITE_CONTENT.inscr_emergency_clause1,
          inscr_emergency_clause2: DEFAULT_SITE_CONTENT.inscr_emergency_clause2,
          inscr_emergency_clause3: DEFAULT_SITE_CONTENT.inscr_emergency_clause3,
          inscr_consent_intro: DEFAULT_SITE_CONTENT.inscr_consent_intro,
          inscr_consent_terms: DEFAULT_SITE_CONTENT.inscr_consent_terms,
          inscr_consent_fees: DEFAULT_SITE_CONTENT.inscr_consent_fees,
          inscr_consent_medical: DEFAULT_SITE_CONTENT.inscr_consent_medical,
          inscr_consent_pickup_label: DEFAULT_SITE_CONTENT.inscr_consent_pickup_label,
          inscr_consent_alone_label: DEFAULT_SITE_CONTENT.inscr_consent_alone_label,
          inscr_submit_btn: DEFAULT_SITE_CONTENT.inscr_submit_btn,
          inscr_success_title: DEFAULT_SITE_CONTENT.inscr_success_title,
          inscr_success_desc: DEFAULT_SITE_CONTENT.inscr_success_desc
        }));
      }
      showToast("Valeurs par défaut restaurées pour cette section.");
    }
  };

  const labelStyle = { display: 'block', fontSize: '0.85rem', fontWeight: 'bold' as const, marginBottom: '6px', color: '#1e293b' };
  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none', background: '#fff' };
  const textareaStyle = { width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none', background: '#fff', minHeight: '80px', lineHeight: 1.5 };
  const cardStyle = { background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.8rem' };
  const cardHeaderStyle = { fontSize: '1.15rem', color: 'var(--clr-primary)', fontWeight: 'bold' as const, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' };

  return (
    <div>
      {/* En-tête Principal */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', margin: 0, display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--clr-black)' }}>
          <Type size={30} color="var(--clr-primary)" />
          Textes, Clauses & Messages Officiels
        </h2>
        <p style={{ color: 'var(--clr-gray)', margin: '6px 0 0', maxWidth: '850px', fontSize: '0.95rem' }}>
          Personnalisez l'intégralité des contenus du site internet : les clauses et conditions du formulaire d'inscription (« Nous rejoindre »), la philosophie et les valeurs de la page « Le Club », ainsi que les slogans d'accueil.
        </p>
      </div>

      {/* Navigation par Onglets */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '2rem', flexWrap: 'wrap', borderBottom: '2px solid #e2e8f0', paddingBottom: '12px' }}>
        <button
          type="button"
          onClick={() => setActiveSubTab('inscription')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 22px',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: 'bold',
            background: activeSubTab === 'inscription' ? 'var(--clr-primary)' : '#e2e8f0',
            color: activeSubTab === 'inscription' ? 'white' : '#475569',
            boxShadow: activeSubTab === 'inscription' ? '0 4px 15px rgba(202, 2, 79, 0.25)' : 'none',
            transition: 'all 0.2s'
          }}
        >
          <FileText size={18} />
          <span>Page « Nous Rejoindre / Inscriptions » (Clauses & Conditions)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('club')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 22px',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: 'bold',
            background: activeSubTab === 'club' ? 'var(--clr-primary)' : '#e2e8f0',
            color: activeSubTab === 'club' ? 'white' : '#475569',
            boxShadow: activeSubTab === 'club' ? '0 4px 15px rgba(202, 2, 79, 0.25)' : 'none',
            transition: 'all 0.2s'
          }}
        >
          <Shield size={18} />
          <span>Page « Le Club » (Philosophie, Valeurs & Hymne)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 22px',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: 'bold',
            background: activeSubTab === 'home' ? 'var(--clr-primary)' : '#e2e8f0',
            color: activeSubTab === 'home' ? 'white' : '#475569',
            boxShadow: activeSubTab === 'home' ? '0 4px 15px rgba(202, 2, 79, 0.25)' : 'none',
            transition: 'all 0.2s'
          }}
        >
          <Home size={18} />
          <span>Accueil & Matchs</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ background: 'white', padding: '2.5rem', borderRadius: '16px', border: '1px solid #e5e7eb', maxWidth: '1050px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
        
        {/* ==============================================================
            SOUS-ONGLET 1 : PAGE NOUS REJOINDRE / S'INSCRIRE (CLAUSES & TEXTES)
        ============================================================== */}
        {activeSubTab === 'inscription' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--clr-black)', margin: 0, fontWeight: 'bold' }}>
                  Clauses, Conditions & Textes du Formulaire d'Inscription
                </h3>
                <p style={{ color: '#64748b', margin: '4px 0 0', fontSize: '0.9rem' }}>
                  Tous les textes et clauses juridiques/financières affichés sur la page <code style={{ color: 'var(--clr-primary)' }}>/contact</code> sont modifiables ici.
                </p>
              </div>
              <button 
                type="button" 
                onClick={() => handleResetSection('inscription')}
                className="btn btn-outline"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', padding: '7px 14px', borderColor: '#cbd5e1', color: '#475569' }}
              >
                <RotateCcw size={14} /> Restaurer les clauses par défaut
              </button>
            </div>

            {/* 1.1 En-tête du Formulaire */}
            <div style={cardStyle}>
              <div style={cardHeaderStyle}>
                <FileText size={18} /> 1. En-tête de la Page d'Inscription
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.2rem', marginBottom: '1rem' }}>
                <div>
                  <label style={labelStyle}>Surtitre / Tag</label>
                  <input 
                    type="text" 
                    value={form.inscr_hero_tag || ''} 
                    onChange={e => setForm({ ...form, inscr_hero_tag: e.target.value })} 
                    style={inputStyle} 
                  />
                </div>
                <div>
                  <label style={labelStyle}>Titre Principal</label>
                  <input 
                    type="text" 
                    value={form.inscr_hero_title || ''} 
                    onChange={e => setForm({ ...form, inscr_hero_title: e.target.value })} 
                    style={inputStyle} 
                  />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Paragraphe explicatif sous le titre</label>
                <textarea 
                  value={form.inscr_hero_desc || ''} 
                  onChange={e => setForm({ ...form, inscr_hero_desc: e.target.value })} 
                  style={textareaStyle} 
                />
              </div>
            </div>

            {/* 1.2 Conditions d'Inscription */}
            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={cardHeaderStyle}>
                  <AlertTriangle size={18} /> 2. Boîte d'Alerte : Conditions d'Inscription
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const current = form.inscr_conditions_items || [];
                    setForm({ ...form, inscr_conditions_items: [...current, `${current.length + 1}. Nouvelle condition à préciser`] });
                  }}
                  className="btn btn-primary"
                  style={{ fontSize: '0.8rem', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Plus size={14} /> Ajouter une condition
                </button>
              </div>

              <div style={{ marginBottom: '1.2rem' }}>
                <label style={labelStyle}>Titre de la boîte d'alerte</label>
                <input 
                  type="text" 
                  value={form.inscr_conditions_title || ''} 
                  onChange={e => setForm({ ...form, inscr_conditions_title: e.target.value })} 
                  style={inputStyle} 
                />
              </div>

              <label style={labelStyle}>Liste des conditions (chacune modifiable individuellement)</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(form.inscr_conditions_items || []).map((cond, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(202, 2, 79, 0.1)', color: 'var(--clr-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.85rem', flexShrink: 0 }}>
                      {idx + 1}
                    </span>
                    <input 
                      type="text" 
                      value={cond} 
                      onChange={e => {
                        const updated = [...(form.inscr_conditions_items || [])];
                        updated[idx] = e.target.value;
                        setForm({ ...form, inscr_conditions_items: updated });
                      }} 
                      style={{ ...inputStyle, flex: 1 }} 
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (form.inscr_conditions_items || []).filter((_, i) => i !== idx);
                        setForm({ ...form, inscr_conditions_items: updated });
                      }}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '6px' }}
                      title="Supprimer cette condition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 1.3 Note sur les uniformes */}
            <div style={cardStyle}>
              <div style={cardHeaderStyle}>
                <Award size={18} /> 3. Note sur les Tailles d'Uniformes
              </div>
              <label style={labelStyle}>Avertissement rouge au-dessus de la grille des mensurations</label>
              <input 
                type="text" 
                value={form.inscr_uniform_note || ''} 
                onChange={e => setForm({ ...form, inscr_uniform_note: e.target.value })} 
                style={inputStyle} 
              />
            </div>

            {/* 1.4 Conditions Financières & Clauses de Paiement */}
            <div style={cardStyle}>
              <div style={cardHeaderStyle}>
                <Shield size={18} /> 4. Clauses Financières & Conditions de Paiement
              </div>
              
              <div style={{ marginBottom: '1.2rem' }}>
                <label style={labelStyle}>Titre de la section financière</label>
                <input 
                  type="text" 
                  value={form.inscr_payment_title || ''} 
                  onChange={e => setForm({ ...form, inscr_payment_title: e.target.value })} 
                  style={inputStyle} 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.2rem', marginBottom: '1.2rem' }}>
                <div>
                  <label style={labelStyle}>Point 1 : Frais d’admission</label>
                  <textarea 
                    value={form.inscr_payment_bullet1 || ''} 
                    onChange={e => setForm({ ...form, inscr_payment_bullet1: e.target.value })} 
                    style={textareaStyle} 
                  />
                </div>
                <div>
                  <label style={labelStyle}>Point 2 : Frais de voyage & compétitions</label>
                  <textarea 
                    value={form.inscr_payment_bullet2 || ''} 
                    onChange={e => setForm({ ...form, inscr_payment_bullet2: e.target.value })} 
                    style={textareaStyle} 
                  />
                </div>
                <div>
                  <label style={labelStyle}>Point 3 : Prestations incluses dans le tarif</label>
                  <textarea 
                    value={form.inscr_payment_bullet3 || ''} 
                    onChange={e => setForm({ ...form, inscr_payment_bullet3: e.target.value })} 
                    style={textareaStyle} 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.2rem' }}>
                <div>
                  <label style={labelStyle}>Clause : Modalités de paiement (banque, bureau)</label>
                  <textarea 
                    value={form.inscr_payment_modalities || ''} 
                    onChange={e => setForm({ ...form, inscr_payment_modalities: e.target.value })} 
                    style={textareaStyle} 
                  />
                </div>
                <div>
                  <label style={labelStyle}>Clause : Pénalité de retard</label>
                  <textarea 
                    value={form.inscr_payment_penalties || ''} 
                    onChange={e => setForm({ ...form, inscr_payment_penalties: e.target.value })} 
                    style={textareaStyle} 
                  />
                </div>
                <div>
                  <label style={labelStyle}>Clause : Absence / Départ & Non-remboursement</label>
                  <textarea 
                    value={form.inscr_payment_refund || ''} 
                    onChange={e => setForm({ ...form, inscr_payment_refund: e.target.value })} 
                    style={textareaStyle} 
                  />
                </div>
                <div>
                  <label style={labelStyle}>Clause : Droit à l'image & médias</label>
                  <textarea 
                    value={form.inscr_payment_image_rights || ''} 
                    onChange={e => setForm({ ...form, inscr_payment_image_rights: e.target.value })} 
                    style={textareaStyle} 
                  />
                </div>
              </div>
            </div>

            {/* 1.5 Renseignements Médicaux & Clauses d'Urgence */}
            <div style={cardStyle}>
              <div style={cardHeaderStyle}>
                <AlertTriangle size={18} /> 5. Renseignements Médicaux & Clauses d'Urgence
              </div>
              <div style={{ marginBottom: '1.2rem' }}>
                <label style={labelStyle}>Titre de l'autorisation d'urgence</label>
                <input 
                  type="text" 
                  value={form.inscr_emergency_title || ''} 
                  onChange={e => setForm({ ...form, inscr_emergency_title: e.target.value })} 
                  style={inputStyle} 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.2rem' }}>
                <div>
                  <label style={labelStyle}>Clause médicale 1 (Prise en charge médecin traitant)</label>
                  <textarea 
                    value={form.inscr_emergency_clause1 || ''} 
                    onChange={e => setForm({ ...form, inscr_emergency_clause1: e.target.value })} 
                    style={textareaStyle} 
                  />
                </div>
                <div>
                  <label style={labelStyle}>Clause médicale 2 (Transport en véhicule personnel)</label>
                  <textarea 
                    value={form.inscr_emergency_clause2 || ''} 
                    onChange={e => setForm({ ...form, inscr_emergency_clause2: e.target.value })} 
                    style={textareaStyle} 
                  />
                </div>
                <div>
                  <label style={labelStyle}>Clause médicale 3 (Autorisation acte opératoire / anesthésie)</label>
                  <textarea 
                    value={form.inscr_emergency_clause3 || ''} 
                    onChange={e => setForm({ ...form, inscr_emergency_clause3: e.target.value })} 
                    style={textareaStyle} 
                  />
                </div>
              </div>
            </div>

            {/* 1.6 Consentement Parental & Clauses Légales */}
            <div style={cardStyle}>
              <div style={cardHeaderStyle}>
                <CheckCircle size={18} /> 6. Consentement Parental & Engagements Légaux
              </div>

              <div style={{ marginBottom: '1.2rem' }}>
                <label style={labelStyle}>Paragraphe introductif du consentement parental</label>
                <textarea 
                  value={form.inscr_consent_intro || ''} 
                  onChange={e => setForm({ ...form, inscr_consent_intro: e.target.value })} 
                  style={textareaStyle} 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.2rem', marginBottom: '1.2rem' }}>
                <div>
                  <label style={labelStyle}>Case à cocher 1 : Lu et approuvé (conditions, paiement, suivi)</label>
                  <textarea 
                    value={form.inscr_consent_terms || ''} 
                    onChange={e => setForm({ ...form, inscr_consent_terms: e.target.value })} 
                    style={textareaStyle} 
                  />
                </div>
                <div>
                  <label style={labelStyle}>Case à cocher 2 : Connaissance et respect des tarifs</label>
                  <textarea 
                    value={form.inscr_consent_fees || ''} 
                    onChange={e => setForm({ ...form, inscr_consent_fees: e.target.value })} 
                    style={textareaStyle} 
                  />
                </div>
                <div>
                  <label style={labelStyle}>Case à cocher 3 : Engagement certificat médical</label>
                  <textarea 
                    value={form.inscr_consent_medical || ''} 
                    onChange={e => setForm({ ...form, inscr_consent_medical: e.target.value })} 
                    style={textareaStyle} 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                <div>
                  <label style={labelStyle}>Libellé : Autorisation récupération fin d'entraînement</label>
                  <input 
                    type="text" 
                    value={form.inscr_consent_pickup_label || ''} 
                    onChange={e => setForm({ ...form, inscr_consent_pickup_label: e.target.value })} 
                    style={inputStyle} 
                  />
                </div>
                <div>
                  <label style={labelStyle}>Libellé : Autorisation enfant mineur à rentrer seul</label>
                  <input 
                    type="text" 
                    value={form.inscr_consent_alone_label || ''} 
                    onChange={e => setForm({ ...form, inscr_consent_alone_label: e.target.value })} 
                    style={inputStyle} 
                  />
                </div>
              </div>
            </div>

            {/* 1.7 Bouton & Messages de Validation */}
            <div style={cardStyle}>
              <div style={cardHeaderStyle}>
                <CheckCircle size={18} /> 7. Bouton d'Envoi & Message de Succès
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', marginBottom: '1rem' }}>
                <div>
                  <label style={labelStyle}>Texte du bouton d'envoi du formulaire</label>
                  <input 
                    type="text" 
                    value={form.inscr_submit_btn || ''} 
                    onChange={e => setForm({ ...form, inscr_submit_btn: e.target.value })} 
                    style={inputStyle} 
                  />
                </div>
                <div>
                  <label style={labelStyle}>Titre de l'écran de succès</label>
                  <input 
                    type="text" 
                    value={form.inscr_success_title || ''} 
                    onChange={e => setForm({ ...form, inscr_success_title: e.target.value })} 
                    style={inputStyle} 
                  />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Message explicatif après soumission réussie</label>
                <textarea 
                  value={form.inscr_success_desc || ''} 
                  onChange={e => setForm({ ...form, inscr_success_desc: e.target.value })} 
                  style={textareaStyle} 
                />
              </div>
            </div>

          </div>
        )}

        {/* ==============================================================
            SOUS-ONGLET 2 : PAGE LE CLUB (PHILOSOPHIE, VALEURS, HYMNE)
        ============================================================== */}
        {activeSubTab === 'club' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--clr-black)', margin: 0, fontWeight: 'bold' }}>
                  Textes, Philosophie & Valeurs de la Page « Le Club »
                </h3>
                <p style={{ color: '#64748b', margin: '4px 0 0', fontSize: '0.9rem' }}>
                  Modifiez la présentation générale, les 7 objectifs de coaching, les piliers moraux et les paroles de l'hymne officiel.
                </p>
              </div>
              <button 
                type="button" 
                onClick={() => handleResetSection('club')}
                className="btn btn-outline"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', padding: '7px 14px', borderColor: '#cbd5e1', color: '#475569' }}
              >
                <RotateCcw size={14} /> Restaurer la page Club par défaut
              </button>
            </div>

            {/* 2.1 En-tête Page Club */}
            <div style={cardStyle}>
              <div style={cardHeaderStyle}>
                <Shield size={18} /> 1. En-tête & Présentation du Club
              </div>
              <div style={{ marginBottom: '1.2rem' }}>
                <label style={labelStyle}>Titre d'en-tête du Club</label>
                <input 
                  type="text" 
                  value={form.about_title || ''} 
                  onChange={e => setForm({ ...form, about_title: e.target.value })} 
                  style={inputStyle} 
                />
              </div>
              <div>
                <label style={labelStyle}>Paragraphe de présentation officiel</label>
                <textarea 
                  value={form.about_text || ''} 
                  onChange={e => setForm({ ...form, about_text: e.target.value })} 
                  style={{ ...textareaStyle, minHeight: '90px' }} 
                />
              </div>
            </div>

            {/* 2.2 Philosophie & Objectifs de Coaching */}
            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={cardHeaderStyle}>
                  <Award size={18} /> 2. Philosophie & Objectifs Fondamentaux de Coaching
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const current = form.club_philo_objectives || [];
                    setForm({ ...form, club_philo_objectives: [...current, "Nouvel objectif de formation"] });
                  }}
                  className="btn btn-primary"
                  style={{ fontSize: '0.8rem', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Plus size={14} /> Ajouter un objectif
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.2rem', marginBottom: '1.2rem' }}>
                <div>
                  <label style={labelStyle}>Surtitre / Tag</label>
                  <input 
                    type="text" 
                    value={form.club_philo_tag || ''} 
                    onChange={e => setForm({ ...form, club_philo_tag: e.target.value })} 
                    style={inputStyle} 
                  />
                </div>
                <div>
                  <label style={labelStyle}>Titre de la section</label>
                  <input 
                    type="text" 
                    value={form.club_philo_title || ''} 
                    onChange={e => setForm({ ...form, club_philo_title: e.target.value })} 
                    style={inputStyle} 
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.2rem' }}>
                <label style={labelStyle}>Phrase d'introduction</label>
                <input 
                  type="text" 
                  value={form.club_philo_intro || ''} 
                  onChange={e => setForm({ ...form, club_philo_intro: e.target.value })} 
                  style={inputStyle} 
                />
              </div>

              <label style={labelStyle}>Les 7 Objectifs de Coaching (modifiables un par un)</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(form.club_philo_objectives || []).map((objText, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--clr-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem', flexShrink: 0 }}>
                      {idx + 1}
                    </span>
                    <input 
                      type="text" 
                      value={objText} 
                      onChange={e => {
                        const updated = [...(form.club_philo_objectives || [])];
                        updated[idx] = e.target.value;
                        setForm({ ...form, club_philo_objectives: updated });
                      }} 
                      style={{ ...inputStyle, flex: 1 }} 
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (form.club_philo_objectives || []).filter((_, i) => i !== idx);
                        setForm({ ...form, club_philo_objectives: updated });
                      }}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '6px' }}
                      title="Supprimer cet objectif"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 2.3 Fondation Morale & Triade (Dieu, Patrie, Discipline) */}
            <div style={cardStyle}>
              <div style={cardHeaderStyle}>
                <Heart size={18} /> 3. Fondation Morale & Trinité (Dieu, Patrie, Discipline)
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.2rem', marginBottom: '1.2rem' }}>
                <div>
                  <label style={labelStyle}>Surtitre / Tag</label>
                  <input 
                    type="text" 
                    value={form.club_values_tag || ''} 
                    onChange={e => setForm({ ...form, club_values_tag: e.target.value })} 
                    style={inputStyle} 
                  />
                </div>
                <div>
                  <label style={labelStyle}>Titre de la section</label>
                  <input 
                    type="text" 
                    value={form.club_values_title || ''} 
                    onChange={e => setForm({ ...form, club_values_title: e.target.value })} 
                    style={inputStyle} 
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={labelStyle}>Texte d'introduction de la fondation morale</label>
                <textarea 
                  value={form.club_values_intro || ''} 
                  onChange={e => setForm({ ...form, club_values_intro: e.target.value })} 
                  style={{ ...textareaStyle, minHeight: '90px' }} 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.2rem' }}>
                {/* Dieu */}
                <div style={{ background: '#fff', padding: '1.2rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <label style={{ ...labelStyle, color: 'var(--clr-primary)' }}>✝ Pilier 1 : Titre</label>
                  <input 
                    type="text" 
                    value={form.club_val_god_title || ''} 
                    onChange={e => setForm({ ...form, club_val_god_title: e.target.value })} 
                    style={{ ...inputStyle, marginBottom: '8px' }} 
                  />
                  <label style={labelStyle}>Description</label>
                  <textarea 
                    value={form.club_val_god_desc || ''} 
                    onChange={e => setForm({ ...form, club_val_god_desc: e.target.value })} 
                    style={textareaStyle} 
                  />
                </div>

                {/* Patrie */}
                <div style={{ background: '#fff', padding: '1.2rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <label style={{ ...labelStyle, color: 'var(--clr-primary)' }}>🇭🇹 Pilier 2 : Titre</label>
                  <input 
                    type="text" 
                    value={form.club_val_patrie_title || ''} 
                    onChange={e => setForm({ ...form, club_val_patrie_title: e.target.value })} 
                    style={{ ...inputStyle, marginBottom: '8px' }} 
                  />
                  <label style={labelStyle}>Description</label>
                  <textarea 
                    value={form.club_val_patrie_desc || ''} 
                    onChange={e => setForm({ ...form, club_val_patrie_desc: e.target.value })} 
                    style={textareaStyle} 
                  />
                </div>

                {/* Discipline */}
                <div style={{ background: '#fff', padding: '1.2rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <label style={{ ...labelStyle, color: 'var(--clr-primary)' }}>⚡ Pilier 3 : Titre</label>
                  <input 
                    type="text" 
                    value={form.club_val_discipline_title || ''} 
                    onChange={e => setForm({ ...form, club_val_discipline_title: e.target.value })} 
                    style={{ ...inputStyle, marginBottom: '8px' }} 
                  />
                  <label style={labelStyle}>Description</label>
                  <textarea 
                    value={form.club_val_discipline_desc || ''} 
                    onChange={e => setForm({ ...form, club_val_discipline_desc: e.target.value })} 
                    style={textareaStyle} 
                  />
                </div>
              </div>
            </div>

            {/* 2.4 Les 6 Piliers Fondamentaux */}
            <div style={cardStyle}>
              <div style={cardHeaderStyle}>
                <Award size={18} /> 4. Les 6 Piliers Fondamentaux (Courtoisie, Fraternité, etc.)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.2rem' }}>
                {(form.club_pillars || []).map((pil, idx) => (
                  <div key={idx} style={{ background: '#fff', padding: '1.2rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Nom du pilier</label>
                        <input 
                          type="text" 
                          value={pil.title} 
                          onChange={e => {
                            const updated = [...(form.club_pillars || [])];
                            updated[idx] = { ...updated[idx], title: e.target.value };
                            setForm({ ...form, club_pillars: updated });
                          }} 
                          style={inputStyle} 
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Sous-titre / Devise</label>
                        <input 
                          type="text" 
                          value={pil.subtitle} 
                          onChange={e => {
                            const updated = [...(form.club_pillars || [])];
                            updated[idx] = { ...updated[idx], subtitle: e.target.value };
                            setForm({ ...form, club_pillars: updated });
                          }} 
                          style={inputStyle} 
                        />
                      </div>
                    </div>
                    <label style={labelStyle}>Explication</label>
                    <textarea 
                      value={pil.desc} 
                      onChange={e => {
                        const updated = [...(form.club_pillars || [])];
                        updated[idx] = { ...updated[idx], desc: e.target.value };
                        setForm({ ...form, club_pillars: updated });
                      }} 
                      style={textareaStyle} 
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 2.5 Textes des En-têtes Staff & Parcours */}
            <div style={cardStyle}>
              <div style={cardHeaderStyle}>
                <Type size={18} /> 5. Titres des Sections Staff & Palmarès
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', marginBottom: '1rem' }}>
                <div>
                  <label style={labelStyle}>Titre Section Palmarès</label>
                  <input 
                    type="text" 
                    value={form.club_timeline_title || ''} 
                    onChange={e => setForm({ ...form, club_timeline_title: e.target.value })} 
                    style={inputStyle} 
                  />
                </div>
                <div>
                  <label style={labelStyle}>Titre Section Staff</label>
                  <input 
                    type="text" 
                    value={form.club_staff_title || ''} 
                    onChange={e => setForm({ ...form, club_staff_title: e.target.value })} 
                    style={inputStyle} 
                  />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Description de la section Staff</label>
                <textarea 
                  value={form.club_staff_desc || ''} 
                  onChange={e => setForm({ ...form, club_staff_desc: e.target.value })} 
                  style={textareaStyle} 
                />
              </div>
            </div>

            {/* 2.6 L'Hymne de Condor */}
            <div style={cardStyle}>
              <div style={cardHeaderStyle}>
                <Music size={18} /> 6. L'Hymne Officiel du Condor
              </div>
              <div style={{ marginBottom: '1.2rem' }}>
                <label style={labelStyle}>Titre de l'hymne</label>
                <input 
                  type="text" 
                  value={form.club_anthem_title || ''} 
                  onChange={e => setForm({ ...form, club_anthem_title: e.target.value })} 
                  style={inputStyle} 
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.2rem' }}>
                <div>
                  <label style={labelStyle}>Couplet 1</label>
                  <textarea 
                    value={form.club_anthem_couplet1 || ''} 
                    onChange={e => setForm({ ...form, club_anthem_couplet1: e.target.value })} 
                    style={{ ...textareaStyle, minHeight: '110px' }} 
                  />
                </div>
                <div>
                  <label style={{ ...labelStyle, color: 'var(--clr-primary)' }}>Refrain</label>
                  <textarea 
                    value={form.club_anthem_refrain || ''} 
                    onChange={e => setForm({ ...form, club_anthem_refrain: e.target.value })} 
                    style={{ ...textareaStyle, minHeight: '110px', borderColor: 'var(--clr-primary)' }} 
                  />
                </div>
                <div>
                  <label style={labelStyle}>Couplet 2</label>
                  <textarea 
                    value={form.club_anthem_couplet2 || ''} 
                    onChange={e => setForm({ ...form, club_anthem_couplet2: e.target.value })} 
                    style={{ ...textareaStyle, minHeight: '110px' }} 
                  />
                </div>
                <div>
                  <label style={labelStyle}>Pont</label>
                  <textarea 
                    value={form.club_anthem_pont || ''} 
                    onChange={e => setForm({ ...form, club_anthem_pont: e.target.value })} 
                    style={{ ...textareaStyle, minHeight: '110px' }} 
                  />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ==============================================================
            SOUS-ONGLET 3 : ACCUEIL & MATCHS
        ============================================================== */}
        {activeSubTab === 'home' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--clr-black)', margin: 0, fontWeight: 'bold' }}>
                  Textes d'Accueil, Slogans & Matchs
                </h3>
                <p style={{ color: '#64748b', margin: '4px 0 0', fontSize: '0.9rem' }}>
                  Affichez vos devises et les messages d'attente de la page d'accueil.
                </p>
              </div>
              <button 
                type="button" 
                onClick={() => handleResetSection('home')}
                className="btn btn-outline"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', padding: '7px 14px', borderColor: '#cbd5e1', color: '#475569' }}
              >
                <RotateCcw size={14} /> Restaurer l'accueil par défaut
              </button>
            </div>

            <div style={cardStyle}>
              <div style={cardHeaderStyle}>
                <Home size={18} /> Bannière Principale d'Accueil
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={labelStyle}>Slogan Supérieur (Tag)</label>
                  <input 
                    type="text" 
                    value={form.hero_tag || ''} 
                    onChange={e => setForm({ ...form, hero_tag: e.target.value })} 
                    style={inputStyle} 
                  />
                </div>
                <div>
                  <label style={labelStyle}>Titre Principal</label>
                  <input 
                    type="text" 
                    value={form.hero_title || ''} 
                    onChange={e => setForm({ ...form, hero_title: e.target.value })} 
                    style={inputStyle} 
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Slogan Officiel (Devise sous le titre)</label>
                <input 
                  type="text" 
                  value={form.hero_slogan || ''} 
                  onChange={e => setForm({ ...form, hero_slogan: e.target.value })} 
                  style={inputStyle} 
                />
              </div>
            </div>

            <div style={cardStyle}>
              <div style={cardHeaderStyle}>
                <AlertTriangle size={18} /> Message « Aucun Match Programmé »
              </div>
              <label style={labelStyle}>Texte d'attente officiel diffusé lorsque l'option « Aucun match officiel » est active</label>
              <textarea 
                value={form.no_match_text || ''} 
                onChange={e => setForm({ ...form, no_match_text: e.target.value })} 
                rows={3}
                style={textareaStyle} 
              />
            </div>
          </div>
        )}

        {/* Bouton de Sauvegarde Général */}
        <div style={{ marginTop: '2.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '15px', alignItems: 'center' }}>
          <button 
            type="submit" 
            disabled={saving} 
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem', padding: '14px 32px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(202, 2, 79, 0.3)' }}
          >
            <Save size={20} /> {saving ? 'Enregistrement...' : 'Enregistrer Tous les Textes & Clauses'}
          </button>
        </div>

      </form>
    </div>
  );
}
