import { supabase } from './supabaseClient';
import { playersDB } from './playersDB';

export interface MatchConfig {
  id?: number | string;
  opponent: string;
  home_team?: string;
  match_date: string; // YYYY-MM-DD or formatted string
  match_time: string; // HH:MM or formatted string
  location: string;
  competition: string;
  opponent_logo?: string;
  no_matches_now: boolean;
  is_active?: boolean;
}

export interface VideoItem {
  id?: number | string;
  title: string;
  url: string;
  category: 'Résumé des matchs' | 'En coulisse' | 'Interviews & Conférences' | 'Highlights' | string;
  duration?: string;
  thumbnail?: string;
  tag?: string;
  description?: string;
  created_at?: string;
}

export interface StageSession {
  id?: number | string;
  title: string;
  dates: string;
  categories: string;
  price: string;
  time_schedule: string;
  description: string;
  is_active: boolean;
  created_at?: string;
}

export interface ShopProduct {
  id: string;
  title: string;
  category: 'match' | 'training' | 'accessories';
  category_label?: string;
  subtitle?: string;
  price: number;
  formatted_price?: string;
  tag?: string;
  tag_bg?: string;
  img: string;
  badge_text?: string;
  description: string;
  highlights?: string[];
  sizes?: string[];
  created_at?: string;
}

export interface PlayerData {
  id: string;
  name: string;
  pos: string;
  num: number;
  img: string;
  detail_img?: string;
  detailImg?: string;
  category: string;
  categories?: string[];
  role?: string;
  filter?: string;
  height?: string;
  weight?: string;
  foot?: string;
  nationality?: string;
  pob?: string;
  dob?: string;
  bio?: string;
  matches?: number;
  goals?: number;
  assists?: number;
  stat2lbl?: string;
  stat2val?: number;
  honours1?: number;
  honours2?: number;
  created_at?: string;
}

// -------------------------------------------------------------
// NEW CRUD INTERFACES: Units, Roles, Staff, Timeline, SiteContent
// -------------------------------------------------------------
export interface UnitItem {
  id: string | number;
  name: string;
  description?: string;
  order: number;
  is_active?: boolean;
  image?: string;
  created_at?: string;
}

export interface RoleItem {
  id: string | number;
  name: string;
  keywords?: string;
  order: number;
  created_at?: string;
}

export interface StaffMember {
  id: string | number;
  name: string;
  role: string;
  img: string;
  order?: number;
  created_at?: string;
}

export interface TimelineItem {
  id: string | number;
  year: string;
  title: string;
  description: string;
  order?: number;
  created_at?: string;
}

export interface PillarItem {
  title: string;
  subtitle: string;
  desc: string;
}

export interface SiteContent {
  id?: string | number;
  
  // 1. Accueil & Matchs
  hero_tag?: string;
  hero_title?: string;
  hero_slogan?: string;
  no_match_text?: string;
  
  // 2. Club Header
  about_title?: string;
  about_text?: string;

  // 2. Club Philosophie
  club_philo_tag?: string;
  club_philo_title?: string;
  club_philo_intro?: string;
  club_philo_objectives?: string[];

  // 2. Club Valeurs
  club_values_tag?: string;
  club_values_title?: string;
  club_values_intro?: string;
  club_val_god_title?: string;
  club_val_god_desc?: string;
  club_val_patrie_title?: string;
  club_val_patrie_desc?: string;
  club_val_discipline_title?: string;
  club_val_discipline_desc?: string;
  club_pillars?: PillarItem[];

  // 2. Club Staff & Timeline Headings
  club_staff_tag?: string;
  club_staff_title?: string;
  club_staff_desc?: string;
  club_timeline_title?: string;

  // 2. Club Hymne
  club_anthem_title?: string;
  club_anthem_couplet1?: string;
  club_anthem_refrain?: string;
  club_anthem_couplet2?: string;
  club_anthem_pont?: string;

  // 3. Inscription Header
  inscr_hero_tag?: string;
  inscr_hero_title?: string;
  inscr_hero_desc?: string;

  // 3. Inscription Conditions
  inscr_conditions_title?: string;
  inscr_conditions_items?: string[];

  // 3. Inscription Uniform Note
  inscr_uniform_note?: string;

  // 3. Inscription Clauses Financières
  inscr_payment_title?: string;
  inscr_payment_bullet1?: string;
  inscr_payment_bullet2?: string;
  inscr_payment_bullet3?: string;
  inscr_payment_modalities?: string;
  inscr_payment_penalties?: string;
  inscr_payment_refund?: string;
  inscr_payment_image_rights?: string;

  // 3. Inscription Clauses Médicales & Urgence
  inscr_emergency_title?: string;
  inscr_emergency_clause1?: string;
  inscr_emergency_clause2?: string;
  inscr_emergency_clause3?: string;

  // 3. Inscription Consentement Parental
  inscr_consent_intro?: string;
  inscr_consent_terms?: string;
  inscr_consent_fees?: string;
  inscr_consent_medical?: string;
  inscr_consent_pickup_label?: string;
  inscr_consent_alone_label?: string;

  // 3. Boutons & Succès
  inscr_submit_btn?: string;
  inscr_success_title?: string;
  inscr_success_desc?: string;

  // 4. Arrière-plans des bannières de sections (Navbar)
  news_hero_bg?: string;
  club_hero_bg?: string;
  teams_hero_bg?: string;
  stages_hero_bg?: string;
  shop_hero_bg?: string;
  tv_hero_bg?: string;
  inscr_hero_bg?: string;

  created_at?: string;
}

// -------------------------------------------------------------
// DEFAULTS
// -------------------------------------------------------------
export const DEFAULT_UNITS: UnitItem[] = [
  { id: 'unit-1', name: 'Équipe Première', description: 'Effectif Senior & Élite', order: 1, is_active: true, image: '/stadium_hero_1780681869623.png' },
  { id: 'unit-2', name: 'U17', description: 'Moins de 17 ans (Cadets)', order: 2, is_active: true, image: '/kick_hero.png' },
  { id: 'unit-3', name: 'U15', description: 'Moins de 15 ans (Minimes)', order: 3, is_active: true, image: '/player_action_1_1780681882713.png' },
  { id: 'unit-4', name: 'U13', description: 'Moins de 13 ans (Benjamins)', order: 4, is_active: true, image: '/trophy_moment_1780681956500.png' },
  { id: 'unit-5', name: 'U9', description: 'Moins de 9 ans (Poussins / École)', order: 5, is_active: true, image: '/player_action_2_1780681894021.png' },
  { id: 'unit-6', name: 'U8', description: 'Moins de 8 ans (Poussins)', order: 6, is_active: true, image: '/club_hero.png' },
  { id: 'unit-7', name: 'U7', description: 'Moins de 7 ans (Débutants / École de Football)', order: 7, is_active: true, image: '/soccer.png' },
];

