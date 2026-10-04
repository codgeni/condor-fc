"use client";

import { useState, useMemo } from 'react';
import { 
  Users, Plus, Edit2, Trash2, Check, X, Search, 
  ArrowRightLeft, Shield, Award, Upload, Image, RefreshCw, AlertTriangle
} from 'lucide-react';
import { 
  PlayerData, UnitItem, RoleItem, 
  savePlayerRecord, deletePlayerRecord, transferPlayerCategory 
} from '@/lib/dataService';
import { validateUploadFile } from '@/lib/security';
import { useConfirmPoster } from '@/components/ui/ConfirmPosterModal';

interface PlayersManagerProps {
  players: Record<string, any>;
  units: UnitItem[];
  roles: RoleItem[];
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
      height: '1.75m',
      weight: '68kg',
      foot: 'Droit',
      dob: '',
      nationality: 'Haïtienne',
      pob: 'Haïti',
      bio: '',
      matches: 0,
      goals: 0,
      assists: 0,
      stat2lbl: 'Buts',
      stat2val: 0,
      honours1: 1,
      honours2: 0,
      img: '/condor_logo_transparent.png',
      detail_img: '/condor_logo_transparent.png'
    });
  };

  // Open edit modal
  const handleOpenEdit = (player: any) => {
    setIsCreating(false);
    setEditingPlayer({
      ...player,
      detail_img: player.detail_img || player.detailImg || player.img || '/condor_logo_transparent.png',
      category: player.category || (Array.isArray(player.categories) ? player.categories[0] : 'U17'),
      categories: Array.isArray(player.categories) ? player.categories : [player.category || 'U17']
    });
  };

  // Quick transfer player
  const handleQuickTransfer = async (playerId: string, newUnit: string, player: any) => {
    try {
      const res = await transferPlayerCategory(playerId, newUnit, player);
      if (res.success) {
        showToast(`Joueur ${player.name} transféré vers "${newUnit}" avec succès !`);
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

    const payload: PlayerData = {
      ...editingPlayer,
      id: String(editingPlayer.id || Date.now()),
      num: parseInt(editingPlayer.num) || 0,
      name: editingPlayer.name.trim(),
      pos: editingPlayer.pos || 'Joueur',
      category: editingPlayer.category || 'U17',
      categories: [editingPlayer.category || 'U17'],
      img: editingPlayer.img || '/condor_logo_transparent.png',
      detail_img: editingPlayer.detail_img || editingPlayer.img || '/condor_logo_transparent.png'
    };

    askConfirm({
      title: isCreating ? 'AJOUTER LE JOUEUR' : 'MODIFIER LE JOUEUR',
      message: isCreating 
        ? `Confirmez-vous l'ajout de ${payload.name} à l'effectif ?` 
        : `Confirmez-vous la modification de la fiche de ${payload.name} ?`,
      confirmLabel: isCreating ? 'OUI, AJOUTER' : 'OUI, ENREGISTRER',
      itemDetails: {
        type: isCreating ? 'Ajout' : 'Modification',
        title: payload.name,
        subtitle: `Dossard #${payload.num} • ${payload.pos}`,
        image: payload.img,
        badge: payload.category
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

            {/* Unité / Catégorie Dynamique */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px' }}>
                Unité / Catégorie d'affectation *
              </label>
              <select 
                value={editingPlayer.category} 
                onChange={e => setEditingPlayer({ ...editingPlayer, category: e.target.value, categories: [e.target.value] })}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', background: 'white' }}
              >
                {units.map(unit => (
                  <option key={unit.id} value={unit.name}>{unit.name}</option>
                ))}
              </select>
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

          {/* 2. Photos (Profil & Célébration) */}
          <h4 style={{ fontSize: '1rem', color: 'var(--clr-primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>
            2. Photos du Joueur (Roster & Page de Détail)
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
            
            {/* Photo Profil Roster */}
            <div style={{ background: '#fdfdfd', border: '1px solid #e5e7eb', padding: '1.2rem', borderRadius: '8px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '8px' }}>
                Photo Profil (Carte du Roster)
              </label>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '10px' }}>
                <img 
                  src={editingPlayer.img || '/condor_logo_transparent.png'} 
                  alt="Thumb" 
                  style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #ddd' }} 
                />
                <div style={{ flex: 1 }}>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={async e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const base64 = await convertToBase64(file);
                        setEditingPlayer({ ...editingPlayer, img: base64 });
                      }
                    }} 
                    style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }} 
                  />
                  <input 
                    type="text" 
                    placeholder="Ou lien URL (ex: /players/nom.jpg)" 
                    value={editingPlayer.img || ''} 
                    onChange={e => setEditingPlayer({ ...editingPlayer, img: e.target.value })} 
                    style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '0.85rem' }} 
                  />
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setEditingPlayer({ ...editingPlayer, img: '/condor_logo_transparent.png' })}
                style={{ fontSize: '0.75rem', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Réinitialiser avec le logo Condor
              </button>
            </div>

            {/* Photo Célébration Détail */}
            <div style={{ background: '#fdfdfd', border: '1px solid #e5e7eb', padding: '1.2rem', borderRadius: '8px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '8px' }}>
                Photo Célébration (Page de Détail du Joueur)
              </label>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '10px' }}>
                <img 
                  src={editingPlayer.detail_img || editingPlayer.img || '/condor_logo_transparent.png'} 
                  alt="Thumb" 
                  style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #ddd' }} 
                />
                <div style={{ flex: 1 }}>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={async e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const base64 = await convertToBase64(file);
                        setEditingPlayer({ ...editingPlayer, detail_img: base64, detailImg: base64 });
                      }
                    }} 
                    style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }} 
                  />
                  <input 
                    type="text" 
                    placeholder="Ou lien URL (ex: /players/nom_celebration.jpg)" 
                    value={editingPlayer.detail_img || ''} 
                    onChange={e => setEditingPlayer({ ...editingPlayer, detail_img: e.target.value, detailImg: e.target.value })} 
                    style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '0.85rem' }} 
                  />
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setEditingPlayer({ ...editingPlayer, detail_img: editingPlayer.img, detailImg: editingPlayer.img })}
                style={{ fontSize: '0.75rem', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Utiliser la même que la photo de profil
              </button>
            </div>

          </div>

          {/* 3. Données Physiques & Biographie */}
          <h4 style={{ fontSize: '1rem', color: 'var(--clr-primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>
            3. Profil Physique & Biographie
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px' }}>Date de naissance</label>
              <input type="text" placeholder="JJ/MM/AAAA" value={editingPlayer.dob || ''} onChange={e => setEditingPlayer({ ...editingPlayer, dob: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px' }}>Taille</label>
              <input type="text" placeholder="1.75m" value={editingPlayer.height || ''} onChange={e => setEditingPlayer({ ...editingPlayer, height: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px' }}>Poids</label>
              <input type="text" placeholder="68kg" value={editingPlayer.weight || ''} onChange={e => setEditingPlayer({ ...editingPlayer, weight: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px' }}>Pied Fort</label>
              <select value={editingPlayer.foot || 'Droit'} onChange={e => setEditingPlayer({ ...editingPlayer, foot: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd', background: 'white' }}>
                <option value="Droit">Droit</option>
                <option value="Gauche">Gauche</option>
                <option value="Ambidextre">Ambidextre</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '6px' }}>Biographie officielle du joueur</label>
            <textarea 
              value={editingPlayer.bio || ''} 
              onChange={e => setEditingPlayer({ ...editingPlayer, bio: e.target.value })} 
              rows={4}
              placeholder="Rédigez la biographie, les points forts et le parcours du joueur..."
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '0.95rem' }} 
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
          {filteredPlayers.map(player => (
            <div 
              key={player.id} 
              style={{ 
                background: 'white', 
                borderRadius: '12px', 
                border: '1px solid #e5e7eb', 
                padding: '1.2rem', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
              }}
            >
              <div>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '12px' }}>
                  <img 
                    src={player.img || '/condor_logo_transparent.png'} 
                    style={{ width: '55px', height: '55px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #f3f4f6' }} 
                    alt={player.name} 
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ margin: '0 0 2px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', fontSize: '1.1rem' }}>
                      {player.name}
                    </h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--clr-primary)', fontWeight: 'bold' }}>
                      #{player.num} • {player.pos || 'Joueur'}
                    </span>
                  </div>
                </div>

                {/* Quick Transfer Selector */}
                <div style={{ background: '#f9fafb', padding: '8px 10px', borderRadius: '8px', border: '1px solid #f3f4f6', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  <span style={{ fontSize: '0.78rem', color: '#6b7280', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ArrowRightLeft size={13} /> Unité :
                  </span>
                  <select 
                    value={player.category || 'U17'} 
                    onChange={e => handleQuickTransfer(player.id, e.target.value, player)}
                    style={{ 
                      fontSize: '0.82rem', 
                      padding: '4px 8px', 
                      borderRadius: '6px', 
                      border: '1px solid #d1d5db', 
                      background: 'white',
                      fontWeight: 'bold',
                      color: '#1f2937',
                      cursor: 'pointer'
                    }}
                  >
                    {units.map(u => (
                      <option key={u.id} value={u.name}>{u.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid #f3f4f6', paddingTop: '10px' }}>
                <button 
                  onClick={() => handleOpenEdit(player)} 
                  className="btn btn-outline"
                  style={{ padding: '6px 12px', fontSize: '0.85rem', color: '#1d4ed8', borderColor: '#bfdbfe', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Edit2 size={14} /> Modifier
                </button>
                <button 
                  onClick={() => handleDelete(player.id, player.name)} 
                  className="btn btn-outline"
                  style={{ padding: '6px 12px', fontSize: '0.85rem', color: '#b91c1c', borderColor: '#fecaca', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Trash2 size={14} /> Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
