"use client";

import { useState } from 'react';
import { Award, Plus, Edit2, Trash2, Check, X, Shield, ArrowUp, Users } from 'lucide-react';
import { RoleItem, saveRole, deleteRole, matchPlayerToRole } from '@/lib/dataService';
import { useConfirmPoster } from '@/components/ui/ConfirmPosterModal';

interface RolesManagerProps {
  roles: RoleItem[];
  players: Record<string, any>;
  onRefresh: () => void;
  showToast: (msg: string) => void;
}

export default function RolesManager({ roles, players, onRefresh, showToast }: RolesManagerProps) {
  const { askConfirm } = useConfirmPoster();
  const [editingRole, setEditingRole] = useState<RoleItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  // Count players matched to each role
  const getPlayerCount = (role: RoleItem) => {
    return Object.values(players).filter(p => matchPlayerToRole(p, roles).id === role.id).length;
  };

  const handleOpenCreate = () => {
    setIsCreating(true);
    setEditingRole({
      id: `role-${Date.now()}`,
      name: '',
      keywords: '',
      order: roles.length + 1
    });
  };

  const handleOpenEdit = (role: RoleItem) => {
    setIsCreating(false);
    setEditingRole({ ...role });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRole || !editingRole.name.trim()) {
      showToast("Veuillez saisir un nom pour le rôle.");
      return;
    }

    setSaving(true);
    try {
      const res = await saveRole(editingRole);
      if (res.success) {
        showToast(`Rôle "${editingRole.name}" ${isCreating ? 'créé' : 'mis à jour'} avec succès !`);
        setEditingRole(null);
        setIsCreating(false);
        onRefresh();
      } else {
        showToast("Erreur lors de l'enregistrement du rôle.");
      }
    } catch (err) {
      showToast("Erreur lors de la sauvegarde.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (role: RoleItem) => {
    askConfirm({
      title: "SUPPRIMER LE RÔLE",
      message: `Confirmez-vous la suppression du rôle "${role.name}" ?`,
      confirmLabel: "OUI, SUPPRIMER",
      onConfirm: async () => {
        try {
          const res = await deleteRole(role.id);
          if (res.success) {
            showToast(`Rôle "${role.name}" supprimé.`);
            if (editingRole?.id === role.id) {
              setEditingRole(null);
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

  const sortedRoles = [...roles].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Award size={28} color="var(--clr-primary)" />
            Rôles, Postes & Hiérarchie du Roster
          </h2>
          <p style={{ color: 'var(--clr-gray)', margin: '5px 0 0', maxWidth: '750px' }}>
            Définissez les rôles et sections de l'effectif. L'ordre de priorité (1, 2, 3...) détermine la disposition automatique sur le site public : les <strong>Gardiens de but (Ordre 1)</strong> sont placés en premier tout en haut, suivis des Défenseurs, Milieux et Attaquants.
          </p>
        </div>

        <button 
          onClick={handleOpenCreate}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
        >
          <Plus size={18} /> Ajouter un Rôle / Poste
        </button>
      </div>

      {/* Formulaire Modal / Drawer */}
      {editingRole && (
        <form onSubmit={handleSave} style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '2px solid var(--clr-primary)', marginBottom: '2.5rem', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '12px' }}>
            <h3 style={{ fontSize: '1.4rem', margin: 0, fontWeight: 'bold' }}>
              {isCreating ? 'Ajouter un Nouveau Rôle' : `Modifier le Rôle : ${editingRole.name}`}
            </h3>
            <button 
              type="button" 
              onClick={() => { setEditingRole(null); setIsCreating(false); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}
            >
              <X size={20} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '6px' }}>
                Titre de la Section / Rôle * (ex: Gardiens de but, Défenseurs, Attaquants, Staff Technique)
              </label>
              <input 
                type="text" 
                value={editingRole.name} 
                onChange={e => setEditingRole({ ...editingRole, name: e.target.value })} 
                required 
                placeholder="Ex: Gardiens de but"
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem' }} 
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '6px' }}>
                Ordre d'affichage / Priorité (1 = Tout en haut de la page)
              </label>
              <input 
                type="number" 
                value={editingRole.order || 1} 
                onChange={e => setEditingRole({ ...editingRole, order: parseInt(e.target.value) || 1 })} 
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem' }} 
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '6px' }}>
                Mots-clés de reconnaissance automatique (séparés par des virgules)
              </label>
              <input 
                type="text" 
                value={editingRole.keywords || ''} 
                onChange={e => setEditingRole({ ...editingRole, keywords: e.target.value })} 
                placeholder="Ex: Gardien, Goal, GK, Portier"
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem' }} 
              />
              <span style={{ fontSize: '0.75rem', color: '#666' }}>
                Tout joueur ayant ces termes dans son poste sera automatiquement regroupé ici.
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" disabled={saving} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Check size={16} /> {saving ? 'Enregistrement...' : 'Enregistrer ce Rôle'}
            </button>
            <button 
              type="button" 
              onClick={() => { setEditingRole(null); setIsCreating(false); }} 
              className="btn btn-outline" 
              style={{ color: 'black', borderColor: '#ccc' }}
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      {/* Grille des Rôles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {sortedRoles.map(role => {
          const count = getPlayerCount(role);
          const isTop = role.order === 1;

          return (
            <div 
              key={role.id}
              style={{
                background: 'white',
                borderRadius: '12px',
                border: isTop ? '2px solid #ca024f' : '1px solid #e5e7eb',
                padding: '1.5rem',
                boxShadow: isTop ? '0 8px 25px rgba(202, 2, 79, 0.1)' : '0 4px 15px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '8px', 
                      background: isTop ? 'var(--clr-primary)' : 'rgba(0,0,0,0.06)', 
                      color: isTop ? 'white' : '#333', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontWeight: 'bold',
                      fontSize: '1.1rem'
                    }}>
                      #{role.order}
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.3rem', fontFamily: 'var(--font-heading)' }}>{role.name}</h3>
                      {isTop && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--clr-primary)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <ArrowUp size={12} /> Placé tout en haut sur la page Équipe
                        </span>
                      )}
                    </div>
                  </div>

                  <span style={{ background: '#f3f4f6', color: '#1f2937', padding: '4px 10px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Users size={14} /> {count} joueur{count > 1 ? 's' : ''}
                  </span>
                </div>

                <div style={{ marginTop: '12px', marginBottom: '1.2rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
                    Mots-clés associés :
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {(role.keywords ? role.keywords.split(',') : ['Par défaut']).map((kw, i) => (
                      <span key={i} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', color: '#374151' }}>
                        {kw.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #f3f4f6', paddingTop: '12px' }}>
                <button 
                  onClick={() => handleOpenEdit(role)} 
                  className="btn btn-outline"
                  style={{ padding: '6px 12px', fontSize: '0.85rem', color: '#1d4ed8', borderColor: '#bfdbfe', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Edit2 size={14} /> Modifier
                </button>
                <button 
                  onClick={() => handleDelete(role)} 
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