export const DEFAULT_ROLES: RoleItem[] = [
  { id: 'role-1', name: 'Gardiens de but', keywords: 'Gardien, Goal, GK, Portier', order: 1 },
  { id: 'role-2', name: 'Défenseurs', keywords: 'Défenseur, Arrière, Latéral, Défenseure, Stoppeur, Lateral', order: 2 },
  { id: 'role-3', name: 'Milieux de terrain', keywords: 'Milieu, MDF, Relayeur, Meneur, Central, Milieue', order: 3 },
  { id: 'role-4', name: 'Attaquants', keywords: 'Attaquant, Ailier, Avant, Pointe, Buteur, Attaquante', order: 4 },
  { id: 'role-5', name: 'Effectif & Autres', keywords: 'N/A, Polyvalent, Joueur, Talent', order: 5 },
];

export const DEFAULT_STAFF: StaffMember[] = [
  { id: 'staff-1', name: 'Jean-Claude Valme', role: 'Directeur Technique', img: '/condor_logo_transparent.png', order: 1 },
  { id: 'staff-2', name: 'Pierre-Richard Guerrier', role: 'Entraîneur Principal U17', img: '/player_action_2_1780681894021.png', order: 2 },
  { id: 'staff-3', name: 'Dieudonné Lamothe', role: 'Préparateur Physique', img: '/stadium_hero_1780681869623.png', order: 3 },
  { id: 'staff-4', name: 'Marise Lafontant', role: 'Secrétaire Générale', img: '/club_hero.png', order: 4 },
];

export const DEFAULT_TIMELINE: TimelineItem[] = [
  { id: 'era-1', year: 'Mai 2023', title: 'La Fondation', description: "Lancement officiel de Condor École de Football à Delmas 77. L'école est créée pour offrir un encadrement sportif et éducatif structuré aux jeunes de la communauté.", order: 1 },
  { id: 'era-2', year: 'Mai 2025', title: 'Vice-Champion U13 - Flag Day 12e édition', description: "Première distinction majeure pour l'école, démontrant la qualité de la formation dès les plus jeunes catégories.", order: 2 },
  { id: 'era-3', year: 'Septembre 2025', title: 'Champion U17 - Tournoi Back To School', description: "Consécration pour nos aînés U17 qui remportent le titre avec un parcours sans faute.", order: 3 },
  { id: 'era-4', year: 'Décembre 2025', title: 'Champion U15 - Tournoi Copa Undecima', description: "Les U15 s'imposent lors de ce prestigieux tournoi de fin d'année, confirmant la montée en puissance de l'académie.", order: 4 },
  { id: 'era-5', year: 'Avril 2026', title: 'Triplé Historique - Tournoi Chale Chale 7e édition', description: "Une performance historique inégalée : Condor est sacré Champion simultanément dans les catégories U11, U15 et U16.", order: 5 },
  { id: 'era-6', year: 'Mai 2026', title: 'Vice-Champion U15 - Flag Day 13e édition', description: "Les U15 continuent de briller au plus haut niveau en atteignant à nouveau la finale de ce tournoi majeur.", order: 6 },
];

export const DEFAULT_PILLARS: PillarItem[] = [
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
];

