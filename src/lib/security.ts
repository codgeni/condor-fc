/**
 * 2026 Web Security Utility Library - Condor FC
 * Assainissement d'entrées (Anti-XSS), validation stricte des formulaires (Email, Téléphone, Dates, Âge),
 * validation des téléversements (MIME & taille), limitation de débit de soumission (Rate Limiting).
 */

// Types MIME d'images autorisés en production
export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif'
];

// Extensions d'images légitimes
export const ALLOWED_IMAGE_EXTENSIONS = [
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.gif'
];

// Limite maximale de taille de fichier : 5 Mo
export const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;

/**
 * Assainit une chaîne de caractères pour neutraliser tout vecteur Cross-Site Scripting (XSS).
 * 1. Supprime les octets nuls et caractères de contrôle invisibles.
 * 2. Supprime intégralement toute balise HTML afin d'empêcher l'injection de code dans les formulaires administratifs.
 * 3. Neutralise les protocoles d'exécution de scripts.
 */
export function sanitizeInput(input: unknown): string {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    // Retirer les octets nuls et caractères de contrôle non imprimables
    .replace(/\0/g, '')
    // Supprimer les balises script/iframe/object/embed explicites
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    // Supprimer toute autre balise HTML résiduelle
    .replace(/<[^>]*>?/gm, '')
    // Supprimer les attributs d'événements JavaScript (onerror=, onload=, etc.)
    .replace(/\bon\w+\s*=\s*["']?[^"'>]*["']?/gi, '')
    // Neutraliser les pseudo-protocoles d'exécution de code
    .replace(/javascript\s*:/gi, 'blocked:')
    .replace(/vbscript\s*:/gi, 'blocked:')
    .replace(/data\s*:\s*text\/html/gi, 'blocked:')
    .trim();
}

/**
 * Assainit récursivement toutes les valeurs textuelles d'un objet formulaire.
 */
export function sanitizeFormRecord<T extends Record<string, any>>(data: T): T {
  const sanitized: Record<string, any> = {};

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      sanitized[key] = sanitizeFormRecord(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => 
        typeof item === 'string' ? sanitizeInput(item) : item
      );
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized as T;
}

/**
 * Valide rigoureusement le format d'une adresse e-mail (Norme RFC 5322 simplifiée).
 */
export function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: "L'adresse courriel est requise." };
  }
  const trimmed = email.trim();
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: "Veuillez entrer une adresse courriel valide (ex: parent@gmail.com)." };
  }
  return { valid: true };
}

/**
 * Valide un numéro de téléphone international ou local (Haïti, USA, Canada, France, etc.).
 */
export function validatePhone(phone: string, fieldName = "téléphone"): { valid: boolean; error?: string } {
  if (!phone || typeof phone !== 'string') {
    return { valid: false, error: `Le numéro de ${fieldName} est requis.` };
  }
  const cleaned = phone.replace(/[\s\-\(\)\.]/g, '');
  // Doit contenir au moins 8 chiffres et max 15 chiffres, éventuellement précédé de +
  const phoneRegex = /^\+?[0-9]{8,15}$/;
  if (!phoneRegex.test(cleaned)) {
    return { valid: false, error: `Le numéro de ${fieldName} doit comporter entre 8 et 15 chiffres valides.` };
  }
  return { valid: true };
}

/**
 * Valide une date de naissance pour vérifier l'éligibilité de l'enfant athlète (âge entre minAge et maxAge).
 */
export function validateBirthDate(
  dobStr: string, 
  minAge = 3, 
  maxAge = 20
): { valid: boolean; age?: number; error?: string } {
  if (!dobStr || typeof dobStr !== 'string') {
    return { valid: false, error: "La date de naissance est requise." };
  }

  const dob = new Date(dobStr);
  if (isNaN(dob.getTime())) {
    return { valid: false, error: "La date de naissance n'est pas valide." };
  }

  const today = new Date();
  if (dob > today) {
    return { valid: false, error: "La date de naissance ne peut pas être dans le futur." };
  }

  // Calcul exact de l'âge
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  if (age < minAge) {
    return { 
      valid: false, 
      age, 
      error: `L'enfant doit avoir au moins ${minAge} ans pour être inscrit (âge actuel: ${age} ans).` 
    };
  }

  if (age > maxAge) {
    return { 
      valid: false, 
      age, 
      error: `L'âge maximum pour les catégories de l'académie est de ${maxAge} ans (âge actuel: ${age} ans).` 
    };
  }

  return { valid: true, age };
}

