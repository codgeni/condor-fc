"use client";

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

const INITIAL_NEWS = [
  {
    id: 1,
    cat: "Match",
    date: "Il y a 2 heures",
    title: "Le Condor FC décroche une victoire cruciale à l'extérieur",
    desc: "Une performance époustouflante en seconde période assure les trois points sur la route.",
    img: "/player_action_1_1780681882713.png"
  },
  {
    id: 2,
    cat: "Transferts",
    date: "Il y a 5 heures",
    title: "Nouvelle recrue officiellement dévoilée à l'Arène",
    desc: "Le club renforce sa ligne offensive avec l'arrivée d'un jeune international prometteur.",
    img: "/condor_jersey_1780681923538.png"
  },
  {
    id: 3,
    cat: "Entraîneur",
    date: "Il y a 1 jour",
    title: "Conférence de presse : \"Nous sommes prêts pour le championnat\"",
    desc: "Le staff technique exprime sa confiance totale avant la reprise de la saison officielle.",
    img: "/player_action_2_1780681894021.png"
  },
  {
    id: 4,
    cat: "Match",
    date: "Il y a 2 jours",
    title: "Le Onze de départ annoncé pour le match de ce soir",
    desc: "Découvrez les titulaires choisis pour débuter la rencontre face à notre grand rival.",
    img: "/player_action_1_1780681882713.png"
  },
  {
    id: 5,
    cat: "Entraînement",
    date: "Il y a 3 jours",
    title: "Galerie d'entraînement : Derniers préparatifs avant la coupe",
    desc: "Les meilleures photos de la dernière séance d'entraînement axée sur le travail tactique.",
    img: "/stadium_hero_1780681869623.png"
  },
  {
    id: 6,
    cat: "Récompense",
    date: "Il y a 4 jours",
    title: "Le titre de Joueur du Mois décerné au Capitaine de l'équipe",
    desc: "Auteur de prestations exceptionnelles, notre numéro 10 est élu joueur du mois par les supporters.",
    img: "/trophy_moment_1780681956500.png"
  },
  {
    id: 7,
    cat: "Match",
    date: "Il y a 5 jours",
    title: "Résumé du Match : Condor FC 3 - 0 Sporting",
    desc: "Retour en vidéo et en chiffres sur la démonstration collective de nos joueurs ce week-end.",
    img: "/player_action_1_1780681882713.png"
  },
  {
    id: 8,
    cat: "Académie",
    date: "Il y a 1 semaine",
    title: "Les U19 remportent une victoire tardive en Youth League",
    desc: "Un but libérateur dans les arrêts de jeu permet à nos jeunes de décrocher les trois points.",
    img: "/stadium_hero_1780681869623.png"
  },
  {
    id: 9,
    cat: "Académie",
    date: "Il y a 1 semaine",
    title: "Le directeur de l'Académie sur la nouvelle génération",
    desc: "Entretien exclusif sur la philosophie de formation et le développement des jeunes talents.",
    img: "/club_hero.png"
  }
];

const OLDER_NEWS = [
  {
    id: 10,
    cat: "Académie",
    date: "Il y a 2 semaines",
    title: "Trois joueurs U17 appelés avec l'équipe première",
    desc: "Une juste récompense pour nos jeunes espoirs qui intègrent le groupe d'entraînement professionnel.",
    img: "/player_action_2_1780681894021.png"
  },
  {
    id: 11,
    cat: "Partenariat",
    date: "Il y a 3 semaines",
    title: "Le Condor FC annonce un nouveau partenariat technologique",
    desc: "Un accord stratégique majeur visant à moderniser les infrastructures d'analyse sportive.",
    img: "/universe_bg.png"
  },
  {
    id: 12,
    cat: "Club",
    date: "Il y a 1 mois",
    title: "Résultats financiers pour la saison 2025/2026",
    desc: "Le club présente son bilan annuel affichant une croissance saine et des investissements accrus.",
    img: "/club_hero.png"
  }
];

export default function News() {
  const [allNews, setAllNews] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const { data } = await supabase
          .from('news')
          .select('*')
          .order('created_at', { ascending: false });
        if (data && data.length > 0) {
          setAllNews(data);
        } else {
          setAllNews(INITIAL_NEWS);
        }
      } catch (err) {
        console.warn("Supabase fetch failed, falling back to local news list", err);
        setAllNews(INITIAL_NEWS);
      }
    };
    fetchNews();
  }, []);

  const handleLoadMore = () => {
    setAllNews(prev => [...prev, ...OLDER_NEWS]);
    setHasMore(false);
  };

  return (
    <div style={{ flex: 1, marginTop: '80px', overflowX: 'hidden' }}>
      
      {/* Page Header */}
      <section 
        className="section-padding bg-black text-white" 
        style={{ 
          textAlign: 'center', 
          position: 'relative', 
          overflow: 'hidden',
          padding: '120px 0 80px',
          background: 'linear-gradient(rgba(17,17,17,0.7), rgba(17,17,17,0.9)), url(/news_hero.png) center/cover no-repeat'
        }}
      >
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }} style={{ position: 'relative', zIndex: 10 }}>
          <span style={{ color: 'var(--clr-primary)', letterSpacing: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}>Le Journal du Condor</span>
          <h1 className="hero-title" style={{ color: 'white', fontSize: '3.5rem', marginTop: '10px' }}>Actualités du Club</h1>
          <p style={{ fontSize: '1.2rem', color: '#ccc', maxWidth: '600px', margin: '15px auto 0' }}>Retrouvez tous les communiqués, transferts, entraînements et résumés de matchs en une liste unique.</p>
        </motion.div>
      </section>

      {/* Rubrique unique Actualités */}
      <section className="section-padding" style={{ background: 'var(--clr-white)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
            {allNews.map((news, i) => (
              <motion.div 
                key={news.id} 
                style={{ 
                  background: 'white', 
                  borderRadius: '12px', 
                  overflow: 'hidden', 
                  boxShadow: '0 8px 25px rgba(0,0,0,0.05)', 
                  cursor: 'pointer',
                  border: '1px solid #eee',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '450px'
                }}
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.4, delay: (i % 3) * 0.1 }}
                whileHover={{ y: -8, boxShadow: '0 15px 35px rgba(0,0,0,0.1)' }}
              >
                {/* Image */}
                <div style={{ height: '220px', position: 'relative', overflow: 'hidden' }}>
                  <img src={news.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={news.title} />
                  <span style={{ position: 'absolute', top: '15px', left: '15px', background: 'var(--clr-primary)', color: 'white', padding: '4px 10px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', borderRadius: '4px' }}>
                    {news.cat}
                  </span>
                </div>

                {/* Body Content */}
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ color: 'var(--clr-gray)', fontSize: '0.8rem', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                      {news.date}
                    </span>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', margin: '0 0 10px', color: 'var(--clr-black)', lineHeight: 1.3 }}>
                      {news.title}
                    </h3>
                    <p style={{ color: '#666', fontSize: '0.9rem', margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {news.desc}
                    </p>
                  </div>

                  <span style={{ color: 'var(--clr-primary)', fontWeight: 'bold', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '10px' }}>
                    Lire l'article <ArrowRight size={14} />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Défilement / Chargement des anciennes actualités */}
          {hasMore && (
            <div style={{ textAlign: 'center', marginTop: '4rem' }}>
              <button 
                onClick={handleLoadMore} 
                className="btn btn-primary"
                style={{ padding: '15px 40px', fontSize: '1.1rem' }}
              >
                Charger plus d'actualités
              </button>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
