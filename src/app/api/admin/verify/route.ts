import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * Server-Side Admin Verification Endpoint
 * 
 * Verifies the user's Supabase JWT token and checks if their account has admin privileges.
 * Admin email(s) are resolved exclusively on the server (via process.env.ADMIN_EMAIL / ADMIN_EMAILS)
 * and are NEVER exposed to the client browser or bundled in frontend JavaScript.
 */
export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization') || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();

    if (!token) {
      return NextResponse.json({ isAdmin: false, error: 'Non authentifié' }, { status: 401 });
    }

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ isAdmin: false, error: 'Configuration serveur incomplète' }, { status: 500 });
    }

    // Cryptographically verify the session token with Supabase Auth
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user || !user.email) {
      return NextResponse.json({ isAdmin: false, error: 'Session non valide ou expirée' }, { status: 401 });
    }

    // Admin email(s) are read strictly server-side:
    const configuredAdmins = (process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || 'admin@gmail.com')
      .split(',')
      .map(e => e.trim().toLowerCase())
      .filter(Boolean);

    const userEmail = user.email.trim().toLowerCase();
    const isEmailAdmin = configuredAdmins.includes(userEmail);
    const isRoleAdmin = user.app_metadata?.role === 'admin' || user.user_metadata?.role === 'admin';

    if (isEmailAdmin || isRoleAdmin) {
      return NextResponse.json({ 
        isAdmin: true,
        user: {
          id: user.id
        }
      });
    }

    return NextResponse.json({ isAdmin: false, error: 'Accès non autorisé' }, { status: 403 });
  } catch {
    return NextResponse.json({ isAdmin: false, error: 'Erreur interne de vérification' }, { status: 500 });
  }
}

