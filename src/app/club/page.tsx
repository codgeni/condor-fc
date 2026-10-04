"use client";

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  fetchStaff, StaffMember, DEFAULT_STAFF,
  fetchTimeline, TimelineItem, DEFAULT_TIMELINE,
  fetchSiteContent, SiteContent, DEFAULT_SITE_CONTENT
} from '@/lib/dataService';

export default function Club() {
  const [staff, setStaff] = useState<StaffMember[]>(DEFAULT_STAFF);
  const [timeline, setTimeline] = useState<TimelineItem[]>(DEFAULT_TIMELINE);
  const [siteContent, setSiteContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);

  useEffect(() => {
    fetchStaff().then(data => {
      if (data && data.length > 0) setStaff(data);
    });
    fetchTimeline().then(data => {
      if (data && data.length > 0) setTimeline(data);
    });
    fetchSiteContent().then(data => {
      if (data) setSiteContent(data);
    });
  }, []);

  return (
    <div style={{ flex: 1, marginTop: '80px', overflowX: 'hidden' }}>
      
      {/* 1. Page Header */}
      <section 
        className="section-padding bg-black text-white" 
        style={{ 
          textAlign: 'center', 
          padding: '100px 0', 
          position: 'relative', 
          overflow: 'hidden',
          background: 'linear-gradient(rgba(17,17,17,0.7), rgba(17,17,17,0.9)), url(/club_hero.png) center/cover no-repeat'
        }}
      >
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }} style={{ position: 'relative', zIndex: 10 }}>
          <img src="/condor_logo_transparent.png" alt="Condor FC" style={{ width: '150px', margin: '0 auto 2rem', borderRadius: '50%' }} />
          <h1 className="hero-title" style={{ color: 'white' }}>{siteContent.about_title || "Plus Qu'une École, Une Famille."}</h1>
          <p style={{ fontSize: '1.5rem', color: 'var(--clr-gray)', maxWidth: '800px', margin: '0 auto', lineHeight: 1.6 }}>
            {siteContent.about_text || "Depuis Mai 2023, la Condor École de Football est un symbole d'excellence, d'éducation et de passion sportive à Delmas, Haïti. Nous formons les leaders et les champions de demain."}
          </p>
        </motion.div>
      </section>

      {/* Philosophie & Objectifs de Coaching */}
      <section className="section-padding" style={{ background: '#fdfdfd', borderBottom: '1px solid #eee' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ color: 'var(--clr-primary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>Notre Philosophie</span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', margin: '5px 0' }}>Philosophie de Coaching</h2>
            <p style={{ color: 'var(--clr-gray)', fontSize: '1.1rem', marginTop: '10px' }}>Notre philosophie de coaching des joueurs s’articule autour des objectifs fondamentaux suivants :</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[
              { num: "1", text: "Contribuer au développement et à la pleine maturité de l’étudiant-athlète." },
              { num: "2", text: "Former l’athlète au leadership." },
              { num: "3", text: "Encourager l’athlète à réussir ses études." },
              { num: "4", text: "Rendre l'athlète concerné et conscient de l'importance de sa discipline et de son engagement dans tous les domaines de sa vie." },
              { num: "5", text: "Développer, affiner et enseigner des valeurs de l’école." },
              { num: "6", text: "Enseigner la pratique de l’excellence en compétition." },
              { num: "7", text: "Encourager l'étudiant-athlète à se préoccuper de son attitude dans le processus éducatif global." }
            ].map((obj) => (
              <motion.div 
                key={obj.num}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', border: '1px solid #f0f0f0' }}
              >
                <div style={{ width: '40px', height: '40px', background: 'var(--clr-primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', flexShrink: 0 }}>
                  {obj.num}
                </div>
                <p style={{ fontSize: '1.15rem', color: '#333', margin: '8px 0 0', lineHeight: 1.5 }}>{obj.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Valeurs Spirituelles, Civiques, Sociales et Morales */}
      <section className="section-padding" style={{ background: '#f5f7fa' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span style={{ color: 'var(--clr-primary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>Fondation Morale</span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', margin: '5px 0' }}>Nos Valeurs & Engagements</h2>
            <p style={{ color: 'var(--clr-gray)', maxWidth: '800px', margin: '15px auto 0', fontSize: '1.15rem', lineHeight: 1.6 }}>
              Nos valeurs influencent nos choix, nos actions ainsi que notre satisfaction de vie parce que notre vie concorde avec les valeurs qui sont des références déterminantes pour notre vie personnelle et professionnelle. Ces valeurs spirituelles, civiques et morales que nous inculquons à nos élèves les canaliseront à prendre des décisions futures qui reflètent des actions et des croyances orientées vers la satisfaction des besoins individuels et collectifs.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', marginBottom: '4rem' }}>
            
            {/* Dieu */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ background: 'white', padding: '2.5rem', borderRadius: '16px', border: '1px solid #eee', boxShadow: '0 8px 30px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1.5rem' }}>
                <div style={{ width: '50px', height: '50px', background: 'rgba(224, 30, 38, 0.1)', color: 'var(--clr-primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>✝</div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', margin: 0 }}>Dieu</h3>
              </div>
              <p style={{ color: '#555', lineHeight: 1.6 }}>Nous plaçons la foi et la reconnaissance au cœur de notre développement. L’humilité devant le Créateur forge le caractère de nos athlètes.</p>
            </motion.div>

            {/* Patrie */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} style={{ background: 'white', padding: '2.5rem', borderRadius: '16px', border: '1px solid #eee', boxShadow: '0 8px 30px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1.5rem' }}>
                <div style={{ width: '50px', height: '50px', background: 'rgba(224, 30, 38, 0.1)', color: 'var(--clr-primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>🇭🇹</div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', margin: 0 }}>Patrie</h3>
              </div>
              <p style={{ color: '#555', lineHeight: 1.6 }}>L'amour de notre pays, Haïti, et la volonté de faire briller notre nation sur l'échiquier sportif international guident notre travail quotidien.</p>
            </motion.div>

            {/* Discipline */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} style={{ background: 'white', padding: '2.5rem', borderRadius: '16px', border: '1px solid #eee', boxShadow: '0 8px 30px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1.5rem' }}>
                <div style={{ width: '50px', height: '50px', background: 'rgba(224, 30, 38, 0.1)', color: 'var(--clr-primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>⚡</div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', margin: 0 }}>Discipline</h3>
              </div>
              <p style={{ color: '#555', lineHeight: 1.6 }}>La rigueur et l'auto-discipline sont les clés pour transformer le talent brut en excellence durable, sur le terrain comme à l'école.</p>
            </motion.div>
          </div>

          {/* Grille des 6 Piliers Fondamentaux */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {[
              {
                title: "Courtoisie",
                subtitle: "être respectueux et gentil",
                desc: "Le respect est la capacité de voir et d'apprécier notre valeur et celle des autres dans un contexte de diversité sociale."
              },
              {
                title: "Fraternité",
                subtitle: "être solidaire et se faire des amis",
                desc: "Le football favorise l'amitié, aide à créer un esprit d'équipe et à comprendre le pouvoir du travail d'équipe."
              },
              {
                title: "Confidence",
                subtitle: "avoir une confiance tranquille",
                desc: "La confiance est synonyme de puissance et elle fera passer le jeu au niveau supérieur, tandis que l'arrogance fera de soi une cible."
              },
              {
                title: "Responsabilité",
                subtitle: "s'engager à son équipe",
                desc: "La responsabilité est importante car elle donne un sens au but en plus de renforcer la résilience face à l'adversité."
              },
              {
                title: "Excellence",
                subtitle: "dépasser les attentes",
                desc: "L'excellence vient d'un travail acharné, de normes élevées et d'un engagement continu dans chaque entraînement."
              },
              {
                title: "Plaisir",
                subtitle: "s'amuser avec passion",
                desc: "Le plaisir est toujours au top des raisons pour lesquelles les enfants pratiquent le football."
              }
            ].map((val, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: (idx % 3) * 0.1 }}
                style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #eee', boxShadow: '0 4px 15px rgba(0,0,0,0.01)' }}
              >
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', color: 'var(--clr-primary)', margin: '0 0 5px' }}>{val.title}</h3>
                <span style={{ fontSize: '0.9rem', color: '#888', fontStyle: 'italic', display: 'block', marginBottom: '15px', textTransform: 'uppercase' }}>{val.subtitle}</span>
                <p style={{ fontSize: '0.95rem', color: '#555', lineHeight: 1.6, margin: 0 }}>{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Timeline Historique Dynamique */}
      <section className="section-padding bg-gray">
        <div className="container">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', marginBottom: '3rem', textAlign: 'center' }}>Notre Parcours & Palmarès</h2>
          <div style={{ position: 'relative', borderLeft: '4px solid var(--clr-primary)', marginLeft: '20px', paddingLeft: '40px', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {[...timeline].sort((a, b) => (a.order || 0) - (b.order || 0)).map((era, i) => (
              <motion.div key={era.id || i} initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-50px', top: 0, width: '16px', height: '16px', background: 'var(--clr-primary)', borderRadius: '50%', border: '4px solid white' }}></div>
                <h3 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', color: 'var(--clr-primary)', margin: 0 }}>{era.year}</h3>
                <h4 style={{ fontSize: '1.5rem', margin: '5px 0' }}>{era.title}</h4>
                <p style={{ color: 'var(--clr-black-light)', fontSize: '1.1rem', maxWidth: '600px' }}>{era.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Section Staff Dynamique */}
      <section className="section-padding" style={{ background: 'var(--clr-white)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span style={{ color: 'var(--clr-primary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>L'Équipe d'Encadrement</span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', margin: '5px 0' }}>Notre Staff</h2>
            <p style={{ color: 'var(--clr-gray)', maxWidth: '600px', margin: '10px auto 0' }}>Découvrez les professionnels dévoués qui encadrent, guident et développent le potentiel de chaque jeune athlète au quotidien.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2.5rem' }}>
            {[...staff].sort((a, b) => (a.order || 0) - (b.order || 0)).map((member, i) => (
              <motion.div
                key={member.id || i}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.04)',
                  border: '1px solid #eee',
                  textAlign: 'center',
                  padding: '2rem 1.5rem'
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{ y: -5, boxShadow: '0 12px 30px rgba(0,0,0,0.08)' }}
              >
                <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto 1.5rem', border: '3px solid var(--clr-primary)' }}>
                  <img src={member.img || '/condor_logo_transparent.png'} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <h3 style={{ fontSize: '1.4rem', margin: '0 0 5px', color: 'var(--clr-black)', fontFamily: 'var(--font-body)', fontWeight: 'bold' }}>{member.name}</h3>
                <span style={{ color: 'var(--clr-primary)', fontSize: '1rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>{member.role}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. L'Hymne de Condor */}
      <section className="section-padding" style={{ background: 'linear-gradient(rgba(224, 30, 38, 0.9), rgba(224, 30, 38, 0.95)), url(/club_hero.png) center/cover', color: 'white' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', marginBottom: '2rem', color: 'white' }}>L'Hymne de Condor</h2>
          <div style={{ fontSize: '1.2rem', lineHeight: 1.8, fontStyle: 'italic', background: 'rgba(0,0,0,0.2)', padding: '3rem', borderRadius: '16px' }}>
            <p style={{ marginBottom: '1.5rem' }}>
              <strong style={{ color: 'black' }}>(Couplet 1)</strong><br />
              Pas à pas nous traçons notre chemin, Jusqu'à toucher le ciel, notre destin.<br />
              Déployons nos ailes, voguons sans limite, Élargissons nos horizons, vivons l'infini.
            </p>
            <p style={{ marginBottom: '1.5rem', fontWeight: 'bold' }}>
              <strong style={{ color: 'black' }}>(Refrain)</strong><br />
              Travaillons dur pour être des élites, Pensons constructivement, unissons nos passions.<br />
              Évoluons harmonieusement, sans peur ni frayeur, Ensemble, atteignons les sommets avec grandeur.
            </p>
            <p style={{ marginBottom: '1.5rem' }}>
              <strong style={{ color: 'black' }}>(Couplet 2)</strong><br />
              N'abandonnons jamais, poursuivons nos rêves, Concrétisons nos aspirations, qu'ils s'élèvent.<br />
              Nous sommes le changement, l'avenir de demain, Unis par le cordon, jamais nous ne faisons le vain.
            </p>
            <p style={{ marginBottom: '1.5rem' }}>
              <strong style={{ color: 'black' }}>(Pont)</strong><br />
              Les plus forts, les plus hauts dans le score, Unis dans l'effort, nous gravirons les échelons,<br />
              Dans l'unité, nous trouvons notre puissance, Porteurs d'espoir, symboles de persévérance.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
