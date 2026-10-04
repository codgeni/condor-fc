"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, Users, Calendar, BookOpen, Image, 
  Trash2, Plus, Edit2, CheckCircle, LogOut, Award, Upload,
  Tv, ShoppingBag, Trophy, CheckSquare, Square, Eye, EyeOff,
  Radio, Shield, Clock, MapPin, Save, X, Menu,
  UserCheck, History, Type, ArrowRightLeft,
  Printer, PhoneCall, Mail, MessageSquare, AlertCircle, FileText, Search, ExternalLink, Activity, HeartPulse, ShieldAlert
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { playersDB } from '@/lib/playersDB';
import { 
  fetchCurrentMatch, saveMatchConfig, MatchConfig,
  fetchVideos, saveVideo, deleteVideo, VideoItem, parseVideoUrl,
  fetchStages, saveStage, deleteStage, StageSession,
  fetchProducts, saveProduct, deleteProduct, ShopProduct,
  savePlayerRecord, deletePlayerRecord,
  fetchUnits, UnitItem,
  fetchRoles, RoleItem,
  fetchStaff, StaffMember,
  fetchTimeline, TimelineItem,
  fetchSiteContent, SiteContent, DEFAULT_SITE_CONTENT,
  fetchMergedPlayers
} from '@/lib/dataService';
import { validateUploadFile, sanitizeFormRecord } from '@/lib/security';

import UnitsManager from '@/components/admin/UnitsManager';
import RolesManager from '@/components/admin/RolesManager';
import StaffManager from '@/components/admin/StaffManager';
import TimelineManager from '@/components/admin/TimelineManager';
import SiteTextsManager from '@/components/admin/SiteTextsManager';
import PlayersManager from '@/components/admin/PlayersManager';
import ShopManager from '@/components/admin/ShopManager';
import { useConfirmPoster } from '@/components/ui/ConfirmPosterModal';

