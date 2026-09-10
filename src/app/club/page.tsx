"use client";

import { motion } from 'framer-motion';

const STAFF_MEMBERS = [
  {
    name: "Jean-Claude Valme",
    role: "Directeur Technique",
    img: "/condor_logo_transparent.png"
  },
  {
    name: "Pierre-Richard Guerrier",
    role: "Entraîneur Principal U17",
    img: "/player_action_2_1780681894021.png"
  },
  {
    name: "Dieudonné Lamothe",
    role: "Préparateur Physique",
    img: "/stadium_hero_1780681869623.png"
  },
  {
    name: "Marise Lafontant",
    role: "Secrétaire Générale",
    img: "/club_hero.png"
  }
];

export default function Club() {
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
          <img src="/condor_logo_transparent.png" style={{ width: '150px', margin: '0 auto 2rem', borderRadius: '50%' }} />
          <h1 className="hero-title" style={{ color: 'white' }}>Plus Qu'une École, Une Famille.</h1>
          <p style={{ fontSize: '1.5rem', color: 'var(--clr-gray)', maxWidth: '800px', margin: '0 auto', lineHeight: 1.6 }}>Depuis Mai 2023, la Condor École de Football est un symbole d'excellence, d'éducation et de passion sportive à Delmas, Haïti. Nous formons les leaders et les champions de demain.</p>
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
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--clr-primary)', marginBottom: '15px', borderBottom: '2px solid var(--clr-primary)', paddingBottom: '8px' }}>Dieu</h3>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.6, color: '#444', marginBottom: '15px' }}>
                Le véritable service est indissociable de l'amour qui est plus qu'un sentiment, mais Dieu Lui-même. Alors, quand nous servons les autres, nous servons en réalité Dieu. Pendant que nous reconnaissons et respectons Son autorité suprême, nous adorons Dieu en faisant preuve d'amour et de gentillesse les uns envers les autres. Nous motivons les enfants à honorer Dieu en tout temps et dans tous les domaines à travers :
              </p>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '1rem', color: '#555' }}>
                <li>Leur comportement dans leur famille et dans la société.</li>
                <li>Leur façon de parler et de travailler.</li>
                <li>Leur aide au prochain, croyants et incroyants.</li>
                <li>L'exprimer de leur reconnaissance à Dieu.</li>
                <li>La manifestation d'un esprit de soumission et d'humilité.</li>
              </ul>
            </motion.div>

            {/* Patrie */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} style={{ background: 'white', padding: '2.5rem', borderRadius: '16px', border: '1px solid #eee', boxShadow: '0 8px 30px rgba(0,0,0,0.02)' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--clr-primary)', marginBottom: '15px', borderBottom: '2px solid var(--clr-primary)', paddingBottom: '8px' }}>Patrie</h3>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.6, color: '#444', marginBottom: '15px' }}>
                Nous enseignons aux enfants d'être non seulement de bons joueurs de football mais aussi de bons citoyens. Nous leur inculquons le sentiment de dévotion, d'attachement et d'engagement au pays. Nous les conscientisons sur la restitution et l'obligation d'allégeance, de loyauté et d'unité visés à accroître et/ou maintenir leur amour du pays.
              </p>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '1rem', color: '#555' }}>
                <li>Nous prônons le vivre-ensemble et la recherche collective des réponses aux problématiques de la société en abordant des questions de pouvoir et de droit ainsi que les causes et effets de l'action citoyenne et politique.</li>
                <li>À travers ces 3 valeurs fondamentales (le civisme, la civilité et la solidarité), nous promouvons la citoyenneté au sein de l'école. Cet apprentissage apporte aux élèves une sensibilisation, des connaissances et le savoir-faire nécessaires pour jouer un rôle dans la société aux niveaux local, national et international pour en faire des citoyens informés et responsables.</li>
              </ul>
            </motion.div>

            {/* Service */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} style={{ background: 'white', padding: '2.5rem', borderRadius: '16px', border: '1px solid #eee', boxShadow: '0 8px 30px rgba(0,0,0,0.02)' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--clr-primary)', marginBottom: '15px', borderBottom: '2px solid var(--clr-primary)', paddingBottom: '8px' }}>Service</h3>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.6, color: '#444', marginBottom: '15px' }}>
                Notre motivation pour servir les autres réside dans notre compréhension du dessein de Dieu pour l'humanité. Nous expliquons aux enfants que chaque geste compte pour créer une société plus juste, plus équitable, et pour aider ceux qui en ont besoin. Nous les incitons ainsi à multiplier des petits gestes qui auront un impact positif sur l'école, l'équipe, la famille, la communauté ou l'environnement. Nous mettons l'accent sur l'esprit collectif, l'aide à l'amélioration de la zone, de l'environnement, des conditions de vies communautaires en :
              </p>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '1rem', color: '#555' }}>
                <li>Prenant soin de soi.</li>
                <li>Prenant soin des autres.</li>
                <li>Prenant soin de la planète.</li>
              </ul>
            </motion.div>

          </div>

          {/* Valeurs Fondamentales supplémentaires */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', margin: '5px 0' }}>Nos Valeurs Fondamentales</h2>
            <p style={{ color: 'var(--clr-gray)', fontSize: '1.1rem' }}>Six piliers clés qui guident la formation sportive et humaine de chaque jeune</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {[
              {
                title: "Courtoisie",
                subtitle: "être respectueux et gentil",
                desc: "Le respect est la capacité de voir et d'apprécier notre valeur et celle des autres dans un contexte de diversité sociale. Nous inculquons aux joueurs que pour vraiment réussir au football et dans la vie, ils doivent d'abord apprécier leur propre individualité, traiter toutes les personnes qui les entourent avec courtoisie, respect et empathie. Nous enseignons aux enfants à valoriser les autres tout en encourageant leurs coéquipiers et à applaudir leurs efforts même lorsque les choses vont mal. Nous encourageons les parents et les entraîneurs à être un modèle dans tout ce qu'ils font car les enfants les suivent au niveau du respect qu'ils montrent."
              },
              {
                title: "Fraternité",
                subtitle: "être solidaire et se faire des amis",
                desc: "Le football favorise l'amitié, aide à créer un esprit d'équipe et à comprendre le pouvoir du travail d'équipe. Pour les enfants, se faire des amis est un élément important du développement social. Notre école de football offre non seulement aux enfants la possibilité de se faire des amis, mais aussi de trouver un endroit où ils peuvent appartenir, développer l'estime de soi et créer un espace sûr pour parler de problèmes difficiles."
              },
              {
                title: "Confidence",
                subtitle: "avoir une confiance tranquille",
                desc: "La confiance est synonyme de puissance et elle fera passer le jeu au niveau supérieur, tandis que l'arrogance fera de soi une cible. Être humble tout en ayant une confiance tranquille dans le jeu, laisser le jeu parler par sa bouche, l'action ayant plus de poids que les mots, sont les leçons que nos footballeurs acquièrent à notre école. Lorsque nous nous sentons dignes de confiance, nous pouvons nous sentir plus à l'aise pour prendre des initiatives et accepter des responsabilités."
              },
              {
                title: "Responsabilité",
                subtitle: "s'engager à son équipe",
                desc: "La responsabilité est importante car elle donne un sens au but en plus de renforcer la résilience face à l'adversité au niveau individuel et sociétal. Échapper à la responsabilité peut être agréable à court terme, mais entraîne une souffrance exponentiellement pire à long terme. Avec la confiance vient la responsabilité : comprendre que le comportement individuel dans les séances d'entraînement et dans les jeux influence et a un impact sur la performance et l'expérience des autres. Travailler avec et pour les autres est un aspect clé dans notre école car le succès, en particulier dans le sport d'équipe, repose sur l'entraide."
              },
              {
                title: "Excellence",
                subtitle: "dépasser les attentes",
                desc: "L'excellence vient d'un travail acharné, de normes élevées et d'un engagement à travailler. Nous percevons l'excellence comme prendre l'enfant et le rendre meilleur sur et hors du terrain car c'est un petit effort constant, jour après jour, qui produit des résultats. Puisque l'excellence est une attitude, nous enseignons à nos joueurs à donner le meilleur d'eux-mêmes à chaque entraînement."
              },
              {
                title: "Plaisir",
                subtitle: "s'amuser avec passion",
                desc: "Le football est une activité amusante qui aide les enfants à rester actifs et en santé, et qui contribue au développement musculaire. Le plaisir est toujours au top des raisons pour lesquelles les enfants pratiquent le football. Certes, les footballeurs doivent s'entraîner dur pour atteindre un niveau d'élite, mais si tout n'est que travail et pas de jeu, ils ne continueront pas de jouer car le succès est déterminé par le propre désir du joueur de réussir et son amour pour l'activité. Les enfants restent toujours des enfants."
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

      {/* 2. Timeline Historique */}
      <section className="section-padding bg-gray">
        <div className="container">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', marginBottom: '3rem', textAlign: 'center' }}>Notre Parcours & Palmarès</h2>
          <div style={{ position: 'relative', borderLeft: '4px solid var(--clr-primary)', marginLeft: '20px', paddingLeft: '40px', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {[
              { y: 'Mai 2023', t: 'La Fondation', d: 'Lancement officiel de Condor École de Football à Delmas 77. L\'école est créée pour offrir un encadrement sportif et éducatif structuré aux jeunes de la communauté.' },
              { y: 'Mai 2025', t: 'Vice-Champion U13 - Flag Day 12e édition', d: 'Première distinction majeure pour l\'école, démontrant la qualité de la formation dès les plus jeunes catégories.' },
              { y: 'Septembre 2025', t: 'Champion U17 - Tournoi Back To School', d: 'Consécration pour nos aînés U17 qui remportent le titre avec un parcours sans faute.' },
              { y: 'Décembre 2025', t: 'Champion U15 - Tournoi Copa Undecima', d: 'Les U15 s\'imposent lors de ce prestigieux tournoi de fin d\'année, confirmant la montée en puissance de l\'académie.' },
              { y: 'Avril 2026', t: 'Triplé Historique - Tournoi Chale Chale 7e édition', d: 'Une performance historique inégalée : Condor est sacré Champion simultanément dans les catégories U11, U15 et U16.' },
              { y: 'Mai 2026', t: 'Vice-Champion U15 - Flag Day 13e édition', d: 'Les U15 continuent de briller au plus haut niveau en atteignant à nouveau la finale de ce tournoi majeur.' }
            ].map((era, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-50px', top: 0, width: '16px', height: '16px', background: 'var(--clr-primary)', borderRadius: '50%', border: '4px solid white' }}></div>
                <h3 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', color: 'var(--clr-primary)', margin: 0 }}>{era.y}</h3>
                <h4 style={{ fontSize: '1.5rem', margin: '5px 0' }}>{era.t}</h4>
                <p style={{ color: 'var(--clr-black-light)', fontSize: '1.1rem', maxWidth: '600px' }}>{era.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Section Staff */}
      <section className="section-padding" style={{ background: 'var(--clr-white)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span style={{ color: 'var(--clr-primary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>L'Équipe d'Encadrement</span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', margin: '5px 0' }}>Notre Staff</h2>
            <p style={{ color: 'var(--clr-gray)', maxWidth: '600px', margin: '10px auto 0' }}>Découvrez les professionnels dévoués qui encadrent, guident et développent le potentiel de chaque jeune athlète au quotidien.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2.5rem' }}>
            {STAFF_MEMBERS.map((member, i) => (
              <motion.div
                key={i}
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
                  <img src={member.img} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