export const DEFAULT_SITE_CONTENT: SiteContent = {
  // 1. Accueil & Matchs
  hero_tag: 'CHAQUE ENFANT EST UNIQUE',
  hero_title: 'Condor École de Football',
  hero_slogan: '"Plus fort, plus haut dans le score !"',
  no_match_text: "Nos équipes sont actuellement en période d'entraînement intensif et de préparation technique. Suivez nos actualités pour être tenus informés des prochaines rencontres officielles !",
  
  // 2. Club - Présentation
  about_title: "Plus Qu'une École, Une Famille.",
  about_text: "Depuis Mai 2023, la Condor École de Football est un symbole d'excellence, d'éducation et de passion sportive à Delmas, Haïti. Nous formons les leaders et les champions de demain.",
  
  // 2. Club - Philosophie
  club_philo_tag: "Notre Philosophie",
  club_philo_title: "Philosophie de Coaching",
  club_philo_intro: "Notre philosophie de coaching des joueurs s’articule autour des objectifs fondamentaux suivants :",
  club_philo_objectives: [
    "Contribuer au développement et à la pleine maturité de l’étudiant-athlète.",
    "Former l’athlète au leadership.",
    "Encourager l’athlète à réussir ses études.",
    "Rendre l'athlète concerné et conscient de l'importance de sa discipline et de son engagement dans tous les domaines de sa vie.",
    "Développer, affiner et enseigner des valeurs de l’école.",
    "Enseigner la pratique de l’excellence en compétition.",
    "Encourager l'étudiant-athlète à se préoccuper de son attitude dans le processus éducatif global."
  ],

  // 2. Club - Valeurs & Piliers
  club_values_tag: "Fondation Morale",
  club_values_title: "Nos Valeurs & Engagements",
  club_values_intro: "Nos valeurs influencent nos choix, nos actions ainsi que notre satisfaction de vie parce que notre vie concorde avec les valeurs qui sont des références déterminantes pour notre vie personnelle et professionnelle. Ces valeurs spirituelles, civiques et morales que nous inculquons à nos élèves les canaliseront à prendre des décisions futures qui reflètent des actions et des croyances orientées vers la satisfaction des besoins individuels et collectifs.",
  
  club_val_god_title: "Dieu",
  club_val_god_desc: "Nous plaçons la foi et la reconnaissance au cœur de notre développement. L’humilité devant le Créateur forge le caractère de nos athlètes.",
  club_val_patrie_title: "Patrie",
  club_val_patrie_desc: "L'amour de notre pays, Haïti, et la volonté de faire briller notre nation sur l'échiquier sportif international guident notre travail quotidien.",
  club_val_discipline_title: "Discipline",
  club_val_discipline_desc: "La rigueur et l'auto-discipline sont les clés pour transformer le talent brut en excellence durable, sur le terrain comme à l'école.",
  
  club_pillars: DEFAULT_PILLARS,

  // 2. Club Staff & Timeline Headings
  club_staff_tag: "L'Équipe d'Encadrement",
  club_staff_title: "Notre Staff",
  club_staff_desc: "Découvrez les professionnels dévoués qui encadrent, guident et développent le potentiel de chaque jeune athlète au quotidien.",
  club_timeline_title: "Notre Parcours & Palmarès",

  // 2. Club - Hymne
  club_anthem_title: "L'Hymne de Condor",
  club_anthem_couplet1: "Pas à pas nous traçons notre chemin, Jusqu'à toucher le ciel, notre destin.\nDéployons nos ailes, voguons sans limite, Élargissons nos horizons, vivons l'infini.",
  club_anthem_refrain: "Travaillons dur pour être des élites, Pensons constructivement, unissons nos passions.\nÉvoluons harmonieusement, sans peur ni frayeur, Ensemble, atteignons les sommets avec grandeur.",
  club_anthem_couplet2: "N'abandonnons jamais, poursuivons nos rêves, Concrétisons nos aspirations, qu'ils s'élèvent.\nNous sommes le changement, l'avenir de demain, Unis par le cordon, jamais nous ne faisons le vain.",
  club_anthem_pont: "Les plus forts, les plus hauts dans le score, Unis dans l'effort, nous gravirons les échelons,\nDans l'unité, nous trouvons notre puissance, Porteurs d'espoir, symboles de persévérance.",

  // 3. Inscription - En-tête
  inscr_hero_tag: "Rejoignez Condor",
  inscr_hero_title: "Formulaire d'Inscription Complet",
  inscr_hero_desc: "Veuillez remplir ce formulaire complet pour l'inscription de votre enfant. Toutes les informations sont requises pour valider l'inscription.",

  // 3. Inscription - Conditions d'inscription
  inscr_conditions_title: "CONDITIONS D'INSCRIPTION",
  inscr_conditions_items: [
    "1. L'enfant doit avoir 4 ans ou 16 au 31 août pour être éligible de s'inscrire.",
    "2. Une forme doit être remplie pour chaque enfant individuellement.",
    "3. Chaque information doit être cochée lorsque requis.",
    "4. L'inscription est considérée complète une fois que le formulaire d'inscription a été soumis avec le 1er paiement acquitté intégralement.",
    "5. Toute inscription devra être réglée dans sa totalité avant la première séance de la rentrée. À défaut, l'inscription sera considérée comme annulée.",
    "6. Une fois l'inscription effectuée. Les uniformes seront commandés."
  ],

  // 3. Inscription - Note uniforme
  inscr_uniform_note: "N.B.: Attention: Une fois la taille choisie, nous ne pourrons pas vous fournir une autre uniforme.",

  // 3. Inscription - Clauses Financières
  inscr_payment_title: "CONDITIONS DE PAIEMENT :",
  inscr_payment_bullet1: "Les frais d’admission incluent l’inscription annuelle, 2 uniformes, 1 ballon et une couverture d’assurance accident/blessure /perte de membre.",
  inscr_payment_bullet2: "Les frais de voyage et uniformes exclusifs lors des compétitions internationales ne sont pas inclus.",
  inscr_payment_bullet3: "Le tarif comprend les activités sportives, le matériel sportif, l'encadrement ainsi que les équipements standards.",
  inscr_payment_modalities: "Modalités : Paiements par chèque ou virement bancaire à l'ordre de \"CONDOR ECOLE DE FOOTBALL\", ou cash au bureau sise au # 1, Delmas 77.",
  inscr_payment_penalties: "Pénalité : Tout retard de paiement de la mensualité entrainera une pénalité de 10% par semaine de retard.",
  inscr_payment_refund: "Absence/Départ : Aucun montant déjà versé ne sera remboursé. Toute période entamée est due dans son intégralité.",
  inscr_payment_image_rights: "DROIT A L'IMAGE : Toute inscription autorise l’école à prendre et à utiliser des images et vidéos de mon enfant à des fins pédagogiques, publicitaires ou informatives.",

  // 3. Inscription - Clauses Médicales & Urgence
  inscr_emergency_title: "En cas d'urgence, d'accident, ou tout autre cas grave :",
  inscr_emergency_clause1: "Prendre toutes mesures pour la prise en charge de mon enfant selon l'avis du médecin traitant.",
  inscr_emergency_clause2: "Conduire mon enfant dans un véhicule personnel en cas de besoin médical.",
  inscr_emergency_clause3: "Donner en mon lieu et à ma place, toute autorisation pour tout acte opérateur ou d'anesthésie qui serait décidé par le corps médical.",

  // 3. Inscription - Consentement Parental
  inscr_consent_intro: "Je soussigné(e), affirme être le parent / tuteur ou gardien de l'enfant dont le nom figure ci-dessus. En son nom, je consens par la présente à ce qui précède, et adhère mon enfant à participer à toutes les activités organisées par l'école.",
  inscr_consent_terms: "Je reconnais avoir lu et approuvé toutes les conditions stipulées dans ce document (paiement, doit d'image, suivi médical).",
  inscr_consent_fees: "Je déclare avoir pris connaissance des tarifs de l'école et m'engage à verser la somme convenue.",
  inscr_consent_medical: "Je m'engage à fournir un certificat médical datant d'au moins 1 mois le jour de la rentrée.",
  inscr_consent_pickup_label: "À la fin de chaque entraînement, à defaut de venir personnellement chercher mon enfant, j'autorise :",
  inscr_consent_alone_label: "Mon enfant mineur à rentrer chez lui/elle par ses propres moyens.",

  // 3. Boutons & Succès
  inscr_submit_btn: "Envoyer l'inscription complète",
  inscr_success_title: "Inscription Enregistrée !",
  inscr_success_desc: "Votre dossier a été transmis avec succès. Notre équipe administrative traitera votre demande dans les plus brefs délais.",

  // 4. Arrière-plans des bannières de sections (Navbar)
  news_hero_bg: '/news_hero.png',
  club_hero_bg: '/club_hero.png',
  teams_hero_bg: '/kick_hero.png',
  stages_hero_bg: '/stadium_hero_1780681869623.png',
  shop_hero_bg: '/shop_hero.png',
  tv_hero_bg: '/stadium_hero_1780681869623.png',
  inscr_hero_bg: ''
};