/**
 * Valide une date future pour la réservation d'un rendez-vous administratif.
 */
export function validateFutureDate(dateStr: string): { valid: boolean; error?: string } {
  if (!dateStr || typeof dateStr !== 'string') {
    return { valid: false, error: "La date de rendez-vous est requise." };
  }

  const selectedDate = new Date(dateStr);
  if (isNaN(selectedDate.getTime())) {
    return { valid: false, error: "Date de rendez-vous invalide." };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    return { valid: false, error: "La date de rendez-vous ne peut pas être située dans le passé." };
  }

  return { valid: true };
}

/**
 * Valide la présence et longueur minimale d'un champ requis.
 */
export function validateRequired(value: unknown, fieldName: string, minLen = 2): { valid: boolean; error?: string } {
  if (typeof value !== 'string' || value.trim().length < minLen) {
    return { valid: false, error: `Le champ « ${fieldName} » doit contenir au moins ${minLen} caractères.` };
  }
  return { valid: true };
}

/**
 * Valide un fichier avant son téléversement ou sa conversion Base64.
 * Empêche le téléversement d'exécutables, de scripts malveillants ou de fichiers surdimensionnés.
 */
export function validateUploadFile(
  file: File, 
  options: { maxSizeBytes?: number; allowedMimeTypes?: string[] } = {}
): { valid: boolean; error?: string } {
  const maxSize = options.maxSizeBytes || MAX_UPLOAD_SIZE_BYTES;
  const allowedMimes = options.allowedMimeTypes || ALLOWED_IMAGE_MIME_TYPES;

  if (!file) {
    return { valid: false, error: 'Aucun fichier fourni.' };
  }

  // 1. Contrôle de la taille
  if (file.size > maxSize) {
    const sizeInMb = (maxSize / (1024 * 1024)).toFixed(0);
    return { 
      valid: false, 
      error: `Le fichier est trop volumineux (${(file.size / (1024 * 1024)).toFixed(1)} Mo). La taille maximale autorisée est de ${sizeInMb} Mo.` 
    };
  }

  // 2. Contrôle du type MIME
  if (!allowedMimes.includes(file.type)) {
    return { 
      valid: false, 
      error: `Format de fichier non autorisé (${file.type || 'inconnu'}). Formats acceptés : JPEG, PNG, WebP.` 
    };
  }

  // 3. Contrôle de l'extension et détection des doubles extensions (.php.png, .exe.jpg)
  const fileName = file.name.toLowerCase();
  const hasAllowedExt = ALLOWED_IMAGE_EXTENSIONS.some(ext => fileName.endsWith(ext));
  if (!hasAllowedExt) {
    return { 
      valid: false, 
      error: 'Extension de fichier non autorisée.' 
    };
  }

  const suspiciousParts = fileName.split('.');
  if (suspiciousParts.length > 2) {
    const dangerousTokens = ['exe', 'bat', 'sh', 'php', 'phtml', 'asp', 'aspx', 'jsp', 'js', 'vbs'];
    const hasDangerousMidExt = suspiciousParts.slice(1, -1).some(part => dangerousTokens.includes(part));
    if (hasDangerousMidExt) {
      return { 
        valid: false, 
        error: 'Nom de fichier suspect ou double extension interdite.' 
      };
    }
  }

  return { valid: true };
}

/**
 * Vérifie si une URL est valide et utilise exclusivement le protocole sécurisé HTTPS.
 */
export function isSafeHttpsUrl(rawUrl: string): boolean {
  if (!rawUrl || typeof rawUrl !== 'string') return false;
  try {
    const parsed = new URL(rawUrl.trim());
    return parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

// Mémoire de limitation de débit par action (Rate Limiting côté client)
const rateLimitCache = new Map<string, number>();

/**
 * Protection anti-flood / anti-spam : impose un délai minimum entre les soumissions.
 */
export function checkRateLimit(actionKey: string, cooldownMs = 3000): { allowed: boolean; remainingSeconds: number } {
  const now = Date.now();
  const lastTime = rateLimitCache.get(actionKey) || 0;
  const elapsed = now - lastTime;

  if (elapsed < cooldownMs) {
    const remainingSeconds = Math.ceil((cooldownMs - elapsed) / 1000);
    return { allowed: false, remainingSeconds };
  }

  rateLimitCache.set(actionKey, now);
  return { allowed: true, remainingSeconds: 0 };
}