const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Validation de sécurité : taille max 10 Mo et type MIME d'image certifié
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
  const { showConfirmed, askConfirm } = useConfirmPoster();
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
  const [selectedStageRegistration, setSelectedStageRegistration] = useState<any>(null);
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
  const [inscriptionSearch, setInscriptionSearch] = useState('');
  const [supporters, setSupporters] = useState<any[]>([]);

  // 8. Units, Roles, Staff, Timeline, Site Content States
  const [units, setUnits] = useState<UnitItem[]>([]);
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);

  const showToast = (msg: string) => {
    showConfirmed(msg);
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

    // 6. Fetch Players (Merged with Supabase & local cache, excluding deleted players)
    const mergedPlayers = await fetchMergedPlayers();
    if (mergedPlayers) setPlayers(mergedPlayers);

    // 7. Fetch Units, Roles, Staff, Timeline, Site Content
    const [unitsData, rolesData, staffData, timelineData, siteContentData] = await Promise.all([
      fetchUnits(),
      fetchRoles(),
      fetchStaff(),
      fetchTimeline(),
      fetchSiteContent()
    ]);

    if (unitsData) setUnits(unitsData);
    if (rolesData) setRoles(rolesData);
    if (staffData) setStaff(staffData);
    if (timelineData) setTimeline(timelineData);
    if (siteContentData) setSiteContent(siteContentData);

    // 8. Fetch Inscriptions & Supporters
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

  const handleDeleteVideo = (id: number | string) => {
    askConfirm({
      title: 'SUPPRIMER LA VIDÉO',
      message: 'Voulez-vous vraiment supprimer cette vidéo de Condor TV ?',
      confirmLabel: 'OUI, SUPPRIMER',
      onConfirm: async () => {
        await deleteVideo(id);
        showToast('Vidéo supprimée avec succès.');
        fetchData();
      }
    });
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

  const handleDeleteStage = (id: number | string) => {
    askConfirm({
      title: 'SUPPRIMER LA SESSION',
      message: 'Voulez-vous vraiment supprimer cette session de stage ?',
      confirmLabel: 'OUI, SUPPRIMER',
      onConfirm: async () => {
        await deleteStage(id);
        showToast('Session de stage supprimée avec succès.');
        fetchData();
      }
    });
  };

  const handleDeleteStageRegistration = (id: number) => {
    askConfirm({
      title: 'SUPPRIMER LA PRÉ-INSCRIPTION',
      message: 'Supprimer définitivement cette pré-inscription ?',
      confirmLabel: 'OUI, SUPPRIMER',
      onConfirm: async () => {
        await supabase.from('stages_inscriptions').delete().eq('id', id);
        showToast('Pré-inscription supprimée.');
        fetchData();
      }
    });
  };

  const handleDeleteAppointment = (id: number) => {
    askConfirm({
      title: 'SUPPRIMER LE RENDEZ-VOUS',
      message: 'Supprimer ce rendez-vous administratif ?',
      confirmLabel: 'OUI, SUPPRIMER',
      onConfirm: async () => {
        await supabase.from('appointments').delete().eq('id', id);
        showToast('Rendez-vous supprimé.');
        fetchData();
      }
    });
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

  const handleDeleteNews = (id: number) => {
    askConfirm({
      title: "SUPPRIMER L'ACTUALITÉ",
      message: 'Voulez-vous vraiment supprimer cet article de presse ?',
      confirmLabel: 'OUI, SUPPRIMER',
      onConfirm: async () => {
        const { error } = await supabase.from('news').delete().eq('id', id);
        if (error) {
          showToast("Impossible de supprimer l'article.");
        } else {
          showToast('Article supprimé avec succès.');
          fetchData();
        }
      }
    });
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

  const handleDeletePlayer = (id: string, name: string) => {
    askConfirm({
      title: 'SUPPRIMER LE JOUEUR',
      message: `Confirmez-vous la suppression définitive du profil de ${name} (#${id}) ?\nCette action retirera sa fiche de l'effectif.`,
      confirmLabel: 'OUI, SUPPRIMER',
      onConfirm: async () => {
        const res = await deletePlayerRecord(id);
        if (res.success) {
          showToast(`Joueur ${name} supprimé avec succès.`);
          fetchData();
        } else {
          showToast(res.error || 'Erreur lors de la suppression.');
        }
      }
    });
  };

  // -------------------------------------------------------------
  // INSCRIPTIONS HANDLERS
  // -------------------------------------------------------------
  const handleDeleteInscription = (id: number) => {
    askConfirm({
      title: "SUPPRIMER L'INSCRIPTION",
      message: 'Voulez-vous vraiment supprimer définitivement ce dossier d\'inscription ?',
      confirmLabel: 'OUI, SUPPRIMER',
      onConfirm: async () => {
        const { error } = await supabase.from('inscriptions').delete().eq('id', id);
        if (!error) {
          showToast('Dossier d\'inscription supprimé.');
          fetchData();
        }
      }
    });
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
    <div className="admin-container" style={{ flex: 1, marginTop: '80px', display: 'flex', height: 'calc(100vh - 80px)', maxHeight: 'calc(100vh - 80px)', overflow: 'hidden', background: '#f5f7fa', color: 'var(--clr-black)', position: 'relative' }}>
      
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
          flexShrink: 0,
          height: 'calc(100vh - 80px)',
          maxHeight: 'calc(100vh - 80px)',
          overflowY: 'auto',
          overflowX: 'hidden'
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
          { id: 'units', label: 'Unités & Catégories', icon: <Shield size={18} /> },
          { id: 'roles', label: 'Rôles & Postes', icon: <Award size={18} /> },
          { id: 'players', label: 'Équipe & Joueurs', icon: <Users size={18} /> },
          { id: 'staff', label: 'Staff & Encadrement', icon: <UserCheck size={18} /> },
          { id: 'timeline', label: 'Palmarès & Parcours', icon: <History size={18} /> },
          { id: 'site_texts', label: 'Textes & Clauses du Site', icon: <Type size={18} /> },
          { id: 'news', label: 'Actualités', icon: <BookOpen size={18} /> },
          { id: 'tv', label: 'Condor TV (Vidéos)', icon: <Tv size={18} /> },
          { id: 'stages', label: 'Stages & RDV', icon: <Calendar size={18} /> },
          { id: 'shop', label: 'Boutique Officielle', icon: <ShoppingBag size={18} /> },
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
      <main className="admin-main-content" style={{ flex: 1, padding: '2.5rem 3rem', height: 'calc(100vh - 80px)', maxHeight: 'calc(100vh - 80px)', overflowY: 'auto' }}>

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

            {/* Modal Détails Pré-inscription au Stage */}
            {selectedStageRegistration && (
              <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '2px solid var(--clr-primary)', marginBottom: '2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '12px', marginBottom: '1.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.4rem', margin: 0, fontWeight: 'bold' }}>
                      Pré-inscription : {selectedStageRegistration.nom} {selectedStageRegistration.prenom}
                    </h3>
                    <span style={{ fontSize: '0.85rem', color: '#666' }}>
                      Reçue le {selectedStageRegistration.created_at ? new Date(selectedStageRegistration.created_at).toLocaleString('fr-FR') : 'N/A'}
                    </span>
                  </div>
                  <button onClick={() => setSelectedStageRegistration(null)} className="btn btn-outline" style={{ color: 'black', borderColor: '#ddd', padding: '6px 12px' }}>Fermer</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <p style={{ marginBottom: '8px' }}><strong>Enfant :</strong> {selectedStageRegistration.nom} {selectedStageRegistration.prenom}</p>
                    <p style={{ marginBottom: '8px' }}><strong>Date de naissance :</strong> {selectedStageRegistration.dob} {selectedStageRegistration.dob ? `(${new Date().getFullYear() - new Date(selectedStageRegistration.dob).getFullYear()} ans)` : ''}</p>
                    <p style={{ marginBottom: '8px' }}><strong>Session de Stage :</strong> <span style={{ color: 'var(--clr-primary)', fontWeight: 'bold' }}>{selectedStageRegistration.stage}</span></p>
                  </div>
                  <div>
                    <p style={{ marginBottom: '8px' }}><strong>Téléphone Responsable :</strong> {selectedStageRegistration.tel}</p>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                      <a href={`tel:${selectedStageRegistration.tel}`} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.85rem', color: 'black', borderColor: '#ccc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <PhoneCall size={14} /> Appeler
                      </a>
                      <a href={`https://wa.me/${selectedStageRegistration.tel?.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.85rem', color: '#16a34a', borderColor: '#16a34a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MessageSquare size={14} /> WhatsApp
                      </a>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '1.5rem', background: '#fefce8', border: '1px solid #fde047', borderRadius: '8px', padding: '15px' }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '0.95rem', color: '#854d0e', fontWeight: 'bold' }}>Remarques, Besoins Particuliers & Allergies :</h4>
                  <p style={{ margin: 0, color: '#713f12', fontStyle: selectedStageRegistration.note ? 'normal' : 'italic' }}>
                    {selectedStageRegistration.note || "Aucune remarque ou besoin particulier signalé."}
                  </p>
                </div>
              </div>
            )}

            {/* Inscriptions aux Stages */}
            <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #eee', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                <h3 style={{ fontSize: '1.3rem', margin: 0 }}>Pré-inscriptions aux Stages ({stageRegistrations.length})</h3>
                <span style={{ fontSize: '0.85rem', color: '#666' }}>Données chiffrées & protégées</span>
              </div>
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
                      <th style={{ padding: '10px' }}>Remarques</th>
                      <th style={{ padding: '10px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stageRegistrations.map(reg => (
                      <tr key={reg.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '10px', fontWeight: 'bold' }}>{reg.nom} {reg.prenom}</td>
                        <td style={{ padding: '10px' }}>{reg.dob}</td>
                        <td style={{ padding: '10px' }}>
                          <a href={`tel:${reg.tel}`} style={{ color: 'var(--clr-primary)', textDecoration: 'none' }}>{reg.tel}</a>
                        </td>
                        <td style={{ padding: '10px' }}>
                          <span style={{ background: 'rgba(202, 2, 79, 0.08)', color: 'var(--clr-primary)', padding: '3px 8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                            {reg.stage}
                          </span>
                        </td>
                        <td style={{ padding: '10px', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#666', fontSize: '0.85rem' }}>
                          {reg.note ? reg.note : <span style={{ color: '#aaa', fontStyle: 'italic' }}>Aucune</span>}
                        </td>
                        <td style={{ padding: '10px', textAlign: 'right' }}>
                          <button onClick={() => setSelectedStageRegistration(reg)} className="btn btn-outline" style={{ padding: '4px 8px', fontSize: '0.8rem', marginRight: '8px', color: 'black', borderColor: '#ccc' }}>
                            Détails
                          </button>
                          <button onClick={() => handleDeleteStageRegistration(reg.id)} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }} title="Supprimer">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Rendez-vous Administratifs */}
            <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #eee' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                <h3 style={{ fontSize: '1.3rem', margin: 0 }}>Rendez-vous Administratifs ({appointments.length})</h3>
                <span style={{ fontSize: '0.85rem', color: '#666' }}>Gestion des entrevues au club</span>
              </div>
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
                      <th style={{ padding: '10px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map(rdv => (
                      <tr key={rdv.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '10px', fontWeight: 'bold' }}>{rdv.parent_nom || rdv.parentNom}</td>
                        <td style={{ padding: '10px' }}>{rdv.enfant_nom || rdv.enfantNom}</td>
                        <td style={{ padding: '10px' }}>
                          <a href={`tel:${rdv.tel}`} style={{ color: 'var(--clr-primary)', textDecoration: 'none' }}>{rdv.tel}</a>
                        </td>
                        <td style={{ padding: '10px', color: 'var(--clr-primary)', fontWeight: 'bold' }}>{rdv.date} à {rdv.heure}</td>
                        <td style={{ padding: '10px' }}>
                          <span style={{ background: '#f3f4f6', padding: '3px 8px', borderRadius: '4px', fontSize: '0.85rem' }}>{rdv.raison}</span>
                        </td>
                        <td style={{ padding: '10px', textAlign: 'right' }}>
                          <a href={`https://wa.me/${rdv.tel?.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ marginRight: '10px', color: '#16a34a', display: 'inline-flex', verticalAlign: 'middle' }} title="Contacter sur WhatsApp">
                            <MessageSquare size={16} />
                          </a>
                          <button onClick={() => handleDeleteAppointment(rdv.id)} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', verticalAlign: 'middle' }} title="Supprimer">
                            <Trash2 size={16} />
                          </button>
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
            <ShopManager
              products={products}
              onRefresh={fetchData}
              showToast={showToast}
            />
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
            TAB: UNITÉS & CATÉGORIES (FULL CRUD)
        ============================================================== */}
        {activeTab === 'units' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <UnitsManager 
              units={units} 
              players={players} 
              onRefresh={fetchData} 
              showToast={showToast} 
            />
          </motion.div>
        )}

        {/* ==============================================================
            TAB: RÔLES, POSTES & HIÉRARCHIE (FULL CRUD)
        ============================================================== */}
        {activeTab === 'roles' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <RolesManager 
              roles={roles} 
              players={players} 
              onRefresh={fetchData} 
              showToast={showToast} 
            />
          </motion.div>
        )}

        {/* ==============================================================
            TAB: ÉQUIPE & JOUEURS (FULL CRUD AVEC TRANSFERTS & PHOTOS)
        ============================================================== */}
        {activeTab === 'players' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <PlayersManager 
              players={players} 
              units={units} 
              roles={roles} 
              onRefresh={fetchData} 
              showToast={showToast} 
            />
          </motion.div>
        )}

        {/* ==============================================================
            TAB: STAFF & ENCADREMENT (FULL CRUD)
        ============================================================== */}
        {activeTab === 'staff' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <StaffManager 
              staff={staff} 
              onRefresh={fetchData} 
              showToast={showToast} 
            />
          </motion.div>
        )}

        {/* ==============================================================
            TAB: PALMARÈS & PARCOURS HISTORIQUE (FULL CRUD)
        ============================================================== */}
        {activeTab === 'timeline' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <TimelineManager 
              timeline={timeline} 
              onRefresh={fetchData} 
              showToast={showToast} 
            />
          </motion.div>
        )}

        {/* ==============================================================
            TAB: TEXTES DU SITE & SLOGANS (FULL CRUD)
        ============================================================== */}
        {activeTab === 'site_texts' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <SiteTextsManager 
              content={siteContent} 
              onRefresh={fetchData} 
              showToast={showToast} 
            />
          </motion.div>
        )}

        {/* ==============================================================
            TAB 7: INSCRIPTIONS ANNUELLES
        ============================================================== */}
        {activeTab === 'inscriptions' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: '1.5rem' }}>Inscriptions Annuelles</h2>
            <p style={{ color: 'var(--clr-gray)', marginBottom: '2rem' }}>Consultez et gérez les formulaires d'inscriptions annuels complets reçus.</p>

            {selectedInscription ? (() => {
              const fd = selectedInscription.form_data || {};
              const dob = fd.enfantDateNaissance || selectedInscription.enfant_dob;
              let age: number | null = null;
              let category = '';
              if (dob) {
                const d = new Date(dob);
                if (!isNaN(d.getTime())) {
                  const today = new Date();
                  age = today.getFullYear() - d.getFullYear();
                  const m = today.getMonth() - d.getMonth();
                  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
                  if (age <= 7) category = 'U7';
                  else if (age <= 9) category = 'U9';
                  else if (age <= 11) category = 'U11';
                  else if (age <= 13) category = 'U13';
                  else if (age <= 15) category = 'U15';
                  else if (age <= 17) category = 'U17';
                  else category = 'U20+';
                }
              }

              return (
                <div style={{ background: 'white', padding: '2.5rem', borderRadius: '16px', border: '2px solid var(--clr-primary)', marginBottom: '2.5rem', boxShadow: '0 15px 40px rgba(0,0,0,0.08)' }}>
                  {/* Header bar with actions */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '15px', borderBottom: '2px solid #eee', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: '1.8rem', margin: 0, fontWeight: 'bold', fontFamily: 'var(--font-heading)', textTransform: 'uppercase' }}>
                          Dossier d'Inscription : {fd.enfantNom || selectedInscription.enfant_nom} {fd.enfantPrenom || selectedInscription.enfant_prenom}
                        </h3>
                        {category && (
                          <span style={{ background: 'var(--clr-primary)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                            Catégorie {category} {age !== null ? `(${age} ans)` : ''}
                          </span>
                        )}
                        <span style={{ background: '#f3f4f6', color: '#111', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                          {fd.planAdhesion?.split(':')[0] || 'Plan Standard'}
                        </span>
                      </div>
                      <p style={{ margin: '8px 0 0', color: '#666', fontSize: '0.9rem' }}>
                        Enregistré le {selectedInscription.created_at ? new Date(selectedInscription.created_at).toLocaleString('fr-FR') : 'N/A'} • Dossier intégral certifié et conforme aux normes 2026
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button 
                        onClick={() => window.print()} 
                        className="btn btn-outline" 
                        style={{ color: '#111', borderColor: '#ccc', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}
                      >
                        <Printer size={16} /> Imprimer Dossier (PDF)
                      </button>
                      <button 
                        onClick={() => setSelectedInscription(null)} 
                        className="btn btn-primary" 
                        style={{ padding: '8px 18px', fontSize: '0.9rem' }}
                      >
                        Fermer le Dossier
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    
                    {/* Grille 1 : Enfant & Parent */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                      
                      {/* 1. ENFANT */}
                      <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <h4 style={{ color: 'var(--clr-primary)', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '2px solid rgba(202,2,79,0.2)', paddingBottom: '6px' }}>
                          1. Identité de l'Enfant
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.95rem' }}>
                          <p><strong>Nom :</strong> {fd.enfantNom || selectedInscription.enfant_nom || 'N/A'}</p>
                          <p><strong>Prénom :</strong> {fd.enfantPrenom || selectedInscription.enfant_prenom || 'N/A'}</p>
                          <p><strong>Date de naissance :</strong> {dob || 'N/A'} {age !== null ? `(${age} ans)` : ''}</p>
                          <p><strong>Sexe :</strong> {fd.enfantSexe === 'M' ? 'Masculin' : fd.enfantSexe === 'F' ? 'Féminin' : (fd.enfantSexe || 'N/A')}</p>
                          <p><strong>Téléphones enfant :</strong> {fd.enfantTelephones || 'Non renseigné'}</p>
                          <p><strong>Adresse de résidence :</strong> {fd.enfantAdresse || 'N/A'}</p>
                          <p><strong>Connu par :</strong> {fd.connuPar || 'N/A'} {fd.connuAutre ? `(${fd.connuAutre})` : ''}</p>
                        </div>
                      </div>

                      {/* 2. PARENT */}
                      <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <h4 style={{ color: 'var(--clr-primary)', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '2px solid rgba(202,2,79,0.2)', paddingBottom: '6px' }}>
                          2. Parent / Tuteur Légal
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.95rem' }}>
                          <p><strong>Nom & Prénom :</strong> {fd.parentNom || selectedInscription.parent_nom || ''} {fd.parentPrenom || selectedInscription.parent_prenom || ''}</p>
                          <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <strong>Téléphones :</strong> {fd.parentTelephones || selectedInscription.parent_tel || 'N/A'}
                            {(fd.parentTelephones || selectedInscription.parent_tel) && (
                              <a href={`tel:${fd.parentTelephones || selectedInscription.parent_tel}`} style={{ color: 'var(--clr-primary)', display: 'inline-flex' }}>
                                <PhoneCall size={14} />
                              </a>
                            )}
                          </p>
                          <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <strong>WhatsApp :</strong> {fd.parentWhatsapp || 'N/A'}
                            {fd.parentWhatsapp && (
                              <a href={`https://wa.me/${fd.parentWhatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ color: '#16a34a', display: 'inline-flex' }}>
                                <MessageSquare size={14} />
                              </a>
                            )}
                          </p>
                          <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <strong>Courriel :</strong> {fd.parentCourriel || selectedInscription.parent_email || 'N/A'}
                            {(fd.parentCourriel || selectedInscription.parent_email) && (
                              <a href={`mailto:${fd.parentCourriel || selectedInscription.parent_email}`} style={{ color: 'var(--clr-primary)', display: 'inline-flex' }}>
                                <Mail size={14} />
                              </a>
                            )}
                          </p>
                          <p><strong>NIF / NINU :</strong> {fd.parentNIF || 'Non communiqué'}</p>
                          <p><strong>Adresse du parent :</strong> {fd.parentAdresse || 'N/A'}</p>
                        </div>
                      </div>

                    </div>

                    {/* Grille 2 : Urgence & Récupération */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                      
                      {/* 3. URGENCE */}
                      <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <h4 style={{ color: 'var(--clr-primary)', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '2px solid rgba(202,2,79,0.2)', paddingBottom: '6px' }}>
                          3. Contact en Cas d'Urgence
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.95rem' }}>
                          <p><strong>Nom & Prénom :</strong> {fd.urgenceNom || 'N/A'} {fd.urgencePrenom || ''}</p>
                          <p><strong>Lien de parenté :</strong> {fd.urgenceLien || 'N/A'}</p>
                          <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <strong>Téléphones urgence :</strong> {fd.urgenceTelephones || 'N/A'}
                            {fd.urgenceTelephones && (
                              <a href={`tel:${fd.urgenceTelephones}`} style={{ color: 'var(--clr-primary)', display: 'inline-flex' }}>
                                <PhoneCall size={14} />
                              </a>
                            )}
                          </p>
                          <p><strong>WhatsApp urgence :</strong> {fd.urgenceWhatsapp || 'N/A'}</p>
                          <p><strong>Courriel urgence :</strong> {fd.urgenceCourriel || 'N/A'}</p>
                          <p><strong>Adresse urgence :</strong> {fd.urgenceAdresse || 'N/A'}</p>
                        </div>
                      </div>

                      {/* 4. SÉCURITÉ RÉCUPÉRATION */}
                      <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <h4 style={{ color: 'var(--clr-primary)', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '2px solid rgba(202,2,79,0.2)', paddingBottom: '6px' }}>
                          4. Modalités de Récupération & Fin de Séance
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.95rem' }}>
                          <p><strong>Personne autorisée à récupérer :</strong> {fd.autoriseRecuperer || 'Seul le parent / tuteur légal'}</p>
                          <p><strong>NIF / NINU personne autorisée :</strong> {fd.nifRecuperer || 'N/A'}</p>
                          <div>
                            <strong>Autorisation de rentrer seul :</strong>{' '}
                            {fd.rentrerSeul ? (
                              <span style={{ background: '#dcfce7', color: '#15803d', padding: '4px 10px', borderRadius: '4px', fontWeight: 'bold' }}>
                                OUI - Autorisé à rentrer seul par ses propres moyens
                              </span>
                            ) : (
                              <span style={{ background: '#fee2e2', color: '#b91c1c', padding: '4px 10px', borderRadius: '4px', fontWeight: 'bold' }}>
                                NON - Doit impérativement être récupéré par un responsable
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Grille 3 : Football & Dimensions Uniformes */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                      
                      {/* 5. FOOTBALL */}
                      <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <h4 style={{ color: 'var(--clr-primary)', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '2px solid rgba(202,2,79,0.2)', paddingBottom: '6px' }}>
                          5. Rapport Scolaire & Football
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.95rem' }}>
                          <p><strong>École classique :</strong> {fd.ecoleClassique || 'N/A'}</p>
                          <p><strong>Niveau / Classe :</strong> {fd.niveauClasse || 'N/A'}</p>
                          <p><strong>École / Club antérieur :</strong> {fd.ecoleClub || 'N/A'}</p>
                          <p><strong>Position occupée :</strong> <span style={{ color: 'var(--clr-primary)', fontWeight: 'bold' }}>{fd.position || 'Non spécifié'}</span></p>
                          <p><strong>Durée de pratique :</strong> {fd.duree || 'N/A'}</p>
                          <p><strong>Âge de début du football :</strong> {fd.ageDebut || 'N/A'}</p>
                        </div>
                      </div>

                      {/* 6. UNIFORMES */}
                      <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <h4 style={{ color: 'var(--clr-primary)', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '2px solid rgba(202,2,79,0.2)', paddingBottom: '6px' }}>
                          6. Dimensions Complètes des Uniformes
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '8px', fontSize: '0.85rem' }}>
                          <div style={{ background: 'white', padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}>
                            <span style={{ color: '#666', fontSize: '0.75rem', display: 'block' }}>Maillot</span>
                            <strong>{fd.tailleMaillot || 'N/A'}</strong>
                          </div>
                          <div style={{ background: 'white', padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}>
                            <span style={{ color: '#666', fontSize: '0.75rem', display: 'block' }}>Short</span>
                            <strong>{fd.tailleShort || 'N/A'}</strong>
                          </div>
                          <div style={{ background: 'white', padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}>
                            <span style={{ color: '#666', fontSize: '0.75rem', display: 'block' }}>Pointure</span>
                            <strong>{fd.pointure || 'N/A'}</strong>
                          </div>
                          <div style={{ background: 'white', padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}>
                            <span style={{ color: '#666', fontSize: '0.75rem', display: 'block' }}>Poitrine</span>
                            <strong>{fd.taillePoitrine || 'N/A'}</strong>
                          </div>
                          <div style={{ background: 'white', padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}>
                            <span style={{ color: '#666', fontSize: '0.75rem', display: 'block' }}>Épaule</span>
                            <strong>{fd.tailleEpaule || 'N/A'}</strong>
                          </div>
                          <div style={{ background: 'white', padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}>
                            <span style={{ color: '#666', fontSize: '0.75rem', display: 'block' }}>Longueur</span>
                            <strong>{fd.tailleLongueur || 'N/A'}</strong>
                          </div>
                          <div style={{ background: 'white', padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}>
                            <span style={{ color: '#666', fontSize: '0.75rem', display: 'block' }}>Hauteur</span>
                            <strong>{fd.tailleHauteur || 'N/A'}</strong>
                          </div>
                          <div style={{ background: 'white', padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}>
                            <span style={{ color: '#666', fontSize: '0.75rem', display: 'block' }}>Hanche</span>
                            <strong>{fd.tailleHanche || 'N/A'}</strong>
                          </div>
                          <div style={{ background: 'white', padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}>
                            <span style={{ color: '#666', fontSize: '0.75rem', display: 'block' }}>Taille gén.</span>
                            <strong>{fd.taille || 'N/A'}</strong>
                          </div>
                          <div style={{ background: 'white', padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}>
                            <span style={{ color: '#666', fontSize: '0.75rem', display: 'block' }}># Désiré</span>
                            <strong style={{ color: 'var(--clr-primary)' }}>{fd.uniformeDesire || 'N/A'}</strong>
                          </div>
                          <div style={{ background: 'white', padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}>
                            <span style={{ color: '#666', fontSize: '0.75rem', display: 'block' }}># Trouvé</span>
                            <strong>{fd.uniformeTrouve || 'Non fixé'}</strong>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Grille 4 : Renseignements Médicaux (Données Protégées) */}
                    <div style={{ background: '#fef2f2', padding: '1.5rem', borderRadius: '12px', border: '1px solid #fecaca' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', borderBottom: '2px solid rgba(239,68,68,0.2)', paddingBottom: '6px' }}>
                        <HeartPulse size={20} color="#b91c1c" />
                        <h4 style={{ color: '#991b1b', fontWeight: 'bold', fontSize: '1.1rem', margin: 0 }}>
                          7. Dossier Médical Confidentiel & Autorisation d'Urgence
                        </h4>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', fontSize: '0.95rem' }}>
                        <div>
                          <p><strong>Allergies alimentaires :</strong> {fd.allergies || 'Aucune'}</p>
                          <p><strong>Asthme :</strong> {fd.asthme || 'Non'}</p>
                          <p><strong>Médicaments pris régulièrement :</strong> {fd.medicaments || 'Aucun'}</p>
                          <p><strong>Préoccupation médicale signalée :</strong> {fd.preoccupation || 'Aucune'}</p>
                          {fd.causeAllergie && (
                            <div style={{ marginTop: '8px', background: 'white', padding: '10px', borderRadius: '6px', border: '1px solid #fee2e2' }}>
                              <strong>Cause allergie & conduite à tenir :</strong>
                              <p style={{ margin: '4px 0 0', color: '#7f1d1d' }}>{fd.causeAllergie}</p>
                            </div>
                          )}
                        </div>

                        <div>
                          <p><strong>Médecin traitant :</strong> {fd.medecinNom || 'Non renseigné'}</p>
                          <p><strong>Téléphone médecin :</strong> {fd.medecinTel || 'N/A'}</p>
                          <p><strong>WhatsApp médecin :</strong> {fd.medecinWhatsapp || 'N/A'}</p>
                          
                          <div style={{ marginTop: '12px', background: 'white', padding: '12px', borderRadius: '8px', border: '1px solid #fee2e2' }}>
                            <span style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', color: '#991b1b' }}>Autorisation d'Urgence Médicale :</span>
                            <span style={{ 
                              display: 'inline-block',
                              background: fd.autorisationUrgence?.includes("J'autorise") ? '#dcfce7' : '#fee2e2', 
                              color: fd.autorisationUrgence?.includes("J'autorise") ? '#15803d' : '#b91c1c', 
                              padding: '6px 12px', 
                              borderRadius: '6px', 
                              fontWeight: 'bold' 
                            }}>
                              {fd.autorisationUrgence || "Non renseigné"}
                            </span>
                            <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '6px' }}>
                              Prise en charge selon l'avis du médecin traitant, transport en véhicule et actes médicaux/chirurgicaux d'urgence.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Grille 5 : Plan d'adhésion & Consentements Légaux */}
                    <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <h4 style={{ color: 'var(--clr-primary)', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '2px solid rgba(202,2,79,0.2)', paddingBottom: '6px' }}>
                        8. Plan Financier, Consentements Juridiques & Signature
                      </h4>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', fontSize: '0.95rem' }}>
                        <div>
                          <p style={{ marginBottom: '10px' }}>
                            <strong>Plan d'adhésion souscrit :</strong>{' '}
                            <span style={{ background: 'var(--clr-primary)', color: 'white', padding: '4px 10px', borderRadius: '4px', fontWeight: 'bold' }}>
                              {fd.planAdhesion || 'Standard'}
                            </span>
                          </p>
                          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <CheckSquare size={16} color="var(--clr-primary)" />
                              <span>Conditions d'inscription & droit à l'image : <strong>{fd.consentementLuApprouve ? 'APPROUVÉ' : 'NON'}</strong></span>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <CheckSquare size={16} color="var(--clr-primary)" />
                              <span>Prise de connaissance et respect des tarifs : <strong>{fd.consentementTarifs ? 'APPROUVÉ' : 'NON'}</strong></span>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <CheckSquare size={16} color="var(--clr-primary)" />
                              <span>Engagement certificat médical sous 1 mois : <strong>{fd.consentementCertificat ? 'APPROUVÉ' : 'NON'}</strong></span>
                            </li>
                          </ul>
                        </div>

                        <div style={{ background: 'white', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                          <span style={{ color: '#666', fontSize: '0.85rem', display: 'block', marginBottom: '4px' }}>Signature Parentale Électronique :</span>
                          <p style={{ fontSize: '1.3rem', fontFamily: 'serif', fontStyle: 'italic', color: '#111', margin: '4px 0 8px 0', borderBottom: '1px dashed #ccc', paddingBottom: '6px' }}>
                            {fd.signatureParent || 'N/A'}
                          </p>
                          <p style={{ fontSize: '0.85rem', color: '#666', margin: 0 }}>
                            Signé le : <strong>{fd.dateSignature || 'N/A'}</strong>
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })() : null}

            {/* Table des Inscriptions avec Barre de Recherche */}
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #eee', overflow: 'hidden', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', margin: 0 }}>Dossiers d'Inscriptions Reçus ({inscriptions.length})</h3>
                  <span style={{ fontSize: '0.85rem', color: '#666' }}>Données chiffrées & protégées selon les normes de cybersécurité 2026</span>
                </div>
                <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                  <input 
                    type="text" 
                    placeholder="Filtrer (enfant, parent, tél, plan)..." 
                    value={inscriptionSearch}
                    onChange={e => setInscriptionSearch(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px 9px 38px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>
              </div>

              {inscriptions.length === 0 ? (
                <p style={{ padding: '2rem', color: '#666', textAlign: 'center' }}>Aucune inscription trouvée.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: '#f5f7fa', borderBottom: '1px solid #eee' }}>
                        <th style={{ padding: '12px 15px' }}>Date Réception</th>
                        <th style={{ padding: '12px 15px' }}>Enfant</th>
                        <th style={{ padding: '12px 15px' }}>Date Naissance</th>
                        <th style={{ padding: '12px 15px' }}>Parent Responsable</th>
                        <th style={{ padding: '12px 15px' }}>Téléphone</th>
                        <th style={{ padding: '12px 15px' }}>Plan</th>
                        <th style={{ padding: '12px 15px', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inscriptions
                        .filter(ins => {
                          if (!inscriptionSearch.trim()) return true;
                          const q = inscriptionSearch.toLowerCase();
                          const enfant = `${ins.enfant_nom || ''} ${ins.enfant_prenom || ''}`.toLowerCase();
                          const parent = `${ins.parent_nom || ''} ${ins.parent_prenom || ''}`.toLowerCase();
                          const tel = `${ins.parent_tel || ''}`.toLowerCase();
                          const plan = `${ins.form_data?.planAdhesion || ''}`.toLowerCase();
                          return enfant.includes(q) || parent.includes(q) || tel.includes(q) || plan.includes(q);
                        })
                        .map((ins) => (
                          <tr key={ins.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '12px 15px', color: '#666', fontSize: '0.85rem' }}>
                              {ins.created_at ? new Date(ins.created_at).toLocaleDateString('fr-FR') : 'N/A'}
                            </td>
                            <td style={{ padding: '12px 15px', fontWeight: 'bold' }}>{ins.enfant_nom} {ins.enfant_prenom}</td>
                            <td style={{ padding: '12px 15px' }}>{ins.enfant_dob}</td>
                            <td style={{ padding: '12px 15px' }}>{ins.parent_nom} {ins.parent_prenom}</td>
                            <td style={{ padding: '12px 15px' }}>
                              <a href={`tel:${ins.parent_tel}`} style={{ color: 'var(--clr-primary)', textDecoration: 'none' }}>{ins.parent_tel}</a>
                            </td>
                            <td style={{ padding: '12px 15px' }}>
                              <span style={{ background: 'var(--clr-gray-light)', color: 'var(--clr-primary)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                {ins.form_data?.planAdhesion?.split(':')[0] || 'Standard'}
                              </span>
                            </td>
                            <td style={{ padding: '12px 15px', textAlign: 'right' }}>
                              <button 
                                onClick={() => { setSelectedInscription(ins); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                                className="btn btn-outline" 
                                style={{ padding: '6px 12px', fontSize: '0.85rem', marginRight: '10px', color: 'black', borderColor: '#ccc' }}
                              >
                                Dossier Complet
                              </button>
                              <button 
                                onClick={() => handleDeleteInscription(ins.id)} 
                                style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', verticalAlign: 'middle' }}
                                title="Supprimer le dossier"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
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
