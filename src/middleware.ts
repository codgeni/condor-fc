import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * 2026 Edge Security Middleware - Condor FC
 * Intercepte et filtre les requêtes réseau au niveau de l'Edge avant tout traitement applicatif :
 * 1. Blocage des attaques par traversée de répertoires (Path Traversal / LFI)
 * 2. Blocage des sondes automatisées et scanners de vulnérabilités (.env, .git, .php, etc.)
 * 3. En-têtes de protection additionnels (X-Robots-Tag sur /admin, etc.)
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

  // 3. Traitement standard de la requête
  const response = NextResponse.next();

  // 4. Protection de l'espace Admin : indexation des moteurs de recherche désactivée
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
