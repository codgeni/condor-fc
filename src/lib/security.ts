/**
 * 2026 Web Security Utility Library - Condor FC
 * Assainissement d'entrées (Anti-XSS), validation stricte des téléversements (MIME & taille),
 * limitation de débit de soumission (Rate Limiting) et validation d'URL sécurisées.
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
 * Assainit une chaîne de caractères pour prévenir les attaques Cross-Site Scripting (XSS).
 * Neutralise les balises de scripts, les protocoles dangereux et les gestionnaires d'événements.
 */
export function sanitizeInput(input: unknown): string {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    // Supprimer les balises dangereuses courantes
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    // Supprimer les attributs d'événements HTML (onerror=, onload=, onclick=, etc.)
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
