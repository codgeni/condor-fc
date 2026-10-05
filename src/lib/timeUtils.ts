/**
 * Utilitaires de gestion et d'affichage des dates en temps réel (Français)
 * Calcule dynamiquement le temps écoulé (ex: "Il y a 2 heures", "Il y a 3 jours")
 * pour éviter les textes statiques bloqués sur "À l'instant".
 */

export function formatRelativeTime(dateInput: string | Date | number | undefined | null): string {
  if (!dateInput) return "Récemment";

  // Si c'est déjà une chaîne relative préformatée (ex: "Il y a 2 heures", "Il y a 3 jours")
  if (typeof dateInput === 'string' && (dateInput.startsWith('Il y a') || dateInput.includes('Hier'))) {
    return dateInput;
  }

  const date = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) {
    return typeof dateInput === 'string' ? dateInput : "Récemment";
  }

  const now = Date.now();
  const diffInSeconds = Math.floor((now - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "À l'instant";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `Il y a ${diffInMinutes} min`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `Il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) {
    return "Hier";
  }
  if (diffInDays < 7) {
    return `Il y a ${diffInDays} jours`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `Il y a ${diffInWeeks} semaine${diffInWeeks > 1 ? 's' : ''}`;
  }

  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

/**
 * Formate une date d'inscription certifiée avec date et heure
 */
export function formatFullDateTime(dateInput: string | Date | number | undefined | null): string {
  if (!dateInput) return "Date non renseignée";
  const date = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return String(dateInput);

  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }) + ' à ' + date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}
