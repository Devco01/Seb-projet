// Middleware désactivé pour éviter les problèmes de redirection
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Si l'URL est la racine, rediriger vers /dashboard
  if (request.nextUrl.pathname === '/') {
    try {
      // Rediriger vers le dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } catch (error) {
      console.error('Erreur dans le middleware:', error);
      // En cas d'erreur, continuer normalement
      return NextResponse.next();
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/'],
}; 