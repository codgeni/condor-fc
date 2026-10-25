"use client";

import { useState, useMemo } from 'react';
import { 
  Shield, Plus, Edit2, Trash2, Check, X, Users, AlertCircle, 
  Upload, Image as ImageIcon, Search, UserPlus, Star 
} from 'lucide-react';
import { UnitItem, saveUnit, deleteUnit, addPlayerCategory, removePlayerCategory } from '@/lib/dataService';
import { useConfirmPoster } from '@/components/ui/ConfirmPosterModal';
import { validateUploadFile, compressAndOptimizeImage } from '@/lib/security';

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
  const [processingImage, setProcessingImage] = useState(false);

  // Roster management modal state
  const [activeRosterUnit, setActiveRosterUnit] = useState<UnitItem | null>(null);
  const [rosterSearch, setRosterSearch] = useState('');
  const [playerToAddId, setPlayerToAddId] = useState('');

  const handleBannerFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingUnit) return;
    const validation = validateUploadFile(file);
    if (!validation.valid) {
      showToast(validation.error || 'Fichier non valide.');
      return;
    }
    setProcessingImage(true);
    try {
      showToast("Optimisation de la bannière...");
      const compressed = await compressAndOptimizeImage(file, 1920, 0.85);
      setEditingUnit(prev => prev ? { ...prev, image: compressed } : null);
      showToast("Photo de la bannière chargée avec succès !");
    } catch (err) {
      showToast("Erreur lors du traitement de l'image.");
    } finally {
      setProcessingImage(false);
      // Reset input value so user can re-select same file if needed
      e.target.value = '';
    }
  };

  // Calculate players count for each unit
  const getPlayerCount = (unitName: string) => {
    return Object.values(players).filter(p => {
      if (Array.isArray(p.categories)) return p.categories.includes(unitName);
      if (Array.isArray(p.category)) return p.category.includes(unitName);
      return p.category === unitName;
    }).length;
  };

  // Players currently in activeRosterUnit
  const playersInUnit = useMemo(() => {
    if (!activeRosterUnit) return [];
    let list = Object.values(players).filter(p => {
      if (Array.isArray(p.categories)) return p.categories.includes(activeRosterUnit.name);
      if (Array.isArray(p.category)) return p.category.includes(activeRosterUnit.name);
      return p.category === activeRosterUnit.name;
    });
    if (rosterSearch.trim()) {
      const q = rosterSearch.toLowerCase().trim();
      list = list.filter(p => 
        (p.name && p.name.toLowerCase().includes(q)) || 
        (p.num && String(p.num).includes(q)) || 
        (p.pos && p.pos.toLowerCase().includes(q))
      );
    }
    return list.sort((a, b) => (Number(a.num) || 0) - (Number(b.num) || 0));
  }, [players, activeRosterUnit, rosterSearch]);

  // Players eligible to be added into activeRosterUnit (not yet in this unit)
  const playersNotInUnit = useMemo(() => {
    if (!activeRosterUnit) return [];
    return Object.values(players).filter(p => {
      const cats = Array.isArray(p.categories) && p.categories.length > 0 
        ? p.categories 
        : [p.category || 'U17'];
      return !cats.includes(activeRosterUnit.name);
    }).sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }, [players, activeRosterUnit]);

  // Add player to activeRosterUnit
  const handleAddPlayerToUnit = async (playerId: string) => {
    if (!activeRosterUnit || !playerId) return;
    const player = players[playerId];
    if (!player) return;

    try {
      const res = await addPlayerCategory(playerId, activeRosterUnit.name, player);
      if (res.success) {
        showToast(`${player.name} ajouté à l'unité "${activeRosterUnit.name}" avec succès !`);
        setPlayerToAddId('');
        onRefresh();
      } else {
        showToast("Erreur lors de l'ajout à l'unité.");
      }
    } catch (err) {
      showToast("Erreur lors de l'ajout.");
    }
  };

  // Remove player from activeRosterUnit
  const handleRemovePlayerFromUnit = (player: any) => {
    if (!activeRosterUnit) return;
    const playerCats: string[] = Array.isArray(player.categories) && player.categories.length > 0
      ? player.categories
      : [player.category || 'U17'];

    if (playerCats.length <= 1) {
      showToast("Impossible : le joueur doit appartenir à au moins une unité.");
      return;
    }

    askConfirm({
      title: "RETIRER DE L'UNITÉ",
      message: `Voulez-vous retirer ${player.name} de l'unité "${activeRosterUnit.name}" ?\nIl restera inscrit dans : ${playerCats.filter(c => c !== activeRosterUnit.name).join(', ')}.`,
      confirmLabel: "OUI, RETIRER",
      itemDetails: {
        type: 'Modification',
        title: player.name,
        subtitle: `Retrait de l'unité ${activeRosterUnit.name}`,
        badge: activeRosterUnit.name
      },
      onConfirm: async () => {
        try {
          const res = await removePlayerCategory(player.id, activeRosterUnit.name, player);
          if (res.success) {
            showToast(`${player.name} retiré de l'unité "${activeRosterUnit.name}".`);
            onRefresh();
          } else {
            showToast(res.error || "Erreur lors du retrait de l'unité.");
          }
        } catch (err) {
          showToast("Erreur lors du retrait.");
        }
      }
    });
  };

  const handleOpenCreate = () => {
    setIsCreating(true);
    setEditingUnit({
      id: `unit-${Date.now()}`,
      name: '',
      description: '',
      order: units.length + 1,
      is_active: true,
      image: '/kick_hero.png'
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
                Nom de l'unité * (ex: U17, U15, U13, Féminine)
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

          <div style={{ marginBottom: '1.5rem', background: '#f8fafc', padding: '1.4rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: 'bold', color: '#0f172a' }}>
                  Photo de la bannière du haut (Hero Banner pour {editingUnit.name || 'cette unité'})
                </label>
                <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                  S'affiche en grand en tête de la page Équipes lorsque cette catégorie est consultée. Choisissez directement un fichier depuis votre téléphone (appareil photo ou galerie) ou votre ordinateur.
                </p>
              </div>
            </div>

            {/* Banner Preview Card */}
            {editingUnit.image && (
              <div style={{ position: 'relative', height: '140px', borderRadius: '10px', overflow: 'hidden', margin: '14px 0', border: '2px solid #cbd5e1', background: '#0f172a' }}>
                <img 
                  src={editingUnit.image} 
                  alt="Aperçu bannière unité" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)', display: 'flex', alignItems: 'flex-end', padding: '12px 16px', justifyContent: 'space-between' }}>
                  <span style={{ color: 'white', fontWeight: 'bold', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Check size={16} color="#22c55e" /> Bannière active : {editingUnit.name || 'Unité'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setEditingUnit({ ...editingUnit, image: '/kick_hero.png' })}
                    style={{ background: 'rgba(0,0,0,0.6)', color: '#fca5a5', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', padding: '4px 10px', fontSize: '0.75rem', cursor: 'pointer' }}
                  >
                    Réinitialiser par défaut
                  </button>
                </div>
              </div>
            )}

            {/* Direct File Picker Controls */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginTop: '10px' }}>
              <input 
                id="unit-banner-file-input"
                type="file" 
                accept="image/*"
                onChange={handleBannerFileSelect}
                disabled={processingImage}
                style={{ display: 'none' }}
              />

              <label 
                htmlFor="unit-banner-file-input"
                className="btn btn-primary"
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  padding: '10px 18px', 
                  fontSize: '0.9rem', 
                  cursor: processingImage ? 'wait' : 'pointer',
                  opacity: processingImage ? 0.7 : 1,
                  boxShadow: '0 2px 8px rgba(224, 30, 38, 0.25)'
                }}
              >
                <Upload size={18} />
                {processingImage ? 'Traitement en cours...' : editingUnit.image ? 'Changer la photo depuis l’appareil' : 'Choisir une photo (Téléphone ou PC)'}
              </label>

              <div style={{ flex: 1, minWidth: '220px' }}>
                <input 
                  type="text" 
                  value={editingUnit.image || ''} 
                  onChange={e => setEditingUnit({ ...editingUnit, image: e.target.value })} 
                  placeholder="Ou collez un lien URL (ex: /kick_hero.png)" 
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }} 
                />
              </div>
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {sortedUnits.map(unit => {
          const count = getPlayerCount(unit.name);
          const unitImg = unit.image || '/kick_hero.png';
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
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div>
                <div style={{ position: 'relative', height: '120px', borderRadius: '8px', overflow: 'hidden', marginBottom: '12px', background: '#0f172a' }}>
                  <img src={unitImg} alt={unit.name} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />
                  <div style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(0,0,0,0.65)', color: 'white', padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    Affiche Landing Page
                  </div>
                </div>

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

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', borderTop: '1px solid #f3f4f6', paddingTop: '12px', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => setActiveRosterUnit(unit)} 
                  className="btn btn-outline"
                  style={{ padding: '6px 12px', fontSize: '0.85rem', color: 'var(--clr-primary)', borderColor: 'rgba(224, 30, 38, 0.4)', background: 'rgba(224, 30, 38, 0.04)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  <Users size={14} /> Effectif ({count})
                </button>

                <div style={{ display: 'flex', gap: '8px' }}>
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
            </div>
          );
        })}
      </div>

      {/* Modal de Gestion de l'Effectif de l'Unité */}
      {activeRosterUnit && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '1.5rem'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '750px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
            border: '2px solid var(--clr-primary)'
          }}>
            {/* Header Modal */}
            <div style={{
              background: '#0f172a',
              color: 'white',
              padding: '1.2rem 1.8rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Shield size={24} color="var(--clr-primary)" />
                  <h3 style={{ margin: 0, fontSize: '1.4rem', fontFamily: 'var(--font-heading)' }}>
                    Effectif de l'Unité : {activeRosterUnit.name}
                  </h3>
                </div>
                <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#94a3b8' }}>
                  Affectez des joueurs à cette unité (ex: surclassement de U13 vers U15 ou U17)
                </p>
              </div>

              <button
                onClick={() => { setActiveRosterUnit(null); setRosterSearch(''); setPlayerToAddId(''); }}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
              >
                <X size={22} />
              </button>
            </div>

            <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
              {/* Zone 1: Ajouter un joueur à cette unité */}
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1.2rem',
                marginBottom: '1.8rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <UserPlus size={18} color="var(--clr-primary)" />
                  <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold', color: '#0f172a' }}>
                    Ajouter un joueur à l'unité "{activeRosterUnit.name}"
                  </h4>
                </div>
                <p style={{ margin: '0 0 12px', fontSize: '0.82rem', color: '#64748b' }}>
                  Sélectionnez un joueur issu d'une autre catégorie pour l'intégrer à cette unité tout en conservant ses unités d'origine.
                </p>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <select
                    value={playerToAddId}
                    onChange={e => setPlayerToAddId(e.target.value)}
                    style={{
                      flex: 1,
                      minWidth: '260px',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.9rem',
                      background: 'white'
                    }}
                  >
                    <option value="">-- Choisir un joueur à ajouter ({playersNotInUnit.length} disponibles) --</option>
                    {playersNotInUnit.map(p => {
                      const cats = Array.isArray(p.categories) ? p.categories.join(', ') : (p.category || 'U17');
                      return (
                        <option key={p.id} value={p.id}>
                          {p.name} (#{p.num} • {p.pos || 'Joueur'} • Actuellement : {cats})
                        </option>
                      );
                    })}
                  </select>

                  <button
                    disabled={!playerToAddId}
                    onClick={() => handleAddPlayerToUnit(playerToAddId)}
                    className="btn btn-primary"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 18px',
                      fontSize: '0.9rem',
                      cursor: playerToAddId ? 'pointer' : 'not-allowed',
                      opacity: playerToAddId ? 1 : 0.6
                    }}
                  >
                    <Plus size={16} /> Ajouter à {activeRosterUnit.name}
                  </button>
                </div>
              </div>

              {/* Zone 2: Liste des joueurs actuels de l'unité */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                  <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 'bold', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={16} color="var(--clr-primary)" />
                    Joueurs inscrits dans cette unité ({playersInUnit.length})
                  </h4>

                  <div style={{ position: 'relative', width: '220px' }}>
                    <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      placeholder="Filtrer par nom..."
                      value={rosterSearch}
                      onChange={e => setRosterSearch(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '6px 10px 6px 32px',
                        borderRadius: '6px',
                        border: '1px solid #d1d5db',
                        fontSize: '0.82rem'
                      }}
                    />
                  </div>
                </div>

                {playersInUnit.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2.5rem 1rem', background: '#f8fafc', borderRadius: '10px', border: '1px dashed #cbd5e1' }}>
                    <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>
                      Aucun joueur n'est actuellement inscrit dans l'unité "{activeRosterUnit.name}".
                    </p>
                    <p style={{ color: '#94a3b8', margin: '4px 0 0', fontSize: '0.8rem' }}>
                      Utilisez le sélecteur ci-dessus pour ajouter des joueurs.
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {playersInUnit.map(player => {
                      const playerCats: string[] = Array.isArray(player.categories) && player.categories.length > 0
                        ? player.categories
                        : [player.category || 'U17'];
                      const isMultiUnit = playerCats.length > 1;
                      const otherUnits = playerCats.filter(c => c !== activeRosterUnit.name);

                      return (
                        <div
                          key={player.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px 14px',
                            borderRadius: '10px',
                            border: '1px solid #e2e8f0',
                            background: 'white',
                            gap: '12px'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                            <img
                              src={player.img || '/condor_logo_transparent.png'}
                              alt={player.name}
                              style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #cbd5e1' }}
                            />
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontWeight: 'bold', fontSize: '0.95rem', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                #{player.num} • {player.name}
                              </div>
                              <div style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                <span>{player.pos || 'Joueur'}</span>
                                {otherUnits.length > 0 && (
                                  <span style={{ color: '#2563eb', fontWeight: 'bold' }}>
                                    • Également dans : {otherUnits.join(', ')}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div>
                            {isMultiUnit ? (
                              <button
                                onClick={() => handleRemovePlayerFromUnit(player)}
                                className="btn btn-outline"
                                style={{
                                  padding: '5px 10px',
                                  fontSize: '0.78rem',
                                  color: '#b91c1c',
                                  borderColor: '#fecaca',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  cursor: 'pointer'
                                }}
                              >
                                <X size={13} /> Retirer de {activeRosterUnit.name}
                              </button>
                            ) : (
                              <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic', padding: '4px 8px' }}>
                                Unité unique
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div style={{
              background: '#f8fafc',
              borderTop: '1px solid #e2e8f0',
              padding: '12px 1.8rem',
              display: 'flex',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => { setActiveRosterUnit(null); setRosterSearch(''); setPlayerToAddId(''); }}
                className="btn btn-outline"
                style={{ padding: '8px 18px', fontSize: '0.9rem', cursor: 'pointer' }}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
