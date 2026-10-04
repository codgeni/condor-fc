"use client";

import { useState } from 'react';
import { Shield, Plus, Edit2, Trash2, Check, X, Users, AlertCircle } from 'lucide-react';
import { UnitItem, saveUnit, deleteUnit } from '@/lib/dataService';
import { useConfirmPoster } from '@/components/ui/ConfirmPosterModal';

interface UnitsManagerProps {
  units: UnitItem[];
  players: Record<string, any>;
  onRefresh: () => void;
  showToast: (msg: string) => void;
}

export default function UnitsManager({ units, players, onRefresh, showToast }: UnitsManagerProps) {
  const { askConfirm } = useConfirmPoster();
  const [editingUnit, setEditingUnit] = useState<UnitItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  // Calculate players count for each unit
  const getPlayerCount = (unitName: string) => {
    return Object.values(players).filter(p => {
      if (Array.isArray(p.categories)) return p.categories.includes(unitName);
      if (Array.isArray(p.category)) return p.category.includes(unitName);
      return p.category === unitName;
    }).length;
  };

  const handleOpenCreate = () => {
    setIsCreating(true);
    setEditingUnit({
      id: `unit-${Date.now()}`,
      name: '',
      description: '',
      order: units.length + 1,
      is_active: true
    });
  };

  const handleOpenEdit = (unit: UnitItem) => {
    setIsCreating(false);
    setEditingUnit({ ...unit });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUnit || !editingUnit.name.trim()) {
      showToast("Veuillez saisir un nom pour l'unité.");
      return;
    }

    askConfirm({
      title: isCreating ? "AJOUTER L'UNITÉ" : "MODIFIER L'UNITÉ",
      message: isCreating 
        ? `Confirmez-vous la création de l'unité "${editingUnit.name}" ?` 
        : `Confirmez-vous la modification de l'unité "${editingUnit.name}" ?`,
      confirmLabel: isCreating ? "OUI, CRÉER" : "OUI, ENREGISTRER",
      itemDetails: {
        type: isCreating ? 'Ajout' : 'Modification',
        title: editingUnit.name,
        subtitle: editingUnit.description || `Ordre d'affichage: ${editingUnit.order}`,
        badge: 'Catégorie'
      },
      onConfirm: async () => {
        setSaving(true);
        try {
          const res = await saveUnit(editingUnit);
          if (res.success) {
            showToast(`Unité "${editingUnit.name}" ${isCreating ? 'créée' : 'mise à jour'} avec succès !`);
            setEditingUnit(null);
            setIsCreating(false);
            onRefresh();
          } else {
            showToast("Erreur lors de l'enregistrement de l'unité.");
          }
        } catch (err) {
          showToast("Erreur lors de la sauvegarde.");
        } finally {
          setSaving(false);
        }
      }
    });
  };

  const handleDelete = (unit: UnitItem) => {
    const count = getPlayerCount(unit.name);
    let confirmMsg = `Confirmez-vous la suppression de l'unité "${unit.name}" ?`;
    if (count > 0) {
      confirmMsg += `\nAttention : ${count} joueur(s) sont actuellement rattachés à cette catégorie.`;
    }

    askConfirm({
      title: "SUPPRIMER L'UNITÉ",
      message: confirmMsg,
      confirmLabel: "OUI, SUPPRIMER",
      itemDetails: {
        type: 'Suppression',
        title: unit.name,
        subtitle: `${count} joueur(s) rattaché(s)`,
        badge: 'Catégorie'
      },
      onConfirm: async () => {
        try {
          const res = await deleteUnit(unit.id);
          if (res.success) {
            showToast(`Unité "${unit.name}" supprimée avec succès.`);
            if (editingUnit?.id === unit.id) {
              setEditingUnit(null);
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

  const sortedUnits = [...units].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Shield size={28} color="var(--clr-primary)" />
            Unités & Catégories du Club
          </h2>
          <p style={{ color: 'var(--clr-gray)', margin: '5px 0 0', maxWidth: '700px' }}>
            Créez de nouvelles unités d'équipes (ex: U17, U13, Féminine, Académie), modifiez leur ordre d'affichage ou supprimez-les. Les unités créées apparaissent instantanément sur la page Équipe du site public.
          </p>
        </div>

        <button 
          onClick={handleOpenCreate}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
        >
          <Plus size={18} /> Créer une Nouvelle Unité
        </button>
      </div>

      {/* Formulaire Modal / Tiroir pour Créer ou Modifier une Unité */}
      {editingUnit && (
        <form onSubmit={handleSave} style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '2px solid var(--clr-primary)', marginBottom: '2.5rem', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '12px' }}>
            <h3 style={{ fontSize: '1.4rem', margin: 0, fontWeight: 'bold' }}>
              {isCreating ? 'Créer une Nouvelle Unité' : `Modifier l'Unité : ${editingUnit.name}`}
            </h3>
            <button 
              type="button" 
              onClick={() => { setEditingUnit(null); setIsCreating(false); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}
            >
              <X size={20} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '6px' }}>
                Nom de l'unité * (ex: U17, U13, Équipe Première, Féminine)
              </label>
              <input 
                type="text" 
                value={editingUnit.name} 
                onChange={e => setEditingUnit({ ...editingUnit, name: e.target.value })} 
                required 
                placeholder="Ex: U13 ou U19"
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem' }} 
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '6px' }}>
                Description ou tranche d'âge
              </label>
              <input 
                type="text" 
                value={editingUnit.description || ''} 
                onChange={e => setEditingUnit({ ...editingUnit, description: e.target.value })} 
                placeholder="Ex: Moins de 13 ans (Benjamins)"
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem' }} 
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '6px' }}>
                Ordre d'affichage (1 = premier bouton à gauche)
              </label>
              <input 
                type="number" 
                value={editingUnit.order || 1} 
                onChange={e => setEditingUnit({ ...editingUnit, order: parseInt(e.target.value) || 1 })} 
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem' }} 
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
            <input 
              type="checkbox" 
              id="unitActive" 
              checked={editingUnit.is_active !== false} 
              onChange={e => setEditingUnit({ ...editingUnit, is_active: e.target.checked })}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <label htmlFor="unitActive" style={{ fontSize: '0.95rem', cursor: 'pointer' }}>
              Unité active (affichée publiquement sur le site)
            </label>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" disabled={saving} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Check size={16} /> {saving ? 'Enregistrement...' : 'Enregistrer cette Unité'}
            </button>
            <button 
              type="button" 
              onClick={() => { setEditingUnit(null); setIsCreating(false); }} 
              className="btn btn-outline" 
              style={{ color: 'black', borderColor: '#ccc' }}
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      {/* Grille des Unités Actuelles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {sortedUnits.map(unit => {
          const count = getPlayerCount(unit.name);
          return (
            <div 
              key={unit.id}
              style={{
                background: 'white',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                padding: '1.5rem',
                boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'rgba(224, 30, 38, 0.1)', color: 'var(--clr-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                      #{unit.order}
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.3rem', fontFamily: 'var(--font-heading)' }}>{unit.name}</h3>
                      <span style={{ fontSize: '0.75rem', color: unit.is_active !== false ? '#15803d' : '#9ca3af', fontWeight: 'bold', textTransform: 'uppercase' }}>
                        {unit.is_active !== false ? '● Visible sur le site' : '○ Masquée'}
                      </span>
                    </div>
                  </div>

                  <span style={{ background: '#f3f4f6', color: '#1f2937', padding: '4px 10px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Users size={14} /> {count} joueur{count > 1 ? 's' : ''}
                  </span>
                </div>

                <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: '10px 0 1.2rem', lineHeight: 1.4, minHeight: '38px' }}>
                  {unit.description || 'Aucune description spécifique fournie.'}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #f3f4f6', paddingTop: '12px' }}>
                <button 
                  onClick={() => handleOpenEdit(unit)} 
                  className="btn btn-outline"
                  style={{ padding: '6px 12px', fontSize: '0.85rem', color: '#1d4ed8', borderColor: '#bfdbfe', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Edit2 size={14} /> Modifier
                </button>
                <button 
                  onClick={() => handleDelete(unit)} 
                  className="btn btn-outline"
                  style={{ padding: '6px 12px', fontSize: '0.85rem', color: '#b91c1c', borderColor: '#fecaca', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Trash2 size={14} /> Supprimer
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
