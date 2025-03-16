import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Si l'URL est la racine, rediriger vers /accueil
  if (request.nextUrl.pathname === '/') {
    try {
      // Rediriger vers la page d'accueil alternative
      return NextResponse.redirect(new URL('/accueil', request.url));
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