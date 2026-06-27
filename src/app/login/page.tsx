"use client";

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Bell, ShieldCheck, LogIn, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

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

export default function SupporterPortal() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    notifyNews: true,
    notifyMatchStart: true,
    notifyGoals: true,
    notifyHalfTime: true,
    notifyFinalScore: true
  });
  const [registeredUser, setRegisteredUser] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Check if there is an active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setRegisteredUser({
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
          email: session.user.email
        });
        setIsLoggedIn(true);
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setRegisteredUser({
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
          email: session.user.email
        });
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        setRegisteredUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.checked });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setMessage('Veuillez remplir tous les champs.');
      return;
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          name: formData.name
        }
      }
    });

    if (authError) {
      setMessage(translateAuthError(authError.message));
      return;
    }

    if (authData?.user) {
      // Save supporter preferences in Database
      const { error: dbError } = await supabase.from('supporters').insert({
        id: authData.user.id,
        name: formData.name,
        email: formData.email,
        notify_news: formData.notifyNews,
        notify_match_start: formData.notifyMatchStart,
        notify_goals: formData.notifyGoals,
        notify_half_time: formData.notifyHalfTime,
        notify_final_score: formData.notifyFinalScore
      });

      if (dbError) {
        console.error('Error inserting supporter profile:', dbError);
      }

      setRegisteredUser({
        name: formData.name,
        email: formData.email
      });
      setIsLoggedIn(true);
      setMessage('Compte Supporter créé avec succès !');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setMessage('Veuillez remplir tous les champs.');
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password
    });

    if (error) {
      setMessage(translateAuthError(error.message));
      return;
    }

    if (data?.user) {
      const { data: profile } = await supabase
        .from('supporters')
        .select('*')
        .eq('id', data.user.id)
        .single();

      const userProfile = {
        name: profile?.name || data.user.user_metadata?.name || data.user.email?.split('@')[0],
        email: data.user.email
      };

      setRegisteredUser(userProfile);
      setIsLoggedIn(true);
      setMessage('Connexion réussie !');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setRegisteredUser(null);
    setMessage('Déconnexion réussie.');
  };

  const formInputStyle = {
    width: '100%',
    padding: '12px 16px',
    background: 'rgba(0,0,0,0.03)',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '1rem',
    outline: 'none',
    marginBottom: '1rem'
  };

  const cardStyle = {
    background: 'white',
    borderRadius: '16px',
    padding: '3rem',
    boxShadow: '0 15px 35px rgba(0,0,0,0.08)',
    maxWidth: '550px',
    width: '100%',
    border: '1px solid #eee'
  };

  return (
    <div style={{ flex: 1, marginTop: '80px', background: '#f8f9fa', minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      
      {isLoggedIn && registeredUser ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={cardStyle}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(202, 2, 79, 0.1)', color: 'var(--clr-primary)', marginBottom: '1rem' }}>
              <ShieldCheck size={36} />
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', margin: 0 }}>Espace Supporter</h2>
            <p style={{ color: 'var(--clr-gray)', marginTop: '5px' }}>Ravi de vous revoir, <strong>{registeredUser.name}</strong> !</p>
          </div>

          {message && (
            <div style={{ background: '#d4edda', color: '#155724', padding: '12px', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center' }}>
              {message}
            </div>
          )}

          <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '12px', border: '1px solid #eee', marginBottom: '2rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem', marginBottom: '1.2rem', borderBottom: '1px solid #ddd', paddingBottom: '8px' }}>
              <Bell size={18} color="var(--clr-primary)" /> Alertes & Notifications Actives
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.95rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Actualités & Communiqués officiels</span>
                <span style={{ color: 'green', fontWeight: 'bold' }}>✓ Activé</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Début des matchs (Alertes directes)</span>
                <span style={{ color: 'green', fontWeight: 'bold' }}>✓ Activé</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Buts marqués (Temps réel)</span>
                <span style={{ color: 'green', fontWeight: 'bold' }}>✓ Activé</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Score à la mi-temps</span>
                <span style={{ color: 'green', fontWeight: 'bold' }}>✓ Activé</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Score final & Résumé rapide</span>
                <span style={{ color: 'green', fontWeight: 'bold' }}>✓ Activé</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Link href="/" className="btn btn-primary" style={{ textAlign: 'center', textDecoration: 'none' }}>Retour à l'Accueil</Link>
            <button onClick={handleLogout} className="btn btn-outline" style={{ color: 'var(--clr-black)', borderColor: '#ddd', width: '100%' }}>Se Déconnecter</button>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={cardStyle}>
          
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', margin: 0 }}>
              {isLogin ? 'Connexion Supporter' : 'Devenir Membre'}
            </h2>
            <p style={{ color: 'var(--clr-gray)', marginTop: '5px' }}>
              {isLogin ? 'Accédez à vos alertes' : 'Créez votre compte pour suivre le Condor FC'}
            </p>
          </div>

          {message && (
            <div style={{ background: '#f8d7da', color: '#721c24', padding: '12px', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center' }}>
              {message}
            </div>
          )}

          <form onSubmit={isLogin ? handleLogin : handleRegister}>
            {!isLogin && (
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px', color: 'var(--clr-gray)' }}>Nom Complet</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required style={formInputStyle} placeholder="Ex: Jean Paul" />
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px', color: 'var(--clr-gray)' }}>Adresse E-mail</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required style={formInputStyle} placeholder="Ex: jean.paul@email.com" />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px', color: 'var(--clr-gray)' }}>Mot de Passe</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required style={formInputStyle} placeholder="••••••••" />
            </div>

            {!isLogin && (
              <div style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '8px', border: '1px solid #eee', marginBottom: '1.5rem' }}>
                <span style={{ fontWeight: 'bold', fontSize: '0.85rem', display: 'block', marginBottom: '10px', color: 'var(--clr-black)' }}>Préférences d'Alertes :</span>
                
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', marginBottom: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" name="notifyNews" checked={formData.notifyNews} onChange={handleCheckboxChange} style={{ accentColor: 'var(--clr-primary)' }} />
                  Recevoir les actualités & communiqués
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', marginBottom: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" name="notifyMatchStart" checked={formData.notifyMatchStart} onChange={handleCheckboxChange} style={{ accentColor: 'var(--clr-primary)' }} />
                  Alerte : Début de match
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', marginBottom: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" name="notifyGoals" checked={formData.notifyGoals} onChange={handleCheckboxChange} style={{ accentColor: 'var(--clr-primary)' }} />
                  Alerte : Buts en temps réel
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', marginBottom: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" name="notifyHalfTime" checked={formData.notifyHalfTime} onChange={handleCheckboxChange} style={{ accentColor: 'var(--clr-primary)' }} />
                  Alerte : Score mi-temps
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', cursor: 'pointer' }}>
                  <input type="checkbox" name="notifyFinalScore" checked={formData.notifyFinalScore} onChange={handleCheckboxChange} style={{ accentColor: 'var(--clr-primary)' }} />
                  Alerte : Score final
                </label>
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '1.1rem', marginTop: '1rem' }}
            >
              {isLogin ? (
                <>Se Connecter <LogIn size={18} /></>
              ) : (
                <>Créer mon Compte <UserPlus size={18} /></>
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--clr-gray)' }}>
              {isLogin ? "Pas encore de compte ?" : "Déjà membre ?"}
            </span>{' '}
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setMessage('');
              }}
              style={{ background: 'none', border: 'none', color: 'var(--clr-primary)', fontWeight: 'bold', cursor: 'pointer', padding: 0 }}
            >
              {isLogin ? "Créer un compte" : "Se connecter"}
            </button>
          </div>

        </motion.div>
      )}

    </div>
  );
}
