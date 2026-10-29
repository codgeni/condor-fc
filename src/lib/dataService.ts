import { supabase } from './supabaseClient';
import { playersDB } from './playersDB';

export interface MatchItem {
  id?: number | string;
  opponent: string;
  home_team?: string;
  match_date: string; // YYYY-MM-DD or formatted string
  match_time: string; // HH:MM or formatted string
  location: string;
  competition: string;
  opponent_logo?: string;
  home_team_logo?: string;
}

export interface MatchConfig extends MatchItem {
  no_matches_now: boolean;
  is_active?: boolean;
  extra_matches?: MatchItem[];
}

export interface TrophyItem {
  id: string;
  title: string;
  edition: string;
  date: string;
  rank: string;
  isGold?: boolean;
  is_gold?: boolean;
  badge: string;
  venue: string;
  stats: string;
  desc: string;
  image?: string; // Photo du tournoi
  order?: number;
  created_at?: string;
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
  format?: '16:9' | '9:16' | string;
  platform?: 'youtube' | 'tiktok' | 'other' | string;
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
  price?: number;
  formatted_price?: string;
  tag?: string;
  tag_bg?: string;
  img: string;
  badge_text?: string;
  description: string;
  highlights?: string[];
  sizes?: string[];
  is_available?: boolean;
  created_at?: string;
}

export interface ShopOrder {
  id: string | number;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  product_id?: string;
  product_title: string;
  product_img?: string;
  size: string;
  quantity: number;
  flocage_name?: string;
  flocage_number?: string;
  delivery_address?: string;
  notes?: string;
  status: 'En attente' | 'Contacté' | 'Confirmé' | 'Prêt / Livré' | 'Annulé';
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
  is_spotlight?: boolean;
  spotlight?: boolean;
  displayed_stats?: string[];
  passes?: number | string;
  saves?: number | string;
  cleansheets?: number | string;
  tackles?: number | string;
  minutes?: number | string;
  custom_stat_label?: string;
  custom_stat_val?: number | string;
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
  social_facebook?: string;
  social_instagram?: string;
  social_tiktok?: string;
  
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

  // 5. Section Palmarès & Chiffres Clés (Page d'accueil)
  palmares_title?: string;
  palmares_subtitle?: string;
  palmares_stat1_val?: string;
  palmares_stat1_lbl?: string;
  palmares_stat2_val?: string;
  palmares_stat2_lbl?: string;
  palmares_stat3_val?: string;
  palmares_stat3_lbl?: string;
  palmares_stat4_val?: string;
  palmares_stat4_lbl?: string;

  // 6. Section Terrain d'Entraînement
  terrain_title?: string;
  terrain_tag?: string;
  terrain_desc?: string;
  terrain_img?: string;
  terrain_location?: string;
  terrain_btn_text?: string;
  terrain_btn_link?: string;

  created_at?: string;
}

// -------------------------------------------------------------
// DEFAULTS
// -------------------------------------------------------------
export const DEFAULT_UNITS: UnitItem[] = [
  { id: 'unit-2', name: 'U17', description: 'Moins de 17 ans (Cadets)', order: 1, is_active: true, image: '/kick_hero.png' },
  { id: 'unit-3', name: 'U15', description: 'Moins de 15 ans (Minimes)', order: 2, is_active: true, image: '/player_action_1_1780681882713.png' },
  { id: 'unit-4', name: 'U13', description: 'Moins de 13 ans (Benjamins)', order: 3, is_active: true, image: '/trophy_moment_1780681956500.png' },
  { id: 'unit-5', name: 'U9', description: 'Moins de 9 ans (Poussins / École)', order: 4, is_active: true, image: '/player_action_2_1780681894021.png' },
  { id: 'unit-6', name: 'U8', description: 'Moins de 8 ans (Poussins)', order: 5, is_active: true, image: '/club_hero.png' },
  { id: 'unit-7', name: 'U7', description: 'Moins de 7 ans (Débutants / École de Football)', order: 6, is_active: true, image: '/soccer.png' },
];

export const DEFAULT_ROLES: RoleItem[] = [
  { id: 'role-1', name: 'Gardiens de but', keywords: 'Gardien, Goal, GK, Portier', order: 1 },
  { id: 'role-2', name: 'Défenseurs', keywords: 'Défenseur, Arrière, Latéral, Défenseure, Stoppeur, Lateral', order: 2 },
  { id: 'role-3', name: 'Milieux de terrain', keywords: 'Milieu, MDF, Relayeur, Meneur, Central, Milieue', order: 3 },
  { id: 'role-4', name: 'Attaquants', keywords: 'Attaquant, Ailier, Avant, Pointe, Buteur, Attaquante', order: 4 },
  { id: 'role-5', name: 'Effectif & Autres', keywords: 'N/A, Polyvalent, Joueur, Talent', order: 5 },
];

export const DEFAULT_STAFF: StaffMember[] = [
  { id: 'staff-jean-claude-pierrot', name: 'Jean Claude Pierrot', role: 'Conseiller Technique', img: '/staff/jean-claude-pierrot.jpg', order: 1 },
  { id: 'staff-jean-marc-junior-ferdinand', name: 'Jean Marc Junior Ferdinand', role: 'Conseiller Technique', img: '/staff/jean-marc-junior-ferdinand.jpg', order: 2 },
  { id: 'staff-benson-pierre', name: 'Benson Pierre', role: 'Planificateur de Match & Tournoi', img: '/staff/benson-pierre.jpg', order: 3 },
  { id: 'staff-diego-charles', name: 'Diego Charles', role: 'Formateur', img: '/staff/diego-charles.jpg', order: 4 },
  { id: 'staff-handalson-dejean', name: 'Handalson Dejean', role: 'Formateur', img: '/staff/handalson-dejean.jpg', order: 5 },
  { id: 'staff-joy-mickenley-cadet', name: 'Joy Mickenley Cadet', role: 'Formateur', img: '/staff/joy-mickenley-cadet.jpg', order: 6 },
  { id: 'staff-patrick-pierre-louis', name: 'Patrick Pierre Louis', role: 'Formateur', img: '/staff/patrick-pierre-louis.jpg', order: 7 },
  { id: 'staff-ronald-claude', name: 'Ronald Claude', role: 'Formateur', img: '/staff/ronald-claude.jpg', order: 8 },
  { id: 'staff-cindy-vernet', name: 'Cindy Vernet', role: 'Formatrice Adjointe', img: '/staff/cindy-vernet.jpg', order: 9 },
  { id: 'staff-guerline-guerrier', name: 'Guerline Guerrier', role: 'Formatrice Adjointe', img: '/staff/guerline-guerrier.jpg', order: 10 },
  { id: 'staff-jacklin-pierre', name: 'Jacklin Pierre', role: 'Formateur Adjoint', img: '/staff/jacklin-pierre.jpg', order: 11 },
  { id: 'staff-mayico-franck', name: 'Mayico Franck', role: 'Formateur Adjoint', img: '/staff/mayico-franck.jpg', order: 12 },
  { id: 'staff-christina-similien', name: 'Christina Similien', role: 'Assistante Administrative', img: '/staff/christina-similien.jpg', order: 13 },
  { id: 'staff-wesnide-victor', name: 'Wesnide Victor', role: 'Réceptionniste', img: '/staff/wesnide-victor.jpg', order: 14 },
  { id: 'staff-kimberline-chery', name: 'Kimberline Chery', role: 'Massothérapeute', img: '/staff/kimberline-chery.jpg', order: 15 },
  { id: 'staff-valdyrsen-deris', name: 'Valdyrsen Deris', role: 'Responsable Journal', img: '/staff/valdyrsen-deris.jpg', order: 16 },
  { id: 'staff-jameson-cassamajor', name: 'Jameson Cassamajor', role: 'Assistant Logistique', img: '/staff/jameson-cassamajor.jpg', order: 17 },
  { id: 'staff-erncon-justin', name: 'Erncon Justin', role: 'Outilleur', img: '/staff/erncon-justin.jpg', order: 18 },
  { id: 'staff-jetson-devallon', name: 'Jetson Devallon', role: 'Outilleur', img: '/staff/jetson-devallon.jpg', order: 19 },
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
  social_facebook: 'https://www.facebook.com/share/19gLVfAm7i/?mibextid=wwXIfr',
  social_instagram: 'https://www.instagram.com/condorecolefootball?exln=bjJua2E1dWViYjJo',
  social_tiktok: 'https://www.tiktok.com/@condorhaiti?_r=1&_t=ZS-9ATAOdNenjQ',
  
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
  inscr_hero_bg: '',

  // 5. Section Palmarès & Chiffres Clés (Page d'accueil)
  palmares_title: "NOTRE PALMARÈS",
  palmares_subtitle: "Les titres officiels et les distinctions majeures remportés par le Condor FC depuis sa fondation en Mai 2023.",
  palmares_stat1_val: "05",
  palmares_stat1_lbl: "Titres & Podiums",
  palmares_stat2_val: "03",
  palmares_stat2_lbl: "Titres de Champion",
  palmares_stat3_val: "02",
  palmares_stat3_lbl: "Vice-Champions",
  palmares_stat4_val: "01",
  palmares_stat4_lbl: "Triplé Historique",

  // 6. Section Terrain d'Entraînement
  terrain_title: "Notre Terrain d'Entraînement",
  terrain_tag: "Infrastructures & Localisation",
  terrain_desc: "Retrouvez-nous chaque week-end à l'entrée de Delmas 77 (à côté de BIWI). Nos installations permettent un apprentissage structuré et sécurisé pour toutes les tranches d'âge.",
  terrain_img: "/stadium_hero_1780681869623.png",
  terrain_location: "Entrée de Delmas 77 (à côté de BIWI), Port-au-Prince",
  terrain_btn_text: "Nous Contacter & Localiser",
  terrain_btn_link: "/contact"
};

