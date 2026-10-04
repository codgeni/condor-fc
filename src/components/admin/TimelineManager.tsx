"use client";

import { useState } from 'react';
import { History, Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import { TimelineItem, saveTimeline, deleteTimeline } from '@/lib/dataService';
import { useConfirmPoster } from '@/components/ui/ConfirmPosterModal';

interface TimelineManagerProps {
  timeline: TimelineItem[];
  onRefresh: () => void;
  showToast: (msg: string) => void;
}

export default function TimelineManager({ timeline, onRefresh, showToast }: TimelineManagerProps) {
  const { askConfirm } = useConfirmPoster();
  const [editingItem, setEditingItem] = useState<TimelineItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleOpenCreate = () => {
    setIsCreating(true);
    setEditingItem({
      id: `era-${Date.now()}`,
      year: '',
      title: '',
      description: '',
      order: timeline.length + 1
    });
  };

  const handleOpenEdit = (item: TimelineItem) => {
    setIsCreating(false);
    setEditingItem({ ...item });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.title.trim()) {
      showToast("Veuillez saisir un titre pour l'étape historique.");
      return;
    }

    setSaving(true);
    try {
      const res = await saveTimeline(editingItem);
      if (res.success) {
        showToast(`Étape "${editingItem.title}" enregistrée avec succès !`);
        setEditingItem(null);
        setIsCreating(false);
        onRefresh();
      } else {
        showToast("Erreur lors de l'enregistrement.");
      }
    } catch (err) {
      showToast("Erreur lors de la sauvegarde.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (item: TimelineItem) => {
    askConfirm({
      title: "SUPPRIMER DU PALMARÈS",
      message: `Supprimer l'étape "${item.title}" du palmarès et parcours officiel ?`,
      confirmLabel: "OUI, SUPPRIMER",
      onConfirm: async () => {
        try {
          const res = await deleteTimeline(item.id);
          if (res.success) {
            showToast(`Étape "${item.title}" supprimée.`);
            if (editingItem?.id === item.id) {
              setEditingItem(null);
              setIsCreating(false);
            }
            onRefresh();
          }
        } catch (err) {
          showToast("Erreur lors de la suppression.");
        }
      }
    });
  };

  const sorted = [...timeline].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <History size={28} color="var(--clr-primary)" />
            Parcours & Palmarès du Club
          </h2>
          <p style={{ color: 'var(--clr-gray)', margin: '5px 0 0', maxWidth: '700px' }}>
            Gérez la frise chronologique historique et les titres affichés sur la page Club.
          </p>
        </div>

        <button 
          onClick={handleOpenCreate}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
        >
          <Plus size={18} /> Ajouter une Étape Historique
        </button>
      </div>

      {editingItem && (
        <form onSubmit={handleSave} style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '2px solid var(--clr-primary)', marginBottom: '2.5rem', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '12px' }}>
            <h3 style={{ fontSize: '1.4rem', margin: 0, fontWeight: 'bold' }}>
              {isCreating ? 'Ajouter une Étape' : `Modifier : ${editingItem.title}`}
            </h3>
            <button 
              type="button" 
              onClick={() => { setEditingItem(null); setIsCreating(false); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}
            >
              <X size={20} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '6px' }}>Date / Année * (ex: Mai 2026)</label>
              <input 
                type="text" 
                value={editingItem.year} 
                onChange={e => setEditingItem({ ...editingItem, year: e.target.value })} 
                required 
                placeholder="Ex: Avril 2026"
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem' }} 
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '6px' }}>Titre du titre ou de l'étape *</label>
              <input 
                type="text" 
                value={editingItem.title} 
                onChange={e => setEditingItem({ ...editingItem, title: e.target.value })} 
                required 
                placeholder="Ex: Triplé Historique - Tournoi Chale Chale"
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem' }} 
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '6px' }}>Ordre d'affichage</label>
              <input 
                type="number" 
                value={editingItem.order || 1} 
                onChange={e => setEditingItem({ ...editingItem, order: parseInt(e.target.value) || 1 })} 
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem' }} 
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '6px' }}>Description du sacre ou de l'événement</label>
            <textarea 
              value={editingItem.description} 
              onChange={e => setEditingItem({ ...editingItem, description: e.target.value })} 
              rows={3}
              placeholder="Expliquez les détails de cette réussite..."
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '0.95rem' }} 
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" disabled={saving} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Check size={16} /> {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
            <button 
              type="button" 
              onClick={() => { setEditingItem(null); setIsCreating(false); }} 
              className="btn btn-outline" 
              style={{ color: 'black', borderColor: '#ccc' }}
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      {/* Liste de la timeline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {sorted.map(item => (
          <div 
            key={item.id}
            style={{
              background: 'white',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              padding: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div style={{ flex: 1, minWidth: '260px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                <span style={{ background: 'var(--clr-primary)', color: 'white', padding: '4px 10px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                  {item.year}
                </span>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>{item.title}</h3>
              </div>
              <p style={{ margin: 0, color: '#4b5563', fontSize: '0.95rem', lineHeight: 1.5 }}>{item.description}</p>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => handleOpenEdit(item)} 
                className="btn btn-outline"
                style={{ padding: '6px 12px', fontSize: '0.85rem', color: '#1d4ed8', borderColor: '#bfdbfe', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Edit2 size={14} /> Modifier
              </button>
              <button 
                onClick={() => handleDelete(item)} 
                className="btn btn-outline"
                style={{ padding: '6px 12px', fontSize: '0.85rem', color: '#b91c1c', borderColor: '#fecaca', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Trash2 size={14} /> Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
