"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, Users, Calendar, BookOpen, Image, 
  Trash2, Plus, Edit2, CheckCircle, LogOut, Award, Upload
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

const translateAuthError = (message: string): string => {
  const msg = message.toLowerCase();
  if (msg.includes('invalid login credentials') || msg.includes('email not confirmed') || msg.includes('invalid email')) {
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
  const [activeTab, setActiveTab] = useState('slider');
  const [message, setMessage] = useState('');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 1. Slider State
  const [slides, setSlides] = useState<any[]>([]);
  const [newSlideUrl, setNewSlideUrl] = useState('');

  // 2. Players State
  const [players, setPlayers] = useState<Record<string, any>>({});
  const [editingPlayer, setEditingPlayer] = useState<any>(null);

  // 3. News State
  const [newsList, setNewsList] = useState<any[]>([]);
  const [editingNews, setEditingNews] = useState<any>(null);

  // 4. Stages & Appointments State
  const [stageRegistrations, setStageRegistrations] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);

  // 5. Supporters State
  const [supporters, setSupporters] = useState<any[]>([]);

  // 6. Inscriptions Complètes State
  const [inscriptions, setInscriptions] = useState<any[]>([]);
  const [selectedInscription, setSelectedInscription] = useState<any>(null);

  // Load all data from Supabase
  const fetchData = async () => {
    // 1. Fetch Slides
    const { data: slidesData } = await supabase.from('slides').select('*').order('created_at', { ascending: true });
    if (slidesData) setSlides(slidesData);

    // 2. Fetch Players
    const { data: playersData } = await supabase.from('players').select('*');
    if (playersData) {
      const dbObj = playersData.reduce((acc: any, player: any) => {
        acc[player.id] = player;
        return acc;
      }, {});
      setPlayers(dbObj);
    }

    // 3. Fetch News
    const { data: newsData } = await supabase.from('news').select('*').order('created_at', { ascending: false });
    if (newsData) setNewsList(newsData);

    // 4. Fetch Stages Inscriptions
    const { data: stagesData } = await supabase.from('stages_inscriptions').select('*').order('created_at', { ascending: false });
    if (stagesData) setStageRegistrations(stagesData);

    // 5. Fetch Appointments
    const { data: rdvData } = await supabase.from('appointments').select('*').order('created_at', { ascending: false });
    if (rdvData) setAppointments(rdvData);

    // 6. Fetch Supporters
    const { data: supportersData } = await supabase.from('supporters').select('*').order('created_at', { ascending: false });
    if (supportersData) setSupporters(supportersData);

    // 7. Fetch Inscriptions Complètes
    const { data: inscriptionsData } = await supabase.from('inscriptions').select('*').order('created_at', { ascending: false });
    if (inscriptionsData) setInscriptions(inscriptionsData);
  };

  useEffect(() => {
    // Check if there is an active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        if (session.user.email === 'admin@gmail.com') {
          fetchData();
        }
      }
      setLoading(false);
    });

    // Listen for auth changes
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

  const showToast = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 4000);
  };

  // Slider actions
  const addSlide = async () => {
    if (!newSlideUrl) return;
    const { error } = await supabase.from('slides').insert({ url: newSlideUrl });
    if (error) {
      console.error(error);
      showToast('Erreur lors de l\'ajout de la photo.');
    } else {
      setNewSlideUrl('');
      fetchData();
      showToast('Photo ajoutée avec succès !');
    }
  };

  const removeSlide = async (id: number) => {
    const { error } = await supabase.from('slides').delete().eq('id', id);
    if (error) {
      console.error(error);
      showToast('Une erreur est survenue lors de la suppression.');
    } else {
      fetchData();
      showToast('Photo supprimée avec succès.');
    }
  };

  // Player actions
  const savePlayerEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('players').update({
      name: editingPlayer.name,
      num: editingPlayer.num,
      pos: editingPlayer.pos,
      category: editingPlayer.category,
      height: editingPlayer.height,
      weight: editingPlayer.weight,
      foot: editingPlayer.foot,
      bio: editingPlayer.bio,
      img: editingPlayer.img
    }).eq('id', editingPlayer.id);

    if (error) {
      console.error(error);
      showToast('Impossible de mettre à jour la fiche du joueur.');
    } else {
      setEditingPlayer(null);
      fetchData();
      showToast(`Fiche de ${editingPlayer.name} mise à jour avec succès !`);
    }
  };

  // News actions
  const deleteNews = async (id: number) => {
    const { error } = await supabase.from('news').delete().eq('id', id);
    if (error) {
      console.error(error);
      showToast('Une erreur est survenue lors de la suppression.');
    } else {
      fetchData();
      showToast('Article supprimé avec succès.');
    }
  };

  const saveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      cat: editingNews.cat,
      title: editingNews.title,
      desc_text: editingNews.desc_text || editingNews.desc,
      img: editingNews.img,
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
      console.error(error);
      showToast('Une erreur est survenue lors de l\'enregistrement de l\'article.');
    } else {
      setEditingNews(null);
      fetchData();
      showToast('Article de presse enregistré avec succès !');
    }
  };

  const deleteInscription = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer cette inscription ?")) return;
    const { error } = await supabase.from('inscriptions').delete().eq('id', id);
    if (error) {
      console.error(error);
      showToast("Impossible de supprimer l'inscription.");
    } else {
      fetchData();
      showToast("Inscription supprimée avec succès.");
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
    <div style={{ flex: 1, marginTop: '80px', display: 'flex', minHeight: 'calc(100vh - 80px)', background: '#f5f7fa', color: 'var(--clr-black)' }}>
      
      {/* Sidebar de navigation Admin */}
      <aside style={{ width: '260px', background: 'var(--clr-black)', color: 'white', padding: '2rem 1rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--clr-primary)' }}>ADMIN PANEL</h2>
          <span style={{ fontSize: '0.8rem', color: '#888' }}>PANNEAU DE CONFIGURATION</span>
        </div>

        {[
          { id: 'slider', label: 'Slider Accueil', icon: <Image size={18} /> },
          { id: 'news', label: 'Actualités', icon: <BookOpen size={18} /> },
          { id: 'players', label: 'Joueurs / Roster', icon: <Users size={18} /> },
          { id: 'inscriptions', label: 'Inscriptions', icon: <Award size={18} /> },
          { id: 'stages', label: 'Stages & RDV', icon: <Calendar size={18} /> },
          { id: 'supporters', label: 'Supporters', icon: <Settings size={18} /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setEditingPlayer(null); setEditingNews(null); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              padding: '12px 16px',
              background: activeTab === tab.id ? 'var(--clr-primary)' : 'transparent',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              textAlign: 'left',
              fontSize: '1rem',
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
          style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px', color: 'white', borderColor: '#444', textDecoration: 'none', justifyContent: 'center', background: 'transparent', width: '100%', cursor: 'pointer' }}
        >
          <LogOut size={16} /> Déconnexion
        </button>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '3rem' }}>
        
        {message && (
          <div style={{ background: '#d4edda', color: '#155724', padding: '15px', borderRadius: '8px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold' }}>
            <CheckCircle size={20} /> {message}
          </div>
        )}

        {/* ==================== TAB 1: SLIDER ==================== */}
        {activeTab === 'slider' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: '1.5rem' }}>Slider Accueil</h2>
            <p style={{ color: 'var(--clr-gray)', marginBottom: '2rem' }}>Configurez les photos d'équipe affichées dans l'en-tête de la page d'accueil.</p>

            <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #eee', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Ajouter une photo</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{
                  border: '2px dashed #ccc',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: '#fafafa',
                  position: 'relative'
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
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      opacity: 0,
                      cursor: 'pointer'
                    }}
                  />
                  {newSlideUrl ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                      <img src={newSlideUrl} style={{ maxHeight: '120px', borderRadius: '4px', border: '1px solid #eee' }} alt="Aperçu" />
                      <span style={{ fontSize: '0.85rem', color: 'green', fontWeight: 'bold' }}>✓ Image prête à être ajoutée</span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <Upload size={32} style={{ color: '#aaa' }} />
                      <p style={{ margin: 0, fontSize: '0.95rem', color: '#555' }}>Glissez-déposez ou cliquez pour sélectionner une photo de votre ordinateur</p>
                      <span style={{ fontSize: '0.8rem', color: '#999' }}>PNG, JPG, WEBP supportés</span>
                    </div>
                  )}
                </div>
                {newSlideUrl && (
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <button onClick={() => setNewSlideUrl('')} className="btn btn-outline" style={{ color: 'black', borderColor: '#ddd' }}>Réinitialiser</button>
                    <button onClick={addSlide} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Plus size={18} /> Ajouter au Slider</button>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
              {slides.map(slide => (
                <div key={slide.id} style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', border: '1px solid #eee', position: 'relative' }}>
                  <img src={slide.url} style={{ width: '100%', height: '140px', objectFit: 'cover' }} alt="slide preview" />
                  <div style={{ padding: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '120px' }}>
                      {slide.url.startsWith('data:') ? 'Image importée' : slide.url}
                    </span>
                    <button onClick={() => removeSlide(slide.id)} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ==================== TAB 2: NEWS ==================== */}
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
              <form onSubmit={saveNews} style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #eee', marginBottom: '2rem' }}>
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
                      <div style={{
                        flex: 1,
                        border: '2px dashed #ccc',
                        borderRadius: '8px',
                        padding: '8px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        background: '#fafafa',
                        position: 'relative'
                      }}>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                const base64 = await convertToBase64(file);
                                setEditingNews({...editingNews, img: base64});
                              } catch (err) {
                                showToast("Erreur lors de la lecture du fichier");
                              }
                            }
                          }}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            opacity: 0,
                            cursor: 'pointer'
                          }}
                        />
                        <span style={{ fontSize: '0.85rem', color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                          <Upload size={14} /> {editingNews.img ? "Changer de photo" : "Importer une photo"}
                        </span>
                      </div>
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
                      <td style={{ padding: '15px' }}><img src={news.img} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} /></td>
                      <td style={{ padding: '15px', fontWeight: 'bold' }}>{news.title}</td>
                      <td style={{ padding: '15px' }}><span style={{ background: '#eee', padding: '3px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>{news.cat}</span></td>
                      <td style={{ padding: '15px', color: '#666' }}>{news.date}</td>
                      <td style={{ padding: '15px', textAlign: 'right' }}>
                        <button onClick={() => setEditingNews(news)} style={{ background: 'none', border: 'none', color: 'blue', marginRight: '10px', cursor: 'pointer' }}><Edit2 size={16} /></button>
                        <button onClick={() => deleteNews(news.id)} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* ==================== TAB 3: PLAYERS ==================== */}
        {activeTab === 'players' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: '1.5rem' }}>Roster des Joueurs</h2>
            
            {editingPlayer ? (
              <form onSubmit={savePlayerEdit} style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #eee', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>Modifier : {editingPlayer.name}</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '5px' }}>Nom complet</label>
                    <input type="text" value={editingPlayer.name} onChange={e => setEditingPlayer({...editingPlayer, name: e.target.value})} required style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '5px' }}>Numéro</label>
                    <input type="number" value={editingPlayer.num} onChange={e => setEditingPlayer({...editingPlayer, num: parseInt(e.target.value)})} required style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '5px' }}>Poste</label>
                    <input type="text" value={editingPlayer.pos} onChange={e => setEditingPlayer({...editingPlayer, pos: e.target.value})} required style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '5px' }}>Catégorie</label>
                    <select value={editingPlayer.category} onChange={e => setEditingPlayer({...editingPlayer, category: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}>
                      <option value="Équipe Première">Équipe Première</option>
                      <option value="U17">U17</option>
                      <option value="U15">U15</option>
                      <option value="U13">U13</option>
                    </select>
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

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '5px' }}>Photo du Joueur</label>
                  <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    {editingPlayer.img && (
                      <img src={editingPlayer.img} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #ddd' }} alt="Aperçu" />
                    )}
                    <div style={{
                      flex: 1,
                      border: '2px dashed #ccc',
                      borderRadius: '8px',
                      padding: '10px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      background: '#fafafa',
                      position: 'relative'
                    }}>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              const base64 = await convertToBase64(file);
                              setEditingPlayer({...editingPlayer, img: base64});
                            } catch (err) {
                              showToast("Erreur lors de la lecture du fichier");
                            }
                          }
                        }}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          opacity: 0,
                          cursor: 'pointer'
                        }}
                      />
                      <span style={{ fontSize: '0.85rem', color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                        <Upload size={14} /> {editingPlayer.img ? "Changer de photo" : "Importer la photo du joueur"}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '5px' }}>Biographie</label>
                  <textarea value={editingPlayer.bio || ''} onChange={e => setEditingPlayer({...editingPlayer, bio: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd', minHeight: '80px' }} />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="submit" className="btn btn-primary">Enregistrer modifications</button>
                  <button type="button" onClick={() => setEditingPlayer(null)} className="btn btn-outline" style={{ color: 'black', borderColor: '#ddd' }}>Annuler</button>
                </div>
              </form>
            ) : null}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {Object.values(players).map((player: any) => (
                <div key={player.id} style={{ background: 'white', borderRadius: '12px', border: '1px solid #eee', padding: '1.5rem', display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <img src={player.img} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{player.name}</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--clr-primary)', fontWeight: 'bold' }}>#{player.num} - {player.category}</span>
                  </div>
                  <button onClick={() => setEditingPlayer(player)} style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}><Edit2 size={16} /></button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ==================== TAB: INSCRIPTIONS ==================== */}
        {activeTab === 'inscriptions' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: '1.5rem' }}>Inscriptions Annuelles</h2>
            <p style={{ color: 'var(--clr-gray)', marginBottom: '2rem' }}>Consultez et gérez les formulaires d'inscriptions annuels complets (inscriptions issues de la page de contact/inscription).</p>

            {selectedInscription ? (
              <div style={{ background: 'white', padding: '2.5rem', borderRadius: '12px', border: '1px solid #eee', marginBottom: '2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--clr-primary)', paddingBottom: '10px', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.5rem', margin: 0, fontWeight: 'bold' }}>
                    Dossier d'inscription : {selectedInscription.enfant_nom} {selectedInscription.enfant_prenom}
                  </h3>
                  <button 
                    onClick={() => setSelectedInscription(null)} 
                    className="btn btn-outline" 
                    style={{ color: 'black', borderColor: '#ddd', padding: '6px 12px' }}
                  >
                    Fermer le dossier
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  {/* Colonne Gauche */}
                  <div>
                    <h4 style={{ color: 'var(--clr-primary)', fontWeight: 'bold', borderBottom: '1px solid #eee', paddingBottom: '5px', marginBottom: '10px' }}>1. Informations Enfant</h4>
                    <p><strong>Nom & Prénom:</strong> {selectedInscription.form_data?.enfantNom} {selectedInscription.form_data?.enfantPrenom}</p>
                    <p><strong>Date de naissance:</strong> {selectedInscription.form_data?.enfantDateNaissance}</p>
                    <p><strong>Sexe:</strong> {selectedInscription.form_data?.enfantSexe || 'N/A'}</p>
                    <p><strong>Téléphones:</strong> {selectedInscription.form_data?.enfantTelephones || 'N/A'}</p>
                    <p><strong>Adresse:</strong> {selectedInscription.form_data?.enfantAdresse}</p>

                    <h4 style={{ color: 'var(--clr-primary)', fontWeight: 'bold', borderBottom: '1px solid #eee', paddingBottom: '5px', marginBottom: '10px', marginTop: '1.5rem' }}>2. Parent / Personne Responsable</h4>
                    <p><strong>Nom & Prénom:</strong> {selectedInscription.form_data?.parentNom} {selectedInscription.form_data?.parentPrenom}</p>
                    <p><strong>WhatsApp:</strong> {selectedInscription.form_data?.parentWhatsapp}</p>
                    <p><strong>Téléphones:</strong> {selectedInscription.form_data?.parentTelephones}</p>
                    <p><strong>NIF / NINU:</strong> {selectedInscription.form_data?.parentNIF || 'N/A'}</p>
                    <p><strong>Courriel:</strong> {selectedInscription.form_data?.parentCourriel}</p>
                    <p><strong>Adresse:</strong> {selectedInscription.form_data?.parentAdresse}</p>

                    <h4 style={{ color: 'var(--clr-primary)', fontWeight: 'bold', borderBottom: '1px solid #eee', paddingBottom: '5px', marginBottom: '10px', marginTop: '1.5rem' }}>3. Contact d'Urgence</h4>
                    <p><strong>Nom & Prénom:</strong> {selectedInscription.form_data?.urgenceNom} {selectedInscription.form_data?.urgencePrenom}</p>
                    <p><strong>Lien de parenté:</strong> {selectedInscription.form_data?.urgenceLien}</p>
                    <p><strong>WhatsApp:</strong> {selectedInscription.form_data?.urgenceWhatsapp || 'N/A'}</p>
                    <p><strong>Téléphones:</strong> {selectedInscription.form_data?.urgenceTelephones}</p>
                    <p><strong>Courriel:</strong> {selectedInscription.form_data?.urgenceCourriel || 'N/A'}</p>
                    <p><strong>Adresse:</strong> {selectedInscription.form_data?.urgenceAdresse || 'N/A'}</p>
                  </div>

                  {/* Colonne Droite */}
                  <div>
                    <h4 style={{ color: 'var(--clr-primary)', fontWeight: 'bold', borderBottom: '1px solid #eee', paddingBottom: '5px', marginBottom: '10px' }}>4. Informations Sportives & Club</h4>
                    <p><strong>Plan d'adhésion choisi:</strong> <span style={{ color: 'var(--clr-primary)', fontWeight: 'bold' }}>{selectedInscription.form_data?.planAdhesion}</span></p>
                    <p><strong>École classique:</strong> {selectedInscription.form_data?.ecoleClassique || 'N/A'} (Classe: {selectedInscription.form_data?.niveauClasse || 'N/A'})</p>
                    <p><strong>École / Club antérieur:</strong> {selectedInscription.form_data?.ecoleClub || 'N/A'}</p>
                    <p><strong>Position jouée:</strong> {selectedInscription.form_data?.position || 'N/A'}</p>
                    <p><strong>Durée de pratique:</strong> {selectedInscription.form_data?.duree || 'N/A'} (Début à l'âge: {selectedInscription.form_data?.ageDebut || 'N/A'})</p>

                    <h4 style={{ color: 'var(--clr-primary)', fontWeight: 'bold', borderBottom: '1px solid #eee', paddingBottom: '5px', marginBottom: '10px', marginTop: '1.5rem' }}>5. Dimensions des Uniformes</h4>
                    <p><strong>Maillot / Short:</strong> {selectedInscription.form_data?.tailleMaillot || 'N/A'} / {selectedInscription.form_data?.tailleShort || 'N/A'}</p>
                    <p><strong>Poitrine / Épaule:</strong> {selectedInscription.form_data?.taillePoitrine || 'N/A'} / {selectedInscription.form_data?.tailleEpaule || 'N/A'}</p>
                    <p><strong>Longueur / Hauteur / Hanche / Taille:</strong> {selectedInscription.form_data?.tailleLongueur || 'N/A'} / {selectedInscription.form_data?.tailleHauteur || 'N/A'} / {selectedInscription.form_data?.tailleHanche || 'N/A'} / {selectedInscription.form_data?.taille || 'N/A'}</p>
                    <p><strong>Pointure chaussettes:</strong> {selectedInscription.form_data?.pointure || 'N/A'}</p>
                    <p><strong>Numéro uniforme (Désiré / Trouvé):</strong> {selectedInscription.form_data?.uniformeDesire || 'N/A'} / {selectedInscription.form_data?.uniformeTrouve || 'N/A'}</p>

                    <h4 style={{ color: 'var(--clr-primary)', fontWeight: 'bold', borderBottom: '1px solid #eee', paddingBottom: '5px', marginBottom: '10px', marginTop: '1.5rem' }}>6. Renseignements Médicaux</h4>
                    <p><strong>Allergies alimentaires:</strong> {selectedInscription.form_data?.allergies || 'Aucune'}</p>
                    <p><strong>Asthme / Médicaments:</strong> {selectedInscription.form_data?.asthme || 'Aucun'} / {selectedInscription.form_data?.medicaments || 'Aucun'}</p>
                    <p><strong>Médecin (Nom / Tel / WA):</strong> {selectedInscription.form_data?.medecinNom || 'N/A'} / {selectedInscription.form_data?.medecinTel || 'N/A'} / {selectedInscription.form_data?.medecinWhatsapp || 'N/A'}</p>
                    <p><strong>Préoccupation médicale:</strong> {selectedInscription.form_data?.preoccupation || 'Aucune'}</p>
                    <p><strong>Cause allergie & conduite à tenir:</strong> {selectedInscription.form_data?.causeAllergie || 'N/A'}</p>
                    <p><strong>En cas d'urgence grave:</strong> <strong style={{ color: 'var(--clr-primary)' }}>{selectedInscription.form_data?.autorisationUrgence || 'N/A'}</strong></p>
                  </div>
                </div>

                <div style={{ background: '#fcfcfc', border: '1px solid #ddd', padding: '1.5rem', borderRadius: '8px', marginTop: '1.5rem' }}>
                  <h4 style={{ fontWeight: 'bold', marginBottom: '10px' }}>7. Consentements & Signatures</h4>
                  <p><strong>Consentement conditions (Règlement, image, suivi):</strong> {selectedInscription.form_data?.consentementLuApprouve ? '✓ Accordé' : '✗ Non accordé'}</p>
                  <p><strong>Engagement financier (Tarifs):</strong> {selectedInscription.form_data?.consentementTarifs ? '✓ Accordé' : '✗ Non accordé'}</p>
                  <p><strong>Fourniture certificat médical:</strong> {selectedInscription.form_data?.consentementCertificat ? '✓ Accordé' : '✗ Non accordé'}</p>
                  {selectedInscription.form_data?.autoriseRecuperer && (
                    <p><strong>Personne autorisée à récupérer l'enfant:</strong> {selectedInscription.form_data?.autoriseRecuperer} (NIF/NINU: {selectedInscription.form_data?.nifRecuperer || 'N/A'})</p>
                  )}
                  <p><strong>Retour seul autorisé:</strong> {selectedInscription.form_data?.rentrerSeul ? '✓ Oui' : '✗ Non, doit être récupéré'}</p>
                  <p style={{ fontSize: '1.1rem', marginTop: '10px' }}><strong>Signature Parent :</strong> <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', textDecoration: 'underline' }}>{selectedInscription.form_data?.signatureParent}</span> le {selectedInscription.form_data?.dateSignature}</p>
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
                      <th style={{ padding: '15px' }}>Date de Naissance</th>
                      <th style={{ padding: '15px' }}>Parent / Tuteur</th>
                      <th style={{ padding: '15px' }}>Téléphone</th>
                      <th style={{ padding: '15px' }}>Plan</th>
                      <th style={{ padding: '15px' }}>Date Inscription</th>
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
                        <td style={{ padding: '15px', color: '#666' }}>{new Date(ins.created_at).toLocaleDateString('fr-FR')}</td>
                        <td style={{ padding: '15px', textAlign: 'right' }}>
                          <button 
                            onClick={() => { setSelectedInscription(ins); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                            className="btn btn-outline" 
                            style={{ padding: '5px 10px', fontSize: '0.85rem', marginRight: '10px', color: 'var(--clr-black)', borderColor: '#ddd', background: 'transparent' }}
                          >
                            Voir Dossier
                          </button>
                          <button 
                            onClick={() => deleteInscription(ins.id)} 
                            style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', verticalAlign: 'middle' }}
                          >
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

        {/* ==================== TAB 4: STAGES ==================== */}
        {activeTab === 'stages' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: '1.5rem' }}>Sessions & Calendrier</h2>
            
            <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #eee', marginBottom: '3rem' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>Pré-inscriptions Stages</h3>
              {stageRegistrations.length === 0 ? (
                <p style={{ color: '#666' }}>Aucune inscription trouvée.</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#f5f7fa', borderBottom: '1px solid #eee' }}>
                      <th style={{ padding: '10px' }}>Nom / Prénom Enfant</th>
                      <th style={{ padding: '10px' }}>Date Naissance</th>
                      <th style={{ padding: '10px' }}>Téléphone</th>
                      <th style={{ padding: '10px' }}>Stage Souhaité</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stageRegistrations.map(reg => (
                      <tr key={reg.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '10px', fontWeight: 'bold' }}>{reg.nom} {reg.prenom}</td>
                        <td style={{ padding: '10px' }}>{reg.dob}</td>
                        <td style={{ padding: '10px' }}>{reg.tel}</td>
                        <td style={{ padding: '10px' }}>{reg.stage}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #eee' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>Rendez-vous Administratifs</h3>
              {appointments.length === 0 ? (
                <p style={{ color: '#666' }}>Aucun rendez-vous planifié.</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#f5f7fa', borderBottom: '1px solid #eee' }}>
                      <th style={{ padding: '10px' }}>Parent</th>
                      <th style={{ padding: '10px' }}>Enfant</th>
                      <th style={{ padding: '10px' }}>Téléphone</th>
                      <th style={{ padding: '10px' }}>Date & Heure RDV</th>
                      <th style={{ padding: '10px' }}>Motif</th>
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </motion.div>
        )}

        {/* ==================== TAB 5: SUPPORTERS ==================== */}
        {activeTab === 'supporters' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: '1.5rem' }}>Liste des Supporters</h2>
            
            <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #eee' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>Liste des supporters inscrits</h3>
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

    const { data, error: authError } = await supabase.auth.signInWithPassword({
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