export const DEFAULT_PRODUCTS: ShopProduct[] = [
  {
    id: 'kit-officiel-polo-condor',
    title: 'Kit Officiel Match Polo 26/27',
    category: 'match',
    category_label: 'Tenue Officielle Domicile',
    subtitle: 'Tenue Complète : Polo, Short #17 & Chaussettes',
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
    sizes: ['Enfant (8-12 ans)', 'S', 'M', 'L', 'XL', 'XXL'],
    is_available: true
  },
  {
    id: 'kit-officiel-exterieur-blanc',
    title: 'Kit Officiel Extérieur 26/27 - Blanc',
    category: 'match',
    category_label: 'Tenue Officielle Extérieure',
    subtitle: 'Maillot Blanc Rayé Pinceau, Short #08 & Chaussettes',
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
    sizes: ['Enfant (8-12 ans)', 'S', 'M', 'L', 'XL', 'XXL'],
    is_available: true
  },
  {
    id: 'kit-third-alveoles-lave',
    title: 'Kit Third 26/27 - Alvéoles & Lave',
    category: 'match',
    category_label: 'Tenue Third Spéciale',
    subtitle: 'Maillot Graphique Grunge, Short à Vagues & Détails',
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
    sizes: ['Enfant (8-12 ans)', 'S', 'M', 'L', 'XL', 'XXL'],
    is_available: true
  },
  {
    id: 'maillot-match-pro-marbre',
    title: 'Maillot Match Pro 26/27 - Noir & Rouge Marbré',
    category: 'match',
    category_label: 'Maillot de Match Pro',
    subtitle: 'Motif Fusion Marbré & Sponsor Officiel DNC',
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
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    is_available: true
  },
  {
    id: 'short-chaussettes-pro-marbre',
    title: 'Short & Chaussettes Match Pro - Marbré',
    category: 'match',
    category_label: 'Ensemble Bas Match Pro',
    subtitle: 'Ensemble Bas Officiel Marbré Assorti',
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
    sizes: ['Taille Unique Adulte', 'Taille Junior'],
    is_available: true
  },
  {
    id: 'kit-officiel-polo-sleeves',
    title: 'Kit Officiel Polo - Édition Manches',
    category: 'match',
    category_label: 'Tenue Officielle Académie',
    subtitle: 'Torse Épuré & Badges sur Manches',
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
    sizes: ['Enfant (8-12 ans)', 'S', 'M', 'L', 'XL', 'XXL'],
    is_available: true
  },
  {
    id: 'kit-entrainement-pro-rouge-10',
    title: 'Kit Entraînement Pro Rouge #10',
    category: 'training',
    category_label: 'Entraînement Pro',
    subtitle: 'Débardeur Rouge #10, Short Assorti & Devise Club',
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
    sizes: ['Enfant (6-10 ans)', 'Enfant (11-14 ans)', 'S', 'M', 'L', 'XL'],
    is_available: true
  },
  {
    id: 'kit-entrainement-debardeur-rouge',
    title: 'Kit Entraînement Sans Manches DNC (#08)',
    category: 'training',
    category_label: 'Entraînement Académie',
    subtitle: 'Débardeur Rouge, Short #08 & Chaussettes Rayées',
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
    sizes: ['Enfant (6-10 ans)', 'Enfant (11-14 ans)', 'S', 'M', 'L', 'XL'],
    is_available: true
  },
  {
    id: 'debardeur-entrainement-noir-fitness',
    title: 'Débardeur Entraînement Noir Fitness',
    category: 'training',
    category_label: 'Entraînement',
    subtitle: 'Coupe Athlétique Sans Manches Noir',
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
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    is_available: true
  },
  {
    id: 'debardeur-entrainement-blanc',
    title: 'Débardeur Entraînement Blanc Académie',
    category: 'training',
    category_label: 'Entraînement',
    subtitle: 'Coupe Athlétique Sans Manches Blanc',
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
    sizes: ['Enfant (8-12 ans)', 'S', 'M', 'L', 'XL', 'XXL'],
    is_available: true
  }
];

// -------------------------------------------------------------
// Helper : Video URL Parser (YouTube standard, YouTube Shorts & TikTok)
// -------------------------------------------------------------
export interface ParsedVideoInfo {
  watchUrl: string;
  embedUrl: string;
  thumbnail: string;
  platform: 'youtube' | 'tiktok' | 'other';
  format: '16:9' | '9:16';
  videoId?: string;
}

export function parseVideoUrl(rawUrl: string): ParsedVideoInfo {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { watchUrl: '', embedUrl: '', thumbnail: '', platform: 'other', format: '16:9' };
  }
  
  const trimmed = rawUrl.trim();
  
  if (/^(javascript|vbscript|data):/i.test(trimmed)) {
    return { watchUrl: '', embedUrl: '', thumbnail: '', platform: 'other', format: '16:9' };
  }

  // 1. TikTok Links
  // Formats:
  // - https://www.tiktok.com/@username/video/7123456789012345678
  // - https://vm.tiktok.com/ZMxxxxxx/
  // - https://vt.tiktok.com/ZMxxxxxx/
  // - https://www.tiktok.com/t/ZMxxxxxx/
  const isTikTok = /(?:tiktok\.com|vm\.tiktok\.com|vt\.tiktok\.com)/i.test(trimmed);
  if (isTikTok) {
    const videoIdMatch = trimmed.match(/video\/(\d+)/i) || trimmed.match(/v\/(\d+)/i);
    const videoId = videoIdMatch ? videoIdMatch[1] : '';
    return {
      watchUrl: trimmed,
      embedUrl: videoId ? `https://www.tiktok.com/embed/v2/${videoId}` : trimmed,
      thumbnail: '',
      platform: 'tiktok',
      format: '9:16',
      videoId
    };
  }

  // 2. YouTube Shorts (format 9:16 vertical)
  const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/i);
  if (shortsMatch && shortsMatch[1]) {
    const videoId = shortsMatch[1];
    return {
      watchUrl: `https://www.youtube.com/shorts/${videoId}`,
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      platform: 'youtube',
      format: '9:16',
      videoId
    };
  }

  // 3. YouTube Regular (watch, youtu.be, embed)
  const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i;
  const ytMatch = trimmed.match(ytRegex);
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      platform: 'youtube',
      format: '16:9',
      videoId
    };
  }

  // 4. Fallback Generic
  let platform: 'youtube' | 'tiktok' | 'other' = 'other';
  try {
    const parsed = new URL(trimmed);
    if (parsed.hostname.includes('youtube') || parsed.hostname.includes('youtu.be')) platform = 'youtube';
    if (parsed.hostname.includes('tiktok')) platform = 'tiktok';
  } catch {
    // URL relative ou brute
  }

  return {
    watchUrl: trimmed,
    embedUrl: trimmed,
    thumbnail: '',
    platform,
    format: platform === 'tiktok' ? '9:16' : '16:9'
  };
}

export function getVideoFormat(video: Partial<VideoItem>): '16:9' | '9:16' {
  if (video.format === '9:16' || video.format === '16:9') return video.format;
  const tag = (video.tag || '').toLowerCase();
  if (tag.includes('9:16') || tag.includes('portrait') || tag.includes('tiktok') || tag.includes('shorts') || tag.includes('vertical')) {
    return '9:16';
  }
  const url = (video.url || '').toLowerCase();
  if (url.includes('tiktok.com') || url.includes('/shorts/')) {
    return '9:16';
  }
  return '16:9';
}

export function getVideoPlatform(video: Partial<VideoItem>): 'youtube' | 'tiktok' | 'other' {
  if (video.platform === 'youtube' || video.platform === 'tiktok' || video.platform === 'other') return video.platform;
  const url = (video.url || '').toLowerCase();
  const tag = (video.tag || '').toLowerCase();
  if (url.includes('tiktok.com') || tag.includes('tiktok')) return 'tiktok';
  if (url.includes('youtube.com') || url.includes('youtu.be') || tag.includes('youtube') || tag.includes('shorts')) return 'youtube';
  return 'other';
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
  } catch (e: any) {
    // Handle QuotaExceededError gracefully (e.g., when players have large base64 photos)
    if (key === 'players_custom' && value && typeof value === 'object') {
      try {
        const slim: Record<string, any> = {};
        for (const [k, v] of Object.entries(value as Record<string, any>)) {
          if (v && typeof v === 'object') {
            slim[k] = {
              ...v,
              img: typeof v.img === 'string' && v.img.length > 2000 ? '/condor_logo_transparent.png' : v.img,
              detail_img: typeof v.detail_img === 'string' && v.detail_img.length > 2000 ? '/condor_logo_transparent.png' : v.detail_img,
              detailImg: typeof v.detailImg === 'string' && v.detailImg.length > 2000 ? '/condor_logo_transparent.png' : v.detailImg,
            };
          }
        }
        localStorage.setItem(`condor_${key}`, JSON.stringify(slim));
        return;
      } catch {
        // Ignore secondary storage error
      }
    }
    console.warn('LocalStorage notice:', e?.message || e);
  }
}

