"use client";

import { useState, useMemo } from 'react';
import { 
  Users, Plus, Edit2, Trash2, Check, X, Search, 
  ArrowRightLeft, Shield, Award, Upload, Image, RefreshCw, AlertTriangle, Star
} from 'lucide-react';
import { 
  PlayerData, UnitItem, RoleItem, 
  savePlayerRecord, deletePlayerRecord, transferPlayerCategory,
  addPlayerCategory, removePlayerCategory
} from '@/lib/dataService';
import { validateUploadFile, compressAndOptimizeImage } from '@/lib/security';
import { useConfirmPoster } from '@/components/ui/ConfirmPosterModal';

interface PlayersManagerProps {
  players: Record<string, any>;
  units: UnitItem[];
  roles: RoleItem[];
  onRefresh: () => void;
  showToast: (msg: string) => void;
}

const convertToBase64 = async (file: File, maxDim = 1200): Promise<string> => {
  const validation = validateUploadFile(file);
  if (!validation.valid) {
    throw new Error(validation.error || 'Fichier non valide.');
  }
  return await compressAndOptimizeImage(file, maxDim, 0.85);
};

const AVAILABLE_STATS = [
  { id: 'goals', label: 'Buts Marqués', icon: '⚽' },
  { id: 'assists', label: 'Passes Décisives', icon: '👟' },
  { id: 'matches', label: 'Matchs Joués', icon: '🏟️' },
  { id: 'passes', label: 'Passes Réussies', icon: '🎯' },
  { id: 'saves', label: 'Arrêts / Ballons Arrêtés', icon: '🧤' },
  { id: 'cleansheets', label: 'Clean Sheets', icon: '🛡️' },
  { id: 'tackles', label: 'Tacles Réussis', icon: '⚡' },
  { id: 'minutes', label: 'Minutes Jouées', icon: '⏱️' },
  { id: 'custom', label: 'Statistique Personnalisée', icon: '⭐' }
];

const STAT_PRESETS = [
  { name: 'Attaquant', icon: '⚡', stats: ['goals', 'assists', 'matches'] },
  { name: 'Milieu', icon: '🎯', stats: ['goals', 'assists', 'passes', 'matches'] },
  { name: 'Défenseur', icon: '🛡️', stats: ['tackles', 'cleansheets', 'passes', 'matches'] },
  { name: 'Gardien', icon: '🧤', stats: ['saves', 'cleansheets', 'matches'] }
];