export const DEFAULT_PRODUCTS: ShopProduct[] = [
  {
    id: 'kit-officiel-polo-condor',
    title: 'Kit Officiel Match Polo 26/27',
    category: 'match',
    category_label: 'Tenue Officielle Domicile',
    subtitle: 'Tenue Complète : Polo, Short #17 & Chaussettes',
    price: 65,
    formatted_price: '65.00 $',
    tag: 'DOMICILE',
    tag_bg: 'var(--clr-primary)',
    img: '/shop/kit_officiel_polo_condor.png',
    badge_text: 'Pack Complet 3 Pièces',
    description: "La tenue officielle complète de référence du Condor FC pour la saison 2026/27. Polo bicolore rouge rubis et noir avec col classique boutonné, grand blason Condor Edu-Sport Académie et drapeau national haïtien sur l'ourlet. Inclus le short de match noir numéroté 17 et les chaussettes hautes bicolores assorties.",
    highlights: [
      'Pack complet 3 pièces : Maillot Polo + Short + Chaussettes',
      'Écusson brodé Condor Edu-Sport Académie & drapeau Haïti',
      'Dos floqué "NOM 17" personnalisable avec votre nom',
      'Tissu respirant haute durabilité adapté au climat des Caraïbes'
    ],
    sizes: ['Enfant (8-12 ans)', 'S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: 'kit-officiel-exterieur-blanc',
    title: 'Kit Officiel Extérieur 26/27 - Blanc',
    category: 'match',
    category_label: 'Tenue Officielle Extérieure',
    subtitle: 'Maillot Blanc Rayé Pinceau, Short #08 & Chaussettes',
    price: 65,
    formatted_price: '65.00 $',
    tag: 'EXTÉRIEUR',
    tag_bg: '#0284c7',
    img: '/shop/kit_officiel_exterieur_blanc.png',
    badge_text: 'Pack Complet 3 Pièces',
    description: "La tenue officielle extérieure du Condor FC. Design blanc éclatant avec rayures horizontales artistiques rouges et noires effet coups de pinceau, sponsor officiel DNC, drapeau d'Haïti sur l'ourlet, dos orné de la devise officielle \"Plus fort, plus haut dans le score\" et verset PS60:12, short blanc assorti #08 et chaussettes blanches avec aigle Condor.",
    highlights: [
      'Pack complet 3 pièces : Maillot extérieur + Short #08 + Chaussettes',
      'Design exclusif coups de pinceau dynamique rouge & noir',
      'Devise officielle du club "Plus fort, plus haut dans le score"',
      'Détails haute précision : écussons club et drapeau d\'Haïti'
    ],
    sizes: ['Enfant (8-12 ans)', 'S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: 'kit-third-alveoles-lave',
    title: 'Kit Third 26/27 - Alvéoles & Lave',
    category: 'match',
    category_label: 'Tenue Third Spéciale',
    subtitle: 'Maillot Graphique Grunge, Short à Vagues & Détails',
    price: 65,
    formatted_price: '65.00 $',
    tag: 'THIRD PRO',
    tag_bg: '#475569',
    img: '/shop/kit_third_alveoles_lave.png',
    badge_text: 'Édition Graphique',
    description: "L'édition alternative spectaculaire de la saison 2026/27. Maillot noir et blanc à trame nid d'abeille avec estafilade diagonale rouge lave, sponsor DNC, manche asymétrique blanche avec aigle Condor et drapeau national, dos avec devise officielle du club, et short noir à liserés ondulés blancs et numéro 00.",
    highlights: [
      'Motif alvéolaire haute définition et griffure rouge lave',
      'Manche gauche asymétrique blanche avec blason club',
      'Short noir exclusif à liserés ondulés aérodynamiques',
      'Dos floqué avec devise du club et verset PS60:12'
    ],
    sizes: ['Enfant (8-12 ans)', 'S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: 'maillot-match-pro-marbre',
    title: 'Maillot Match Pro 26/27 - Noir & Rouge Marbré',
    category: 'match',
    category_label: 'Maillot de Match Pro',
    subtitle: 'Motif Fusion Marbré & Sponsor Officiel DNC',
    price: 50,
    formatted_price: '50.00 $',
    tag: 'PRO MATCH',
    tag_bg: '#0f172a',
    badge_text: 'Top Vente',
    img: '/shop/maillot_match_pro_marbre.png',
    description: "Le nouveau maillot de match Pro sensationnel du club. Arborant une texture de lave marbrée rouge feu sur fond noir profond, un col en V athlétique rehaussé de rouge, le logo sponsor officiel DNC en blanc contrasté, et le blason de l'académie.",
    highlights: [
      'Sublimation numérique haute définition effet marbré',
      'Col V athlétique renforcé et finitions bords-côtes',
      'Sponsor officiel DNC et écusson Condor thermo-appliqué',
      'Coupe moderne ergonomique favorisant l\'agilité'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: 'short-chaussettes-pro-marbre',
    title: 'Short & Chaussettes Match Pro - Marbré',
    category: 'match',
    category_label: 'Ensemble Bas Match Pro',
    subtitle: 'Ensemble Bas Officiel Marbré Assorti',
    price: 30,
    formatted_price: '30.00 $',
    tag: 'BAS ASSORTI',
    tag_bg: '#334155',
    badge_text: 'Complément Pro',
    img: '/shop/short_chaussettes_pro_marbre.png',
    description: "Le complément parfait du maillot Match Pro marbré. Short noir orné de la texture marbrée rouge et du blason Condor FC, accompagné de la paire de chaussettes hautes de compression coordonnées avec l'écusson du club.",
    highlights: [
      'Design texturé assorti au Maillot Match Pro 26/27',
      'Ceinture élastique ultra-confortable avec cordon de serrage',
      'Chaussettes montantes anatomiques avec maintien voûte plantaire',
      'Renforts amortissants au talon et aux orteils'
    ],
    sizes: ['Taille Unique Adulte', 'Taille Junior']
  },
  {
    id: 'kit-officiel-polo-sleeves',
    title: 'Kit Officiel Polo - Édition Manches',
    category: 'match',
    category_label: 'Tenue Officielle Club',
    subtitle: 'Torse Épuré & Badges sur Manches',
    price: 65,
    formatted_price: '65.00 $',
    tag: 'OFFICIEL',
    tag_bg: 'var(--clr-primary)',
    badge_text: 'Édition Club',
    img: '/shop/kit_officiel_polo_sleeves.png',
    description: "Une variante raffinée du polo officiel avec blason circulaire sur le cœur et logos Condor Edu-Sport Académie élégamment disposés sur les manches. Coupe droite impeccable, col polo contrasté, short noir n°17 et chaussettes de performance.",
    highlights: [
      'Finition torse épurée avec écusson club sur le cœur',
      'Double marquage aigle Condor sur chaque manche',
      'Short noir compétition et chaussettes techniques inclus',
      'Confort athlétique stretch et résistant'
    ],
    sizes: ['Enfant (8-12 ans)', 'S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: 'kit-entrainement-pro-rouge-10',
    title: 'Kit Entraînement Pro Rouge #10',
    category: 'training',
    category_label: 'Entraînement Pro',
    subtitle: 'Débardeur Rouge #10, Short Assorti & Devise Club',
    price: 45,
    formatted_price: '45.00 $',
    tag: 'PRO TRAINING',
    tag_bg: '#dc2626',
    badge_text: 'Pack Entraînement',
    img: '/shop/kit_entrainement_pro_rouge_10.png',
    description: "L'ensemble d'entraînement sans manches officiel porté par les équipes élite de l'Académie Condor. Débardeur rouge avec empiècements courbes aérodynamiques noir et blanc, sponsor DNC, dos complet avec numéro 10 et devise du club \"Plus fort, plus haut dans le score\", et short rouge n°10 coordonné.",
    highlights: [
      'Ensemble 2 pièces : Débardeur d\'entraînement + Short n°10',
      'Dos floqué "NAME 10", PS60:12 et devise officielle',
      'Maille légère anti-humidité et régulation thermique',
      'Short à découpes ergonomiques avec écusson club'
    ],
    sizes: ['Enfant (6-10 ans)', 'Enfant (11-14 ans)', 'S', 'M', 'L', 'XL']
  },
  {
    id: 'kit-entrainement-debardeur-rouge',
    title: 'Kit Entraînement Sans Manches DNC (#08)',
    category: 'training',
    category_label: 'Entraînement Académie',
    subtitle: 'Débardeur Rouge, Short #08 & Chaussettes Rayées',
    price: 45,
    formatted_price: '45.00 $',
    tag: 'ENTRAÎNEMENT',
    tag_bg: '#e11d48',
    badge_text: 'Académie Condor',
    img: '/shop/kit_entrainement_debardeur_rouge.png',
    description: "L'ensemble d'entraînement sans manches classique de l'École de Football Condor. Débardeur rouge vif avec sponsor DNC, détails d'épaules noir et blanc, drapeau national haïtien à la taille, short rouge n°08 et chaussettes montantes à rayures blanches.",
    highlights: [
      'Débardeur ultra-aéré en maille alvéolée anti-transpiration',
      'Logos officiels DNC et Condor École de Football',
      'Drapeau haïtien cousu sur la base du maillot',
      'Short technique avec cordon élastique et chaussettes rayées'
    ],
    sizes: ['Enfant (6-10 ans)', 'Enfant (11-14 ans)', 'S', 'M', 'L', 'XL']
  },
  {
    id: 'debardeur-entrainement-noir-fitness',
    title: 'Débardeur Entraînement Noir Fitness',
    category: 'training',
    category_label: 'Entraînement',
    subtitle: 'Coupe Athlétique Sans Manches Noir',
    price: 28,
    formatted_price: '28.00 $',
    tag: 'FITNESS',
    tag_bg: '#1e293b',
    badge_text: 'Essentiel',
    img: '/shop/debardeur_entrainement_noir_fitness.png',
    description: "Débardeur officiel Condor sans manches, coupe athlétique respirante avec finitions bicolores rouge et blanc.",
    highlights: [
      'Coupe athlétique sans manches libérant les mouvements',
      'Écusson officiel Condor École de Football',
      'Flancs contrastés rouge et blanc',
      'Tissu technique stretch et respirant'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: 'debardeur-entrainement-blanc',
    title: 'Débardeur Entraînement Blanc Académie',
    category: 'training',
    category_label: 'Entraînement',
    subtitle: 'Coupe Athlétique Sans Manches Blanc',
    price: 28,
    formatted_price: '28.00 $',
    tag: 'ACADÉMIE',
    tag_bg: '#64748b',
    badge_text: 'Essentiel',
    img: '/shop/debardeur_entrainement_blanc.png',
    description: "Débardeur officiel blanc sans manches de l'Académie Condor avec écusson club et finitions bicolores noir et rouge.",
    highlights: [
      'Coupe athlétique sans manches haute respirabilité',
      'Écusson officiel Condor École de Football',
      'Flancs bicolores latéraux noir et rouge',
      'Tissu léger et aéré adapté aux entraînements'
    ],
    sizes: ['Enfant (8-12 ans)', 'S', 'M', 'L', 'XL', 'XXL']
  }
];

// -------------------------------------------------------------
// Helper : YouTube Link Parser (converts any youtube link to embed & extracts thumbnail)
// -------------------------------------------------------------
export function parseVideoUrl(rawUrl: string): { embedUrl: string; thumbnail: string } {
  if (!rawUrl || typeof rawUrl !== 'string') return { embedUrl: '', thumbnail: '' };
  
  const trimmed = rawUrl.trim();
  
  if (/^(javascript|vbscript|data):/i.test(trimmed)) {
    return { embedUrl: '', thumbnail: '' };
  }
  
  let videoId = '';
  const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/;
  const match = trimmed.match(ytRegex);
  
  if (match && match[1]) {
    videoId = match[1];
    return {
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    };
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'https:' && (parsed.hostname.includes('youtube.com') || parsed.hostname.includes('youtube-nocookie.com'))) {
      return {
        embedUrl: trimmed,
        thumbnail: ''
      };
    }
  } catch {
    // URL non valide
  }

  return {
    embedUrl: '',
    thumbnail: ''
  };
}

// -------------------------------------------------------------
// Fallback Local Storage Helpers
// -------------------------------------------------------------
export function getLocalItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const saved = localStorage.getItem(`condor_${key}`);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

export function setLocalItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`condor_${key}`, JSON.stringify(value));
  } catch (e) {
    console.error('LocalStorage error:', e);
  }
}

// =============================================================
// 1. MATCH SERVICE
// =============================================================
const DEFAULT_MATCH: MatchConfig = {
  opponent: '',
  home_team: 'Condor FC',
  match_date: '',
  match_time: '',
  location: 'Parc Sportif Delmas',
  competition: 'Prochain Match Officiel',
  no_matches_now: true,
  is_active: true
};

export async function fetchCurrentMatch(): Promise<MatchConfig> {
  try {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .order('id', { ascending: false })
      .limit(1);

    if (!error && data && data.length > 0) {
      const match = data[0];
      setLocalItem('current_match', match);
      return match;
    }
  } catch (err) {
    console.warn('Supabase match fetch error, using local fallback', err);
  }

  return getLocalItem('current_match', DEFAULT_MATCH);
}

export async function saveMatchConfig(config: MatchConfig): Promise<{ success: boolean; data?: any; error?: string }> {
  setLocalItem('current_match', config);

  try {
    let result;
    if (config.id && typeof config.id === 'number') {
      result = await supabase.from('matches').update(config).eq('id', config.id).select();
    } else {
      const { data: existing } = await supabase.from('matches').select('id').limit(1);
      if (existing && existing.length > 0) {
        result = await supabase.from('matches').update(config).eq('id', existing[0].id).select();
      } else {
        result = await supabase.from('matches').insert(config).select();
      }
    }

    if (result.error) {
      console.warn('Supabase match save note:', result.error.message);
      return { success: true, data: config };
    }

    return { success: true, data: result.data?.[0] || config };
  } catch (e: any) {
    return { success: true, data: config };
  }
}

// =============================================================
// 2. VIDEOS SERVICE (Condor TV)
// =============================================================
export async function fetchVideos(): Promise<VideoItem[]> {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      setLocalItem('videos_list', data);
      return data;
    }
  } catch (err) {
    console.warn('Supabase videos fetch error, fallback to local', err);
  }

  return getLocalItem('videos_list', []);
}

