"use client";

import { useState } from 'react';
import { Type, Save, Check } from 'lucide-react';
import { SiteContent, saveSiteContent } from '@/lib/dataService';

interface SiteTextsManagerProps {
  content: SiteContent;
  onRefresh: () => void;
  showToast: (msg: string) => void;
}

export default function SiteTextsManager({ content, onRefresh, showToast }: SiteTextsManagerProps) {
  const [form, setForm] = useState<SiteContent>({ ...content });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await saveSiteContent(form);
      if (res.success) {
        showToast("Textes et slogans du site enregistrés avec succès !");
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

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Type size={28} color="var(--clr-primary)" />
          Textes, Slogans & Messages Officiels
        </h2>
        <p style={{ color: 'var(--clr-gray)', margin: '5px 0 0', maxWidth: '750px' }}>
          Modifiez tous les textes phares du site internet : slogan officiel, titre d'accueil, message d'attente quand aucun match n'est programmé, et présentation du club.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ background: 'white', padding: '2.5rem', borderRadius: '12px', border: '1px solid #e5e7eb', maxWidth: '900px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
        
        {/* Section Accueil */}
        <h3 style={{ fontSize: '1.25rem', borderBottom: '2px solid var(--clr-primary)', paddingBottom: '8px', marginBottom: '1.5rem', color: 'var(--clr-primary)' }}>
          1. Bannière d'Accueil (Page Principale)
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '6px' }}>
              Slogan Supérieur (Tag)
            </label>
            <input 
              type="text" 
              value={form.hero_tag || ''} 
              onChange={e => setForm({ ...form, hero_tag: e.target.value })} 
              placeholder="CHAQUE ENFANT EST UNIQUE"
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem' }} 
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '6px' }}>
              Titre Principal de l'Accueil
            </label>
            <input 
              type="text" 
              value={form.hero_title || ''} 
              onChange={e => setForm({ ...form, hero_title: e.target.value })} 
              placeholder="Condor École de Football"
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem' }} 
            />
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '6px' }}>
            Slogan Officiel (Devise sous le titre)
          </label>
          <input 
            type="text" 
            value={form.hero_slogan || ''} 
            onChange={e => setForm({ ...form, hero_slogan: e.target.value })} 
            placeholder='"Plus fort, plus haut dans le score !"'
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem' }} 
          />
        </div>

        {/* Section Match */}
        <h3 style={{ fontSize: '1.25rem', borderBottom: '2px solid var(--clr-primary)', paddingBottom: '8px', marginBottom: '1.5rem', color: 'var(--clr-primary)' }}>
          2. Message "Aucun Match Programmé"
        </h3>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '6px' }}>
            Texte explicatif affiché lorsque l'option "Aucun match officiel" est active
          </label>
          <textarea 
            value={form.no_match_text || ''} 
            onChange={e => setForm({ ...form, no_match_text: e.target.value })} 
            rows={3}
            placeholder="Nos équipes sont actuellement en période d'entraînement..."
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '0.95rem' }} 
          />
        </div>

        {/* Section Page Club */}
        <h3 style={{ fontSize: '1.25rem', borderBottom: '2px solid var(--clr-primary)', paddingBottom: '8px', marginBottom: '1.5rem', color: 'var(--clr-primary)' }}>
          3. Page Club (Présentation & Histoire)
        </h3>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '6px' }}>
            Titre d'en-tête du Club
          </label>
          <input 
            type="text" 
            value={form.about_title || ''} 
            onChange={e => setForm({ ...form, about_title: e.target.value })} 
            placeholder="Plus Qu'une École, Une Famille."
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem' }} 
          />
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '6px' }}>
            Paragraphe de présentation officielle
          </label>
          <textarea 
            value={form.about_text || ''} 
            onChange={e => setForm({ ...form, about_text: e.target.value })} 
            rows={4}
            placeholder="Depuis Mai 2023, la Condor École de Football est un symbole d'excellence..."
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '0.95rem' }} 
          />
        </div>

        <button 
          type="submit" 
          disabled={saving} 
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.05rem', padding: '12px 28px' }}
        >
          <Save size={18} /> {saving ? 'Enregistrement en cours...' : 'Enregistrer les Textes du Site'}
        </button>

      </form>
    </div>
  );
}