const FRENCH_MONTHS: Record<string, number> = {
  janvier: 1, fevrier: 2, 'février': 2, mars: 3, avril: 4, mai: 5, juin: 6,
  juillet: 7, aout: 8, 'août': 8, septembre: 9, octobre: 10, novembre: 11, decembre: 12, 'décembre': 12,
  jan: 1, fev: 2, mar: 3, avr: 4, jun: 6, jul: 7, aou: 8, sep: 9, oct: 10, nov: 11, dec: 12
};

export function parseMatchDateTime(dateStr?: string, timeStr?: string): Date | null {
  if (!dateStr && !timeStr) return null;
  const rawDate = (dateStr || '').trim();
  const rawTime = (timeStr || '').trim();
  const combined = `${rawDate} ${rawTime}`.trim();
  if (!combined) return null;

  let year: number | null = null;
  let month: number | null = null;
  let day: number | null = null;
  let hours = 16;
  let minutes = 0;

  // 1. Time extraction: 12h AM/PM
  const ampmMatch = combined.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i);
  if (ampmMatch) {
    let h = parseInt(ampmMatch[1], 10);
    const m = ampmMatch[2] ? parseInt(ampmMatch[2], 10) : 0;
    const isPm = ampmMatch[3].toLowerCase() === 'pm';
    if (isPm && h < 12) h += 12;
    if (!isPm && h === 12) h = 0;
    hours = h;
    minutes = m;
  } else {
    // 24h format: 14h00, 14:00, 14h, à 14h00
    const explicitTime = 
      combined.match(/(?:à\s*|at\s*|\s+)(\d{1,2})[hH:](\d{2})/) ||
      combined.match(/(?:à\s*|at\s*|\s+)(\d{1,2})\s*[hH]/) ||
      (rawTime && rawTime.match(/^(\d{1,2})[hH:](\d{2})/)) ||
      (rawTime && rawTime.match(/^(\d{1,2})\s*[hH]?$/));

    if (explicitTime) {
      hours = parseInt(explicitTime[1], 10);
      minutes = explicitTime[2] ? parseInt(explicitTime[2], 10) : 0;
    }
  }

  // 2. Date extraction
  // ISO: YYYY-MM-DD or YYYY/MM/DD
  const isoMatch = combined.match(/(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
  if (isoMatch) {
    year = parseInt(isoMatch[1], 10);
    month = parseInt(isoMatch[2], 10);
    day = parseInt(isoMatch[3], 10);
  } else {
    // FR: DD/MM/YYYY or DD-MM-YYYY
    const frMatch = combined.match(/(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})/);
    if (frMatch) {
      day = parseInt(frMatch[1], 10);
      month = parseInt(frMatch[2], 10);
      year = parseInt(frMatch[3], 10);
    } else {
      // Named months: e.g. 24 Octobre 2026
      const namedMatch = combined.match(/(\d{1,2})\s+([a-zA-Z\u00C0-\u017F]+)\s+(\d{4})/);
      if (namedMatch) {
        day = parseInt(namedMatch[1], 10);
        const mKey = namedMatch[2].toLowerCase();
        if (FRENCH_MONTHS[mKey]) {
          month = FRENCH_MONTHS[mKey];
          year = parseInt(namedMatch[3], 10);
        }
      }
    }
  }

  if (!year || !month || !day) {
    const cleanStr = combined.replace(/à\s*/i, '').replace(/(\d{1,2})h(\d{2})/i, '$1:$2');
    const fallback = new Date(cleanStr);
    return isNaN(fallback.getTime()) ? null : fallback;
  }

  return new Date(year, month - 1, day, hours, minutes, 0, 0);
}

// =============================================================
// 1. MATCH SERVICE
// =============================================================
const DEFAULT_MATCH: MatchConfig = {
  home_team: 'Condor Ecole de Football',
  opponent: 'Fc Colonne Academy',
  match_date: '2026-10-24',
  match_time: '14h00',
  location: 'Quisqueya Christian School, Delmas 75',
  competition: 'Match Officiel',
  no_matches_now: false,
  is_active: true
};

export async function fetchCurrentMatch(): Promise<MatchConfig> {
  try {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .order('id', { ascending: true });

    if (!error && data && data.length > 0) {
      const primary = data[0];
      const extra_matches: MatchItem[] = data
        .slice(1)
        .filter((r: any) => r.is_active !== false)
        .map((r: any) => ({
          id: r.id,
          home_team: r.home_team || 'Condor Ecole de Football',
          opponent: r.opponent || '',
          match_date: r.match_date || primary.match_date || '',
          match_time: r.match_time || '',
          location: r.location || primary.location || '',
          competition: r.competition || 'Match Officiel',
          opponent_logo: r.opponent_logo || ''
        }));

      const match: MatchConfig = {
        ...primary,
        extra_matches
      };
      setLocalItem('current_match', match);
      return match;
    }
  } catch (err) {
    console.warn('Supabase match fetch error, using local fallback', err);
  }

  const cached = getLocalItem<MatchConfig>('current_match', DEFAULT_MATCH);
  if (!cached || !cached.opponent) {
    setLocalItem('current_match', DEFAULT_MATCH);
    return DEFAULT_MATCH;
  }
  return cached;
}

export async function saveMatchConfig(config: MatchConfig): Promise<{ success: boolean; data?: any; error?: string }> {
  setLocalItem('current_match', config);

  const extraList = Array.isArray(config.extra_matches) ? config.extra_matches : [];
  const allMatches: MatchItem[] = [config, ...extraList];

  try {
    const { data: existingRows } = await supabase
      .from('matches')
      .select('id')
      .order('id', { ascending: true });

    for (let i = 0; i < allMatches.length; i++) {
      const m = allMatches[i];
      const dbPayload: Record<string, any> = {
        home_team: m.home_team || 'Condor Ecole de Football',
        opponent: m.opponent || 'Adversaire',
        opponent_logo: m.opponent_logo || null,
        match_date: m.match_date || config.match_date || '',
        match_time: m.match_time || '',
        location: m.location || config.location || '',
        competition: m.competition || 'Match Officiel',
        no_matches_now: Boolean(config.no_matches_now),
        is_active: config.is_active !== false
      };

      if (existingRows && existingRows[i]) {
        await supabase.from('matches').update(dbPayload).eq('id', existingRows[i].id);
      } else {
        await supabase.from('matches').insert(dbPayload);
      }
    }

    if (existingRows && existingRows.length > allMatches.length) {
      const idsToDelete = existingRows.slice(allMatches.length).map((r: any) => r.id);
      if (idsToDelete.length > 0) {
        await supabase.from('matches').delete().in('id', idsToDelete);
      }
    }

    return { success: true, data: config };
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
      const enriched: VideoItem[] = data.map((v: any) => ({
        ...v,
        format: getVideoFormat(v),
        platform: getVideoPlatform(v)
      }));
      setLocalItem('videos_list', enriched);
      return enriched;
    }
  } catch (err) {
    console.warn('Supabase videos fetch error, fallback to local', err);
  }

  const local = getLocalItem<VideoItem[]>('videos_list', []);
  return local.map(v => ({
    ...v,
    format: getVideoFormat(v),
    platform: getVideoPlatform(v)
  }));
}