export async function saveVideo(video: VideoItem): Promise<{ success: boolean; error?: string }> {
  const currentList = getLocalItem<VideoItem[]>('videos_list', []);
  const { embedUrl, thumbnail } = parseVideoUrl(video.url);
  const formattedVideo: VideoItem = {
    ...video,
    url: embedUrl || video.url,
    thumbnail: video.thumbnail || thumbnail,
    created_at: video.created_at || new Date().toISOString()
  };

  try {
    let res;
    if (video.id) {
      res = await supabase.from('videos').update(formattedVideo).eq('id', video.id);
    } else {
      res = await supabase.from('videos').insert(formattedVideo);
    }

    if (!res?.error) {
      // update local
    }
  } catch (e) {
    console.warn('Supabase save video note, stored in local cache', e);
  }

  if (formattedVideo.id) {
    const updated = currentList.map(v => v.id === formattedVideo.id ? formattedVideo : v);
    setLocalItem('videos_list', updated);
  } else {
    formattedVideo.id = Date.now();
    formattedVideo.created_at = new Date().toISOString();
    setLocalItem('videos_list', [formattedVideo, ...currentList]);
  }

  return { success: true };
}

export async function deleteVideo(id: number | string): Promise<{ success: boolean }> {
  try {
    await supabase.from('videos').delete().eq('id', id);
  } catch (e) {
    console.warn('Supabase delete video note', e);
  }

  const currentList = getLocalItem<VideoItem[]>('videos_list', []);
  setLocalItem('videos_list', currentList.filter(v => v.id !== id));
  return { success: true };
}

