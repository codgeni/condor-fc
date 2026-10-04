import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * 2026 Edge Security & Maintenance Middleware - Condor FC
 * 1. Blocage des attaques par traversée de répertoires (Path Traversal / LFI)
 * 2. Blocage des sondes automatisées et scanners de vulnérabilités (.env, .git, .php, etc.)
 * 3. Redirection canonique 301 & Désindexation des domaines temporaires (*.vercel.app)
 * 4. Mode Maintenance : Fermeture du site public avec redirection vers /maintenance pour tous les liens
 * 5. Protection de l'espace Admin : indexation des moteurs de recherche désactivée
 */
export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const decodedPath = decodeURIComponent(pathname).toLowerCase();
  const decodedSearch = decodeURIComponent(search).toLowerCase();

  // 1. Détection des attaques par traversée de répertoires (Path Traversal)
  const hasPathTraversal = 
    decodedPath.includes('..') || 
    decodedPath.includes('/etc/passwd') || 
    decodedPath.includes('\\..\\') ||
    decodedSearch.includes('..') || 
    decodedSearch.includes('%2e%2e');

  if (hasPathTraversal) {
    return new NextResponse('Blocked: Invalid request sequence.', { status: 400 });
  }

  // 2. Blocage des scanners de fichiers sensibles et d'extensions d'attaques
  const blockedExtensions = [
    '.env', '.git', '.sql', '.bak', '.config', '.ini',
    '.php', '.asp', '.aspx', '.jsp', '.cgi', '.sh', '.bash',
    'wp-login', 'xmlrpc', 'phpmyadmin', '.well-known/security.txt'
  ];

  const isMaliciousScan = blockedExtensions.some(ext => 
    decodedPath.includes(ext) || decodedSearch.includes(ext)
  );

  if (isMaliciousScan) {
    return new NextResponse('Forbidden: Access denied to protected or unsupported resource.', { 
      status: 403,
      headers: {
        'Content-Type': 'text/plain',
        'X-Content-Type-Options': 'nosniff'
      }
    });
  }

  // 3. Redirection canonique 301 & Désindexation des domaines temporaires Vercel (*.vercel.app)
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || request.nextUrl.hostname || '';
  if (host.includes('.vercel.app') || host.includes('condor-ecoledefootball.com')) {
    const targetDomain = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.condorecoledefootball.com';
    const redirectUrl = new URL(pathname + search, targetDomain);

    const redirectResponse = NextResponse.redirect(redirectUrl, 301);
    // Interdire expressément à Google d'indexer le sous-domaine vercel.app
    redirectResponse.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    return redirectResponse;
  }

  // 4. Gestion du Mode Maintenance
  // Le site est fermé au public car il est en cours de finalisation
  const isMaintenanceActive = true;

  // Gestion du bypass pour l'administrateur
  const previewParam = request.nextUrl.searchParams.get('preview');
  const lockParam = request.nextUrl.searchParams.get('lock');
  const hasBypassCookie = request.cookies.get('condor_bypass_maintenance')?.value === 'true';

  // Si l'administrateur demande à reverrouiller l'aperçu
  if (lockParam === 'true') {
    const response = NextResponse.redirect(new URL('/maintenance', request.url));
    response.cookies.delete('condor_bypass_maintenance');
    return response;
  }

  // Si l'administrateur utilise le code de prévisualisation ?preview=condor
  if (previewParam === 'condor' || previewParam === 'admin') {
    const cleanUrl = new URL(pathname, request.url);
    const response = NextResponse.redirect(cleanUrl);
    response.cookies.set('condor_bypass_maintenance', 'true', {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 jours
    });
    return response;
  }

  // Routes autorisées même en maintenance :
  // - /admin (Gestion par l'administrateur)
  // - /login (Connexion)
  // - /maintenance (Page d'information de maintenance)
  // - /api (Appels API)
  const isExcludedRoute = 
    pathname.startsWith('/admin') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/maintenance') ||
    pathname.startsWith('/api');

  if (isMaintenanceActive && !hasBypassCookie && !isExcludedRoute) {
    const maintenanceUrl = new URL('/maintenance', request.url);
    const maintenanceResponse = NextResponse.redirect(maintenanceUrl, 307);
    maintenanceResponse.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    return maintenanceResponse;
  }

  // 5. Traitement standard de la requête
  const response = NextResponse.next();

  // 6. Protection de l'espace Admin et de la maintenance : indexation désactivée
  if (pathname.startsWith('/admin') || pathname.startsWith('/maintenance')) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  }

  return response;
}

// Exclusion des fichiers statiques pour optimiser les performances
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with common extensions (.svg, .png, .jpg, .jpeg, .webp)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
