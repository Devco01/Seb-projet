import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Liste des pages qui ne nécessitent pas d'authentification
const PUBLIC_PATHS = [
  '/static-login.html',
  '/api/login-static',
  '/api/auth/signin',
  '/api/auth/signout',
  '/api/auth/callback',
  '/api/auth/session',
  '/api/auth/csrf',
  '/api/auth/providers',
  '/auth/login',
  '/auth/connexion',
  '/auth/error'
];

// Fonction pour vérifier si un chemin est public
function isPublicPath(path: string) {
  return PUBLIC_PATHS.some(publicPath => 
    path === publicPath || 
    path.startsWith('/api/auth/callback/') || 
    path.startsWith('/_next/')
  );
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Si c'est un chemin public, on laisse passer la requête
  if (isPublicPath(path)) {
    return NextResponse.next();
  }
  
  // Vérifier si le cookie de session existe
  const sessionToken = request.cookies.get('next-auth.session-token');
  
  // Si le cookie existe, on laisse passer la requête
  if (sessionToken) {
    return NextResponse.next();
  }
  
  // Sinon, on redirige vers la page de connexion NextAuth
  const url = request.nextUrl.clone();
  url.pathname = '/auth/login';
  return NextResponse.redirect(url);
}

// Configuration pour appliquer le middleware uniquement à certains chemins
export const config = {
  matcher: [
    '/',
    '/devis/:path*',
    '/factures/:path*',
    '/clients/:path*',
    '/dashboard/:path*',
    '/tableaux-de-bord',
    '/parametres/:path*'
  ]
}; 