// =============================================================
// 3. STAGES SERVICE
// =============================================================
export async function fetchStages(): Promise<StageSession[]> {
  try {
    const { data, error } = await supabase
      .from('stages')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      setLocalItem('stages_list', data);
      return data;
    }
  } catch (err) {
    console.warn('Supabase stages fetch error, fallback to local', err);
  }

  return getLocalItem('stages_list', []);
}

export async function saveStage(stage: StageSession): Promise<{ success: boolean; error?: string }> {
  const currentList = getLocalItem<StageSession[]>('stages_list', []);

  try {
    let res;
    if (stage.id) {
      res = await supabase.from('stages').update(stage).eq('id', stage.id);
    } else {
      res = await supabase.from('stages').insert(stage);
    }
  } catch (e) {
    console.warn('Supabase save stage note, stored in local cache', e);
  }

  if (stage.id) {
    const updated = currentList.map(s => s.id === stage.id ? stage : s);
    setLocalItem('stages_list', updated);
  } else {
    const newStage = { ...stage, id: Date.now(), created_at: new Date().toISOString() };
    setLocalItem('stages_list', [newStage, ...currentList]);
  }

  return { success: true };
}

export async function deleteStage(id: number | string): Promise<{ success: boolean }> {
  try {
    await supabase.from('stages').delete().eq('id', id);
  } catch (e) {
    console.warn('Supabase delete stage note', e);
  }

  const currentList = getLocalItem<StageSession[]>('stages_list', []);
  setLocalItem('stages_list', currentList.filter(s => s.id !== id));
  return { success: true };
}

// =============================================================
// 4. BOUTIQUE / PRODUCTS SERVICE
// =============================================================
export async function fetchProducts(): Promise<ShopProduct[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      setLocalItem('products_list', data);
      return data;
    }
  } catch (err) {
    console.warn('Supabase products fetch error, fallback to local', err);
  }

  const cached = getLocalItem<ShopProduct[]>('products_list', DEFAULT_PRODUCTS);
  if (cached && cached.length > 0) {
    return cached;
  }
  return DEFAULT_PRODUCTS;
}

export async function saveProduct(product: ShopProduct): Promise<{ success: boolean; error?: string }> {
  const currentList = getLocalItem<ShopProduct[]>('products_list', DEFAULT_PRODUCTS);
  const formattedProduct: ShopProduct = {
    ...product,
    formatted_price: product.formatted_price || `${product.price}.00 $`
  };

  try {
    const { data: existing } = await supabase.from('products').select('id').eq('id', formattedProduct.id);
    if (existing && existing.length > 0) {
      await supabase.from('products').update(formattedProduct).eq('id', formattedProduct.id);
    } else {
      await supabase.from('products').insert(formattedProduct);
    }
  } catch (e) {
    console.warn('Supabase save product note, stored in local cache', e);
  }

  const exists = currentList.some(p => p.id === formattedProduct.id);
  if (exists) {
    const updated = currentList.map(p => p.id === formattedProduct.id ? formattedProduct : p);
    setLocalItem('products_list', updated);
  } else {
    setLocalItem('products_list', [formattedProduct, ...currentList]);
  }

  return { success: true };
}

export async function deleteProduct(id: string): Promise<{ success: boolean }> {
  try {
    await supabase.from('products').delete().eq('id', id);
  } catch (e) {
    console.warn('Supabase delete product note', e);
  }

  const currentList = getLocalItem<ShopProduct[]>('products_list', DEFAULT_PRODUCTS);
  setLocalItem('products_list', currentList.filter(p => p.id !== id));
  return { success: true };
}

export function resetProductsToDefault(): ShopProduct[] {
  setLocalItem('products_list', DEFAULT_PRODUCTS);
  return DEFAULT_PRODUCTS;
}

// =============================================================
// 5. UNITS / CATEGORIES SERVICE (Unités d'équipes: U17, U13, etc.)
// =============================================================
export async function fetchUnits(): Promise<UnitItem[]> {
  try {
    const { data, error } = await supabase
      .from('units')
      .select('*')
      .order('order', { ascending: true });

    if (!error && data && data.length > 0) {
      setLocalItem('units_list', data);
      return data;
    }
  } catch (err) {
    console.warn('Supabase units fetch note, using local fallback', err);
  }

  return getLocalItem('units_list', DEFAULT_UNITS);
}

export async function saveUnit(unit: UnitItem): Promise<{ success: boolean; data?: UnitItem }> {
  const currentList = getLocalItem<UnitItem[]>('units_list', DEFAULT_UNITS);
  const targetUnit: UnitItem = {
    ...unit,
    id: unit.id || `unit-${Date.now()}`,
    order: Number(unit.order) || (currentList.length + 1),
    is_active: unit.is_active !== undefined ? unit.is_active : true
  };

  try {
    const { data: existing } = await supabase.from('units').select('id').eq('id', targetUnit.id);
    if (existing && existing.length > 0) {
      await supabase.from('units').update(targetUnit).eq('id', targetUnit.id);
    } else {
      await supabase.from('units').insert(targetUnit);
    }
  } catch (e) {
    console.warn('Supabase save unit note, stored in local cache', e);
  }

  const idx = currentList.findIndex(u => String(u.id) === String(targetUnit.id));
  let updatedList: UnitItem[];
  if (idx >= 0) {
    updatedList = [...currentList];
    updatedList[idx] = targetUnit;
  } else {
    updatedList = [...currentList, targetUnit];
  }
  updatedList.sort((a, b) => (a.order || 0) - (b.order || 0));
  setLocalItem('units_list', updatedList);

  return { success: true, data: targetUnit };
}

export async function deleteUnit(id: string | number): Promise<{ success: boolean }> {
  try {
    await supabase.from('units').delete().eq('id', id);
  } catch (e) {
    console.warn('Supabase delete unit note', e);
  }

  const currentList = getLocalItem<UnitItem[]>('units_list', DEFAULT_UNITS);
  const filtered = currentList.filter(u => String(u.id) !== String(id));
  setLocalItem('units_list', filtered);
  return { success: true };
}