export async function saveVideo(video: VideoItem): Promise<{ success: boolean; data?: VideoItem; error?: string }> {
  const currentList = getLocalItem<VideoItem[]>('videos_list', []);
  const parsed = parseVideoUrl(video.url);
  
  // Toujours conserver le lien de visionnage direct pour ouvrir la vidéo sur TikTok/YouTube
  const finalWatchUrl = parsed.watchUrl || video.url;
  const finalThumbnail = video.thumbnail || parsed.thumbnail || '';
  const finalFormat = video.format || parsed.format || '16:9';
  const finalPlatform = video.platform || parsed.platform || 'other';

  // Préserver ou formater le badge tag
  let finalTag = video.tag || '';
  if (finalFormat === '9:16' && !finalTag.toLowerCase().includes('9:16') && !finalTag.toLowerCase().includes('tiktok') && !finalTag.toLowerCase().includes('shorts')) {
    finalTag = finalTag ? `${finalTag} • 9:16` : (finalPlatform === 'tiktok' ? 'TikTok' : 'Shorts');
  }

  const formattedVideo: VideoItem = {
    ...video,
    url: finalWatchUrl,
    thumbnail: finalThumbnail,
    tag: finalTag,
    format: finalFormat,
    platform: finalPlatform,
    created_at: video.created_at || new Date().toISOString()
  };

  // Colonnes strictes conformes à la table Supabase videos
  const dbPayload = {
    title: formattedVideo.title,
    url: formattedVideo.url,
    category: formattedVideo.category,
    duration: formattedVideo.duration || '',
    thumbnail: formattedVideo.thumbnail || '',
    tag: formattedVideo.tag || '',
    description: formattedVideo.description || ''
  };

  try {
    if (formattedVideo.id && (typeof formattedVideo.id === 'number' || (typeof formattedVideo.id === 'string' && /^\d+$/.test(formattedVideo.id) && formattedVideo.id.length < 12))) {
      const { data: updateData, error: updateError } = await supabase
        .from('videos')
        .update(dbPayload)
        .eq('id', formattedVideo.id)
        .select();

      if (updateError) {
        console.warn('Supabase update video note:', updateError.message);
      } else if (updateData && updateData.length > 0) {
        formattedVideo.id = updateData[0].id;
        formattedVideo.created_at = updateData[0].created_at;
      }
    } else {
      const { data: insertData, error: insertError } = await supabase
        .from('videos')
        .insert(dbPayload)
        .select();

      if (insertError) {
        console.warn('Supabase insert video note:', insertError.message);
      } else if (insertData && insertData.length > 0) {
        formattedVideo.id = insertData[0].id;
        formattedVideo.created_at = insertData[0].created_at;
      }
    }
  } catch (e: any) {
    console.warn('Supabase save video exception, stored in local cache', e);
  }

  if (!formattedVideo.id) {
    formattedVideo.id = Date.now();
  }

  const existingIdx = currentList.findIndex(v => String(v.id) === String(formattedVideo.id));
  let updatedList: VideoItem[];
  if (existingIdx >= 0) {
    updatedList = [...currentList];
    updatedList[existingIdx] = formattedVideo;
  } else {
    updatedList = [formattedVideo, ...currentList];
  }
  setLocalItem('videos_list', updatedList);

  return { success: true, data: formattedVideo };
}

export async function deleteVideo(id: number | string): Promise<{ success: boolean; error?: string }> {
  try {
    if (typeof id === 'number' || (typeof id === 'string' && /^\d+$/.test(id) && id.length < 12)) {
      const { error } = await supabase.from('videos').delete().eq('id', id);
      if (error) console.warn('Supabase delete video note:', error.message);
    }
  } catch (e: any) {
    console.warn('Supabase delete video exception:', e);
  }

  const currentList = getLocalItem<VideoItem[]>('videos_list', []);
  setLocalItem('videos_list', currentList.filter(v => String(v.id) !== String(id)));
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
  let dbProducts: ShopProduct[] = [];
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      dbProducts = data;
    }
  } catch (err) {
    console.warn('Supabase products fetch error, fallback to local', err);
  }

  // Merge map garantissant la présence permanente des 10 équipements officiels
  const map = new Map<string, ShopProduct>();
  DEFAULT_PRODUCTS.forEach(p => {
    map.set(p.id, { ...p, is_available: p.is_available !== false });
  });

  // Superposer le cache local (modifications locales de disponibilité ou personnalisations)
  const cached = getLocalItem<ShopProduct[]>('products_list', []);
  if (Array.isArray(cached) && cached.length > 0) {
    cached.forEach(p => {
      const existing = map.get(p.id);
      map.set(p.id, { ...(existing || {}), ...p });
    });
  }

  // Superposer les enregistrements Supabase
  dbProducts.forEach(p => {
    const existing = map.get(p.id);
    const isAvail = p.formatted_price === 'INDISPONIBLE'
      ? false
      : (p.is_available !== undefined ? p.is_available : (existing?.is_available !== false));
    map.set(p.id, {
      ...(existing || {}),
      ...p,
      formatted_price: '',
      is_available: isAvail
    });
  });

  const merged = Array.from(map.values());
  setLocalItem('products_list', merged);
  return merged;
}

export async function saveProduct(product: ShopProduct): Promise<{ success: boolean; error?: string }> {
  const currentList = await fetchProducts();
  const targetProduct: ShopProduct = {
    ...product,
    is_available: product.is_available !== false,
    price: 0,
    formatted_price: ''
  };

  const dbPayload = {
    id: String(targetProduct.id),
    title: targetProduct.title,
    price: 0,
    formatted_price: targetProduct.is_available === false ? 'INDISPONIBLE' : '',
    tag: targetProduct.tag || null,
    img: targetProduct.img,
    description: targetProduct.description || '',
    sizes: Array.isArray(targetProduct.sizes) ? targetProduct.sizes : ['S', 'M', 'L', 'XL']
  };

  try {
    const { data: existing } = await supabase.from('products').select('id').eq('id', dbPayload.id);
    if (existing && existing.length > 0) {
      await supabase.from('products').update(dbPayload).eq('id', dbPayload.id);
    } else {
      await supabase.from('products').insert(dbPayload);
    }
  } catch (e) {
    console.warn('Supabase save product note, stored in local cache', e);
  }

  const exists = currentList.some(p => p.id === targetProduct.id);
  let updated: ShopProduct[];
  if (exists) {
    updated = currentList.map(p => p.id === targetProduct.id ? targetProduct : p);
  } else {
    updated = [targetProduct, ...currentList];
  }
  setLocalItem('products_list', updated);

  return { success: true };
}

export async function deleteProduct(id: string): Promise<{ success: boolean }> {
  try {
    await supabase.from('products').delete().eq('id', id);
  } catch (e) {
    console.warn('Supabase delete product note', e);
  }

  const currentList = await fetchProducts();
  setLocalItem('products_list', currentList.filter(p => p.id !== id));
  return { success: true };
}

export function resetProductsToDefault(): ShopProduct[] {
  const resetList = DEFAULT_PRODUCTS.map(p => ({ ...p, is_available: true, price: 0, formatted_price: '' }));
  setLocalItem('products_list', resetList);
  return resetList;
}

export async function toggleProductAvailability(id: string, is_available: boolean): Promise<{ success: boolean }> {
  const currentList = await fetchProducts();
  const target = currentList.find(p => p.id === id);
  const updated = currentList.map(p => p.id === id ? { ...p, is_available } : p);
  setLocalItem('products_list', updated);

  if (target) {
    const dbPayload = {
      id: String(target.id),
      title: target.title,
      price: 0,
      formatted_price: is_available === false ? 'INDISPONIBLE' : '',
      tag: target.tag || null,
      img: target.img,
      description: target.description || '',
      sizes: Array.isArray(target.sizes) ? target.sizes : ['S', 'M', 'L', 'XL']
    };
    try {
      const { data: existing } = await supabase.from('products').select('id').eq('id', id);
      if (existing && existing.length > 0) {
        await supabase.from('products').update({ formatted_price: dbPayload.formatted_price }).eq('id', id);
      } else {
        await supabase.from('products').insert(dbPayload);
      }
    } catch (e) {
      console.warn('Supabase toggle product availability note', e);
    }
  }
  return { success: true };
}

// =============================================================
// 4.0.1 COMMANDES BOUTIQUE (Shop Orders Service)
// =============================================================
export async function fetchShopOrders(): Promise<ShopOrder[]> {
  try {
    const { data, error } = await supabase
      .from('shop_orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setLocalItem('shop_orders_list', data);
      return data;
    }
  } catch (err) {
    console.warn('Supabase fetch shop orders note, using local cache', err);
  }

  return getLocalItem<ShopOrder[]>('shop_orders_list', []);
}

export async function submitShopOrder(order: Partial<ShopOrder>): Promise<{ success: boolean; data?: ShopOrder; error?: string }> {
  const currentList = getLocalItem<ShopOrder[]>('shop_orders_list', []);
  const newOrder: ShopOrder = {
    id: order.id || `cmd-${Date.now()}`,
    customer_name: order.customer_name || 'Client',
    customer_phone: order.customer_phone || '',
    customer_email: order.customer_email || '',
    product_id: order.product_id || '',
    product_title: order.product_title || 'Équipement Officiel',
    product_img: order.product_img || '',
    size: order.size || 'M',
    quantity: Number(order.quantity) || 1,
    flocage_name: order.flocage_name || '',
    flocage_number: order.flocage_number || '',
    delivery_address: order.delivery_address || '',
    notes: order.notes || '',
    status: order.status || 'En attente',
    created_at: order.created_at || new Date().toISOString()
  };

  try {
    const { data, error } = await supabase.from('shop_orders').insert({
      customer_name: newOrder.customer_name,
      customer_phone: newOrder.customer_phone,
      customer_email: newOrder.customer_email || null,
      product_id: newOrder.product_id || null,
      product_title: newOrder.product_title,
      product_img: newOrder.product_img || null,
      size: newOrder.size,
      quantity: newOrder.quantity,
      flocage_name: newOrder.flocage_name || null,
      flocage_number: newOrder.flocage_number || null,
      delivery_address: newOrder.delivery_address || null,
      notes: newOrder.notes || null,
      status: newOrder.status
    }).select().single();

    if (!error && data) {
      newOrder.id = data.id;
    }
  } catch (e) {
    console.warn('Supabase save shop order note, stored in local cache', e);
  }

  const updated = [newOrder, ...currentList];
  setLocalItem('shop_orders_list', updated);
  return { success: true, data: newOrder };
}

