import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * 2026 Edge Security & Performance Middleware - Condor FC
 * 1. Blocage des attaques par traversée de répertoires (Path Traversal / LFI)
 * 2. Blocage des sondes automatisées et scanners de vulnérabilités (.env, .git, .php, etc.)
 * 3. Redirection canonique 301 & Désindexation des domaines temporaires (*.vercel.app)
 * 4. Redirection automatique de l'ancienne page de maintenance vers la page d'accueil (Site en ligne)
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

  // 4. Gestion de la page de Maintenance (Site en ligne : redirection vers l'accueil)
  if (pathname.startsWith('/maintenance')) {
    return NextResponse.redirect(new URL('/', request.url), 302);
  }

  // Si d'anciens liens ou requêtes contiennent le paramètre preview ou lock, nettoyer l'URL
  const previewParam = request.nextUrl.searchParams.get('preview');
  const lockParam = request.nextUrl.searchParams.get('lock');
  if (previewParam || lockParam) {
    const cleanUrl = new URL(pathname, request.url);
    const response = NextResponse.redirect(cleanUrl);
    response.cookies.delete('condor_bypass_maintenance');
    return response;
  }

  // 5. Traitement standard de la requête
  const response = NextResponse.next();

  // 6. Protection de l'espace Admin : indexation désactivée
  if (pathname.startsWith('/admin')) {
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