// =============================================================
// 6. ROLES / POSITIONS SERVICE (Gardiens de but on top, etc.)
// =============================================================
export async function fetchRoles(): Promise<RoleItem[]> {
  try {
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .order('order', { ascending: true });

    if (!error && data && data.length > 0) {
      setLocalItem('roles_list', data);
      return data;
    }
  } catch (err) {
    console.warn('Supabase roles fetch note, using local fallback', err);
  }

  return getLocalItem('roles_list', DEFAULT_ROLES);
}

export async function saveRole(role: RoleItem): Promise<{ success: boolean; data?: RoleItem }> {
  const currentList = getLocalItem<RoleItem[]>('roles_list', DEFAULT_ROLES);
  const targetRole: RoleItem = {
    ...role,
    id: role.id || `role-${Date.now()}`,
    order: Number(role.order) || (currentList.length + 1)
  };

  try {
    const { data: existing } = await supabase.from('roles').select('id').eq('id', targetRole.id);
    if (existing && existing.length > 0) {
      await supabase.from('roles').update(targetRole).eq('id', targetRole.id);
    } else {
      await supabase.from('roles').insert(targetRole);
    }
  } catch (e) {
    console.warn('Supabase save role note, stored in local cache', e);
  }

  const idx = currentList.findIndex(r => String(r.id) === String(targetRole.id));
  let updatedList: RoleItem[];
  if (idx >= 0) {
    updatedList = [...currentList];
    updatedList[idx] = targetRole;
  } else {
    updatedList = [...currentList, targetRole];
  }
  updatedList.sort((a, b) => (a.order || 0) - (b.order || 0));
  setLocalItem('roles_list', updatedList);

  return { success: true, data: targetRole };
}

export async function deleteRole(id: string | number): Promise<{ success: boolean }> {
  try {
    await supabase.from('roles').delete().eq('id', id);
  } catch (e) {
    console.warn('Supabase delete role note', e);
  }

  const currentList = getLocalItem<RoleItem[]>('roles_list', DEFAULT_ROLES);
  const filtered = currentList.filter(r => String(r.id) !== String(id));
  setLocalItem('roles_list', filtered);
  return { success: true };
}

export function matchPlayerToRole(player: { pos?: string; role?: string }, roles: RoleItem[]): RoleItem {
  const sorted = [...roles].sort((a, b) => (a.order || 0) - (b.order || 0));

  if (player.role) {
    const directMatch = sorted.find(r => r.name.toLowerCase() === player.role!.toLowerCase());
    if (directMatch) return directMatch;
  }

  const pos = (player.pos || '').toLowerCase();
  for (const r of sorted) {
    if (!r.keywords) continue;
    const kwList = r.keywords.split(',').map(k => k.trim().toLowerCase()).filter(Boolean);
    for (const kw of kwList) {
      if (pos.includes(kw)) {
        return r;
      }
    }
  }

  return sorted[sorted.length - 1] || { id: 'fallback', name: 'Effectif', order: 999 };
}

// =============================================================
// 7. STAFF MEMBERS SERVICE (L'Équipe d'Encadrement)
// =============================================================
export async function fetchStaff(): Promise<StaffMember[]> {
  try {
    const { data, error } = await supabase
      .from('staff')
      .select('*')
      .order('order', { ascending: true });

    if (!error && data && data.length > 0) {
      setLocalItem('staff_list', data);
      return data;
    }
  } catch (err) {
    console.warn('Supabase staff fetch note, using local fallback', err);
  }

  return getLocalItem('staff_list', DEFAULT_STAFF);
}

export async function saveStaff(member: StaffMember): Promise<{ success: boolean; data?: StaffMember }> {
  const currentList = getLocalItem<StaffMember[]>('staff_list', DEFAULT_STAFF);
  const targetMember: StaffMember = {
    ...member,
    id: member.id || `staff-${Date.now()}`,
    order: Number(member.order) || (currentList.length + 1)
  };

  try {
    const { data: existing } = await supabase.from('staff').select('id').eq('id', targetMember.id);
    if (existing && existing.length > 0) {
      await supabase.from('staff').update(targetMember).eq('id', targetMember.id);
    } else {
      await supabase.from('staff').insert(targetMember);
    }
  } catch (e) {
    console.warn('Supabase save staff note, stored in local cache', e);
  }

  const idx = currentList.findIndex(s => String(s.id) === String(targetMember.id));
  let updatedList: StaffMember[];
  if (idx >= 0) {
    updatedList = [...currentList];
    updatedList[idx] = targetMember;
  } else {
    updatedList = [...currentList, targetMember];
  }
  updatedList.sort((a, b) => (a.order || 0) - (b.order || 0));
  setLocalItem('staff_list', updatedList);

  return { success: true, data: targetMember };
}

export async function deleteStaff(id: string | number): Promise<{ success: boolean }> {
  try {
    await supabase.from('staff').delete().eq('id', id);
  } catch (e) {
    console.warn('Supabase delete staff note', e);
  }

  const currentList = getLocalItem<StaffMember[]>('staff_list', DEFAULT_STAFF);
  const filtered = currentList.filter(s => String(s.id) !== String(id));
  setLocalItem('staff_list', filtered);
  return { success: true };
}

// =============================================================
// 8. TIMELINE / HISTOIRE DU CLUB SERVICE
// =============================================================
export async function fetchTimeline(): Promise<TimelineItem[]> {
  try {
    const { data, error } = await supabase
      .from('timeline')
      .select('*')
      .order('order', { ascending: true });

    if (!error && data && data.length > 0) {
      setLocalItem('timeline_list', data);
      return data;
    }
  } catch (err) {
    console.warn('Supabase timeline fetch note, using local fallback', err);
  }

  return getLocalItem('timeline_list', DEFAULT_TIMELINE);
}

export async function saveTimeline(item: TimelineItem): Promise<{ success: boolean; data?: TimelineItem }> {
  const currentList = getLocalItem<TimelineItem[]>('timeline_list', DEFAULT_TIMELINE);
  const targetItem: TimelineItem = {
    ...item,
    id: item.id || `era-${Date.now()}`,
    order: Number(item.order) || (currentList.length + 1)
  };

  try {
    const { data: existing } = await supabase.from('timeline').select('id').eq('id', targetItem.id);
    if (existing && existing.length > 0) {
      await supabase.from('timeline').update(targetItem).eq('id', targetItem.id);
    } else {
      await supabase.from('timeline').insert(targetItem);
    }
  } catch (e) {
    console.warn('Supabase save timeline note, stored in local cache', e);
  }

  const idx = currentList.findIndex(t => String(t.id) === String(targetItem.id));
  let updatedList: TimelineItem[];
  if (idx >= 0) {
    updatedList = [...currentList];
    updatedList[idx] = targetItem;
  } else {
    updatedList = [...currentList, targetItem];
  }
  updatedList.sort((a, b) => (a.order || 0) - (b.order || 0));
  setLocalItem('timeline_list', updatedList);

  return { success: true, data: targetItem };
}