export default function PlayersManager({
  players,
  units,
  roles,
  onRefresh,
  showToast
}: PlayersManagerProps) {
  const { askConfirm } = useConfirmPoster();
  const [selectedUnit, setSelectedUnit] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingPlayer, setEditingPlayer] = useState<any | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  // Filtered players list
  const filteredPlayers = useMemo(() => {
    let list = Object.values(players);

    // Filter by unit
    if (selectedUnit !== 'all') {
      list = list.filter(p => {
        if (Array.isArray(p.categories)) return p.categories.includes(selectedUnit);
        if (Array.isArray(p.category)) return p.category.includes(selectedUnit);
        return p.category === selectedUnit;
      });
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(p => 
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.num && String(p.num).includes(q)) ||
        (p.pos && p.pos.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q))
      );
    }

    // Sort by jersey number
    return list.sort((a, b) => (Number(a.num) || 0) - (Number(b.num) || 0));
  }, [players, selectedUnit, searchQuery]);

  // Unit player count helper
  const getUnitCount = (unitName: string) => {
    return Object.values(players).filter(p => {
      if (Array.isArray(p.categories)) return p.categories.includes(unitName);
      if (Array.isArray(p.category)) return p.category.includes(unitName);
      return p.category === unitName;
    }).length;
  };

  // Open creation modal
  const handleOpenCreate = () => {
    setIsCreating(true);
    const defaultUnit = selectedUnit !== 'all' ? selectedUnit : (units[0]?.name || 'U17');
    setEditingPlayer({
      id: Date.now().toString(),
      name: '',
      num: 10,
      pos: 'Attaquant',
      role: 'Attaquants',
      category: defaultUnit,
      categories: [defaultUnit],
      foot: 'Droit',
      nationality: 'Haïtienne',
      pob: 'Port-au-Prince, Haïti',
      height: '',
      weight: '',
      dob: '',
      bio: '',
      matches: 0,
      goals: 0,
      assists: 0,
      stat2lbl: 'Buts',
      stat2val: 0,
      honours1: 0,
      honours2: 0,
      displayed_stats: ['goals', 'assists', 'matches'],
      passes: 0,
      saves: 0,
      cleansheets: 0,
      tackles: 0,
      minutes: 0,
      custom_stat_label: '',
      custom_stat_val: 0,
      is_spotlight: false,
      img: '/condor_logo_transparent.png',
      detail_img: '/condor_logo_transparent.png'
    });
  };

  // Open edit modal
  const handleOpenEdit = (player: any) => {
    setIsCreating(false);
    const existingCats = Array.isArray(player.categories) && player.categories.length > 0
      ? player.categories
      : [player.category || 'U17'];
    const existingPrimary = player.category && existingCats.includes(player.category)
      ? player.category
      : existingCats[0];

    const isGK = (player.pos || '').toLowerCase().includes('gardien') || player.stat2lbl === 'Arrêts';
    const defaultDisplayed = isGK ? ['saves', 'cleansheets', 'matches'] : ['goals', 'assists', 'matches'];
    const displayedStats = Array.isArray(player.displayed_stats) && player.displayed_stats.length > 0
      ? player.displayed_stats
      : defaultDisplayed;

    setEditingPlayer({
      ...player,
      matches: player.matches ?? 0,
      goals: player.goals ?? 0,
      assists: player.assists ?? 0,
      stat2lbl: player.stat2lbl || (isGK ? 'Arrêts' : 'Buts'),
      stat2val: player.stat2val ?? 0,
      honours1: player.honours1 !== undefined ? Number(player.honours1) : 0,
      honours2: player.honours2 !== undefined ? Number(player.honours2) : 0,
      displayed_stats: displayedStats,
      passes: player.passes ?? 0,
      saves: player.saves ?? (isGK ? player.stat2val ?? 0 : 0),
      cleansheets: player.cleansheets ?? 0,
      tackles: player.tackles ?? 0,
      minutes: player.minutes ?? 0,
      custom_stat_label: player.custom_stat_label || (player.stat2lbl !== 'Buts' && player.stat2lbl !== 'Arrêts' ? player.stat2lbl : ''),
      custom_stat_val: player.custom_stat_val ?? (player.stat2lbl !== 'Buts' && player.stat2lbl !== 'Arrêts' ? player.stat2val ?? 0 : 0),
      height: player.height || '',
      weight: player.weight || '',
      dob: player.dob || '',
      pob: player.pob || '',
      foot: player.foot || 'Droit',
      nationality: player.nationality || 'Haïtienne',
      bio: player.bio || '',
      is_spotlight: Boolean(player.is_spotlight || player.spotlight),
      detail_img: player.detail_img || player.detailImg || player.img || '/condor_logo_transparent.png',
      img: player.img || '/condor_logo_transparent.png',
      category: existingPrimary,
      categories: existingCats
    });
  };

  // Quick 1-click spotlight toggle for card
  const handleToggleSpotlight = async (player: any) => {
    const nextSpotlight = !(player.is_spotlight || player.spotlight);
    try {
      const res = await savePlayerRecord({
        ...player,
        is_spotlight: nextSpotlight
      });
      if (res.success) {
        showToast(nextSpotlight ? `⭐ ${player.name} mis en avant sur la page d'accueil !` : `⭐ ${player.name} retiré des joueurs mis en avant.`);
        onRefresh();
      } else {
        showToast("Erreur lors de la mise à jour.");
      }
    } catch (err) {
      showToast("Erreur lors de la mise à jour.");
    }
  };

  const handleProfilePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingPlayer) return;
    try {
      showToast("Optimisation de la photo de profil...");
      const compressed = await convertToBase64(file, 1200);
      setEditingPlayer((prev: any) => ({ ...prev, img: compressed }));
      showToast("Photo de profil mise à jour !");
    } catch (err: any) {
      showToast(err.message || "Erreur lors du chargement de l'image.");
    } finally {
      e.target.value = '';
    }
  };

  const handleDetailPhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingPlayer) return;
    try {
      showToast("Optimisation de la photo de célébration...");
      const compressed = await convertToBase64(file, 1400);
      setEditingPlayer((prev: any) => ({ ...prev, detail_img: compressed, detailImg: compressed }));
      showToast("Photo de célébration mise à jour !");
    } catch (err: any) {
      showToast(err.message || "Erreur lors du chargement de l'image.");
    } finally {
      e.target.value = '';
    }
  };

  // Toggle category in create/edit form
  const handleToggleCategoryInForm = (unitName: string) => {
    if (!editingPlayer) return;
    const currentCats: string[] = Array.isArray(editingPlayer.categories) && editingPlayer.categories.length > 0
      ? [...editingPlayer.categories]
      : [editingPlayer.category || 'U17'];

    if (currentCats.includes(unitName)) {
      if (currentCats.length <= 1) {
        showToast("Le joueur doit obligatoirement avoir au moins une unité affectée.");
        return;
      }
      const newCats = currentCats.filter(c => c !== unitName);
      const newPrimary = editingPlayer.category === unitName ? newCats[0] : editingPlayer.category;
      setEditingPlayer({
        ...editingPlayer,
        categories: newCats,
        category: newPrimary
      });
    } else {
      const newCats = [...currentCats, unitName];
      setEditingPlayer({
        ...editingPlayer,
        categories: newCats,
        category: editingPlayer.category || unitName
      });
    }
  };

  // Set primary category in create/edit form
  const handleSetPrimaryInForm = (unitName: string) => {
    if (!editingPlayer) return;
    setEditingPlayer({
      ...editingPlayer,
      category: unitName
    });
  };

  // Quick add player to another unit
  const handleQuickAddUnit = async (playerId: string, unitName: string, player: any) => {
    try {
      const res = await addPlayerCategory(playerId, unitName, player);
      if (res.success) {
        showToast(`${player.name} ajouté à l'unité "${unitName}" avec succès !`);
        onRefresh();
      } else {
        showToast("Erreur lors de l'ajout à l'unité.");
      }
    } catch (err) {
      showToast("Erreur lors de l'ajout.");
    }
  };

  // Quick remove player from a secondary unit
  const handleQuickRemoveUnit = (playerId: string, unitName: string, player: any) => {
    const playerCats: string[] = Array.isArray(player.categories) && player.categories.length > 0
      ? player.categories
      : [player.category || 'U17'];

    if (playerCats.length <= 1) {
      showToast("Impossible : le joueur doit avoir au moins une unité.");
      return;
    }

    askConfirm({
      title: "RETIRER DE L'UNITÉ",
      message: `Voulez-vous retirer ${player.name} de l'unité "${unitName}" ?\nIl restera inscrit dans : ${playerCats.filter(c => c !== unitName).join(', ')}.`,
      confirmLabel: "OUI, RETIRER",
      itemDetails: {
        type: 'Modification',
        title: player.name,
        subtitle: `Retrait de l'unité ${unitName}`,
        badge: unitName
      },
      onConfirm: async () => {
        try {
          const res = await removePlayerCategory(playerId, unitName, player);
          if (res.success) {
            showToast(`${player.name} retiré de l'unité "${unitName}".`);
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

  // Quick transfer player (change primary unit)
  const handleQuickTransfer = async (playerId: string, newUnit: string, player: any) => {
    try {
      const res = await transferPlayerCategory(playerId, newUnit, player);
      if (res.success) {
        showToast(`Joueur ${player.name} assigné à "${newUnit}" !`);
        onRefresh();
      } else {
        showToast("Erreur lors du transfert du joueur.");
      }
    } catch (err) {
      showToast("Erreur lors du transfert.");
    }
  };

  // Save player
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlayer || !editingPlayer.name.trim()) {
      showToast("Veuillez renseigner le nom du joueur.");
      return;
    }

    const rawCats = Array.isArray(editingPlayer.categories) && editingPlayer.categories.length > 0
      ? editingPlayer.categories
      : [editingPlayer.category || 'U17'];
    const finalCats = Array.from(new Set(rawCats.filter(Boolean)));
    const finalPrimary = editingPlayer.category && finalCats.includes(editingPlayer.category)
      ? editingPlayer.category
      : (finalCats[0] || 'U17');

    const payload: PlayerData = {
      ...editingPlayer,
      id: String(editingPlayer.id || Date.now()),
      num: parseInt(editingPlayer.num) || 0,
      name: editingPlayer.name.trim(),
      pos: editingPlayer.pos || 'Joueur',
      category: finalPrimary,
      categories: finalCats,
      matches: parseInt(editingPlayer.matches) || 0,
      goals: parseInt(editingPlayer.goals) || 0,
      assists: parseInt(editingPlayer.assists) || 0,
      stat2lbl: editingPlayer.stat2lbl || 'Buts',
      stat2val: parseInt(editingPlayer.stat2val) || 0,
      honours1: editingPlayer.honours1 !== undefined ? parseInt(editingPlayer.honours1) || 0 : 0,
      honours2: editingPlayer.honours2 !== undefined ? parseInt(editingPlayer.honours2) || 0 : 0,
      displayed_stats: Array.isArray(editingPlayer.displayed_stats) && editingPlayer.displayed_stats.length > 0
        ? editingPlayer.displayed_stats
        : ['goals', 'assists', 'matches'],
      passes: parseInt(editingPlayer.passes) || 0,
      saves: parseInt(editingPlayer.saves) || 0,
      cleansheets: parseInt(editingPlayer.cleansheets) || 0,
      tackles: parseInt(editingPlayer.tackles) || 0,
      minutes: parseInt(editingPlayer.minutes) || 0,
      custom_stat_label: (editingPlayer.custom_stat_label || '').trim(),
      custom_stat_val: parseInt(editingPlayer.custom_stat_val) || 0,
      height: editingPlayer.height || '',
      weight: editingPlayer.weight || '',
      dob: editingPlayer.dob || '',
      pob: editingPlayer.pob || '',
      foot: editingPlayer.foot || 'Droit',
      nationality: editingPlayer.nationality || 'Haïtienne',
      bio: editingPlayer.bio || '',
      is_spotlight: Boolean(editingPlayer.is_spotlight),
      img: editingPlayer.img || '/condor_logo_transparent.png',
      detail_img: editingPlayer.detail_img || editingPlayer.img || '/condor_logo_transparent.png'
    };

    askConfirm({
      title: isCreating ? 'AJOUTER LE JOUEUR' : 'MODIFIER LE JOUEUR',
      message: isCreating 
        ? `Confirmez-vous l'ajout de ${payload.name} à l'effectif (${payload.categories?.join(', ')}) ?` 
        : `Confirmez-vous la modification de la fiche de ${payload.name} ?`,
      confirmLabel: isCreating ? 'OUI, AJOUTER' : 'OUI, ENREGISTRER',
      itemDetails: {
        type: isCreating ? 'Ajout' : 'Modification',
        title: payload.name,
        subtitle: `Dossard #${payload.num} • ${payload.pos}`,
        image: payload.img,
        badge: payload.categories?.join(' • ') || payload.category
      },
      onConfirm: async () => {
        setSaving(true);
        try {
          const res = await savePlayerRecord(payload);
          if (res.success) {
            showToast(`Fiche de ${payload.name} enregistrée avec succès !`);
            setEditingPlayer(null);
            setIsCreating(false);
            onRefresh();
          } else {
            showToast("Erreur lors de l'enregistrement du joueur.");
          }
        } catch (err) {
          showToast("Erreur lors de la sauvegarde.");
        } finally {
          setSaving(false);
        }
      }
    });
  };

  // Delete player
  const handleDelete = (id: string, name: string) => {
    const targetPlayer = players[id] || (editingPlayer?.id === id ? editingPlayer : null);
    askConfirm({
      title: 'SUPPRIMER LE JOUEUR',
      message: `Confirmez-vous la suppression définitive du profil de ${name} (#${id}) ?\nCette action supprimera également sa fiche de la base de données.`,
      confirmLabel: 'OUI, SUPPRIMER',
      itemDetails: {
        type: 'Suppression',
        title: name,
        subtitle: `Dossard #${targetPlayer?.num || id} • ${targetPlayer?.pos || 'Joueur'}`,
        image: targetPlayer?.img,
        badge: targetPlayer?.category || 'Effectif'
      },
      onConfirm: async () => {
        try {
          const res = await deletePlayerRecord(id);
          if (res.success) {
            showToast(`Profil du joueur ${name} supprimé avec succès.`);
            if (editingPlayer?.id === id) {
              setEditingPlayer(null);
              setIsCreating(false);
            }
            onRefresh();
          } else {
            showToast("Erreur lors de la suppression.");
          }
        } catch (err) {
          showToast("Erreur lors de la suppression.");
        }
      }
    });
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Users size={28} color="var(--clr-primary)" />
            Roster & Gestion des Joueurs
          </h2>
          <p style={{ color: 'var(--clr-gray)', margin: '5px 0 0' }}>
            Transférez les joueurs d'une unité à l'autre (ex: U17 vers U13), attribuez des rôles, modifiez les photos ou supprimez des profils.
          </p>
        </div>

        <button 
          onClick={handleOpenCreate}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
        >
          <Plus size={18} /> Ajouter un Nouveau Joueur
        </button>
      </div>

      {/* Barre de Filtres par Unité & Recherche */}
      <div style={{ background: 'white', padding: '1.2rem', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Filtre Unités */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#6b7280', marginRight: '4px' }}>Unité :</span>
          <button
            onClick={() => setSelectedUnit('all')}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: 'none',
              background: selectedUnit === 'all' ? 'var(--clr-primary)' : '#f3f4f6',
              color: selectedUnit === 'all' ? 'white' : '#374151',
              fontWeight: selectedUnit === 'all' ? 'bold' : 'normal',
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
          >
            Tous ({Object.keys(players).length})
          </button>

          {units.map(unit => {
            const count = getUnitCount(unit.name);
            const isSelected = selectedUnit === unit.name;
            return (
              <button
                key={unit.id}
                onClick={() => setSelectedUnit(unit.name)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: 'none',
                  background: isSelected ? 'var(--clr-primary)' : '#f3f4f6',
                  color: isSelected ? 'white' : '#374151',
                  fontWeight: isSelected ? 'bold' : 'normal',
                  cursor: 'pointer',
                  fontSize: '0.85rem'
                }}
              >
                {unit.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Barre de Recherche */}
        <div style={{ position: 'relative', minWidth: '240px' }}>
          <Search size={16} color="#9ca3af" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Rechercher par nom, # ou poste..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '8px 10px 8px 34px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.9rem' }}
          />
        </div>
      </div>

      {/* Formulaire Modal / Éditeur de Joueur */}
      {editingPlayer && (
        <form onSubmit={handleSave} style={{ background: 'white', padding: '2.5rem', borderRadius: '16px', border: '2px solid var(--clr-primary)', marginBottom: '3rem', boxShadow: '0 12px 40px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px' }}>
            <div>
              <h3 style={{ fontSize: '1.5rem', margin: 0, fontWeight: 'bold' }}>
                {isCreating ? 'Ajouter un Nouveau Joueur' : `Modifier la Fiche : ${editingPlayer.name}`}
              </h3>
              <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                ID Joueur : #{editingPlayer.id}
              </span>
            </div>
            
            <button 
              type="button" 
              onClick={() => { setEditingPlayer(null); setIsCreating(false); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}
            >
              <X size={24} />
            </button>
          </div>

          {/* 1. Informations Principales */}
          <h4 style={{ fontSize: '1rem', color: 'var(--clr-primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>
            1. Informations Générales & Section
          </h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.2rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px' }}>Nom complet *</label>
              <input 
                type="text" 
                value={editingPlayer.name} 
                onChange={e => setEditingPlayer({ ...editingPlayer, name: e.target.value })} 
                required 
                placeholder="Ex: Wilbensly Laforsse"
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} 
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px' }}>Numéro de maillot *</label>
              <input 
                type="number" 
                value={editingPlayer.num} 
                onChange={e => setEditingPlayer({ ...editingPlayer, num: e.target.value })} 
                required 
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} 
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px' }}>Poste sur le terrain *</label>
              <input 
                type="text" 
                value={editingPlayer.pos} 
                onChange={e => setEditingPlayer({ ...editingPlayer, pos: e.target.value })} 
                required 
                placeholder="Ex: Gardien de But ou Ailier Gauche"
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} 
              />
            </div>
          </div>

          {/* Unités & Catégories d'affectation Multiples */}
          <div style={{ background: '#f8fafc', padding: '1.2rem', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '1.8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '8px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#0f172a' }}>
                Unités & Catégories d'affectation * (Sélection multiple possible)
              </label>
              <span style={{ fontSize: '0.78rem', color: 'var(--clr-primary)', fontWeight: 'bold' }}>
                ⭐ Cliquez sur l'étoile pour définir l'unité principale
              </span>
            </div>
            <p style={{ margin: '0 0 12px', fontSize: '0.82rem', color: '#64748b' }}>
              Cochez toutes les unités où le joueur est inscrit (ex: un joueur de U15 peut aussi être ajouté à U17 et à l'Équipe Première).
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '10px' }}>
              {units.map(unit => {
                const isChecked = Array.isArray(editingPlayer.categories) && editingPlayer.categories.includes(unit.name);
                const isPrimary = editingPlayer.category === unit.name;
                return (
                  <div
                    key={unit.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: isChecked ? '2px solid var(--clr-primary)' : '1px solid #cbd5e1',
                      background: isChecked ? 'rgba(224, 30, 38, 0.05)' : 'white',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <label 
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', flex: 1, margin: 0 }}
                      onClick={() => handleToggleCategoryInForm(unit.name)}
                    >
                      <input 
                        type="checkbox" 
                        checked={isChecked} 
                        onChange={() => handleToggleCategoryInForm(unit.name)}
                        style={{ width: '16px', height: '16px', cursor: 'pointer' }} 
                      />
                      <span style={{ fontWeight: isChecked ? 'bold' : 'normal', fontSize: '0.9rem', color: isChecked ? '#0f172a' : '#475569' }}>
                        {unit.name}
                      </span>
                    </label>

                    {isChecked && (
                      <button
                        type="button"
                        onClick={() => handleSetPrimaryInForm(unit.name)}
                        title={isPrimary ? "Unité principale du joueur" : "Définir comme unité principale"}
                        style={{
                          background: isPrimary ? 'var(--clr-primary)' : 'transparent',
                          color: isPrimary ? 'white' : '#94a3b8',
                          border: isPrimary ? 'none' : '1px solid #cbd5e1',
                          borderRadius: '6px',
                          padding: '3px 7px',
                          fontSize: '0.72rem',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}
                      >
                        ★ {isPrimary ? 'Principale' : 'Définir'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rôle & Attribution Section */}
          <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '1.8rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '8px' }}>
              Attribuer un Rôle & Section automatique :
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              {roles.map(r => (
                <button
                  type="button"
                  key={r.id}
                  onClick={() => {
                    setEditingPlayer({ 
                      ...editingPlayer, 
                      role: r.name,
                      pos: editingPlayer.pos || r.name 
                    });
                  }}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid',
                    borderColor: editingPlayer.role === r.name ? 'var(--clr-primary)' : '#d1d5db',
                    background: editingPlayer.role === r.name ? 'rgba(202, 2, 79, 0.1)' : 'white',
                    color: editingPlayer.role === r.name ? 'var(--clr-primary)' : '#374151',
                    fontSize: '0.85rem',
                    fontWeight: editingPlayer.role === r.name ? 'bold' : 'normal',
                    cursor: 'pointer'
                  }}
                >
                  {r.order === 1 && '⭐ '} {r.name}
                </button>
              ))}
            </div>
            <span style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', marginTop: '6px' }}>
              ⭐ Les joueurs avec le rôle "Gardiens de but" sont automatiquement affichés tout en haut de la page Équipe.
            </span>
          </div>

          {/* Mise en Avant / Spotlight Toggle */}
          <div style={{ 
            background: editingPlayer.is_spotlight ? 'rgba(234, 179, 8, 0.08)' : '#f8fafc', 
            padding: '1.2rem', 
            borderRadius: '10px', 
            border: editingPlayer.is_spotlight ? '2px solid #eab308' : '1px solid #e2e8f0', 
            marginBottom: '1.8rem', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', color: '#0f172a', margin: 0 }}>
              <input 
                type="checkbox"
                checked={Boolean(editingPlayer.is_spotlight)}
                onChange={e => setEditingPlayer({ ...editingPlayer, is_spotlight: e.target.checked })}
                style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#eab308' }}
              />
              <span>⭐ Joueur Mis en Avant sur la Page d'Accueil (Spotlight)</span>
            </label>
            <span style={{ 
              fontSize: '0.82rem', 
              color: editingPlayer.is_spotlight ? '#854d0e' : '#64748b', 
              fontWeight: editingPlayer.is_spotlight ? 'bold' : 'normal',
              background: editingPlayer.is_spotlight ? '#fef08a' : '#f1f5f9',
              padding: '4px 10px',
              borderRadius: '20px'
            }}>
              {editingPlayer.is_spotlight ? '✓ Affiché dans la vitrine vedette du site' : '○ Non affiché en vedette'}
            </span>
          </div>

          {/* 2. Photos (Profil & Célébration) */}
          <h4 style={{ fontSize: '1rem', color: 'var(--clr-primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>
            2. Photos du Joueur (Roster & Page de Détail)
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            
            {/* Photo Profil Roster */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '1.2rem', borderRadius: '10px' }}>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 'bold', marginBottom: '8px', color: '#0f172a' }}>
                Photo Profil (Carte du Roster & Équipes)
              </label>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '12px' }}>
                <img 
                  src={editingPlayer.img || '/condor_logo_transparent.png'} 
                  alt="Thumb" 
                  style={{ width: '65px', height: '65px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #cbd5e1' }} 
                />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <input 
                    id="player-profile-input"
                    type="file" 
                    accept="image/*" 
                    onChange={handleProfilePhotoSelect}
                    style={{ display: 'none' }}
                  />
                  <label
                    htmlFor="player-profile-input"
                    className="btn btn-primary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', fontSize: '0.84rem', cursor: 'pointer', alignSelf: 'flex-start' }}
                  >
                    <Upload size={15} /> Choisir photo (Téléphone ou PC)
                  </label>
                  <input 
                    type="text" 
                    placeholder="Ou lien URL (ex: /players/nom.jpg)" 
                    value={editingPlayer.img || ''} 
                    onChange={e => setEditingPlayer({ ...editingPlayer, img: e.target.value })} 
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }} 
                  />
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setEditingPlayer({ ...editingPlayer, img: '/condor_logo_transparent.png' })}
                style={{ fontSize: '0.75rem', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Réinitialiser avec le logo officiel Condor
              </button>
            </div>

            {/* Photo Célébration Détail */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '1.2rem', borderRadius: '10px' }}>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 'bold', marginBottom: '8px', color: '#0f172a' }}>
                Photo Célébration (Page de Détail & Grande Affiche)
              </label>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '12px' }}>
                <img 
                  src={editingPlayer.detail_img || editingPlayer.img || '/condor_logo_transparent.png'} 
                  alt="Thumb" 
                  style={{ width: '65px', height: '65px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #cbd5e1' }} 
                />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <input 
                    id="player-detail-input"
                    type="file" 
                    accept="image/*" 
                    onChange={handleDetailPhotoSelect}
                    style={{ display: 'none' }}
                  />
                  <label
                    htmlFor="player-detail-input"
                    className="btn btn-primary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', fontSize: '0.84rem', cursor: 'pointer', alignSelf: 'flex-start' }}
                  >
                    <Upload size={15} /> Choisir photo célébration
                  </label>
                  <input 
                    type="text" 
                    placeholder="Ou lien URL (ex: /players/nom_celebration.jpg)" 
                    value={editingPlayer.detail_img || ''} 
                    onChange={e => setEditingPlayer({ ...editingPlayer, detail_img: e.target.value, detailImg: e.target.value })} 
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }} 
                  />
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setEditingPlayer({ ...editingPlayer, detail_img: editingPlayer.img, detailImg: editingPlayer.img })}
                style={{ fontSize: '0.75rem', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Utiliser la même que la photo de profil
              </button>
            </div>

          </div>

          {/* 3. Statistiques de la Saison & Palmarès */}
          <h4 style={{ fontSize: '1rem', color: 'var(--clr-primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>
            3. Statistiques de la Saison & Palmarès
          </h4>

          <div style={{ background: '#f8fafc', padding: '1.4rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
            <div style={{ marginBottom: '1.5rem', background: '#ffffff', padding: '1.2rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', color: '#0f172a' }}>
                    📊 Choisissez les statistiques à afficher pour ce joueur
                  </label>
                  <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                    Cochez les statistiques pertinentes qui apparaîtront sur sa page publique (Buts, Passes décisives, Arrêts, etc.).
                  </p>
                </div>

                {/* Modèles rapides par poste */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b', marginRight: '4px' }}>Modèles rapides :</span>
                  {STAT_PRESETS.map(preset => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        setEditingPlayer({
                          ...editingPlayer,
                          displayed_stats: preset.stats,
                          stat2lbl: preset.name === 'Gardien' ? 'Arrêts' : 'Buts'
                        });
                        showToast(`Modèle "${preset.name}" sélectionné !`);
                      }}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '20px',
                        border: '1px solid #cbd5e1',
                        background: '#f1f5f9',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        color: '#334155',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        transition: 'all 0.2s'
                      }}
                    >
                      {preset.icon} {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grille de sélection des stats (Checkbox chips) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px', marginTop: '12px' }}>
                {AVAILABLE_STATS.map(stat => {
                  const currentDisplayed: string[] = Array.isArray(editingPlayer.displayed_stats) && editingPlayer.displayed_stats.length > 0
                    ? editingPlayer.displayed_stats
                    : ['goals', 'assists', 'matches'];
                  const isChecked = currentDisplayed.includes(stat.id);

                  return (
                    <button
                      key={stat.id}
                      type="button"
                      onClick={() => {
                        let next: string[];
                        if (isChecked) {
                          if (currentDisplayed.length <= 1) {
                            showToast("Vous devez afficher au moins 1 statistique.");
                            return;
                          }
                          next = currentDisplayed.filter(id => id !== stat.id);
                        } else {
                          next = [...currentDisplayed, stat.id];
                        }
                        setEditingPlayer({
                          ...editingPlayer,
                          displayed_stats: next
                        });
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: isChecked ? '1.5px solid var(--clr-primary)' : '1px solid #cbd5e1',
                        background: isChecked ? 'rgba(224, 30, 38, 0.05)' : '#ffffff',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <span style={{ fontSize: '0.82rem', fontWeight: isChecked ? 'bold' : 'normal', color: isChecked ? 'var(--clr-primary)' : '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>{stat.icon}</span> {stat.label}
                      </span>
                      <span style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '4px',
                        border: isChecked ? 'none' : '1.5px solid #cbd5e1',
                        background: isChecked ? 'var(--clr-primary)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '0.7rem'
                      }}>
                        {isChecked && '✓'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Saisie des valeurs des statistiques sélectionnées */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '10px' }}>
                ✏️ Valeurs des Statistiques Sélectionnées
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.2rem' }}>
                {/* 1. Buts */}
                {(editingPlayer.displayed_stats || ['goals', 'assists', 'matches']).includes('goals') && (
                  <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 'bold', marginBottom: '5px', color: '#334155' }}>
                      ⚽ Buts Marqués
                    </label>
                    <input 
                      type="number" 
                      min="0"
                      value={editingPlayer.goals ?? 0} 
                      onChange={e => {
                        const val = parseInt(e.target.value) || 0;
                        setEditingPlayer({ 
                          ...editingPlayer, 
                          goals: val,
                          stat2val: editingPlayer.stat2lbl === 'Buts' ? val : editingPlayer.stat2val
                        });
                      }} 
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem' }} 
                    />
                  </div>
                )}

                {/* 2. Passes Décisives */}
                {(editingPlayer.displayed_stats || ['goals', 'assists', 'matches']).includes('assists') && (
                  <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 'bold', marginBottom: '5px', color: '#334155' }}>
                      👟 Passes Décisives
                    </label>
                    <input 
                      type="number" 
                      min="0"
                      value={editingPlayer.assists ?? 0} 
                      onChange={e => setEditingPlayer({ ...editingPlayer, assists: parseInt(e.target.value) || 0 })} 
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem' }} 
                    />
                  </div>
                )}

                {/* 3. Matchs Joués */}
                {(editingPlayer.displayed_stats || ['goals', 'assists', 'matches']).includes('matches') && (
                  <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 'bold', marginBottom: '5px', color: '#334155' }}>
                      🏟️ Matchs Joués
                    </label>
                    <input 
                      type="number" 
                      min="0"
                      value={editingPlayer.matches ?? 0} 
                      onChange={e => setEditingPlayer({ ...editingPlayer, matches: parseInt(e.target.value) || 0 })} 
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem' }} 
                    />
                  </div>
                )}

                {/* 4. Passes Réussies */}
                {(editingPlayer.displayed_stats || []).includes('passes') && (
                  <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 'bold', marginBottom: '5px', color: '#334155' }}>
                      🎯 Passes Réussies
                    </label>
                    <input 
                      type="number" 
                      min="0"
                      value={editingPlayer.passes ?? 0} 
                      onChange={e => setEditingPlayer({ ...editingPlayer, passes: parseInt(e.target.value) || 0 })} 
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem' }} 
                    />
                  </div>
                )}

                {/* 5. Arrêts / Ballons Arrêtés */}
                {(editingPlayer.displayed_stats || []).includes('saves') && (
                  <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 'bold', marginBottom: '5px', color: '#334155' }}>
                      🧤 Ballons Arrêtés / Arrêts
                    </label>
                    <input 
                      type="number" 
                      min="0"
                      value={editingPlayer.saves ?? editingPlayer.stat2val ?? 0} 
                      onChange={e => {
                        const val = parseInt(e.target.value) || 0;
                        setEditingPlayer({ 
                          ...editingPlayer, 
                          saves: val,
                          stat2lbl: 'Arrêts',
                          stat2val: val 
                        });
                      }} 
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem' }} 
                    />
                  </div>
                )}

                {/* 6. Clean Sheets */}
                {(editingPlayer.displayed_stats || []).includes('cleansheets') && (
                  <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 'bold', marginBottom: '5px', color: '#334155' }}>
                      🛡️ Clean Sheets
                    </label>
                    <input 
                      type="number" 
                      min="0"
                      value={editingPlayer.cleansheets ?? 0} 
                      onChange={e => setEditingPlayer({ ...editingPlayer, cleansheets: parseInt(e.target.value) || 0 })} 
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem' }} 
                    />
                  </div>
                )}

                {/* 7. Tacles Réussis */}
                {(editingPlayer.displayed_stats || []).includes('tackles') && (
                  <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 'bold', marginBottom: '5px', color: '#334155' }}>
                      ⚡ Tacles Réussis
                    </label>
                    <input 
                      type="number" 
                      min="0"
                      value={editingPlayer.tackles ?? 0} 
                      onChange={e => setEditingPlayer({ ...editingPlayer, tackles: parseInt(e.target.value) || 0 })} 
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem' }} 
                    />
                  </div>
                )}

                {/* 8. Minutes Jouées */}
                {(editingPlayer.displayed_stats || []).includes('minutes') && (
                  <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 'bold', marginBottom: '5px', color: '#334155' }}>
                      ⏱️ Minutes Jouées
                    </label>
                    <input 
                      type="number" 
                      min="0"
                      value={editingPlayer.minutes ?? 0} 
                      onChange={e => setEditingPlayer({ ...editingPlayer, minutes: parseInt(e.target.value) || 0 })} 
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem' }} 
                    />
                  </div>
                )}

                {/* 9. Statistique Personnalisée */}
                {(editingPlayer.displayed_stats || []).includes('custom') && (
                  <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 'bold', marginBottom: '5px', color: '#334155' }}>
                      ⭐ Statistique Personnalisée
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        type="text" 
                        placeholder="Libellé (ex: Dribbles, Duels Gagnés)"
                        value={editingPlayer.custom_stat_label || ''} 
                        onChange={e => setEditingPlayer({ ...editingPlayer, custom_stat_label: e.target.value })} 
                        style={{ flex: 2, padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }} 
                      />
                      <input 
                        type="number" 
                        min="0"
                        placeholder="Valeur"
                        value={editingPlayer.custom_stat_val ?? 0} 
                        onChange={e => setEditingPlayer({ ...editingPlayer, custom_stat_val: parseInt(e.target.value) || 0 })} 
                        style={{ flex: 1, padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem' }} 
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Palmarès & Trophées */}
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.2rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '10px' }}>
                🏆 Palmarès & Trophées Remportés
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.2rem' }}>
                <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 'bold', marginBottom: '5px', color: '#334155' }}>
                    🥇 Titres de Champion (Trophées Or)
                  </label>
                  <input 
                    type="number" 
                    min="0"
                    value={editingPlayer.honours1 ?? 0} 
                    onChange={e => setEditingPlayer({ ...editingPlayer, honours1: parseInt(e.target.value) || 0 })} 
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem' }} 
                  />
                </div>

                <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 'bold', marginBottom: '5px', color: '#334155' }}>
                    🥈 Finales / Podiums (Trophées Argent)
                  </label>
                  <input 
                    type="number" 
                    min="0"
                    value={editingPlayer.honours2 ?? 0} 
                    onChange={e => setEditingPlayer({ ...editingPlayer, honours2: parseInt(e.target.value) || 0 })} 
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem' }} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 4. Profil Sportif & Informations Personnelles */}
          <h4 style={{ fontSize: '1rem', color: 'var(--clr-primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>
            4. Profil Sportif & Informations Personnelles
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.2rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px' }}>Pied Fort</label>
              <select value={editingPlayer.foot || 'Droit'} onChange={e => setEditingPlayer({ ...editingPlayer, foot: e.target.value })} style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #cbd5e1', background: 'white' }}>
                <option value="Droit">Droit</option>
                <option value="Gauche">Gauche</option>
                <option value="Ambidextre">Ambidextre</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px' }}>Taille (ex: 1.78 m)</label>
              <input 
                type="text" 
                placeholder="Ex: 1.78 m" 
                value={editingPlayer.height || ''} 
                onChange={e => setEditingPlayer({ ...editingPlayer, height: e.target.value })} 
                style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #cbd5e1' }} 
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px' }}>Poids (ex: 72 kg)</label>
              <input 
                type="text" 
                placeholder="Ex: 72 kg" 
                value={editingPlayer.weight || ''} 
                onChange={e => setEditingPlayer({ ...editingPlayer, weight: e.target.value })} 
                style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #cbd5e1' }} 
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px' }}>Lieu de Naissance</label>
              <input 
                type="text" 
                placeholder="Ex: Port-au-Prince, Haïti" 
                value={editingPlayer.pob || ''} 
                onChange={e => setEditingPlayer({ ...editingPlayer, pob: e.target.value })} 
                style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #cbd5e1' }} 
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px' }}>Nationalité</label>
              <input 
                type="text" 
                placeholder="Ex: Haïtienne" 
                value={editingPlayer.nationality || ''} 
                onChange={e => setEditingPlayer({ ...editingPlayer, nationality: e.target.value })} 
                style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #cbd5e1' }} 
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px' }}>Date de Naissance</label>
              <input 
                type="text" 
                placeholder="Ex: 2006-05-14" 
                value={editingPlayer.dob || ''} 
                onChange={e => setEditingPlayer({ ...editingPlayer, dob: e.target.value })} 
                style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #cbd5e1' }} 
              />
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '6px' }}>Biographie officielle du joueur</label>
            <textarea 
              value={editingPlayer.bio || ''} 
              onChange={e => setEditingPlayer({ ...editingPlayer, bio: e.target.value })} 
              rows={4}
              placeholder="Rédigez la biographie, les points forts et le parcours du joueur..."
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }} 
            />
          </div>

          {/* Boutons d'Action & Bouton Supprimer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" disabled={saving} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Check size={16} /> {saving ? 'Enregistrement...' : 'Enregistrer le Joueur'}
              </button>
              <button 
                type="button" 
                onClick={() => { setEditingPlayer(null); setIsCreating(false); }} 
                className="btn btn-outline" 
                style={{ color: 'black', borderColor: '#ccc' }}
              >
                Annuler
              </button>
            </div>

            {!isCreating && (
              <button 
                type="button" 
                onClick={() => handleDelete(editingPlayer.id, editingPlayer.name)} 
                className="btn btn-outline" 
                style={{ color: '#b91c1c', borderColor: '#fecaca', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Trash2 size={16} /> Supprimer ce Joueur Définitivement
              </button>
            )}
          </div>
        </form>
      )}

      {/* Grille des Joueurs */}
      {filteredPlayers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'white', borderRadius: '12px', border: '1px solid #eee' }}>
          <p style={{ color: '#6b7280', fontSize: '1.1rem', margin: 0 }}>
            Aucun joueur ne correspond aux filtres sélectionnés.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {filteredPlayers.map(player => {
            const playerCats: string[] = Array.isArray(player.categories) && player.categories.length > 0
              ? player.categories
              : [player.category || 'U17'];
            const primaryCat = player.category || playerCats[0];
            const unassignedUnits = units.filter(u => !playerCats.includes(u.name));

            const isSpotlight = Boolean(player.is_spotlight || player.spotlight);

            return (
              <div 
                key={player.id} 
                style={{ 
                  background: 'white', 
                  borderRadius: '12px', 
                  border: isSpotlight ? '2px solid #eab308' : '1px solid #e5e7eb', 
                  padding: '1.2rem', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between',
                  boxShadow: isSpotlight ? '0 6px 20px rgba(234, 179, 8, 0.15)' : '0 4px 12px rgba(0,0,0,0.03)',
                  position: 'relative'
                }}
              >
                <div>
                  {/* Spotlight Banner Badge if active */}
                  {isSpotlight && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#fef08a', color: '#854d0e', padding: '3px 10px', borderRadius: '12px', fontSize: '0.74rem', fontWeight: 'bold', marginBottom: '10px' }}>
                      <Star size={13} fill="#854d0e" /> Mis en avant sur l'accueil
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '12px' }}>
                    <img 
                      src={player.img || '/condor_logo_transparent.png'} 
                      style={{ width: '58px', height: '58px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #f3f4f6' }} 
                      alt={player.name} 
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ margin: '0 0 2px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', fontSize: '1.15rem' }}>
                        {player.name}
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.82rem', color: 'var(--clr-primary)', fontWeight: 'bold' }}>
                          #{player.num} • {player.pos || 'Joueur'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Statistiques Rapides */}
                  <div style={{ display: 'flex', gap: '8px', background: '#f8fafc', padding: '6px 10px', borderRadius: '6px', fontSize: '0.76rem', color: '#475569', marginBottom: '10px', fontWeight: '600', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                    <span>⚽ {player.goals ?? 0} buts</span>
                    <span>👟 {player.assists ?? 0} passes</span>
                    <span>🧤 {player.saves ?? (player.stat2lbl === "Arrêts" ? player.stat2val ?? 0 : 0)} arrêts</span>
                    <span>🏆 {player.honours1 ?? 0} titres</span>
                  </div>

                  {/* Multi-Unit Badges & Quick Add */}
                  <div style={{ background: '#f9fafb', padding: '10px 12px', borderRadius: '8px', border: '1px solid #f1f5f9', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '4px' }}>
                      <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Shield size={13} color="var(--clr-primary)" /> Unités ({playerCats.length}) :
                      </span>
                      {unassignedUnits.length > 0 && (
                        <select 
                          value="" 
                          onChange={e => {
                            if (e.target.value) {
                              handleQuickAddUnit(player.id, e.target.value, player);
                            }
                          }}
                          style={{ 
                            fontSize: '0.75rem', 
                            padding: '3px 8px', 
                            borderRadius: '6px', 
                            border: '1px dashed #cbd5e1', 
                            background: 'white',
                            color: 'var(--clr-primary)',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="">+ Ajouter à une unité...</option>
                          {unassignedUnits.map(u => (
                            <option key={u.id} value={u.name}>+ {u.name}</option>
                          ))}
                        </select>
                      )}
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {playerCats.map(cat => {
                        const isPrimary = cat === primaryCat;
                        return (
                          <span 
                            key={cat}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              background: isPrimary ? 'rgba(224, 30, 38, 0.1)' : '#f1f5f9',
                              color: isPrimary ? 'var(--clr-primary)' : '#334155',
                              border: isPrimary ? '1px solid rgba(224, 30, 38, 0.3)' : '1px solid #e2e8f0',
                              padding: '2px 8px',
                              borderRadius: '12px',
                              fontSize: '0.78rem',
                              fontWeight: '600'
                            }}
                          >
                            {isPrimary && <span title="Unité principale" style={{ fontSize: '0.7rem' }}>⭐</span>}
                            {cat}
                            {playerCats.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleQuickRemoveUnit(player.id, cat, player)}
                                title={`Retirer de ${cat}`}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  padding: 0,
                                  marginLeft: '2px',
                                  cursor: 'pointer',
                                  color: isPrimary ? 'var(--clr-primary)' : '#94a3b8',
                                  display: 'flex',
                                  alignItems: 'center'
                                }}
                              >
                                <X size={12} />
                              </button>
                            )}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', borderTop: '1px solid #f3f4f6', paddingTop: '10px', flexWrap: 'wrap' }}>
                  {/* 1-Click Spotlight Button */}
                  <button
                    type="button"
                    onClick={() => handleToggleSpotlight(player)}
                    title={isSpotlight ? "Retirer de l'accueil" : "Mettre en avant sur la page d'accueil"}
                    style={{
                      background: isSpotlight ? '#fef08a' : '#f8fafc',
                      color: isSpotlight ? '#854d0e' : '#64748b',
                      border: isSpotlight ? '1px solid #eab308' : '1px solid #cbd5e1',
                      borderRadius: '6px',
                      padding: '5px 10px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Star size={13} fill={isSpotlight ? '#854d0e' : 'none'} color={isSpotlight ? '#854d0e' : '#64748b'} />
                    {isSpotlight ? 'En vedette' : 'Mettre en avant'}
                  </button>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button 
                      onClick={() => handleOpenEdit(player)} 
                      className="btn btn-outline"
                      style={{ padding: '5px 10px', fontSize: '0.82rem', color: '#1d4ed8', borderColor: '#bfdbfe', display: 'flex', alignItems: 'center', gap: '5px' }}
                    >
                      <Edit2 size={13} /> Modifier
                    </button>
                    <button 
                      onClick={() => handleDelete(player.id, player.name)} 
                      className="btn btn-outline"
                      style={{ padding: '5px 10px', fontSize: '0.82rem', color: '#b91c1c', borderColor: '#fecaca', display: 'flex', alignItems: 'center', gap: '5px' }}
                    >
                      <Trash2 size={13} /> Supprimer
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
