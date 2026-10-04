"use client";

import { useState } from 'react';
import { UserCheck, Plus, Edit2, Trash2, Check, X, Upload } from 'lucide-react';
import { StaffMember, saveStaff, deleteStaff } from '@/lib/dataService';
import { validateUploadFile } from '@/lib/security';
import { useConfirmPoster } from '@/components/ui/ConfirmPosterModal';

interface StaffManagerProps {
  staff: StaffMember[];
  onRefresh: () => void;
  showToast: (msg: string) => void;
}

const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const validation = validateUploadFile(file);
    if (!validation.valid) {
      alert(validation.error || 'Fichier non valide.');
      reject(new Error(validation.error || 'Fichier non valide.'));
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export default function StaffManager({ staff, onRefresh, showToast }: StaffManagerProps) {
  const { askConfirm } = useConfirmPoster();
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleOpenCreate = () => {
    setIsCreating(true);
    setEditingStaff({
      id: `staff-${Date.now()}`,
      name: '',
      role: '',
      img: '/condor_logo_transparent.png',
      order: staff.length + 1
    });
  };

  const handleOpenEdit = (member: StaffMember) => {
    setIsCreating(false);
    setEditingStaff({ ...member });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff || !editingStaff.name.trim()) {
      showToast("Veuillez saisir un nom pour le membre du staff.");
      return;
    }

    askConfirm({
      title: isCreating ? "AJOUTER AU STAFF" : "MODIFIER LE MEMBRE DU STAFF",
      message: isCreating 
        ? `Confirmez-vous l'ajout de ${editingStaff.name} à l'encadrement technique ?` 
        : `Confirmez-vous la modification de la fiche de ${editingStaff.name} ?`,
      confirmLabel: isCreating ? "OUI, AJOUTER" : "OUI, ENREGISTRER",
      itemDetails: {
        type: isCreating ? 'Ajout' : 'Modification',
        title: editingStaff.name,
        subtitle: editingStaff.role || 'Encadrement Technique',
        image: editingStaff.img,
        badge: 'Staff'
      },
      onConfirm: async () => {
        setSaving(true);
        try {
          const res = await saveStaff(editingStaff);
          if (res.success) {
            showToast(`Membre du staff "${editingStaff.name}" ${isCreating ? 'ajouté' : 'mis à jour'} !`);
            setEditingStaff(null);
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
      }
    });
  };

  const handleDelete = (member: StaffMember) => {
    askConfirm({
      title: "SUPPRIMER DU STAFF",
      message: `Supprimer ${member.name} du staff et de l'encadrement ?`,
      confirmLabel: "OUI, SUPPRIMER",
      itemDetails: {
        type: 'Suppression',
        title: member.name,
        subtitle: member.role || 'Staff Technique',
        image: member.img,
        badge: 'Staff'
      },
      onConfirm: async () => {
        try {
          const res = await deleteStaff(member.id);
          if (res.success) {
            showToast(`Membre "${member.name}" supprimé.`);
            if (editingStaff?.id === member.id) {
              setEditingStaff(null);
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

  const sortedStaff = [...staff].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <UserCheck size={28} color="var(--clr-primary)" />
            Staff & Encadrement Technique
          </h2>
          <p style={{ color: 'var(--clr-gray)', margin: '5px 0 0', maxWidth: '700px' }}>
            Gérez les membres de l'équipe technique affichés sur la page Club (Direction, Entraîneurs, Préparateurs, Secrétariat).
          </p>
        </div>

        <button 
          onClick={handleOpenCreate}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
        >
          <Plus size={18} /> Ajouter un Membre du Staff
        </button>
      </div>

      {editingStaff && (
        <form onSubmit={handleSave} style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '2px solid var(--clr-primary)', marginBottom: '2.5rem', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '12px' }}>
            <h3 style={{ fontSize: '1.4rem', margin: 0, fontWeight: 'bold' }}>
              {isCreating ? 'Ajouter un Membre du Staff' : `Modifier : ${editingStaff.name}`}
            </h3>
            <button 
              type="button" 
              onClick={() => { setEditingStaff(null); setIsCreating(false); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}
            >
              <X size={20} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '6px' }}>Nom complet *</label>
              <input 
                type="text" 
                value={editingStaff.name} 
                onChange={e => setEditingStaff({ ...editingStaff, name: e.target.value })} 
                required 
                placeholder="Ex: Jean-Claude Valme"
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem' }} 
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '6px' }}>Rôle / Fonction *</label>
              <input 
                type="text" 
                value={editingStaff.role} 
                onChange={e => setEditingStaff({ ...editingStaff, role: e.target.value })} 
                required 
                placeholder="Ex: Directeur Technique"
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem' }} 
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '6px' }}>Ordre d'affichage</label>
              <input 
                type="number" 
                value={editingStaff.order || 1} 
                onChange={e => setEditingStaff({ ...editingStaff, order: parseInt(e.target.value) || 1 })} 
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem' }} 
              />
            </div>
          </div>

          {/* Photo */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '6px' }}>Photo officielle</label>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
              <img 
                src={editingStaff.img || '/condor_logo_transparent.png'} 
                alt="preview" 
                style={{ width: '65px', height: '65px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #ddd' }} 
              />
              <div style={{ flex: 1, minWidth: '220px' }}>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={async e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const base64 = await convertToBase64(file);
                      setEditingStaff({ ...editingStaff, img: base64 });
                    }
                  }}
                  style={{ display: 'block', marginBottom: '6px' }}
                />
                <input 
                  type="text" 
                  placeholder="Ou collez une URL d'image (ex: /mon-image.png)" 
                  value={editingStaff.img || ''} 
                  onChange={e => setEditingStaff({ ...editingStaff, img: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '0.85rem' }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" disabled={saving} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Check size={16} /> {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
            <button 
              type="button" 
              onClick={() => { setEditingStaff(null); setIsCreating(false); }} 
              className="btn btn-outline" 
              style={{ color: 'black', borderColor: '#ccc' }}
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      {/* Liste des membres */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
        {sortedStaff.map(member => (
          <div 
            key={member.id}
            style={{
              background: 'white',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              padding: '1.5rem',
              textAlign: 'center',
              boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ width: '90px', height: '90px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto 1rem', border: '3px solid var(--clr-primary)' }}>
                <img src={member.img || '/condor_logo_transparent.png'} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h3 style={{ margin: '0 0 4px', fontSize: '1.2rem', fontWeight: 'bold' }}>{member.name}</h3>
              <span style={{ color: 'var(--clr-primary)', fontSize: '0.9rem', fontWeight: 'bold', display: 'block', marginBottom: '1rem' }}>{member.role}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', borderTop: '1px solid #f3f4f6', paddingTop: '12px' }}>
              <button 
                onClick={() => handleOpenEdit(member)} 
                className="btn btn-outline"
                style={{ padding: '6px 12px', fontSize: '0.85rem', color: '#1d4ed8', borderColor: '#bfdbfe', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Edit2 size={14} /> Modifier
              </button>
              <button 
                onClick={() => handleDelete(member)} 
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