export async function deleteTimeline(id: string | number): Promise<{ success: boolean }> {
  try {
    await supabase.from('timeline').delete().eq('id', id);
  } catch (e) {
    console.warn('Supabase delete timeline note', e);
  }

  const currentList = getLocalItem<TimelineItem[]>('timeline_list', DEFAULT_TIMELINE);
  const filtered = currentList.filter(t => String(t.id) !== String(id));
  setLocalItem('timeline_list', filtered);
  return { success: true };
}

// =============================================================
// 9. SITE CONTENT / TEXTS SERVICE (Slogan, Textes officiels)
// =============================================================
export async function fetchSiteContent(): Promise<SiteContent> {
  let remoteData: any = null;
  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .limit(1);

    if (!error && data && data.length > 0) {
      remoteData = data[0];
    }
  } catch (err) {
    console.warn('Supabase site content fetch note, using local fallback', err);
  }

  const localCache = getLocalItem<SiteContent>('site_content', DEFAULT_SITE_CONTENT);

  if (remoteData) {
    const unpacked = remoteData.data ? { ...DEFAULT_SITE_CONTENT, ...remoteData.data, ...remoteData } : { ...DEFAULT_SITE_CONTENT, ...remoteData };
    const merged: SiteContent = { ...DEFAULT_SITE_CONTENT, ...unpacked, ...localCache };
    setLocalItem('site_content', merged);
    return merged;
  }

  return localCache ? { ...DEFAULT_SITE_CONTENT, ...localCache } : DEFAULT_SITE_CONTENT;
}

export async function saveSiteContent(content: SiteContent): Promise<{ success: boolean; data?: SiteContent }> {
  setLocalItem('site_content', content);

  try {
    const { data: existing } = await supabase.from('site_content').select('id').limit(1);
    const payload: any = {
      hero_tag: content.hero_tag,
      hero_title: content.hero_title,
      hero_slogan: content.hero_slogan,
      no_match_text: content.no_match_text,
      about_title: content.about_title,
      about_text: content.about_text,
      data: content
    };

    if (existing && existing.length > 0) {
      const res = await supabase.from('site_content').update(payload).eq('id', existing[0].id);
      if (res.error) {
        await supabase.from('site_content').update({
          hero_tag: content.hero_tag,
          hero_title: content.hero_title,
          hero_slogan: content.hero_slogan,
          no_match_text: content.no_match_text,
          about_title: content.about_title,
          about_text: content.about_text,
        }).eq('id', existing[0].id);
      }
    } else {
      const res = await supabase.from('site_content').insert(payload);
      if (res.error) {
        await supabase.from('site_content').insert({
          id: 'main',
          hero_tag: content.hero_tag,
          hero_title: content.hero_title,
          hero_slogan: content.hero_slogan,
          no_match_text: content.no_match_text,
          about_title: content.about_title,
          about_text: content.about_text,
        });
      }
    }
  } catch (e) {
    console.warn('Supabase save site content note, stored in local cache', e);
  }

  return { success: true, data: content };
}

// =============================================================
// 10. DELETED PLAYERS TRACKING & PLAYERS CRUD
// =============================================================
export function getDeletedPlayerIds(): string[] {
  return getLocalItem<string[]>('deleted_player_ids', []);
}

export function markPlayerDeleted(id: string): void {
  const current = getDeletedPlayerIds();
  if (!current.includes(id)) {
    setLocalItem('deleted_player_ids', [...current, id]);
  }
}

export function unmarkPlayerDeleted(id: string): void {
  const current = getDeletedPlayerIds();
  setLocalItem('deleted_player_ids', current.filter(x => x !== id));
}

export async function fetchMergedPlayers(): Promise<Record<string, any>> {
  const deletedIds = new Set(getDeletedPlayerIds());
  const merged: Record<string, any> = {};

  // 1. Initial base from playersDB
  for (const [id, player] of Object.entries(playersDB)) {
    if (!deletedIds.has(String(id))) {
      merged[id] = { ...player };
    }
  }

  // 2. Fetch from Supabase
  try {
    const { data } = await supabase.from('players').select('*');
    if (data && data.length > 0) {
      data.forEach((player: any) => {
        const strId = String(player.id);
        if (!deletedIds.has(strId)) {
          merged[strId] = {
            ...(merged[strId] || {}),
            ...player,
            categories: merged[strId]?.categories || (player.category ? [player.category] : ['U17'])
          };
        }
      });
    }
  } catch (err) {
    console.warn('Supabase fetch players fallback to local', err);
  }

  // 3. Merge custom local cache
  const localCache = getLocalItem<Record<string, any>>('players_custom', {});
  for (const [id, player] of Object.entries(localCache)) {
    const strId = String(id);
    if (!deletedIds.has(strId)) {
      merged[strId] = {
        ...(merged[strId] || {}),
        ...player
      };
    }
  }

  return merged;
}

export async function savePlayerRecord(player: PlayerData): Promise<{ success: boolean; error?: string }> {
  const strId = String(player.id);
  unmarkPlayerDeleted(strId);

  // Update local cache
  const localCache = getLocalItem<Record<string, any>>('players_custom', {});
  localCache[strId] = {
    ...player,
    categories: player.categories || [player.category || 'U17']
  };
  setLocalItem('players_custom', localCache);

  try {
    const { data: existing } = await supabase.from('players').select('id').eq('id', strId);
    let res;
    if (existing && existing.length > 0) {
      res = await supabase.from('players').update(player).eq('id', strId);
    } else {
      res = await supabase.from('players').insert(player);
    }

    if (res?.error) {
      console.warn('Supabase save player note:', res.error.message);
      return { success: true };
    }
    return { success: true };
  } catch (e: any) {
    return { success: true };
  }
}

export async function deletePlayerRecord(id: string): Promise<{ success: boolean; error?: string }> {
  const strId = String(id);
  markPlayerDeleted(strId);

  const localCache = getLocalItem<Record<string, any>>('players_custom', {});
  if (localCache[strId]) {
    delete localCache[strId];
    setLocalItem('players_custom', localCache);
  }

  try {
    const { error } = await supabase.from('players').delete().eq('id', strId);
    if (error) {
      console.warn('Supabase delete player note:', error.message);
    }
  } catch (e: any) {
    console.warn('Supabase delete player fallback note', e);
  }

  return { success: true };
}

export async function transferPlayerCategory(
  id: string,
  newCategory: string,
  existingPlayer?: any
): Promise<{ success: boolean }> {
  const strId = String(id);
  const player = existingPlayer || (await fetchMergedPlayers())[strId] || { id: strId };

  const updated: PlayerData = {
    ...player,
    id: strId,
    category: newCategory,
    categories: [newCategory]
  };

  return await savePlayerRecord(updated);
}
