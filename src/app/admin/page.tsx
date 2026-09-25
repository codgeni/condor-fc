"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, Users, Calendar, BookOpen, Image, 
  Trash2, Plus, Edit2, CheckCircle, LogOut, Award, Upload,
  Tv, ShoppingBag, Trophy, CheckSquare, Square, Eye, EyeOff,
  Radio, Shield, Clock, MapPin, Save, X, Menu
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { playersDB } from '@/lib/playersDB';
import { 
  fetchCurrentMatch, saveMatchConfig, MatchConfig,
  fetchVideos, saveVideo, deleteVideo, VideoItem, parseVideoUrl,
  fetchStages, saveStage, deleteStage, StageSession,
  fetchProducts, saveProduct, deleteProduct, ShopProduct,
  savePlayerRecord, deletePlayerRecord
} from '@/lib/dataService';
import { validateUploadFile, sanitizeFormRecord } from '@/lib/security';

const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Validation de sécurité : taille max 5 Mo et type MIME d'image certifié
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

const translateAuthError = (message: string): string => {
  const msg = message.toLowerCase();
  if (msg.includes('email not confirmed')) {
    return "L'adresse e-mail de l'administrateur n'est pas encore confirmée. Rendez-vous dans Supabase > Authentication > Users et validez le compte ('Auto Confirm User'), ou confirmez via le lien d'activation reçu.";
  }
  if (msg.includes('invalid login credentials') || msg.includes('invalid email')) {
    return "Adresse e-mail ou mot de passe incorrect.";
  }
  if (msg.includes('rate limit')) {
    return "Trop de tentatives de connexion infructueuses. Veuillez patienter quelques minutes avant de réessayer.";
  }
  if (msg.includes('already registered') || msg.includes('already exists') || msg.includes('user already exists')) {
    return "Cette adresse e-mail est déjà associée à un compte.";
  }
  if (msg.includes('password should be')) {
    return "Le mot de passe doit comporter au moins 6 caractères.";
  }
  return "Une erreur est survenue lors de la connexion. Veuillez réessayer.";
};

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('matches');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 1. Matches & Slider State (Accueil)
  const [matchConfig, setMatchConfig] = useState<MatchConfig>({
    opponent: '',
    home_team: 'Condor FC',
    match_date: '',
    match_time: '',
    location: 'Parc Sportif Delmas',
    competition: 'Prochain Match Officiel',
    no_matches_now: true,
    is_active: true
  });
  const [slides, setSlides] = useState<any[]>([]);
  const [newSlideUrl, setNewSlideUrl] = useState('');

  // 2. Condor TV (Videos) State
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [editingVideo, setEditingVideo] = useState<any>(null);

  // 3. Stages State
  const [stages, setStages] = useState<StageSession[]>([]);
  const [editingStage, setEditingStage] = useState<any>(null);
  const [stageRegistrations, setStageRegistrations] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);

  // 4. Boutique / Products State
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  // 5. News State
  const [newsList, setNewsList] = useState<any[]>([]);
  const [editingNews, setEditingNews] = useState<any>(null);

  // 6. Players State
  const [players, setPlayers] = useState<Record<string, any>>({});
  const [editingPlayer, setEditingPlayer] = useState<any>(null);
  const [creatingPlayer, setCreatingPlayer] = useState(false);

  // 7. Inscriptions & Supporters State
  const [inscriptions, setInscriptions] = useState<any[]>([]);
  const [selectedInscription, setSelectedInscription] = useState<any>(null);
  const [supporters, setSupporters] = useState<any[]>([]);

  const showToast = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 4000);
  };

  // Load all data
  const fetchData = async () => {
    // 1. Fetch Match & Slides
    const currentMatch = await fetchCurrentMatch();
    if (currentMatch) setMatchConfig(currentMatch);

    const { data: slidesData } = await supabase.from('slides').select('*').order('created_at', { ascending: true });
    if (slidesData) setSlides(slidesData);

    // 2. Fetch Videos
    const videosData = await fetchVideos();
    if (videosData) setVideos(videosData);

    // 3. Fetch Stages
    const stagesData = await fetchStages();
    if (stagesData) setStages(stagesData);

    const { data: stageInscriptions } = await supabase.from('stages_inscriptions').select('*').order('created_at', { ascending: false });
    if (stageInscriptions) setStageRegistrations(stageInscriptions);

    const { data: rdvData } = await supabase.from('appointments').select('*').order('created_at', { ascending: false });
    if (rdvData) setAppointments(rdvData);

    // 4. Fetch Products
    const productsData = await fetchProducts();
    if (productsData) setProducts(productsData);

    // 5. Fetch News
    const { data: newsData } = await supabase.from('news').select('*').order('created_at', { ascending: false });
    if (newsData) setNewsList(newsData);

    // 6. Fetch Players
    const { data: playersData } = await supabase.from('players').select('*');
    const mergedPlayers: Record<string, any> = { ...playersDB };
    if (playersData && playersData.length > 0) {
      playersData.forEach((player: any) => {
        mergedPlayers[player.id] = {
          ...(mergedPlayers[player.id] || {}),
          ...player
        };
      });
    }
    setPlayers(mergedPlayers);

    // 7. Fetch Inscriptions & Supporters
    const { data: inscriptionsData } = await supabase.from('inscriptions').select('*').order('created_at', { ascending: false });
    if (inscriptionsData) setInscriptions(inscriptionsData);

    const { data: supportersData } = await supabase.from('supporters').select('*').order('created_at', { ascending: false });
    if (supportersData) setSupporters(supportersData);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        if (session.user.email === 'admin@gmail.com') {
          fetchData();
        }
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        if (session.user.email === 'admin@gmail.com') {
          fetchData();
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // -------------------------------------------------------------
  // MATCH & SLIDER HANDLERS
  // -------------------------------------------------------------
  const handleSaveMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await saveMatchConfig(matchConfig);
    if (res.success) {
      showToast('Configuration du match enregistrée avec succès !');
      fetchData();
    } else {
      showToast('Erreur lors de l\'enregistrement du match.');
    }
  };

  const handleToggleNoMatches = async () => {
    const updated = { ...matchConfig, no_matches_now: !matchConfig.no_matches_now };
    setMatchConfig(updated);
    await saveMatchConfig(updated);
    showToast(updated.no_matches_now ? "Option 'Aucun match' activée : les fausses données sont masquées sur le site." : "Option 'Aucun match' désactivée : le match programmé est affiché en direct.");
  };

  const addSlide = async () => {
    if (!newSlideUrl) return;
    const { error } = await supabase.from('slides').insert({ url: newSlideUrl });
    if (error) {
      showToast('Erreur lors de l\'ajout de la photo.');
    } else {
      setNewSlideUrl('');
      fetchData();
      showToast('Photo ajoutée au slider avec succès !');
    }
  };

  const removeSlide = async (id: number) => {
    const { error } = await supabase.from('slides').delete().eq('id', id);
    if (error) {
      showToast('Erreur lors de la suppression.');
    } else {
      fetchData();
      showToast('Photo supprimée avec succès.');
    }
  };

  // -------------------------------------------------------------
  // CONDOR TV HANDLERS
  // -------------------------------------------------------------
  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVideo.title || !editingVideo.url) {
      showToast('Le titre et le lien de la vidéo sont obligatoires.');
      return;
    }

    const res = await saveVideo(editingVideo);
    if (res.success) {
      showToast('Vidéo enregistrée avec succès !');
      setEditingVideo(null);
      fetchData();
    } else {
      showToast('Erreur lors de l\'enregistrement de la vidéo.');
    }
  };

  const handleDeleteVideo = async (id: number | string) => {
    if (!confirm('Voulez-vous vraiment supprimer cette vidéo ?')) return;
    await deleteVideo(id);
    showToast('Vidéo supprimée avec succès.');
    fetchData();
  };

  // -------------------------------------------------------------
  // STAGES HANDLERS
  // -------------------------------------------------------------
  const handleSaveStage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStage.title || !editingStage.dates) {
      showToast('Le titre et les dates du stage sont obligatoires.');
      return;
    }

    const res = await saveStage(editingStage);
    if (res.success) {
      showToast('Session de stage enregistrée avec succès !');
      setEditingStage(null);
      fetchData();
    } else {
      showToast('Erreur lors de l\'enregistrement du stage.');
    }
  };

  const handleDeleteStage = async (id: number | string) => {
    if (!confirm('Voulez-vous vraiment supprimer cette session de stage ?')) return;
    await deleteStage(id);
    showToast('Session de stage supprimée avec succès.');
    fetchData();
  };

  const handleDeleteStageRegistration = async (id: number) => {
    if (!confirm('Supprimer cette pré-inscription ?')) return;
    await supabase.from('stages_inscriptions').delete().eq('id', id);
    showToast('Pré-inscription supprimée.');
    fetchData();
  };

  const handleDeleteAppointment = async (id: number) => {
    if (!confirm('Supprimer ce rendez-vous ?')) return;
    await supabase.from('appointments').delete().eq('id', id);
    showToast('Rendez-vous supprimé.');
    fetchData();
  };

  // -------------------------------------------------------------
  // BOUTIQUE / PRODUCTS HANDLERS
  // -------------------------------------------------------------
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct.id || !editingProduct.title || !editingProduct.price) {
      showToast('Veuillez renseigner un ID unique, un titre et un prix.');
      return;
    }

    const res = await saveProduct(editingProduct);
    if (res.success) {
      showToast('Article de boutique enregistré avec succès !');
      setEditingProduct(null);
      fetchData();
    } else {
      showToast('Erreur lors de l\'enregistrement du produit.');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm(`Supprimer l'article "${id}" de la boutique ?`)) return;
    await deleteProduct(id);
    showToast('Article supprimé de la boutique.');
    fetchData();
  };

  // -------------------------------------------------------------
  // NEWS HANDLERS
  // -------------------------------------------------------------
  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      cat: editingNews.cat || 'Match',
      title: editingNews.title,
      desc_text: editingNews.desc_text || editingNews.desc || '',
      img: editingNews.img || '/player_action_1_1780681882713.png',
      date: editingNews.date || "À l'instant"
    };

    let error;
    if (editingNews.id) {
      const res = await supabase.from('news').update(payload).eq('id', editingNews.id);
      error = res.error;
    } else {
      const res = await supabase.from('news').insert(payload);
      error = res.error;
    }

    if (error) {
      showToast('Erreur lors de l\'enregistrement de l\'article.');
    } else {
      showToast('Article de presse enregistré avec succès !');
      setEditingNews(null);
      fetchData();
    }
  };

  const handleDeleteNews = async (id: number) => {
    if (!confirm('Supprimer cet article d\'actualité ?')) return;
    const { error } = await supabase.from('news').delete().eq('id', id);
    if (error) {
      showToast('Impossible de supprimer l\'article.');
    } else {
      showToast('Article supprimé avec succès.');
      fetchData();
    }
  };

  // -------------------------------------------------------------
  // PLAYERS HANDLERS
  // -------------------------------------------------------------
  const handleSavePlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = {
      id: editingPlayer.id || Date.now().toString(),
      name: editingPlayer.name,
      num: parseInt(editingPlayer.num) || 0,
      pos: editingPlayer.pos || 'Attaquant',
      category: editingPlayer.category || 'U17',
      height: editingPlayer.height || '',
      weight: editingPlayer.weight || '',
      foot: editingPlayer.foot || 'Droit',
      dob: editingPlayer.dob || '',
      nationality: editingPlayer.nationality || 'Haïtienne',
      pob: editingPlayer.pob || 'Haïti',
      bio: editingPlayer.bio || '',
      img: editingPlayer.img || '/condor_logo_transparent.png',
      detail_img: editingPlayer.detail_img || editingPlayer.img || '/condor_logo_transparent.png'
    };

    const res = await savePlayerRecord(payload);
    if (res.success) {
      showToast(`Fiche de ${payload.name} enregistrée avec succès !`);
      setEditingPlayer(null);
      setCreatingPlayer(false);
      fetchData();
    } else {
      showToast(res.error || 'Erreur lors de l\'enregistrement du joueur.');
    }
  };

  const handleDeletePlayer = async (id: string, name: string) => {
    if (!confirm(`Confirmez-vous la suppression définitive du joueur ${name} (#${id}) ?`)) return;
    const res = await deletePlayerRecord(id);
    if (res.success) {
      showToast(`Joueur ${name} supprimé avec succès.`);
      fetchData();
    } else {
      showToast(res.error || 'Erreur lors de la suppression.');
    }
  };

  // -------------------------------------------------------------
  // INSCRIPTIONS HANDLERS
  // -------------------------------------------------------------
  const handleDeleteInscription = async (id: number) => {
    if (!confirm('Supprimer ce dossier d\'inscription ?')) return;
    const { error } = await supabase.from('inscriptions').delete().eq('id', id);
    if (!error) {
      showToast('Dossier d\'inscription supprimé.');
      fetchData();
    }
  };

  if (loading) {
    return (
      <div style={{ flex: 1, marginTop: '80px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 80px)', background: '#f5f7fa', color: 'black' }}>
        <h3>Chargement de la session admin...</h3>
      </div>
    );
  }

  if (!user || user.email !== 'admin@gmail.com') {
    return <AdminLoginGate onLoginSuccess={() => fetchData()} />;
  }

  return (
    <div className="admin-container" style={{ flex: 1, marginTop: '80px', display: 'flex', minHeight: 'calc(100vh - 80px)', background: '#f5f7fa', color: 'var(--clr-black)', position: 'relative' }}>
      
      {/* Mobile Top Header */}
      <div className="admin-mobile-header">
        <button
          onClick={() => setIsSidebarOpen(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--clr-primary)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '9px 16px',
            fontWeight: 'bold',
            fontSize: '0.9rem',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(202, 2, 79, 0.3)'
          }}
        >
          <Menu size={18} />
          <span>Menu Admin</span>
        </button>
        <span style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {activeTab}
        </span>
      </div>

      {/* Backdrop on mobile */}
      {isSidebarOpen && (
        <div
          className="admin-backdrop"
          onClick={() => setIsSidebarOpen(false)}
          title="Fermer le menu"
        />
      )}

      {/* Sidebar de navigation Admin */}
      <aside 
        className={`admin-sidebar ${isSidebarOpen ? 'admin-sidebar-open' : 'admin-sidebar-closed'}`}
        style={{ 
          width: '270px', 
          background: 'var(--clr-black)', 
          color: 'white', 
          padding: '2rem 1rem', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '8px', 
          flexShrink: 0 
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', padding: '0 4px' }}>
          <div style={{ textAlign: 'left' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--clr-primary)', margin: 0, lineHeight: 1.1 }}>CONDOR ADMIN</h2>
            <span style={{ fontSize: '0.72rem', color: '#888', letterSpacing: '1px' }}>PANNEAU DE CONTRÔLE CRUD</span>
          </div>

          {/* Bouton Fermer Sidebar pour Mobile & Petits Écrans */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="admin-close-btn"
            title="Fermer le menu"
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              borderRadius: '8px',
              width: '36px',
              height: '36px',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'background 0.2s'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {[
          { id: 'matches', label: 'Accueil & Matchs', icon: <Trophy size={18} /> },
          { id: 'news', label: 'Actualités', icon: <BookOpen size={18} /> },
          { id: 'tv', label: 'Condor TV (Vidéos)', icon: <Tv size={18} /> },
          { id: 'stages', label: 'Stages & RDV', icon: <Calendar size={18} /> },
          { id: 'shop', label: 'Boutique Officielle', icon: <ShoppingBag size={18} /> },
          { id: 'players', label: 'Équipe & Joueurs', icon: <Users size={18} /> },
          { id: 'inscriptions', label: 'Inscriptions Annuelles', icon: <Award size={18} /> },
          { id: 'supporters', label: 'Supporters & Alertes', icon: <Settings size={18} /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => { 
              setActiveTab(tab.id); 
              setIsSidebarOpen(false);
              setEditingPlayer(null); 
              setCreatingPlayer(false);
              setEditingNews(null); 
              setEditingVideo(null);
              setEditingStage(null);
              setEditingProduct(null);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              padding: '12px 14px',
              background: activeTab === tab.id ? 'var(--clr-primary)' : 'transparent',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              textAlign: 'left',
              fontSize: '0.95rem',
              cursor: 'pointer',
              fontWeight: activeTab === tab.id ? 'bold' : 'normal',
              transition: 'all 0.2s'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}

        <button 
          onClick={async () => {
            await supabase.auth.signOut();
            window.location.href = '/';
          }}
          className="btn btn-outline" 
          style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px', color: 'white', borderColor: '#444', textDecoration: 'none', justifyContent: 'center', background: 'transparent', width: '100%', cursor: 'pointer', padding: '10px' }}
        >
          <LogOut size={16} /> Déconnexion
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main-content" style={{ flex: 1, padding: '2.5rem 3rem', overflowY: 'auto' }}>
        
        {message && (
          <div style={{ background: '#d4edda', color: '#155724', padding: '14px 20px', borderRadius: '8px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <CheckCircle size={20} /> {message}
          </div>
        )}

        {/* ==============================================================
            TAB 1: ACCUEIL & MATCHS
        ============================================================== */}
        {activeTab === 'matches' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* En-tête de section moderne */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1.2rem' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', background: 'rgba(202, 2, 79, 0.08)', borderRadius: '20px', color: 'var(--clr-primary)', fontSize: '0.78rem', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
                  <Radio size={14} style={{ color: matchConfig.no_matches_now ? '#64748b' : 'var(--clr-primary)' }} />
                  {matchConfig.no_matches_now ? 'Bandeau en veille' : 'Diffusion active en direct'}
                </div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', margin: 0, color: 'var(--clr-black)' }}>Accueil & Matchs Officiels</h2>
                <p style={{ color: 'var(--clr-gray)', margin: '6px 0 0', fontSize: '0.96rem' }}>Pilotez l'annonce du match en direct sur la page d'accueil et organisez la galerie photo.</p>
              </div>

              {/* Interrupteur Exécutif Élégant (Switch Card) */}
              <div 
                onClick={handleToggleNoMatches}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '12px 20px',
                  background: '#ffffff',
                  border: matchConfig.no_matches_now ? '1px solid #cbd5e1' : '1px solid rgba(202, 2, 79, 0.35)',
                  borderRadius: '14px',
                  cursor: 'pointer',
                  boxShadow: matchConfig.no_matches_now ? '0 4px 12px rgba(0,0,0,0.04)' : '0 6px 22px rgba(202, 2, 79, 0.12)',
                  transition: 'all 0.25s ease',
                  userSelect: 'none'
                }}
              >
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.8px', color: matchConfig.no_matches_now ? '#64748b' : 'var(--clr-primary)' }}>
                    {matchConfig.no_matches_now ? 'Mode Veille' : 'Match Actif'}
                  </div>
                  <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#1e293b' }}>
                    {matchConfig.no_matches_now ? 'Aucun match officiel' : 'Match programmé'}
                  </div>
                </div>

                {/* Switcher iOS Élégant */}
                <div 
                  style={{
                    width: '50px',
                    height: '28px',
                    borderRadius: '14px',
                    background: matchConfig.no_matches_now ? '#94a3b8' : 'var(--clr-primary)',
                    position: 'relative',
                    padding: '3px',
                    transition: 'background 0.25s ease'
                  }}
                >
                  <div 
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: '#ffffff',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                      transform: matchConfig.no_matches_now ? 'translateX(0)' : 'translateX(22px)',
                      transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Bannière de Statut & Aperçu Visuel Réel */}
            <div style={{ 
              background: matchConfig.no_matches_now ? '#f8fafc' : 'linear-gradient(135deg, #ffffff 0%, #fff7f9 100%)', 
              border: matchConfig.no_matches_now ? '1px solid #e2e8f0' : '1px solid rgba(202, 2, 79, 0.2)', 
              borderRadius: '16px', 
              padding: '1.4rem 1.8rem', 
              marginBottom: '2rem',
              boxShadow: matchConfig.no_matches_now ? '0 4px 15px rgba(0,0,0,0.02)' : '0 8px 25px rgba(202, 2, 79, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.8rem', borderBottom: matchConfig.no_matches_now ? '1px solid #e2e8f0' : '1px solid rgba(202, 2, 79, 0.12)', paddingBottom: '0.9rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ 
                    width: '36px', 
                    height: '36px', 
                    borderRadius: '10px', 
                    background: matchConfig.no_matches_now ? '#e2e8f0' : 'rgba(202, 2, 79, 0.12)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: matchConfig.no_matches_now ? '#475569' : 'var(--clr-primary)'
                  }}>
                    {matchConfig.no_matches_now ? <Shield size={18} /> : <Radio size={18} />}
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: matchConfig.no_matches_now ? '#64748b' : 'var(--clr-primary)', display: 'block' }}>
                      {matchConfig.no_matches_now ? 'État Public : Stand-by Officiel' : 'État Public : Rencontre Programmée'}
                    </span>
                    <strong style={{ fontSize: '1.05rem', color: '#0f172a' }}>
                      {matchConfig.no_matches_now ? 'Communiqué officiel de préparation affiché' : 'Compte à rebours et affiche du match en ligne'}
                    </strong>
                  </div>
                </div>

                <span style={{ 
                  fontSize: '0.78rem', 
                  fontWeight: '700', 
                  padding: '4px 12px', 
                  borderRadius: '20px', 
                  background: matchConfig.no_matches_now ? '#e2e8f0' : 'var(--clr-primary)', 
                  color: matchConfig.no_matches_now ? '#475569' : '#ffffff' 
                }}>
                  {matchConfig.no_matches_now ? 'Données d\'essai masquées' : 'Direct en ligne'}
                </span>
              </div>

              {/* Rendu & Description élégante */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.5 }}>
                  {matchConfig.no_matches_now ? (
                    <span>
                      Message affiché aux supporters : <em>« Aucun match officiel programmé pour le moment. Nos équipes sont en période d'entraînement intensif. »</em>
                    </span>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span>Affiche en ligne :</span>
                      <strong style={{ color: '#0f172a' }}>{matchConfig.home_team || 'Condor FC'} vs {matchConfig.opponent || 'Adversaire'}</strong>
                      {matchConfig.match_date ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#ffffff', border: '1px solid #e2e8f0', padding: '2px 8px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: '600' }}>
                          <Calendar size={13} /> {matchConfig.match_date} {matchConfig.match_time ? `à ${matchConfig.match_time}` : ''}
                        </span>
                      ) : (
                        <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>(Date à renseigner ci-dessous)</span>
                      )}
                      {matchConfig.location && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#ffffff', border: '1px solid #e2e8f0', padding: '2px 8px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: '600' }}>
                          <MapPin size={13} /> {matchConfig.location}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <Link href="/" target="_blank" style={{ fontSize: '0.84rem', fontWeight: '700', color: 'var(--clr-primary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  Voir sur le site public &rarr;
                </Link>
              </div>
            </div>

            {/* Formulaire de Configuration du Match */}
            <div style={{ background: '#ffffff', padding: '2.2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.6rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px', flexWrap: 'wrap', gap: '0.8rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', margin: 0, fontWeight: '800', color: '#0f172a' }}>Paramètres de l'Affiche & Horaires</h3>
                  <p style={{ margin: '4px 0 0', fontSize: '0.88rem', color: '#64748b' }}>Renseignez l'adversaire et le calendrier officiel pour alimenter le compte à rebours de l'accueil.</p>
                </div>
                <span style={{ fontSize: '0.78rem', background: '#f1f5f9', padding: '4px 10px', borderRadius: '6px', color: '#64748b', fontWeight: '600' }}>
                  Édition en direct
                </span>
              </div>
              
              <form onSubmit={handleSaveMatch}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.4rem', marginBottom: '1.4rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#475569', marginBottom: '7px' }}>
                      Équipe à domicile
                    </label>
                    <input 
                      type="text" 
                      value={matchConfig.home_team || 'Condor FC'} 
                      onChange={e => setMatchConfig({ ...matchConfig, home_team: e.target.value })} 
                      style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '0.95rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#475569', marginBottom: '7px' }}>
                      Équipe adverse
                    </label>
                    <input 
                      type="text" 
                      placeholder="Ex: AS Delmas" 
                      value={matchConfig.opponent} 
                      onChange={e => setMatchConfig({ ...matchConfig, opponent: e.target.value })} 
                      style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '0.95rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#475569', marginBottom: '7px' }}>
                      Date du match
                    </label>
                    <input 
                      type="text" 
                      placeholder="Ex: 2026-10-24 ou Samedi prochain" 
                      value={matchConfig.match_date} 
                      onChange={e => setMatchConfig({ ...matchConfig, match_date: e.target.value })} 
                      style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '0.95rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#475569', marginBottom: '7px' }}>
                      Heure / Horaire
                    </label>
                    <input 
                      type="text" 
                      placeholder="Ex: 16h00 ou 4:00 PM" 
                      value={matchConfig.match_time} 
                      onChange={e => setMatchConfig({ ...matchConfig, match_time: e.target.value })} 
                      style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '0.95rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.4rem', marginBottom: '1.8rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#475569', marginBottom: '7px' }}>
                      Lieu de la rencontre
                    </label>
                    <input 
                      type="text" 
                      placeholder="Ex: Parc Sportif Delmas" 
                      value={matchConfig.location} 
                      onChange={e => setMatchConfig({ ...matchConfig, location: e.target.value })} 
                      style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '0.95rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#475569', marginBottom: '7px' }}>
                      Intitulé / Compétition
                    </label>
                    <input 
                      type="text" 
                      placeholder="Ex: Tournoi National d'Automne" 
                      value={matchConfig.competition} 
                      onChange={e => setMatchConfig({ ...matchConfig, competition: e.target.value })} 
                      style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '0.95rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    style={{ 
                      padding: '13px 28px', 
                      borderRadius: '10px', 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      fontWeight: '700',
                      boxShadow: '0 4px 15px rgba(202, 2, 79, 0.25)' 
                    }}
                  >
                    <Save size={18} /> Enregistrer la configuration du match
                  </button>
                </div>
              </form>
            </div>

            {/* Slider Accueil */}
            <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #eee' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Slider Photo de la Page d'Accueil</h3>
              <p style={{ color: 'var(--clr-gray)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>Ajoutez ou supprimez les images qui défilent dans l'en-tête de la page d'accueil.</p>
              
              <div style={{
                border: '2px dashed #ccc',
                borderRadius: '8px',
                padding: '1.5rem',
                textAlign: 'center',
                cursor: 'pointer',
                background: '#fafafa',
                position: 'relative',
                marginBottom: '1.5rem'
              }}>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        const base64 = await convertToBase64(file);
                        setNewSlideUrl(base64);
                      } catch (err) {
                        showToast("Erreur lors de la lecture du fichier");
                      }
                    }
                  }}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                />
                {newSlideUrl ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <img src={newSlideUrl} style={{ maxHeight: '120px', borderRadius: '4px', border: '1px solid #eee' }} alt="Aperçu" />
                    <span style={{ fontSize: '0.85rem', color: 'green', fontWeight: 'bold' }}>✓ Image prête à être ajoutée</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <Upload size={32} style={{ color: '#aaa' }} />
                    <p style={{ margin: 0, fontSize: '0.95rem', color: '#555' }}>Sélectionnez une photo de votre ordinateur pour l'ajouter au slider</p>
                  </div>
                )}
              </div>

              {newSlideUrl && (
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                  <button onClick={() => setNewSlideUrl('')} className="btn btn-outline" style={{ color: 'black', borderColor: '#ddd' }}>Annuler</button>
                  <button onClick={addSlide} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Plus size={18} /> Ajouter au Slider</button>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.5rem' }}>
                {slides.map(slide => (
                  <div key={slide.id} style={{ background: '#fafafa', borderRadius: '8px', overflow: 'hidden', border: '1px solid #eee' }}>
                    <img src={slide.url} style={{ width: '100%', height: '120px', objectFit: 'cover' }} alt="slide preview" />
                    <div style={{ padding: '0.6rem 0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '110px' }}>{slide.url.startsWith('data:') ? 'Image uploadée' : slide.url}</span>
                      <button onClick={() => removeSlide(slide.id)} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ==============================================================
            TAB 2: CONDOR TV (VIDÉOS CRUD)
        ============================================================== */}
        {activeTab === 'tv' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', margin: 0 }}>Condor TV (Vidéos)</h2>
                <p style={{ color: 'var(--clr-gray)', margin: '5px 0 0' }}>Gérez les vidéos publiées sur Condor TV et sur la page d'accueil avec support YouTube direct.</p>
              </div>
              <button 
                onClick={() => setEditingVideo({ title: '', url: '', category: 'Résumé des matchs', duration: '10:00', tag: 'Exclusif', description: '' })} 
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Plus size={18} /> Ajouter une Vidéo
              </button>
            </div>

            {editingVideo ? (
              <form onSubmit={handleSaveVideo} style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #eee', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>{editingVideo.id ? 'Modifier la Vidéo' : 'Nouvelle Vidéo'}</h3>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.2rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px' }}>Titre de la vidéo *</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Finale U16 : Condor FC vs AS Delmas" 
                      value={editingVideo.title} 
                      onChange={e => setEditingVideo({ ...editingVideo, title: e.target.value })} 
                      required 
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px' }}>Catégorie *</label>
                    <select 
                      value={editingVideo.category} 
                      onChange={e => setEditingVideo({ ...editingVideo, category: e.target.value })} 
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                    >
                      <option value="Résumé des matchs">Résumé des matchs</option>
                      <option value="En coulisse">En coulisse</option>
                      <option value="Interviews & Conférences">Interviews & Conférences</option>
                      <option value="Highlights">Highlights</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1.2rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px' }}>Lien de la vidéo (Lien YouTube direct supporté) *</label>
                    <input 
                      type="text" 
                      placeholder="https://www.youtube.com/watch?v=... ou https://youtu.be/..." 
                      value={editingVideo.url} 
                      onChange={e => setEditingVideo({ ...editingVideo, url: e.target.value })} 
                      required 
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px' }}>Durée</label>
                    <input 
                      type="text" 
                      placeholder="Ex: 12:45" 
                      value={editingVideo.duration || ''} 
                      onChange={e => setEditingVideo({ ...editingVideo, duration: e.target.value })} 
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px' }}>Badge / Tag</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Exclusif, Résumé" 
                      value={editingVideo.tag || ''} 
                      onChange={e => setEditingVideo({ ...editingVideo, tag: e.target.value })} 
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} 
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px' }}>Description de la vidéo</label>
                  <textarea 
                    value={editingVideo.description || ''} 
                    onChange={e => setEditingVideo({ ...editingVideo, description: e.target.value })} 
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', minHeight: '80px' }} 
                    placeholder="Bref résumé des temps forts..."
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="submit" className="btn btn-primary">Enregistrer la vidéo</button>
                  <button type="button" onClick={() => setEditingVideo(null)} className="btn btn-outline" style={{ color: 'black', borderColor: '#ddd' }}>Annuler</button>
                </div>
              </form>
            ) : null}

            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #eee', overflow: 'hidden' }}>
              {videos.length === 0 ? (
                <p style={{ padding: '2.5rem', textAlign: 'center', color: '#666' }}>Aucune vidéo n'a encore été ajoutée. Cliquez sur "Ajouter une Vidéo" pour publier vos résumés ou vidéos en coulisse.</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#f5f7fa', borderBottom: '1px solid #eee' }}>
                      <th style={{ padding: '15px' }}>Aperçu</th>
                      <th style={{ padding: '15px' }}>Titre</th>
                      <th style={{ padding: '15px' }}>Catégorie</th>
                      <th style={{ padding: '15px' }}>Durée</th>
                      <th style={{ padding: '15px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {videos.map(video => (
                      <tr key={video.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '15px' }}>
                          <img 
                            src={video.thumbnail || parseVideoUrl(video.url).thumbnail || '/player_action_1_1780681882713.png'} 
                            style={{ width: '70px', height: '45px', objectFit: 'cover', borderRadius: '4px' }} 
                            alt="thumb" 
                          />
                        </td>
                        <td style={{ padding: '15px', fontWeight: 'bold' }}>{video.title}</td>
                        <td style={{ padding: '15px' }}>
                          <span style={{ background: 'rgba(202, 2, 79, 0.1)', color: 'var(--clr-primary)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                            {video.category}
                          </span>
                        </td>
                        <td style={{ padding: '15px', color: '#666' }}>{video.duration || 'N/A'}</td>
                        <td style={{ padding: '15px', textAlign: 'right' }}>
                          <button onClick={() => setEditingVideo(video)} style={{ background: 'none', border: 'none', color: 'blue', marginRight: '12px', cursor: 'pointer' }}><Edit2 size={16} /></button>
                          <button onClick={() => handleDeleteVideo(video.id!)} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}><Trash2 size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </motion.div>
        )}

        {/* ==============================================================
            TAB 3: STAGES & RDV (CRUD SESSIONS & INSCRIPTIONS)
        ============================================================== */}
        {activeTab === 'stages' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', margin: 0 }}>Gestion des Stages & Inscriptions</h2>
                <p style={{ color: 'var(--clr-gray)', margin: '5px 0 0' }}>Créez et gérez les sessions de stage de vacances et consultez les pré-inscriptions reçues.</p>
              </div>
              <button 
                onClick={() => setEditingStage({ title: '', dates: '', categories: 'U11 à U17', price: '1,500 HTG', time_schedule: '08:00 AM - 12:00 PM', description: '', is_active: true })} 
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Plus size={18} /> Créer une Session de Stage
              </button>
            </div>

            {editingStage ? (
              <form onSubmit={handleSaveStage} style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #eee', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>{editingStage.id ? 'Modifier la Session' : 'Nouvelle Session de Stage'}</h3>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.2rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px' }}>Titre du Stage *</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Stage d'Été Condor - Session 1" 
                      value={editingStage.title} 
                      onChange={e => setEditingStage({ ...editingStage, title: e.target.value })} 
                      required 
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px' }}>Dates du stage *</label>
                    <input 
                      type="text" 
                      placeholder="Ex: 15 Juillet - 25 Juillet 2026" 
                      value={editingStage.dates} 
                      onChange={e => setEditingStage({ ...editingStage, dates: e.target.value })} 
                      required 
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} 
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.2rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px' }}>Catégories d'âges</label>
                    <input 
                      type="text" 
                      placeholder="Ex: U11 à U15" 
                      value={editingStage.categories} 
                      onChange={e => setEditingStage({ ...editingStage, categories: e.target.value })} 
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px' }}>Tarif / Prix</label>
                    <input 
                      type="text" 
                      placeholder="Ex: 1,500 HTG" 
                      value={editingStage.price} 
                      onChange={e => setEditingStage({ ...editingStage, price: e.target.value })} 
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px' }}>Horaires</label>
                    <input 
                      type="text" 
                      placeholder="Ex: 08:00 AM - 12:00 PM" 
                      value={editingStage.time_schedule} 
                      onChange={e => setEditingStage({ ...editingStage, time_schedule: e.target.value })} 
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} 
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px' }}>Description du programme</label>
                  <textarea 
                    value={editingStage.description} 
                    onChange={e => setEditingStage({ ...editingStage, description: e.target.value })} 
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', minHeight: '90px' }} 
                    placeholder="Programme axé sur le perfectionnement technique, tactique..."
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="submit" className="btn btn-primary">Enregistrer la session</button>
                  <button type="button" onClick={() => setEditingStage(null)} className="btn btn-outline" style={{ color: 'black', borderColor: '#ddd' }}>Annuler</button>
                </div>
              </form>
            ) : null}

            {/* Sessions de Stage List */}
            <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #eee', marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Sessions Actives</h3>
              {stages.length === 0 ? (
                <p style={{ color: '#666', padding: '1rem 0' }}>Aucune session de stage n'est configurée. Créez une session ci-dessus pour la publier sur la page publique des stages.</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                  {stages.map(st => (
                    <div key={st.id} style={{ background: '#fafafa', border: '1px solid #eee', borderRadius: '8px', padding: '1.5rem', borderLeft: '4px solid var(--clr-primary)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <h4 style={{ margin: 0, fontSize: '1.15rem' }}>{st.title}</h4>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => setEditingStage(st)} style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}><Edit2 size={16} /></button>
                          <button onClick={() => handleDeleteStage(st.id!)} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}><Trash2 size={16} /></button>
                        </div>
                      </div>
                      <p style={{ margin: '4px 0', fontSize: '0.9rem', color: '#666' }}><strong>Dates :</strong> {st.dates}</p>
                      <p style={{ margin: '4px 0', fontSize: '0.9rem', color: '#666' }}><strong>Horaires :</strong> {st.time_schedule} | <strong>Âges :</strong> {st.categories}</p>
                      <p style={{ margin: '4px 0', fontSize: '0.95rem', color: 'var(--clr-primary)', fontWeight: 'bold' }}>{st.price}</p>
                      <p style={{ margin: '8px 0 0', fontSize: '0.85rem', color: '#444' }}>{st.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Inscriptions aux Stages */}
            <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #eee', marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Pré-inscriptions Reçues</h3>
              {stageRegistrations.length === 0 ? (
                <p style={{ color: '#666' }}>Aucune inscription trouvée.</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#f5f7fa', borderBottom: '1px solid #eee' }}>
                      <th style={{ padding: '10px' }}>Enfant</th>
                      <th style={{ padding: '10px' }}>Date Naissance</th>
                      <th style={{ padding: '10px' }}>Téléphone</th>
                      <th style={{ padding: '10px' }}>Stage Souhaité</th>
                      <th style={{ padding: '10px', textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stageRegistrations.map(reg => (
                      <tr key={reg.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '10px', fontWeight: 'bold' }}>{reg.nom} {reg.prenom}</td>
                        <td style={{ padding: '10px' }}>{reg.dob}</td>
                        <td style={{ padding: '10px' }}>{reg.tel}</td>
                        <td style={{ padding: '10px' }}>{reg.stage}</td>
                        <td style={{ padding: '10px', textAlign: 'right' }}>
                          <button onClick={() => handleDeleteStageRegistration(reg.id)} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}><Trash2 size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Rendez-vous Administratifs */}
            <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #eee' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Rendez-vous Administratifs</h3>
              {appointments.length === 0 ? (
                <p style={{ color: '#666' }}>Aucun rendez-vous planifié.</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#f5f7fa', borderBottom: '1px solid #eee' }}>
                      <th style={{ padding: '10px' }}>Parent</th>
                      <th style={{ padding: '10px' }}>Enfant</th>
                      <th style={{ padding: '10px' }}>Téléphone</th>
                      <th style={{ padding: '10px' }}>Date & Heure</th>
                      <th style={{ padding: '10px' }}>Motif</th>
                      <th style={{ padding: '10px', textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map(rdv => (
                      <tr key={rdv.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '10px', fontWeight: 'bold' }}>{rdv.parent_nom || rdv.parentNom}</td>
                        <td style={{ padding: '10px' }}>{rdv.enfant_nom || rdv.enfantNom}</td>
                        <td style={{ padding: '10px' }}>{rdv.tel}</td>
                        <td style={{ padding: '10px', color: 'var(--clr-primary)', fontWeight: 'bold' }}>{rdv.date} à {rdv.heure}</td>
                        <td style={{ padding: '10px' }}>{rdv.raison}</td>
                        <td style={{ padding: '10px', textAlign: 'right' }}>
                          <button onClick={() => handleDeleteAppointment(rdv.id)} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}><Trash2 size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </motion.div>
        )}

        {/* ==============================================================
            TAB 4: BOUTIQUE OFFICIELLE (CRUD PRODUITS)
        ============================================================== */}
        {activeTab === 'shop' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', margin: 0 }}>Gestion de la Boutique</h2>
                <p style={{ color: 'var(--clr-gray)', margin: '5px 0 0' }}>Ajoutez, modifiez ou supprimez les maillots et équipements officiels mis en vente.</p>
              </div>
              <button 
                onClick={() => setEditingProduct({ id: `item-${Date.now()}`, title: '', category: 'match', price: 65, tag: 'NOUVEAU', img: '/shop/kit_officiel_polo_condor.png', description: '', sizes: ['S', 'M', 'L', 'XL'] })} 
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Plus size={18} /> Ajouter un Article
              </button>
            </div>

            {editingProduct ? (
              <form onSubmit={handleSaveProduct} style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #eee', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>{editingProduct.id ? 'Éditer l\'Article' : 'Nouvel Article'}</h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px' }}>Identifiant Référence *</label>
                    <input 
                      type="text" 
                      value={editingProduct.id} 
                      onChange={e => setEditingProduct({ ...editingProduct, id: e.target.value })} 
                      required 
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px' }}>Titre du Produit *</label>
                    <input 
                      type="text" 
                      value={editingProduct.title} 
                      onChange={e => setEditingProduct({ ...editingProduct, title: e.target.value })} 
                      required 
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px' }}>Catégorie</label>
                    <select 
                      value={editingProduct.category} 
                      onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value as any })} 
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                    >
                      <option value="match">Match / Tenue Officielle</option>
                      <option value="training">Entraînement</option>
                      <option value="accessories">Accessoires</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px' }}>Prix ($ USD) *</label>
                    <input 
                      type="number" 
                      value={editingProduct.price} 
                      onChange={e => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })} 
                      required 
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} 
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.2rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px' }}>Badge / Tag</label>
                    <input 
                      type="text" 
                      placeholder="Ex: DOMICILE, TOP VENTE" 
                      value={editingProduct.tag || ''} 
                      onChange={e => setEditingProduct({ ...editingProduct, tag: e.target.value })} 
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px' }}>Photo du Produit</label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      {editingProduct.img && (
                        <img src={editingProduct.img} style={{ width: '50px', height: '50px', objectFit: 'contain', borderRadius: '4px', border: '1px solid #eee' }} alt="Aperçu" />
                      )}
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const base64 = await convertToBase64(file);
                            setEditingProduct({ ...editingProduct, img: base64 });
                          }
                        }} 
                        style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} 
                      />
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px' }}>Description</label>
                  <textarea 
                    value={editingProduct.description || ''} 
                    onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })} 
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', minHeight: '80px' }} 
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="submit" className="btn btn-primary">Enregistrer l'article</button>
                  <button type="button" onClick={() => setEditingProduct(null)} className="btn btn-outline" style={{ color: 'black', borderColor: '#ddd' }}>Annuler</button>
                </div>
              </form>
            ) : null}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
              {products.map(prod => (
                <div key={prod.id} style={{ background: 'white', borderRadius: '12px', border: '1px solid #eee', padding: '1.5rem', textAlign: 'center', position: 'relative' }}>
                  <img src={prod.img} style={{ height: '180px', width: '100%', objectFit: 'contain', marginBottom: '1rem' }} alt={prod.title} />
                  <span style={{ background: 'var(--clr-gray-light)', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>{prod.tag || prod.category}</span>
                  <h4 style={{ margin: '10px 0 5px', fontSize: '1.1rem' }}>{prod.title}</h4>
                  <div style={{ color: 'var(--clr-primary)', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '1rem' }}>{prod.formatted_price || `${prod.price}.00 $`}</div>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button onClick={() => setEditingProduct(prod)} className="btn btn-outline" style={{ padding: '6px 14px', fontSize: '0.85rem', color: 'black', borderColor: '#ddd' }}><Edit2 size={14} /> Éditer</button>
                    <button onClick={() => handleDeleteProduct(prod.id)} className="btn btn-outline" style={{ padding: '6px 14px', fontSize: '0.85rem', color: 'red', borderColor: '#ffcccc' }}><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ==============================================================
            TAB 5: ACTUALITÉS (NEWS CRUD)
        ============================================================== */}
        {activeTab === 'news' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem' }}>Gestion des Actualités</h2>
              <button 
                onClick={() => setEditingNews({ title: '', desc_text: '', cat: 'Match', img: '/player_action_1_1780681882713.png' })} 
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Plus size={18} /> Créer un Article
              </button>
            </div>

            {editingNews ? (
              <form onSubmit={handleSaveNews} style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #eee', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>{editingNews.id ? 'Modifier l\'Article' : 'Nouveau Communiqué'}</h3>
                
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '5px' }}>Titre</label>
                  <input type="text" value={editingNews.title} onChange={e => setEditingNews({...editingNews, title: e.target.value})} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '5px' }}>Catégorie</label>
                    <select value={editingNews.cat} onChange={e => setEditingNews({...editingNews, cat: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}>
                      <option value="Match">Match</option>
                      <option value="Transferts">Transferts</option>
                      <option value="Entraînement">Entraînement</option>
                      <option value="Récompense">Récompense</option>
                      <option value="Académie">Académie</option>
                      <option value="Club">Club</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '5px' }}>Photo de l'article</label>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                      {editingNews.img && (
                        <img src={editingNews.img} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #ddd' }} alt="Aperçu" />
                      )}
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const base64 = await convertToBase64(file);
                            setEditingNews({...editingNews, img: base64});
                          }
                        }}
                        style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '5px' }}>Contenu / Description</label>
                  <textarea value={editingNews.desc_text || editingNews.desc || ''} onChange={e => setEditingNews({...editingNews, desc_text: e.target.value})} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', minHeight: '120px' }} />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="submit" className="btn btn-primary">Enregistrer l'article</button>
                  <button type="button" onClick={() => setEditingNews(null)} className="btn btn-outline" style={{ color: 'black', borderColor: '#ddd' }}>Annuler</button>
                </div>
              </form>
            ) : null}

            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #eee', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#f5f7fa', borderBottom: '1px solid #eee' }}>
                    <th style={{ padding: '15px' }}>Image</th>
                    <th style={{ padding: '15px' }}>Titre</th>
                    <th style={{ padding: '15px' }}>Catégorie</th>
                    <th style={{ padding: '15px' }}>Date</th>
                    <th style={{ padding: '15px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {newsList.map(news => (
                    <tr key={news.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '15px' }}><img src={news.img} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} alt="news" /></td>
                      <td style={{ padding: '15px', fontWeight: 'bold' }}>{news.title}</td>
                      <td style={{ padding: '15px' }}><span style={{ background: '#eee', padding: '3px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>{news.cat}</span></td>
                      <td style={{ padding: '15px', color: '#666' }}>{news.date}</td>
                      <td style={{ padding: '15px', textAlign: 'right' }}>
                        <button onClick={() => setEditingNews(news)} style={{ background: 'none', border: 'none', color: 'blue', marginRight: '10px', cursor: 'pointer' }}><Edit2 size={16} /></button>
                        <button onClick={() => handleDeleteNews(news.id)} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* ==============================================================
            TAB 6: ÉQUIPE & JOUEURS (FULL CRUD)
        ============================================================== */}
        {activeTab === 'players' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', margin: 0 }}>Roster & Joueurs</h2>
                <p style={{ color: 'var(--clr-gray)', margin: '5px 0 0' }}>Ajoutez de nouveaux joueurs, mettez à jour leurs statistiques ou supprimez des fiches.</p>
              </div>
              <button 
                onClick={() => {
                  setCreatingPlayer(true);
                  setEditingPlayer({
                    id: (Date.now() % 10000).toString(),
                    name: '',
                    num: 10,
                    pos: 'Attaquant',
                    category: 'U17',
                    height: '1.75m',
                    weight: '68kg',
                    foot: 'Droit',
                    dob: '',
                    nationality: 'Haïtienne',
                    pob: 'Haiti',
                    bio: '',
                    img: '/condor_logo_transparent.png'
                  });
                }} 
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Plus size={18} /> Ajouter un Nouveau Joueur
              </button>
            </div>

            {editingPlayer ? (
              <form onSubmit={handleSavePlayer} style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #eee', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>{creatingPlayer ? 'Ajouter un Joueur' : `Modifier : ${editingPlayer.name}`}</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '5px' }}>Nom complet *</label>
                    <input type="text" value={editingPlayer.name} onChange={e => setEditingPlayer({...editingPlayer, name: e.target.value})} required style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '5px' }}>Numéro de maillot *</label>
                    <input type="number" value={editingPlayer.num} onChange={e => setEditingPlayer({...editingPlayer, num: e.target.value})} required style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '5px' }}>Poste *</label>
                    <input type="text" value={editingPlayer.pos} onChange={e => setEditingPlayer({...editingPlayer, pos: e.target.value})} required style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '5px' }}>Catégorie</label>
                    <select value={editingPlayer.category} onChange={e => setEditingPlayer({...editingPlayer, category: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}>
                      <option value="Équipe Première">Équipe Première</option>
                      <option value="U17">U17</option>
                      <option value="U15">U15</option>
                      <option value="U13">U13</option>
                      <option value="U9">U9</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '5px' }}>Date de naissance</label>
                    <input type="text" placeholder="JJ/MM/AAAA" value={editingPlayer.dob || ''} onChange={e => setEditingPlayer({...editingPlayer, dob: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '5px' }}>Taille</label>
                    <input type="text" value={editingPlayer.height || ''} onChange={e => setEditingPlayer({...editingPlayer, height: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '5px' }}>Poids</label>
                    <input type="text" value={editingPlayer.weight || ''} onChange={e => setEditingPlayer({...editingPlayer, weight: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '5px' }}>Pied Fort</label>
                    <input type="text" value={editingPlayer.foot || 'Droit'} onChange={e => setEditingPlayer({...editingPlayer, foot: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '5px' }}>Photo Profil (Carte du Roster)</label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      {editingPlayer.img && <img src={editingPlayer.img} style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover' }} alt="thumb" />}
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const base64 = await convertToBase64(file);
                            setEditingPlayer({...editingPlayer, img: base64});
                          }
                        }} 
                        style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} 
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '5px' }}>Photo Célébration (Page Détail Joueur)</label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      {(editingPlayer.detail_img || editingPlayer.detailImg) && <img src={editingPlayer.detail_img || editingPlayer.detailImg} style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover' }} alt="thumb" />}
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const base64 = await convertToBase64(file);
                            setEditingPlayer({...editingPlayer, detail_img: base64, detailImg: base64});
                          }
                        }} 
                        style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} 
                      />
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '5px' }}>Biographie</label>
                  <textarea value={editingPlayer.bio || ''} onChange={e => setEditingPlayer({...editingPlayer, bio: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd', minHeight: '80px' }} />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="submit" className="btn btn-primary">Enregistrer le Joueur</button>
                  <button type="button" onClick={() => { setEditingPlayer(null); setCreatingPlayer(false); }} className="btn btn-outline" style={{ color: 'black', borderColor: '#ddd' }}>Annuler</button>
                </div>
              </form>
            ) : null}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {Object.values(players).map((player: any) => (
                <div key={player.id} style={{ background: 'white', borderRadius: '12px', border: '1px solid #eee', padding: '1.5rem', display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <img src={player.img} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }} alt={player.name} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{player.name}</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--clr-primary)', fontWeight: 'bold' }}>#{player.num} - {player.category}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => { setEditingPlayer(player); setCreatingPlayer(false); }} style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}><Edit2 size={16} /></button>
                    <button onClick={() => handleDeletePlayer(player.id, player.name)} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ==============================================================
            TAB 7: INSCRIPTIONS ANNUELLES
        ============================================================== */}
        {activeTab === 'inscriptions' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: '1.5rem' }}>Inscriptions Annuelles</h2>
            <p style={{ color: 'var(--clr-gray)', marginBottom: '2rem' }}>Consultez et gérez les formulaires d'inscriptions annuels complets reçus.</p>

            {selectedInscription ? (
              <div style={{ background: 'white', padding: '2.5rem', borderRadius: '12px', border: '1px solid #eee', marginBottom: '2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--clr-primary)', paddingBottom: '10px', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.5rem', margin: 0, fontWeight: 'bold' }}>
                    Dossier d'inscription : {selectedInscription.enfant_nom} {selectedInscription.enfant_prenom}
                  </h3>
                  <button onClick={() => setSelectedInscription(null)} className="btn btn-outline" style={{ color: 'black', borderColor: '#ddd', padding: '6px 12px' }}>Fermer</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  <div>
                    <h4 style={{ color: 'var(--clr-primary)', fontWeight: 'bold', borderBottom: '1px solid #eee', paddingBottom: '5px', marginBottom: '10px' }}>1. Informations Enfant</h4>
                    <p><strong>Nom & Prénom:</strong> {selectedInscription.form_data?.enfantNom} {selectedInscription.form_data?.enfantPrenom}</p>
                    <p><strong>Date de naissance:</strong> {selectedInscription.form_data?.enfantDateNaissance}</p>
                    <p><strong>Sexe:</strong> {selectedInscription.form_data?.enfantSexe || 'N/A'}</p>
                    <p><strong>Téléphones:</strong> {selectedInscription.form_data?.enfantTelephones || 'N/A'}</p>
                    <p><strong>Adresse:</strong> {selectedInscription.form_data?.enfantAdresse}</p>

                    <h4 style={{ color: 'var(--clr-primary)', fontWeight: 'bold', borderBottom: '1px solid #eee', paddingBottom: '5px', marginBottom: '10px', marginTop: '1.5rem' }}>2. Parent Responsable</h4>
                    <p><strong>Nom & Prénom:</strong> {selectedInscription.form_data?.parentNom} {selectedInscription.form_data?.parentPrenom}</p>
                    <p><strong>WhatsApp:</strong> {selectedInscription.form_data?.parentWhatsapp}</p>
                    <p><strong>Téléphones:</strong> {selectedInscription.form_data?.parentTelephones}</p>
                    <p><strong>Courriel:</strong> {selectedInscription.form_data?.parentCourriel}</p>
                  </div>

                  <div>
                    <h4 style={{ color: 'var(--clr-primary)', fontWeight: 'bold', borderBottom: '1px solid #eee', paddingBottom: '5px', marginBottom: '10px' }}>3. Plan & Sport</h4>
                    <p><strong>Plan d'adhésion:</strong> <span style={{ color: 'var(--clr-primary)', fontWeight: 'bold' }}>{selectedInscription.form_data?.planAdhesion}</span></p>
                    <p><strong>Position:</strong> {selectedInscription.form_data?.position || 'N/A'}</p>
                    <p><strong>Uniforme désiré:</strong> {selectedInscription.form_data?.uniformeDesire || 'N/A'}</p>
                    
                    <h4 style={{ color: 'var(--clr-primary)', fontWeight: 'bold', borderBottom: '1px solid #eee', paddingBottom: '5px', marginBottom: '10px', marginTop: '1.5rem' }}>4. Médical & Consentement</h4>
                    <p><strong>Allergies:</strong> {selectedInscription.form_data?.allergies || 'Aucune'}</p>
                    <p><strong>Signature:</strong> {selectedInscription.form_data?.signatureParent} le {selectedInscription.form_data?.dateSignature}</p>
                  </div>
                </div>
              </div>
            ) : null}

            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #eee', overflow: 'hidden' }}>
              {inscriptions.length === 0 ? (
                <p style={{ padding: '2rem', color: '#666', textAlign: 'center' }}>Aucune inscription trouvée.</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#f5f7fa', borderBottom: '1px solid #eee' }}>
                      <th style={{ padding: '15px' }}>Enfant</th>
                      <th style={{ padding: '15px' }}>Date Naissance</th>
                      <th style={{ padding: '15px' }}>Parent</th>
                      <th style={{ padding: '15px' }}>Téléphone</th>
                      <th style={{ padding: '15px' }}>Plan</th>
                      <th style={{ padding: '15px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inscriptions.map((ins) => (
                      <tr key={ins.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '15px', fontWeight: 'bold' }}>{ins.enfant_nom} {ins.enfant_prenom}</td>
                        <td style={{ padding: '15px' }}>{ins.enfant_dob}</td>
                        <td style={{ padding: '15px' }}>{ins.parent_nom} {ins.parent_prenom}</td>
                        <td style={{ padding: '15px' }}>{ins.parent_tel}</td>
                        <td style={{ padding: '15px' }}>
                          <span style={{ background: 'var(--clr-gray-light)', color: 'var(--clr-primary)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                            {ins.form_data?.planAdhesion?.split(':')[0] || 'Standard'}
                          </span>
                        </td>
                        <td style={{ padding: '15px', textAlign: 'right' }}>
                          <button onClick={() => { setSelectedInscription(ins); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="btn btn-outline" style={{ padding: '5px 10px', fontSize: '0.85rem', marginRight: '10px', color: 'black', borderColor: '#ddd' }}>Voir Dossier</button>
                          <button onClick={() => handleDeleteInscription(ins.id)} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}><Trash2 size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </motion.div>
        )}

        {/* ==============================================================
            TAB 8: SUPPORTERS
        ============================================================== */}
        {activeTab === 'supporters' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: '1.5rem' }}>Liste des Supporters</h2>
            
            <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #eee' }}>
              {supporters.length === 0 ? (
                <p style={{ color: '#666' }}>Aucun supporter enregistré.</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#f5f7fa', borderBottom: '1px solid #eee' }}>
                      <th style={{ padding: '15px' }}>Nom</th>
                      <th style={{ padding: '15px' }}>Adresse E-mail</th>
                      <th style={{ padding: '15px' }}>Alertes activées</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supporters.map((sup, idx) => (
                      <tr key={sup.id || idx} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '15px', fontWeight: 'bold' }}>{sup.name}</td>
                        <td style={{ padding: '15px' }}>{sup.email}</td>
                        <td style={{ padding: '15px', color: 'green', fontWeight: 'bold' }}>
                          {sup.notify_goals ? '✓ Buts ' : ''}
                          {sup.notify_match_start ? '✓ Matchs ' : ''}
                          {sup.notify_news ? '✓ Actus' : ''}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </motion.div>
        )}

      </main>
    </div>
  );
}

function AdminLoginGate({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (email !== 'admin@gmail.com') {
      setError("Cet e-mail n'est pas autorisé à accéder à l'administration.");
      setLoading(false);
      return;
    }

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(translateAuthError(authError.message));
    } else {
      onLoginSuccess();
    }
    setLoading(false);
  };

  return (
    <div style={{ flex: 1, marginTop: '80px', background: '#f8f9fa', minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ background: 'white', borderRadius: '16px', padding: '3rem', boxShadow: '0 15px 35px rgba(0,0,0,0.08)', maxWidth: '450px', width: '100%', border: '1px solid #eee', color: 'black' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(202, 2, 79, 0.1)', color: 'var(--clr-primary)', marginBottom: '1rem', justifyContent: 'center' }}>
            <Award size={32} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', margin: 0, color: 'var(--clr-primary)' }}>PORTAIL ADMIN</h2>
          <p style={{ color: 'var(--clr-gray)', marginTop: '5px' }}>Connexion sécurisée</p>
        </div>

        {error && (
          <div style={{ background: '#f8d7da', color: '#721c24', padding: '12px', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center', fontWeight: 'bold' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px', color: 'var(--clr-gray)' }}>Adresse E-mail Administrateur</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              style={{ width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.03)', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', outline: 'none' }} 
              placeholder="admin@gmail.com" 
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px', color: 'var(--clr-gray)' }}>Mot de Passe</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              style={{ width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.03)', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', outline: 'none' }} 
              placeholder="••••••••" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '1.1rem', cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link href="/" style={{ color: 'var(--clr-gray)', textDecoration: 'none', fontSize: '0.9rem' }}>← Retour à l'accueil</Link>
        </div>
      </div>
    </div>
  );
}
