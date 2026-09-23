import { supabase } from './supabaseClient';

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
  category: string;
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
}

// -------------------------------------------------------------
// Helper : YouTube Link Parser (converts any youtube link to embed & extracts thumbnail)
// -------------------------------------------------------------
export function parseVideoUrl(rawUrl: string): { embedUrl: string; thumbnail: string } {
  if (!rawUrl || typeof rawUrl !== 'string') return { embedUrl: '', thumbnail: '' };
  
  const trimmed = rawUrl.trim();
  
  // Rejeter formellement les protocoles dangereux (javascript:, data:, vbscript:)
  if (/^(javascript|vbscript|data):/i.test(trimmed)) {
    return { embedUrl: '', thumbnail: '' };
  }
  
  // Extraire l'identifiant YouTube (formats standards, shorts, mobile, embed)
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

  // Si c'est déjà une URL d'intégration, s'assurer qu'elle provient d'un domaine vidéo sécurisé en HTTPS
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
function getLocalItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const saved = localStorage.getItem(`condor_${key}`);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

function setLocalItem<T>(key: string, value: T): void {
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
      // Check if there is an existing match record
      const { data: existing } = await supabase.from('matches').select('id').limit(1);
      if (existing && existing.length > 0) {
        result = await supabase.from('matches').update(config).eq('id', existing[0].id).select();
      } else {
        result = await supabase.from('matches').insert(config).select();
      }
    }

    if (result.error) {
      console.warn('Supabase match save note:', result.error.message);
      return { success: true, data: config }; // Stored in local cache
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

    if (!error && data) {
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
    thumbnail: video.thumbnail || thumbnail
  };

  try {
    let res;
    if (video.id) {
      res = await supabase.from('videos').update(formattedVideo).eq('id', video.id);
    } else {
      res = await supabase.from('videos').insert(formattedVideo);
    }

    if (!res.error) {
      return { success: true };
    }
  } catch (e) {
    console.warn('Supabase save video note, stored in local cache', e);
  }

  // Local fallback
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

    if (!error && data) {
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

    if (!res.error) {
      return { success: true };
    }
  } catch (e) {
    console.warn('Supabase save stage note, stored in local cache', e);
  }

  // Local fallback
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

  return getLocalItem('products_list', []);
}

export async function saveProduct(product: ShopProduct): Promise<{ success: boolean; error?: string }> {
  const currentList = getLocalItem<ShopProduct[]>('products_list', []);
  const formattedProduct: ShopProduct = {
    ...product,
    formatted_price: product.formatted_price || `${product.price}.00 $`
  };

  try {
    let res;
    const { data: existing } = await supabase.from('products').select('id').eq('id', formattedProduct.id);
    if (existing && existing.length > 0) {
      res = await supabase.from('products').update(formattedProduct).eq('id', formattedProduct.id);
    } else {
      res = await supabase.from('products').insert(formattedProduct);
    }

    if (!res.error) {
      return { success: true };
    }
  } catch (e) {
    console.warn('Supabase save product note, stored in local cache', e);
  }

  // Local fallback
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

  const currentList = getLocalItem<ShopProduct[]>('products_list', []);
  setLocalItem('products_list', currentList.filter(p => p.id !== id));
  return { success: true };
}

// =============================================================
// 5. PLAYERS CRUD SERVICE
// =============================================================
export async function savePlayerRecord(player: PlayerData): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: existing } = await supabase.from('players').select('id').eq('id', player.id);
    let res;
    if (existing && existing.length > 0) {
      res = await supabase.from('players').update(player).eq('id', player.id);
    } else {
      res = await supabase.from('players').insert(player);
    }

    if (res.error) {
      return { success: false, error: res.error.message };
    }
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function deletePlayerRecord(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('players').delete().eq('id', id);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
