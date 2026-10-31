"use client";

import { useState, useEffect } from 'react';
import { 
  History, Plus, Edit2, Trash2, Check, X, Trophy, 
  Hash, Upload, Image as ImageIcon, RotateCcw, Calendar, MapPin, Award 
} from 'lucide-react';
import { 
  TimelineItem, saveTimeline, deleteTimeline,
  TrophyItem, fetchTrophies, saveTrophy, deleteTrophy, resetTrophiesToDefault,
  fetchSiteContent, saveSiteContent, SiteContent, DEFAULT_SITE_CONTENT
} from '@/lib/dataService';
import { validateUploadFile, compressAndOptimizeImage } from '@/lib/security';
import { useConfirmPoster } from '@/components/ui/ConfirmPosterModal';

interface TimelineManagerProps {
  timeline: TimelineItem[];
  onRefresh: () => void;
  showToast: (msg: string) => void;
}

export default function TimelineManager({ timeline, onRefresh, showToast }: TimelineManagerProps) {
  const { askConfirm } = useConfirmPoster();
  const [activeSubTab, setActiveSubTab] = useState<'tournaments' | 'counters' | 'timeline'>('tournaments');

  // 1. Tournois & Trophées State
  const [trophies, setTrophies] = useState<TrophyItem[]>([]);
  const [editingTrophy, setEditingTrophy] = useState<TrophyItem | null>(null);
  const [isCreatingTrophy, setIsCreatingTrophy] = useState(false);
  const [savingTrophy, setSavingTrophy] = useState(false);

  // 2. Palmarès Chiffres State
  const [siteContent, setSiteContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [savingCounters, setSavingCounters] = useState(false);

  // 3. Timeline Items State
  const [editingItem, setEditingItem] = useState<TimelineItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadTrophies = async () => {
    const list = await fetchTrophies();
    setTrophies(list);
  };

  const loadSiteContent = async () => {
    const data = await fetchSiteContent();
    if (data) setSiteContent(data);
  };

  useEffect(() => {
    loadTrophies();
    loadSiteContent();
  }, []);

  const handleTrophyPhotoUpload = async (file: File, inputElement?: HTMLInputElement) => {
    const validation = validateUploadFile(file);
    if (!validation.valid) {
      showToast(validation.error || 'Fichier image non valide.');
      if (inputElement) inputElement.value = '';
      return;
    }
    try {
      showToast("Optimisation de la photo du tournoi...");
      const compressed = await compressAndOptimizeImage(file, 1400, 0.85);
      if (editingTrophy) {
        setEditingTrophy({ ...editingTrophy, image: compressed });
        showToast("Photo du tournoi chargée avec succès !");
      }
    } catch (err: any) {
      showToast(err.message || "Erreur lors du chargement de la photo.");
    } finally {
      if (inputElement) inputElement.value = '';
    }
  };

  // -------------------------------------------------------------
  // HANDLERS TOURNOIS & TROPHÉES
  // -------------------------------------------------------------
  const handleOpenCreateTrophy = () => {
    setIsCreatingTrophy(true);
    setEditingTrophy({
      id: `trophy-${Date.now()}`,
      title: '',
      edition: '',
      date: '',
      rank: '',
      is_gold: true,
      badge: '',
      venue: '',
      stats: '',
      desc: '',
      image: '',
      order: trophies.length + 1
    });
  };

  const handleOpenEditTrophy = (t: TrophyItem) => {
    setIsCreatingTrophy(false);
    setEditingTrophy({ ...t });
  };

  const handleSaveTrophy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTrophy || !editingTrophy.title.trim()) {
      showToast("Veuillez saisir le titre du tournoi.");
      return;
    }

    askConfirm({
      title: isCreatingTrophy ? "AJOUTER LE TOURNOI" : "ENREGISTRER LE TOURNOI",
      message: isCreatingTrophy
        ? `Confirmez-vous l'ajout de "${editingTrophy.title}" avec sa photo et ses distinctions ?`
        : `Confirmez-vous la modification de "${editingTrophy.title}" ?`,
      confirmLabel: isCreatingTrophy ? "OUI, AJOUTER" : "OUI, ENREGISTRER",
      itemDetails: {
        type: isCreatingTrophy ? 'Ajout' : 'Modification',
        title: editingTrophy.title,
        subtitle: editingTrophy.edition || editingTrophy.rank,
        badge: editingTrophy.date
      },
      onConfirm: async () => {
        setSavingTrophy(true);
        try {
          const res = await saveTrophy(editingTrophy);
          if (res.success) {
            showToast(`Tournoi "${editingTrophy.title}" enregistré avec succès !`);
            setEditingTrophy(null);
            setIsCreatingTrophy(false);
            loadTrophies();
            onRefresh();
          } else {
            showToast("Erreur lors de l'enregistrement du tournoi.");
          }
        } catch (err) {
          showToast("Erreur inattendue.");
        } finally {
          setSavingTrophy(false);
        }
      }
    });
  };

  const handleDeleteTrophy = (t: TrophyItem) => {
    askConfirm({
      title: "SUPPRIMER LE TOURNOI",
      message: `Supprimer "${t.title}" du palmarès officiel et de la page d'accueil ?`,
      confirmLabel: "OUI, SUPPRIMER",
      itemDetails: {
        type: 'Suppression',
        title: t.title,
        subtitle: t.edition || t.rank,
        badge: t.date
      },
      onConfirm: async () => {
        const res = await deleteTrophy(t.id);
        if (res.success) {
          showToast(`Tournoi "${t.title}" supprimé.`);
          if (editingTrophy?.id === t.id) {
            setEditingTrophy(null);
            setIsCreatingTrophy(false);
          }
          loadTrophies();
          onRefresh();
        } else {
          showToast("Erreur lors de la suppression.");
        }
      }
    });
  };

  const handleResetTrophies = () => {
    askConfirm({
      title: "RÉTABLIR LES TROPHÉES OFFICIELS",
      message: "Voulez-vous réinitialiser la vitrine des trophées avec les 5 tournois historiques du Condor FC ?",
      confirmLabel: "OUI, RÉTABLIR",
      onConfirm: async () => {
        const res = await resetTrophiesToDefault();
        if (res.success) {
          showToast("Vitrine des trophées réinitialisée aux tournois officiels.");
          loadTrophies();
          onRefresh();
        }
      }
    });
  };

  // -------------------------------------------------------------
  // HANDLERS COMPTEURS PALMARÈS
  // -------------------------------------------------------------
  const handleSaveCounters = async (e: React.FormEvent) => {
    e.preventDefault();
    askConfirm({
      title: "ENREGISTRER LES CHIFFRES DU PALMARÈS",
      message: "Confirmez-vous la mise à jour des 4 compteurs et textes de la section Palmarès sur la page d'accueil ?",
      confirmLabel: "OUI, ENREGISTRER",
      onConfirm: async () => {
        setSavingCounters(true);
        try {
          const res = await saveSiteContent(siteContent);
          if (res.success) {
            showToast("Chiffres du palmarès mis à jour avec succès !");
            onRefresh();
          } else {
            showToast("Erreur lors de la sauvegarde.");
          }
        } catch (err) {
          showToast("Erreur lors de la sauvegarde.");
        } finally {
          setSavingCounters(false);
        }
      }
    });
  };

  // -------------------------------------------------------------
  // HANDLERS TIMELINE
  // -------------------------------------------------------------
  const handleOpenCreateTimeline = () => {
    setIsCreating(true);
    setEditingItem({
      id: `era-${Date.now()}`,
      year: '',
      title: '',
      description: '',
      order: timeline.length + 1
    });
  };

  const handleOpenEditTimeline = (item: TimelineItem) => {
    setIsCreating(false);
    setEditingItem({ ...item });
  };

  const handleSaveTimeline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.title.trim()) {
      showToast("Veuillez saisir un titre pour l'étape historique.");
      return;
    }

    askConfirm({
      title: isCreating ? "AJOUTER À LA FRISE" : "MODIFIER L'ÉTAPE",
      message: isCreating 
        ? `Confirmez-vous l'ajout de l'étape "${editingItem.title}" ?` 
        : `Confirmez-vous la modification de "${editingItem.title}" ?`,
      confirmLabel: isCreating ? "OUI, AJOUTER" : "OUI, ENREGISTRER",
      itemDetails: {
        type: isCreating ? 'Ajout' : 'Modification',
        title: editingItem.title,
        subtitle: editingItem.description || `Année: ${editingItem.year}`,
        badge: editingItem.year
      },
      onConfirm: async () => {
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
      }
    });
  };

  const handleDeleteTimeline = (item: TimelineItem) => {
    askConfirm({
      title: "SUPPRIMER DE LA FRISE",
      message: `Supprimer l'étape "${item.title}" du parcours historique ?`,
      confirmLabel: "OUI, SUPPRIMER",
      itemDetails: {
        type: 'Suppression',
        title: item.title,
        subtitle: item.description || `Année: ${item.year}`,
        badge: item.year
      },
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

  const sortedTimeline = [...timeline].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div>
      {/* En-tête Global */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Trophy size={32} color="var(--clr-primary)" />
          Parcours, Trophées & Palmarès Officiel
        </h2>
        <p style={{ color: 'var(--clr-gray)', margin: '6px 0 0', maxWidth: '750px' }}>
          Gérez les tournois et photos réelles de trophées sur la page d'accueil, modifiez les chiffres clés du palmarès, et mettez à jour la frise historique.
        </p>
      </div>

      {/* Barre des 3 sous-onglets */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '2rem', flexWrap: 'wrap', borderBottom: '2px solid #e2e8f0', paddingBottom: '12px' }}>
        <button
          type="button"
          onClick={() => setActiveSubTab('tournaments')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: 'bold',
            background: activeSubTab === 'tournaments' ? 'var(--clr-primary)' : '#e2e8f0',
            color: activeSubTab === 'tournaments' ? 'white' : '#475569',
            boxShadow: activeSubTab === 'tournaments' ? '0 4px 15px rgba(202, 2, 79, 0.25)' : 'none',
            transition: 'all 0.2s'
          }}
        >
          <Trophy size={18} />
          <span>Tournois & Photos de Tournois ({trophies.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('counters')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: 'bold',
            background: activeSubTab === 'counters' ? 'var(--clr-primary)' : '#e2e8f0',
            color: activeSubTab === 'counters' ? 'white' : '#475569',
            boxShadow: activeSubTab === 'counters' ? '0 4px 15px rgba(202, 2, 79, 0.25)' : 'none',
            transition: 'all 0.2s'
          }}
        >
          <Hash size={18} />
          <span>Chiffres & Compteurs du Palmarès</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('timeline')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: 'bold',
            background: activeSubTab === 'timeline' ? 'var(--clr-primary)' : '#e2e8f0',
            color: activeSubTab === 'timeline' ? 'white' : '#475569',
            boxShadow: activeSubTab === 'timeline' ? '0 4px 15px rgba(202, 2, 79, 0.25)' : 'none',
            transition: 'all 0.2s'
          }}
        >
          <History size={18} />
          <span>Frise Chronologique Club ({timeline.length})</span>
        </button>
      </div>

      {/* ==============================================================
          SOUS-ONGLET 1 : TOURNOIS & PHOTOS DE TOURNOIS
      ============================================================== */}
      {activeSubTab === 'tournaments' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.3rem', margin: 0, fontWeight: 'bold' }}>
                Vitrine des Trophées & Photos de Tournois (Accueil)
              </h3>
              <p style={{ color: '#64748b', margin: '4px 0 0', fontSize: '0.88rem' }}>
                Vous pouvez associer une véritable photo du sacre ou de l'équipe à chaque trophée. Elle apparaîtra dans la vitrine principale et dans la galerie défilante en dessous.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button 
                type="button" 
                onClick={handleResetTrophies}
                className="btn btn-outline"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', borderColor: '#cbd5e1', color: '#475569' }}
              >
                <RotateCcw size={15} /> Rétablir les 5 Trophées Officiels
              </button>
              <button 
                type="button" 
                onClick={handleOpenCreateTrophy}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Plus size={18} /> Ajouter un Tournoi / Trophée
              </button>
            </div>
          </div>

          {/* Formulaire d'Édition / Création de Trophée */}
          {editingTrophy && (
            <form onSubmit={handleSaveTrophy} style={{ background: 'white', padding: '2rem', borderRadius: '14px', border: '2px solid var(--clr-primary)', marginBottom: '2.5rem', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '12px' }}>
                <h3 style={{ fontSize: '1.3rem', margin: 0, fontWeight: 'bold' }}>
                  {isCreatingTrophy ? 'Ajouter un Nouveau Tournoi' : `Modifier le Tournoi : ${editingTrophy.title}`}
                </h3>
                <button 
                  type="button" 
                  onClick={() => { setEditingTrophy(null); setIsCreatingTrophy(false); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* SECTION PHOTO DU TOURNOI */}
              <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--clr-primary)', marginBottom: '8px' }}>
                  <ImageIcon size={15} /> Photo Réelle du Tournoi / de l'Équipe Victorieuse
                </label>
                <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 12px 0' }}>
                  Cette photo remplacera le trophée 3D dans la vitrine principale de la page d'accueil ainsi que sur le socle défilant en dessous.
                </p>

                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ width: '180px', height: '120px', borderRadius: '10px', overflow: 'hidden', border: '2px dashed #cbd5e1', background: '#0b0b0e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {editingTrophy.image ? (
                      <img 
                        src={editingTrophy.image} 
                        alt="Aperçu Tournoi" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    ) : (
                      <div style={{ textAlign: 'center', color: '#64748b', padding: '10px' }}>
                        <ImageIcon size={28} style={{ margin: '0 auto 4px' }} />
                        <span style={{ fontSize: '0.75rem', display: 'block' }}>Aucune photo (Trophée 3D par défaut)</span>
                      </div>
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: '240px' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', color: '#475569', marginBottom: '4px' }}>
                      URL de l'image
                    </label>
                    <input 
                      type="text" 
                      value={editingTrophy.image || ''} 
                      onChange={e => setEditingTrophy({ ...editingTrophy, image: e.target.value })} 
                      placeholder="https://... ou téléverser depuis votre appareil"
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem', marginBottom: '8px' }} 
                    />

                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <label 
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: 'white',
                          border: '1px solid #cbd5e1',
                          padding: '8px 14px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          color: '#1e293b'
                        }}
                      >
                        <Upload size={15} />
                        <span>Téléverser une photo du tournoi (Max 10 Mo)</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          style={{ display: 'none' }}
                          onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) handleTrophyPhotoUpload(file, e.target);
                          }}
                        />
                      </label>

                      {editingTrophy.image && (
                        <button
                          type="button"
                          onClick={() => setEditingTrophy({ ...editingTrophy, image: '' })}
                          style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.82rem', cursor: 'pointer', textDecoration: 'underline' }}
                        >
                          Supprimer la photo (revenir au trophée 3D)
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* CHAMPS TEXTUELS DU TOURNOI */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem', marginBottom: '1.2rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px' }}>Titre du Tournoi *</label>
                  <input 
                    type="text" 
                    value={editingTrophy.title} 
                    onChange={e => setEditingTrophy({ ...editingTrophy, title: e.target.value })} 
                    required 
                    placeholder="Ex: Tournoi Chale Chale"
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} 
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px' }}>Édition / Détail</label>
                  <input 
                    type="text" 
                    value={editingTrophy.edition} 
                    onChange={e => setEditingTrophy({ ...editingTrophy, edition: e.target.value })} 
                    placeholder="Ex: 7e Édition · Triplé Inédit"
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} 
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px' }}>Date (Mois & Année)</label>
                  <input 
                    type="text" 
                    value={editingTrophy.date} 
                    onChange={e => setEditingTrophy({ ...editingTrophy, date: e.target.value })} 
                    placeholder="Ex: Avril 2026"
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} 
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px' }}>Classement / Rang Obtenu</label>
                  <input 
                    type="text" 
                    value={editingTrophy.rank} 
                    onChange={e => setEditingTrophy({ ...editingTrophy, rank: e.target.value })} 
                    placeholder="Ex: Champion U11 / U15 / U16"
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem', marginBottom: '1.2rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px' }}>Lieu / Stade</label>
                  <input 
                    type="text" 
                    value={editingTrophy.venue || ''} 
                    onChange={e => setEditingTrophy({ ...editingTrophy, venue: e.target.value })} 
                    placeholder="Ex: Parc Sportif Delmas"
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} 
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px' }}>Bilan / Stats Remarquables</label>
                  <input 
                    type="text" 
                    value={editingTrophy.stats || ''} 
                    onChange={e => setEditingTrophy({ ...editingTrophy, stats: e.target.value })} 
                    placeholder="Ex: 3 Trophées · 1 Édition · Invaincus"
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} 
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px' }}>Badge / Mention</label>
                  <input 
                    type="text" 
                    value={editingTrophy.badge || ''} 
                    onChange={e => setEditingTrophy({ ...editingTrophy, badge: e.target.value })} 
                    placeholder="Ex: Triplé Historique ou Champion National"
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} 
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px' }}>Récit / Description Historique</label>
                <textarea 
                  value={editingTrophy.desc || ''} 
                  onChange={e => setEditingTrophy({ ...editingTrophy, desc: e.target.value })} 
                  rows={3}
                  placeholder="Racontez le parcours de l'équipe et le triomphe lors de cette compétition..."
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }} 
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" disabled={savingTrophy} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Check size={16} /> {savingTrophy ? 'Enregistrement...' : 'Enregistrer le Tournoi'}
                </button>
                <button 
                  type="button" 
                  onClick={() => { setEditingTrophy(null); setIsCreatingTrophy(false); }} 
                  className="btn btn-outline" 
                  style={{ color: 'black', borderColor: '#ccc' }}
                >
                  Annuler
                </button>
              </div>
            </form>
          )}

          {/* Liste des Trophées & Photos */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {trophies.map((t, idx) => (
              <div 
                key={t.id || idx}
                style={{
                  background: 'white',
                  borderRadius: '14px',
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Photo du tournoi ou aperçu */}
                <div style={{ position: 'relative', height: '170px', background: '#0b0b0e', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {t.image ? (
                    <img 
                      src={t.image} 
                      alt={t.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  ) : (
                    <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                      <Trophy size={42} color="var(--clr-primary)" style={{ margin: '0 auto 6px' }} />
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Trophée 3D Standard (Pas de photo)</div>
                    </div>
                  )}

                  <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', color: 'white', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    #{idx + 1}
                  </div>

                  {t.badge && (
                    <div style={{ position: 'absolute', bottom: '10px', left: '10px', background: 'var(--clr-primary)', color: 'white', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                      {t.badge}
                    </div>
                  )}
                </div>

                <div style={{ padding: '1.2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <h4 style={{ margin: 0, fontSize: '1.2rem', fontFamily: 'var(--font-heading)', color: '#0f172a' }}>
                      {t.title}
                    </h4>
                  </div>

                  <div style={{ color: 'var(--clr-primary)', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '8px' }}>
                    {t.edition} · {t.date}
                  </div>

                  <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>
                    {t.rank}
                  </div>

                  {t.venue && (
                    <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '6px' }}>
                      <MapPin size={13} color="var(--clr-primary)" /> {t.venue}
                    </div>
                  )}

                  <p style={{ color: '#64748b', fontSize: '0.84rem', margin: '0 0 1rem 0', flex: 1, lineClamp: 2, WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {t.desc}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                    <button 
                      onClick={() => handleOpenEditTrophy(t)} 
                      className="btn btn-outline"
                      style={{ padding: '5px 12px', fontSize: '0.82rem', color: '#1d4ed8', borderColor: '#bfdbfe', display: 'flex', alignItems: 'center', gap: '5px' }}
                    >
                      <Edit2 size={13} /> Modifier / Photo
                    </button>
                    <button 
                      onClick={() => handleDeleteTrophy(t)} 
                      className="btn btn-outline"
                      style={{ padding: '5px 10px', fontSize: '0.82rem', color: '#b91c1c', borderColor: '#fecaca', display: 'flex', alignItems: 'center' }}
                      title="Supprimer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==============================================================
          SOUS-ONGLET 2 : CHIFFRES & COMPTEURS DU PALMARÈS
      ============================================================== */}
      {activeSubTab === 'counters' && (
        <form onSubmit={handleSaveCounters} style={{ background: 'white', padding: '2.5rem', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.4rem', margin: 0, fontWeight: 'bold' }}>
              Compteurs & Textes de la Section Palmarès (Accueil)
            </h3>
            <p style={{ color: '#64748b', margin: '4px 0 0', fontSize: '0.88rem' }}>
              Modifiez ici les 4 chiffres de consécration affichés au-dessus de la vitrine des trophées.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.2rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '6px' }}>Titre Principal</label>
              <input 
                type="text" 
                value={siteContent.palmares_title || ''} 
                onChange={e => setSiteContent({ ...siteContent, palmares_title: e.target.value })} 
                placeholder="NOTRE PALMARÈS"
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', fontWeight: 'bold' }} 
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '6px' }}>Sous-titre / Descriptif</label>
              <input 
                type="text" 
                value={siteContent.palmares_subtitle || ''} 
                onChange={e => setSiteContent({ ...siteContent, palmares_subtitle: e.target.value })} 
                placeholder="Les titres officiels et les distinctions majeures remportés par le Condor FC..."
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }} 
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1.2rem', background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '4px' }}>Compteur 1 : Valeur</label>
              <input 
                type="text" 
                value={siteContent.palmares_stat1_val || ''} 
                onChange={e => setSiteContent({ ...siteContent, palmares_stat1_val: e.target.value })} 
                placeholder="05"
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 'bold', fontSize: '1.2rem', textAlign: 'center' }} 
              />
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', marginTop: '6px', marginBottom: '2px' }}>Libellé</label>
              <input 
                type="text" 
                value={siteContent.palmares_stat1_lbl || ''} 
                onChange={e => setSiteContent({ ...siteContent, palmares_stat1_lbl: e.target.value })} 
                placeholder="Titres & Podiums"
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }} 
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '4px' }}>Compteur 2 : Valeur</label>
              <input 
                type="text" 
                value={siteContent.palmares_stat2_val || ''} 
                onChange={e => setSiteContent({ ...siteContent, palmares_stat2_val: e.target.value })} 
                placeholder="03"
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 'bold', fontSize: '1.2rem', textAlign: 'center', color: 'var(--clr-primary)' }} 
              />
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', marginTop: '6px', marginBottom: '2px' }}>Libellé</label>
              <input 
                type="text" 
                value={siteContent.palmares_stat2_lbl || ''} 
                onChange={e => setSiteContent({ ...siteContent, palmares_stat2_lbl: e.target.value })} 
                placeholder="Titres de Champion"
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }} 
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '4px' }}>Compteur 3 : Valeur</label>
              <input 
                type="text" 
                value={siteContent.palmares_stat3_val || ''} 
                onChange={e => setSiteContent({ ...siteContent, palmares_stat3_val: e.target.value })} 
                placeholder="02"
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 'bold', fontSize: '1.2rem', textAlign: 'center' }} 
              />
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', marginTop: '6px', marginBottom: '2px' }}>Libellé</label>
              <input 
                type="text" 
                value={siteContent.palmares_stat3_lbl || ''} 
                onChange={e => setSiteContent({ ...siteContent, palmares_stat3_lbl: e.target.value })} 
                placeholder="Vice-Champions"
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }} 
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '4px' }}>Compteur 4 : Valeur</label>
              <input 
                type="text" 
                value={siteContent.palmares_stat4_val || ''} 
                onChange={e => setSiteContent({ ...siteContent, palmares_stat4_val: e.target.value })} 
                placeholder="01"
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 'bold', fontSize: '1.2rem', textAlign: 'center', color: 'var(--clr-primary)' }} 
              />
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', marginTop: '6px', marginBottom: '2px' }}>Libellé</label>
              <input 
                type="text" 
                value={siteContent.palmares_stat4_lbl || ''} 
                onChange={e => setSiteContent({ ...siteContent, palmares_stat4_lbl: e.target.value })} 
                placeholder="Triplé Historique"
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }} 
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              type="submit" 
              disabled={savingCounters} 
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 28px', fontSize: '1rem' }}
            >
              <Check size={18} /> {savingCounters ? 'Enregistrement...' : 'Enregistrer les Chiffres du Palmarès'}
            </button>
          </div>
        </form>
      )}

      {/* ==============================================================
          SOUS-ONGLET 3 : FRISE CHRONOLOGIQUE (PAGE L'ACADÉMIE)
      ============================================================== */}
      {activeSubTab === 'timeline' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.3rem', margin: 0, fontWeight: 'bold' }}>
                Étapes Historiques du Parcours (Page L&apos;Académie)
              </h3>
              <p style={{ color: '#64748b', margin: '4px 0 0', fontSize: '0.88rem' }}>
                Gérez la frise chronologique affichée sur la page « L&apos;Académie » racontant l'histoire et la progression du Condor FC.
              </p>
            </div>

            <button 
              onClick={handleOpenCreateTimeline}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            >
              <Plus size={18} /> Ajouter une Étape Historique
            </button>
          </div>

          {editingItem && (
            <form onSubmit={handleSaveTimeline} style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '2px solid var(--clr-primary)', marginBottom: '2.5rem', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
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
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '6px' }}>Titre de l'étape *</label>
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
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '6px' }}>Description de l'événement</label>
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
            {sortedTimeline.map(item => (
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
                    onClick={() => handleOpenEditTimeline(item)} 
                    className="btn btn-outline"
                    style={{ padding: '6px 12px', fontSize: '0.85rem', color: '#1d4ed8', borderColor: '#bfdbfe', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Edit2 size={14} /> Modifier
                  </button>
                  <button 
                    onClick={() => handleDeleteTimeline(item)} 
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
      )}
    </div>
  );
}