export async function updateShopOrderStatus(id: string | number, status: ShopOrder['status']): Promise<{ success: boolean }> {
  try {
    await supabase.from('shop_orders').update({ status }).eq('id', id);
  } catch (e) {
    console.warn('Supabase update shop order status note', e);
  }

  const currentList = getLocalItem<ShopOrder[]>('shop_orders_list', []);
  const updated = currentList.map(o => String(o.id) === String(id) ? { ...o, status } : o);
  setLocalItem('shop_orders_list', updated);
  return { success: true };
}

export async function deleteShopOrder(id: string | number): Promise<{ success: boolean }> {
  try {
    await supabase.from('shop_orders').delete().eq('id', id);
  } catch (e) {
    console.warn('Supabase delete shop order note', e);
  }

  const currentList = getLocalItem<ShopOrder[]>('shop_orders_list', []);
  const updated = currentList.filter(o => String(o.id) !== String(id));
  setLocalItem('shop_orders_list', updated);
  return { success: true };
}

// =============================================================
// 4.1 PALMARÈS & TOURNOIS (Photos & Trophées du Club)
// =============================================================
export const DEFAULT_TROPHIES: TrophyItem[] = [
  { 
    id: 'chale-chale',
    title: 'Tournoi Chale Chale', 
    edition: '7e Édition · Triplé Inédit',
    date: 'Avril 2026', 
    rank: 'Champion U11 / U15 / U16', 
    isGold: true,
    is_gold: true,
    badge: 'Triplé Historique',
    venue: 'Parc Sportif Delmas',
    stats: '3 Trophées · 1 Édition · Invaincus',
    desc: 'Condor FC s\'impose au sommet en remportant les trophées de champions dans trois catégories différentes (U11, U15, U16) lors d\'une seule et même édition. Une domination tactique absolue saluée par tous les observateurs.',
    image: '',
    order: 1
  },
  { 
    id: 'back-to-school',
    title: 'Tournoi Back To School', 
    edition: 'Édition Annuelle Élite',
    date: 'Septembre 2025', 
    rank: 'Champion National U17', 
    isGold: true,
    is_gold: true,
    badge: 'Champion National',
    venue: 'Stade Municipal',
    stats: 'Meilleure Attaque · Victoire en Finale 3-1',
    desc: 'Parcours parfait des U17 qui s\'imposent avec panache face aux plus prestigieuses académies du pays. Une cohésion d\'équipe exemplaire et une efficacité offensive redoutable jusqu\'au sacre.',
    image: '',
    order: 2
  },
  { 
    id: 'copa-undecima',
    title: 'Tournoi Copa Undecima', 
    edition: 'Coupe d\'Hiver 2025',
    date: 'Décembre 2025', 
    rank: 'Champion U15', 
    isGold: true,
    is_gold: true,
    badge: 'Champion Officiel',
    venue: 'Delmas 77',
    stats: 'Invaincus · Trophée Meilleur Buteur',
    desc: 'Une démonstration offensive magistrale menée par la catégorie U15. En finale, les jeunes Condors ont fait preuve d\'un sang-froid extraordinaire pour décrocher le titre suprême devant un public conquis.',
    image: '',
    order: 3
  },
  { 
    id: 'flag-day-13',
    title: 'Flag Day (13e édition)', 
    edition: 'Tournoi National Fête du Drapeau',
    date: 'Mai 2026', 
    rank: 'Vice-Champion U15', 
    isGold: false,
    is_gold: false,
    badge: 'Médaille d\'Argent',
    venue: 'Complexe National',
    stats: 'Finale aux Tirs au But · Meilleure Défense',
    desc: 'Une épopée courageuse menant l\'équipe U15 jusqu\'aux tirs au but de la grande finale nationale du 18 Mai. Une médaille d\'argent disputée avec honneur face aux meilleures formations du pays.',
    image: '',
    order: 4
  },
  { 
    id: 'flag-day-12',
    title: 'Flag Day (12e édition)', 
    edition: 'Tournoi National Fête du Drapeau',
    date: 'Mai 2025', 
    rank: 'Vice-Champion U13', 
    isGold: false,
    is_gold: false,
    badge: 'Médaille d\'Argent',
    venue: 'Complexe National',
    stats: 'Premier Podium de l\'Histoire du Club',
    desc: 'Le tout premier trophée majeur conquis par l\'académie seulement deux ans après sa fondation officielle en Mai 2023. Le point de départ d\'une série de victoires et d\'une ascension constante.',
    image: '',
    order: 5
  }
];

export async function fetchTrophies(): Promise<TrophyItem[]> {
  try {
    const { data, error } = await supabase
      .from('trophies')
      .select('*')
      .order('order', { ascending: true });

    if (!error && data && data.length > 0) {
      setLocalItem('trophies_list', data);
      return data;
    }
  } catch (err) {
    console.warn('Supabase trophies fetch note, using local fallback', err);
  }

  return getLocalItem('trophies_list', DEFAULT_TROPHIES);
}

export async function saveTrophy(trophy: TrophyItem): Promise<{ success: boolean; data?: TrophyItem; error?: string }> {
  const currentList = getLocalItem<TrophyItem[]>('trophies_list', DEFAULT_TROPHIES);
  const targetTrophy: TrophyItem = {
    ...trophy,
    id: trophy.id || `trophy-${Date.now()}`,
    order: Number(trophy.order) || (currentList.length + 1)
  };

  try {
    const { data: existing } = await supabase.from('trophies').select('id').eq('id', targetTrophy.id);
    if (existing && existing.length > 0) {
      await supabase.from('trophies').update(targetTrophy).eq('id', targetTrophy.id);
    } else {
      await supabase.from('trophies').insert(targetTrophy);
    }
  } catch (e) {
    console.warn('Supabase save trophy note, cached locally', e);
  }

  const idx = currentList.findIndex(t => t.id === targetTrophy.id);
  let updatedList: TrophyItem[];
  if (idx >= 0) {
    updatedList = [...currentList];
    updatedList[idx] = targetTrophy;
  } else {
    updatedList = [...currentList, targetTrophy];
  }
  updatedList.sort((a, b) => (a.order || 0) - (b.order || 0));
  setLocalItem('trophies_list', updatedList);

  return { success: true, data: targetTrophy };
}

export async function deleteTrophy(id: string): Promise<{ success: boolean }> {
  try {
    await supabase.from('trophies').delete().eq('id', id);
  } catch (e) {
    console.warn('Supabase delete trophy note', e);
  }

  const currentList = getLocalItem<TrophyItem[]>('trophies_list', DEFAULT_TROPHIES);
  const filtered = currentList.filter(t => t.id !== id);
  setLocalItem('trophies_list', filtered);
  return { success: true };
}

export async function resetTrophiesToDefault(): Promise<{ success: boolean; data: TrophyItem[] }> {
  setLocalItem('trophies_list', DEFAULT_TROPHIES);
  return { success: true, data: DEFAULT_TROPHIES };
}

// =============================================================
// 5. UNITS / CATEGORIES SERVICE (Unités d'équipes: U17, U13, etc.)
// =============================================================
export async function fetchUnits(): Promise<UnitItem[]> {
  const isNotPremiere = (u: UnitItem) => {
    const n = (u.name || '').toLowerCase();
    return !n.includes('premi') && u.id !== 'unit-1';
  };

  try {
    const { data, error } = await supabase
      .from('units')
      .select('*')
      .order('order', { ascending: true });

    if (!error && data && data.length > 0) {
      const filtered = data.filter(isNotPremiere);
      setLocalItem('units_list', filtered);
      return filtered;
    }
  } catch (err) {
    console.warn('Supabase units fetch note, using local fallback', err);
  }

  const localUnits = getLocalItem<UnitItem[]>('units_list', DEFAULT_UNITS);
  const filtered = (Array.isArray(localUnits) ? localUnits : DEFAULT_UNITS).filter(isNotPremiere);
  setLocalItem('units_list', filtered);
  return filtered;
}

export async function saveUnit(unit: UnitItem): Promise<{ success: boolean; data?: UnitItem; error?: string }> {
  const currentList = getLocalItem<UnitItem[]>('units_list', DEFAULT_UNITS);
  const targetUnit: UnitItem = {
    ...unit,
    id: unit.id || `unit-${Date.now()}`,
    order: Number(unit.order) || (currentList.length + 1),
    is_active: unit.is_active !== undefined ? unit.is_active : true
  };

  const localOld = currentList.find(u => String(u.id) === String(targetUnit.id));
  let oldName = localOld?.name;

  const dbPayload = {
    id: String(targetUnit.id),
    name: targetUnit.name,
    description: targetUnit.description || '',
    order: Number(targetUnit.order) || 1,
    is_active: targetUnit.is_active !== false,
    image: targetUnit.image || null
  };

  try {
    const { data: existing } = await supabase.from('units').select('id, name').eq('id', dbPayload.id);
    let res;
    if (existing && existing.length > 0) {
      if (!oldName && existing[0].name) {
        oldName = existing[0].name;
      }
      res = await supabase.from('units').update(dbPayload).eq('id', dbPayload.id);
    } else {
      res = await supabase.from('units').insert(dbPayload);
    }
    if (res?.error) {
      console.warn('Supabase save unit notice (saved to local cache):', res.error.message);
    }

    // If unit name changed, migrate all players belonging to oldName so they never disappear
    if (oldName && oldName !== targetUnit.name) {
      const allPlayers = await fetchMergedPlayers();
      for (const p of Object.values(allPlayers)) {
        const cats: string[] = Array.isArray(p.categories) ? p.categories : (p.category ? [p.category] : []);
        if (p.category === oldName || cats.includes(oldName)) {
          const newCats = Array.from(new Set(cats.map(c => c === oldName ? targetUnit.name : c)));
          if (!newCats.includes(targetUnit.name)) newCats.push(targetUnit.name);
          const newPrimary = p.category === oldName ? targetUnit.name : p.category;
          await savePlayerRecord({ ...p, category: newPrimary, categories: newCats });
        }
      }
    }
  } catch (e) {
    console.warn('Supabase save unit exception, stored in local cache', e);
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
    await supabase.from('units').delete().eq('id', String(id));
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

export async function saveRole(role: RoleItem): Promise<{ success: boolean; data?: RoleItem; error?: string }> {
  const currentList = getLocalItem<RoleItem[]>('roles_list', DEFAULT_ROLES);
  const targetRole: RoleItem = {
    ...role,
    id: role.id || `role-${Date.now()}`,
    order: Number(role.order) || (currentList.length + 1)
  };

  const dbPayload = {
    id: String(targetRole.id),
    name: targetRole.name,
    keywords: targetRole.keywords || '',
    order: Number(targetRole.order) || 1
  };

  try {
    const { data: existing } = await supabase.from('roles').select('id').eq('id', dbPayload.id);
    let res;
    if (existing && existing.length > 0) {
      res = await supabase.from('roles').update(dbPayload).eq('id', dbPayload.id);
    } else {
      res = await supabase.from('roles').insert(dbPayload);
    }
    if (res?.error) {
      console.warn('Supabase save role notice (saved in local cache):', res.error.message);
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
    await supabase.from('roles').delete().eq('id', String(id));
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

  const cached = getLocalItem<StaffMember[]>('staff_list', DEFAULT_STAFF);
  // Auto-upgrade legacy cache if it contains dummy placeholder data
  if (!cached || cached.length <= 4 || cached.some(m => m.id === 'staff-1' || m.name === 'Jean-Claude Valme')) {
    setLocalItem('staff_list', DEFAULT_STAFF);
    return DEFAULT_STAFF;
  }
  return cached;
}

export async function saveStaff(member: StaffMember): Promise<{ success: boolean; data?: StaffMember; error?: string }> {
  const currentList = getLocalItem<StaffMember[]>('staff_list', DEFAULT_STAFF);
  const targetMember: StaffMember = {
    ...member,
    id: member.id || `staff-${Date.now()}`,
    order: Number(member.order) || (currentList.length + 1)
  };

  const dbPayload = {
    id: String(targetMember.id),
    name: targetMember.name,
    role: targetMember.role,
    img: targetMember.img,
    order: Number(targetMember.order) || 1
  };

  try {
    const { data: existing } = await supabase.from('staff').select('id').eq('id', dbPayload.id);
    let res;
    if (existing && existing.length > 0) {
      res = await supabase.from('staff').update(dbPayload).eq('id', dbPayload.id);
    } else {
      res = await supabase.from('staff').insert(dbPayload);
    }
    if (res?.error) {
      console.warn('Supabase save staff notice (saved in local cache):', res.error.message);
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
    await supabase.from('staff').delete().eq('id', String(id));
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

export async function saveTimeline(item: TimelineItem): Promise<{ success: boolean; data?: TimelineItem; error?: string }> {
  const currentList = getLocalItem<TimelineItem[]>('timeline_list', DEFAULT_TIMELINE);
  const targetItem: TimelineItem = {
    ...item,
    id: item.id || `era-${Date.now()}`,
    order: Number(item.order) || (currentList.length + 1)
  };

  const dbPayload = {
    id: String(targetItem.id),
    year: targetItem.year,
    title: targetItem.title,
    description: targetItem.description,
    order: Number(targetItem.order) || 1
  };

  try {
    const { data: existing } = await supabase.from('timeline').select('id').eq('id', dbPayload.id);
    let res;
    if (existing && existing.length > 0) {
      res = await supabase.from('timeline').update(dbPayload).eq('id', dbPayload.id);
    } else {
      res = await supabase.from('timeline').insert(dbPayload);
    }
    if (res?.error) {
      console.warn('Supabase save timeline notice (saved in local cache):', res.error.message);
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
    const rawInner = (remoteData.data && typeof remoteData.data === 'object') ? { ...remoteData.data } : {};
    delete rawInner.data;
    const rawOuter = { ...remoteData };
    delete rawOuter.data;
    const unpacked = { ...DEFAULT_SITE_CONTENT, ...rawInner, ...rawOuter };
    // Les données distantes de Supabase sont prioritaires sur le cache local
    const merged: SiteContent = { ...DEFAULT_SITE_CONTENT, ...localCache, ...unpacked };
    delete (merged as any).data;
    setLocalItem('site_content', merged);
    return merged;
  }

  const cleanLocal = localCache ? { ...DEFAULT_SITE_CONTENT, ...localCache } : { ...DEFAULT_SITE_CONTENT };
  delete (cleanLocal as any).data;
  return cleanLocal;
}

export async function saveSiteContent(content: SiteContent): Promise<{ success: boolean; data?: SiteContent; error?: any }> {
  const cleanContent: Record<string, any> = { ...content };
  delete cleanContent.data;
  setLocalItem('site_content', cleanContent as SiteContent);

  try {
    const { data: existing } = await supabase.from('site_content').select('id, data').limit(1);
    if (existing?.[0]?.data?.deleted_player_ids && !cleanContent.deleted_player_ids) {
      cleanContent.deleted_player_ids = existing[0].data.deleted_player_ids;
    }
    const payload: any = {
      hero_tag: content.hero_tag,
      hero_title: content.hero_title,
      hero_slogan: content.hero_slogan,
      no_match_text: content.no_match_text,
      about_title: content.about_title,
      about_text: content.about_text,
      data: cleanContent
    };

    if (existing && existing.length > 0) {
      const res = await supabase.from('site_content').update(payload).eq('id', existing[0].id);
      if (res.error) {
        console.error('Supabase save site content update error:', res.error);
        return { success: false, error: res.error.message || 'Erreur lors de la sauvegarde Supabase' };
      }
    } else {
      const res = await supabase.from('site_content').insert({ id: 'main', ...payload });
      if (res.error) {
        console.error('Supabase save site content insert error:', res.error);
        return { success: false, error: res.error.message || 'Erreur lors de la création Supabase' };
      }
    }
  } catch (e: any) {
    console.warn('Supabase save site content exception:', e);
    return { success: false, error: e.message || 'Erreur lors de la sauvegarde Supabase' };
  }

  return { success: true, data: cleanContent as SiteContent };
}

// =============================================================
// 10. DELETED PLAYERS TRACKING & PLAYERS CRUD
// =============================================================
const STAT_SHORT_MAP: Record<string, string> = {
  goals: 'g',
  assists: 'a',
  matches: 'm',
  passes: 'p',
  saves: 's',
  cleansheets: 'c',
  tackles: 't',
  minutes: 'n',
  custom: 'u'
};

const STAT_LONG_MAP: Record<string, string> = {
  g: 'goals',
  a: 'assists',
  m: 'matches',
  p: 'passes',
  s: 'saves',
  c: 'cleansheets',
  t: 'tackles',
  n: 'minutes',
  u: 'custom'
};

function encodePlayerFilterMeta(player: PlayerData): string {
  let css = player.filter || 'none';
  if (typeof css === 'string' && css.startsWith('{')) {
    try {
      const parsed = JSON.parse(css);
      css = parsed.f || parsed.css || 'none';
    } catch {
      css = 'none';
    }
  }
  const isGK = (player.pos || '').toLowerCase().includes('gardien') || player.stat2lbl === 'Arrêts';
  const defaultStats = isGK ? ['saves', 'cleansheets', 'matches'] : ['goals', 'assists', 'matches'];
  const displayed = Array.isArray(player.displayed_stats) && player.displayed_stats.length > 0
    ? player.displayed_stats
    : defaultStats;
  const dCodes = displayed.map(s => STAT_SHORT_MAP[s] || s).join(',');
  const vals = [
    Number(player.passes) || 0,
    Number(player.saves) || 0,
    Number(player.cleansheets) || 0,
    Number(player.tackles) || 0,
    Number(player.minutes) || 0
  ];
  const baseObj: Record<string, any> = { f: css, d: dCodes, v: vals };
  if (player.custom_stat_label) {
    const withCustom = {
      ...baseObj,
      cl: String(player.custom_stat_label).slice(0, 18),
      cv: Number(player.custom_stat_val) || 0
    };
    const strWithCustom = JSON.stringify(withCustom);
    if (strWithCustom.length <= 100) {
      return strWithCustom;
    }
  }
  const compact = JSON.stringify(baseObj);
  return compact.length <= 100 ? compact : String(css).slice(0, 100);
}

function decodePlayerFilterMeta(rawFilter: any): { actualFilter: string; extraStats: Record<string, any> } {
  const extraStats: Record<string, any> = {};
  let actualFilter = typeof rawFilter === 'string' && rawFilter ? rawFilter : 'none';

  if (typeof actualFilter === 'string' && actualFilter.startsWith('{')) {
    try {
      const parsed = JSON.parse(actualFilter);
      actualFilter = parsed.f || parsed.css || 'none';
      if (typeof parsed.d === 'string' && parsed.d.length > 0) {
        extraStats.displayed_stats = parsed.d.split(',').map((code: string) => STAT_LONG_MAP[code] || code);
      } else if (Array.isArray(parsed.displayed_stats)) {
        extraStats.displayed_stats = parsed.displayed_stats;
      }
      if (Array.isArray(parsed.v)) {
        extraStats.passes = Number(parsed.v[0]) || 0;
        extraStats.saves = Number(parsed.v[1]) || 0;
        extraStats.cleansheets = Number(parsed.v[2]) || 0;
        extraStats.tackles = Number(parsed.v[3]) || 0;
        extraStats.minutes = Number(parsed.v[4]) || 0;
      } else {
        if (parsed.passes !== undefined) extraStats.passes = Number(parsed.passes) || 0;
        if (parsed.saves !== undefined) extraStats.saves = Number(parsed.saves) || 0;
        if (parsed.cleansheets !== undefined) extraStats.cleansheets = Number(parsed.cleansheets) || 0;
        if (parsed.tackles !== undefined) extraStats.tackles = Number(parsed.tackles) || 0;
        if (parsed.minutes !== undefined) extraStats.minutes = Number(parsed.minutes) || 0;
      }
      if (parsed.cl !== undefined) extraStats.custom_stat_label = parsed.cl;
      else if (parsed.custom_stat_label !== undefined) extraStats.custom_stat_label = parsed.custom_stat_label;
      if (parsed.cv !== undefined) extraStats.custom_stat_val = Number(parsed.cv) || 0;
      else if (parsed.custom_stat_val !== undefined) extraStats.custom_stat_val = Number(parsed.custom_stat_val) || 0;
    } catch {
      actualFilter = 'none';
    }
  }

  return { actualFilter, extraStats };
}

function sanitizePlayerCategories(rawCategories: any, primaryCategory?: string): { category: string; categories: string[] } {
  const isNotPremiere = (c: string) => Boolean(c) && !String(c).toLowerCase().includes('premi');
  const filtered = Array.isArray(rawCategories)
    ? rawCategories.map(String).filter(isNotPremiere)
    : [];
  const validPrimary = primaryCategory && isNotPremiere(primaryCategory) ? primaryCategory : '';
  const categories = Array.from(new Set(filtered.length > 0 ? filtered : [validPrimary || 'U17']));
  const category = validPrimary && categories.includes(validPrimary) ? validPrimary : categories[0];
  return { category, categories };
}

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
  if (!current.includes(id)) return;
  setLocalItem('deleted_player_ids', current.filter(x => x !== id));
  // Async cleanup in cloud
  try {
    supabase.from('site_content').select('id, data').limit(1).then(({ data: scData }) => {
      if (scData?.[0]?.data?.deleted_player_ids && Array.isArray(scData[0].data.deleted_player_ids)) {
        const filtered = scData[0].data.deleted_player_ids.filter((x: string) => String(x) !== String(id));
        const cleanData = { ...scData[0].data, deleted_player_ids: filtered };
        delete cleanData.data;
        supabase.from('site_content').update({
          data: cleanData
        }).eq('id', scData[0].id || 'main');
      }
    });
  } catch (e) {}
}

export async function fetchMergedPlayers(): Promise<Record<string, any>> {
  let deletedIds = new Set<string>(getDeletedPlayerIds());
  const merged: Record<string, any> = {};
  const priorLocalCache = getLocalItem<Record<string, any>>('players_custom', {});

  // 1. Fetch from Supabase in parallel (SOURCE OF TRUTH)
  let supabaseReachable = false;
  let supaRows: any[] = [];
  try {
    const [scRes, playersRes] = await Promise.all([
      supabase.from('site_content').select('data').limit(1),
      supabase.from('players').select('*')
    ]);

    if (!scRes.error && scRes.data) {
      const cloudDeleted = Array.isArray(scRes.data[0]?.data?.deleted_player_ids)
        ? scRes.data[0].data.deleted_player_ids.map(String)
        : [];
      deletedIds = new Set<string>(cloudDeleted);
      setLocalItem('deleted_player_ids', cloudDeleted);
    }

    if (!playersRes.error && playersRes.data && playersRes.data.length > 0) {
      supabaseReachable = true;
      supaRows = playersRes.data;
    }
  } catch (err) {
    console.warn('Supabase fetch players fallback to local', err);
  }

  // 2. Base from playersDB (excluding only confirmed deletedIds)
  for (const [id, player] of Object.entries(playersDB)) {
    const strId = String(id);
    if (!deletedIds.has(strId)) {
      const { category, categories } = sanitizePlayerCategories((player as any).categories, player.category);
      merged[strId] = {
        ...player,
        id: strId,
        category,
        categories
      };
    }
  }

  if (supabaseReachable) {
    const supaIds = new Set<string>();
    supaRows.forEach((player: any) => {
      const strId = String(player.id);
      supaIds.add(strId);
      if (!deletedIds.has(strId)) {
        const { actualFilter, extraStats } = decodePlayerFilterMeta(player.filter);
        const dbDefault = playersDB[strId];
        const rawCats = Array.isArray(player.categories) && player.categories.length > 0
          ? [...player.categories]
          : (player.category ? [player.category] : (dbDefault?.categories || ['U17']));
        const { category, categories } = sanitizePlayerCategories(rawCats, player.category || dbDefault?.category);

        merged[strId] = {
          ...(merged[strId] || {}),
          ...player,
          ...extraStats,
          id: strId,
           detailImg: player.detail_img || player.detailImg || player.img || merged[strId]?.detailImg || '/condor_logo_transparent.png',
          filter: actualFilter,
          category,
          categories,
          is_spotlight: Boolean(player.is_spotlight || player.spotlight)
        };
      } else {
        delete merged[strId];
      }
    });

    // Recover any unsynced custom players from priorLocalCache that failed to upload previously
    for (const [id, localP] of Object.entries(priorLocalCache)) {
      const strId = String(id);
      if (!deletedIds.has(strId) && !supaIds.has(strId) && localP && localP.name) {
        const { category, categories } = sanitizePlayerCategories(localP.categories, localP.category);
        const recovered = {
          ...(merged[strId] || {}),
          ...localP,
          id: strId,
          category,
          categories,
          is_spotlight: Boolean(localP.is_spotlight || localP.spotlight)
        };
        merged[strId] = recovered;
        // Background sync to Supabase
        savePlayerRecord(recovered).catch(() => {});
      }
    }

    setLocalItem('players_custom', merged);
    return merged;
  }

  // 3. Fallback ONLY if Supabase is offline/unreachable
  for (const [id, player] of Object.entries(priorLocalCache)) {
    const strId = String(id);
    if (!deletedIds.has(strId) && player) {
      const { category, categories } = sanitizePlayerCategories(
        player.categories || merged[strId]?.categories,
        player.category || merged[strId]?.category
      );
      merged[strId] = {
        ...(merged[strId] || {}),
        ...player,
        id: strId,
        category,
        categories,
        is_spotlight: Boolean(player.is_spotlight || player.spotlight || merged[strId]?.is_spotlight)
      };
    }
  }

  return merged;
}

export async function savePlayerRecord(player: PlayerData): Promise<{ success: boolean; error?: string }> {
  const strId = String(player.id);
  unmarkPlayerDeleted(strId);

  const { category: primaryCategory, categories } = sanitizePlayerCategories(player.categories, player.category);

  const fullPlayer: PlayerData = {
    ...player,
    id: strId,
    category: primaryCategory,
    categories: categories,
    detail_img: player.detail_img || player.detailImg || player.img || '/condor_logo_transparent.png',
    detailImg: player.detail_img || player.detailImg || player.img || '/condor_logo_transparent.png',
    is_spotlight: Boolean(player.is_spotlight || player.spotlight),
    spotlight: Boolean(player.is_spotlight || player.spotlight),
    matches: player.matches !== undefined ? Number(player.matches) : 0,
    goals: player.goals !== undefined ? Number(player.goals) : 0,
    assists: player.assists !== undefined ? Number(player.assists) : 0,
    stat2val: player.stat2val !== undefined ? Number(player.stat2val) : 0,
    honours1: player.honours1 !== undefined ? Number(player.honours1) : 0,
    honours2: player.honours2 !== undefined ? Number(player.honours2) : 0,
    displayed_stats: Array.isArray(player.displayed_stats) && player.displayed_stats.length > 0 
      ? player.displayed_stats 
      : (player.pos?.toLowerCase().includes('gardien') || player.stat2lbl === 'Arrêts' ? ['saves', 'cleansheets', 'matches'] : ['goals', 'assists', 'matches']),
    passes: player.passes !== undefined ? Number(player.passes) : 0,
    saves: player.saves !== undefined ? Number(player.saves) : 0,
    cleansheets: player.cleansheets !== undefined ? Number(player.cleansheets) : 0,
    tackles: player.tackles !== undefined ? Number(player.tackles) : 0,
    minutes: player.minutes !== undefined ? Number(player.minutes) : 0,
    custom_stat_label: player.custom_stat_label || '',
    custom_stat_val: player.custom_stat_val !== undefined ? Number(player.custom_stat_val) : 0
  };

  // Encode extra fields into compact filter string (<= 100 chars for VARCHAR(100) column)
  const filterMeta = encodePlayerFilterMeta(fullPlayer);
  const { actualFilter } = decodePlayerFilterMeta(fullPlayer.filter);
  fullPlayer.filter = actualFilter;

  const effectiveStat2Lbl = fullPlayer.custom_stat_label
    ? String(fullPlayer.custom_stat_label).slice(0, 100)
    : String(fullPlayer.stat2lbl || 'Buts').slice(0, 100);
  const effectiveStat2Val = fullPlayer.custom_stat_label
    ? (Number(fullPlayer.custom_stat_val) || 0)
    : (Number(fullPlayer.stat2val) || 0);

  // Exact database columns present in Supabase 'players' table (respecting VARCHAR limits)
  const dbPayload: Record<string, any> = {
    id: strId.slice(0, 50),
    name: String(fullPlayer.name || 'Joueur').slice(0, 255),
    pos: String(fullPlayer.pos || 'Joueur').slice(0, 100),
    num: Number(fullPlayer.num) || 0,
    img: fullPlayer.img || '/condor_logo_transparent.png',
    detail_img: fullPlayer.detail_img,
    filter: filterMeta,
    dob: String(fullPlayer.dob || '').slice(0, 50),
    category: String(primaryCategory || 'U17').slice(0, 100),
    categories: categories,
    height: fullPlayer.height ? String(fullPlayer.height).slice(0, 50) : null,
    weight: fullPlayer.weight ? String(fullPlayer.weight).slice(0, 50) : null,
    matches: fullPlayer.matches,
    goals: fullPlayer.goals,
    assists: fullPlayer.assists,
    stat2lbl: effectiveStat2Lbl,
    stat2val: effectiveStat2Val,
    pob: String(fullPlayer.pob || 'Port-au-Prince, Haïti').slice(0, 255),
    foot: String(fullPlayer.foot || 'Droit').slice(0, 50),
    nationality: String(fullPlayer.nationality || 'Haïtienne').slice(0, 100),
    bio: fullPlayer.bio || '',
    honours1: fullPlayer.honours1,
    honours2: fullPlayer.honours2,
    is_spotlight: fullPlayer.is_spotlight
  };

  try {
    let res = await supabase.from('players').upsert(dbPayload, { onConflict: 'id' });

    if (res?.error) {
      console.warn('Supabase save player notice, attempting fallback:', res.error.message);
      const retryPayload: Record<string, any> = {
        ...dbPayload,
        filter: String(actualFilter || 'none').slice(0, 50)
      };
      if (res.error.message?.includes('is_spotlight')) {
        delete retryPayload.is_spotlight;
      }
      if (res.error.message?.includes('categories')) {
        delete retryPayload.categories;
      }

      res = await supabase.from('players').upsert(retryPayload, { onConflict: 'id' });

      if (res?.error) {
        console.error('Supabase player update error:', res.error.message);
        return { success: false, error: res.error.message };
      }
    }

    // Update local cache on confirmed save
    const localCache = getLocalItem<Record<string, any>>('players_custom', {});
    localCache[strId] = fullPlayer;
    setLocalItem('players_custom', localCache);

    return { success: true };
  } catch (e: any) {
    console.error('Player save exception:', e);
    return { success: false, error: e.message || 'Erreur lors de la sauvegarde sur le serveur' };
  }
}

export async function restoreAllPlayers(): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    setLocalItem('deleted_player_ids', []);
    const { data: scData } = await supabase.from('site_content').select('id, data').limit(1);
    if (scData && scData.length > 0) {
      const cleanData = { ...(scData[0].data || {}) };
      delete cleanData.data;
      delete cleanData.deleted_player_ids;
      await supabase.from('site_content').update({ data: cleanData }).eq('id', scData[0].id || 'main');
    }

    const { data: supaPlayers } = await supabase.from('players').select('id');
    const existingIds = new Set((supaPlayers || []).map((p: any) => String(p.id)));

    for (const [id, dbP] of Object.entries(playersDB)) {
      const strId = String(id);
      if (!existingIds.has(strId)) {
        await savePlayerRecord({ ...(dbP as any), id: strId });
      }
    }

    const merged = await fetchMergedPlayers();
    return { success: true, count: Object.keys(merged).length };
  } catch (e: any) {
    return { success: false, count: 0, error: e.message };
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
    // 1. Delete row from players table in Supabase
    const { error } = await supabase.from('players').delete().eq('id', strId);
    if (error) {
      console.warn('Supabase delete player note:', error.message);
    }

    // 2. Persist deleted id to cloud site_content.data.deleted_player_ids
    const { data: scData } = await supabase.from('site_content').select('id, data').limit(1);
    const existingDeleted = Array.isArray(scData?.[0]?.data?.deleted_player_ids)
      ? scData![0].data.deleted_player_ids
      : [];
    if (!existingDeleted.includes(strId)) {
      const updatedDeleted = [...existingDeleted, strId];
      const cleanData = { ...(scData?.[0]?.data || {}), deleted_player_ids: updatedDeleted };
      delete cleanData.data;
      await supabase.from('site_content').update({
        data: cleanData
      }).eq('id', scData?.[0]?.id || 'main');
    }
  } catch (e: any) {
    console.warn('Supabase delete player fallback note', e);
  }

  return { success: true };
}

export async function addPlayerCategory(
  id: string,
  newUnit: string,
  existingPlayer?: any
): Promise<{ success: boolean }> {
  const strId = String(id);
  const player = existingPlayer || (await fetchMergedPlayers())[strId] || { id: strId };
  const currentCats: string[] = Array.isArray(player.categories) && player.categories.length > 0
    ? [...player.categories]
    : [player.category || 'U17'];

  if (!currentCats.includes(newUnit)) {
    currentCats.push(newUnit);
  }

  const updated: PlayerData = {
    ...player,
    id: strId,
    category: player.category || currentCats[0],
    categories: currentCats
  };
  return await savePlayerRecord(updated);
}

export async function removePlayerCategory(
  id: string,
  unitToRemove: string,
  existingPlayer?: any
): Promise<{ success: boolean; error?: string }> {
  const strId = String(id);
  const player = existingPlayer || (await fetchMergedPlayers())[strId] || { id: strId };
  let currentCats: string[] = Array.isArray(player.categories) && player.categories.length > 0
    ? [...player.categories]
    : [player.category || 'U17'];

  if (currentCats.length <= 1) {
    return { success: false, error: "Un joueur doit avoir au moins une unité." };
  }

  currentCats = currentCats.filter(c => c !== unitToRemove);
  const newPrimary = currentCats.includes(player.category) ? player.category : currentCats[0];

  const updated: PlayerData = {
    ...player,
    id: strId,
    category: newPrimary,
    categories: currentCats
  };
  return await savePlayerRecord(updated);
}

export async function setPlayerCategories(
  id: string,
  categories: string[],
  existingPlayer?: any
): Promise<{ success: boolean }> {
  const strId = String(id);
  const player = existingPlayer || (await fetchMergedPlayers())[strId] || { id: strId };
  const validCats = Array.from(new Set(categories.filter(Boolean)));
  if (validCats.length === 0) return { success: false };

  const newPrimary = validCats.includes(player.category) ? player.category : validCats[0];
  const updated: PlayerData = {
    ...player,
    id: strId,
    category: newPrimary,
    categories: validCats
  };
  return await savePlayerRecord(updated);
}

export async function transferPlayerCategory(
  id: string,
  newCategory: string,
  existingPlayer?: any
): Promise<{ success: boolean }> {
  const strId = String(id);
  const player = existingPlayer || (await fetchMergedPlayers())[strId] || { id: strId };

  const currentCats: string[] = Array.isArray(player.categories) && player.categories.length > 0
    ? [...player.categories]
    : [player.category || 'U17'];

  if (!currentCats.includes(newCategory)) {
    currentCats.unshift(newCategory);
  }

  const updated: PlayerData = {
    ...player,
    id: strId,
    category: newCategory,
    categories: currentCats
  };

  return await savePlayerRecord(updated);
}

// =============================================================
// 12. NEWS / ACTUALITÉS SERVICE
// =============================================================
export function isRealNews(item: any): boolean {
  if (!item || !item.title) return false;
  const t = (item.title || '').trim().toLowerCase();
  // Filter out dummy/template test news
  if (
    t.includes('décroche une victoire') || 
    t.includes('decroche une victoire') || 
    t.includes('nouvelle recrue officiellement') || 
    t.includes('arène') || 
    t.includes('arene')
  ) {
    return false;
  }
  return true;
}

export async function fetchNews(): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      const real = data.filter(isRealNews);
      setLocalItem('news_list', real);
      return real;
    }
  } catch (err) {
    console.warn('Supabase fetch news note', err);
  }

  const cached = getLocalItem<any[]>('news_list', []);
  return cached.filter(isRealNews);
}


